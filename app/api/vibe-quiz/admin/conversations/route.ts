import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(req: NextRequest) {
  try {
    // First fetch conversations
    const { data: conversations, error: conversationsError } = await supabase
      .from('vibe_quiz_conversations')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (conversationsError) {
      console.error('Error fetching conversations:', conversationsError);
      return NextResponse.json({ error: conversationsError.message }, { status: 500 });
    }
    
    // Fetch user details for each conversation
    const conversationsWithUserDetails = await Promise.all(
      conversations.map(async (conversation) => {
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('first_name, last_name, profile_image_url, email')
          .eq('id', conversation.user_id)
          .single();
        
        if (userError) {
          console.warn(`Error fetching user data for user ${conversation.user_id}:`, userError);
          return {
            ...conversation,
            user_details: null
          };
        }
        
        return {
          ...conversation,
          user_details: userData
        };
      })
    );
    
    return NextResponse.json(conversationsWithUserDetails);
  } catch (err) {
    console.error('Unexpected error fetching conversations:', err);
    return NextResponse.json({ error: 'Failed to fetch conversations' }, { status: 500 });
  }
} 