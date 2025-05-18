'use client';

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { PlayCircle, Loader2, Eye, Calendar } from "lucide-react";
import { Video } from "@/lib/types";
import { getVideosByChannelDirect } from '@/lib/video-service';
import { VideoPlayerModal } from './VideoPlayerModal';

export const FeaturedVideos = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<null | {
    embedId: string;
    title: string;
  }>(null);

  useEffect(() => {
    const fetchVideos = async () => {
      setLoading(true);
      try {
        // Fetch videos from both channels
        const [jacobVideos, henryVideos] = await Promise.all([
          getVideosByChannelDirect('Jacob London Carper'),
          getVideosByChannelDirect('Henry Lennon')
        ]);
        
        // Combine, sort by views, and get the top 4
        const allVideos = [...jacobVideos, ...henryVideos]
          .sort((a, b) => {
            const viewsA = parseInt(a.views || '0', 10);
            const viewsB = parseInt(b.views || '0', 10);
            return viewsB - viewsA;
          })
          .slice(0, 4);
        
        setVideos(allVideos);
      } catch (error) {
        console.error('Error fetching featured videos:', error);
        setError('Failed to load videos');
        // Fallback to sample data if API fails
        setVideos(sampleVideos);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, []);

  // Backup sample videos in case the API fetch fails
  const sampleVideos: Video[] = [
    {
      id: '1',
      title: "How To Catch Carp in Summer - Top Tips",
      embed_id: "dQw4w9WgXcQ",
      thumbnail: "/videos/sample-video-1.jpg",
      duration: "12:45",
      views: "15420",
      display_date: "2 weeks ago",
      channel: "Jacob London Carper",
      published: true,
      featured: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: '2',
      title: "My 3 BEST Carp Rigs - How & When To Use Them",
      embed_id: "dQw4w9WgXcQ",
      thumbnail: "/videos/sample-video-2.jpg",
      duration: "18:32",
      views: "28765",
      display_date: "1 month ago",
      channel: "Henry Lennon",
      published: true,
      featured: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: '3',
      title: "Carp Fishing with Surface Baits - Complete Guide",
      embed_id: "dQw4w9WgXcQ",
      thumbnail: "/videos/sample-video-3.jpg",
      duration: "14:08",
      views: "9876",
      display_date: "3 weeks ago",
      channel: "Jacob London Carper",
      published: true,
      featured: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: '4',
      title: "Overnight Session at Linear Fisheries - Epic Catch",
      embed_id: "dQw4w9WgXcQ",
      thumbnail: "/videos/sample-video-4.jpg",
      duration: "22:15",
      views: "32104",
      display_date: "2 months ago",
      channel: "Henry Lennon",
      published: true,
      featured: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ];

  return (
    <>
      <section className="py-8 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center mb-10">
            <div>
              <h2 className="text-3xl font-bold text-blue-800 mb-1">Featured Videos</h2>
              <p className="text-slate-600">Top tips and tactics from our pro anglers</p>
            </div>
            <Link 
              href="/videos" 
              className="mt-4 md:mt-0 px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
            >
              <PlayCircle className="mr-2 h-4 w-4" />
              View All Videos
            </Link>
          </div>
          
          {loading ? (
            <div className="flex justify-center items-center h-48">
              <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
            </div>
          ) : videos.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {videos.map((video) => (
                <div 
                  key={video.id} 
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => setSelectedVideo({ embedId: video.embed_id, title: video.title })}
                >
                  <div className="relative h-48 group">
                    <img 
                      src={video.thumbnail} 
                      alt={video.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="bg-blue-600 rounded-full p-3 transform scale-90 group-hover:scale-100 transition-transform">
                        <PlayCircle className="h-8 w-8 text-white" />
                      </div>
                    </div>
                    <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                      {video.duration}
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium text-slate-900 line-clamp-2 h-12">{video.title}</h3>
                    <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
                      <div className="flex items-center">
                        <Eye className="h-3 w-3 mr-1" />
                        <span>{parseInt(video.views || '0', 10).toLocaleString()} views</span>
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        <span>{video.display_date}</span>
                      </div>
                    </div>
                    <div className="mt-3 text-xs font-medium text-blue-700">
                      {video.channel}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 bg-white rounded-lg shadow">
              <p className="text-slate-600">No videos found</p>
            </div>
          )}
        </div>
      </section>

      {/* Video Player Modal */}
      <VideoPlayerModal 
        isOpen={selectedVideo !== null}
        onClose={() => setSelectedVideo(null)}
        videoId={selectedVideo?.embedId || ''}
        title={selectedVideo?.title || ''}
      />
    </>
  );
}; 