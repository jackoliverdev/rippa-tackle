'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { X } from 'lucide-react';
import { getRandomProducts } from '@/lib/products-service';

// Names for random generation
const firstNames = [
  'James', 'Oliver', 'Harry', 'Jack', 'Charlie', 'Thomas', 'George', 'Jacob', 
  'Alfie', 'William', 'Sophie', 'Emma', 'Charlotte', 'Amelia', 'Olivia', 'Emily',
  'Jessica', 'Lily', 'Ava', 'Mia', 'Lucy', 'Grace', 'Ruby', 'Evie'
];

const lastInitials = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

const locations = [
  // Major cities
  'London', 'Manchester', 'Birmingham', 'Liverpool', 'Bristol', 
  'Leeds', 'Sheffield', 'Edinburgh', 'Glasgow', 'Cardiff',
  'Newcastle', 'Nottingham', 'Belfast', 'Leicester', 'Oxford',
  
  // Counties
  'Hertfordshire', 'Kent', 'Essex', 'Surrey', 'Hampshire',
  'West Midlands', 'Cheshire', 'West Yorkshire', 'Dorset', 'Buckinghamshire',
  'Lancashire', 'Warwickshire', 'Norfolk', 'Berkshire', 'Staffordshire',
  
  // Fishing-specific areas
  'Linear Fisheries', 'Drayton Reservoir', 'Kingsbury Water Park', 
  'Walthamstow Reservoirs', 'Tattershall Lakes', 'St Johns', 'Bluebell Lakes',
  'Wraysbury', 'Redesmere', 'Wykeham Lakes', 'River Lea', 'River Trent',
  'Chew Valley Lake', 'River Severn', 'Oxlease Lake', 'Waltham Abbey'
];

interface RecentPurchaseToastProps {
  interval?: number;
  showDuration?: number;
}

export function RecentPurchaseToast({ 
  interval = 30000, // 30 seconds between toasts
  showDuration = 5000 // Show toast for 5 seconds
}: RecentPurchaseToastProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [toast, setToast] = useState<{
    name: string;
    location: string;
    productName: string;
    productSlug: string;
  } | null>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [isMobile, setIsMobile] = useState(false);

  // Check if mobile on mount
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Set initial value
    checkMobile();
    
    // Add resize listener
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Load products on mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productData = await getRandomProducts(20); // Get 20 random products for more variety
        if (productData && productData.length > 0) {
          setProducts(productData);
        }
      } catch (error) {
        console.error('Error fetching products for toast notifications:', error);
      }
    };

    fetchProducts();
  }, []);

  // Set up timer to show toasts
  useEffect(() => {
    // Only run if we have products and not on mobile
    if (products.length === 0 || isMobile) return;

    const generateToast = () => {
      // Pick random name, initial, location
      const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
      const lastInitial = lastInitials[Math.floor(Math.random() * lastInitials.length)];
      const location = locations[Math.floor(Math.random() * locations.length)];
      
      // Pick random product
      const product = products[Math.floor(Math.random() * products.length)];
      
      // Create toast data
      setToast({
        name: `${firstName} ${lastInitial}`,
        location,
        productName: product.name,
        productSlug: product.slug
      });
      
      // Show toast
      setIsOpen(true);
      
      // Hide after showDuration
      setTimeout(() => {
        setIsOpen(false);
      }, showDuration);
    };

    // Create first toast after short delay on page load
    const initialTimeout = setTimeout(() => {
      generateToast();
    }, 5000);

    // Set up fixed interval for subsequent toasts
    const toastInterval = setInterval(() => {
      generateToast();
    }, interval);

    return () => {
      clearTimeout(initialTimeout);
      clearInterval(toastInterval);
    };
  }, [products, interval, showDuration, isMobile]);

  if (isMobile || !toast || !isOpen) return null;

  return (
    <div 
      className={`fixed bottom-6 left-6 z-50 max-w-xs bg-white rounded-lg shadow-lg border border-slate-200 transition-all duration-500 ${
        isOpen 
          ? 'opacity-100 translate-y-0' 
          : 'opacity-0 translate-y-10 pointer-events-none'
      }`}
    >
      <div className="flex items-start p-4">
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <p className="text-sm font-medium text-slate-900">
              {toast.name} from {toast.location}
            </p>
            <button
              onClick={() => setIsOpen(false)}
              className="ml-4 inline-flex text-gray-400 hover:text-gray-500 focus:outline-none"
            >
              <span className="sr-only">Close</span>
              <X className="h-4 w-4" />
            </button>
          </div>
          
          <p className="mt-1 text-sm text-slate-600">
            just purchased
          </p>
          
          <Link
            href={`/products/${toast.productSlug}`}
            className="mt-2 block text-blue-600 hover:text-blue-800 font-medium text-sm"
            onClick={() => setIsOpen(false)}
          >
            {toast.productName} <span className="inline-block">🔥</span> <span className="underline">Click here</span>
          </Link>
        </div>
      </div>
    </div>
  );
} 