"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/cart-context";
import CheckoutHero from "@/components/website/checkout/CheckoutHero";
import { CheckoutForm } from "@/components/website/checkout/CheckoutForm";
import { CheckoutSummary } from "@/components/website/checkout/CheckoutSummary";
import { CheckoutSuccess } from "@/components/website/checkout/CheckoutSuccess";
import { toast } from "sonner";

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, clearCart } = useCart();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [orderData, setOrderData] = useState<{
    orderNumber: string;
    customerEmail: string;
  } | null>(null);

  // If cart is empty and not in complete state, redirect to cart page
  if (cart.length === 0 && !isComplete) {
    if (typeof window !== 'undefined') {
      router.push('/cart');
    }
    return null;
  }

  const handleSubmitOrder = async (formData: any) => {
    setIsSubmitting(true);

    try {
      // In a real app, this would be an API call to process the order
      // Simulate an API call with setTimeout
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Generate a random order ID
      const orderNumber = `RP-${Math.floor(100000 + Math.random() * 900000)}`;
      
      setOrderData({
        orderNumber,
        customerEmail: formData.email,
      });

      setIsComplete(true);
      clearCart(); // Clear the cart after successful order
      toast.success("Order placed successfully!");
    } catch (error) {
      console.error("Error processing order:", error);
      toast.error("There was an error processing your order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <CheckoutHero />

      <div className="container mx-auto px-4 py-12 max-w-6xl">
        {isComplete && orderData ? (
          <CheckoutSuccess 
            orderNumber={orderData.orderNumber} 
            customerEmail={orderData.customerEmail} 
          />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <CheckoutForm 
                onSubmit={handleSubmitOrder} 
                isSubmitting={isSubmitting} 
              />
            </div>
            
            <div className="lg:col-span-1">
              <CheckoutSummary 
                isSubmitting={isSubmitting} 
                isComplete={isComplete} 
              />
            </div>
          </div>
        )}
      </div>
    </>
  );
} 