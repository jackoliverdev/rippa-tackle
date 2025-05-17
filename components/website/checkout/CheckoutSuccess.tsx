"use client";

import { Check, ShoppingBag, ChevronRight } from "lucide-react";
import Link from "next/link";

interface CheckoutSuccessProps {
  orderNumber: string;
  customerEmail: string;
}

export function CheckoutSuccess({ orderNumber, customerEmail }: CheckoutSuccessProps) {
  const estimatedDelivery = new Date();
  estimatedDelivery.setDate(estimatedDelivery.getDate() + 5);
  
  const formattedDeliveryDate = new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(estimatedDelivery);

  return (
    <div className="bg-white rounded-xl shadow-sm p-8 text-center">
      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <Check className="h-10 w-10 text-green-600" />
      </div>
      
      <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
        Order Confirmed!
      </h2>
      
      <p className="text-lg text-gray-600 mb-6 max-w-md mx-auto">
        Thank you for your purchase. Your order has been processed successfully.
      </p>
      
      <div className="bg-gray-50 p-6 rounded-lg mb-8 max-w-md mx-auto">
        <div className="flex justify-between mb-3">
          <span className="text-sm text-gray-500">Order Number:</span>
          <span className="font-medium">{orderNumber}</span>
        </div>
        
        <div className="flex justify-between mb-3">
          <span className="text-sm text-gray-500">Confirmation Email:</span>
          <span className="font-medium">{customerEmail}</span>
        </div>
        
        <div className="flex justify-between mb-3">
          <span className="text-sm text-gray-500">Estimated Delivery:</span>
          <span className="font-medium">{formattedDeliveryDate}</span>
        </div>
        
        <div className="pt-3 mt-3 border-t border-gray-200">
          <div className="flex justify-between">
            <span className="text-sm text-gray-500">Status:</span>
            <span className="font-medium text-green-600">Processing</span>
          </div>
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row justify-center gap-4">
        <Link 
          href="/account/orders" 
          className="py-3 px-6 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
        >
          <ShoppingBag className="mr-2 h-5 w-5" />
          View My Orders
        </Link>
        
        <Link 
          href="/products" 
          className="py-3 px-6 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center"
        >
          Continue Shopping
          <ChevronRight className="ml-2 h-4 w-4" />
        </Link>
      </div>
      
      <div className="mt-8 text-sm text-gray-500">
        <p>Need help with your order?</p>
        <Link href="/contact" className="text-blue-600 hover:text-blue-800 font-medium">
          Contact our support team
        </Link>
      </div>
    </div>
  );
} 