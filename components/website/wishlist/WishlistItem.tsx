"use client";

import Image from "next/image";
import Link from "next/link";
import { Trash2, ShoppingBag } from "lucide-react";
import { Product } from "@/types/product";
import { useWishlist } from "@/context/wishlist-context";
import { toast } from "sonner";

interface WishlistItemProps {
  product: Product;
}

export function WishlistItem({ product }: WishlistItemProps) {
  const { removeFromWishlist } = useWishlist();
  
  const handleRemove = () => {
    removeFromWishlist(product.id);
    toast.success(`${product.name} removed from wishlist`);
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

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center p-4 border-b border-gray-200 gap-4">
      {/* Product image */}
      <div className="w-full sm:w-20 h-20 bg-gray-100 rounded-md overflow-hidden relative flex-shrink-0">
        {product.images && product.images.length > 0 ? (
          <Image
            src={product.images[0].url}
            alt={product.name}
            fill
            className="object-cover"
          />
        ) : (
          <div className="flex items-center justify-center h-full w-full">
            <ShoppingBag className="h-6 w-6 text-gray-400" />
          </div>
        )}
      </div>
      
      {/* Product details */}
      <div className="flex-1 min-w-0">
        <Link 
          href={`/products/${product.slug}`}
          className="text-lg font-medium text-gray-900 hover:text-blue-600 transition-colors"
        >
          {product.name}
        </Link>
        <p className="text-sm text-gray-500 mt-1">
          {product.category} {product.subcategory ? `- ${product.subcategory}` : ''}
        </p>
        {product.shortDescription && (
          <p className="text-sm text-gray-600 mt-1 hidden sm:block">{product.shortDescription}</p>
        )}
      </div>
      
      {/* Price and actions */}
      <div className="flex flex-col items-end gap-2 min-w-[100px]">
        <div className="text-right">
          <div className="text-lg font-medium text-gray-900">{formatPrice(product.price)}</div>
          {product.compareAtPrice && (
            <div className="text-sm text-gray-500 line-through">{formatPrice(product.compareAtPrice)}</div>
          )}
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={handleRemove}
            className="p-2 text-red-500 hover:bg-red-50 rounded-md transition-colors"
            title="Remove from wishlist"
          >
            <Trash2 className="h-5 w-5" />
          </button>
          
          <Link 
            href={`/products/${product.slug}`}
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-md px-3 py-2 text-sm font-medium transition-colors"
          >
            View
          </Link>
        </div>
      </div>
    </div>
  );
} 