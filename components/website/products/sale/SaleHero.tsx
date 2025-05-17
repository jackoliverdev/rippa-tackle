'use client';

import Image from 'next/image';
import { ShoppingBag, Search, Tag, Fish, ArrowRight } from 'lucide-react';
import { useState } from 'react';
import Link from 'next/link';

export const SaleHero = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Implement search functionality
    console.log('Searching for:', searchQuery);
  };

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
              <Tag className="mr-1 h-4 w-4" />
              <span className="font-semibold text-sm">Limited Time Offers</span>
            </div>
            
            <h1 className="text-3xl md:text-4xl xl:text-5xl font-bold text-white leading-tight mb-4">
              Grab a <span className="text-blue-400">Bargain</span> on Premium Tackle
            </h1>
            
            <p className="text-blue-100 text-lg mb-6 max-w-xl mx-auto md:mx-0">
              Save up to 50% on selected fishing tackle and accessories. Once they're gone, they're gone!
            </p>
            
            <form onSubmit={handleSearchSubmit} className="relative mb-6 max-w-md mx-auto md:mx-0">
              <input
                type="text"
                placeholder="Search for sale items..."
                className="w-full py-3 px-5 pr-12 rounded-lg text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button 
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-blue-600 p-2 rounded-md text-white hover:bg-blue-700 transition-colors"
              >
                <Search className="h-5 w-5" />
              </button>
            </form>
            
            <div className="flex flex-wrap gap-3 justify-center md:justify-start">
              <Link 
                href="/products/sale?category=tackle" 
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2.5 rounded-md inline-flex items-center justify-center transition-colors shadow-lg hover:shadow-blue-500/20"
              >
                Tackle Sale
              </Link>
              <Link 
                href="/products/sale?category=bait" 
                className="bg-blue-800/50 hover:bg-blue-700/60 text-white border border-blue-600/30 font-medium px-5 py-2.5 rounded-md inline-flex items-center justify-center transition-colors backdrop-blur-sm"
              >
                Bait Offers
              </Link>
              <Link 
                href="/products/sale?category=accessories" 
                className="bg-blue-800/50 hover:bg-blue-700/60 text-white border border-blue-600/30 font-medium px-5 py-2.5 rounded-md inline-flex items-center justify-center transition-colors backdrop-blur-sm"
              >
                Accessory Deals
              </Link>
              <Link 
                href="/products" 
                className="bg-blue-800/50 hover:bg-blue-700/60 text-white border border-blue-600/30 font-medium px-5 py-2.5 rounded-md inline-flex items-center justify-center transition-colors backdrop-blur-sm"
              >
                All Products
              </Link>
            </div>
          </div>
          
          {/* Product showcase */}
          <div className="md:w-1/2 order-2 md:order-2 relative mb-6 md:mb-0 md:ml-auto">
            <div className="relative mx-auto md:mr-0 w-[400px] h-[280px] md:w-[550px] md:h-[380px]">
              {/* Background glow */}
              <div 
                className="absolute inset-0 bg-blue-600 rounded-3xl opacity-30"
                style={{ 
                  filter: 'blur(25px)',
                  transform: 'scale(1.05)'
                }}
              />
              
              {/* Product showcase */}
              <div className="absolute inset-0 overflow-hidden rounded-2xl shadow-2xl border-4 border-white/10">
                <Image 
                  src="/products/rippa_mystery.png" 
                  alt="Rippa Tackle sale product showcase" 
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 400px, 550px"
                  priority
                />
              </div>
              
              {/* Product badge */}
              <div className="absolute bottom-6 left-6 right-6 text-center z-20 bg-blue-800/80 backdrop-blur-sm p-3 rounded-xl border border-blue-700 shadow-lg">
                <h3 className="text-white font-bold text-xl">Massive Savings</h3>
                <p className="text-blue-200 font-medium text-sm">Premium Tackle at Discounted Prices</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SaleHero; 