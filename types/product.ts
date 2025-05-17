export type ProductCategory = 
  | 'tackle'
  | 'bait'
  | 'rigs'
  | 'accessories'
  | 'clothing'
  | 'bundles'
  | 'mystery-boxes';

export type ProductTag = 
  | 'best-seller'
  | 'new'
  | 'sale'
  | 'featured'
  | 'limited'
  | 'exclusive'
  | string; // Allow any string tag

export interface ProductImage {
  id?: string;
  url: string;
  alt: string;
  isPrimary?: boolean;
  position?: number; // Added for Shopify compatibility
}

export interface ProductVariant {
  id: string;
  name: string;
  sku: string;
  price: number;
  compareAtPrice?: number; // Original price if on sale
  inventory: number;
  weight?: number;
  size?: string;
  color?: string;
  options?: Record<string, string>; // Any additional options
  product_id?: string; // Added for database reference
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  sku?: string;
  description?: string;
  shortDescription?: string;
  price: number | string; // Accept either number or string format
  compareAtPrice?: number; // Original price if on sale
  images: ProductImage[];
  category: ProductCategory;
  subcategory?: string;
  tags?: ProductTag[];
  brand?: string;
  inventory?: number;
  weight?: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
    unit: 'cm' | 'in';
  };
  variants?: ProductVariant[];
  features?: string[];
  specifications?: Record<string, string>;
  relatedProducts?: string[]; // IDs of related products
  isActive?: boolean;
  sale?: boolean; // Whether the product is on sale
  createdAt?: string;
  updatedAt?: string;
} 