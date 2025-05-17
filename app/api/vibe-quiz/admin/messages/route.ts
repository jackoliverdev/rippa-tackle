import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(req: NextRequest) {
  try {
    const conversationId = req.nextUrl.searchParams.get('conversationId');
    
    if (!conversationId) {
      return NextResponse.json({ error: 'Missing conversationId parameter' }, { status: 400 });
    }
    
    const { data, error } = await supabase
      .from('vibe_quiz_messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true });
    
    if (error) {
      console.error('Error fetching messages:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    return NextResponse.json(data);
  } catch (err) {
    console.error('Unexpected error fetching messages:', err);
    return NextResponse.json({ error: 'Failed to fetch messages' }, { status: 500 });
  }
} 