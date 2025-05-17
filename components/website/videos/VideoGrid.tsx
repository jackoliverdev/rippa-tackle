'use client';

import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { YoutubeIcon, Clock, Eye, Calendar, Loader2 } from 'lucide-react';
import { VideoPlayerModal } from '@/components/website/VideoPlayerModal';
import { Video } from '@/lib/types';
import { getVideosByChannelDirect } from '@/lib/video-service';

// Video Card component
const VideoCard = ({ video, onClick }: { video: Video, onClick: () => void }) => (
  <div 
    className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow cursor-pointer"
    onClick={onClick}
  >
    <div className="relative">
      <img 
        src={video.thumbnail} 
        alt={video.title}
        className="w-full aspect-video object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
        <div className="bg-blue-600 rounded-full p-4 shadow-lg transform scale-90 group-hover:scale-100 transition-transform">
          <YoutubeIcon className="h-10 w-10 text-white" />
        </div>
      </div>
      <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
        {video.duration}
      </div>
    </div>
    <div className="p-4">
      <h3 className="font-medium text-slate-900 line-clamp-2 mb-2">{video.title}</h3>
      <div className="flex justify-between items-center text-xs text-slate-500">
        <div className="flex items-center">
          <Eye className="h-3 w-3 mr-1" />
          <span>{video.views} views</span>
        </div>
        <div className="flex items-center">
          <Calendar className="h-3 w-3 mr-1" />
          <span>{video.display_date}</span>
        </div>
      </div>
    </div>
  </div>
);

export const VideoGrid = () => {
  const [selectedVideo, setSelectedVideo] = useState<null | {
    embedId: string;
    title: string;
  }>(null);
  
  const [jacobVideos, setJacobVideos] = useState<Video[]>([]);
  const [henryVideos, setHenryVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        // Fetch videos for both channels in parallel
        const [jacobData, henryData] = await Promise.all([
          getVideosByChannelDirect('Jacob London Carper'),
          getVideosByChannelDirect('Henry Lennon')
        ]);
        
        setJacobVideos(jacobData);
        setHenryVideos(henryData);
      } catch (err) {
        console.error('Error loading videos:', err);
        setError('Failed to load videos. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchVideos();
  }, []);
  
  return (
    <>
      <section className="py-10 bg-blue-50">
        <div className="container mx-auto px-4">
          <Tabs defaultValue="jacob" className="w-full">
            <div className="flex justify-center mb-6">
              <TabsList className="bg-blue-100/70">
                <TabsTrigger 
                  value="jacob" 
                  className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                  id="jacob-videos"
                >
                  Jacob London Carper
                </TabsTrigger>
                <TabsTrigger 
                  value="henry" 
                  className="data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                  id="henry-videos"
                >
                  Henry Lennon
                </TabsTrigger>
              </TabsList>
            </div>
            
            {loading ? (
              <div className="py-20 flex flex-col items-center justify-center">
                <Loader2 className="h-10 w-10 text-blue-600 animate-spin mb-4" />
                <p className="text-gray-600">Loading videos...</p>
              </div>
            ) : error ? (
              <div className="py-20 text-center text-red-600">
                <p>{error}</p>
              </div>
            ) : (
              <>
                <TabsContent value="jacob" className="mt-0">
                  {jacobVideos.length === 0 ? (
                    <div className="py-10 text-center text-gray-500">
                      <p>No videos available for Jacob London Carper.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      {jacobVideos.map(video => (
                        <VideoCard 
                          key={video.id} 
                          video={video} 
                          onClick={() => setSelectedVideo({ embedId: video.embed_id, title: video.title })}
                        />
                      ))}
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="henry" className="mt-0">
                  {henryVideos.length === 0 ? (
                    <div className="py-10 text-center text-gray-500">
                      <p>No videos available for Henry Lennon.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      {henryVideos.map(video => (
                        <VideoCard 
                          key={video.id} 
                          video={video} 
                          onClick={() => setSelectedVideo({ embedId: video.embed_id, title: video.title })}
                        />
                      ))}
                    </div>
                  )}
                </TabsContent>
              </>
            )}
          </Tabs>
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