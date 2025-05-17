import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { v4 as uuidv4 } from 'uuid';
import { slugify } from '@/lib/utils';

// GET /api/admin/products - List all products (with optional filters)
export async function GET(req: NextRequest) {
  try {
    console.log('Admin API: Fetching all products');
    const url = new URL(req.url);
    
    // Get query parameters
    const category = url.searchParams.get('category');
    const tag = url.searchParams.get('tag');
    const search = url.searchParams.get('search');
    const isActive = url.searchParams.get('is_active');
    const limit = parseInt(url.searchParams.get('limit') || '100');
    const offset = parseInt(url.searchParams.get('offset') || '0');
    
    // Build query
    let query = supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);
    
    // Apply filters
    if (category && category !== 'all') {
      query = query.eq('category', category);
    }
    
    if (tag) {
      query = query.contains('tags', [tag]);
    }
    
    if (isActive !== null) {
      query = query.eq('is_active', isActive === 'true');
    }
    
    if (search) {
      query = query.ilike('name', `%${search}%`);
    }
    
    // Execute query
    const { data, error } = await query;
    
    if (error) {
      console.error('Admin API: Error fetching products:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    console.log(`Admin API: Successfully fetched ${data.length} products`);
    return NextResponse.json(data);
  } catch (error) {
    console.error('Admin API: Error in list products endpoint:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' }, 
      { status: 500 }
    );
  }
}

// POST /api/admin/products - Create a new product
export async function POST(req: NextRequest) {
  try {
    console.log('Admin API: Creating new product');
    const productData = await req.json();
    
    // Generate a UUID if not provided
    if (!productData.id) {
      productData.id = uuidv4();
    }
    
    // Generate a slug if not provided
    if (!productData.slug && productData.name) {
      productData.slug = slugify(productData.name);
    }
    
    // Transform frontend field names to database field names
    const dbData = {
      id: productData.id,
      name: productData.name,
      slug: productData.slug,
      sku: productData.sku,
      description: productData.description,
      short_description: productData.shortDescription,
      price: productData.price,
      compare_at_price: productData.compareAtPrice,
      category: productData.category,
      subcategory: productData.subcategory,
      tags: productData.tags || [],
      brand: productData.brand,
      inventory: productData.inventory || 0,
      features: productData.features || [],
      specifications: productData.specifications || {},
      dimensions: productData.dimensions,
      weight: productData.weight,
      images: productData.images || [],
      is_active: productData.isActive !== undefined ? productData.isActive : true,
      sale: productData.sale !== undefined ? productData.sale : false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    // Insert into database
    const { data, error } = await supabase
      .from('products')
      .insert(dbData)
      .select()
      .single();
    
    if (error) {
      console.error('Admin API: Error creating product:', error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    
    console.log(`Admin API: Successfully created product: ${data.name}`);
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error('Admin API: Error in create product endpoint:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' }, 
      { status: 500 }
    );
  }
} 