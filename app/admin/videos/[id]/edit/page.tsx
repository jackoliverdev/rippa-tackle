"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { VideoIcon, Loader2 } from 'lucide-react';
import PageTitle from '@/components/admin/page-title';
import VideoForm from '@/components/admin/videos/video-form';
import { getVideoById } from '@/lib/video-service';
import { Video } from '@/lib/types';

export default function EditVideoPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const videoId = params?.id || '';
  
  const [video, setVideo] = useState<Video | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchVideo = async () => {
      try {
        if (!videoId) {
          router.push('/admin/videos');
          return;
        }
        
        console.log(`Fetching video with ID: ${videoId}`);
        
        const videoData = await getVideoById(videoId);
        
        if (!videoData) {
          throw new Error(`Video not found for ID: ${videoId}`);
        }
        
        setVideo(videoData);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load video';
        setError(errorMessage);
        console.error(`Error loading video (ID: ${videoId}):`, err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchVideo();
  }, [videoId, router]);
  
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="h-10 w-10 text-blue-600 animate-spin mb-4" />
        <p className="text-gray-600">Loading video...</p>
      </div>
    );
  }
  
  if (error || !video) {
    return (
      <div className="bg-red-50 text-red-800 p-8 rounded-xl text-center my-8">
        <h2 className="text-xl font-bold mb-4">Error Loading Video</h2>
        <p className="mb-2">{error || 'Video not found'}</p>
        <p className="mb-6 text-sm text-red-700">Video ID: {videoId}</p>
        <button 
          onClick={() => router.push('/admin/videos')}
          className="px-6 py-2 bg-red-100 text-red-800 rounded-lg hover:bg-red-200"
        >
          Back to Videos
        </button>
      </div>
    );
  }
  
  return (
    <div>
      <PageTitle 
        title={`Edit: ${video.title}`}
        description="Update video details and settings"
        icon={<VideoIcon className="w-5 h-5" />}
      />
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <VideoForm video={video} isEdit={true} />
      </div>
    </div>
  );
} 