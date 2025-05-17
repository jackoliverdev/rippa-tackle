'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { X, ShoppingCart, ChevronLeft, ChevronRight, Maximize2, Star, Info, Check } from 'lucide-react';
import { Product } from '@/types/product';
import { getProductById, getProductBySlug } from '@/lib/products-service';
import { WishlistButton } from './WishlistButton';
import { AddToCartButton } from './AddToCartButton';

interface ProductPreviewModalProps {
  productId?: string;
  productSlug?: string;
  isOpen: boolean;
  onClose: () => void;
}

const ProductPreviewModal: React.FC<ProductPreviewModalProps> = ({
  productId,
  productSlug,
  isOpen,
  onClose
}) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const router = useRouter();

  // Fetch product data when modal opens
  useEffect(() => {
    const fetchProduct = async () => {
      if (!isOpen) return;
      
      setLoading(true);
      setError(null);
      
      try {
        let fetchedProduct = null;
        
        if (productId) {
          fetchedProduct = await getProductById(productId);
        } else if (productSlug) {
          fetchedProduct = await getProductBySlug(productSlug);
        }
        
        if (fetchedProduct) {
          setProduct(fetchedProduct);
        } else {
          setError('Product not found');
        }
      } catch (err) {
        setError('Failed to load product');
        console.error('Error fetching product:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProduct();
  }, [isOpen, productId, productSlug]);

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setCurrentImageIndex(0);
      setQuantity(1);
    }
  }, [isOpen]);

  // Handle keyboard events (Escape to close)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  const handleNextImage = () => {
    if (!product?.images?.length) return;
    setCurrentImageIndex((prev) => 
      prev === product.images.length - 1 ? 0 : prev + 1
    );
  };

  const handlePrevImage = () => {
    if (!product?.images?.length) return;
    setCurrentImageIndex((prev) => 
      prev === 0 ? product.images.length - 1 : prev - 1
    );
  };

  const handleAddToCart = () => {
    // Implement cart functionality
    console.log(`Added ${quantity} of ${product?.name} to cart`);
    
    // Close modal after adding to cart
    onClose();
  };

  const handleViewFullProduct = () => {
    if (product?.slug) {
      router.push(`/products/${product.slug}`);
      onClose();
    }
  };

  // Helper function to format price safely
  const formatPrice = (price: string | number | undefined): string => {
    if (price === undefined) return '0.00';
    if (typeof price === 'string') return parseFloat(price).toFixed(2);
    return price.toFixed(2);
  };

  // Calculate discount percentage safely
  const calculateDiscount = (price: string | number | undefined, comparePrice: string | number | undefined): number => {
    if (!price || !comparePrice) return 0;
    
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    const numComparePrice = typeof comparePrice === 'string' ? parseFloat(comparePrice) : comparePrice;
    
    if (numComparePrice <= numPrice) return 0;
    return Math.round((1 - numPrice / numComparePrice) * 100);
  };

  // Helper function to safely get an image URL from different formats
  const getImageUrl = (image: any): string => {
    if (!image) return '/placeholder-product.png';
    
    if (typeof image === 'string') return image;
    
    if (typeof image === 'object') {
      // Handle case where image is an object with url property
      if (image.url) return image.url;
      
      // Handle case where image might be stringifiable
      try {
        return String(image);
      } catch (e) {
        console.error('Failed to convert image to string:', e);
        return '/placeholder-product.png';
      }
    }
    
    return '/placeholder-product.png';
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm overflow-y-auto"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-4xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl m-4 overflow-hidden max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-1.5 rounded-full bg-white/80 dark:bg-slate-700/80 text-slate-700 dark:text-white hover:bg-white dark:hover:bg-slate-700 shadow-sm"
          aria-label="Close preview"
        >
          <X className="w-5 h-5" />
        </button>

        {loading ? (
          <div className="flex items-center justify-center h-80 bg-slate-50 dark:bg-slate-800/50">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
              <p className="text-slate-500 dark:text-slate-400">Loading product preview...</p>
            </div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-80 bg-slate-50 dark:bg-slate-800/50">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Info className="w-8 h-8 text-red-500" />
              </div>
              <p className="text-lg font-semibold text-red-600 dark:text-red-400 mb-2">Error Loading Product</p>
              <p className="text-slate-500 dark:text-slate-400">{error}</p>
            </div>
          </div>
        ) : product ? (
          <div className="flex flex-col md:flex-row overflow-hidden">
            {/* Product image gallery */}
            <div className="relative w-full md:w-1/2 bg-slate-50 dark:bg-slate-800/30">
              <div className="relative aspect-square overflow-hidden">
                {product.images && product.images.length > 0 ? (
                  <Image 
                    src={getImageUrl(product.images[currentImageIndex])}
                    alt={product.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-contain"
                    priority
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-slate-100 dark:bg-slate-800">
                    <p className="text-slate-400 dark:text-slate-500">No image available</p>
                  </div>
                )}
                
                {/* Image navigation buttons */}
                {product.images && product.images.length > 1 && (
                  <>
                    <button 
                      onClick={handlePrevImage}
                      className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 dark:bg-slate-800/80 flex items-center justify-center shadow-md hover:bg-white dark:hover:bg-slate-800 transition-all"
                    >
                      <ChevronLeft className="w-6 h-6 text-slate-700 dark:text-slate-200" />
                    </button>
                    <button 
                      onClick={handleNextImage}
                      className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 dark:bg-slate-800/80 flex items-center justify-center shadow-md hover:bg-white dark:hover:bg-slate-800 transition-all"
                    >
                      <ChevronRight className="w-6 h-6 text-slate-700 dark:text-slate-200" />
                    </button>
                  </>
                )}
                
                {/* Image counter */}
                {product.images && product.images.length > 1 && (
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-white/80 dark:bg-slate-800/80 px-3 py-1 rounded-full text-xs font-medium text-slate-700 dark:text-slate-200 shadow-sm">
                    {currentImageIndex + 1} / {product.images.length}
                  </div>
                )}
                
                {/* Fullscreen button */}
                <button 
                  onClick={handleViewFullProduct}
                  className="absolute top-3 left-3 p-2 rounded-full bg-white/80 dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 hover:bg-white dark:hover:bg-slate-800 shadow-sm"
                  aria-label="View full product"
                >
                  <Maximize2 className="w-5 h-5" />
                </button>
                
                {/* Add WishlistButton in top-right corner */}
                <div className="absolute top-3 right-3 z-10">
                  <WishlistButton product={product} size="md" />
                </div>
              </div>
              
              {/* Thumbnail gallery */}
              {product.images && product.images.length > 1 && (
                <div className="p-3 flex items-center justify-center space-x-2 overflow-x-auto">
                  {product.images.map((img, index) => (
                    <button 
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`relative w-16 h-16 border-2 rounded-md overflow-hidden flex-shrink-0 transition-all ${
                        currentImageIndex === index 
                          ? 'border-blue-500 shadow-sm' 
                          : 'border-transparent opacity-70 hover:opacity-100'
                      }`}
                    >
                      <Image 
                        src={getImageUrl(img)}
                        alt={`${product.name} - thumbnail ${index + 1}`}
                        fill
                        sizes="64px"
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            {/* Product info */}
            <div className="w-full md:w-1/2 p-6 md:p-8 overflow-y-auto max-h-[50vh] md:max-h-[80vh]">
              {/* Product category */}
              {product.category && (
                <div className="mb-2">
                  <span className="text-sm font-medium text-blue-600 dark:text-blue-400 uppercase tracking-wide">
                    {product.category}
                  </span>
                </div>
              )}
              
              {/* Product title */}
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{product.name}</h2>
              
              {/* Brand */}
              {product.brand && (
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                  By <span className="font-medium">{product.brand}</span>
                </p>
              )}
              
              {/* Rating placeholder */}
              <div className="flex items-center mt-3">
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star 
                      key={star}
                      className={`w-4 h-4 ${
                        star <= 4 
                          ? 'text-yellow-400 fill-yellow-400' 
                          : 'text-slate-300 dark:text-slate-600'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-slate-500 dark:text-slate-400 ml-2">
                  4.0 (24 reviews)
                </span>
              </div>
              
              {/* Price */}
              <div className="mt-4 flex items-baseline gap-3">
                <span className="text-2xl font-bold text-slate-900 dark:text-white">
                  £{formatPrice(product.price)}
                </span>
                
                {product.compareAtPrice && (
                  <>
                    <span className="text-lg text-slate-400 dark:text-slate-500 line-through">
                      £{formatPrice(product.compareAtPrice)}
                    </span>
                    <span className="text-sm font-medium bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-0.5 rounded">
                      {calculateDiscount(product.price, product.compareAtPrice)}% OFF
                    </span>
                  </>
                )}
              </div>
              
              {/* Short description */}
              {product.shortDescription && (
                <div className="mt-4 text-slate-600 dark:text-slate-300">
                  {product.shortDescription}
                </div>
              )}
              
              {/* Stock status */}
              <div className="mt-4 flex items-center">
                {product.inventory && product.inventory > 0 ? (
                  <div className="flex items-center text-green-600 dark:text-green-400">
                    <Check className="w-5 h-5 mr-1.5" />
                    <span className="font-medium">In stock</span>
                    {product.inventory < 10 && (
                      <span className="ml-1 text-sm">
                        (Only {product.inventory} left)
                      </span>
                    )}
                  </div>
                ) : (
                  <div className="text-red-500 dark:text-red-400 font-medium">
                    Out of stock
                  </div>
                )}
              </div>
              
              {/* Key features */}
              {product.features && product.features.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-white mb-2">
                    Key Features
                  </h3>
                  <ul className="space-y-2">
                    {product.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <Check className="w-4 h-4 text-blue-500 mt-0.5 mr-2 flex-shrink-0" />
                        <span className="text-sm text-slate-600 dark:text-slate-300">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              {/* Add to cart section */}
              <div className="mt-8 border-t border-slate-200 dark:border-slate-700 pt-6">
                <div className="flex items-center mb-4">
                  <label htmlFor="quantity" className="mr-3 text-sm font-medium text-slate-700 dark:text-slate-300">
                    Quantity:
                  </label>
                  <div className="flex items-center border border-slate-200 dark:border-slate-700 rounded-lg">
                    <button 
                      onClick={() => setQuantity(q => Math.max(1, q - 1))}
                      className="w-8 h-8 flex items-center justify-center text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white"
                      disabled={quantity <= 1}
                    >
                      -
                    </button>
                    <input 
                      type="number"
                      id="quantity"
                      min="1"
                      max={product.inventory || 99}
                      value={quantity}
                      onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                      className="w-12 h-8 text-center border-none focus:outline-none focus:ring-0 bg-transparent text-slate-800 dark:text-white"
                    />
                    <button 
                      onClick={() => setQuantity(q => Math.min(product.inventory || 99, q + 1))}
                      className="w-8 h-8 flex items-center justify-center text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-white"
                      disabled={product.inventory ? quantity >= product.inventory : false}
                    >
                      +
                    </button>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3">
                  <AddToCartButton 
                    product={product} 
                    quantity={quantity}
                    size="lg"
                    showText={true}
                    className="flex-1"
                  />
                  
                  <button 
                    onClick={handleViewFullProduct}
                    className="flex-1 px-6 py-3 border-2 border-slate-300 dark:border-slate-600 hover:border-slate-400 dark:hover:border-slate-500 text-slate-700 dark:text-white font-semibold rounded-xl flex items-center justify-center transition-colors"
                  >
                    View Full Details
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-80 bg-slate-50 dark:bg-slate-800/50">
            <div className="text-center p-6">
              <p className="text-slate-500 dark:text-slate-400">No product information available</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductPreviewModal; 