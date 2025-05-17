'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Blog } from '@/lib/types';
import { incrementBlogViews, likeBlog } from '@/lib/blog-service';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';

interface BlogDetailProps {
  blog: Blog;
  className?: string;
}

export default function BlogDetail({ blog, className = '' }: BlogDetailProps) {
  const { content, slug } = blog;
  const [likeCount, setLikeCount] = useState<number>(blog.likes || 0);
  const [isLiking, setIsLiking] = useState<boolean>(false);
  const [hasLiked, setHasLiked] = useState<boolean>(false);
  
  // Track view count when component mounts
  useEffect(() => {
    if (slug) {
      incrementBlogViews(slug).catch(error => 
        console.error('Failed to increment blog views:', error)
      );
    }
    
    // Check if user has already liked this blog post
    const likedPosts = localStorage.getItem('rippa_liked_posts');
    if (likedPosts) {
      const likedArray = JSON.parse(likedPosts);
      setHasLiked(likedArray.includes(slug));
    }
  }, [slug]);

  // Handle like button click
  const handleLikeClick = async () => {
    if (!slug || isLiking || hasLiked) return;
    
    setIsLiking(true);
    try {
      const result = await likeBlog(slug);
      
      if (result.success) {
        // Update UI with the returned like count
        if (result.likes !== undefined) {
          setLikeCount(result.likes);
        } else {
          setLikeCount(prevCount => prevCount + 1);
        }
        
        // Store liked status in localStorage
        const likedPosts = localStorage.getItem('rippa_liked_posts');
        const likedArray = likedPosts ? JSON.parse(likedPosts) : [];
        likedArray.push(slug);
        localStorage.setItem('rippa_liked_posts', JSON.stringify(likedArray));
        
        setHasLiked(true);
      }
    } catch (error) {
      console.error('Failed to like blog:', error);
    } finally {
      setIsLiking(false);
    }
  };

  // Helper function to format markdown images
  const formatMarkdownImages = (markdown: string) => {
    // Replace any markdown images with properly sized images
    // This is a simple replace, but you could use a proper markdown parser for more complex scenarios
    return markdown.replace(
      /!\[(.*?)\]\((.*?)\)/g, 
      '![' + '$1' + '](' + '$2' + ' =600x)'
    );
  };

  return (
    <div className={`max-w-4xl mx-auto ${className}`}>
      {/* Blog Content */}
      <div className="prose prose-lg dark:prose-invert prose-headings:font-bold prose-a:text-primary-600 dark:prose-a:text-primary-400 prose-img:rounded-lg prose-img:mx-auto max-w-none">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeRaw, rehypeSanitize]}
        >
          {content || ''}
        </ReactMarkdown>
      </div>

      {/* Social Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-t border-b border-gray-200 dark:border-gray-800 py-6 my-10">
        <div className="flex items-center space-x-4">
          {/* Like Button */}
          <button 
            onClick={handleLikeClick}
            disabled={isLiking || hasLiked}
            className={`flex items-center transition-colors ${
              hasLiked 
                ? 'text-primary-600 dark:text-primary-400 cursor-default' 
                : 'text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400'
            }`}
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className={`h-6 w-6 mr-2 ${hasLiked ? 'fill-current' : 'fill-none'}`} 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={1.5} 
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" 
              />
            </svg>
            <span>
              {hasLiked ? 'Liked' : 'Like'} 
              {likeCount > 0 && ` (${likeCount})`}
              {isLiking && '...'}
            </span>
          </button>
          
          {/* Share Options */}
          <div className="hidden sm:flex items-center space-x-3">
            <span className="text-gray-500 dark:text-gray-400">Share:</span>
            
            {/* Twitter/X Share */}
            <Link
              href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}&text=${encodeURIComponent(blog.title)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 dark:text-gray-300 hover:text-blue-400 transition-colors"
              aria-label="Share on Twitter"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </Link>
            
            {/* Facebook Share */}
            <Link
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 dark:text-gray-300 hover:text-blue-600 transition-colors"
              aria-label="Share on Facebook"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M9.198 21.5h4v-8.01h3.604l.396-3.98h-4V7.5a1 1 0 0 1 1-1h3v-4h-3a5 5 0 0 0-5 5v2.01h-2l-.396 3.98h2.396v8.01Z" />
              </svg>
            </Link>
            
            {/* LinkedIn Share */}
            <Link
              href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 dark:text-gray-300 hover:text-blue-700 transition-colors"
              aria-label="Share on LinkedIn"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M6.5 8C7.32843 8 8 7.32843 8 6.5C8 5.67157 7.32843 5 6.5 5C5.67157 5 5 5.67157 5 6.5C5 7.32843 5.67157 8 6.5 8Z" />
                <path d="M5 10C5 9.44772 5.44772 9 6 9H7C7.55228 9 8 9.44771 8 10V18C8 18.5523 7.55228 19 7 19H6C5.44772 19 5 18.5523 5 18V10Z" />
                <path d="M11 19H12C12.5523 19 13 18.5523 13 18V13.5C13 12 16 11 16 13V18.0004C16 18.5527 16.4477 19 17 19H18C18.5523 19 19 18.5523 19 18V12C19 10 17.5 9 15.5 9C13.5 9 13 10.5 13 10.5V10C13 9.44771 12.5523 9 12 9H11C10.4477 9 10 9.44772 10 10V18C10 18.5523 10.4477 19 11 19Z" />
                <path fillRule="evenodd" clipRule="evenodd" d="M20 1C21.6569 1 23 2.34315 23 4V20C23 21.6569 21.6569 23 20 23H4C2.34315 23 1 21.6569 1 20V4C1 2.34315 2.34315 1 4 1H20ZM20 3C20.5523 3 21 3.44772 21 4V20C21 20.5523 20.5523 21 20 21H4C3.44772 21 3 20.5523 3 20V4C3 3.44772 3.44772 3 4 3H20Z" />
              </svg>
            </Link>
          </div>
        </div>
        
        {/* Back to Blogs */}
        <Link 
          href="/blogs" 
          className="text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
        >
          <span className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            Back to All Blogs
          </span>
        </Link>
      </div>
    </div>
  );
} 