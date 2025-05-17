import { Blog, BlogCategory, BlogTag } from '@/lib/types';
import { supabase } from '@/lib/supabase';

// Helper function to fetch from our API - compatible with both client and server rendering
async function fetchFromAPI(endpoint: string, params = {}) {
  // Handle both client and server-side environments
  const baseUrl = typeof window !== 'undefined' 
    ? window.location.origin 
    : process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
  
  // Log environment variables availability for debugging
  const hasSupabaseUrl = !!process.env.NEXT_PUBLIC_SUPABASE_URL;
  const hasSupabaseKey = !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  console.log(`[blog-service] Env vars check: Supabase URL ${hasSupabaseUrl ? 'exists' : 'missing'}, Key ${hasSupabaseKey ? 'exists' : 'missing'}`);
  
  const url = new URL(`/api/${endpoint}`, baseUrl);
  
  // Add query parameters
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      url.searchParams.append(key, String(value));
    }
  });
  
  // Add cache-busting parameter with current timestamp
  url.searchParams.append('_nocache', Date.now().toString());

  console.log(`[blog-service] Fetching API: ${url.toString()}`);
  
  try {
    const response = await fetch(url.toString(), {
      cache: 'no-store', // Disable caching for this request
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });
    
    // Log response status details
    console.log(`[blog-service] API response status: ${response.status} ${response.statusText} for ${endpoint}`);
    
    if (!response.ok) {
      console.error(`[blog-service] API error: ${response.status} ${response.statusText}`);
      
      // Try to get more detailed error info
      try {
        const errorJson = await response.json();
        console.error('[blog-service] Error details:', errorJson);
      } catch (jsonError) {
        console.error('[blog-service] Could not parse error response');
      }
      
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log(`[blog-service] API response for ${endpoint}:`, data?.length ? `${data.length} items` : data);
    return data;
  } catch (error) {
    console.error(`[blog-service] Fetch error for ${endpoint}:`, error);
    throw error;
  }
}

// Get all blogs (potentially filtered by published status)
export async function getAllBlogs(publishedOnly = true, includeAll = false): Promise<Blog[]> {
  try {
    // If includeAll is true, don't send the published parameter at all
    const params = includeAll ? {} : { published: publishedOnly.toString() };
    const blogs = await fetchFromAPI('blogs', params);
    return Array.isArray(blogs) ? blogs : [];
  } catch (error) {
    console.error('Error fetching all blogs:', error);
    return [];
  }
}

// Get a specific blog by slug
export async function getBlogBySlug(slug: string): Promise<Blog | null> {
  try {
    // Use the dedicated API endpoint for getting a blog by slug
    const blog = await fetchFromAPI(`blogs/${slug}`);
    return blog || null;
  } catch (error) {
    console.error(`Error fetching blog with slug ${slug}:`, error);
    return null;
  }
}

// Get blogs by category
export async function getBlogsByCategory(category: BlogCategory, publishedOnly = true): Promise<Blog[]> {
  try {
    const blogs = await fetchFromAPI('blogs', { category, published: publishedOnly });
    return Array.isArray(blogs) ? blogs : [];
  } catch (error) {
    console.error(`Error fetching blogs in category ${category}:`, error);
    return [];
  }
}

// Get blogs by tag
export async function getBlogsByTag(tag: BlogTag, publishedOnly = true): Promise<Blog[]> {
  try {
    const blogs = await fetchFromAPI('blogs', { tag, published: publishedOnly });
    return Array.isArray(blogs) ? blogs : [];
  } catch (error) {
    console.error(`Error fetching blogs with tag ${tag}:`, error);
    return [];
  }
}

// Search blogs by query
export async function searchBlogs(query: string, publishedOnly = true): Promise<Blog[]> {
  try {
    const blogs = await fetchFromAPI('blogs/search', { query, published: publishedOnly });
    return Array.isArray(blogs) ? blogs : [];
  } catch (error) {
    console.error(`Error searching blogs with query "${query}":`, error);
    return [];
  }
}

