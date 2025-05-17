import { NextRequest, NextResponse } from 'next/server';
import { fishingAssistantService } from '@/lib/fishing-assistant-service';

export async function GET(request: NextRequest) {
  try {
    console.log('GET /api/fishing-assistant/messages called');
    const { searchParams } = new URL(request.url);
    const conversationId = searchParams.get('conversationId');
    
    console.log('Fetching messages for conversationId:', conversationId);

    if (!conversationId) {
      return NextResponse.json({ error: 'Conversation ID is required' }, { status: 400 });
    }

    const messages = await fishingAssistantService.getMessages(conversationId);
    console.log(`Found ${messages.length} messages`);
    
    return NextResponse.json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { conversationId, role, content } = await req.json();
    const message = await fishingAssistantService.createMessage(conversationId, role, content);
    return NextResponse.json(message);
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
} 