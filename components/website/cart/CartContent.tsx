"use client";

import { useCart } from "@/context/cart-context";
import { CartItem } from "./CartItem";
import { ShoppingBag, ChevronRight } from "lucide-react";
import Link from "next/link";

export function CartContent() {
  const { cart, cartTotal } = useCart();

  // Format price with £ symbol
  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      minimumFractionDigits: 2
    }).format(price);
  };

  if (cart.length === 0) {
    return (
      <div className="py-16 text-center bg-white rounded-xl shadow-sm">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
          <ShoppingBag className="h-8 w-8 text-blue-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Your bag is empty</h2>
        <p className="text-gray-600 max-w-md mx-auto mb-6">
          Browse our products and add items to your bag for checkout.
        </p>
        <Link 
          href="/products" 
          className="inline-flex items-center justify-center bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          Browse Products
        </Link>
      </div>
    );
  }

  // Calculate subtotal, shipping, and total
  const subtotal = cartTotal;
  const shipping = subtotal > 50 ? 0 : 4.99;
  const total = subtotal + shipping;

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="lg:flex">
        {/* Cart Items */}
        <div className="lg:w-2/3 p-6 border-r border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Shopping Bag</h2>
          
          <div className="divide-y divide-gray-200">
            {cart.map((item) => (
              <CartItem key={item.id} item={item} />
            ))}
          </div>
          
          <div className="mt-8 pt-4 border-t border-gray-200">
            <Link 
              href="/products" 
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              ← Continue shopping
            </Link>
          </div>
        </div>
        
        {/* Order Summary */}
        <div className="lg:w-1/3 p-6 bg-gray-50">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>
          
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-medium">{formatPrice(subtotal)}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600">Shipping</span>
              <span className="font-medium">
                {shipping === 0 ? 'Free' : formatPrice(shipping)}
              </span>
            </div>
            
            {shipping > 0 && (
              <div className="text-sm text-gray-500 italic">
                Free shipping on orders over £50
              </div>
            )}
            
            <div className="pt-4 border-t border-gray-200 flex justify-between">
              <span className="font-bold text-gray-900">Total</span>
              <span className="font-bold text-blue-700 text-xl">{formatPrice(total)}</span>
            </div>
          </div>
          
          <div className="mt-8">
            <Link
              href="/checkout"
              className="block w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium text-center hover:bg-blue-700 transition-colors"
            >
              Proceed to Checkout <ChevronRight className="inline-block h-4 w-4 ml-1" />
            </Link>
            
            <div className="mt-4 text-center text-sm text-gray-500">
              We accept: Visa, Mastercard, American Express
            </div>
          </div>
          
          <div className="mt-6 border-t border-gray-200 pt-6">
            <h3 className="font-medium text-gray-900 mb-2">Need Help?</h3>
            <p className="text-sm text-gray-600 mb-2">
              Our customer service team is here to help you with any questions about your order.
            </p>
            <Link 
              href="/contact" 
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 