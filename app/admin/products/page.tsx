"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Package, Plus, Search, FilterX } from 'lucide-react';
import PageTitle from '@/components/admin/page-title';
import ProductList from '@/components/admin/products/product-list';
import { getAllProducts, deleteProduct } from '@/lib/products-service';
import { Product, ProductCategory } from '@/types/product';

// Product categories for filter
const PRODUCT_CATEGORIES = [
  { value: 'all', label: 'All Categories' },
  { value: 'tackle', label: 'Tackle' },
  { value: 'bait', label: 'Bait' },
  { value: 'rigs', label: 'Rigs' },
  { value: 'accessories', label: 'Accessories' },
  { value: 'clothing', label: 'Clothing' },
  { value: 'bundles', label: 'Bundles' },
  { value: 'mystery-boxes', label: 'Mystery Boxes' },
];

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [showActiveOnly, setShowActiveOnly] = useState(false);
  
  // Load products on initial render
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getAllProducts();
        setProducts(data);
        setFilteredProducts(data);
      } catch (err) {
        setError('Failed to load products. Please try again.');
        console.error('Error loading products:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProducts();
  }, []);
  
  // Apply filters whenever filter state changes
  useEffect(() => {
    let result = [...products];
    
    // Apply category filter
    if (categoryFilter !== 'all') {
      result = result.filter(product => product.category === categoryFilter);
    }
    
    // Apply active filter
    if (showActiveOnly) {
      result = result.filter(product => product.isActive);
    }
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(product => 
        product.name.toLowerCase().includes(query) || 
        product.description?.toLowerCase().includes(query) ||
        product.sku?.toLowerCase().includes(query)
      );
    }
    
    setFilteredProducts(result);
  }, [products, categoryFilter, showActiveOnly, searchQuery]);
  
  // Handle product deletion
  const handleDeleteProduct = async (productId: string) => {
    try {
      const success = await deleteProduct(productId);
      
      if (success) {
        setProducts(products.filter(product => product.id !== productId));
        // No need to setFilteredProducts as the useEffect will handle that
      } else {
        throw new Error('Failed to delete product');
      }
    } catch (err) {
      console.error('Error deleting product:', err);
      // You might want to show a toast notification here
    }
  };
  
  // Reset all filters
  const resetFilters = () => {
    setSearchQuery('');
    setCategoryFilter('all');
    setShowActiveOnly(false);
  };
  
  // Count for filters showing
  const isFiltering = categoryFilter !== 'all' || showActiveOnly || searchQuery;
  
  return (
    <div>
      <PageTitle 
        title="Products" 
        description={`${products.length} products in your shop`}
        icon={<Package className="w-5 h-5" />}
        actions={
          <Link
            href="/admin/products/create"
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg shadow-sm hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Add Product
          </Link>
        }
      />
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div className="flex flex-wrap md:flex-nowrap gap-4">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            >
              {PRODUCT_CATEGORIES.map((category) => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
            
            <label className="flex items-center px-4 py-2 border border-gray-300 rounded-lg cursor-pointer">
              <input
                type="checkbox"
                checked={showActiveOnly}
                onChange={(e) => setShowActiveOnly(e.target.checked)}
                className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500 mr-2"
              />
              <span className="text-sm">Active only</span>
            </label>
            
            {isFiltering && (
              <button
                onClick={resetFilters}
                className="flex items-center gap-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
              >
                <FilterX className="h-4 w-4" />
                <span>Reset</span>
              </button>
            )}
          </div>
        </div>
      </div>
      
      {loading ? (
        <div className="py-8 flex justify-center">
          <div className="animate-pulse text-gray-500">Loading products...</div>
        </div>
      ) : error ? (
        <div className="bg-red-50 text-red-800 p-6 rounded-xl text-center">
          <p>{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-red-100 text-red-800 rounded-lg hover:bg-red-200"
          >
            Try Again
          </button>
        </div>
      ) : (
        <>
          {isFiltering && (
            <div className="mb-4 text-sm text-gray-500">
              Showing {filteredProducts.length} of {products.length} products
              {categoryFilter !== 'all' && ` in ${categoryFilter}`}
              {showActiveOnly && ', active only'}
              {searchQuery && `, matching "${searchQuery}"`}
            </div>
          )}
          
          <ProductList 
            products={filteredProducts} 
            onDelete={handleDeleteProduct} 
          />
        </>
      )}
    </div>
  );
} 