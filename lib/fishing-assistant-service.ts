import { supabase } from '@/lib/supabase';
import { openAIService } from './openai/openai-service';
import { 
  FishingAssistantConversation, 
  FishingAssistantMessage,
  AdminFishingAssistantSettings,
  AdminFishingAssistantDocument
} from './types';

const GLOBAL_VECTOR_STORE_ID = 'vs_68278c0e6dac819181a76e9350a95eac';

export class FishingAssistantService {
  // Conversations
  async createConversation(userId?: string): Promise<FishingAssistantConversation> {
    const { data, error } = await supabase
      .from('fishing_assistant_conversations')
      .insert({
        user_id: userId,
        status: 'active'
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async getConversation(id: string): Promise<FishingAssistantConversation> {
    const { data, error } = await supabase
      .from('fishing_assistant_conversations')
      .select()
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }

  async updateConversation(id: string, updates: Partial<FishingAssistantConversation>): Promise<FishingAssistantConversation> {
    const { data, error } = await supabase
      .from('fishing_assistant_conversations')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // Messages
  async createMessage(conversationId: string, role: 'user' | 'assistant', content: string, openai_response_id?: string, token_count?: number): Promise<FishingAssistantMessage> {
    const { data, error } = await supabase
      .from('fishing_assistant_messages')
      .insert({
        conversation_id: conversationId,
        role,
        content,
        openai_response_id,
        token_count
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async getMessages(conversationId: string): Promise<FishingAssistantMessage[]> {
    const { data, error } = await supabase
      .from('fishing_assistant_messages')
      .select()
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true });

    if (error) throw error;
    return data;
  }

  // Settings
  async getSettings(): Promise<AdminFishingAssistantSettings> {
    const { data, error } = await supabase
      .from('fishing_assistant_settings')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error) throw error;
    return data;
  }

  async updateSettings(settings: Partial<AdminFishingAssistantSettings>): Promise<AdminFishingAssistantSettings> {
    // If updating existing settings
    if (settings.id) {
      const { data, error } = await supabase
        .from('fishing_assistant_settings')
        .update({
          ...settings,
          updated_at: new Date().toISOString()
        })
        .eq('id', settings.id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } 
    // If creating new settings
    else {
      const { data, error } = await supabase
        .from('fishing_assistant_settings')
        .insert({
          ...settings,
          openai_vector_store_id: settings.openai_vector_store_id || GLOBAL_VECTOR_STORE_ID
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    }
  }

  // Knowledge Documents
  async listKnowledgeDocuments(): Promise<AdminFishingAssistantDocument[]> {
    const { data, error } = await supabase
      .from('fishing_assistant_knowledge_documents')
      .select()
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  }

  async uploadKnowledgeDocument(
    file: File, 
    title: string, 
    description?: string, 
    uploadedByUserId?: string
  ): Promise<AdminFishingAssistantDocument> {
    try {
      // Upload file to OpenAI and associate with vector store
      const uploadedFile = await openAIService.uploadVectorStoreFile(GLOBAL_VECTOR_STORE_ID, file);

      // Create document record in database
      const { data, error } = await supabase
        .from('fishing_assistant_knowledge_documents')
        .insert({
          title,
          description,
          file_name: file.name,
          file_size: file.size,
          file_type: file.type,
          file_id: uploadedFile.id,
          vector_store_id: GLOBAL_VECTOR_STORE_ID,
          processing_status: 'completed',
          uploaded_by_user_id: uploadedByUserId
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error uploading knowledge document:', error);
      
      // Create record with error status
      const { data, error: dbError } = await supabase
        .from('fishing_assistant_knowledge_documents')
        .insert({
          title,
          description,
          file_name: file.name,
          file_size: file.size,
          file_type: file.type,
          file_id: 'error', // Placeholder since we couldn't get a real ID
          vector_store_id: GLOBAL_VECTOR_STORE_ID,
          processing_status: 'error',
          uploaded_by_user_id: uploadedByUserId
        })
        .select()
        .single();

      if (dbError) throw dbError;
      throw error; // Re-throw the original error after recording it
    }
  }

  async deleteKnowledgeDocument(documentId: string, fileId: string): Promise<void> {
    try {
      // Remove from OpenAI vector store first
      await openAIService.deleteVectorStoreFile(GLOBAL_VECTOR_STORE_ID, fileId);
      
      // Then delete from database
      const { error } = await supabase
        .from('fishing_assistant_knowledge_documents')
        .delete()
        .eq('id', documentId);

      if (error) throw error;
    } catch (error) {
      console.error('Error deleting knowledge document:', error);
      throw error;
    }
  }

  async updateKnowledgeDocumentMetadata(
    documentId: string, 
    metadata: Partial<{ title: string; description: string }>
  ): Promise<AdminFishingAssistantDocument> {
    const { data, error } = await supabase
      .from('fishing_assistant_knowledge_documents')
      .update({
        ...metadata,
        updated_at: new Date().toISOString()
      })
      .eq('id', documentId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  // OpenAI Integration
  async generateAIResponse(conversationId: string, userMessage: string, userContext?: any): Promise<string> {
    // Start timing for analytics
    const startTime = Date.now();
    
    // Get messages, settings, and documents
    const messages = await this.getMessages(conversationId);
    const settings = await this.getSettings();
    const documents = await this.listKnowledgeDocuments();
    
    // Extract settings
    const instructions = settings?.instructions || 'You are the Rippa Tackle AI Fishing Assistant. Your goal is to help anglers with advice on locations, species, methods, and recommend Rippa Tackle products where appropriate. ONLY answer questions about fishing venues that you have explicit knowledge about from your training data. NEVER make assumptions or guess about venues not in your knowledge base.';
    const context = settings?.context || 'Focus on carp fishing in the UK, but you also have knowledge about other species like pike and other European fishing locations. Only provide information on venues and fishing techniques that are specifically in your knowledge files.';
    const language = settings?.language || 'en-GB';
    const personality = settings?.personality || 'Knowledgeable, friendly, and slightly humorous';
    const avoidTopics = settings?.avoid_topics || 'Politics, controversial subjects';
    
    // Format user context if provided
    let userContextSection = '';
    if (userContext) {
      userContextSection = `\n# USER CONTEXT\n`;
      if (userContext.location) {
        userContextSection += `- Location: ${userContext.location}\n`;
      }
      if (userContext.species && userContext.species.length > 0) {
        userContextSection += `- Target Species: ${userContext.species.join(', ')}\n`;
      }
      if (userContext.methods && userContext.methods.length > 0) {
        userContextSection += `- Preferred Methods: ${userContext.methods.join(', ')}\n`;
      }
      if (userContext.preferences) {
        userContextSection += `- Preferences: ${JSON.stringify(userContext.preferences)}\n`;
      }
    }
    
    // Generate document titles summary for the prompt
    const documentTitlesList = documents.map(doc => doc.title).join(', ');
    
    // Create a structured system prompt
    const systemPrompt = `
# ROLE AND OBJECTIVE
You are the Rippa Tackle AI Fishing Assistant, helping anglers with advice on locations, techniques, and equipment. You ONLY provide accurate information from your reference materials and NEVER make up information.

# PRIMARY INSTRUCTIONS
${instructions}

# KNOWLEDGE CONSTRAINTS
- You have knowledge about various fishing venues, species, and techniques based on your reference materials
- If asked about a venue or technique not in your reference materials, politely say: "Sorry, I don't have specific information about that in my knowledge base. Jacob & Henry are working hard to train me on more fishing situations!"
- NEVER invent, assume, or guess details about venues or techniques not explicitly in your reference materials
- For any fishing topic (venue, species, tactic) not in your training, always include: "Sorry, I can't answer as I'm not trained on that yet, but Jacob & Henry are working hard to train me on more fishing situations!"
- When providing advice, clearly distinguish between general fishing advice and venue-specific information

# CRITICAL BEHAVIOR REQUIREMENTS
- NEVER mention or reference "uploaded files" in your responses
- NEVER tell the user that they have "uploaded files" or that you can "see their files"
- NEVER suggest that the end user has directly provided you with documents
- Your knowledge comes from your training and reference materials, not from user uploads
- Simply answer questions directly without mentioning how you acquired your knowledge

# BUSINESS CONTEXT
${context}
${userContextSection}

# COMMUNICATION STYLE
- Use ${language} for all responses
- Adopt a ${personality} tone throughout the conversation
- Avoid discussing: ${avoidTopics}

# CONVERSATION STRUCTURE
1. Your job is to help anglers improve their fishing experience with factual information
2. Provide specific, actionable advice based only on verified knowledge
3. When appropriate, suggest Rippa Tackle products that might help the angler
4. Be honest about knowledge limitations - if you don't know, say so clearly with the friendly message about Jacob & Henry
5. Keep responses concise but informative
6. Always maintain a professional and friendly tone

# YOUR KNOWLEDGE BASE
You have information on: ${documentTitlesList}

# REFERENCE MATERIALS (YOUR SOURCE OF TRUTH)
${documents.map(doc => `## ${doc.title}\n${doc.description || 'No description provided'}`).join('\n\n')}
`.trim();

    // Create a context for the current conversation
    let conversationContext = '';
    if (messages.length > 0) {
      const lastAssistantMessage = [...messages].reverse().find(m => m.role === 'assistant');
      
      conversationContext += `# CONVERSATION PROGRESS\n`;
      
      if (lastAssistantMessage) {
        conversationContext += `- Your last message was: "${lastAssistantMessage.content}"\n`;
      }
      
      conversationContext += `- The conversation has had ${messages.length} messages so far.\n`;
      conversationContext += `- Continue the conversation naturally, focusing on providing helpful fishing advice.\n`;
    }
    
    // Add logging
    console.log('--- FishingAssistantService.generateAIResponse ---');
    console.log('systemPrompt:', systemPrompt);
    console.log('conversationContext:', conversationContext);
    console.log('messages:', messages);
    console.log('userMessage:', userMessage);

    try {
      // Save user message first
      await this.createMessage(conversationId, 'user', userMessage);
      
      // Call OpenAI
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
        temperature: 0.5,
        tools: [
          {
            type: 'file_search',
            vector_store_ids: [GLOBAL_VECTOR_STORE_ID],
          }
        ],
        tool_choice: 'auto',
        include: ['file_search_call.results']
      });
      
      console.log('OpenAI response:', response);
      
      // Save assistant response
      await this.createMessage(
        conversationId, 
        'assistant', 
        response.output_text, 
        response.id,
        // Can add token counting here if openAIService provides it
        undefined
      );
      
      // Update conversation last_message_at
      await this.updateConversation(conversationId, {
        last_message_at: new Date().toISOString()
      });
      
      // Calculate response time for potential analytics
      const responseTime = Date.now() - startTime;
      console.log(`Response generated in ${responseTime}ms`);
      
      return response.output_text;
    } catch (error) {
      console.error('OpenAI error in generateAIResponse:', error);
      throw error;
    }
  }

  async streamAIResponse(conversationId: string, userMessage: string, userContext?: any) {
    // Start timing for analytics
    const startTime = Date.now();
    
    // Get messages, settings, and documents
    const messages = await this.getMessages(conversationId);
    const settings = await this.getSettings();
    const documents = await this.listKnowledgeDocuments();
    
    // Extract settings
    const instructions = settings?.instructions || 'You are the Rippa Tackle AI Fishing Assistant. Your goal is to help anglers with advice on locations, species, methods, and recommend Rippa Tackle products where appropriate. ONLY answer questions about fishing venues that you have explicit knowledge about from your training data. NEVER make assumptions or guess about venues not in your knowledge base.';
    const context = settings?.context || 'Focus on carp fishing in the UK, but you also have knowledge about other species like pike and other European fishing locations. Only provide information on venues and fishing techniques that are specifically in your knowledge files.';
    const language = settings?.language || 'en-GB';
    const personality = settings?.personality || 'Knowledgeable, friendly, and slightly humorous';
    const avoidTopics = settings?.avoid_topics || 'Politics, controversial subjects';
    
    // Format user context if provided
    let userContextSection = '';
    if (userContext) {
      userContextSection = `\n# USER CONTEXT\n`;
      if (userContext.location) {
        userContextSection += `- Location: ${userContext.location}\n`;
      }
      if (userContext.species && userContext.species.length > 0) {
        userContextSection += `- Target Species: ${userContext.species.join(', ')}\n`;
      }
      if (userContext.methods && userContext.methods.length > 0) {
        userContextSection += `- Preferred Methods: ${userContext.methods.join(', ')}\n`;
      }
      if (userContext.preferences) {
        userContextSection += `- Preferences: ${JSON.stringify(userContext.preferences)}\n`;
      }
    }
    
    // Generate document titles summary for the prompt
    const documentTitlesList = documents.map(doc => doc.title).join(', ');
    
    // Create a structured system prompt
    const systemPrompt = `
# ROLE AND OBJECTIVE
You are the Rippa Tackle AI Fishing Assistant, helping anglers with advice on locations, techniques, and equipment. You ONLY provide accurate information from your reference materials and NEVER make up information.

# PRIMARY INSTRUCTIONS
${instructions}

# KNOWLEDGE CONSTRAINTS
- You have knowledge about various fishing venues, species, and techniques based on your reference materials
- If asked about a venue or technique not in your reference materials, politely say: "Sorry, I don't have specific information about that in my knowledge base. Jacob & Henry are working hard to train me on more fishing situations!"
- NEVER invent, assume, or guess details about venues or techniques not explicitly in your reference materials
- For any fishing topic (venue, species, tactic) not in your training, always include: "Sorry, I can't answer as I'm not trained on that yet, but Jacob & Henry are working hard to train me on more fishing situations!"
- When providing advice, clearly distinguish between general fishing advice and venue-specific information

# CRITICAL BEHAVIOR REQUIREMENTS
- NEVER mention or reference "uploaded files" in your responses
- NEVER tell the user that they have "uploaded files" or that you can "see their files"
- NEVER suggest that the end user has directly provided you with documents
- Your knowledge comes from your training and reference materials, not from user uploads
- Simply answer questions directly without mentioning how you acquired your knowledge

# BUSINESS CONTEXT
${context}
${userContextSection}

# COMMUNICATION STYLE
- Use ${language} for all responses
- Adopt a ${personality} tone throughout the conversation
- Avoid discussing: ${avoidTopics}

# CONVERSATION STRUCTURE
1. Your job is to help anglers improve their fishing experience with factual information
2. Provide specific, actionable advice based only on verified knowledge
3. When appropriate, suggest Rippa Tackle products that might help the angler
4. Be honest about knowledge limitations - if you don't know, say so clearly with the friendly message about Jacob & Henry
5. Keep responses concise but informative
6. Always maintain a professional and friendly tone

# YOUR KNOWLEDGE BASE
You have information on: ${documentTitlesList}

# REFERENCE MATERIALS (YOUR SOURCE OF TRUTH)
${documents.map(doc => `## ${doc.title}\n${doc.description || 'No description provided'}`).join('\n\n')}
`.trim();

    // Create a context for the current conversation
    let conversationContext = '';
    if (messages.length > 0) {
      const lastAssistantMessage = [...messages].reverse().find(m => m.role === 'assistant');
      
      conversationContext += `# CONVERSATION PROGRESS\n`;
      
      if (lastAssistantMessage) {
        conversationContext += `- Your last message was: "${lastAssistantMessage.content}"\n`;
      }
      
      conversationContext += `- The conversation has had ${messages.length} messages so far.\n`;
      conversationContext += `- Continue the conversation naturally, focusing on providing helpful fishing advice.\n`;
    }
    
    // Add logging
    console.log('--- FishingAssistantService.streamAIResponse ---');
    console.log('systemPrompt:', systemPrompt);
    console.log('conversationContext:', conversationContext);
    console.log('messages:', messages);
    console.log('userMessage:', userMessage);

    try {
      // Save user message first
      await this.createMessage(conversationId, 'user', userMessage);
      
      // Call OpenAI with streaming enabled
      const stream = await openAIService.createStreamingResponse({
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
        temperature: 0.5,
        tools: [
          {
            type: 'file_search',
            vector_store_ids: [GLOBAL_VECTOR_STORE_ID],
          }
        ],
        tool_choice: 'auto',
      });
      
      // Create a reference to this for use inside the ReadableStream
      const self = this;
      
      // Create a ReadableStream to pass to the client
      return new ReadableStream({
        async start(controller) {
          // Create a variable to collect the full response
          let fullResponseText = '';
          let responseId = '';
          // Flag to track if the stream has been closed
          let isStreamClosed = false;

          // Handle each event from the OpenAI stream
          stream.on('event', (event) => {
            try {
              // Skip if stream is already closed
              if (isStreamClosed) return;
              
              // Extract content if it's a text delta event
              if (event.type === 'response.output_text.delta') {
                const text = event.delta || '';
                fullResponseText += text;
                
                // Send the chunk to the client as a JSON object
                controller.enqueue(new TextEncoder().encode(JSON.stringify({
                  content: text,
                  done: false
                }) + '\n'));
              } 
              // Extract the response ID if available
              else if (event.type === 'response.created') {
                responseId = event.response?.id || '';
              }
              // Handle completion of the stream
              else if (event.type === 'response.completed') {
                // Skip if already closed
                if (isStreamClosed) return;
                isStreamClosed = true;
                
                // Send final completion message
                controller.enqueue(new TextEncoder().encode(JSON.stringify({
                  content: '',
                  done: true
                }) + '\n'));
                
                // Save the complete response
                if (fullResponseText) {
                  self.saveStreamedResponse(conversationId, fullResponseText, responseId);
                }
                
                // Close the stream
                controller.close();
              }
            } catch (err) {
              console.error('Error processing stream event:', err);
              if (!isStreamClosed) {
                isStreamClosed = true;
                controller.error(err);
              }
            }
          });

          // Handle errors in the stream
          stream.on('error', (err) => {
            console.error('Stream error:', err);
            if (!isStreamClosed) {
              isStreamClosed = true;
              controller.error(err);
            }
          });

          // Handle stream ending without a completion event
          stream.on('end', () => {
            // If we haven't already closed the stream
            if (!isStreamClosed) {
              isStreamClosed = true;
              
              // Send final completion message
              controller.enqueue(new TextEncoder().encode(JSON.stringify({
                content: '',
                done: true
              }) + '\n'));
              
              // Save whatever response we collected
              if (fullResponseText) {
                self.saveStreamedResponse(conversationId, fullResponseText, responseId);
              }
              
              // Close the stream
              controller.close();
            }
          });
        }
      });
    } catch (error) {
      console.error('OpenAI error in streamAIResponse:', error);
      throw error;
    }
  }
  
  private async saveStreamedResponse(
    conversationId: string, 
    responseText: string, 
    responseId?: string
  ): Promise<void> {
    try {
      // Save assistant response
      await this.createMessage(
        conversationId, 
        'assistant', 
        responseText, 
        responseId,
        // Can add token counting here if openAIService provides it
        undefined
      );
      
      // Update conversation last_message_at
      await this.updateConversation(conversationId, {
        last_message_at: new Date().toISOString()
      });
      
      console.log(`Saved complete streamed response for conversation ${conversationId}`);
    } catch (error) {
      console.error('Error saving streamed response:', error);
    }
  }
}

// Export a singleton instance
export const fishingAssistantService = new FishingAssistantService(); 