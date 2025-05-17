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

export async function GET(request: Request, { params }: Params) {
  try {
    const { slug } = params;
    const timestamp = Date.now();
    
    if (!slug) {
      return NextResponse.json(
        { error: 'Slug parameter is required' }, 
        { status: 400 }
      );
    }
    
    console.log(`[${timestamp}] Attempting to fetch blog with slug: "${slug}"`);
    
    // Strategy 1: Try exact match first
    let { data: blog, error } = await supabase
      .from('rippa_blogs')
      .select('*')
      .eq('slug', slug)
      .single();
    
    // Strategy 2: If no exact match, try case-insensitive match
    if (!blog && error) {
      console.log(`No exact match found for slug "${slug}", trying case-insensitive match`);
      const { data: blogs, error: iLikeError } = await supabase
        .from('rippa_blogs')
        .select('*')
        .ilike('slug', slug);
      
      if (blogs && blogs.length > 0) {
        blog = blogs[0];
        error = null;
        console.log(`Found case-insensitive match: "${blog.slug}"`);
      } else {
        // Strategy 3: Try partial match as last resort
        console.log(`No case-insensitive match found for "${slug}", trying partial match`);
        const { data: partialBlogs, error: partialError } = await supabase
          .from('rippa_blogs')
          .select('*')
          .ilike('slug', `%${slug}%`);
          
        if (partialBlogs && partialBlogs.length > 0) {
          blog = partialBlogs[0];
          error = null;
          console.log(`Found partial match: "${blog.slug}"`);
        }
      }
    }
    
    if (error || !blog) {
      console.error(`Blog not found for slug "${slug}"`, error);
      return NextResponse.json(
        { error: 'Blog not found' }, 
        { status: 404 }
      );
    }
    
    console.log(`[${timestamp}] Successfully found blog: "${blog.title}" with slug "${blog.slug}"`);

    // Format and return the blog
    const formattedBlog = {
      id: blog.id,
      title: blog.title,
      slug: blog.slug,
      summary: blog.summary,
      content: blog.content ? cleanContent(blog.content) : '',
      author: blog.author,
      author_image: blog.author_image,
      feature_image: blog.feature_image,
      category: blog.category,
      tags: blog.tags || [],
      published: blog.published,
      featured: blog.featured,
      read_time: blog.read_time,
      views: blog.views,
      likes: blog.likes,
      images: blog.images || [],
      metadata: blog.metadata || {},
      created_at: blog.created_at,
      updated_at: blog.updated_at,
      published_at: blog.published_at
    };
    
    return NextResponse.json(formattedBlog, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      }
    });
  } catch (error) {
    console.error('Error fetching blog:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blog' }, 
      { status: 500 }
    );
  }
}

// Helper function to clean up content
function cleanContent(content: string): string {
  if (!content) return '';
  
  return content
    .replace(/<meta[^>]*>/gi, '')
    .trim();
} 