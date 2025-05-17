import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const tag = searchParams.get('tag');
    const featured = searchParams.get('featured');
    const published = searchParams.get('published');
    
    console.log('API blogs request params:', { 
      url: request.url,
      category, 
      tag, 
      featured, 
      published,
      publishedType: published !== null ? typeof published : 'null'
    });
    
    // Fetch blogs from Supabase
    let query = supabase
      .from('rippa_blogs')
      .select('*');

    // Apply filters if provided
    if (category) {
      query = query.eq('category', category);
    }
    
    if (tag) {
      query = query.contains('tags', [tag]);
    }
    
    if (featured !== null) {
      query = query.eq('featured', featured === 'true');
    }
    
    if (published !== null) {
      // Convert the string 'true' or 'false' to boolean
      const isPublished = published === 'true';
      console.log(`Setting published filter to: ${isPublished} (from value: ${published})`);
      query = query.eq('published', isPublished);
    } else {
      // Don't apply a published filter by default for the admin section to see all blogs
      console.log('No published param provided, not applying published filter');
    }
    
    // Order by published_at descending (newest first)
    query = query.order('published_at', { ascending: false });
    
    const { data: blogsData, error } = await query;

    if (error) {
      console.error('Error fetching blogs:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Transform the data to match our Blog interface
    const blogs = blogsData.map(blog => ({
      id: blog.id,
      title: blog.title,
      slug: blog.slug,
      summary: blog.summary,
      content: blog.content,
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
    }));

    return NextResponse.json(blogs);
  } catch (error) {
    console.error('API route error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blogs' }, 
      { status: 500 }
    );
  }
} 