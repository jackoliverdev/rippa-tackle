"use client";

import { ShoppingBag, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useCart } from "@/context/cart-context";

export default function CheckoutHero() {
  const { cartCount } = useCart();
  
  return (
    <section 
      className="relative bg-blue-900 pt-12 md:pt-16 pb-12 md:pb-20" 
      style={{ 
        clipPath: 'polygon(0 0, 100% 0, 100% 95%, 0 100%)',
        marginBottom: '-1px'
      }}
    >
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white flex items-center mb-3">
              <ShoppingBag className="h-8 w-8 mr-3" />
              Checkout
              {cartCount > 0 && (
                <span className="ml-3 text-base bg-blue-700 py-1 px-3 rounded-full">
                  {cartCount} {cartCount === 1 ? 'item' : 'items'}
                </span>
              )}
            </h1>
            <p className="text-blue-200 text-lg max-w-2xl">
              Complete your purchase by filling in your details below
            </p>
          </div>
          
          <div className="mt-6 md:mt-0">
            <Link 
              href="/cart" 
              className="py-2 px-4 bg-transparent border border-blue-400 text-blue-100 rounded-lg hover:bg-blue-800 hover:border-blue-300 transition-colors flex items-center"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Return to Cart
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
} 