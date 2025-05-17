"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Package, Loader2 } from 'lucide-react';
import PageTitle from '@/components/admin/page-title';
import ProductForm from '@/components/admin/products/product-form';
import { getProductById } from '@/lib/products-service';
import { Product } from '@/types/product';

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const productId = params?.id || '';
  
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        if (!productId) {
          router.push('/admin/products');
          return;
        }
        
        console.log(`Fetching product with ID: ${productId}`);
        const data = await getProductById(productId);
        
        console.log('Product data response:', data);
        
        if (!data) {
          throw new Error(`Product not found for ID: ${productId}`);
        }
        
        setProduct(data);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load product';
        setError(errorMessage);
        console.error(`Error loading product (ID: ${productId}):`, err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProduct();
  }, [productId, router]);
  
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="h-10 w-10 text-blue-600 animate-spin mb-4" />
        <p className="text-gray-600">Loading product...</p>
      </div>
    );
  }
  
  if (error || !product) {
    return (
      <div className="bg-red-50 text-red-800 p-8 rounded-xl text-center my-8">
        <h2 className="text-xl font-bold mb-4">Error Loading Product</h2>
        <p className="mb-2">{error || 'Product not found'}</p>
        <p className="mb-6 text-sm text-red-700">Product ID: {productId}</p>
        <button 
          onClick={() => router.push('/admin/products')}
          className="px-6 py-2 bg-red-100 text-red-800 rounded-lg hover:bg-red-200"
        >
          Back to Products
        </button>
      </div>
    );
  }
  
  return (
    <div>
      <PageTitle 
        title={`Edit: ${product.name}`}
        description="Update product details and inventory"
        icon={<Package className="w-5 h-5" />}
      />
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <ProductForm product={product} isEdit={true} />
      </div>
    </div>
  );
} 