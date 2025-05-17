import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// Questions CRUD
export async function GET(req: NextRequest) {
  const questionId = req.nextUrl.searchParams.get('questionId');
  if (questionId) {
    // Get conditional responses for a question
    const { data, error } = await supabase
      .from('admin_vibe_quiz_questions_conditional_responses')
      .select('*')
      .eq('question_id', questionId)
      .order('created_at', { ascending: true });
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data);
  } else {
    // Get all questions
    const { data, error } = await supabase
      .from('admin_vibe_quiz_questions')
      .select('*')
      .order('priority', { ascending: true });
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data);
  }
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  if (body.question_id) {
    // Create conditional response
    const { data, error } = await supabase
      .from('admin_vibe_quiz_questions_conditional_responses')
      .insert([body])
      .select()
      .single();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data);
  } else {
    // Create question
    const { data, error } = await supabase
      .from('admin_vibe_quiz_questions')
      .insert([body])
      .select()
      .single();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data);
  }
}

export async function PATCH(req: NextRequest) {
  const id = req.nextUrl.searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });
  const updates = await req.json();
  const { data, error } = await supabase
    .from('admin_vibe_quiz_questions')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function DELETE(req: NextRequest) {
  const id = req.nextUrl.searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });
  const { error } = await supabase
    .from('admin_vibe_quiz_questions')
    .delete()
    .eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
} 