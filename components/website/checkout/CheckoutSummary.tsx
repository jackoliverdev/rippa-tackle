"use client";

import { useCart } from "@/context/cart-context";
import { ShoppingBag, CreditCard, Check } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface CheckoutSummaryProps {
  isSubmitting?: boolean;
  isComplete?: boolean;
}

export function CheckoutSummary({ isSubmitting = false, isComplete = false }: CheckoutSummaryProps) {
  const { cart, cartTotal } = useCart();

  // Format price with £ symbol
  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      minimumFractionDigits: 2
    }).format(price);
  };

  // Calculate subtotal, shipping, and total
  const subtotal = cartTotal;
  const shipping = subtotal > 50 ? 0 : 4.99;
  const tax = subtotal * 0.2; // 20% VAT
  const total = subtotal + shipping;

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

  if (cart.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6 text-center">
        <ShoppingBag className="h-10 w-10 mx-auto text-gray-300 mb-3" />
        <h2 className="text-xl font-bold text-gray-900 mb-2">Your bag is empty</h2>
        <p className="text-gray-500 mb-4">
          Add items to your bag before proceeding to checkout.
        </p>
        <Link 
          href="/products" 
          className="inline-block bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700"
        >
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h2>
        
        {/* Cart items summary - condensed version */}
        <div className="space-y-4 mb-6">
          {cart.map((item) => {
            // Check for position-based images or isPrimary flag
            const primaryImage = item.images?.find(img => img.position === 1 || img.isPrimary) || item.images?.[0];
            
            return (
              <div key={item.id} className="flex items-start">
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
                
                <div className="ml-4 flex-1">
                  <h4 className="text-sm font-medium text-gray-900 line-clamp-1">{item.name}</h4>
                  <div className="flex justify-between mt-1">
                    <div className="text-sm text-gray-500">
                      Qty: {item.quantity}
                    </div>
                    <div className="text-sm font-medium text-gray-900">
                      {formatPrice(typeof item.price === 'string' ? parseFloat(item.price) * item.quantity : item.price * item.quantity)}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Price breakdown */}
        <div className="space-y-2 border-t border-gray-200 pt-4">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Subtotal</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Shipping</span>
            <span>{shipping === 0 ? 'Free' : formatPrice(shipping)}</span>
          </div>
          
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">VAT (20%)</span>
            <span>{formatPrice(tax)}</span>
          </div>
          
          <div className="flex justify-between font-bold text-gray-900 pt-2 border-t border-gray-100 mt-2">
            <span>Total</span>
            <span>{formatPrice(total)}</span>
          </div>
        </div>
      </div>
      
      {/* Payment methods */}
      <div className="p-6 bg-gray-50">
        <h3 className="font-medium text-gray-900 mb-3">Payment Methods</h3>
        <div className="flex items-center space-x-4 mb-4">
          <div className="w-12 h-8 bg-blue-900 rounded flex items-center justify-center text-white text-xs font-bold">VISA</div>
          <div className="w-12 h-8 bg-red-600 rounded flex items-center justify-center text-white text-xs font-bold">MC</div>
          <div className="w-12 h-8 bg-blue-600 rounded flex items-center justify-center text-white text-xs font-bold">AMEX</div>
        </div>
        
        <div className="flex items-center text-sm text-gray-600 mb-4">
          <CreditCard className="h-4 w-4 mr-2 text-gray-400" />
          <span>We use secure payment processing</span>
        </div>
        
        {isComplete && (
          <div className="bg-green-50 border border-green-200 rounded-md p-3 flex items-start mb-4">
            <Check className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-green-800">Order Confirmed</p>
              <p className="text-xs text-green-700 mt-1">Your order has been placed successfully!</p>
            </div>
          </div>
        )}
        
        {isSubmitting && (
          <div className="flex justify-center py-3">
            <div className="animate-spin h-5 w-5 border-2 border-blue-600 border-t-transparent rounded-full"></div>
            <span className="ml-2 text-sm text-gray-600">Processing order...</span>
          </div>
        )}
      </div>
    </div>
  );
} 