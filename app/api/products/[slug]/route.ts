import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { ProductVariant } from '@/types/product';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

type Params = {
  params: {
    slug: string;
  };
};

export async function GET(request: Request, { params }: Params) {
  try {
    const { slug } = params;
    
    if (!slug) {
      return NextResponse.json(
        { error: 'Slug parameter is required' }, 
        { status: 400 }
      );
    }
    
    // Query the product directly by slug
    const { data: product, error } = await supabase
      .from('products')
      .select('*')
      .eq('slug', slug)
      .single();
    
    if (error) {
      return NextResponse.json(
        { error: error.message }, 
        { status: 500 }
      );
    }
    
    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' }, 
        { status: 404 }
      );
    }

    // Fetch variants if available
    let variants: ProductVariant[] = [];
    if (product.id) {
      // Try to fetch variants from the database
      const { data: variantData, error: variantError } = await supabase
        .from('variants')
        .select('*')
        .eq('product_id', product.id);
      
      if (!variantError && variantData && variantData.length > 0) {
        variants = variantData.map(variant => ({
          id: variant.id,
          name: variant.name,
          sku: variant.sku,
          price: variant.price,
          compareAtPrice: variant.compare_at_price,
          inventory: variant.inventory || 0,
          options: variant.options || {},
          product_id: variant.product_id
        }));
      } else {
        // For products like boilie deals that should have options but don't have variants in DB yet
        if (product.slug.includes('boilie') || product.slug.includes('bait-deal')) {
          // Create mock variants for boilie products
          variants = [
            {
              id: 'variant-1',
              name: 'Scopex Squid 15mm',
              sku: `${product.sku}-scopex-15mm`,
              price: Number(product.price),
              inventory: 20,
              options: { flavor: 'Scopex Squid', size: '15mm' },
              product_id: product.id
            },
            {
              id: 'variant-2',
              name: 'Monster Shrimp 15mm',
              sku: `${product.sku}-monster-15mm`,
              price: Number(product.price),
              inventory: 20,
              options: { flavor: 'Monster Shrimp', size: '15mm' },
              product_id: product.id
            },
            {
              id: 'variant-3',
              name: 'Citruz 15mm',
              sku: `${product.sku}-citruz-15mm`,
              price: Number(product.price),
              inventory: 20,
              options: { flavor: 'Citruz', size: '15mm' },
              product_id: product.id
            },
            {
              id: 'variant-4',
              name: 'Essential Cell 15mm',
              sku: `${product.sku}-essential-cell-15mm`,
              price: Number(product.price),
              inventory: 20,
              options: { flavor: 'Essential Cell', size: '15mm' },
              product_id: product.id
            }
          ];
        }
      }
    }
    
    // Format and return the product
    const formattedProduct = {
      id: product.id,
      name: product.name,
      slug: product.slug,
      sku: product.sku,
      description: product.description 
        ? cleanDescription(product.description)
        : '',
      shortDescription: product.short_description,
      price: product.price,
      compareAtPrice: product.compare_at_price,
      category: product.category,
      subcategory: product.subcategory,
      tags: product.tags || [],
      brand: product.brand,
      inventory: product.inventory,
      features: product.features || [],
      specifications: product.specifications || {},
      dimensions: product.dimensions,
      weight: product.weight,
      images: product.images || [],
      variants: variants,
      isActive: product.is_active,
      sale: product.sale || false,
      createdAt: product.created_at,
      updatedAt: product.updated_at
    };
    
    return NextResponse.json(formattedProduct);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch product' }, 
      { status: 500 }
    );
  }
}

// Helper function to clean up malformed HTML in descriptions
function cleanDescription(description: string): string {
  if (!description) return '';
  
  return description
    .replace(/<meta[^>]*>/gi, '')
    .replace(/<\/?p>/gi, '') 
    .replace(/<\/?b>/gi, '<strong>$1</strong>')
    .trim();
} 