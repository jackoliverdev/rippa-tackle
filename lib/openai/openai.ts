import { openAIService } from './openai-service';

export const createStream = async (args: any) => {
  try {
    return await openAIService.streamResponse(args);
  } catch (error) {
    console.error('Error creating stream:', error);
    throw error;
  }
};

export const createResponse = async (args: any) => {
  try {
    return await openAIService.createResponse(args);
  } catch (error) {
    console.error('Error creating OpenAI response:', error);
    throw error;
  }
}; 