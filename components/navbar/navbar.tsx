"use client";

import { useState, useRef, useEffect } from "react";
import { NavbarMobile } from "@/components/navbar/navbar-mobile";
import { ShoppingBagIcon, User, Search, Heart, X, Menu, Flag, ChevronDown, Loader2, Gift } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { ProductsDropdown } from "./products-dropdown";
import WebsiteSidebar from "../website/sidebar";
import { searchProducts } from "@/lib/products-service";
import { Product } from "@/types/product";
import { ProductFilterLink } from '@/components/website/products/ProductFilterLink';
import { WishlistDropdown } from "@/components/navbar/wishlist-dropdown";
import { CartDropdown } from "@/components/navbar/cart-dropdown";

// Helper function to format price
const formatPrice = (price: string | number): string => {
  const numericPrice = typeof price === 'string' ? parseFloat(price) : price;
  
  if (isNaN(numericPrice)) {
    return '£0.00';
  }
  
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
    minimumFractionDigits: 2
  }).format(numericPrice);
};

export const NavBar = () => {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [sideMenuOpen, setSideMenuOpen] = useState(false);
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Format a category ID to display name (e.g., "new-in" -> "New In")
  const formatCategoryName = (category: string) => {
    return category
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

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
        setSearchResults(results.slice(0, 5)); // Limit to 5 results
      } catch (error) {
        console.error("Error searching products:", error);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 300);
  };

  // Clean up timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  return (
    <>
      {/* Announcement bar */}
      <div className="w-full bg-red-600 text-white py-1 text-center font-medium flex items-center justify-center">
        <Gift className="h-4 w-4 mr-1.5" /> EARN LOYALTY POINTS WITH EVERY ORDER
      </div>

      <div className="w-full sticky top-0 left-0 right-0 z-50 bg-slate-900">
        {/* Top navigation with logo, search, account */}
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex-shrink-0">
              <div className="flex items-center">
                <Image 
                  src="/rippa_logo.png" 
                  alt="Rippa Tackle"
                  width={48} 
                  height={48}
                  className="h-12 w-12 mr-2" 
                />
                <span className="text-xl font-bold text-white hidden md:inline">
                  RIPPA <span className="text-blue-400">TACKLE</span>
                </span>
              </div>
            </Link>

            {/* Search bar - full width on desktop, hidden on mobile unless active */}
            <div className={`${searchOpen ? 'flex absolute inset-x-0 top-0 bg-slate-900 p-4 z-10' : 'hidden md:flex'} flex-1 max-w-2xl mx-auto px-4`}>
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="Search for products..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  onFocus={() => setShowSearchResults(searchQuery.length > 1)}
                  className="w-full py-2 px-4 pl-10 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  {isSearching ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <Search className="h-5 w-5" />
                  )}
                </div>
                {searchQuery.length > 0 && !searchOpen && (
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
                {searchOpen && (
                  <button 
                    onClick={() => setSearchOpen(false)} 
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                  >
                    <X className="h-5 w-5" />
                  </button>
                )}
                
                {/* Search results dropdown */}
                {showSearchResults && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-md shadow-lg z-50">
                    <div className="p-4">
                      <h3 className="text-sm font-semibold text-gray-500 mb-2">TOP RESULTS</h3>
                      {isSearching ? (
                        <div className="py-6 text-center">
                          <Loader2 className="h-6 w-6 mx-auto text-blue-500 animate-spin mb-2" />
                          <p className="text-sm text-gray-500">Searching products...</p>
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
                                if (searchOpen) setSearchOpen(false);
                              }}
                            >
                              <div className="w-12 h-12 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                                {product.images && product.images[0] ? (
                                  <Image
                                    src={typeof product.images[0] === 'string' ? product.images[0] : product.images[0].url || ''}
                                    alt={product.name}
                                    width={48}
                                    height={48}
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500">
                                    <ShoppingBagIcon className="h-6 w-6 text-gray-400" />
                                  </div>
                                )}
                              </div>
                              <div>
                                <p className="text-sm font-medium">{product.name}</p>
                                <div className="flex items-center justify-between">
                                  <span className="text-sm text-blue-600 font-bold">{formatPrice(product.price)}</span>
                                  {product.category && (
                                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded ml-2">
                                      {formatCategoryName(product.category)}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </Link>
                          ))}
                        </div>
                      ) : searchQuery.length > 1 ? (
                        <div className="py-6 text-center">
                          <p className="text-sm text-gray-500">No products found for "{searchQuery}"</p>
                        </div>
                      ) : null}
                      
                      {searchResults.length > 0 && (
                        <div className="mt-2 pt-2 border-t border-gray-100">
                          <Link 
                            href={`/search?q=${encodeURIComponent(searchQuery)}`}
                            className="block w-full py-2 text-sm text-center text-blue-600 hover:text-blue-800"
                            onClick={() => {
                              setShowSearchResults(false);
                              if (searchOpen) setSearchOpen(false);
                            }}
                          >
                            View all results ({searchResults.length === 5 ? '5+' : searchResults.length})
                          </Link>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* User actions - Updated to match the design in the second screenshot */}
            <div className="flex items-center space-x-6">
              <button className="md:hidden text-white" onClick={() => setSearchOpen(true)}>
                <Search className="h-6 w-6" />
              </button>
              
              <div className="hidden md:flex items-center space-x-6">
                <Link href="/login" className="text-white flex flex-col items-center">
                  <User className="h-6 w-6 mb-1" />
                  <span className="text-xs">ACCOUNT</span>
                </Link>
                
                <WishlistDropdown />
                
                <CartDropdown />
              </div>
            </div>
          </div>
        </div>
        
        {/* Main navigation */}
        <div className="bg-slate-800 py-2 px-4 shadow-sm">
          <div className="container mx-auto flex items-center justify-between">
            <div className="flex items-center">
              {/* Mobile menu button */}
              <button 
                className="text-white flex items-center"
                onClick={() => setSideMenuOpen(true)}
              >
                <Menu className="h-5 w-5 mr-1" />
                <span className="text-sm uppercase">Menu</span>
              </button>
              
              {/* Categories */}
              <div className="hidden md:flex items-center space-x-6 ml-6">
                <ProductFilterLink href="/products?sale=true" className="text-white hover:text-blue-400 text-sm font-medium uppercase flex items-center">
                  <span className="text-amber-500">Sale</span>
                </ProductFilterLink>
                
                <ProductFilterLink href="/products" className="text-white hover:text-blue-400 text-sm font-medium uppercase">
                  All
                </ProductFilterLink>
                
                <div className="relative group">
                  <ProductFilterLink href="/products?category=tackle" className="text-white hover:text-blue-400 text-sm font-medium uppercase flex items-center">
                    Tackle
                    <ChevronDown className="h-4 w-4 ml-1" />
                  </ProductFilterLink>
                  <div className="absolute left-0 mt-0 pt-5 w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 ease-in-out z-10">
                    <div className="bg-white rounded-md shadow-lg py-1">
                      <ProductFilterLink href="/products?category=tackle&subcategory=Rods" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Rods</ProductFilterLink>
                      <ProductFilterLink href="/products?category=tackle&subcategory=Reels" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Reels</ProductFilterLink>
                      <ProductFilterLink href="/products?category=tackle&subcategory=Terminal%20Tackle" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Terminal Tackle</ProductFilterLink>
                      <ProductFilterLink href="/products?category=tackle&subcategory=Hooks" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Hooks</ProductFilterLink>
                      <ProductFilterLink href="/products?category=tackle&subcategory=Bivvies" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Bivvies</ProductFilterLink>
                      <ProductFilterLink href="/products?category=tackle&subcategory=Bedchairs" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Bedchairs</ProductFilterLink>
                      <ProductFilterLink href="/products?category=tackle&subcategory=Chairs" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Chairs</ProductFilterLink>
                      <ProductFilterLink href="/products?category=tackle&subcategory=Alarms" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Alarms</ProductFilterLink>
                      <ProductFilterLink href="/products?category=tackle&subcategory=Rigs" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Rigs</ProductFilterLink>
                      <ProductFilterLink href="/products?category=tackle&subcategory=PVA" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">PVA</ProductFilterLink>
                      <ProductFilterLink href="/products?category=tackle" className="block px-4 py-2 text-sm font-bold text-blue-600 hover:bg-gray-100">All Tackle</ProductFilterLink>
                    </div>
                  </div>
                </div>
                
                <div className="relative group">
                  <ProductFilterLink href="/products?category=bait" className="text-white hover:text-blue-400 text-sm font-medium uppercase flex items-center">
                    Bait
                    <ChevronDown className="h-4 w-4 ml-1" />
                  </ProductFilterLink>
                  <div className="absolute left-0 mt-0 pt-5 w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 ease-in-out z-10">
                    <div className="bg-white rounded-md shadow-lg py-1">
                      <ProductFilterLink href="/products?category=bait&subcategory=Boilies" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Boilies</ProductFilterLink>
                      <ProductFilterLink href="/products?category=bait&subcategory=Hook%20Baits" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Hook Baits</ProductFilterLink>
                      <ProductFilterLink href="/products?category=bait&subcategory=Liquid%20Attractors" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Liquid Attractors</ProductFilterLink>
                      <ProductFilterLink href="/products?category=bait&subcategory=Stick%20Mix" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Stick Mix</ProductFilterLink>
                      <ProductFilterLink href="/products?category=bait&subcategory=Groundbait" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Groundbait</ProductFilterLink>
                      <ProductFilterLink href="/products?category=bait&subcategory=Particles" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Particles</ProductFilterLink>
                      <ProductFilterLink href="/products?category=bait&subcategory=Mixes" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Mixes</ProductFilterLink>
                      <ProductFilterLink href="/products?category=bait&subcategory=Bulk%20Deals" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Bulk Deals</ProductFilterLink>
                      <ProductFilterLink href="/products?category=bait" className="block px-4 py-2 text-sm font-bold text-blue-600 hover:bg-gray-100">All Bait</ProductFilterLink>
                    </div>
                  </div>
                </div>
                
                <div className="relative group">
                  <ProductFilterLink href="/products?category=clothing" className="text-white hover:text-blue-400 text-sm font-medium uppercase flex items-center">
                    Clothing
                    <ChevronDown className="h-4 w-4 ml-1" />
                  </ProductFilterLink>
                  <div className="absolute left-0 mt-0 pt-5 w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 ease-in-out z-10">
                    <div className="bg-white rounded-md shadow-lg py-1">
                      <ProductFilterLink href="/products?category=clothing&subcategory=Apparel" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Apparel</ProductFilterLink>
                      <ProductFilterLink href="/products?category=clothing&subcategory=Headwear" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Headwear</ProductFilterLink>
                      <ProductFilterLink href="/products?category=clothing&subcategory=Youth%20Apparel" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Youth Apparel</ProductFilterLink>
                      <ProductFilterLink href="/products?category=clothing" className="block px-4 py-2 text-sm font-bold text-blue-600 hover:bg-gray-100">All Clothing</ProductFilterLink>
                    </div>
                  </div>
                </div>
                
                <ProductFilterLink href="/products?category=accessories" className="text-white hover:text-blue-400 text-sm font-medium uppercase">
                  Accessories
                </ProductFilterLink>
                
                <div className="relative group">
                  <ProductFilterLink href="/products?category=tackle&subcategory=Bundles" className="text-white hover:text-blue-400 text-sm font-medium uppercase flex items-center">
                    Bundles
                    <ChevronDown className="h-4 w-4 ml-1" />
                  </ProductFilterLink>
                  <div className="absolute right-0 mt-0 pt-5 w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 ease-in-out z-10">
                    <div className="bg-white rounded-md shadow-lg py-1">
                      <ProductFilterLink href="/products?category=tackle&subcategory=Bundles" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Tackle Bundles</ProductFilterLink>
                      <ProductFilterLink href="/products?category=bait&subcategory=Bulk%20Deals" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Bait Bundles</ProductFilterLink>
                    </div>
                  </div>
                </div>
                
                <div className="relative group">
                  <ProductFilterLink href="/products" className="text-white hover:text-blue-400 text-sm font-medium uppercase flex items-center">
                    Brands
                    <ChevronDown className="h-4 w-4 ml-1" />
                  </ProductFilterLink>
                  <div className="absolute right-0 mt-0 pt-5 w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 ease-in-out z-10">
                    <div className="bg-white rounded-md shadow-lg py-1">
                      <ProductFilterLink href="/products?brand=Rippa%20Tackle" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Rippa Tackle</ProductFilterLink>
                      <ProductFilterLink href="/products?brand=Nash%20Tackle" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Nash Tackle</ProductFilterLink>
                      <ProductFilterLink href="/products?brand=Nashbait" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Nashbait</ProductFilterLink>
                      <ProductFilterLink href="/products?brand=Flanx%20Tackle" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Flanx Tackle</ProductFilterLink>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Videos and About Us links - right aligned in the second row */}
            <div className="hidden md:flex items-center space-x-6">
              <Link href="/videos" className="text-white hover:text-blue-400 text-sm font-medium uppercase flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5 mr-1">
                  <path d="M4 8a1 1 0 0 1 1-1h1.5a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V8Zm6.25-3a.75.75 0 0 0-.75.75v12.5c0 .414.336.75.75.75h1.5a.75.75 0 0 0 .75-.75V5.75a.75.75 0 0 0-.75-.75h-1.5ZM16 8a1 1 0 0 1 1-1h1.5a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H17a1 1 0 0 1-1-1V8Z" />
                </svg>
                VIDEOS
              </Link>
              
              <Link href="/blogs" className="text-white hover:text-blue-400 text-sm font-medium uppercase flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5 mr-1">
                  <path d="M11.25 4.533A9.707 9.707 0 0 0 6 3a9.735 9.735 0 0 0-3.25.555.75.75 0 0 0-.5.707v14.25a.75.75 0 0 0 1 .707A8.237 8.237 0 0 1 6 18.75c1.995 0 3.823.707 5.25 1.886V4.533ZM12.75 20.636A8.214 8.214 0 0 1 18 18.75c.966 0 1.89.166 2.75.47a.75.75 0 0 0 1-.708V4.262a.75.75 0 0 0-.5-.707A9.735 9.735 0 0 0 18 3a9.707 9.707 0 0 0-5.25 1.533v16.103Z" />
                </svg>
                BLOGS
              </Link>
              
              <Link href="/about" className="text-white hover:text-blue-400 text-sm font-medium uppercase flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5 mr-1">
                  <path fillRule="evenodd" d="M8.25 6.75a3.75 3.75 0 1 1 7.5 0 3.75 3.75 0 0 1-7.5 0ZM15.75 9.75a3 3 0 1 1 6 0 3 3 0 0 1-6 0ZM2.25 9.75a3 3 0 1 1 6 0 3 3 0 0 1-6 0ZM6.31 15.117A6.745 6.745 0 0 1 12 12a6.745 6.745 0 0 1 6.709 7.498.75.75 0 0 1-.372.568A12.696 12.696 0 0 1 12 21.75c-2.305 0-4.47-.612-6.337-1.684a.75.75 0 0 1-.372-.568 6.787 6.787 0 0 1 1.019-4.38Z" clipRule="evenodd" />
                  <path d="M5.082 14.254a8.287 8.287 0 0 0-1.308 5.135 9.687 9.687 0 0 1-1.764-.44l-.115-.04a.563.563 0 0 1-.373-.487l-.01-.121a3.75 3.75 0 0 1 3.57-4.047ZM20.226 19.389a8.287 8.287 0 0 0-1.308-5.135 3.75 3.75 0 0 1 3.57 4.047l-.01.121a.563.563 0 0 1-.373.486l-.115.04c-.567.2-1.156.349-1.764.441Z" />
                </svg>
                ABOUT
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      {/* Website Sidebar */}
      <WebsiteSidebar isOpen={sideMenuOpen} onClose={() => setSideMenuOpen(false)} />
      
      {/* Overlay for search results on mobile */}
      {searchOpen && showSearchResults && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => {
            setSearchOpen(false);
            setShowSearchResults(false);
          }}
        ></div>
      )}
    </>
  );
};
