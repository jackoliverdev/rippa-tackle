"use client";

import { useCart } from "@/context/cart-context";
import { ShoppingBag, ShoppingCart, X, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { CartItem } from "@/components/website/cart/CartItem";

export function CartDropdown() {
  const { cart, cartCount, cartTotal, clearCart } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  // Format price with £ symbol
  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      minimumFractionDigits: 2
    }).format(price);
  };

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="text-white flex flex-col items-center relative"
      >
        <div className="relative">
          <ShoppingBag className="h-6 w-6 mb-1" />
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
              {cartCount}
            </span>
          )}
        </div>
        <span className="text-xs">BAG</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-lg z-50 overflow-hidden">
          <div className="flex items-center justify-between border-b border-gray-200 p-3">
            <h3 className="font-bold text-gray-900">Your Bag ({cartCount})</h3>
            <button 
              onClick={() => setIsOpen(false)} 
              className="text-gray-400 hover:text-gray-500"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {cart.length === 0 ? (
            <div className="p-6 text-center">
              <ShoppingBag className="h-10 w-10 mx-auto text-gray-300 mb-2" />
              <p className="text-gray-500 mb-4">Your bag is empty</p>
              <Link 
                href="/products" 
                className="inline-block bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700"
                onClick={() => setIsOpen(false)}
              >
                Browse Products
              </Link>
            </div>
          ) : (
            <>
              <div className="max-h-72 overflow-y-auto">
                {cart.map(item => (
                  <CartItem key={item.id} item={item} isDropdown={true} />
                ))}
              </div>
              
              <div className="p-3 border-t border-gray-200">
                <div className="flex justify-between mb-3">
                  <span className="font-medium text-gray-700">Subtotal:</span>
                  <span className="font-bold text-blue-700">{formatPrice(cartTotal)}</span>
                </div>
                
                <div className="flex gap-2">
                  <Link
                    href="/cart"
                    className="inline-block w-full bg-blue-600 text-white px-3 py-2 rounded-md text-sm font-medium text-center hover:bg-blue-700"
                    onClick={() => setIsOpen(false)}
                  >
                    View Bag
                  </Link>
                  
                  <Link
                    href="/checkout"
                    className="inline-block w-full bg-green-600 text-white px-3 py-2 rounded-md text-sm font-medium text-center hover:bg-green-700"
                    onClick={() => setIsOpen(false)}
                  >
                    Checkout <ChevronRight className="inline-block h-4 w-4 ml-1" />
                  </Link>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
} 