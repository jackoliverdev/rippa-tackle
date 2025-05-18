'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ShoppingCart, Star, Eye, ChevronDown, ChevronUp, X, Search, Loader2, SlidersHorizontal } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Product, ProductCategory } from '@/types/product';
import { getAllProducts, getProductsByCategory, getProductsByTag, searchProducts, getSaleProducts } from '@/lib/products-service';
import ProductQuickViewButton from './ProductQuickViewButton';
import { PRODUCT_FILTER_EVENT } from './ProductFilterLink';
import { WishlistButton } from './WishlistButton';
import MobileFilterSheet from './MobileFilterSheet';

// Simplified Product Card component
const ProductCard = ({ product }: { product: Product }) => {
  // Check for position-based images or isPrimary flag
  const primaryImage = product.images?.find(img => img.position === 1 || img.isPrimary) || product.images?.[0];
  const discount = product.compareAtPrice ? Math.round(((product.compareAtPrice - Number(product.price)) / product.compareAtPrice) * 100) : 0;
  
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow group">
      <Link href={`/products/${product.slug}`}>
        <div className="relative h-48">
          {primaryImage ? (
            <Image 
              src={primaryImage.url} 
              alt={primaryImage.alt || product.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full bg-slate-200 flex items-center justify-center">
              <ShoppingCart className="h-12 w-12 text-slate-400" />
            </div>
          )}
          
          {/* Add WishlistButton */}
          <div className="absolute top-2 right-2 z-10">
            <WishlistButton product={product} size="sm" />
          </div>
          
          {discount > 0 && (
            <span className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
              {discount}% Off
            </span>
          )}
          
          {product.sale && !discount && (
            <span className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
              Sale
            </span>
          )}
        </div>
      </Link>
      
      <div className="p-4">
        <div className="flex items-center mb-1">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className={`h-3.5 w-3.5 ${i < 4 ? 'text-yellow-400 fill-yellow-400' : 'text-slate-300'}`} />
          ))}
          <span className="text-xs text-slate-500 ml-1">(12)</span>
        </div>
        
        <Link href={`/products/${product.slug}`} className="hover:text-blue-600">
          <h3 className="font-medium text-slate-900 line-clamp-2 h-12 group-hover:text-blue-600 transition-colors">
            {product.name}
          </h3>
        </Link>
        
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

type FilterState = {
  category: ProductCategory | 'all';
  subcategory: string | null;
  brand: string | null;
  priceRange: 'all' | 'under-50' | '50-100' | '100-250' | 'over-250';
  onSale: boolean;
};

