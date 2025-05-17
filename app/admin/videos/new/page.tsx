import { VideoIcon } from 'lucide-react';
import PageTitle from '@/components/admin/page-title';
import VideoForm from '@/components/admin/videos/video-form';

export default function CreateVideoPage() {
  return (
    <div>
      <PageTitle 
        title="Create New Video" 
        description="Add a new fishing video to your site"
        icon={<VideoIcon className="w-5 h-5" />}
      />
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <VideoForm />
      </div>
    </div>
  );
} 