"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { FileText, Loader2 } from 'lucide-react';
import PageTitle from '@/components/admin/page-title';
import BlogForm from '@/components/admin/blogs/blog-form';
import { getBlogById } from '@/lib/blog-service';
import { Blog } from '@/lib/types';

export default function EditBlogPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const blogId = params?.id || '';
  
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchBlog = async () => {
      try {
        if (!blogId) {
          router.push('/admin/blogs');
          return;
        }
        
        console.log(`Fetching blog with ID: ${blogId}`);
        
        const blogData = await getBlogById(blogId);
        
        if (!blogData) {
          throw new Error(`Blog post not found for ID: ${blogId}`);
        }
        
        setBlog(blogData);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load blog post';
        setError(errorMessage);
        console.error(`Error loading blog post (ID: ${blogId}):`, err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchBlog();
  }, [blogId, router]);
  
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="h-10 w-10 text-blue-600 animate-spin mb-4" />
        <p className="text-gray-600">Loading blog post...</p>
      </div>
    );
  }
  
  if (error || !blog) {
    return (
      <div className="bg-red-50 text-red-800 p-8 rounded-xl text-center my-8">
        <h2 className="text-xl font-bold mb-4">Error Loading Blog Post</h2>
        <p className="mb-2">{error || 'Blog post not found'}</p>
        <p className="mb-6 text-sm text-red-700">Blog ID: {blogId}</p>
        <button 
          onClick={() => router.push('/admin/blogs')}
          className="px-6 py-2 bg-red-100 text-red-800 rounded-lg hover:bg-red-200"
        >
          Back to Blog Posts
        </button>
      </div>
    );
  }
  
  return (
    <div>
      <PageTitle 
        title={`Edit: ${blog.title}`}
        description="Update blog post content and settings"
        icon={<FileText className="w-5 h-5" />}
      />
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <BlogForm blog={blog} isEdit={true} />
      </div>
    </div>
  );
} 