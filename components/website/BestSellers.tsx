'use client';

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, Star, Loader2 } from "lucide-react";
import { Product } from "@/types/product";
import { getBestSellingProducts, getAllProducts } from "@/lib/products-service";
import ProductQuickViewButton from "./products/ProductQuickViewButton";
import { WishlistButton } from "./products/WishlistButton";

export const BestSellers = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBestSellers = async () => {
      setLoading(true);
      try {
        // Try to get best-selling products first
        let data = await getBestSellingProducts(4);
        
        // If no best sellers found, fetch newest products as fallback
        if (!data || data.length === 0) {
          console.log("No best sellers found, using recent products as fallback");
          const allProducts = await getAllProducts();
          data = allProducts.slice(0, 4);
        }
        
        setProducts(data);
      } catch (error) {
        console.error('Error fetching best sellers:', error);
        setError('Failed to load products');
        // Fallback to sample data if API fails
        setProducts(sampleProducts);
      } finally {
        setLoading(false);
      }
    };

    fetchBestSellers();
  }, []);

  // Helper function to safely get image URL
  const getImageUrl = (image: any): string => {
    if (!image) return '/placeholder-product.png';
    
    if (typeof image === 'string') return image;
    
    if (typeof image === 'object') {
      if (image.url) return image.url;
      return '/placeholder-product.png';
    }
    
    return '/placeholder-product.png';
  };

  // Backup sample products in case the database fetch fails
  const sampleProducts: Product[] = [
    {
      id: '1',
      name: "Henry Lennon's Separation/Slip Ronnie Rig Bundle",
      slug: 'henry-lennons-separation-slip-ronnie-rig-bundle',
      sku: 'HL-RONNIE-001',
      description: "Henry Lennon's Separation/Slip Ronnie Rig is a presentation that he has been using for years, and it has accounted for countless big carp for him across the UK and Europe.",
      shortDescription: "Henry Lennon's proven rig that has accounted for countless big carp.",
      price: 34.99,
      compareAtPrice: 54.60,
      images: [
        {
          id: '1',
          url: '/products/rippa_slipd_bundle.png',
          alt: "Henry Lennon's Separation/Slip Ronnie Rig Bundle",
          isPrimary: true
        }
      ],
      category: 'rigs',
      tags: ['best-seller'],
      brand: 'rippa',
      inventory: 25,
      isActive: true,
      createdAt: '2023-06-15T00:00:00Z',
      updatedAt: '2023-06-15T00:00:00Z'
    },
    {
      id: '2',
      name: 'Combi-Multi Slip D Bundle',
      slug: 'combi-multi-slip-d-bundle',
      sku: 'CMSD-001',
      description: 'The Combi-Multi Slip D rig is an advanced carp fishing rig favoured by Jacob Worth for bottom bait and wafter fishing.',
      shortDescription: 'Advanced carp fishing rig for bottom bait and wafter fishing.',
      price: 49.99,
      compareAtPrice: 57.00,
      images: [
        {
          id: '2',
          url: '/products/rippa_ronnie_bundle.png',
          alt: 'Combi-Multi Slip D Bundle',
          isPrimary: true
        }
      ],
      category: 'rigs',
      tags: ['featured'],
      brand: 'rippa',
      inventory: 18,
      isActive: true,
      createdAt: '2023-07-20T00:00:00Z',
      updatedAt: '2023-07-20T00:00:00Z'
    },
    {
      id: '3',
      name: 'PVA Bundle',
      slug: 'pva-bundle',
      sku: 'PVA-BUNDLE-001',
      description: 'Stock up on PVA with this heavily discounted bundle. This bundle will equip you with the PVA you need to fish fine PVA stick mixes and maggot bags, solid bags and standard PVA webbing.',
      shortDescription: 'Stock up on PVA with this heavily discounted bundle for stick mixes, maggot bags, and solid bags.',
      price: 39.99,
      compareAtPrice: 54.93,
      images: [
        {
          id: '3',
          url: '/products/rippa_pva_bundle.png',
          alt: 'PVA Bundle',
          isPrimary: true
        }
      ],
      category: 'accessories',
      tags: ['sale'],
      brand: 'nash',
      inventory: 22,
      isActive: true,
      createdAt: '2023-08-10T00:00:00Z',
      updatedAt: '2023-08-10T00:00:00Z'
    },
    {
      id: '4',
      name: 'Rippa Tackle Mystery Box - £29.99 worth £55+',
      slug: 'rippa-tackle-mystery-box',
      sku: 'MYSTERY-BOX-001',
      description: 'Our Rippa Tackle Mystery Box contains a selection of carp fishing items that would find a home in any angler\'s tackle box. They make the perfect gift for a loved one, or being purchased yourself to make the most of this fantastic deal.',
      shortDescription: 'Contains a selection of carp fishing items worth over £55.',
      price: 29.99,
      compareAtPrice: 55.00,
      images: [
        {
          id: '4',
          url: '/products/rippa_mystery.png',
          alt: 'Rippa Tackle Mystery Box',
          isPrimary: true
        }
      ],
      category: 'mystery-boxes',
      tags: ['best-seller', 'featured'],
      brand: 'rippa',
      inventory: 30,
      isActive: true,
      createdAt: '2023-09-05T00:00:00Z',
      updatedAt: '2023-09-05T00:00:00Z'
    }
  ];

  return (
    <section className="py-8 bg-blue-50">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center mb-10">
          <div>
            <h2 className="text-3xl font-bold text-blue-800 mb-1">Best Sellers</h2>
            <p className="text-slate-600">The most popular items with our anglers this season</p>
          </div>
          <Link 
            href="/products" 
            className="mt-4 md:mt-0 px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
          >
            <ShoppingCart className="mr-2 h-4 w-4" />
            View All Products
          </Link>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center h-48">
            <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => {
              // Check if images is an array of objects or array of strings
              let primaryImage;
              if (product.images && product.images.length > 0) {
                if (typeof product.images[0] === 'string') {
                  primaryImage = { url: product.images[0], alt: product.name };
                } else {
                  primaryImage = product.images.find(img => 
                    img.isPrimary || img.position === 1
                  ) || product.images[0];
                }
              }
              
              const discount = product.compareAtPrice ? Math.round(((product.compareAtPrice - Number(product.price)) / product.compareAtPrice) * 100) : 0;
              const savings = product.compareAtPrice ? (product.compareAtPrice - Number(product.price)).toFixed(2) : 0;
              
              return (
                <div key={product.id || product.slug} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative h-48 group">
                    {primaryImage ? (
                      <Image 
                        src={getImageUrl(primaryImage)}
                        alt={primaryImage.alt || product.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full bg-slate-200 flex items-center justify-center">
                        <ShoppingCart className="h-12 w-12 text-slate-400" />
                      </div>
                    )}
                    
                    <div className="absolute top-2 left-2 z-10">
                      <WishlistButton product={product} size="sm" />
                    </div>
                    
                    {product.tags?.includes('best-seller') && (
                      <span className="absolute top-2 right-2 bg-teal-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
                        Best Seller
                      </span>
                    )}
                    {savings && Number(savings) > 0 && (
                      <span className="absolute bottom-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded-md font-bold">
                        Save £{savings}
                      </span>
                    )}
                  </div>
                  <div className="p-4">
                    <div className="flex items-center mb-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`h-3.5 w-3.5 ${i < 4 ? 'text-yellow-400 fill-yellow-400' : 'text-slate-300'}`} />
                      ))}
                      <span className="text-xs text-slate-500 ml-1">(12)</span>
                    </div>
                    <h3 className="font-medium text-slate-900 line-clamp-2 h-12">{product.name}</h3>
                    <div className="mt-2 flex items-center justify-between">
                      <div>
                        {product.compareAtPrice ? (
                          <>
                            <span className="font-bold text-blue-700">£{Number(product.price).toFixed(2)}</span>
                            <span className="ml-2 text-sm line-through text-slate-500">£{product.compareAtPrice.toFixed(2)}</span>
                          </>
                        ) : (
                          <span className="font-bold text-blue-700">£{Number(product.price).toFixed(2)}</span>
                        )}
                      </div>
                    </div>
                    
                    {/* Action buttons */}
                    <div className="mt-3 grid grid-cols-2 gap-1">
                      <Link 
                        href={`/products/${product.slug}`}
                        className="flex items-center justify-center text-sm font-medium bg-blue-600 text-white px-3 py-1.5 rounded-l-md hover:bg-blue-700 transition-colors"
                      >
                        <ShoppingCart className="w-4 h-4 mr-1.5" />
                        Details
                      </Link>
                      
                      <ProductQuickViewButton productSlug={product.slug} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-10 bg-white rounded-lg shadow">
            <p className="text-slate-600">No products found</p>
          </div>
        )}
      </div>
    </section>
  );
}; 