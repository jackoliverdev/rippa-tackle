import { NextRequest, NextResponse } from 'next/server';
import { vibeQuizService } from '@/lib/vibe-quiz-service';

export async function POST(req: NextRequest) {
  try {
    console.log('=== API: /api/vibe-quiz/chat POST request received ===');
    const { conversationId, userMessage } = await req.json();
    console.log('Request data:', { conversationId, userMessage });
    
    // Check if we received valid data
    if (!conversationId) {
      console.error('Missing conversationId');
      return NextResponse.json({ error: 'Missing conversationId' }, { status: 400 });
    }
    if (!userMessage) {
      console.error('Missing userMessage');
      return NextResponse.json({ error: 'Missing userMessage' }, { status: 400 });
    }
    
    // Persist user message
    console.log('Creating user message in database...');
    try {
      await vibeQuizService.createMessage(conversationId, 'user', userMessage);
      console.log('User message created successfully');
    } catch (err) {
      console.error('Error creating user message:', err);
      throw new Error(`Failed to create user message: ${err instanceof Error ? err.message : String(err)}`);
    }
    
    // Generate AI response
    console.log('Generating AI response...');
    let aiResponse;
    try {
      aiResponse = await vibeQuizService.generateAIResponse(conversationId, userMessage);
      console.log('AI response generated successfully');
    } catch (err) {
      console.error('Error generating AI response:', err);
      throw new Error(`Failed to generate AI response: ${err instanceof Error ? err.message : String(err)}`);
    }
    
    // Persist assistant message
    console.log('Creating assistant message in database...');
    try {
      await vibeQuizService.createMessage(conversationId, 'assistant', aiResponse);
      console.log('Assistant message created successfully');
    } catch (err) {
      console.error('Error creating assistant message:', err);
      throw new Error(`Failed to save assistant message: ${err instanceof Error ? err.message : String(err)}`);
    }
    
    console.log('Returning response to client');
    return NextResponse.json({ aiResponse });
  } catch (error) {
    console.error('=== API ERROR ===', error);
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
} 