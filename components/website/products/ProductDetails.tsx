'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getProductBySlug } from '@/lib/products-service';
import { ShoppingBag, Star, ArrowLeft, Tag, Check } from 'lucide-react';
import { ProductVariant, Product } from '@/types/product';
import ProductImageGallery from './ProductImageGallery';
import { AddToCartButton } from './AddToCartButton';
import { WishlistButton } from './WishlistButton';

type ProductDetailsProps = {
  slug: string;
};

export default function ProductDetails({ slug }: ProductDetailsProps) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedVariant, setSelectedVariant] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState<string | null>(null);

  // Fetch product data on client side
  useEffect(() => {
    async function loadProduct() {
      try {
        setLoading(true);
        const productData = await getProductBySlug(slug);
        if (!productData) {
          notFound();
        }
        setProduct(productData);
        // If variants exist, select the first one by default
        if (productData.variants && productData.variants.length > 0) {
          setSelectedVariant(productData.variants[0].id);
        }
      } catch (err) {
        setError('Failed to load product. Please try again.');
      } finally {
        setLoading(false);
      }
    }

    loadProduct();
  }, [slug]);

  if (loading) {
    return (
      <main className="min-h-screen bg-blue-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-xl shadow-md text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading product details...</p>
        </div>
      </main>
    );
  }

  if (error || !product) {
    return (
      <main className="min-h-screen bg-blue-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-xl shadow-md text-center">
          <div className="text-red-500 mb-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold mb-2">Error Loading Product</h2>
          <p className="text-slate-600">{error || 'This product could not be found'}</p>
          <Link href="/products" className="mt-4 inline-block bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
            Back to Products
          </Link>
        </div>
      </main>
    );
  }

  const primaryImage = product.images?.find(img => img.position === 1 || img.isPrimary) || product.images?.[0];
  const discount = product.compareAtPrice ? Math.round(((product.compareAtPrice - Number(product.price)) / product.compareAtPrice) * 100) : 0;
  
  const hasVariants = product.variants && product.variants.length > 0;
  const currentVariant = hasVariants && product.variants 
    ? product.variants.find((v: ProductVariant) => v.id === selectedVariant) 
    : null;

  const handleAddToCart = () => {
    // Check if variant selection is required but not selected
    if (hasVariants && !selectedVariant) {
      alert('Please select an option before adding to cart');
      return;
    }
    
    // Here you would add the product/variant to cart
    alert(`Added to cart: ${product.name} ${currentVariant ? `(${currentVariant.name})` : ''} - Quantity: ${quantity}`);
  };

  return (
    <main className="min-h-screen bg-blue-50">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb Navigation */}
        <div className="mb-6">
          <Link href="/products" className="inline-flex items-center text-blue-600 hover:text-blue-800">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Products
          </Link>
        </div>
        
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="md:flex">
            {/* Product Images */}
            <div className="md:w-1/2 p-4">
              {product.images && product.images.length > 0 ? (
                <ProductImageGallery 
                  images={product.images} 
                  productName={product.name} 
                  product={product}
                />
              ) : (
                <div className="w-full aspect-square bg-slate-200 flex items-center justify-center rounded-lg">
                  <ShoppingBag className="h-16 w-16 text-slate-400" />
                </div>
              )}
            </div>
            
            {/* Product Info */}
            <div className="md:w-1/2 p-6">
              {product.brand && (
                <div className="text-blue-600 text-sm font-medium mb-2">
                  {product.brand.toUpperCase()}
                </div>
              )}
              
              <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">
                {product.name}
              </h1>
              
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`h-5 w-5 ${i < 4 ? 'text-yellow-400 fill-yellow-400' : 'text-slate-300'}`} />
                ))}
                <span className="text-sm text-slate-500 ml-2">(12 reviews)</span>
              </div>
              
              <div className="mb-6">
                <div className="flex items-baseline">
                  <span className="text-3xl font-bold text-blue-700">£{currentVariant ? Number(currentVariant.price).toFixed(2) : Number(product.price).toFixed(2)}</span>
                  {product.compareAtPrice && (
                    <span className="ml-3 text-lg line-through text-slate-500">£{Number(product.compareAtPrice).toFixed(2)}</span>
                  )}
                </div>
                
                {product.inventory ? (
                  <div className="mt-2 text-sm font-medium text-green-600 flex items-center">
                    <Check className="h-4 w-4 mr-1" /> In Stock ({product.inventory} available)
                  </div>
                ) : (
                  <div className="mt-2 text-sm font-medium text-green-600 flex items-center">
                    <Check className="h-4 w-4 mr-1" /> In Stock
                  </div>
                )}
              </div>
              
              <div className="mb-6">
                <p className="text-slate-700">
                  {product.shortDescription || product.description?.substring(0, 150) || "No description available"}
                </p>
              </div>
              
              {/* Variants Selection (if available) */}
              {hasVariants && product.variants && (
                <div className="mb-6">
                  <label htmlFor="variant" className="block text-sm font-medium text-slate-700 mb-2">
                    Select Option:
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {product.variants.map((variant: ProductVariant) => (
                      <button
                        key={variant.id}
                        type="button"
                        onClick={() => setSelectedVariant(variant.id)}
                        className={`py-2 px-3 border rounded-md text-sm font-medium transition-colors
                          ${selectedVariant === variant.id 
                            ? 'bg-blue-50 border-blue-500 text-blue-700' 
                            : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'}`}
                      >
                        {variant.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              
              {/* Add to Cart */}
              <div className="mb-8">
                <div className="flex items-center gap-4">
                  <div className="w-24">
                    <label htmlFor="quantity" className="sr-only">Quantity</label>
                    <select 
                      id="quantity" 
                      className="w-full py-2 px-3 border border-slate-300 rounded-md"
                      value={quantity}
                      onChange={(e) => setQuantity(Number(e.target.value))}
                    >
                      {[...Array(10)].map((_, i) => (
                        <option key={i} value={i + 1}>
                          {i + 1}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <AddToCartButton 
                    product={product} 
                    quantity={quantity}
                    size="lg"
                    showText={true}
                    className="flex-1"
                  />
                </div>
              </div>
              
              {/* Specifications - MOVED FROM BOTTOM */}
              {product.specifications && Object.keys(product.specifications).length > 0 && (
                <div className="mb-8 border rounded-lg overflow-hidden">
                  <h3 className="text-lg font-bold text-slate-900 px-4 py-3 bg-slate-50 border-b">Specifications</h3>
                  <table className="min-w-full divide-y divide-slate-200">
                    <tbody className="divide-y divide-slate-200">
                      {Object.entries(product.specifications).map(([key, value]) => (
                        <tr key={key}>
                          <td className="py-3 px-4 text-sm font-medium text-slate-900 bg-slate-50 w-1/3">{key}</td>
                          <td className="py-3 px-4 text-sm text-slate-700">{value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              
              {/* Features/Highlights */}
              {product.features && product.features.length > 0 && (
                <div className="mb-6">
                  <h2 className="font-medium text-lg mb-3 flex items-center">
                    <Tag className="h-5 w-5 mr-2 text-blue-600" />
                    What's Included
                  </h2>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {product.features.map((feature: string, index: number) => (
                      <li key={index} className="flex items-start">
                        <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                        <span className="text-slate-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {/* Tags */}
              {product.tags && product.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {product.tags.map((tag: string) => (
                    <span 
                      key={tag} 
                      className="inline-block bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full"
                    >
                      {tag.replace(/-/g, ' ')}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          {/* Product Description and Details Tabs */}
          {product.description && (
            <div className="border-t border-slate-200 px-6 py-8">
              <div className="max-w-4xl mx-auto">
                <h2 className="text-2xl font-bold text-slate-900 mb-6">Product Description</h2>
                <div className="prose max-w-none text-slate-700">
                  <div dangerouslySetInnerHTML={{ 
                    __html: product.description
                      .replace(/<meta\s+charset="utf-8"\s*>/gi, '')
                      .replace(/<\/?p>/gi, '')
                      .replace(/<\/?span>/gi, '')
                  }} />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
} 