import { NextRequest, NextResponse } from 'next/server';
import { fishingAssistantService } from '@/lib/fishing-assistant-service';

export async function GET(req: NextRequest) {
  // List all conversations for a user (userId from query)
  const userId = req.nextUrl.searchParams.get('userId');
  if (!userId) return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
  
  // For MVP, return empty array - will be implemented later
  return NextResponse.json([]);
}

export async function POST(req: NextRequest) {
  console.log('--- /api/fishing-assistant/conversations POST called ---');
  try {
    const body = await req.json();
    const userId = body.userId; // Make userId optional
    console.log('Received userId:', userId);
    const conversation = await fishingAssistantService.createConversation();
    console.log('Created conversation:', conversation);
    return NextResponse.json(conversation);
  } catch (error) {
    console.error('Error creating conversation:', error);
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const id = req.nextUrl.searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });
    const updates = await req.json();
    const updated = await fishingAssistantService.updateConversation(id, updates);
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  // Not implemented for MVP
  return NextResponse.json({ error: 'Not implemented' }, { status: 501 });
} 