"use client";

import { ShoppingBag, Fish, ArrowLeft, Trash2 } from "lucide-react";
import Link from "next/link";
import { useCart } from "@/context/cart-context";
import { toast } from "sonner";

export default function CartHero() {
  const { cart, cartCount, clearCart } = useCart();
  
  const handleClearCart = () => {
    clearCart();
    toast.success("Cart cleared");
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
        <div className="animate-fish-swim absolute -left-32 top-12 opacity-10">
          <Fish className="h-24 w-24 text-white" />
        </div>
        <div className="animate-fish-swim-reverse absolute -right-32 top-32 opacity-10" style={{animationDelay: '2s'}}>
          <Fish className="h-16 w-16 text-white transform -scale-x-100" />
        </div>
        <div className="animate-fish-swim absolute -left-32 bottom-24 opacity-10" style={{animationDelay: '1s'}}>
          <Fish className="h-20 w-20 text-white" />
        </div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-white flex items-center mb-4">
              <ShoppingBag className="h-10 w-10 mr-4" />
              Your Shopping Bag
              {cartCount > 0 && (
                <span className="ml-4 text-lg bg-blue-700 py-1 px-3 rounded-full">
                  {cartCount} {cartCount === 1 ? 'item' : 'items'}
                </span>
              )}
            </h1>
            <p className="text-blue-200 text-lg max-w-2xl">
              Review your items, update quantities, or proceed to checkout
            </p>
          </div>
          
          <div className="mt-6 md:mt-0 flex space-x-3">
            <Link 
              href="/products" 
              className="py-2.5 px-4 bg-transparent border border-blue-400 text-blue-100 rounded-lg hover:bg-blue-800 hover:border-blue-300 transition-colors flex items-center"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Continue Shopping
            </Link>
            
            {cartCount > 0 && (
              <button 
                onClick={handleClearCart}
                className="py-2.5 px-4 bg-blue-800 text-blue-100 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Clear Cart
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
} 