'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { ReactNode } from 'react';

interface ProductFilterLinkProps {
  href: string;
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

export const PRODUCT_FILTER_EVENT = 'rippa-product-filter';

export const ProductFilterLink = ({
  href,
  children,
  className,
  onClick
}: ProductFilterLinkProps) => {
  const pathname = usePathname();
  const isProductsPage = pathname === '/products';
  
  // Extract filters from href if it's a product filter URL
  const extractFilters = (url: string) => {
    try {
      const urlObj = new URL(url, 'http://localhost');
      
      // Get all search params
      const filters: Record<string, string> = {};
      urlObj.searchParams.forEach((value, key) => {
        filters[key] = value;
      });
      
      return filters;
    } catch (error) {
      console.error('Error parsing URL:', error);
      return {};
    }
  };
  
  const handleClick = (e: React.MouseEvent) => {
    if (isProductsPage && href.startsWith('/products?')) {
      e.preventDefault();
      
      // Extract filters from the href
      const filters = extractFilters(href);
      
      // Update URL without page reload
      const newUrl = new URL(window.location.href);
      
      // Clear existing search params
      newUrl.search = '';
      
      // Add new search params
      Object.entries(filters).forEach(([key, value]) => {
        newUrl.searchParams.set(key, value);
      });
      
      window.history.pushState({}, '', newUrl);
      
      // Dispatch custom event to update product grid
      const filterEvent = new CustomEvent(PRODUCT_FILTER_EVENT, {
        detail: { filters }
      });
      document.dispatchEvent(filterEvent);
      
      // Scroll to product grid
      const productGridElement = document.getElementById('product-grid-section');
      if (productGridElement) {
        productGridElement.scrollIntoView({ behavior: 'smooth' });
      }
    }
    
    // Always call onClick if provided, regardless of whether we're on the products page
    if (onClick) onClick();
  };
  
  return (
    <Link
      href={href}
      className={className}
      onClick={handleClick}
      prefetch={!isProductsPage || !href.startsWith('/products?')}
    >
      {children}
    </Link>
  );
}; 