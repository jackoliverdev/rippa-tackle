"use client";

import { useWishlist } from "@/context/wishlist-context";
import { WishlistItem } from "./WishlistItem";
import { Heart } from "lucide-react";
import Link from "next/link";

export function WishlistContent() {
  const { wishlist } = useWishlist();

  if (wishlist.length === 0) {
    return (
      <div className="py-16 text-center bg-white rounded-xl shadow-sm">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
          <Heart className="h-8 w-8 text-blue-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Your wishlist is empty</h2>
        <p className="text-gray-600 max-w-md mx-auto mb-6">
          Browse our products and add items you're interested in to your wishlist.
        </p>
        <Link 
          href="/products" 
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-md px-5 py-2.5 font-medium transition-colors inline-flex items-center"
        >
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="border-b border-gray-200 py-4 px-6 bg-gray-50">
        <h2 className="text-lg font-medium text-gray-900">
          Wishlist Items ({wishlist.length})
        </h2>
      </div>
      
      <div>
        {wishlist.map((product) => (
          <WishlistItem key={product.id} product={product} />
        ))}
      </div>
      
      <div className="p-6 bg-gray-50 flex justify-end">
        <Link 
          href="/products" 
          className="bg-blue-600 hover:bg-blue-700 text-white rounded-md px-5 py-2.5 font-medium transition-colors inline-flex items-center"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
} 