import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { Blog } from '@/lib/types';

interface BlogCardProps {
  blog: Blog;
  compact?: boolean; // For smaller card variations
  className?: string;
}

export default function BlogCard({ blog, compact = false, className = '' }: BlogCardProps) {
  const { 
    slug, 
    title, 
    summary, 
    feature_image, 
    category, 
    published_at, 
    read_time, 
    author, 
    author_image 
  } = blog;

  const formattedDate = published_at 
    ? formatDistanceToNow(new Date(published_at), { addSuffix: true })
    : '';

  return (
    <div className={`group bg-white dark:bg-gray-900 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 ${className}`}>
      <Link href={`/blogs/${slug}`} className="block">
        <div className="relative w-full aspect-video overflow-hidden">
          {feature_image ? (
            <Image
              src={feature_image}
              alt={title}
              fill
              className="object-cover transition-transform group-hover:scale-105 duration-500"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center">
              <span className="text-gray-400">No Image</span>
            </div>
          )}
          {category && (
            <span className="absolute top-4 left-4 bg-primary-600 text-white text-xs font-bold px-3 py-1 rounded-full">
              {category}
            </span>
          )}
        </div>

        <div className="p-4 sm:p-5">
          <h3 className="font-bold text-xl mb-2 text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
            {title}
          </h3>
          
          {!compact && summary && (
            <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
              {summary}
            </p>
          )}
          
          <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center">
              {author_image ? (
                <div className="relative h-6 w-6 rounded-full overflow-hidden mr-2">
                  <Image
                    src={author_image}
                    alt={author || 'Author'}
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="h-6 w-6 rounded-full bg-gray-200 dark:bg-gray-700 mr-2" />
              )}
              <span>{author || 'Admin'}</span>
            </div>
            
            <div className="flex items-center gap-4">
              {read_time && (
                <span className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {read_time} min read
                </span>
              )}
              {formattedDate && (
                <span className="hidden sm:inline">{formattedDate}</span>
              )}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
} 