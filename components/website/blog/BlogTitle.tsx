import React from 'react';
import Image from 'next/image';
import { Blog } from '@/lib/types';

interface BlogTitleProps {
  blog: Blog;
  className?: string;
}

export default function BlogTitle({ blog, className = '' }: BlogTitleProps) {
  const { 
    title, 
    author, 
    author_image, 
    published_at, 
    read_time, 
    views, 
    category, 
    tags 
  } = blog;
  
  const formattedDate = published_at 
    ? new Date(published_at).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : '';

  return (
    <div className={`py-6 ${className}`}>
      {/* Category and Tags */}
      <div className="flex flex-wrap gap-2 mb-4">
        {category && (
          <span className="bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-100 text-xs font-semibold px-3 py-1 rounded-full">
            {category}
          </span>
        )}
        
        {tags && tags.length > 0 && tags.slice(0, 3).map((tag, index) => (
          <span 
            key={index} 
            className="bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs font-medium px-3 py-1 rounded-full"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Title */}
      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
        {title}
      </h1>

      {/* Author and Metadata */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-gray-200 dark:border-gray-800 pb-6">
        <div className="flex items-center mb-4 sm:mb-0">
          {author_image ? (
            <div className="relative h-12 w-12 rounded-full overflow-hidden mr-4">
              <Image
                src={author_image}
                alt={author || 'Author'}
                fill
                className="object-cover"
              />
            </div>
          ) : (
            <div className="h-12 w-12 rounded-full bg-gray-200 dark:bg-gray-700 mr-4 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
          )}
          
          <div>
            <div className="font-medium text-gray-900 dark:text-white">
              {author || 'Anonymous'}
            </div>
            
            {formattedDate && (
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {formattedDate}
              </div>
            )}
          </div>
        </div>
        
        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 space-x-6">
          {read_time && (
            <span className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {read_time} min read
            </span>
          )}
          
          {views !== undefined && (
            <span className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              {views} views
            </span>
          )}
        </div>
      </div>
    </div>
  );
} 