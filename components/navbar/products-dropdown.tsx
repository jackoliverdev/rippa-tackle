"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { ShoppingBagIcon, ChevronDownIcon } from "lucide-react";

export const ProductsDropdown = () => {
  const [isProductsOpen, setIsProductsOpen] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setIsProductsOpen(true);
  };

  const handleMouseLeave = () => {
    // Add a delay before closing to allow user to move to dropdown content
    timeoutRef.current = setTimeout(() => {
      setIsProductsOpen(false);
    }, 150); // 150ms delay
  };

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <div 
      className="relative" 
      ref={dropdownRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button 
        className="px-4 py-2 text-blue-100 rounded-lg hover:bg-blue-800/60 hover:text-white transition-all duration-200 flex items-center"
        onClick={() => setIsProductsOpen(!isProductsOpen)}
        aria-expanded={isProductsOpen}
        aria-haspopup="true"
      >
        <ShoppingBagIcon className="h-4 w-4 mr-2" />
        Products
        <ChevronDownIcon className="h-4 w-4 ml-1" />
      </button>
      
      {/* Dropdown menu - Added extra padding at the top to increase hit area */}
      {isProductsOpen && (
        <div className="absolute left-0 mt-0 w-48 rounded-md shadow-lg bg-blue-900 ring-1 ring-black ring-opacity-5 focus:outline-none z-10 border border-blue-800/40">
          {/* Added invisible top padding area as a buffer for mouse movement */}
          <div className="h-2"></div>
          <div className="py-1" role="menu" aria-orientation="vertical">
            <Link href="/products" 
              className="block px-4 py-2 text-sm text-blue-100 hover:bg-blue-800/60 hover:text-white transition-all duration-200"
              role="menuitem"
            >
              All Products
            </Link>
            <Link href="/products" 
              className="block px-4 py-2 text-sm text-blue-100 hover:bg-blue-800/60 hover:text-white transition-all duration-200"
              role="menuitem"
            >
              Tackle
            </Link>
            <Link href="/products" 
              className="block px-4 py-2 text-sm text-blue-100 hover:bg-blue-800/60 hover:text-white transition-all duration-200"
              role="menuitem"
            >
              Bait
            </Link>
            <Link href="/products" 
              className="block px-4 py-2 text-sm text-blue-100 hover:bg-blue-800/60 hover:text-white transition-all duration-200"
              role="menuitem"
            >
              Rigs
            </Link>
            <Link href="/products" 
              className="block px-4 py-2 text-sm text-blue-100 hover:bg-blue-800/60 hover:text-white transition-all duration-200"
              role="menuitem"
            >
              Bundles
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}; 