export const ProductGrid = ({ 
  searchQuery: initialSearchQuery, 
  title = 'All Products',
  showSaleOnly = false,
  initialCategory = 'all',
  initialSubcategory = null,
  initialBrand = null
}: { 
  searchQuery?: string;
  title?: string;
  showSaleOnly?: boolean;
  initialCategory?: ProductCategory | 'all';
  initialSubcategory?: string | null;
  initialBrand?: string | null;
}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Search state
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery || "");
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Show all products state
  const [showAllProducts, setShowAllProducts] = useState(false);
  
  // Filter states
  const [filters, setFilters] = useState<FilterState>({
    category: initialCategory,
    subcategory: initialSubcategory,
    brand: initialBrand,
    priceRange: 'all',
    onSale: showSaleOnly
  });
  
  // UI state
  const [expandedSections, setExpandedSections] = useState({
    categories: true,
    subcategories: true,
    priceRange: false,
    brands: false
  });
  
  // Visible subcategories based on product data
  const [subcategories, setSubcategories] = useState<{[key in ProductCategory]?: string[]}>({});
  const [allBrands, setAllBrands] = useState<string[]>([]);
  
  // Add state for mobile filter sheet
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  
  // Toggle filter sections
  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };
  
  // Listen for filter change events from navbar
  useEffect(() => {
    const handleFilterChange = (event: CustomEvent) => {
      const { filters: newFilters } = event.detail;
      
      // Update filter state
      setFilters(prevFilters => {
        const updatedFilters = { ...prevFilters };
        
        // Update category if present
        if (newFilters.category) {
          updatedFilters.category = newFilters.category as ProductCategory | 'all';
          // Reset subcategory if category changed
          if (newFilters.category !== prevFilters.category) {
            updatedFilters.subcategory = null;
          }
        } else {
          // Reset to 'all' if category was removed
          updatedFilters.category = 'all';
          updatedFilters.subcategory = null;
        }
        
        // Update subcategory if present
        if (newFilters.subcategory) {
          updatedFilters.subcategory = newFilters.subcategory;
        } else if (newFilters.hasOwnProperty('subcategory')) {
          // Only reset if subcategory param exists but is empty
          updatedFilters.subcategory = null;
        }
        
        // Update brand if present
        if (newFilters.brand) {
          updatedFilters.brand = newFilters.brand;
        } else if (newFilters.hasOwnProperty('brand')) {
          // Only reset if brand param exists but is empty
          updatedFilters.brand = null;
        }
        
        // Update sale flag if present
        if (newFilters.hasOwnProperty('sale')) {
          updatedFilters.onSale = newFilters.sale === 'true';
        }
        
        return updatedFilters;
      });
      
      // Clear search when filters change
      setSearchQuery('');
      setShowSearchResults(false);
      
      // Reset to first page of results
      setShowAllProducts(false);
    };
    
    // Add event listener
    document.addEventListener(PRODUCT_FILTER_EVENT, handleFilterChange as EventListener);
    
    // Clean up
    return () => {
      document.removeEventListener(PRODUCT_FILTER_EVENT, handleFilterChange as EventListener);
    };
  }, []);
  
  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      
      try {
        let data: Product[];
        
        if (showSaleOnly) {
          // If showSaleOnly flag is true, fetch only sale products
          data = await getSaleProducts();
        } else if (searchQuery && searchQuery.length > 1) {
          // If searchQuery is provided, use it to search products
          data = await searchProducts(searchQuery);
        } else if (filters.category !== 'all' || filters.subcategory || filters.brand) {
          // If filters are applied, use them to filter products
          // We'll handle subcategory and brand filters in the FE for now
          data = await getProductsByCategory(filters.category as ProductCategory);
          
          // Apply subcategory filter on the client side if needed
          if (filters.subcategory) {
            data = data.filter(p => 
              p.subcategory && 
              p.subcategory.toLowerCase() === filters.subcategory?.toLowerCase()
            );
          }
          
          // Apply brand filter on the client side if needed
          if (filters.brand) {
            data = data.filter(p => 
              p.brand && 
              p.brand.toLowerCase() === filters.brand?.toLowerCase()
            );
          }
        } else {
          data = await getAllProducts();
        }
        
        if (data.length === 0) {
          if (searchQuery) {
            console.warn(`No products found for search query: ${searchQuery}`);
          } else if (showSaleOnly) {
            console.warn('No sale products found');
          } else if (filters.category !== 'all') {
            console.warn(`No products found for category: ${filters.category}, subcategory: ${filters.subcategory}`);
          }
        }
        
        // Extract subcategories and brands from data
        const subcatMap: {[key in ProductCategory]?: Set<string>} = {};
        const brandsSet = new Set<string>();
        
        data.forEach(product => {
          // Process subcategories
          if (product.category && product.subcategory) {
            if (!subcatMap[product.category as ProductCategory]) {
              subcatMap[product.category as ProductCategory] = new Set();
            }
            subcatMap[product.category as ProductCategory]?.add(product.subcategory);
          }
          
          // Process brands
          if (product.brand) {
            brandsSet.add(product.brand);
          }
        });
        
        // Convert Sets to arrays
        const processedSubcats: {[key in ProductCategory]?: string[]} = {};
        Object.entries(subcatMap).forEach(([cat, subcats]) => {
          processedSubcats[cat as ProductCategory] = Array.from(subcats);
        });
        
        setSubcategories(processedSubcats);
        setAllBrands(Array.from(brandsSet));
        setProducts(data);
        setFilteredProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
        setError('Failed to load products. Please try again later.');
        // Use backup sample data if Supabase fetch fails
        setProducts(sampleProducts);
        setFilteredProducts(sampleProducts);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProducts();
  }, [filters.category, searchQuery, showSaleOnly, filters.subcategory, filters.brand]);
  
  // Apply filters
  useEffect(() => {
    let filtered = [...products];
    
    // Apply category filter (already applied in the fetch)
    
    // Apply subcategory filter
    if (filters.subcategory) {
      filtered = filtered.filter(p => p.subcategory === filters.subcategory);
    }
    
    // Apply brand filter
    if (filters.brand) {
      filtered = filtered.filter(p => p.brand === filters.brand);
    }
    
    // Apply price range filter
    if (filters.priceRange !== 'all') {
      filtered = filtered.filter(p => {
        const price = Number(p.price);
        switch (filters.priceRange) {
          case 'under-50':
            return price < 50;
          case '50-100':
            return price >= 50 && price <= 100;
          case '100-250':
            return price > 100 && price <= 250;
          case 'over-250':
            return price > 250;
          default:
            return true;
        }
      });
    }
    
    // Apply sale filter
    if (filters.onSale && !showSaleOnly) {
      filtered = filtered.filter(p => p.sale || (p.compareAtPrice && p.compareAtPrice > Number(p.price)));
    }
    
    setFilteredProducts(filtered);
  }, [filters, products, showSaleOnly]);
  
  // Handle filter changes
  const handleCategoryChange = (category: ProductCategory | 'all') => {
    setFilters({
      ...filters,
      category,
      subcategory: null // Reset subcategory when category changes
    });
    
    // Update URL to reflect filter changes
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      if (category === 'all') {
        url.searchParams.delete('category');
        url.searchParams.delete('subcategory');
      } else {
        url.searchParams.set('category', category);
        url.searchParams.delete('subcategory');
      }
      window.history.pushState({}, '', url);
    }
  };
  
  const handleSubcategoryChange = (subcategory: string | null) => {
    setFilters({
      ...filters,
      subcategory
    });
    
    // Update URL to reflect filter changes
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      if (subcategory === null) {
        url.searchParams.delete('subcategory');
      } else {
        url.searchParams.set('subcategory', subcategory);
      }
      window.history.pushState({}, '', url);
    }
  };
  
  const handleBrandChange = (brand: string | null) => {
    setFilters({
      ...filters,
      brand
    });
    
    // Update URL to reflect filter changes
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      if (brand === null) {
        url.searchParams.delete('brand');
      } else {
        url.searchParams.set('brand', brand);
      }
      window.history.pushState({}, '', url);
    }
  };
  
  const handlePriceRangeChange = (range: FilterState['priceRange']) => {
    setFilters({
      ...filters,
      priceRange: range
    });
  };
  
  const handleSaleToggle = () => {
    setFilters({
      ...filters,
      onSale: !filters.onSale
    });
  };
  
  const clearAllFilters = () => {
    setFilters({
      category: 'all',
      subcategory: null,
      brand: null,
      priceRange: 'all',
      onSale: showSaleOnly
    });
    
    // Clear search-related state
    setSearchQuery("");
    setSearchResults([]);
    setShowSearchResults(false);
    
    // Reset to original product list
    const fetchAllProducts = async () => {
      setLoading(true);
      try {
        let data = showSaleOnly 
          ? await getSaleProducts()
          : await getAllProducts();
        setProducts(data);
        setFilteredProducts(data);
      } catch (error) {
        console.error("Error resetting products:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchAllProducts();
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
  
  // Handle search input changes with debounce
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    // Clear any existing timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    if (query.length < 2) {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }
    
    setIsSearching(true);
    setShowSearchResults(true);
    
    // Debounce search to avoid too many requests
    searchTimeoutRef.current = setTimeout(async () => {
      try {
        const results = await searchProducts(query);
        setSearchResults(results.slice(0, 5)); // Limit to 5 results for dropdown
      } catch (error) {
        console.error("Error searching products:", error);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 300);
  };
  
  // Apply search to main product grid
  const applySearchFilter = async () => {
    if (searchQuery.length < 2) return;
    
    setLoading(true);
    try {
      const results = await searchProducts(searchQuery);
      setFilteredProducts(results);
      // Reset other filters when applying search
      setFilters({
        ...filters,
        category: 'all',
        subcategory: null,
        brand: null,
        priceRange: 'all'
      });
      setShowSearchResults(false);
    } catch (error) {
      console.error("Error applying search filter:", error);
    } finally {
      setLoading(false);
    }
  };
  
  // Clear search and reset filters
  const clearSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
    setShowSearchResults(false);
    
    // Reset to original product list
    const fetchAllProducts = async () => {
      setLoading(true);
      try {
        let data = showSaleOnly 
          ? await getSaleProducts()
          : await getAllProducts();
        setProducts(data);
        setFilteredProducts(data);
      } catch (error) {
        console.error("Error resetting products:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchAllProducts();
  };
  
  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);
  
  // Calculate products to display (limited or all)
  const displayedProducts = showAllProducts 
    ? filteredProducts 
    : filteredProducts.slice(0, 6); // Show only 6 products initially (2 rows of 3)
  
  // Handle showing all products
  const handleShowAllProducts = () => {
    setShowAllProducts(true);
  };
  
  // Function to toggle mobile filter sheet
  const toggleMobileFilter = () => {
    setIsMobileFilterOpen(!isMobileFilterOpen);
  };
  
  // Function to handle filter changes from mobile sheet
  const handleMobileFilterChange = (newFilters: Partial<FilterState>) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters
    }));
  };
  
  // Helper function to count selected filters
  const countSelectedFilters = (): number => {
    let count = 0;
    if (filters.category !== 'all') count++;
    if (filters.subcategory !== null) count++;
    if (filters.brand !== null) count++;
    if (filters.priceRange !== 'all') count++;
    if (filters.onSale) count++;
    return count;
  };
  
  return (
    <div id="product-grid-section" className="py-10 bg-blue-50 relative">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-slate-800">{title}</h2>
          
          {/* Mobile filter button */}
          <button 
            className="md:hidden flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg"
            onClick={toggleMobileFilter}
          >
            <SlidersHorizontal className="h-4 w-4" />
            <span>Filters</span>
            {(filters.category !== 'all' || 
              filters.subcategory !== null || 
              filters.brand !== null || 
              filters.priceRange !== 'all' || 
              filters.onSale) && (
              <span className="bg-white text-blue-600 rounded-full h-5 w-5 flex items-center justify-center text-xs font-bold">
                {countSelectedFilters()}
              </span>
            )}
          </button>
        </div>
        
        <div className="flex flex-col md:flex-row gap-8">
          {/* Filters sidebar - desktop only */}
          {!initialSearchQuery && (
            <div className="hidden md:block w-full md:w-64 flex-shrink-0 bg-white rounded-lg shadow-sm overflow-hidden h-fit">
              {/* Filters header */}
              <div className="p-4 border-b flex justify-between items-center">
                <h3 className="font-bold text-slate-800">Filters</h3>
                <button 
                  onClick={clearAllFilters}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  Clear all
                </button>
              </div>
              
              {/* Search bar */}
              <div className="p-4 border-b">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                    onFocus={() => setShowSearchResults(searchQuery.length > 1)}
                    className="w-full py-2 px-4 pl-9 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
                  />
                  <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    {isSearching ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Search className="h-4 w-4" />
                    )}
                  </div>
                  {searchQuery.length > 0 && (
                    <button 
                      onClick={() => {
                        setSearchQuery("");
                        setSearchResults([]);
                        setShowSearchResults(false);
                      }} 
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                  
                  {/* Search results dropdown */}
                  {showSearchResults && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-md shadow-lg z-50">
                      <div className="p-3">
                        <h3 className="text-xs font-semibold text-gray-500 mb-2">RESULTS</h3>
                        {isSearching ? (
                          <div className="py-4 text-center">
                            <Loader2 className="h-5 w-5 mx-auto text-blue-500 animate-spin mb-2" />
                            <p className="text-xs text-gray-500">Searching...</p>
                          </div>
                        ) : searchResults.length > 0 ? (
                          <div className="space-y-3">
                            {searchResults.map(product => (
                              <Link 
                                key={product.id} 
                                href={`/products/${product.slug}`} 
                                className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded"
                                onClick={() => {
                                  setShowSearchResults(false);
                                }}
                              >
                                <div className="w-10 h-10 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                                  {product.images && product.images[0] ? (
                                    <Image
                                      src={product.images[0].url || ''}
                                      alt={product.name}
                                      width={40}
                                      height={40}
                                      className="w-full h-full object-cover"
                                    />
                                  ) : (
                                    <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500">
                                      <ShoppingCart className="h-4 w-4 text-gray-400" />
                                    </div>
                                  )}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-xs font-medium truncate">{product.name}</p>
                                  <span className="text-xs text-blue-600 font-bold">£{Number(product.price).toFixed(2)}</span>
                                </div>
                              </Link>
                            ))}
                            
                            <button 
                              onClick={() => {
                                applySearchFilter();
                                setShowSearchResults(false);
                              }}
                              className="block w-full py-2 text-xs text-center text-blue-600 hover:text-blue-800 border-t border-gray-100 pt-2"
                            >
                              Show all results
                            </button>
                          </div>
                        ) : (
                          <div className="py-4 text-center">
                            <p className="text-xs text-gray-500">No products found</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Categories */}
              <div className="border-b">
                <div 
                  className="p-4 flex justify-between items-center cursor-pointer hover:bg-slate-50"
                  onClick={() => toggleSection('categories')}
                >
                  <h4 className="font-medium text-slate-800">Categories</h4>
                  {expandedSections.categories ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </div>
                
                {expandedSections.categories && (
                  <div className="px-4 pb-4">
                    <div className="space-y-2">
                      <label className="flex items-center">
                        <input 
                          type="radio" 
                          name="category" 
                          className="form-radio text-blue-600"
                          checked={filters.category === 'all'}
                          onChange={() => handleCategoryChange('all')}
                        />
                        <span className="ml-2">All Categories</span>
                      </label>
                      
                      <label className="flex items-center">
                        <input 
                          type="radio" 
                          name="category" 
                          className="form-radio text-blue-600"
                          checked={filters.category === 'tackle'}
                          onChange={() => handleCategoryChange('tackle')}
                        />
                        <span className="ml-2">Tackle (80)</span>
                      </label>
                      
                      <label className="flex items-center">
                        <input 
                          type="radio" 
                          name="category" 
                          className="form-radio text-blue-600"
                          checked={filters.category === 'clothing'}
                          onChange={() => handleCategoryChange('clothing')}
                        />
                        <span className="ml-2">Clothing (24)</span>
                      </label>
                      
                      <label className="flex items-center">
                        <input 
                          type="radio" 
                          name="category" 
                          className="form-radio text-blue-600"
                          checked={filters.category === 'bait'}
                          onChange={() => handleCategoryChange('bait')}
                        />
                        <span className="ml-2">Bait (12)</span>
                      </label>
                      
                      <label className="flex items-center">
                        <input 
                          type="radio" 
                          name="category" 
                          className="form-radio text-blue-600"
                          checked={filters.category === 'accessories'}
                          onChange={() => handleCategoryChange('accessories')}
                        />
                        <span className="ml-2">Accessories (1)</span>
                      </label>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Subcategories - separate section */}
              <div className="border-b">
                <div 
                  className="p-4 flex justify-between items-center cursor-pointer hover:bg-slate-50"
                  onClick={() => toggleSection('subcategories')}
                >
                  <h4 className="font-medium text-slate-800">Subcategories</h4>
                  {expandedSections.subcategories ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </div>
                
                {expandedSections.subcategories && (
                  <div className="px-4 pb-4">
                    {filters.category !== 'all' && subcategories[filters.category] ? (
                      <div className="space-y-2 max-h-40 overflow-y-auto">
                        {subcategories[filters.category]?.map(sub => (
                          <label key={sub} className="flex items-center">
                            <input 
                              type="radio" 
                              name="subcategory" 
                              className="form-radio text-blue-600"
                              checked={filters.subcategory === sub}
                              onChange={() => handleSubcategoryChange(sub)}
                            />
                            <span className="ml-2">{sub}</span>
                          </label>
                        ))}
                        {filters.subcategory && (
                          <button 
                            className="text-xs text-blue-600 hover:underline mt-1"
                            onClick={() => handleSubcategoryChange(null)}
                          >
                            Clear selection
                          </button>
                        )}
                      </div>
                    ) : (
                      <p className="text-sm text-slate-500">Select a category first</p>
                    )}
                  </div>
                )}
              </div>
              
              {/* Price Range */}
              <div className="border-b">
                <div 
                  className="p-4 flex justify-between items-center cursor-pointer hover:bg-slate-50"
                  onClick={() => toggleSection('priceRange')}
                >
                  <h4 className="font-medium text-slate-800">Price Range</h4>
                  {expandedSections.priceRange ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </div>
                
                {expandedSections.priceRange && (
                  <div className="px-4 pb-4">
                    <div className="space-y-2">
                      <label className="flex items-center">
                        <input 
                          type="radio" 
                          name="priceRange" 
                          className="form-radio text-blue-600"
                          checked={filters.priceRange === 'all'}
                          onChange={() => handlePriceRangeChange('all')}
                        />
                        <span className="ml-2">All Prices</span>
                      </label>
                      
                      <label className="flex items-center">
                        <input 
                          type="radio" 
                          name="priceRange" 
                          className="form-radio text-blue-600"
                          checked={filters.priceRange === 'under-50'}
                          onChange={() => handlePriceRangeChange('under-50')}
                        />
                        <span className="ml-2">Under £50</span>
                      </label>
                      
                      <label className="flex items-center">
                        <input 
                          type="radio" 
                          name="priceRange" 
                          className="form-radio text-blue-600"
                          checked={filters.priceRange === '50-100'}
                          onChange={() => handlePriceRangeChange('50-100')}
                        />
                        <span className="ml-2">£50 - £100</span>
                      </label>
                      
                      <label className="flex items-center">
                        <input 
                          type="radio" 
                          name="priceRange" 
                          className="form-radio text-blue-600"
                          checked={filters.priceRange === '100-250'}
                          onChange={() => handlePriceRangeChange('100-250')}
                        />
                        <span className="ml-2">£100 - £250</span>
                      </label>
                      
                      <label className="flex items-center">
                        <input 
                          type="radio" 
                          name="priceRange" 
                          className="form-radio text-blue-600"
                          checked={filters.priceRange === 'over-250'}
                          onChange={() => handlePriceRangeChange('over-250')}
                        />
                        <span className="ml-2">Over £250</span>
                      </label>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Brands */}
              <div className="border-b">
                <div 
                  className="p-4 flex justify-between items-center cursor-pointer hover:bg-slate-50"
                  onClick={() => toggleSection('brands')}
                >
                  <h4 className="font-medium text-slate-800">Brands</h4>
                  {expandedSections.brands ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </div>
                
                {expandedSections.brands && (
                  <div className="px-4 pb-4">
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {allBrands.map(brand => (
                        <label key={brand} className="flex items-center">
                          <input 
                            type="radio" 
                            name="brand" 
                            className="form-radio text-blue-600"
                            checked={filters.brand === brand}
                            onChange={() => handleBrandChange(brand)}
                          />
                          <span className="ml-2">{brand}</span>
                        </label>
                      ))}
                      
                      {filters.brand && (
                        <button 
                          className="text-xs text-blue-600 hover:underline mt-1"
                          onClick={() => handleBrandChange(null)}
                        >
                          Clear selection
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
              
              {/* On Sale */}
              <div className="border-b">
                <div className="p-4 flex items-center">
                  <label className="flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="form-checkbox text-red-600 rounded"
                      checked={filters.onSale}
                      onChange={handleSaleToggle}
                      disabled={showSaleOnly}
                    />
                    <span className="ml-2 flex items-center">
                      <span className="font-medium text-slate-800">On Sale</span>
                      <span className="ml-1 bg-red-100 text-red-800 text-xs px-1.5 py-0.5 rounded-full">20</span>
                    </span>
                  </label>
                </div>
              </div>
            </div>
          )}
          
          {/* Mobile filter sheet */}
          <MobileFilterSheet 
            isOpen={isMobileFilterOpen}
            onClose={() => setIsMobileFilterOpen(false)}
            filters={filters}
            onFilterChange={handleMobileFilterChange}
            onClearFilters={clearAllFilters}
            subcategories={subcategories}
            brands={allBrands}
          />
          
          {/* Products grid */}
          <div className="flex-1">
            {/* Active filters */}
            {(filters.category !== 'all' || filters.subcategory || filters.brand || filters.priceRange !== 'all' || (filters.onSale && !showSaleOnly) || searchQuery.length > 1) && (
              <div className="bg-white rounded-lg p-3 mb-6 shadow-sm">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm text-slate-500">Active filters:</span>
                  
                  {searchQuery.length > 1 && (
                    <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs flex items-center">
                      Search: {searchQuery}
                      <button 
                        className="ml-1 text-blue-600 hover:text-blue-800"
                        onClick={clearSearch}
                      >
                        <X size={14} />
                      </button>
                    </div>
                  )}
                  
                  {filters.category !== 'all' && (
                    <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs flex items-center">
                      Category: {filters.category}
                      <button 
                        className="ml-1 text-blue-600 hover:text-blue-800"
                        onClick={() => handleCategoryChange('all')}
                      >
                        <X size={14} />
                      </button>
                    </div>
                  )}
                  
                  {filters.subcategory && (
                    <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs flex items-center">
                      {filters.subcategory}
                      <button 
                        className="ml-1 text-blue-600 hover:text-blue-800"
                        onClick={() => handleSubcategoryChange(null)}
                      >
                        <X size={14} />
                      </button>
                    </div>
                  )}
                  
                  {filters.brand && (
                    <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs flex items-center">
                      Brand: {filters.brand}
                      <button 
                        className="ml-1 text-blue-600 hover:text-blue-800"
                        onClick={() => handleBrandChange(null)}
                      >
                        <X size={14} />
                      </button>
                    </div>
                  )}
                  
                  {filters.priceRange !== 'all' && (
                    <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs flex items-center">
                      {filters.priceRange === 'under-50' && 'Under £50'}
                      {filters.priceRange === '50-100' && '£50 - £100'}
                      {filters.priceRange === '100-250' && '£100 - £250'}
                      {filters.priceRange === 'over-250' && 'Over £250'}
                      <button 
                        className="ml-1 text-blue-600 hover:text-blue-800"
                        onClick={() => handlePriceRangeChange('all')}
                      >
                        <X size={14} />
                      </button>
                    </div>
                  )}
                  
                  {filters.onSale && !showSaleOnly && (
                    <div className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs flex items-center">
                      On Sale
                      <button 
                        className="ml-1 text-red-600 hover:text-red-800"
                        onClick={() => handleSaleToggle()}
                      >
                        <X size={14} />
                      </button>
                    </div>
                  )}
                  
                  <button 
                    className="text-xs text-blue-600 hover:text-blue-800 ml-auto"
                    onClick={clearAllFilters}
                  >
                    Clear all
                  </button>
                </div>
              </div>
            )}
            
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white rounded-xl h-72 shadow-md"></div>
                ))}
              </div>
            ) : error ? (
              <div className="text-center py-16 bg-white rounded-lg shadow">
                <h3 className="text-lg font-medium text-red-600 mb-2">Error</h3>
                <p className="text-slate-500">{error}</p>
              </div>
            ) : filteredProducts.length > 0 ? (
              <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {displayedProducts.map(product => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
                
                {/* Show All button - only visible when there are more products and not already showing all */}
                {!showAllProducts && filteredProducts.length > 6 && (
                  <div className="flex justify-center mt-8">
                    <button 
                      onClick={handleShowAllProducts}
                      className="bg-blue-600 hover:bg-blue-700 transition-colors text-white font-medium rounded-full px-8 py-3 shadow-md hover:shadow-lg"
                    >
                      Show All {filteredProducts.length} Products
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-16 bg-white rounded-lg shadow">
                <h3 className="text-lg font-medium text-slate-800 mb-2">No products found</h3>
                {initialSearchQuery ? (
                  <p className="text-slate-500">No products match "{initialSearchQuery}"</p>
                ) : (
                  <p className="text-slate-500">Try adjusting your filters</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}; 