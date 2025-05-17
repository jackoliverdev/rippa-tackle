import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

type Params = {
  params: {
    slug: string;
  };
};

export async function POST(request: Request, { params }: Params) {
  try {
    const { slug } = params;
    
    if (!slug) {
      return NextResponse.json(
        { error: 'Slug parameter is required' }, 
        { status: 400 }
      );
    }
    
    // First get the current blog to check it exists and get current like count
    const { data: blog, error: fetchError } = await supabase
      .from('rippa_blogs')
      .select('id, likes')
      .eq('slug', slug)
      .single();
    
    if (fetchError || !blog) {
      return NextResponse.json(
        { error: 'Blog not found' }, 
        { status: 404 }
      );
    }
    
    // Increment the likes count
    const newLikeCount = (blog.likes || 0) + 1;
    
    const { data, error: updateError } = await supabase
      .from('rippa_blogs')
      .update({ likes: newLikeCount })
      .eq('id', blog.id)
      .select('id, likes')
      .single();
    
    if (updateError) {
      return NextResponse.json(
        { error: updateError.message }, 
        { status: 500 }
      );
    }
    
    return NextResponse.json({ 
      success: true, 
      likes: data.likes 
    });
  } catch (error) {
    console.error('Error incrementing blog likes:', error);
    
    return NextResponse.json(
      { error: 'Failed to increment likes' }, 
      { status: 500 }
    );
  }
} 