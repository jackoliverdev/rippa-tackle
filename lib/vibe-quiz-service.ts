import { supabase } from '@/lib/supabase';
import { openAIService } from './openai/openai-service';
import { 
  VibeQuizConversation, 
  VibeQuizMessage, 
  VibeQuizHistory,
  AdminVibeQuizInstructions,
  AdminVibeQuizQuestion,
  AdminVibeQuizConditionalResponse,
  AdminVibeQuizDocument
} from './types';

export class VibeQuizService {
  // Conversations
  async createConversation(userId: string): Promise<VibeQuizConversation> {
    const { data, error } = await supabase
      .from('vibe_quiz_conversations')
      .insert({
        user_id: userId,
        status: 'active'
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async getConversation(id: string): Promise<VibeQuizConversation> {
    const { data, error } = await supabase
      .from('vibe_quiz_conversations')
      .select()
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }

  async updateConversation(id: string, updates: Partial<VibeQuizConversation>): Promise<VibeQuizConversation> {
    const { data, error } = await supabase
      .from('vibe_quiz_conversations')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Messages
  async createMessage(conversationId: string, role: 'user' | 'assistant', content: string): Promise<VibeQuizMessage> {
    const { data, error } = await supabase
      .from('vibe_quiz_messages')
      .insert({
        conversation_id: conversationId,
        role,
        content
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async getMessages(conversationId: string): Promise<VibeQuizMessage[]> {
    const { data, error } = await supabase
      .from('vibe_quiz_messages')
      .select()
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true });

    if (error) throw error;
    return data;
  }

  // History
  async createHistoryEntry(
    conversationId: string,
    messageId: string,
    role: 'user' | 'assistant',
    content: string
  ): Promise<VibeQuizHistory> {
    const { data, error } = await supabase
      .from('vibe_quiz_history')
      .insert({
        conversation_id: conversationId,
        message_id: messageId,
        role,
        content
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Admin Instructions
  async getInstructions(): Promise<AdminVibeQuizInstructions[]> {
    const { data, error } = await supabase
      .from('admin_vibe_quiz_instructions')
      .select()
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  // Questions
  async getQuestions(): Promise<AdminVibeQuizQuestion[]> {
    const { data, error } = await supabase
      .from('admin_vibe_quiz_questions')
      .select()
      .order('priority', { ascending: true });

    if (error) throw error;
    return data;
  }

  // Conditional Responses
  async getConditionalResponses(questionId: string): Promise<AdminVibeQuizConditionalResponse[]> {
    const { data, error } = await supabase
      .from('admin_vibe_quiz_questions_conditional_responses')
      .select()
      .eq('question_id', questionId)
      .order('created_at', { ascending: true });

    if (error) throw error;
    return data;
  }

  // Documents
  async getDocuments(): Promise<AdminVibeQuizDocument[]> {
    const { data, error } = await supabase
      .from('admin_vibe_quiz_documents')
      .select()
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  }

  // OpenAI Integration
  async generateAIResponse(conversationId: string, userMessage: string): Promise<string> {
    const messages = await this.getMessages(conversationId);
    const instructions = await this.getInstructions();
    const questions = await this.getQuestions();
    const documents = await this.getDocuments();

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
          const conditionals = await this.getConditionalResponses(q.id);
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
    
    // Add detailed logging
    console.log('--- VibeQuizService.generateAIResponse ---');
    console.log('systemPrompt:', systemPrompt);
    console.log('conversationContext:', conversationContext);
    console.log('messages:', messages);
    console.log('userMessage:', userMessage);

    try {
      const response = await openAIService.createResponse({
        model: 'gpt-4.1',
        input: [
          // Primary system prompt
          { role: 'system', content: systemPrompt },
          
          // Add context about the current conversation
          { role: 'system', content: conversationContext },
          
          // Add conversation history
          ...messages.map(m => ({ role: m.role, content: m.content })),
          
          // Current user message
          { role: 'user', content: userMessage }
        ],
        temperature: 0.5
      });
      console.log('OpenAI response:', response);
      return response.output_text;
    } catch (error) {
      console.error('OpenAI error in generateAIResponse:', error);
      throw error;
    }
  }
}

// Export a singleton instance
export const vibeQuizService = new VibeQuizService(); 