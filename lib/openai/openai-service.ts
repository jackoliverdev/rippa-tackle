import OpenAI, { NotFoundError } from 'openai';
import { ResponseStreamParams } from 'openai/lib/responses/ResponseStream';
import { ResponseCreateParamsNonStreaming } from 'openai/resources/responses/responses';

export class OpenAIService {
  private readonly openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      organization: process.env.OPENAI_ORGANIZATION,
      project: process.env.OPENAI_PROJECT,
    });
  }

  async createResponse(args: ResponseCreateParamsNonStreaming) {
    return await this.openai.responses.create(args);
  }

  async createResponseAndPoll(args: ResponseCreateParamsNonStreaming) {
    let response = await this.openai.responses.create(args);
    let tries = 0;
    
    while (tries < 120) {
      if (response.status === 'completed' || response.status === 'failed' || response.status === 'incomplete') {
        return response;
      }
      await new Promise(resolve => setTimeout(resolve, 1000));
      response = await this.getResponse(response.id);
      tries++;
    }
    
    throw new Error('Response not completed');
  }

  async getResponse(id: string) {
    return await this.openai.responses.retrieve(id, {
      include: ['file_search_call.results', 'message.input_image.image_url']
    });
  }

  async deleteResponse(id: string) {
    try {
      return await this.openai.responses.del(id);
    } catch (error) {
      if (error instanceof NotFoundError) return;
      throw error;
    }
  }

  async streamResponse(args: ResponseStreamParams) {
    console.log('Starting OpenAI stream with model:', args.model);
    
    try {
      const stream = await this.openai.responses.stream(args);
      
      // Add debug logging
      const enhancedStream = stream.on('event', (data) => {
        console.log('OpenAI stream event received:', JSON.stringify(data));
      }).on('error', (error) => {
        console.error('OpenAI stream error:', error);
      }).on('end', () => {
        console.log('OpenAI stream ended');
      });
      
      return enhancedStream;
    } catch (error) {
      console.error('Error creating OpenAI stream:', error);
      throw error;
    }
  }

  async createFile(file: File, purpose: 'assistants' | 'user_data' = 'assistants') {
    console.log(`Creating file with purpose:`, file, typeof file);
    return await this.openai.files.create({
      file,
      purpose,
    });
  }

  async deleteFile(id: string) {
    return await this.openai.files.del(id);
  }

  async getThreadMessagesFromResponses(id: string) {
    return await this.openai.responses.inputItems.list(id, {
      include: ['file_search_call.results', 'message.input_image.image_url']
    });
  }

  // Vector Store Methods
  async createVectorStore(name: string) {
    return await this.openai.vectorStores.create({
      name: name,
    });
  }

  async getVectorStore(vectorStoreId: string) {
    return await this.openai.vectorStores.retrieve(vectorStoreId);
  }

  async deleteVectorStore(vectorStoreId: string) {
    return await this.openai.vectorStores.del(vectorStoreId);
  }

  async createVectorStoreFile(vectorStoreId: string, fileId: string) {
    return await this.openai.vectorStores.files.createAndPoll(
      vectorStoreId,
      { file_id: fileId },
    );
  }

  async uploadVectorStoreFile(vectorStoreId: string, file: File) {
    const { id: fileId } = await this.createFile(file);
    return await this.createVectorStoreFile(vectorStoreId, fileId);
  }

  async deleteVectorStoreFile(vectorStoreId: string, fileId: string) {
    try {
      return await this.openai.vectorStores.files.del(
        vectorStoreId,
        fileId,
      );
    } catch (error) {
      if (error instanceof NotFoundError) return;
      throw error;
    }
  }

  async switchVectorStoreFile(
    fileId: string,
    oldVectorStoreId: string,
    newVectorStoreId: string,
  ) {
    await this.deleteVectorStoreFile(oldVectorStoreId, fileId);
    return await this.createVectorStoreFile(newVectorStoreId, fileId);
  }

  async createStreamingResponse(args: ResponseStreamParams) {
    console.log('Creating streaming response with model:', args.model);
    return await this.streamResponse(args);
  }
}

// Export a singleton instance
export const openAIService = new OpenAIService(); 