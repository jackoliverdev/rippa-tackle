import { Video, VideoCategory, VideoChannel } from '@/lib/types';
import { supabase } from '@/lib/supabase';

// Helper function to fetch from our API - compatible with both client and server rendering
async function fetchFromAPI(endpoint: string, params = {}) {
  // Handle both client and server-side environments
  const baseUrl = typeof window !== 'undefined' 
    ? window.location.origin 
    : process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
  
  const url = new URL(`/api/${endpoint}`, baseUrl);
  
  // Add query parameters
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      url.searchParams.append(key, String(value));
    }
  });

  console.log(`Fetching API: ${url.toString()}`);
  const response = await fetch(url.toString());
  
  if (!response.ok) {
    console.error(`API error: ${response.status} ${response.statusText}`);
    throw new Error(`API error: ${response.status} ${response.statusText}`);
  }
  
  const data = await response.json();
  console.log(`API response for ${endpoint}:`, data);
  return data;
}

// Get all videos (potentially filtered by published status)
export async function getAllVideos(publishedOnly = true, includeAll = false): Promise<Video[]> {
  try {
    // If includeAll is true, don't send the published parameter at all
    const params = includeAll ? {} : { published: publishedOnly.toString() };
    const videos = await fetchFromAPI('videos', params);
    return Array.isArray(videos) ? videos : [];
  } catch (error) {
    console.error('Error fetching all videos:', error);
    return [];
  }
}

// Get videos by channel
export async function getVideosByChannel(channel: VideoChannel, publishedOnly = true): Promise<Video[]> {
  try {
    const videos = await fetchFromAPI('videos', { channel, published: publishedOnly.toString() });
    return Array.isArray(videos) ? videos : [];
  } catch (error) {
    console.error(`Error fetching videos for channel ${channel}:`, error);
    return [];
  }
}

// Get videos by direct Supabase query (for faster client-side rendering)
export async function getVideosByChannelDirect(channel: string, publishedOnly = true): Promise<Video[]> {
  try {
    let query = supabase
      .from('rippa_videos')
      .select('*')
      .eq('channel', channel);
      
    if (publishedOnly) {
      query = query.eq('published', true);
    }
    
    // Order by display_order if available, then by published_date
    query = query.order('display_order', { ascending: true })
                .order('published_date', { ascending: false });
    
    const { data, error } = await query;
    
    if (error) {
      throw error;
    }
    
    return data as Video[];
  } catch (error) {
    console.error(`Error directly fetching videos for channel ${channel}:`, error);
    return [];
  }
}

// Get videos by category
export async function getVideosByCategory(category: VideoCategory, publishedOnly = true): Promise<Video[]> {
  try {
    const videos = await fetchFromAPI('videos', { category, published: publishedOnly.toString() });
    return Array.isArray(videos) ? videos : [];
  } catch (error) {
    console.error(`Error fetching videos in category ${category}:`, error);
    return [];
  }
}

// Get featured videos
export async function getFeaturedVideos(limit = 4): Promise<Video[]> {
  try {
    const videos = await fetchFromAPI('videos', { featured: true, published: true });
    if (!Array.isArray(videos)) return [];
    return videos.slice(0, limit);
  } catch (error) {
    console.error('Error fetching featured videos:', error);
    return [];
  }
}

// Get latest videos
export async function getLatestVideos(limit = 6): Promise<Video[]> {
  try {
    const videos = await fetchFromAPI('videos', { published: true });
    if (!Array.isArray(videos)) return [];
    
    // Sort by published_date in descending order
    return videos
      .sort((a: Video, b: Video) => {
        const dateA = a.published_date ? new Date(a.published_date) : new Date();
        const dateB = b.published_date ? new Date(b.published_date) : new Date();
        return dateB.getTime() - dateA.getTime();
      })
      .slice(0, limit);
  } catch (error) {
    console.error('Error fetching latest videos:', error);
    return [];
  }
}

