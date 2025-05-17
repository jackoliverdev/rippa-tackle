"use client";

import { Heart, Fish, ShoppingCart, Trash2 } from "lucide-react";
import Link from "next/link";
import { useWishlist } from "@/context/wishlist-context";
import { toast } from "sonner";

export default function WishlistHero() {
  const { wishlist, clearWishlist } = useWishlist();
  
  const handleClearWishlist = () => {
    clearWishlist();
    toast.success("Wishlist cleared");
  };
  
  return (
    <section 
      className="relative bg-blue-900 pt-12 md:pt-20 pb-16 md:pb-24" 
      style={{ 
        clipPath: 'polygon(0 0, 100% 0, 100% 95%, 0 100%)',
        marginBottom: '-1px' // Ensure no gap with next section
      }}
    >
      {/* Swimming fish across the hero section - hidden on mobile */}
      <div className="absolute inset-0 overflow-hidden hidden md:block">
        {[...Array(8)].map((_, i) => {
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
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-700/30 text-blue-300 mb-4 border border-blue-600/20">
            <Heart className="w-4 h-4 mr-2" />
            <span className="font-semibold text-sm">Your Wishlist</span>
          </div>
          
          <h1 className="text-3xl md:text-4xl xl:text-5xl font-bold text-white leading-tight mb-4">
            Items You've <span className="text-blue-400">Saved</span>
          </h1>
          
          <p className="text-blue-100 text-lg mb-6 max-w-xl mx-auto">
            {wishlist.length > 0 
              ? `You have ${wishlist.length} item${wishlist.length !== 1 ? 's' : ''} in your wishlist.`
              : "Your wishlist is currently empty. Browse our products and add items you're interested in!"}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link 
              href="/products" 
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2.5 rounded-md inline-flex items-center justify-center transition-colors shadow-lg hover:shadow-blue-500/20"
            >
              <ShoppingCart className="mr-2 h-4 w-4" />
              Browse Products
            </Link>
            
            {wishlist.length > 0 && (
              <button 
                onClick={handleClearWishlist}
                className="bg-blue-800/50 hover:bg-blue-700/60 text-white border border-blue-600/30 font-medium px-5 py-2.5 rounded-md inline-flex items-center justify-center transition-colors backdrop-blur-sm"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Clear Wishlist
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
} 