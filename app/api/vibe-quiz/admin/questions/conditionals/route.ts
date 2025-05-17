import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// POST endpoint to save a conditional response
export async function POST(req: NextRequest) {
  try {
    let conditional = await req.json();
    
    if (!conditional.question_id) {
      return NextResponse.json({ error: 'Missing question_id' }, { status: 400 });
    }
    
    // Remove empty ID to let Supabase generate a UUID
    if (conditional.id === '') {
      delete conditional.id;
    }
    
    console.log('Saving conditional response:', conditional);
    
    const { data, error } = await supabase
      .from('admin_vibe_quiz_questions_conditional_responses')
      .insert(conditional)
      .select();
    
    if (error) {
      console.error('Error saving conditional response:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    return NextResponse.json(data[0]);
  } catch (err) {
    console.error('Unexpected error saving conditional response:', err);
    return NextResponse.json({ error: 'Failed to save conditional response' }, { status: 500 });
  }
}

// DELETE endpoint to remove all conditional responses for a question
export async function DELETE(req: NextRequest) {
  const questionId = req.nextUrl.searchParams.get('questionId');
  
  if (!questionId) {
    return NextResponse.json({ error: 'Missing questionId parameter' }, { status: 400 });
  }
  
  console.log(`Deleting conditional responses for question: ${questionId}`);
  
  try {
    const { error } = await supabase
      .from('admin_vibe_quiz_questions_conditional_responses')
      .delete()
      .eq('question_id', questionId);
    
    if (error) {
      console.error('Error deleting conditional responses:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Unexpected error deleting conditional responses:', err);
    return NextResponse.json({ error: 'Failed to delete conditional responses' }, { status: 500 });
  }
} 