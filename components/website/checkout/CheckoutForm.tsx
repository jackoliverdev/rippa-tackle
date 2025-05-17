"use client";

import { useState } from "react";
import { useCart } from "@/context/cart-context";
import { toast } from "sonner";

interface CheckoutFormProps {
  onSubmit: (formData: any) => void;
  isSubmitting?: boolean;
}

export function CheckoutForm({ onSubmit, isSubmitting = false }: CheckoutFormProps) {
  const { cart, cartTotal, clearCart } = useCart();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postcode: "",
    country: "United Kingdom",
    shippingMethod: "standard",
    paymentMethod: "creditCard",
    cardNumber: "",
    cardName: "",
    expiryDate: "",
    cvv: "",
    savePaymentInfo: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple form validation
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.address || !formData.city || !formData.postcode) {
      toast.error("Please fill in all required fields");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    // UK Postcode validation (basic)
    const postcodeRegex = /^[A-Z]{1,2}\d[A-Z\d]? ?\d[A-Z]{2}$/i;
    if (!postcodeRegex.test(formData.postcode)) {
      toast.error("Please enter a valid UK postcode");
      return;
    }

    // Card validation (basic - would use a proper payment service in production)
    if (formData.paymentMethod === 'creditCard') {
      if (!formData.cardNumber || !formData.cardName || !formData.expiryDate || !formData.cvv) {
        toast.error("Please fill in all payment details");
        return;
      }
      
      // Simple card number validation
      if (formData.cardNumber.replace(/\s/g, '').length < 16) {
        toast.error("Please enter a valid card number");
        return;
      }
    }

    // If validation passes, submit the form
    onSubmit(formData);
  };
  
  // For formatting card number with spaces
  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm">
      {/* Contact Information */}
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Contact Information</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
              First Name *
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          
          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
              Last Name *
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email Address *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
        </div>
      </div>
      
      {/* Shipping Information */}
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Shipping Information</h2>
        
        <div className="mb-4">
          <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
            Address *
          </label>
          <input
            type="text"
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md"
            required
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
              City/Town *
            </label>
            <input
              type="text"
              id="city"
              name="city"
              value={formData.city}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          
          <div>
            <label htmlFor="postcode" className="block text-sm font-medium text-gray-700 mb-1">
              Postcode *
            </label>
            <input
              type="text"
              id="postcode"
              name="postcode"
              value={formData.postcode}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            />
          </div>
          
          <div>
            <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
              Country *
            </label>
            <select
              id="country"
              name="country"
              value={formData.country}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            >
              <option value="United Kingdom">United Kingdom</option>
              <option value="Ireland">Ireland</option>
              <option value="France">France</option>
              <option value="Germany">Germany</option>
              <option value="Netherlands">Netherlands</option>
            </select>
          </div>
        </div>
        
        <div className="mt-4">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Shipping Method *</h3>
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="radio"
                name="shippingMethod"
                value="standard"
                checked={formData.shippingMethod === 'standard'}
                onChange={handleChange}
                className="mr-2"
              />
              <span className="text-sm text-gray-900">Standard Shipping (2-4 working days)</span>
              <span className="ml-auto font-medium text-sm">
                {cartTotal > 50 ? 'FREE' : '£4.99'}
              </span>
            </label>
            
            <label className="flex items-center">
              <input
                type="radio"
                name="shippingMethod"
                value="express"
                checked={formData.shippingMethod === 'express'}
                onChange={handleChange}
                className="mr-2"
              />
              <span className="text-sm text-gray-900">Express Shipping (1-2 working days)</span>
              <span className="ml-auto font-medium text-sm">£9.99</span>
            </label>
          </div>
        </div>
      </div>
      
      {/* Payment Information */}
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Payment Information</h2>
        
        <div className="mb-4">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Payment Method *</h3>
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="radio"
                name="paymentMethod"
                value="creditCard"
                checked={formData.paymentMethod === 'creditCard'}
                onChange={handleChange}
                className="mr-2"
              />
              <span className="text-sm text-gray-900">Credit/Debit Card</span>
            </label>
            
            <label className="flex items-center">
              <input
                type="radio"
                name="paymentMethod"
                value="paypal"
                checked={formData.paymentMethod === 'paypal'}
                onChange={handleChange}
                className="mr-2"
              />
              <span className="text-sm text-gray-900">PayPal</span>
            </label>
          </div>
        </div>
        
        {formData.paymentMethod === 'creditCard' && (
          <div className="space-y-4">
            <div>
              <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-1">
                Card Number *
              </label>
              <input
                type="text"
                id="cardNumber"
                name="cardNumber"
                value={formData.cardNumber}
                onChange={(e) => setFormData({...formData, cardNumber: formatCardNumber(e.target.value)})}
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="XXXX XXXX XXXX XXXX"
                maxLength={19}
                required
              />
            </div>
            
            <div>
              <label htmlFor="cardName" className="block text-sm font-medium text-gray-700 mb-1">
                Name on Card *
              </label>
              <input
                type="text"
                id="cardName"
                name="cardName"
                value={formData.cardName}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700 mb-1">
                  Expiry Date *
                </label>
                <input
                  type="text"
                  id="expiryDate"
                  name="expiryDate"
                  value={formData.expiryDate}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="MM/YY"
                  maxLength={5}
                  required
                />
              </div>
              
              <div>
                <label htmlFor="cvv" className="block text-sm font-medium text-gray-700 mb-1">
                  CVV *
                </label>
                <input
                  type="text"
                  id="cvv"
                  name="cvv"
                  value={formData.cvv}
                  onChange={handleChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="123"
                  maxLength={4}
                  required
                />
              </div>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="savePaymentInfo"
                name="savePaymentInfo"
                checked={formData.savePaymentInfo as boolean}
                onChange={handleChange}
                className="mr-2"
              />
              <label htmlFor="savePaymentInfo" className="text-sm text-gray-700">
                Save my payment information for future purchases
              </label>
            </div>
          </div>
        )}
        
        {formData.paymentMethod === 'paypal' && (
          <div className="bg-blue-50 p-4 rounded-md">
            <p className="text-sm text-blue-800 mb-2">
              You'll be redirected to PayPal to complete your payment after reviewing your order.
            </p>
            <p className="text-sm text-blue-800">
              Please ensure you have your PayPal login details ready.
            </p>
          </div>
        )}
      </div>
      
      {/* Place Order Button */}
      <div className="p-6 bg-gray-50">
        <div className="mb-4">
          <p className="text-sm text-gray-500">
            By placing your order, you agree to Rippa Tackle's terms and conditions and privacy policy.
          </p>
        </div>
        
        <button
          type="submit"
          className={`w-full py-3 px-6 rounded-md font-medium text-white bg-green-600 hover:bg-green-700 transition-colors flex items-center justify-center ${isSubmitting ? 'opacity-75 cursor-not-allowed' : ''}`}
          disabled={isSubmitting || cart.length === 0}
        >
          {isSubmitting ? (
            <>
              <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full mr-2"></div>
              Processing...
            </>
          ) : (
            `Place Order - £${(cartTotal + (cartTotal > 50 ? 0 : 4.99)).toFixed(2)}`
          )}
        </button>
      </div>
    </form>
  );
} 