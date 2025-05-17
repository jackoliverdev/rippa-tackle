import { NextRequest, NextResponse } from 'next/server';
import * as productsService from '@/lib/products-service';
import { supabase } from '@/lib/supabase';

// GET /api/products/id/[id] - Get a single product by ID
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log(`API: Fetching product with ID ${params.id}`);
    
    // Direct database query instead of API call to avoid potential loop
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', params.id)
      .single();
    
    if (error || !data) {
      console.error(`API: Error fetching product with ID ${params.id}:`, error?.message || 'Product not found');
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }
    
    console.log(`API: Successfully found product: ${data.name}`);
    return NextResponse.json(data);
  } catch (error) {
    console.error(`API: Error in product ID endpoint:`, error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' }, 
      { status: 500 }
    );
  }
} 