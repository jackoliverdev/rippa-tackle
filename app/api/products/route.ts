import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const tag = searchParams.get('tag');
    const sale = searchParams.get('sale');
    
    // Fetch products from the public schema
    let query = supabase
      .from('products')
      .select('*');

    // Apply category filter if provided
    if (category && category !== 'all') {
      query = query.eq('category', category);
    }
    
    // Apply tag filter if provided
    if (tag) {
      query = query.contains('tags', [tag]);
    }
    
    // Apply sale filter if provided
    if (sale === 'true') {
      query = query.eq('sale', true);
    }
    
    const { data: productsData, error: productsError } = await query;

    if (productsError) {
      console.error('Error fetching products:', productsError);
      return NextResponse.json({ error: productsError.message }, { status: 500 });
    }

    // Transform the data to match our Product interface
    const products = productsData.map(product => ({
      id: product.id,
      name: product.name,
      slug: product.slug,
      sku: product.sku,
      description: product.description,
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
      // Parse the JSONB images field
      images: product.images || [],
      isActive: product.is_active,
      sale: product.sale || false,
      createdAt: product.created_at,
      updatedAt: product.updated_at
    }));

    return NextResponse.json(products);
  } catch (error) {
    console.error('API route error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' }, 
      { status: 500 }
    );
  }
} 