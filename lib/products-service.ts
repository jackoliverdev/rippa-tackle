import { Product, ProductCategory, ProductTag } from '@/types/product';
import { supabase } from '@/lib/supabase';

// Helper function to fetch from our API - compatible with both client and server rendering
async function fetchFromAPI(endpoint: string, params = {}) {
  // Handle both client and server-side environments
  const baseUrl = typeof window !== 'undefined' 
    ? window.location.origin 
    : process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
  
  const url = new URL(`/api/${endpoint}`, baseUrl);
  
  // Add query parameters
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      url.searchParams.append(key, String(value));
    }
  });

  const response = await fetch(url.toString());
  
  if (!response.ok) {
    throw new Error(`API error: ${response.status} ${response.statusText}`);
  }
  
  return response.json();
}

export async function getAllProducts(): Promise<Product[]> {
  try {
    const products = await fetchFromAPI('products');
    return Array.isArray(products) ? products : [];
  } catch (error) {
    console.error('Error fetching all products:', error);
    return [];
  }
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
    // Use the dedicated API endpoint for getting a product by slug
    const product = await fetchFromAPI(`products/${slug}`);
    return product || null;
  } catch (error) {
    console.error(`Error fetching product with slug ${slug}:`, error);
    return null;
  }
}

export async function getProductById(id: string): Promise<Product | null> {
  try {
    console.log(`Client: Fetching product with ID ${id}`);
    
    const baseUrl = typeof window !== 'undefined' 
      ? window.location.origin 
      : process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    
    const url = new URL(`/api/products/id/${id}`, baseUrl);
    console.log(`Client: Request URL: ${url.toString()}`);
    
    const response = await fetch(url.toString(), {
      cache: 'no-store', // Ensure we don't get cached results
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Client: Error response for product ID ${id}:`, response.status, response.statusText, errorText);
      throw new Error(`Failed to fetch product: ${response.status} ${response.statusText}`);
    }
    
    const product = await response.json();
    console.log(`Client: Successfully fetched product:`, product.name || 'Unknown product');
    return product;
  } catch (error) {
    console.error(`Client: Error fetching product with ID ${id}:`, error);
    return null;
  }
}

export async function getProductsByCategory(category: ProductCategory): Promise<Product[]> {
  try {
    const products = await fetchFromAPI('products', { category });
    return Array.isArray(products) ? products : [];
  } catch (error) {
    console.error(`Error fetching products in category ${category}:`, error);
    return [];
  }
}

export async function getProductsByTag(tag: ProductTag): Promise<Product[]> {
  try {
    const products = await fetchFromAPI('products', { tag });
    return Array.isArray(products) ? products : [];
  } catch (error) {
    console.error(`Error fetching products with tag ${tag}:`, error);
    return [];
  }
}

export async function searchProducts(query: string): Promise<Product[]> {
  try {
    const products = await fetchFromAPI('products');
    if (!Array.isArray(products)) return [];
    if (!query) return products;
    
    const normalizedQuery = query.toLowerCase();
    return products.filter((product: Product) => {
      const nameMatch = product.name.toLowerCase().includes(normalizedQuery);
      const descMatch = product.description ? 
        product.description.toLowerCase().includes(normalizedQuery) : 
        false;
      
      return nameMatch || descMatch;
    });
  } catch (error) {
    console.error(`Error searching products with query "${query}":`, error);
    return [];
  }
}

export async function getFeaturedProducts(limit = 8): Promise<Product[]> {
  try {
    const products = await fetchFromAPI('products', { tag: 'featured' });
    if (!Array.isArray(products)) return [];
    return products.slice(0, limit);
  } catch (error) {
    console.error('Error fetching featured products:', error);
    return [];
  }
}

export async function getBestSellingProducts(limit = 8): Promise<Product[]> {
  try {
    const products = await fetchFromAPI('products', { tag: 'best-seller' });
    if (!Array.isArray(products)) return [];
    return products.slice(0, limit);
  } catch (error) {
    console.error('Error fetching best-selling products:', error);
    return [];
  }
}

export async function getNewArrivals(limit = 8): Promise<Product[]> {
  try {
    const products = await fetchFromAPI('products');
    if (!Array.isArray(products)) return [];
    
    // Sort by createdAt date in descending order, safely handling optional createdAt
    return products
      .sort((a: Product, b: Product) => {
        // If createdAt is missing, use current date as fallback
        const dateA = a.createdAt ? new Date(a.createdAt) : new Date();
        const dateB = b.createdAt ? new Date(b.createdAt) : new Date();
        return dateB.getTime() - dateA.getTime();
      })
      .slice(0, limit);
  } catch (error) {
    console.error('Error fetching new arrivals:', error);
    return [];
  }
}

export async function getSaleProducts(limit = 8): Promise<Product[]> {
  try {
    const products = await fetchFromAPI('products', { sale: 'true' });
    if (!Array.isArray(products)) return [];
    return products.slice(0, limit);
  } catch (error) {
    console.error('Error fetching sale products:', error);
    return [];
  }
}

// Admin specific functions

export async function createProduct(product: Partial<Product>): Promise<Product | null> {
  try {
    // Handle both client and server-side environments with proper URL construction
    const baseUrl = typeof window !== 'undefined' 
      ? window.location.origin 
      : process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    
    const url = new URL('/api/admin/products', baseUrl);
    console.log(`Creating new product at URL: ${url.toString()}`);
    
    const response = await fetch(url.toString(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(product),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error response for product creation:', response.status, response.statusText, errorText);
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error creating product:', error);
    return null;
  }
}

export async function updateProduct(id: string, productData: Partial<Product>): Promise<Product | null> {
  try {
    console.log(`Updating product with ID ${id}`, productData);
    
    // Direct database update using Supabase
    const { data, error } = await supabase
      .from('products')
      .update({
        name: productData.name,
        slug: productData.slug,
        sku: productData.sku,
        description: productData.description,
        short_description: productData.shortDescription,
        price: productData.price,
        compare_at_price: productData.compareAtPrice,
        category: productData.category,
        subcategory: productData.subcategory,
        tags: productData.tags,
        brand: productData.brand,
        inventory: productData.inventory,
        features: productData.features,
        specifications: productData.specifications,
        dimensions: productData.dimensions,
        weight: productData.weight,
        images: productData.images,
        is_active: productData.isActive,
        sale: productData.sale,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error(`Database error updating product ${id}:`, error);
      throw new Error(`Database error: ${error.message}`);
    }
    
    console.log(`Successfully updated product ${id} in database`);
    return data;
  } catch (error) {
    console.error(`Error updating product ${id}:`, error);
    return null;
  }
}

export async function deleteProduct(id: string): Promise<boolean> {
  try {
    console.log(`Deleting product with ID ${id}`);
    
    // Direct database deletion using Supabase
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error(`Database error deleting product ${id}:`, error);
      throw new Error(`Database error: ${error.message}`);
    }
    
    console.log(`Successfully deleted product ${id} from database`);
    return true;
  } catch (error) {
    console.error(`Error deleting product ${id}:`, error);
    return false;
  }
}

export async function uploadProductImage(file: File, productId?: string): Promise<{ url: string; id: string } | null> {
  try {
    // Create a unique file name
    const uniqueId = Date.now().toString();
    const fileExt = file.name.split('.').pop();
    const fileName = `${uniqueId}_${file.name.replace(/\s+/g, '_').toLowerCase()}`;
    const filePath = productId 
      ? `products/${productId}/${fileName}` 
      : `products/temp/${fileName}`;
    
    // Upload directly to Supabase storage
    const { data, error } = await supabase
      .storage
      .from('rippa') // Using the new storage bucket named 'rippa'
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });
    
    if (error) {
      console.error('Supabase storage error:', error);
      throw new Error(`Storage error: ${error.message}`);
    }
    
    // Get the public URL
    const { data: publicUrlData } = supabase
      .storage
      .from('rippa')
      .getPublicUrl(data.path);
    
    console.log(`Successfully uploaded image to Supabase storage: ${publicUrlData.publicUrl}`);
    
    // Return the URL and path
    return {
      url: publicUrlData.publicUrl,
      id: data.path
    };
  } catch (error) {
    console.error('Error uploading product image:', error);
    return null;
  }
}

// Function for creating CSV upload utility
export async function importProductsFromCSV(products: Partial<Product>[]) {
  try {
    const response = await fetch('/api/admin/products/import', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ products }),
    });
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error importing products:', error);
    return null;
  }
}

export async function getProductStats(): Promise<{
  total: number;
  lowStock: number;
  outOfStock: number;
  featured: number;
}> {
  try {
    const stats = await fetchFromAPI('admin/products/stats');
    return stats;
  } catch (error) {
    console.error('Error fetching product stats:', error);
    return {
      total: 0,
      lowStock: 0,
      outOfStock: 0,
      featured: 0
    };
  }
} 