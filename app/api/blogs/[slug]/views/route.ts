import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Add cache control headers
export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';
export const revalidate = 0;

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false },
  global: { 
    headers: { 
      'Cache-Control': 'no-store',
      'Pragma': 'no-cache',
    } 
  }
});

type Params = {
  params: {
    slug: string;
  };
};

export async function POST(request: Request, { params }: Params) {
  try {
    const { slug } = params;
    const timestamp = Date.now();
    
    if (!slug) {
      return NextResponse.json(
        { error: 'Slug parameter is required' }, 
        { status: 400 }
      );
    }
    
    console.log(`[${timestamp}] Attempting to increment views for blog with slug: "${slug}"`);
    
    // Strategy 1: Try exact match first
    let { data: blog, error: fetchError } = await supabase
      .from('rippa_blogs')
      .select('id, views, title, slug')
      .eq('slug', slug)
      .single();
    
    // Strategy 2: If no exact match, try case-insensitive match
    if (!blog && fetchError) {
      console.log(`No exact match found for slug "${slug}", trying case-insensitive match`);
      const { data: blogs, error: iLikeError } = await supabase
        .from('rippa_blogs')
        .select('id, views, title, slug')
        .ilike('slug', slug);
      
      if (blogs && blogs.length > 0) {
        blog = blogs[0];
        fetchError = null;
        console.log(`Found case-insensitive match: "${blog.slug}"`);
      } else {
        // Strategy 3: Try partial match as last resort
        console.log(`No case-insensitive match found for "${slug}", trying partial match`);
        const { data: partialBlogs, error: partialError } = await supabase
          .from('rippa_blogs')
          .select('id, views, title, slug')
          .ilike('slug', `%${slug}%`);
          
        if (partialBlogs && partialBlogs.length > 0) {
          blog = partialBlogs[0];
          fetchError = null;
          console.log(`Found partial match: "${blog.slug}"`);
        }
      }
    }
    
    if (fetchError || !blog) {
      console.error(`Blog not found for slug "${slug}" when incrementing views`, fetchError);
      return NextResponse.json(
        { error: 'Blog not found' }, 
        { status: 404 }
      );
    }
    
    console.log(`[${timestamp}] Incrementing views for blog: "${blog.title}" with slug "${blog.slug}"`);
    
    // Increment the views count
    const newViewCount = (blog.views || 0) + 1;
    
    const { data, error: updateError } = await supabase
      .from('rippa_blogs')
      .update({ views: newViewCount })
      .eq('id', blog.id)
      .select('id, views, title, slug')
      .single();
    
    if (updateError) {
      console.error(`Error updating views for blog "${blog.slug}"`, updateError);
      return NextResponse.json(
        { error: updateError.message }, 
        { status: 500 }
      );
    }
    
    console.log(`[${timestamp}] Successfully updated views for "${data.title}" (${data.slug}): ${data.views} views`);
    
    return NextResponse.json({ 
      success: true, 
      views: data.views 
    }, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      }
    });
  } catch (error) {
    console.error('Error incrementing blog views:', error);
    
    return NextResponse.json(
      { error: 'Failed to increment views' }, 
      { status: 500 }
    );
  }
} 