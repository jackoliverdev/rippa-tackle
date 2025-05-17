"use client";

import { ShoppingCart, Check, Loader2 } from "lucide-react";
import { useCart } from "@/context/cart-context";
import { Product } from "@/types/product";
import { useState, useEffect } from "react";
import { toast } from "sonner";

interface AddToCartButtonProps {
  product: Product;
  className?: string;
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  quantity?: number;
  showQuantity?: boolean;
  variant?: "primary" | "secondary" | "outline";
}

export function AddToCartButton({ 
  product, 
  className = "", 
  size = "md", 
  showText = false,
  quantity = 1,
  showQuantity = false,
  variant = "primary"
}: AddToCartButtonProps) {
  const { addToCart, isInCart, getCartQuantity } = useCart();
  const [isInBag, setIsInBag] = useState(false);
  const [cartQuantity, setCartQuantity] = useState(0);
  const [isAdding, setIsAdding] = useState(false);
  
  // Need to use effect because initial server render won't have access to localStorage
  useEffect(() => {
    setIsInBag(isInCart(product.id));
    setCartQuantity(getCartQuantity(product.id));
  }, [isInCart, getCartQuantity, product.id]);
  
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsAdding(true);
    
    // Simulate network delay for a better UX
    setTimeout(() => {
      addToCart(product, quantity);
      toast.success(`${product.name} added to cart`);
      setIsInBag(true);
      setCartQuantity(prev => prev + quantity);
      setIsAdding(false);
    }, 300);
  };
  
  // Size classes
  const sizeClasses = {
    sm: "p-1.5 rounded-full",
    md: "p-2.5 rounded-md",
    lg: "p-3 rounded-lg",
  };
  
  const iconSizes = {
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-6 w-6",
  };
  
  // Variant classes
  const variantClasses = {
    primary: "bg-blue-600 hover:bg-blue-700 text-white border border-blue-600",
    secondary: "bg-amber-500 hover:bg-amber-600 text-white border border-amber-500",
    outline: "bg-white hover:bg-gray-50 text-blue-600 border border-blue-600 hover:border-blue-700"
  };

  return (
    <button
      onClick={handleAddToCart}
      className={`
        ${variantClasses[variant]} 
        ${sizeClasses[size]} 
        transition-colors duration-200
        ${isInBag ? 'flex items-center justify-center' : ''}
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
      title={isInBag ? "Added to cart" : "Add to cart"}
      disabled={isAdding || !product.inventory || product.inventory <= 0}
    >
      {isAdding ? (
        <Loader2 className={`${iconSizes[size]} animate-spin`} />
      ) : isInBag && !showText ? (
        <Check className={iconSizes[size]} />
      ) : (
        <div className="flex items-center">
          <ShoppingCart className={iconSizes[size]} />
          {showText && (
            <span className="ml-2 text-sm font-medium">
              {isInBag ? "Added to cart" : "Add to cart"}
            </span>
          )}
          {showQuantity && cartQuantity > 0 && (
            <span className="ml-1.5 text-xs bg-white/20 px-1.5 py-0.5 rounded-full font-medium">
              {cartQuantity}
            </span>
          )}
        </div>
      )}
    </button>
  );
} 