// Get most viewed videos
export async function getMostViewedVideos(limit = 4): Promise<Video[]> {
  try {
    const videos = await fetchFromAPI('videos', { published: true });
    if (!Array.isArray(videos)) return [];
    
    // Sort by view_count in descending order
    return videos
      .sort((a: Video, b: Video) => (b.view_count || 0) - (a.view_count || 0))
      .slice(0, limit);
  } catch (error) {
    console.error('Error fetching most viewed videos:', error);
    return [];
  }
}

// Get a specific video by ID
export async function getVideoById(id: string): Promise<Video | null> {
  try {
    const { data, error } = await supabase
      .from('rippa_videos')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error || !data) {
      console.error(`Error fetching video with ID ${id}:`, error);
      return null;
    }
    
    return data as Video;
  } catch (error) {
    console.error(`Error fetching video with ID ${id}:`, error);
    return null;
  }
}

// Create a new video
export async function createVideo(video: Partial<Video>): Promise<Video | null> {
  try {
    const { data, error } = await supabase
      .from('rippa_videos')
      .insert({
        title: video.title,
        thumbnail: video.thumbnail,
        embed_id: video.embed_id,
        views: video.views,
        duration: video.duration,
        display_date: video.display_date,
        published_date: video.published_date,
        channel: video.channel,
        description: video.description,
        published: video.published !== undefined ? video.published : true,
        featured: video.featured || false,
        category: video.category,
        tags: video.tags,
        view_count: video.view_count || 0,
        display_order: video.display_order,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()
      .single();
    
    if (error) {
      console.error('Error creating video:', error);
      throw new Error(`Database error: ${error.message}`);
    }
    
    return data as Video;
  } catch (error) {
    console.error('Error creating video:', error);
    return null;
  }
}

// Update an existing video
export async function updateVideo(id: string, videoData: Partial<Video>): Promise<Video | null> {
  try {
    const { data, error } = await supabase
      .from('rippa_videos')
      .update({
        title: videoData.title,
        thumbnail: videoData.thumbnail,
        embed_id: videoData.embed_id,
        views: videoData.views,
        duration: videoData.duration,
        display_date: videoData.display_date,
        published_date: videoData.published_date,
        channel: videoData.channel,
        description: videoData.description,
        published: videoData.published,
        featured: videoData.featured,
        category: videoData.category,
        tags: videoData.tags,
        view_count: videoData.view_count,
        display_order: videoData.display_order,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error(`Database error updating video ${id}:`, error);
      throw new Error(`Database error: ${error.message}`);
    }
    
    return data as Video;
  } catch (error) {
    console.error(`Error updating video ${id}:`, error);
    return null;
  }
}

// Delete a video
export async function deleteVideo(id: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('rippa_videos')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error(`Database error deleting video ${id}:`, error);
      throw new Error(`Database error: ${error.message}`);
    }
    
    return true;
  } catch (error) {
    console.error(`Error deleting video ${id}:`, error);
    return false;
  }
}

// Get video statistics
export async function getVideoStats(): Promise<{
  total: number;
  published: number;
  drafts: number;
  featured: number;
  totalViews: number;
  byChannel: Record<string, number>;
}> {
  try {
    const { data, error } = await supabase
      .from('rippa_videos')
      .select('*');
      
    if (error) {
      throw error;
    }
    
    const videos = data as Video[];
    const byChannel: Record<string, number> = {};
    
    videos.forEach(video => {
      if (video.channel) {
        byChannel[video.channel] = (byChannel[video.channel] || 0) + 1;
      }
    });
    
    return {
      total: videos.length,
      published: videos.filter(v => v.published).length,
      drafts: videos.filter(v => !v.published).length,
      featured: videos.filter(v => v.featured).length,
      totalViews: videos.reduce((sum, v) => sum + (v.view_count || 0), 0),
      byChannel
    };
  } catch (error) {
    console.error('Error fetching video stats:', error);
    return {
      total: 0,
      published: 0,
      drafts: 0,
      featured: 0,
      totalViews: 0,
      byChannel: {}
    };
  }
} 