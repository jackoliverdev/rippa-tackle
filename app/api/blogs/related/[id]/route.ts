import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

type Params = {
  params: {
    id: string;
  };
};

export async function GET(request: Request, { params }: Params) {
  try {
    const { id } = params;
    const { searchParams } = new URL(request.url);
    const limitParam = searchParams.get('limit');
    const limit = limitParam ? parseInt(limitParam, 10) : 3;
    
    if (!id) {
      return NextResponse.json(
        { error: 'Blog ID parameter is required' }, 
        { status: 400 }
      );
    }
    
    // First get the current blog to find related blogs by category/tags
    const { data: blog, error: fetchError } = await supabase
      .from('rippa_blogs')
      .select('id, category, tags')
      .eq('id', id)
      .single();
    
    if (fetchError || !blog) {
      return NextResponse.json(
        { error: 'Blog not found' }, 
        { status: 404 }
      );
    }
    
    // Find related blogs by category and tags, excluding the current blog
    // We'll fetch a bit more than needed and then pick the most relevant ones
    let query = supabase
      .from('rippa_blogs')
      .select('*')
      .neq('id', id)  // Exclude current blog
      .eq('published', true);  // Only published blogs
    
    // Prefer blogs from the same category
    if (blog.category) {
      query = query.eq('category', blog.category);
    }
    
    // Now execute the query
    const { data: categoryBlogs, error: categoryError } = await query;
    
    if (categoryError) {
      console.error('Error fetching related blogs by category:', categoryError);
      return NextResponse.json({ error: categoryError.message }, { status: 500 });
    }
    
    let relatedBlogs = categoryBlogs || [];
    
    // If we don't have enough category blogs, try to find blogs with similar tags
    if (relatedBlogs.length < limit && blog.tags && blog.tags.length > 0) {
      // Get blogs that have any of the tags from the original blog
      const { data: tagBlogs, error: tagError } = await supabase
        .from('rippa_blogs')
        .select('*')
        .neq('id', id)  // Exclude current blog
        .eq('published', true)
        .not('category', 'eq', blog.category) // Exclude blogs from the same category (we already have those)
        .overlaps('tags', blog.tags);
      
      if (!tagError && tagBlogs) {
        // Combine and deduplicate by ID
        const allBlogs = [...relatedBlogs];
        
        for (const tagBlog of tagBlogs) {
          if (!allBlogs.some(b => b.id === tagBlog.id)) {
            allBlogs.push(tagBlog);
          }
        }
        
        relatedBlogs = allBlogs;
      }
    }
    
    // If we still don't have enough blogs, add recent blogs
    if (relatedBlogs.length < limit) {
      const { data: recentBlogs, error: recentError } = await supabase
        .from('rippa_blogs')
        .select('*')
        .neq('id', id)  // Exclude current blog
        .eq('published', true)
        .not('id', 'in', relatedBlogs.map(b => b.id)) // Exclude blogs we already have
        .order('published_at', { ascending: false })
        .limit(limit - relatedBlogs.length);
      
      if (!recentError && recentBlogs) {
        relatedBlogs = [...relatedBlogs, ...recentBlogs];
      }
    }
    
    // Sort by most relevant (those with matching category first, then by shared tags count, then by date)
    relatedBlogs.sort((a, b) => {
      // First by category match
      if (a.category === blog.category && b.category !== blog.category) return -1;
      if (a.category !== blog.category && b.category === blog.category) return 1;
      
      // Then by number of shared tags
      const aSharedTags = a.tags?.filter((tag: string) => blog.tags?.includes(tag))?.length || 0;
      const bSharedTags = b.tags?.filter((tag: string) => blog.tags?.includes(tag))?.length || 0;
      if (aSharedTags !== bSharedTags) return bSharedTags - aSharedTags;
      
      // Finally by publish date
      const aDate = new Date(a.published_at || a.created_at);
      const bDate = new Date(b.published_at || b.created_at);
      return bDate.getTime() - aDate.getTime();
    });
    
    // Limit to the requested number of related blogs
    relatedBlogs = relatedBlogs.slice(0, limit);
    
    // Transform the data to match our Blog interface
    const blogs = relatedBlogs.map(blog => ({
      id: blog.id,
      title: blog.title,
      slug: blog.slug,
      summary: blog.summary,
      content: blog.content, // We don't need the full content for related blogs
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
      { error: 'Failed to fetch related blogs' }, 
      { status: 500 }
    );
  }
} 