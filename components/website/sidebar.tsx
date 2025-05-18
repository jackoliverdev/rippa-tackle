"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { X, User, Heart, ShoppingBag, Menu, ChevronRight, Search, Loader2, ChevronDown, Video as VideoIcon, FileText, Users, Brain } from "lucide-react";
import { usePathname } from "next/navigation";
import { ProductCategory, Product } from "@/types/product";
import { getAllProducts, searchProducts } from "@/lib/products-service";
import Image from "next/image";
import { ProductFilterLink } from "@/components/website/products/ProductFilterLink";

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

type SidebarProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function WebsiteSidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname() || "";
  const [categories, setCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // Expanded category states
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  // Fetch product categories when the component mounts
  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoading(true);
      try {
        const products = await getAllProducts();
        // Extract unique categories
        const uniqueCategories = Array.from(
          new Set(products.map((product) => product.category))
        ).filter(Boolean) as string[];
        
        setCategories(uniqueCategories);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

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
      return;
    }
    
    setIsSearching(true);
    
    // Debounce search to avoid too many requests
    searchTimeoutRef.current = setTimeout(async () => {
      try {
        const results = await searchProducts(query);
        setSearchResults(results.slice(0, 5)); // Limit to 5 results
      } catch (error) {
        console.error("Error searching products:", error);
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

  // Toggle category expansion
  const toggleCategory = (categoryId: string) => {
    if (expandedCategory === categoryId) {
      setExpandedCategory(null);
    } else {
      setExpandedCategory(categoryId);
    }
  };

  // Toggle section expansion (account, content)
  const toggleSection = (sectionId: string) => {
    if (expandedSection === sectionId) {
      setExpandedSection(null);
    } else {
      setExpandedSection(sectionId);
    }
  };

  // Handle navigation and close sidebar
  const handleLinkClick = (e: React.MouseEvent, href: string) => {
    if (!href.startsWith('/products?') || pathname !== '/products') {
      window.location.href = href;
    }
    onClose();
  };

  return (
    <>
      {/* Full-screen overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[1000] md:hidden" 
          onClick={onClose}
        />
      )}
      
      {/* Sidebar panel */}
      <div 
        className={`
          fixed inset-y-0 left-0 z-[1001] w-[250px] bg-slate-900
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="flex items-center justify-between p-3 border-b border-slate-800">
          <div className="flex items-center">
            <Link href="/">
              <div className="flex items-center">
                <Image 
                  src="/rippa_logo.png" 
                  alt="Rippa Tackle"
                  width={32} 
                  height={32}
                  className="h-8 w-8 mr-2" 
                />
                <h2 className="text-base font-bold text-white">
                  RIPPA <span className="text-blue-400">TACKLE</span>
                </h2>
              </div>
            </Link>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        {/* Search Input */}
        <div className="p-2">
          <div className="relative">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full py-1.5 px-3 pl-8 bg-slate-800 border border-slate-700 text-white rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
              {isSearching ? (
                <Loader2 className="h-4 w-4 text-slate-400 animate-spin" />
              ) : (
                <Search className="h-4 w-4 text-slate-400" />
              )}
            </div>
            
            {searchQuery.length > 0 && (
              <button 
                onClick={() => {
                  setSearchQuery("");
                  setSearchResults([]);
                }} 
                className="absolute inset-y-0 right-0 pr-2 flex items-center text-slate-400 hover:text-white transition-colors"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
            
            {/* Search Results Dropdown */}
            {searchQuery.length > 1 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-slate-800 border border-slate-700 rounded-md shadow-lg z-10 max-h-80 overflow-y-auto">
                {searchResults.length > 0 ? (
                  <div className="py-1">
                    {searchResults.map((product) => (
                      <Link 
                        key={product.id} 
                        href={`/products/${product.slug}`}
                        className="flex items-start gap-2 p-2 hover:bg-slate-700 transition-colors"
                        onClick={onClose}
                      >
                        <div className="flex-shrink-0 w-10 h-10 bg-slate-700 rounded overflow-hidden">
                          {product.images && product.images[0] ? (
                            <Image
                              src={typeof product.images[0] === 'string' ? product.images[0] : product.images[0].url || ''}
                              alt={product.name}
                              width={40}
                              height={40}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-slate-600">
                              <ShoppingBag className="h-4 w-4 text-slate-400" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-white truncate">{product.name}</p>
                          <p className="text-xs text-blue-400 font-bold">
                            {formatPrice(product.price)}
                          </p>
                        </div>
                      </Link>
                    ))}
                    <div className="p-1 text-center border-t border-slate-700">
                      <Link
                        href={`/search?q=${encodeURIComponent(searchQuery)}`}
                        className="text-xs text-blue-400 hover:text-blue-300"
                        onClick={onClose}
                      >
                        View all results
                      </Link>
                    </div>
                  </div>
                ) : isSearching ? (
                  <div className="py-2 px-3 text-center text-slate-400 text-xs">
                    Searching...
                  </div>
                ) : (
                  <div className="py-2 px-3 text-center text-slate-400 text-xs">
                    No products found
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        
        <div className="overflow-y-auto h-[calc(100vh-200px)] pb-16">
          {/* Category links */}
          <div className="mt-2">
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-3 mb-1.5">Shop by category</h3>
            
            {/* Sale link */}
            <ProductFilterLink 
              href="/products?sale=true"
              className="flex items-center justify-between px-3 py-1.5 text-amber-500 hover:bg-slate-800 transition-colors"
              onClick={onClose}
            >
              <div className="flex items-center">
                <div className="w-7 h-7 bg-amber-600 text-white rounded-full flex items-center justify-center mr-2.5">
                  <span className="text-xs font-medium">%</span>
                </div>
                <span className="text-sm">Sale</span>
              </div>
              <ChevronRight className="h-3.5 w-3.5 text-slate-500" />
            </ProductFilterLink>

            {/* All link */}
            <ProductFilterLink 
              href="/products"
              className="flex items-center justify-between px-3 py-1.5 text-slate-300 hover:bg-slate-800 transition-colors"
              onClick={onClose}
            >
              <div className="flex items-center">
                <div className="w-7 h-7 bg-blue-600 text-white rounded-full flex items-center justify-center mr-2.5">
                  <span className="text-xs font-medium">A</span>
                </div>
                <span className="text-sm">All</span>
              </div>
              <ChevronRight className="h-3.5 w-3.5 text-slate-500" />
            </ProductFilterLink>

            {/* Tackle dropdown */}
            <div>
              <div
                className="flex items-center justify-between px-3 py-1.5 text-slate-300 hover:bg-slate-800 transition-colors cursor-pointer"
                onClick={() => toggleCategory('tackle')}
              >
                <div className="flex items-center">
                  <div className="w-7 h-7 bg-purple-600 text-white rounded-full flex items-center justify-center mr-2.5">
                    <span className="text-xs font-medium">T</span>
                  </div>
                  <span className="text-sm">Tackle</span>
                </div>
                {expandedCategory === 'tackle' ? (
                  <ChevronDown className="h-3.5 w-3.5 text-slate-500" />
                ) : (
                  <ChevronRight className="h-3.5 w-3.5 text-slate-500" />
                )}
              </div>
              
              {expandedCategory === 'tackle' && (
                <div className="ml-10 pl-2 border-l border-slate-700">
                  <ProductFilterLink 
                    href="/products?category=tackle&subcategory=Rods" 
                    className="block py-1.5 text-xs text-slate-400 hover:text-white"
                    onClick={onClose}
                  >
                    Rods
                  </ProductFilterLink>
                  <ProductFilterLink 
                    href="/products?category=tackle&subcategory=Reels" 
                    className="block py-1.5 text-xs text-slate-400 hover:text-white"
                    onClick={onClose}
                  >
                    Reels
                  </ProductFilterLink>
                  <ProductFilterLink 
                    href="/products?category=tackle&subcategory=Terminal%20Tackle" 
                    className="block py-1.5 text-xs text-slate-400 hover:text-white"
                    onClick={onClose}
                  >
                    Terminal Tackle
                  </ProductFilterLink>
                  <ProductFilterLink 
                    href="/products?category=tackle&subcategory=Hooks" 
                    className="block py-1.5 text-xs text-slate-400 hover:text-white"
                    onClick={onClose}
                  >
                    Hooks
                  </ProductFilterLink>
                  <ProductFilterLink 
                    href="/products?category=tackle&subcategory=Bivvies" 
                    className="block py-1.5 text-xs text-slate-400 hover:text-white"
                    onClick={onClose}
                  >
                    Bivvies
                  </ProductFilterLink>
                  <ProductFilterLink 
                    href="/products?category=tackle&subcategory=Bedchairs" 
                    className="block py-1.5 text-xs text-slate-400 hover:text-white"
                    onClick={onClose}
                  >
                    Bedchairs
                  </ProductFilterLink>
                  <ProductFilterLink 
                    href="/products?category=tackle&subcategory=Chairs" 
                    className="block py-1.5 text-xs text-slate-400 hover:text-white"
                    onClick={onClose}
                  >
                    Chairs
                  </ProductFilterLink>
                  <ProductFilterLink 
                    href="/products?category=tackle&subcategory=Alarms" 
                    className="block py-1.5 text-xs text-slate-400 hover:text-white"
                    onClick={onClose}
                  >
                    Alarms
                  </ProductFilterLink>
                  <ProductFilterLink 
                    href="/products?category=tackle&subcategory=Rigs" 
                    className="block py-1.5 text-xs text-slate-400 hover:text-white"
                    onClick={onClose}
                  >
                    Rigs
                  </ProductFilterLink>
                  <ProductFilterLink 
                    href="/products?category=tackle&subcategory=PVA" 
                    className="block py-1.5 text-xs text-slate-400 hover:text-white"
                    onClick={onClose}
                  >
                    PVA
                  </ProductFilterLink>
                  <ProductFilterLink 
                    href="/products?category=tackle" 
                    className="block py-1.5 text-xs text-blue-400 hover:text-blue-300 font-medium"
                    onClick={onClose}
                  >
                    All Tackle
                  </ProductFilterLink>
                </div>
              )}
            </div>

            {/* Bait dropdown */}
            <div>
              <div
                className="flex items-center justify-between px-3 py-1.5 text-slate-300 hover:bg-slate-800 transition-colors cursor-pointer"
                onClick={() => toggleCategory('bait')}
              >
                <div className="flex items-center">
                  <div className="w-7 h-7 bg-red-600 text-white rounded-full flex items-center justify-center mr-2.5">
                    <span className="text-xs font-medium">B</span>
                  </div>
                  <span className="text-sm">Bait</span>
                </div>
                {expandedCategory === 'bait' ? (
                  <ChevronDown className="h-3.5 w-3.5 text-slate-500" />
                ) : (
                  <ChevronRight className="h-3.5 w-3.5 text-slate-500" />
                )}
              </div>
              
              {expandedCategory === 'bait' && (
                <div className="ml-10 pl-2 border-l border-slate-700">
                  <ProductFilterLink 
                    href="/products?category=bait&subcategory=Boilies" 
                    className="block py-1.5 text-xs text-slate-400 hover:text-white"
                    onClick={onClose}
                  >
                    Boilies
                  </ProductFilterLink>
                  <ProductFilterLink 
                    href="/products?category=bait&subcategory=Hook%20Baits" 
                    className="block py-1.5 text-xs text-slate-400 hover:text-white"
                    onClick={onClose}
                  >
                    Hook Baits
                  </ProductFilterLink>
                  <ProductFilterLink 
                    href="/products?category=bait&subcategory=Liquid%20Attractors" 
                    className="block py-1.5 text-xs text-slate-400 hover:text-white"
                    onClick={onClose}
                  >
                    Liquid Attractors
                  </ProductFilterLink>
                  <ProductFilterLink 
                    href="/products?category=bait&subcategory=Stick%20Mix" 
                    className="block py-1.5 text-xs text-slate-400 hover:text-white"
                    onClick={onClose}
                  >
                    Stick Mix
                  </ProductFilterLink>
                  <ProductFilterLink 
                    href="/products?category=bait&subcategory=Groundbait" 
                    className="block py-1.5 text-xs text-slate-400 hover:text-white"
                    onClick={onClose}
                  >
                    Groundbait
                  </ProductFilterLink>
                  <ProductFilterLink 
                    href="/products?category=bait&subcategory=Particles" 
                    className="block py-1.5 text-xs text-slate-400 hover:text-white"
                    onClick={onClose}
                  >
                    Particles
                  </ProductFilterLink>
                  <ProductFilterLink 
                    href="/products?category=bait&subcategory=Mixes" 
                    className="block py-1.5 text-xs text-slate-400 hover:text-white"
                    onClick={onClose}
                  >
                    Mixes
                  </ProductFilterLink>
                  <ProductFilterLink 
                    href="/products?category=bait&subcategory=Bulk%20Deals" 
                    className="block py-1.5 text-xs text-slate-400 hover:text-white"
                    onClick={onClose}
                  >
                    Bulk Deals
                  </ProductFilterLink>
                  <ProductFilterLink 
                    href="/products?category=bait" 
                    className="block py-1.5 text-xs text-blue-400 hover:text-blue-300 font-medium"
                    onClick={onClose}
                  >
                    All Bait
                  </ProductFilterLink>
                </div>
              )}
            </div>

            {/* Clothing dropdown */}
            <div>
              <div
                className="flex items-center justify-between px-3 py-1.5 text-slate-300 hover:bg-slate-800 transition-colors cursor-pointer"
                onClick={() => toggleCategory('clothing')}
              >
                <div className="flex items-center">
                  <div className="w-7 h-7 bg-indigo-600 text-white rounded-full flex items-center justify-center mr-2.5">
                    <span className="text-xs font-medium">C</span>
                  </div>
                  <span className="text-sm">Clothing</span>
                </div>
                {expandedCategory === 'clothing' ? (
                  <ChevronDown className="h-3.5 w-3.5 text-slate-500" />
                ) : (
                  <ChevronRight className="h-3.5 w-3.5 text-slate-500" />
                )}
              </div>
              
              {expandedCategory === 'clothing' && (
                <div className="ml-10 pl-2 border-l border-slate-700">
                  <ProductFilterLink 
                    href="/products?category=clothing&subcategory=Apparel" 
                    className="block py-1.5 text-xs text-slate-400 hover:text-white"
                    onClick={onClose}
                  >
                    Apparel
                  </ProductFilterLink>
                  <ProductFilterLink 
                    href="/products?category=clothing&subcategory=Headwear" 
                    className="block py-1.5 text-xs text-slate-400 hover:text-white"
                    onClick={onClose}
                  >
                    Headwear
                  </ProductFilterLink>
                  <ProductFilterLink 
                    href="/products?category=clothing&subcategory=Youth%20Apparel" 
                    className="block py-1.5 text-xs text-slate-400 hover:text-white"
                    onClick={onClose}
                  >
                    Youth Apparel
                  </ProductFilterLink>
                  <ProductFilterLink 
                    href="/products?category=clothing" 
                    className="block py-1.5 text-xs text-blue-400 hover:text-blue-300 font-medium"
                    onClick={onClose}
                  >
                    All Clothing
                  </ProductFilterLink>
                </div>
              )}
            </div>

            {/* Accessories link */}
            <ProductFilterLink 
              href="/products?category=accessories"
              className="flex items-center justify-between px-3 py-1.5 text-slate-300 hover:bg-slate-800 transition-colors"
              onClick={onClose}
            >
              <div className="flex items-center">
                <div className="w-7 h-7 bg-green-600 text-white rounded-full flex items-center justify-center mr-2.5">
                  <span className="text-xs font-medium">A</span>
                </div>
                <span className="text-sm">Accessories</span>
              </div>
              <ChevronRight className="h-3.5 w-3.5 text-slate-500" />
            </ProductFilterLink>

            {/* Bundles dropdown */}
            <div>
              <div
                className="flex items-center justify-between px-3 py-1.5 text-slate-300 hover:bg-slate-800 transition-colors cursor-pointer"
                onClick={() => toggleCategory('bundles')}
              >
                <div className="flex items-center">
                  <div className="w-7 h-7 bg-yellow-600 text-white rounded-full flex items-center justify-center mr-2.5">
                    <span className="text-xs font-medium">B</span>
                  </div>
                  <span className="text-sm">Bundles</span>
                </div>
                {expandedCategory === 'bundles' ? (
                  <ChevronDown className="h-3.5 w-3.5 text-slate-500" />
                ) : (
                  <ChevronRight className="h-3.5 w-3.5 text-slate-500" />
                )}
              </div>
              
              {expandedCategory === 'bundles' && (
                <div className="ml-10 pl-2 border-l border-slate-700">
                  <ProductFilterLink 
                    href="/products?category=tackle&subcategory=Bundles" 
                    className="block py-1.5 text-xs text-slate-400 hover:text-white"
                    onClick={onClose}
                  >
                    Tackle Bundles
                  </ProductFilterLink>
                  <ProductFilterLink 
                    href="/products?category=bait&subcategory=Bulk%20Deals" 
                    className="block py-1.5 text-xs text-slate-400 hover:text-white"
                    onClick={onClose}
                  >
                    Bait Bundles
                  </ProductFilterLink>
                </div>
              )}
            </div>

            {/* Brands dropdown */}
            <div>
              <div
                className="flex items-center justify-between px-3 py-1.5 text-slate-300 hover:bg-slate-800 transition-colors cursor-pointer"
                onClick={() => toggleCategory('brands')}
              >
                <div className="flex items-center">
                  <div className="w-7 h-7 bg-blue-600 text-white rounded-full flex items-center justify-center mr-2.5">
                    <span className="text-xs font-medium">B</span>
                  </div>
                  <span className="text-sm">Brands</span>
                </div>
                {expandedCategory === 'brands' ? (
                  <ChevronDown className="h-3.5 w-3.5 text-slate-500" />
                ) : (
                  <ChevronRight className="h-3.5 w-3.5 text-slate-500" />
                )}
              </div>
              
              {expandedCategory === 'brands' && (
                <div className="ml-10 pl-2 border-l border-slate-700">
                  <ProductFilterLink 
                    href="/products?brand=Rippa%20Tackle" 
                    className="block py-1.5 text-xs text-slate-400 hover:text-white"
                    onClick={onClose}
                  >
                    Rippa Tackle
                  </ProductFilterLink>
                  <ProductFilterLink 
                    href="/products?brand=Nash%20Tackle" 
                    className="block py-1.5 text-xs text-slate-400 hover:text-white"
                    onClick={onClose}
                  >
                    Nash Tackle
                  </ProductFilterLink>
                  <ProductFilterLink 
                    href="/products?brand=Nashbait" 
                    className="block py-1.5 text-xs text-slate-400 hover:text-white"
                    onClick={onClose}
                  >
                    Nashbait
                  </ProductFilterLink>
                  <ProductFilterLink 
                    href="/products?brand=Flanx%20Tackle" 
                    className="block py-1.5 text-xs text-slate-400 hover:text-white"
                    onClick={onClose}
                  >
                    Flanx Tackle
                  </ProductFilterLink>
                </div>
              )}
            </div>
          </div>
          
          {/* Account section - now collapsible */}
          <div className="mt-3 pt-2 border-t border-slate-800">
            <div 
              className="flex items-center justify-between px-3 py-1.5 text-slate-300 hover:bg-slate-800 transition-colors cursor-pointer"
              onClick={() => toggleSection('account')}
            >
              <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Your account</h3>
              {expandedSection === 'account' ? (
                <ChevronDown className="h-3.5 w-3.5 text-slate-500" />
              ) : (
                <ChevronRight className="h-3.5 w-3.5 text-slate-500" />
              )}
            </div>
            
            {expandedSection === 'account' && (
              <div className="mt-1">
                <Link 
                  href="/login" 
                  className="flex items-center px-3 py-1.5 text-slate-300 hover:bg-slate-800 transition-colors"
                  onClick={onClose}
                >
                  <User className="h-4 w-4 mr-3 text-slate-400" />
                  <span className="text-sm">My Account</span>
                </Link>
                <Link 
                  href="/wishlist" 
                  className="flex items-center px-3 py-1.5 text-slate-300 hover:bg-slate-800 transition-colors"
                  onClick={onClose}
                >
                  <Heart className="h-4 w-4 mr-3 text-slate-400" />
                  <span className="text-sm">Wishlist</span>
                </Link>
                <Link 
                  href="/cart" 
                  className="flex items-center px-3 py-1.5 text-slate-300 hover:bg-slate-800 transition-colors"
                  onClick={onClose}
                >
                  <ShoppingBag className="h-4 w-4 mr-3 text-slate-400" />
                  <span className="text-sm">Shopping Bag</span>
                </Link>
              </div>
            )}
          </div>
          
          {/* Content section: Videos, Blogs, About - now collapsible */}
          <div className="mt-3 pt-2 border-t border-slate-800">
            <div 
              className="flex items-center justify-between px-3 py-1.5 text-slate-300 hover:bg-slate-800 transition-colors cursor-pointer"
              onClick={() => toggleSection('content')}
            >
              <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Content</h3>
              {expandedSection === 'content' ? (
                <ChevronDown className="h-3.5 w-3.5 text-slate-500" />
              ) : (
                <ChevronRight className="h-3.5 w-3.5 text-slate-500" />
              )}
            </div>
            
            {expandedSection === 'content' && (
              <div className="mt-1">
                <Link 
                  href="/videos" 
                  className="flex items-center px-3 py-1.5 text-slate-300 hover:bg-slate-800 transition-colors"
                  onClick={onClose}
                >
                  <VideoIcon className="h-4 w-4 mr-3 text-slate-400" />
                  <span className="text-sm">Videos</span>
                </Link>
                <Link 
                  href="/blogs" 
                  className="flex items-center px-3 py-1.5 text-slate-300 hover:bg-slate-800 transition-colors"
                  onClick={onClose}
                >
                  <FileText className="h-4 w-4 mr-3 text-slate-400" />
                  <span className="text-sm">Blogs</span>
                </Link>
                <Link 
                  href="/about" 
                  className="flex items-center px-3 py-1.5 text-slate-300 hover:bg-slate-800 transition-colors"
                  onClick={onClose}
                >
                  <Users className="h-4 w-4 mr-3 text-slate-400" />
                  <span className="text-sm">About</span>
                </Link>
              </div>
            )}
          </div>
        </div>
        
        {/* AI Fishing Assistant - Better button at bottom */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-slate-900 border-t border-slate-800">
          <Link
            href="/fishing-assistant"
            className="flex items-center justify-center py-3 px-4 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-medium rounded-md shadow-md transition-all"
            onClick={onClose}
          >
            <Brain className="h-5 w-5 mr-2" />
            <span>AI Fishing Assistant</span>
          </Link>
        </div>
      </div>
    </>
  );
} 