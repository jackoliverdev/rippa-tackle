import { NextApiRequest, NextApiResponse } from 'next';
import { vibeQuizService } from '@/lib/vibe-quiz-service';
import { createStream } from '@/lib/openai/openai';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Only allow GET requests for SSE
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Get query parameters
  const { conversationId, userMessage } = req.query;

  // Validate required parameters
  if (!conversationId || !userMessage) {
    return res.status(400).json({ error: 'Missing required parameters' });
  }
  
  // Set up headers for SSE
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache, no-transform');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no'); // Disable buffering for Nginx

  // Function to send data chunks
  const sendEvent = (data: any) => {
    res.write(`data: ${JSON.stringify(data)}\n\n`);
    // Use flush if available (for Node.js), but it's optional
    if ((res as any).flush) {
      (res as any).flush();
    }
  };

  try {
    // First, send an initial event to establish the connection
    sendEvent({ content: '', connecting: true });
    
    // Create a user message in the database
    await vibeQuizService.createMessage(
      conversationId as string,
      'user',
      userMessage as string
    );

    // Get conversation history and context for the AI
    const messages = await vibeQuizService.getMessages(conversationId as string);
    const instructions = await vibeQuizService.getInstructions();
    const questions = await vibeQuizService.getQuestions();
    const documents = await vibeQuizService.getDocuments();

    // Extract all instruction fields
    const primaryInstructions = instructions[0]?.instructions || '';
    const businessContext = instructions[0]?.context || '';
    const language = instructions[0]?.language || 'British English';
    const personality = instructions[0]?.personality || '';
    const avoid = instructions[0]?.avoid || '';

    // Sort questions by priority
    const sortedQuestions = [...questions].sort((a, b) => (a.priority ?? 999) - (b.priority ?? 999));
    
    // Find the opening question
    const openingQuestion = questions.find(q => q.question_type?.toLowerCase() === 'opening');
    
    // Fetch conditional responses for questions that have them
    const questionsWithConditionals = await Promise.all(
      questions.filter(q => q.conditional_response)
        .map(async q => {
          const conditionals = await vibeQuizService.getConditionalResponses(q.id);
          return { ...q, conditionalResponses: conditionals };
        })
    );

    // Create detailed question guidelines
    const questionGuidelines = sortedQuestions.map(q => {
      // Find if this question has conditional responses
      const questionWithConditionals = questionsWithConditionals.find(qwc => qwc.id === q.id);
      
      let questionInfo = `• ${q.question_text} (Priority: ${q.priority ?? 'N/A'}, Type: ${q.question_type || 'General'})`;
      
      // Add category if present
      if (q.category) {
        questionInfo += `\n  - Category: ${q.category}`;
      }
      
      // Add fallback response if present
      if (q.fallback_response) {
        questionInfo += `\n  - Default response: "${q.fallback_response}"`;
      }
      
      // Add conditional responses if present
      if (questionWithConditionals && questionWithConditionals.conditionalResponses?.length > 0) {
        questionInfo += '\n  - Conditional Responses:';
        questionWithConditionals.conditionalResponses.forEach(cr => {
          questionInfo += `\n    ▪ If user says anything like "${cr.conditional_trigger}", respond with: "${cr.conditional_response}"`;
        });
      }
      
      return questionInfo;
    }).join('\n\n');

    // Create a structured system prompt
    const systemPrompt = `
# ROLE AND OBJECTIVE
You are an AI assistant conducting the Vibe Quiz conversation.

# PRIMARY INSTRUCTIONS
${primaryInstructions}

# BUSINESS CONTEXT
${businessContext}

# COMMUNICATION STYLE
- Use ${language} for all responses
- Adopt a ${personality} tone throughout the conversation
- Avoid: ${avoid}

# CONVERSATION STRUCTURE
1. The conversation begins with: "${openingQuestion?.question_text || 'Introduction question'}"
2. Your job is to have a natural conversation while collecting insights through questions
3. Address the user's responses directly and naturally before moving to the next question
4. Ask only one question at a time and wait for the user to respond
5. Choose questions based on priority order, context, and what makes sense in the flow

# QUESTION GUIDELINES
${questionGuidelines}

# CONDITIONAL RESPONSE INSTRUCTIONS
- When you see specific keywords in user messages, check if they match any triggers
- If a trigger is matched, respond with the corresponding conditional response
- Always prioritize natural conversation - don't force using conditionals if they don't fit
- If no conditional responses are triggered, use the default responses or your own helpful response

# REFERENCE MATERIALS
${documents.map(doc => `## ${doc.title}\n${doc.description || 'No description provided'}`).join('\n\n')}
`.trim();

    // Create a context for the current conversation
    let conversationContext = '';
    if (messages.length > 0) {
      // Extract conversation history highlights
      const firstUserMessage = messages.find(m => m.role === 'user');
      const lastAssistantMessage = [...messages].reverse().find(m => m.role === 'assistant');
      
      conversationContext = `# CONVERSATION PROGRESS\n`;
      
      if (firstUserMessage && openingQuestion) {
        conversationContext += `- The conversation started with: "${openingQuestion.question_text}"\n`;
        conversationContext += `- The user's first response was: "${firstUserMessage.content}"\n`;
      }
      
      if (lastAssistantMessage) {
        conversationContext += `- Your last message was: "${lastAssistantMessage.content}"\n`;
      }
      
      // Identify what questions have been asked
      const assistantMessages = messages.filter(m => m.role === 'assistant');
      const askedQuestions = questions.filter(q => 
        assistantMessages.some(m => m.content.includes(q.question_text))
      );
      
      if (askedQuestions.length > 0) {
        conversationContext += `- Questions you've already asked:\n`;
        askedQuestions.forEach(q => {
          conversationContext += `  • ${q.question_text}\n`;
        });
      }
      
      // Identify questions not yet asked, sorted by priority
      const unansweredQuestions = sortedQuestions
        .filter(q => !askedQuestions.some(aq => aq.id === q.id))
        .sort((a, b) => (a.priority ?? 999) - (b.priority ?? 999));
      
      if (unansweredQuestions.length > 0) {
        conversationContext += `- Questions you should ask next (in priority order):\n`;
        unansweredQuestions.slice(0, 3).forEach(q => {
          conversationContext += `  • ${q.question_text}\n`;
        });
      }
      
      conversationContext += `\n- The conversation has had ${messages.length} messages so far.\n`;
      conversationContext += `- Continue the natural conversation, guiding it toward your next priority question.\n`;
    }

    // Set up stream from OpenAI
    const stream = await createStream({
      model: 'gpt-4.1',
      stream: true,
      input: [
        // Primary system prompt
        { role: 'system', content: systemPrompt },
        
        // Add context about the current conversation
        { role: 'system', content: conversationContext },
        
        // Add conversation history
        ...messages.map(m => ({ role: m.role, content: m.content })),
        
        // Current user message - already added to messages array
      ],
      temperature: 0.5
    });

    let fullResponse = '';

    // Process the stream - handle different event types
    stream.on('event', (event: any) => {
      console.log('Stream event:', event.type);
      
      // Check for different event types that might contain content
      if (event.type === 'message' || event.type === 'content' || event.type === 'chunk') {
        const content = event.content || event.text || event.data?.text || event.data?.content || '';
        if (content) {
          sendEvent({ content });
          fullResponse += content;
        }
      } else if (event.type === 'response.output_text.delta') {
        // Handle text deltas from the new OpenAI streaming format
        const delta = event.delta || '';
        if (delta) {
          sendEvent({ content: delta });
          fullResponse += delta;
        }
      }
    });

    // Handle end of stream
    stream.on('end', async () => {
      console.log('Stream ended, saving message:', fullResponse);
      
      // Save the AI response to the database
      if (fullResponse) {
        await vibeQuizService.createMessage(
          conversationId as string,
          'assistant',
          fullResponse
        );
      }
      
      // Send completion event
      sendEvent({ done: true });
      res.end();
    });

    // Handle stream errors
    stream.on('error', (error) => {
      console.error('Stream error:', error);
      sendEvent({ error: 'An error occurred' });
      res.end();
    });

  } catch (error) {
    console.error('Error in stream handler:', error);
    sendEvent({ error: 'Failed to generate response' });
    res.end();
  }
} 