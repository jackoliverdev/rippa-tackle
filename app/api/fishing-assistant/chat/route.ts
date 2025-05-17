import { NextRequest, NextResponse } from 'next/server';
import { fishingAssistantService } from '@/lib/fishing-assistant-service';

export async function POST(req: NextRequest) {
  try {
    console.log('=== API: /api/fishing-assistant/chat POST request received ===');
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
    
    // Stream the AI response
    console.log('Streaming AI response...');
    try {
      const stream = await fishingAssistantService.streamAIResponse(conversationId, userMessage);
      
      // Return the stream directly
      return new Response(stream, {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache, no-transform',
          'Connection': 'keep-alive',
        },
      });
    } catch (err) {
      console.error('Error streaming AI response:', err);
      throw new Error(`Failed to stream AI response: ${err instanceof Error ? err.message : String(err)}`);
    }
  } catch (error) {
    console.error('=== API ERROR ===', error);
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
} 