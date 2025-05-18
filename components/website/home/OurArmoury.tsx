'use client';

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, Star, Loader2, User, Shield } from "lucide-react";
import { Product } from "@/types/product";
import { getAllProducts } from "@/lib/products-service";
import ProductQuickViewButton from "../products/ProductQuickViewButton";
import { WishlistButton } from "../products/WishlistButton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const OurArmoury = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [jacobProducts, setJacobProducts] = useState<Product[]>([]);
  const [henryProducts, setHenryProducts] = useState<Product[]>([]);

  // Sample products for Jacob and Henry
  const jacobSampleProducts: Product[] = [
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

  const henrySampleProducts: Product[] = [
    {
      id: '5',
      name: 'Pop-Up Boilies Mix Pack - 15mm',
      slug: 'pop-up-boilies-mix-pack-15mm',
      sku: 'POPUP-15MM-001',
      description: 'The ultimate pop-up selection for any situation. This mix pack includes our most successful flavours: Spicy Crab, Sweet Pineapple, Nutty Scopex, and Fishmeal Liver.',
      shortDescription: 'Four proven pop-up flavours in one convenient pack - Henry\'s go-to selection.',
      price: 12.99,
      compareAtPrice: 15.99,
      images: [
        {
          id: '5',
          url: '/products/rippa_popup_pack.png',
          alt: 'Pop-Up Boilies Mix Pack',
          isPrimary: true
        }
      ],
      category: 'bait',
      tags: ['featured'],
      brand: 'rippa',
      inventory: 45,
      isActive: true,
      createdAt: '2023-10-01T00:00:00Z',
      updatedAt: '2023-10-01T00:00:00Z'
    },
    {
      id: '6',
      name: 'Carp Pro Hooks - Size 6 (Pack of 10)',
      slug: 'carp-pro-hooks-size-6',
      sku: 'HOOKS-S6-001',
      description: 'Ultra-sharp, strong hooks that Henry uses for all his big carp rigs. These hooks feature a special coating that reduces visibility underwater and increases durability.',
      shortDescription: 'Henry\'s choice for big carp - ultra-sharp and incredibly strong.',
      price: 7.99,
      compareAtPrice: undefined,
      images: [
        {
          id: '6',
          url: '/products/rippa_hooks.png',
          alt: 'Carp Pro Hooks',
          isPrimary: true
        }
      ],
      category: 'tackle',
      tags: ['best-seller'],
      brand: 'rippa',
      inventory: 78,
      isActive: true,
      createdAt: '2023-09-15T00:00:00Z',
      updatedAt: '2023-09-15T00:00:00Z'
    },
    {
      id: '7',
      name: 'Premium Fluorocarbon Line - 15lb',
      slug: 'premium-fluorocarbon-line-15lb',
      sku: 'FLUORO-15LB-001',
      description: 'Nearly invisible underwater, this premium fluorocarbon is Henry\'s top choice for clear water venues. Excellent abrasion resistance and knot strength.',
      shortDescription: 'Nearly invisible underwater - perfect for pressured, clear water venues.',
      price: 19.99,
      compareAtPrice: 24.99,
      images: [
        {
          id: '7',
          url: '/products/rippa_fluoro.png',
          alt: 'Premium Fluorocarbon Line',
          isPrimary: true
        }
      ],
      category: 'tackle',
      tags: ['sale'],
      brand: 'rippa',
      inventory: 32,
      isActive: true,
      createdAt: '2023-07-20T00:00:00Z',
      updatedAt: '2023-07-20T00:00:00Z'
    },
    {
      id: '8',
      name: 'Solid Bag System Kit',
      slug: 'solid-bag-system-kit',
      sku: 'SBS-KIT-001',
      description: 'The complete solid bag kit used by Henry in his YouTube tutorials. Includes PVA bags, pellets, hook link material, and detailed instructions.',
      shortDescription: 'Everything you need to master the solid bag technique that Henry is famous for.',
      price: 42.99,
      compareAtPrice: 59.95,
      images: [
        {
          id: '8',
          url: '/products/rippa_solid_bag.png',
          alt: 'Solid Bag System Kit',
          isPrimary: true
        }
      ],
      category: 'rigs',
      tags: ['featured'],
      brand: 'rippa',
      inventory: 15,
      isActive: true,
      createdAt: '2023-08-05T00:00:00Z',
      updatedAt: '2023-08-05T00:00:00Z'
    }
  ];

  useEffect(() => {
    // Load products from the service in real environment
    const loadProducts = async () => {
      try {
        const allProducts = await getAllProducts();
        // Filter products for Jacob and Henry, or use sample data if API call fails
        if (allProducts && allProducts.length > 0) {
          // In a real app, you would filter based on some criteria
          // For now, let's just split them randomly
          const jacobsProducts = allProducts.slice(0, 4);
          const henrysProducts = allProducts.slice(4, 8);
          
          setJacobProducts(jacobsProducts.length ? jacobsProducts : jacobSampleProducts);
          setHenryProducts(henrysProducts.length ? henrysProducts : henrySampleProducts);
        } else {
          // Fall back to sample data if API call returns empty
          setJacobProducts(jacobSampleProducts);
          setHenryProducts(henrySampleProducts);
        }
      } catch (error) {
        console.error("Failed to load products:", error);
        setError("Failed to load products. Showing sample data instead.");
        setJacobProducts(jacobSampleProducts);
        setHenryProducts(henrySampleProducts);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
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

  // Render product card 
  const renderProduct = (product: Product) => {
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
  };

  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-center mb-8">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-800 mb-4 border border-blue-200">
            <Shield className="h-4 w-4 mr-1.5 text-blue-600" />
            <span className="font-semibold text-sm">Pro Angler's Choice</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-2 text-center">Our Fishing Armoury</h2>
        </div>

        <Tabs defaultValue="jacob" className="w-full">
          <div className="flex justify-center mb-6">
            <TabsList className="bg-white shadow-md">
              <TabsTrigger 
                value="jacob" 
                className="data-[state=active]:bg-blue-600 data-[state=active]:text-white px-6 py-3"
              >
                <div className="flex items-center">
                  <User className="h-4 w-4 mr-2" />
                  <span>Jacob's Kit</span>
                </div>
              </TabsTrigger>
              <TabsTrigger 
                value="henry" 
                className="data-[state=active]:bg-blue-600 data-[state=active]:text-white px-6 py-3"
              >
                <div className="flex items-center">
                  <User className="h-4 w-4 mr-2" />
                  <span>Henry's Kit</span>
                </div>
              </TabsTrigger>
            </TabsList>
          </div>
          
          {loading ? (
            <div className="flex justify-center items-center h-48">
              <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
            </div>
          ) : (
            <>
              <TabsContent value="jacob">
                <p className="text-center mb-8 text-slate-700 italic max-w-3xl mx-auto">
                  "These are the exact products I rely on for my fishing sessions. From my go-to rigs to my favourite bait - this is the real kit that helps me put fish on the bank."
                  <span className="block mt-2 text-sm font-medium text-slate-900">- Jacob Worth</span>
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {jacobProducts.map(renderProduct)}
                </div>
              </TabsContent>
              
              <TabsContent value="henry">
                <p className="text-center mb-8 text-slate-700 italic max-w-3xl mx-auto">
                  "Every product here has earned its place in my tackle box through countless sessions. These are the tools I trust when targeting specimen carp on the most challenging waters."
                  <span className="block mt-2 text-sm font-medium text-slate-900">- Henry Lennon</span>
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {henryProducts.map(renderProduct)}
                </div>
              </TabsContent>
            </>
          )}
        </Tabs>
        
        <div className="flex justify-center mt-8">
          <Link 
            href="/products" 
            className="px-6 py-3 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-colors flex items-center font-medium shadow-md"
          >
            <ShoppingCart className="mr-2 h-5 w-5" />
            Browse All Tackle
          </Link>
        </div>
      </div>
    </section>
  );
}; 