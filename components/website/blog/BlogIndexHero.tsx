'use client';

import React, { useState, useEffect } from 'react';
import { ArrowRightIcon, Fish, BookOpen } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { BlogCategory, Blog } from '@/lib/types';
import { getAllBlogs } from '@/lib/blog-service';
import BlogCard from './BlogCard';

interface BlogIndexHeroProps {
  selectedCategory?: BlogCategory | null;
  categories?: BlogCategory[];
  postCount?: number;
}

export default function BlogIndexHero({ selectedCategory, categories = [], postCount }: BlogIndexHeroProps) {
  const [featuredBlog, setFeaturedBlog] = useState<Blog | null>(null);
  
  // Fetch a featured blog when component mounts
  useEffect(() => {
    const fetchFeaturedBlog = async () => {
      try {
        const blogs = await getAllBlogs();
        if (blogs && blogs.length > 0) {
          // Get the first blog as featured (or you could select one with a "featured" flag)
          setFeaturedBlog(blogs[0]);
        }
      } catch (error) {
        console.error('Error fetching featured blog:', error);
      }
    };
    
    fetchFeaturedBlog();
  }, []);
  
  return (
    <section 
      className="relative bg-blue-900 pt-12 md:pt-20 pb-20 md:pb-28" 
      style={{ 
        clipPath: 'polygon(0 0, 100% 0, 100% 95%, 0 100%)',
        marginBottom: '-1px' // Ensure no gap with next section
      }}
    >
      {/* Swimming fish across the hero section - hidden on mobile */}
      <div className="absolute inset-0 overflow-hidden hidden md:block">
        {[...Array(10)].map((_, i) => {
          // Create different animation durations and starting positions
          const duration = 45 + (i % 4) * 12; // Between 45-81s for full journey
          const size = 16 + (i % 3) * 4; // Different sizes (16, 20, 24)
          const verticalPos = 10 + (Math.random() * 70); // Varied vertical positions
          
          // Distribute fish across the entire hero section initially
          const startPosition = Math.random() * 100; // 0-100% across the width
          
          // Simpler delay calculation that won't cause extreme values
          const baseDelay = i * 3; // Base staggered delay
          const offsetDelay = (startPosition / 100) * 8; // Max 8s additional delay based on position
          const delay = baseDelay + offsetDelay;
          
          return (
            <div 
              key={i}
              className="absolute opacity-10 fish-container"
              style={{
                left: `${startPosition}%`,
                top: `${verticalPos}%`,
                zIndex: i % 3, // Different depths
                animation: `swimAcross${i % 4} ${duration}s linear ${delay}s infinite`
              }}
            >
              <Fish 
                className={`text-white h-${size} w-${size}`} 
                style={{ animation: `fishWiggle ${2 + (i % 3)}s ease-in-out infinite` }}
              />
            </div>
          );
        })}
      </div>
      
      {/* Fish swimming animations - only loaded on desktop */}
      <style jsx global>{`
        /* Only apply animations when they're needed (on desktop) */
        @media (min-width: 768px) {
          /* Fish swimming across hero section with pauses */
          @keyframes swimAcross0 {
            0% { transform: translateX(0) rotate(0deg); opacity: 1; }
            15% { transform: translateX(30vw) rotate(0deg); opacity: 1; } /* Swim right */
            20% { transform: translateX(30vw) rotate(0deg); opacity: 1; } /* Pause */
            40% { transform: translateX(70vw) rotate(0deg); opacity: 1; } /* Continue swimming */
            45% { transform: translateX(70vw) rotate(0deg); opacity: 1; } /* Short pause */
            58% { transform: translateX(110vw) rotate(0deg); opacity: 1; } /* Almost off screen */
            59% { transform: translateX(120vw) rotate(0deg); opacity: 0; } /* Just off screen - hide */
            59.1% { transform: translateX(-30vw) rotate(0deg); opacity: 0; } /* Teleport to far left - still hidden */
            62% { transform: translateX(-20vw) rotate(0deg); opacity: 1; } /* Start to reappear from left */
            80% { transform: translateX(30vw) rotate(0deg); opacity: 1; } /* Swim in again */
            100% { transform: translateX(60vw) rotate(0deg); opacity: 1; } /* Continue swimming */
          }
          
          @keyframes swimAcross1 {
            0% { transform: translateX(0) rotate(0deg); opacity: 1; }
            25% { transform: translateX(40vw) rotate(0deg); opacity: 1; } /* Swim right */
            35% { transform: translateX(40vw) rotate(0deg); opacity: 1; } /* Longer pause */
            50% { transform: translateX(80vw) rotate(0deg); opacity: 1; } /* Continue */
            63% { transform: translateX(110vw) rotate(0deg); opacity: 1; } /* Almost off screen */
            64% { transform: translateX(120vw) rotate(0deg); opacity: 0; } /* Off screen - hide */
            64.1% { transform: translateX(-30vw) rotate(0deg); opacity: 0; } /* Teleport to far left - hidden */
            67% { transform: translateX(-20vw) rotate(0deg); opacity: 1; } /* Start to reappear */
            85% { transform: translateX(30vw) rotate(0deg); opacity: 1; } /* Swim in */
            90% { transform: translateX(30vw) rotate(0deg); opacity: 1; } /* Brief pause */
            100% { transform: translateX(50vw) rotate(0deg); opacity: 1; } /* Continue */
          }
          
          @keyframes swimAcross2 {
            0% { transform: translateX(0) rotate(0deg); opacity: 1; }
            20% { transform: translateX(35vw) rotate(0deg); opacity: 1; } /* Swim right */
            25% { transform: translateX(35vw) rotate(0deg); opacity: 1; } /* Short pause */
            50% { transform: translateX(60vw) rotate(0deg); opacity: 1; } /* Continue */
            55% { transform: translateX(60vw) rotate(0deg); opacity: 1; } /* Another pause */
            68% { transform: translateX(110vw) rotate(0deg); opacity: 1; } /* Almost off screen */
            69% { transform: translateX(120vw) rotate(0deg); opacity: 0; } /* Off screen - hide */
            69.1% { transform: translateX(-30vw) rotate(0deg); opacity: 0; } /* Teleport to far left - hidden */
            72% { transform: translateX(-20vw) rotate(0deg); opacity: 1; } /* Start to reappear */
            90% { transform: translateX(40vw) rotate(0deg); opacity: 1; } /* Swim in */
            100% { transform: translateX(60vw) rotate(0deg); opacity: 1; } /* Continue */
          }
          
          @keyframes swimAcross3 {
            0% { transform: translateX(0) rotate(0deg); opacity: 1; }
            30% { transform: translateX(50vw) rotate(0deg); opacity: 1; } /* Swim right */
            40% { transform: translateX(50vw) rotate(0deg); opacity: 1; } /* Pause */
            55% { transform: translateX(80vw) rotate(0deg); opacity: 1; } /* Continue */
            73% { transform: translateX(110vw) rotate(0deg); opacity: 1; } /* Almost off screen */
            74% { transform: translateX(120vw) rotate(0deg); opacity: 0; } /* Off screen - hide */
            74.1% { transform: translateX(-30vw) rotate(0deg); opacity: 0; } /* Teleport to far left - hidden */
            77% { transform: translateX(-20vw) rotate(0deg); opacity: 1; } /* Start to reappear */
            95% { transform: translateX(30vw) rotate(0deg); opacity: 1; } /* Swim in */
            100% { transform: translateX(40vw) rotate(0deg); opacity: 1; } /* Continue */
          }
          
          /* Fish wiggle animation */
          @keyframes fishWiggle {
            0%, 100% { transform: rotate(-5deg); }
            50% { transform: rotate(5deg); }
          }
          
          /* Performance optimizations to prevent flashing */
          .fish-container {
            will-change: transform, opacity;
            backface-visibility: hidden;
            transform-style: preserve-3d;
          }
        }
      `}</style>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row items-center">
          {/* Text content */}
          <div className="md:w-1/2 order-1 md:order-1 mb-8 md:mb-0 text-center md:text-left">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-700/30 text-blue-300 mb-4 border border-blue-600/20">
              <span className="font-semibold text-sm">{selectedCategory || 'Knowledge Base'}</span>
            </div>
            
            <h1 className="text-3xl md:text-4xl xl:text-5xl font-bold text-white leading-tight mb-4">
              {selectedCategory 
                ? `${selectedCategory} Articles`
                : "Carp Fishing Insights & Tips"
              }
            </h1>
            
            <p className="text-blue-100 text-lg mb-6 max-w-xl mx-auto md:mx-0">
              Expert advice, tutorials, and insights to help you catch more and bigger carp on the bank.
            </p>
            
            {/* Category pills */}
            {categories.length > 0 && (
              <div className="flex flex-wrap gap-2 justify-center md:justify-start mb-6">
                <Link 
                  href="/blogs"
                  className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                    !selectedCategory 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-blue-800/30 text-blue-200 hover:bg-blue-700/40'
                  }`}
                >
                  All
                </Link>
                {categories.map(category => (
                  <Link 
                    key={category}
                    href={`/blogs?category=${category}`}
                    className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                      selectedCategory === category 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-blue-800/30 text-blue-200 hover:bg-blue-700/40'
                    }`}
                  >
                    {category}
                  </Link>
                ))}
              </div>
            )}
            
            <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
              <Link 
                href="/blogs/search" 
                className="bg-blue-800/50 hover:bg-blue-700/60 text-white border border-blue-600/30 font-medium px-5 py-2.5 rounded-md inline-flex items-center justify-center transition-colors backdrop-blur-sm"
              >
                Search Articles
              </Link>
              <Link 
                href="/contact" 
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2.5 rounded-md inline-flex items-center justify-center transition-colors shadow-lg hover:shadow-blue-500/20"
              >
                Suggest a Topic
                <ArrowRightIcon className="ml-2 h-4 w-4" />
              </Link>
            </div>
          </div>
          
          {/* Featured Blog Section (replacing the previous image section) */}
          <div className="md:w-1/2 order-2 md:order-2 relative mb-6 md:mb-0 md:ml-auto">
            <div className="relative mx-auto md:mr-0 w-[400px] h-[400px] md:w-[550px] md:h-[500px]">
              {/* Background glow */}
              <div 
                className="absolute inset-0 bg-blue-600 rounded-3xl opacity-30"
                style={{ 
                  filter: 'blur(25px)',
                  transform: 'scale(1.05)'
                }}
              />
              
              {/* Featured blog card */}
              <div className="absolute inset-0 overflow-hidden rounded-2xl shadow-2xl border-4 border-white/10">
                {featuredBlog ? (
                  <div className="h-full w-full flex flex-col">
                    <div className="relative h-3/5 w-full">
                      <Image 
                        src={featuredBlog.feature_image || "/blog_hero.jpg"} 
                        alt={featuredBlog.title} 
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 400px, 550px"
                        priority
                      />
                    </div>
                    <div className="bg-blue-800/90 p-6 h-2/5 flex flex-col justify-between">
                      <div>
                        <h3 className="text-white font-bold text-xl line-clamp-2 mb-2">{featuredBlog.title}</h3>
                        <p className="text-blue-200 line-clamp-2 text-sm">{featuredBlog.summary}</p>
                      </div>
                      <Link
                        href={`/blogs/${featuredBlog.slug}`}
                        className="inline-flex items-center justify-center mt-2 text-blue-200 hover:text-white font-medium transition-colors"
                      >
                        Read Featured Article
                        <ArrowRightIcon className="ml-2 h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                ) : (
                  <Image 
                    src="/blog_hero.jpg" 
                    alt="Carp fishing blog articles" 
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 400px, 550px"
                    priority
                  />
                )}
              </div>
              
              {/* Blog stats badge */}
              <div className="absolute top-6 right-6 z-20 bg-blue-800/80 backdrop-blur-sm px-4 py-2 rounded-xl border border-blue-700 shadow-lg">
                <h3 className="text-white font-bold text-md">Featured Article</h3>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
} 