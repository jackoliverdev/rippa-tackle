"use client";

import { useWishlist } from "@/context/wishlist-context";
import { Heart, ShoppingBag, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";

export function WishlistDropdown() {
  const { wishlist, removeFromWishlist } = useWishlist();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  // Format price with £ symbol
  const formatPrice = (price: string | number): string => {
    const numericPrice = typeof price === 'string' ? parseFloat(price) : price;
    
    if (isNaN(numericPrice)) {
      return '£0.00';
    }
    
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      minimumFractionDigits: 2
    }).format(numericPrice);
  };
  
  // Close the dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  
  // Limit the number of items shown in the dropdown
  const visibleItems = wishlist.slice(0, 3);
  const remainingItems = Math.max(0, wishlist.length - 3);
  
  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        className="text-white flex flex-col items-center relative"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="relative">
          <Heart className="h-6 w-6 mb-1" />
          {wishlist.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
              {wishlist.length}
            </span>
          )}
        </div>
        <span className="text-xs">WISHLIST</span>
      </button>
      
      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden z-50">
          <div className="p-3 border-b border-gray-100 flex items-center justify-between">
            <h3 className="font-medium text-gray-800">Your Wishlist</h3>
            <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-gray-600">
              <X className="h-4 w-4" />
            </button>
          </div>
          
          {wishlist.length === 0 ? (
            <div className="p-4 text-center">
              <p className="text-sm text-gray-500 mb-2">Your wishlist is empty</p>
              <Link 
                href="/products" 
                className="text-sm text-blue-600 hover:text-blue-800"
                onClick={() => setIsOpen(false)}
              >
                Browse products
              </Link>
            </div>
          ) : (
            <>
              <div className="max-h-72 overflow-y-auto">
                {visibleItems.map((product) => (
                  <div key={product.id} className="p-3 border-b border-gray-100 flex items-center gap-3">
                    <div className="w-12 h-12 bg-gray-100 rounded overflow-hidden relative flex-shrink-0">
                      {product.images && product.images.length > 0 ? (
                        <Image
                          src={product.images[0].url}
                          alt={product.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full w-full">
                          <ShoppingBag className="h-4 w-4 text-gray-400" />
                        </div>
                      )}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <Link 
                        href={`/products/${product.slug}`}
                        className="text-sm font-medium text-gray-900 hover:text-blue-600 transition-colors line-clamp-1"
                        onClick={() => setIsOpen(false)}
                      >
                        {product.name}
                      </Link>
                      <div className="text-sm font-medium text-blue-600">
                        {formatPrice(product.price)}
                      </div>
                    </div>
                    
                    <button 
                      onClick={() => removeFromWishlist(product.id)}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                      title="Remove from wishlist"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
                
                {remainingItems > 0 && (
                  <div className="p-3 text-center text-sm text-gray-500">
                    + {remainingItems} more item{remainingItems !== 1 ? 's' : ''}
                  </div>
                )}
              </div>
              
              <div className="p-3 bg-gray-50">
                <Link 
                  href="/wishlist" 
                  className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md py-2 px-4 w-full block text-center"
                  onClick={() => setIsOpen(false)}
                >
                  View Wishlist
                </Link>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
} 