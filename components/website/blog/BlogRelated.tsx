'use client';

import React, { useEffect, useState } from 'react';
import { Blog } from '@/lib/types';
import { getRelatedBlogs } from '@/lib/blog-service';
import BlogCard from './BlogCard';

interface BlogRelatedProps {
  blogId: string;
  limit?: number;
  className?: string;
}

export default function BlogRelated({ blogId, limit = 3, className = '' }: BlogRelatedProps) {
  const [relatedBlogs, setRelatedBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch related blogs when component mounts
  useEffect(() => {
    const fetchRelatedBlogs = async () => {
      try {
        setLoading(true);
        const blogs = await getRelatedBlogs(blogId, limit);
        setRelatedBlogs(blogs);
        setError(null);
      } catch (err) {
        setError('Failed to load related blogs');
        console.error('Error fetching related blogs:', err);
      } finally {
        setLoading(false);
      }
    };

    if (blogId) {
      fetchRelatedBlogs();
    }
  }, [blogId, limit]);

  if (loading) {
    return (
      <div className={`mt-10 ${className}`}>
        <h2 className="text-2xl font-bold mb-6">Related Articles</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Array.from({ length: limit }).map((_, index) => (
            <div 
              key={index} 
              className="bg-gray-100 dark:bg-gray-800 rounded-xl h-64 animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return null; // Don't show anything if there's an error
  }

  if (relatedBlogs.length === 0) {
    return null; // Don't show anything if there are no related blogs
  }

  return (
    <div className={`mt-10 ${className}`}>
      <h2 className="text-2xl font-bold mb-6">Related Articles</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {relatedBlogs.map((blog) => (
          <BlogCard
            key={blog.id}
            blog={blog}
            compact={true}
          />
        ))}
      </div>
    </div>
  );
} 