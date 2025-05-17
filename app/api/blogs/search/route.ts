import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query');
    const published = searchParams.get('published');
    
    if (!query) {
      return NextResponse.json(
        { error: 'Search query is required' }, 
        { status: 400 }
      );
    }
    
    // We need to fetch all blogs and filter them client-side for now
    // This is because Supabase doesn't support full-text search out of the box
    // In a production app, you'd use a more efficient search strategy
    let dbQuery = supabase
      .from('rippa_blogs')
      .select('*');
    
    // By default, only return published blogs
    if (published !== null) {
      dbQuery = dbQuery.eq('published', published === 'true');
    } else {
      dbQuery = dbQuery.eq('published', true);
    }
    
    const { data: blogsData, error } = await dbQuery;
    
    if (error) {
      console.error('Error searching blogs:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    if (!blogsData || blogsData.length === 0) {
      return NextResponse.json([]);
    }
    
    // Search in title, summary, and content
    // We'll use a simple includes check for now (case insensitive)
    const searchTerms = query.toLowerCase().split(' ').filter(term => term.length > 0);
    
    const filteredBlogs = blogsData.filter(blog => {
      // Check for match in title, summary, or content
      const title = blog.title?.toLowerCase() || '';
      const summary = blog.summary?.toLowerCase() || '';
      const content = blog.content?.toLowerCase() || '';
      const category = blog.category?.toLowerCase() || '';
      const tags = blog.tags?.map((tag: string) => tag.toLowerCase()) || [];
      
      // Check if all search terms appear in at least one of the fields
      return searchTerms.every(term => 
        title.includes(term) || 
        summary.includes(term) || 
        content.includes(term) ||
        category.includes(term) ||
        tags.some((tag: string) => tag.includes(term))
      );
    });
    
    // Transform the data to match our Blog interface
    const blogs = filteredBlogs.map(blog => ({
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
      { error: 'Failed to search blogs' }, 
      { status: 500 }
    );
  }
} 