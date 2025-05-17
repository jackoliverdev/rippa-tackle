import { FileText } from 'lucide-react';
import PageTitle from '@/components/admin/page-title';
import BlogForm from '@/components/admin/blogs/blog-form';

export default function CreateBlogPage() {
  return (
    <div>
      <PageTitle 
        title="Create New Blog Post" 
        description="Write a new article for your fishing blog"
        icon={<FileText className="w-5 h-5" />}
      />
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <BlogForm />
      </div>
    </div>
  );
} 