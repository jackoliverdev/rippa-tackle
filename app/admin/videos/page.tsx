"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Video as VideoIcon, Plus, Search, FilterX } from 'lucide-react';
import PageTitle from '@/components/admin/page-title';
import VideoList from '@/components/admin/videos/video-list';
import { getAllVideos, deleteVideo } from '@/lib/video-service';
import { Video, VideoCategory, VideoChannel } from '@/lib/types';
import { supabase } from '@/lib/supabase';
import { VideoPlayerModal } from '@/components/website/VideoPlayerModal';

// Video categories for filter
const VIDEO_CATEGORIES = [
  { value: 'all', label: 'All Categories' },
  { value: 'Fishing Sessions', label: 'Fishing Sessions' },
  { value: 'Tutorials', label: 'Tutorials' },
  { value: 'Reviews', label: 'Reviews' },
  { value: 'Adventure', label: 'Adventure' },
  { value: 'Tips and Tactics', label: 'Tips and Tactics' },
  { value: 'Product Reviews', label: 'Product Reviews' },
];

// Video channels for filter
const VIDEO_CHANNELS = [
  { value: 'all', label: 'All Channels' },
  { value: 'Jacob London Carper', label: 'Jacob London Carper' },
  { value: 'Henry Lennon', label: 'Henry Lennon' },
  { value: 'Other', label: 'Other' },
];

export default function VideosPage() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [filteredVideos, setFilteredVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Selected video for modal
  const [selectedVideo, setSelectedVideo] = useState<null | {
    embedId: string;
    title: string;
  }>(null);
  
  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [channelFilter, setChannelFilter] = useState('all');
  const [showPublishedOnly, setShowPublishedOnly] = useState(false);
  const [showFeaturedOnly, setShowFeaturedOnly] = useState(false);
  
  // Load videos on initial render
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        console.log('Fetching videos for admin panel...');
        
        // Direct Supabase query to check what's actually in the database
        const { data: directData, error: directError } = await supabase
          .from('rippa_videos')
          .select('*');
          
        console.log('Direct Supabase query result:', { data: directData, error: directError });
        
        // Get ALL videos, both published and drafts
        const data = await getAllVideos(true, true); // includeAll=true to get everything
        console.log('Videos fetched via API:', data);
        
        setVideos(data);
        setFilteredVideos(data);
      } catch (err) {
        console.error('Error loading videos:', err);
        setError('Failed to load videos. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchVideos();
  }, []);
  
  // Apply filters whenever filter state changes
  useEffect(() => {
    let result = [...videos];
    
    // Apply category filter
    if (categoryFilter !== 'all') {
      result = result.filter(video => video.category === categoryFilter);
    }
    
    // Apply channel filter
    if (channelFilter !== 'all') {
      result = result.filter(video => video.channel === channelFilter);
    }
    
    // Apply published filter
    if (showPublishedOnly) {
      result = result.filter(video => video.published);
    }
    
    // Apply featured filter
    if (showFeaturedOnly) {
      result = result.filter(video => video.featured);
    }
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(video => 
        video.title.toLowerCase().includes(query) || 
        video.description?.toLowerCase().includes(query) ||
        video.channel?.toLowerCase().includes(query) ||
        video.tags?.some(tag => tag.toLowerCase().includes(query))
      );
    }
    
    setFilteredVideos(result);
  }, [videos, categoryFilter, channelFilter, showPublishedOnly, showFeaturedOnly, searchQuery]);
  
  // Handle video preview
  const handlePreviewVideo = (video: Video) => {
    setSelectedVideo({
      embedId: video.embed_id,
      title: video.title
    });
  };
  
  // Handle video deletion
  const handleDeleteVideo = async (videoId: string) => {
    try {
      const success = await deleteVideo(videoId);
      
      if (success) {
        setVideos(videos.filter(video => video.id !== videoId));
        // No need to setFilteredVideos as the useEffect will handle that
      } else {
        throw new Error('Failed to delete video');
      }
    } catch (err) {
      console.error('Error deleting video:', err);
      // You might want to show a toast notification here
    }
  };
  
  // Reset all filters
  const resetFilters = () => {
    setSearchQuery('');
    setCategoryFilter('all');
    setChannelFilter('all');
    setShowPublishedOnly(false);
    setShowFeaturedOnly(false);
  };
  
  // Count for filters showing
  const isFiltering = categoryFilter !== 'all' || channelFilter !== 'all' || showPublishedOnly || showFeaturedOnly || searchQuery;
  
  return (
    <div>
      <PageTitle 
        title="Videos" 
        description={`${videos.length} videos in your site`}
        icon={<VideoIcon className="w-5 h-5" />}
        actions={
          <Link
            href="/admin/videos/new"
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg shadow-sm hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            New Video
          </Link>
        }
      />
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search videos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div className="flex flex-wrap md:flex-nowrap gap-4">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            >
              {VIDEO_CATEGORIES.map((category) => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
            
            <select
              value={channelFilter}
              onChange={(e) => setChannelFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            >
              {VIDEO_CHANNELS.map((channel) => (
                <option key={channel.value} value={channel.value}>
                  {channel.label}
                </option>
              ))}
            </select>
            
            <label className="flex items-center px-4 py-2 border border-gray-300 rounded-lg cursor-pointer">
              <input
                type="checkbox"
                checked={showPublishedOnly}
                onChange={(e) => setShowPublishedOnly(e.target.checked)}
                className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500 mr-2"
              />
              <span className="text-sm">Published only</span>
            </label>
            
            <label className="flex items-center px-4 py-2 border border-gray-300 rounded-lg cursor-pointer">
              <input
                type="checkbox"
                checked={showFeaturedOnly}
                onChange={(e) => setShowFeaturedOnly(e.target.checked)}
                className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500 mr-2"
              />
              <span className="text-sm">Featured only</span>
            </label>
            
            {isFiltering && (
              <button
                onClick={resetFilters}
                className="flex items-center gap-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
              >
                <FilterX className="h-4 w-4" />
                <span>Reset</span>
              </button>
            )}
          </div>
        </div>
      </div>
      
      {loading ? (
        <div className="py-8 flex justify-center">
          <div className="animate-pulse text-gray-500">Loading videos...</div>
        </div>
      ) : error ? (
        <div className="bg-red-50 text-red-800 p-6 rounded-xl text-center">
          <p>{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-red-100 text-red-800 rounded-lg hover:bg-red-200"
          >
            Try Again
          </button>
        </div>
      ) : (
        <>
          {isFiltering && (
            <div className="mb-4 text-sm text-gray-500">
              Showing {filteredVideos.length} of {videos.length} videos
              {categoryFilter !== 'all' && ` in ${categoryFilter}`}
              {channelFilter !== 'all' && ` from ${channelFilter}`}
              {showPublishedOnly && ', published only'}
              {showFeaturedOnly && ', featured only'}
              {searchQuery && `, matching "${searchQuery}"`}
            </div>
          )}
          
          <VideoList 
            videos={filteredVideos}
            onDelete={handleDeleteVideo}
            onPreview={handlePreviewVideo}
          />
        </>
      )}
      
      {/* Video Player Modal */}
      <VideoPlayerModal 
        isOpen={selectedVideo !== null}
        onClose={() => setSelectedVideo(null)}
        videoId={selectedVideo?.embedId || ''}
        title={selectedVideo?.title || ''}
      />
    </div>
  );
} 