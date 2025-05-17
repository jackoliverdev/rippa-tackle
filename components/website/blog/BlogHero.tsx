import React from 'react';
import Image from 'next/image';
import { Blog } from '@/lib/types';

interface BlogHeroProps {
  blog: Blog;
  className?: string;
}

export default function BlogHero({ blog, className = '' }: BlogHeroProps) {
  const { title, feature_image, category, published_at, author, read_time } = blog;
  
  const formattedDate = published_at 
    ? new Date(published_at).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : '';

  return (
    <div className={`relative w-full ${className}`}>
      {/* Hero Background */}
      <div className="absolute inset-0 w-full h-full">
        {feature_image ? (
          <Image
            src={feature_image}
            alt={title}
            fill
            priority
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 dark:bg-gray-800" />
        )}
        <div className="absolute inset-0 bg-black bg-opacity-50" />
      </div>
      
      {/* Hero Content */}
      <div className="relative z-10 container mx-auto px-4 py-24 sm:py-32 flex flex-col items-center text-center">
        {category && (
          <span className="inline-block bg-primary-600 text-white text-sm font-medium px-4 py-1.5 rounded-full mb-6">
            {category}
          </span>
        )}
        
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white max-w-4xl mb-6">
          {title}
        </h1>
        
        <div className="flex flex-wrap items-center justify-center text-sm text-white space-x-6">
          {author && (
            <span className="flex items-center mb-2 sm:mb-0">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              {author}
            </span>
          )}
          
          {formattedDate && (
            <span className="flex items-center mb-2 sm:mb-0">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {formattedDate}
            </span>
          )}
          
          {read_time && (
            <span className="flex items-center mb-2 sm:mb-0">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {read_time} min read
            </span>
          )}
        </div>
      </div>
    </div>
  );
} 