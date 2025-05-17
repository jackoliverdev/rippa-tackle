"use client";

import Image from "next/image";
import Link from "next/link";
import { Trash2, Plus, Minus } from "lucide-react";
import { CartItem as CartItemType } from "@/context/cart-context";
import { useCart } from "@/context/cart-context";
import { toast } from "sonner";

interface CartItemProps {
  item: CartItemType;
  isDropdown?: boolean;
}

export function CartItem({ item, isDropdown = false }: CartItemProps) {
  const { removeFromCart, updateQuantity } = useCart();
  
  const handleRemove = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    removeFromCart(item.id);
    toast.success(`${item.name} removed from cart`);
  };
  
  const incrementQuantity = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const newQuantity = item.quantity + 1;
    updateQuantity(item.id, newQuantity);
  };
  
  const decrementQuantity = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (item.quantity > 1) {
      const newQuantity = item.quantity - 1;
      updateQuantity(item.id, newQuantity);
    } else {
      removeFromCart(item.id);
      toast.success(`${item.name} removed from cart`);
    }
  };
  
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
  
  // Calculate item total price
  const totalPrice = typeof item.price === 'string' 
    ? parseFloat(item.price) * item.quantity 
    : item.price * item.quantity;
  
  // Helper function to safely get an image URL from different formats
  const getImageUrl = (image: any): string => {
    if (!image) return '/placeholder-product.png';
    
    if (typeof image === 'string') return image;
    
    if (typeof image === 'object') {
      // Handle case where image is an object with url property
      if (image.url) return image.url;
      
      // Handle case where image might be stringifiable
      try {
        return String(image);
      } catch (e) {
        console.error('Failed to convert image to string:', e);
        return '/placeholder-product.png';
      }
    }
    
    return '/placeholder-product.png';
  };
  
  // Check for position-based images or isPrimary flag
  const primaryImage = item.images?.find(img => img.position === 1 || img.isPrimary) || item.images?.[0];
  
  if (isDropdown) {
    // Simplified version for dropdown
    return (
      <div className="flex items-center p-2 hover:bg-gray-50 rounded-md">
        <div className="relative w-16 h-16 rounded overflow-hidden flex-shrink-0">
          {primaryImage ? (
            <Image 
              src={getImageUrl(primaryImage)}
              alt={item.name}
              fill
              className="object-cover"
              sizes="64px"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400">
              <span className="text-xs">No image</span>
            </div>
          )}
        </div>
        
        <div className="ml-3 flex-1 min-w-0">
          <Link href={`/products/${item.slug}`} className="block">
            <h4 className="text-sm font-medium text-gray-900 truncate">{item.name}</h4>
            <div className="flex items-center justify-between mt-1">
              <div className="text-sm text-blue-600 font-semibold">
                {formatPrice(totalPrice)}
              </div>
              <div className="text-xs text-gray-500">
                Qty: {item.quantity}
              </div>
            </div>
          </Link>
        </div>
        
        <button
          onClick={handleRemove}
          className="ml-2 p-1 text-gray-400 hover:text-red-500"
          title="Remove from cart"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    );
  }
  
  // Full version for cart page
  return (
    <div className="flex flex-col sm:flex-row py-6 border-b border-gray-200">
      <div className="flex sm:flex-1 items-center">
        <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-md overflow-hidden flex-shrink-0">
          {primaryImage ? (
            <Image 
              src={getImageUrl(primaryImage)}
              alt={item.name}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 80px, 96px"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400">
              <span className="text-xs">No image</span>
            </div>
          )}
        </div>
        
        <div className="ml-4 flex-1">
          <Link href={`/products/${item.slug}`} className="block">
            <h3 className="text-base font-medium text-gray-900">{item.name}</h3>
            
            {item.brand && (
              <p className="mt-1 text-sm text-gray-500">{item.brand}</p>
            )}
            
            {item.variants && item.variants.length > 0 && (
              <p className="mt-1 text-sm text-gray-500">
                Variant: {item.variants[0].name}
              </p>
            )}
          </Link>
        </div>
      </div>
      
      <div className="flex items-center justify-between mt-4 sm:mt-0 sm:ml-6">
        <div className="flex items-center border border-gray-300 rounded-md">
          <button
            onClick={decrementQuantity}
            className="p-1.5 text-gray-600 hover:text-gray-900"
            title="Decrease quantity"
          >
            <Minus className="h-4 w-4" />
          </button>
          
          <span className="px-2 py-1 text-gray-900 min-w-[2rem] text-center">
            {item.quantity}
          </span>
          
          <button
            onClick={incrementQuantity}
            className="p-1.5 text-gray-600 hover:text-gray-900"
            title="Increase quantity"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
        
        <div className="ml-6 text-right">
          <p className="text-base font-semibold text-blue-700">
            {formatPrice(totalPrice)}
          </p>
          {item.compareAtPrice && (
            <p className="text-sm text-gray-500 line-through">
              {formatPrice(Number(item.compareAtPrice) * item.quantity)}
            </p>
          )}
        </div>
        
        <button
          onClick={handleRemove}
          className="ml-4 p-1.5 text-gray-400 hover:text-red-500"
          title="Remove from cart"
        >
          <Trash2 className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
} 