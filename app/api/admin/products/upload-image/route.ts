import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  try {
    console.log('Admin API: Processing image upload request');
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const productId = formData.get('productId') as string | null;
    
    if (!file) {
      console.error('Admin API: No file provided');
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }
    
    // Create a unique file name
    const uniqueId = Date.now().toString();
    const fileName = `${uniqueId}_${file.name.replace(/\s+/g, '_').toLowerCase()}`;
    const filePath = productId 
      ? `products/${productId}/${fileName}` 
      : `products/temp/${fileName}`;
    
    console.log(`Admin API: Uploading file to Supabase storage path: ${filePath}`);
    
    // Upload to Supabase storage
    const { data, error } = await supabase
      .storage
      .from('rippa') // Using the new storage bucket named 'rippa'
      .upload(filePath, await file.arrayBuffer(), {
        contentType: file.type,
        cacheControl: '3600',
        upsert: false
      });
    
    if (error) {
      console.error('Admin API: Supabase storage error:', error);
      return NextResponse.json({ error: `Storage error: ${error.message}` }, { status: 500 });
    }
    
    // Get the public URL
    const { data: publicUrlData } = supabase
      .storage
      .from('rippa')
      .getPublicUrl(data.path);
    
    console.log(`Admin API: Successfully uploaded image: ${publicUrlData.publicUrl}`);
    
    // Return the URL and path
    return NextResponse.json({
      url: publicUrlData.publicUrl,
      id: data.path
    });
  } catch (error) {
    console.error('Admin API: Error in image upload endpoint:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' }, 
      { status: 500 }
    );
  }
} 