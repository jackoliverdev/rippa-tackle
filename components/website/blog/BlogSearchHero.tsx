'use client';

import React from 'react';
import { ArrowRightIcon, Fish, Search } from 'lucide-react';
import Link from 'next/link';

interface BlogSearchHeroProps {
  query?: string;
  resultCount?: number;
}

export default function BlogSearchHero({ query, resultCount }: BlogSearchHeroProps) {
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
        <div className="flex flex-col items-center justify-center text-center max-w-3xl mx-auto">
          {/* Category tag */}
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-700/30 text-blue-300 mb-4 border border-blue-600/20">
            <span className="font-semibold text-sm">Blog Search</span>
          </div>
          
          {/* Title */}
          <h1 className="text-3xl md:text-4xl xl:text-5xl font-bold text-white leading-tight mb-4">
            {query 
              ? `Results for "${query}"`
              : "Search Our Fishing Blog"
            }
          </h1>
          
          {query && typeof resultCount !== 'undefined' && (
            <p className="text-blue-200 mb-6">
              {resultCount > 0 
                ? `Found ${resultCount} article${resultCount !== 1 ? 's' : ''}`
                : "No articles found. Try different keywords."
              }
            </p>
          )}
          
          {/* Search Form */}
          <div className="w-full max-w-2xl mx-auto mt-2 mb-8">
            <form action="/blogs/search" method="get" className="flex items-center">
              <div className="relative flex-grow">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-blue-300" />
                </div>
                <input
                  type="text"
                  name="query"
                  defaultValue={query || ''}
                  placeholder="Search for fishing tips, techniques..."
                  className="w-full pl-12 pr-4 py-4 bg-blue-800/40 text-white placeholder-blue-300 border border-blue-700/50 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-400 backdrop-blur-sm"
                  required
                />
              </div>
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-4 rounded-r-lg transition-colors duration-300 font-medium"
              >
                Search
              </button>
            </form>
          </div>
          
          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link 
              href="/blogs" 
              className="bg-blue-800/50 hover:bg-blue-700/60 text-white border border-blue-600/30 font-medium px-5 py-2.5 rounded-md inline-flex items-center justify-center transition-colors backdrop-blur-sm"
            >
              View All Blogs
            </Link>
            {resultCount === 0 && (
              <Link 
                href="/contact"
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2.5 rounded-md inline-flex items-center justify-center transition-colors shadow-lg hover:shadow-blue-500/20"
              >
                Can't Find What You Need?
                <ArrowRightIcon className="ml-2 h-4 w-4" />
              </Link>
            )}
          </div>
        </div>
      </div>
    </section>
  );
} 