// Get featured blogs
export async function getFeaturedBlogs(limit = 4): Promise<Blog[]> {
  try {
    const blogs = await fetchFromAPI('blogs', { featured: true, published: true });
    if (!Array.isArray(blogs)) return [];
    return blogs.slice(0, limit);
  } catch (error) {
    console.error('Error fetching featured blogs:', error);
    return [];
  }
}

// Get latest blogs
export async function getLatestBlogs(limit = 6): Promise<Blog[]> {
  try {
    const blogs = await fetchFromAPI('blogs', { published: true });
    if (!Array.isArray(blogs)) return [];
    
    // Sort by published_at date in descending order
    return blogs
      .sort((a: Blog, b: Blog) => {
        const dateA = a.published_at ? new Date(a.published_at) : new Date();
        const dateB = b.published_at ? new Date(b.published_at) : new Date();
        return dateB.getTime() - dateA.getTime();
      })
      .slice(0, limit);
  } catch (error) {
    console.error('Error fetching latest blogs:', error);
    return [];
  }
}

// Get popular blogs (by views)
export async function getPopularBlogs(limit = 4): Promise<Blog[]> {
  try {
    const blogs = await fetchFromAPI('blogs', { published: true });
    if (!Array.isArray(blogs)) return [];
    
    // Sort by views in descending order
    return blogs
      .sort((a: Blog, b: Blog) => (b.views || 0) - (a.views || 0))
      .slice(0, limit);
  } catch (error) {
    console.error('Error fetching popular blogs:', error);
    return [];
  }
}

// Get related blogs (by category and tags)
export async function getRelatedBlogs(blogId: string, limit = 3): Promise<Blog[]> {
  try {
    const blogs = await fetchFromAPI(`blogs/related/${blogId}`, { limit });
    return Array.isArray(blogs) ? blogs : [];
  } catch (error) {
    console.error(`Error fetching related blogs for blog ${blogId}:`, error);
    return [];
  }
}

// Increment blog views
export async function incrementBlogViews(slug: string): Promise<{ success: boolean, views?: number }> {
  try {
    const response = await fetch(`/api/blogs/${slug}/views`, {
      method: 'POST',
    });
    
    if (response.ok) {
      const data = await response.json();
      return { success: true, views: data.views };
    }
    
    return { success: false };
  } catch (error) {
    console.error(`Error incrementing views for blog ${slug}:`, error);
    return { success: false };
  }
}

// Like a blog
export async function likeBlog(slug: string): Promise<{ success: boolean, likes?: number }> {
  try {
    const response = await fetch(`/api/blogs/${slug}/like`, {
      method: 'POST',
    });
    
    if (response.ok) {
      const data = await response.json();
      return { success: true, likes: data.likes };
    }
    
    return { success: false };
  } catch (error) {
    console.error(`Error liking blog ${slug}:`, error);
    return { success: false };
  }
}

// Admin-specific functions below

// Create a new blog
export async function createBlog(blog: Partial<Blog>): Promise<Blog | null> {
  try {
    // Direct database insertion using Supabase
    const { data, error } = await supabase
      .from('rippa_blogs')
      .insert({
        title: blog.title,
        slug: blog.slug,
        summary: blog.summary,
        content: blog.content,
        author: blog.author,
        author_image: blog.author_image,
        feature_image: blog.feature_image,
        category: blog.category,
        tags: blog.tags,
        published: blog.published !== undefined ? blog.published : true,
        featured: blog.featured || false,
        read_time: blog.read_time,
        views: 0,
        likes: 0,
        images: blog.images || [],
        metadata: blog.metadata || {},
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        published_at: blog.published ? new Date().toISOString() : null
      })
      .select()
      .single();
    
    if (error) {
      console.error('Error creating blog:', error);
      throw new Error(`Database error: ${error.message}`);
    }
    
    return data;
  } catch (error) {
    console.error('Error creating blog:', error);
    return null;
  }
}

