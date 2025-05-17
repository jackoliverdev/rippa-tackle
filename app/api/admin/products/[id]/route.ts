import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// GET /api/admin/products/[id] - Get a single product
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log(`Admin API: Fetching product with ID ${params.id}`);
    
    // Direct database query
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', params.id)
      .single();
    
    if (error || !data) {
      console.error(`Admin API: Error fetching product with ID ${params.id}:`, error?.message || 'Product not found');
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }
    
    console.log(`Admin API: Successfully found product: ${data.name}`);
    return NextResponse.json(data);
  } catch (error) {
    console.error(`Admin API: Error in product ID endpoint:`, error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' }, 
      { status: 500 }
    );
  }
}

// PUT /api/admin/products/[id] - Update a product
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log(`Admin API: Updating product with ID ${params.id}`);
    const productData = await req.json();
    
    // Transform frontend field names to database field names if needed
    const dbData = {
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
    };
    
    // Direct database update
    const { data, error } = await supabase
      .from('products')
      .update(dbData)
      .eq('id', params.id)
      .select()
      .single();
    
    if (error) {
      console.error(`Admin API: Error updating product with ID ${params.id}:`, error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    
    console.log(`Admin API: Successfully updated product: ${data.name}`);
    return NextResponse.json(data);
  } catch (error) {
    console.error(`Admin API: Error in update product endpoint:`, error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' }, 
      { status: 500 }
    );
  }
}

// DELETE /api/admin/products/[id] - Delete a product
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log(`Admin API: Deleting product with ID ${params.id}`);
    
    // Direct database deletion
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', params.id);
    
    if (error) {
      console.error(`Admin API: Error deleting product with ID ${params.id}:`, error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    
    console.log(`Admin API: Successfully deleted product with ID ${params.id}`);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(`Admin API: Error in delete product endpoint:`, error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' }, 
      { status: 500 }
    );
  }
} 