import { NextRequest, NextResponse } from 'next/server';
import { vibeQuizService } from '@/lib/vibe-quiz-service';

export async function GET(req: NextRequest) {
  // List all conversations for a user (userId from query)
  const userId = req.nextUrl.searchParams.get('userId');
  if (!userId) return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
  // You may want to add auth here
  // For demo, fetch all for user
  // (You may want to restrict this in production)
  // ...
  return NextResponse.json([]); // Implement as needed
}

export async function POST(req: NextRequest) {
  console.log('--- /api/vibe-quiz/conversations POST called ---');
  try {
    const { userId } = await req.json();
    console.log('Received userId:', userId);
    const conversation = await vibeQuizService.createConversation(userId);
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
    const updated = await vibeQuizService.updateConversation(id, updates);
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  // Implement as needed (e.g., delete conversation by id)
  return NextResponse.json({ error: 'Not implemented' }, { status: 501 });
} 