import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    
    // Extract filter parameters from request
    const category = searchParams.get('category');
    const channel = searchParams.get('channel');
    const published = searchParams.get('published');
    const featured = searchParams.get('featured');
    
    // Build query
    let query = supabase
      .from('rippa_videos')
      .select('*');
    
    // Apply filters if provided
    if (category) {
      query = query.eq('category', category);
    }
    
    if (channel) {
      query = query.eq('channel', channel);
    }
    
    if (published !== null) {
      // If published parameter exists, filter by it
      const isPublished = published === 'true';
      query = query.eq('published', isPublished);
    }
    
    if (featured) {
      const isFeatured = featured === 'true';
      query = query.eq('featured', isFeatured);
    }
    
    // Order by display_order (if available), then by published_date (newest first)
    query = query
      .order('display_order', { ascending: true })
      .order('published_date', { ascending: false });
    
    // Execute query
    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching videos:', error);
      return NextResponse.json({ error: 'Failed to fetch videos' }, { status: 500 });
    }
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Unexpected error in videos API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// For future implementations:
// 
// export async function POST(request: NextRequest) {
//   // Create a new video
// }
// 
// export async function PUT(request: NextRequest) {
//   // Update an existing video
// }
// 
// export async function DELETE(request: NextRequest) {
//   // Delete a video
// } 