// Update an existing blog
export async function updateBlog(id: string, blogData: Partial<Blog>): Promise<Blog | null> {
  try {
    // Check if the blog is being published for the first time
    let published_at = undefined;
    
    if (blogData.published && !await wasBlogPublishedBefore(id)) {
      published_at = new Date().toISOString();
    }
    
    // Direct database update using Supabase
    const { data, error } = await supabase
      .from('rippa_blogs')
      .update({
        title: blogData.title,
        slug: blogData.slug,
        summary: blogData.summary,
        content: blogData.content,
        author: blogData.author,
        author_image: blogData.author_image,
        feature_image: blogData.feature_image,
        category: blogData.category,
        tags: blogData.tags,
        published: blogData.published,
        featured: blogData.featured,
        read_time: blogData.read_time,
        images: blogData.images,
        metadata: blogData.metadata,
        updated_at: new Date().toISOString(),
        published_at: published_at
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error(`Database error updating blog ${id}:`, error);
      throw new Error(`Database error: ${error.message}`);
    }
    
    return data;
  } catch (error) {
    console.error(`Error updating blog ${id}:`, error);
    return null;
  }
}

// Helper to check if a blog was published before
async function wasBlogPublishedBefore(id: string): Promise<boolean> {
  const { data, error } = await supabase
    .from('rippa_blogs')
    .select('published, published_at')
    .eq('id', id)
    .single();
  
  if (error || !data) {
    return false;
  }
  
  return Boolean(data.published && data.published_at);
}

// Delete a blog
export async function deleteBlog(id: string): Promise<boolean> {
  try {
    // Direct database deletion using Supabase
    const { error } = await supabase
      .from('rippa_blogs')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error(`Database error deleting blog ${id}:`, error);
      throw new Error(`Database error: ${error.message}`);
    }
    
    return true;
  } catch (error) {
    console.error(`Error deleting blog ${id}:`, error);
    return false;
  }
}

// Upload a blog image
export async function uploadBlogImage(file: File, blogId?: string): Promise<{ url: string; id: string } | null> {
  try {
    // Create a unique file name
    const uniqueId = Date.now().toString();
    const fileExt = file.name.split('.').pop();
    const fileName = `${uniqueId}_${file.name.replace(/\s+/g, '_').toLowerCase()}`;
    const filePath = blogId 
      ? `blogs/${blogId}/${fileName}` 
      : `blogs/temp/${fileName}`;
    
    // Upload directly to Supabase storage
    const { data, error } = await supabase
      .storage
      .from('rippa')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });
    
    if (error) {
      console.error('Supabase storage error:', error);
      throw new Error(`Storage error: ${error.message}`);
    }
    
    // Get the public URL
    const { data: publicUrlData } = supabase
      .storage
      .from('rippa')
      .getPublicUrl(data.path);
    
    // Return the URL and path
    return {
      url: publicUrlData.publicUrl,
      id: data.path
    };
  } catch (error) {
    console.error('Error uploading blog image:', error);
    return null;
  }
}

// Get blog statistics
export async function getBlogStats(): Promise<{
  total: number;
  published: number;
  drafts: number;
  featured: number;
  totalViews: number;
  totalLikes: number;
}> {
  try {
    const stats = await fetchFromAPI('admin/blogs/stats');
    return stats;
  } catch (error) {
    console.error('Error fetching blog stats:', error);
    return {
      total: 0,
      published: 0,
      drafts: 0,
      featured: 0,
      totalViews: 0,
      totalLikes: 0
    };
  }
}

// Get a specific blog by ID (admin only)
export async function getBlogById(id: string): Promise<Blog | null> {
  try {
    const { data, error } = await supabase
      .from('rippa_blogs')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error || !data) {
      console.error(`Error fetching blog with ID ${id}:`, error);
      return null;
    }
    
    return {
      id: data.id,
      title: data.title,
      slug: data.slug,
      summary: data.summary,
      content: data.content,
      author: data.author,
      author_image: data.author_image,
      feature_image: data.feature_image,
      category: data.category,
      tags: data.tags || [],
      published: data.published,
      featured: data.featured,
      read_time: data.read_time,
      views: data.views,
      likes: data.likes,
      images: data.images || [],
      metadata: data.metadata || {},
      created_at: data.created_at,
      updated_at: data.updated_at,
      published_at: data.published_at
    };
  } catch (error) {
    console.error(`Error fetching blog with ID ${id}:`, error);
    return null;
  }
} 