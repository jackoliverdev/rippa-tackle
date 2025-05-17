"use client";

import { Heart } from "lucide-react";
import { useWishlist } from "@/context/wishlist-context";
import { Product } from "@/types/product";
import { useState, useEffect } from "react";
import { toast } from "sonner";

interface WishlistButtonProps {
  product: Product;
  className?: string;
  size?: "sm" | "md" | "lg";
  showText?: boolean;
}

export function WishlistButton({ 
  product, 
  className = "", 
  size = "md", 
  showText = false 
}: WishlistButtonProps) {
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const [isInList, setIsInList] = useState(false);
  
  // Need to use effect because initial server render won't have access to localStorage
  useEffect(() => {
    setIsInList(isInWishlist(product.id));
  }, [isInWishlist, product.id]);
  
  const toggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isInList) {
      removeFromWishlist(product.id);
      toast.success(`${product.name} removed from wishlist`);
    } else {
      addToWishlist(product);
      toast.success(`${product.name} added to wishlist`);
    }
    
    setIsInList(!isInList);
  };
  
  // Size classes
  const sizeClasses = {
    sm: "p-1 rounded-full",
    md: "p-2 rounded-full",
    lg: "p-3 rounded-lg",
  };
  
  const iconSizes = {
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-6 w-6",
  };

  return (
    <button
      onClick={toggleWishlist}
      className={`
        ${isInList ? "bg-red-100 text-red-500" : "bg-white/80 backdrop-blur-sm text-gray-500 hover:text-red-500"} 
        ${sizeClasses[size]} 
        transition-colors duration-200 shadow-sm border border-gray-200
        ${className}
      `}
      title={isInList ? "Remove from wishlist" : "Add to wishlist"}
    >
      <Heart 
        className={iconSizes[size]} 
        fill={isInList ? "currentColor" : "none"} 
      />
      {showText && (
        <span className="ml-2 text-sm font-medium">
          {isInList ? "Remove from wishlist" : "Add to wishlist"}
        </span>
      )}
    </button>
  );
} 