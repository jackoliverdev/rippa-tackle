'use client';

import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, X, ChevronRight } from 'lucide-react';
import { ProductCategory } from '@/types/product';

interface FilterState {
  category: ProductCategory | 'all';
  subcategory: string | null;
  brand: string | null;
  priceRange: 'all' | 'under-50' | '50-100' | '100-250' | 'over-250';
  onSale: boolean;
}

interface MobileFilterSheetProps {
  isOpen: boolean;
  onClose: () => void;
  filters: FilterState;
  onFilterChange: (newFilters: Partial<FilterState>) => void;
  onClearFilters: () => void;
  subcategories: {[key in ProductCategory]?: string[]};
  brands: string[];
  productCounts?: {
    categories: {[key: string]: number};
    subcategories: {[key: string]: number};
    brands: {[key: string]: number};
  };
}

const MobileFilterSheet: React.FC<MobileFilterSheetProps> = ({
  isOpen,
  onClose,
  filters,
  onFilterChange,
  onClearFilters,
  subcategories,
  brands,
  productCounts = {
    categories: {
      tackle: 80,
      clothing: 24,
      bait: 12,
      accessories: 1
    },
    subcategories: {},
    brands: {}
  }
}) => {
  // Track which sections are expanded
  const [expandedSections, setExpandedSections] = useState({
    categories: true,
    subcategories: true,
    priceRange: false,
    brands: false
  });

  // Track whether a subcategory is available for the selected category
  const [hasSubcategories, setHasSubcategories] = useState(false);
  
  // Update subcategories availability when filters change
  useEffect(() => {
    if (filters.category !== 'all' && subcategories[filters.category as ProductCategory]?.length) {
      setHasSubcategories(true);
    } else {
      setHasSubcategories(false);
    }
  }, [filters.category, subcategories]);

  // Toggle section expansion
  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Handle category change
  const handleCategoryChange = (category: ProductCategory | 'all') => {
    onFilterChange({
      category,
      subcategory: null // Reset subcategory when changing category
    });
  };

  // Handle subcategory change
  const handleSubcategoryChange = (subcategory: string | null) => {
    onFilterChange({ subcategory });
  };

  // Handle brand change
  const handleBrandChange = (brand: string | null) => {
    onFilterChange({ brand });
  };

  // Handle price range change
  const handlePriceRangeChange = (range: FilterState['priceRange']) => {
    onFilterChange({ priceRange: range });
  };

  // Handle sale toggle
  const handleSaleToggle = () => {
    onFilterChange({ onSale: !filters.onSale });
  };

  // Count selected filters
  const countSelectedFilters = (): number => {
    let count = 0;
    if (filters.category !== 'all') count++;
    if (filters.subcategory) count++;
    if (filters.brand) count++;
    if (filters.priceRange !== 'all') count++;
    if (filters.onSale) count++;
    return count;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/30 backdrop-blur-sm">
      <div className="fixed inset-x-0 bottom-0 z-50 bg-white rounded-t-xl max-h-[85vh] overflow-hidden flex flex-col animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <h2 className="text-lg font-bold">Filters</h2>
          <div className="flex space-x-4">
            <button
              onClick={onClearFilters}
              className="text-blue-600 text-sm font-medium"
            >
              Clear all
            </button>
            <button onClick={onClose} className="text-slate-500">
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Filter content */}
        <div className="flex-1 overflow-y-auto divide-y divide-gray-100">
          {/* Categories */}
          <div>
            <div 
              className="px-4 py-3 flex justify-between items-center cursor-pointer"
              onClick={() => toggleSection('categories')}
            >
              <h3 className="font-semibold">Categories</h3>
              {expandedSections.categories ? <ChevronDown className="h-5 w-5" /> : <ChevronUp className="h-5 w-5" />}
            </div>
            
            {expandedSections.categories && (
              <div className="px-4 pb-4">
                <div className="space-y-3">
                  <label className="flex items-center">
                    <input 
                      type="radio" 
                      name="category" 
                      className="h-5 w-5 text-blue-600 border-gray-300 rounded-full"
                      checked={filters.category === 'all'}
                      onChange={() => handleCategoryChange('all')}
                    />
                    <span className="ml-3 text-sm">All Categories</span>
                  </label>
                  
                  <label className="flex items-center">
                    <input 
                      type="radio" 
                      name="category" 
                      className="h-5 w-5 text-blue-600 border-gray-300 rounded-full"
                      checked={filters.category === 'tackle'}
                      onChange={() => handleCategoryChange('tackle')}
                    />
                    <span className="ml-3 text-sm">Tackle ({productCounts.categories.tackle || 0})</span>
                  </label>
                  
                  <label className="flex items-center">
                    <input 
                      type="radio" 
                      name="category" 
                      className="h-5 w-5 text-blue-600 border-gray-300 rounded-full"
                      checked={filters.category === 'clothing'}
                      onChange={() => handleCategoryChange('clothing')}
                    />
                    <span className="ml-3 text-sm">Clothing ({productCounts.categories.clothing || 0})</span>
                  </label>
                  
                  <label className="flex items-center">
                    <input 
                      type="radio" 
                      name="category" 
                      className="h-5 w-5 text-blue-600 border-gray-300 rounded-full"
                      checked={filters.category === 'bait'}
                      onChange={() => handleCategoryChange('bait')}
                    />
                    <span className="ml-3 text-sm">Bait ({productCounts.categories.bait || 0})</span>
                  </label>
                  
                  <label className="flex items-center">
                    <input 
                      type="radio" 
                      name="category" 
                      className="h-5 w-5 text-blue-600 border-gray-300 rounded-full"
                      checked={filters.category === 'accessories'}
                      onChange={() => handleCategoryChange('accessories')}
                    />
                    <span className="ml-3 text-sm">Accessories ({productCounts.categories.accessories || 0})</span>
                  </label>
                </div>
              </div>
            )}
          </div>
          
          {/* Subcategories */}
          {hasSubcategories && (
            <div>
              <div 
                className="px-4 py-3 flex justify-between items-center cursor-pointer"
                onClick={() => toggleSection('subcategories')}
              >
                <h3 className="font-semibold">Subcategories</h3>
                {expandedSections.subcategories ? <ChevronDown className="h-5 w-5" /> : <ChevronUp className="h-5 w-5" />}
              </div>
              
              {expandedSections.subcategories && filters.category !== 'all' && (
                <div className="px-4 pb-4">
                  <div className="space-y-3">
                    <div className="mb-2">
                      <button 
                        onClick={() => handleSubcategoryChange(null)} 
                        className="text-blue-600 text-sm font-medium flex items-center"
                      >
                        Clear selection
                      </button>
                    </div>
                    
                    {subcategories[filters.category as ProductCategory]?.map(subcategory => (
                      <label key={subcategory} className="flex items-center">
                        <input 
                          type="radio" 
                          name="subcategory" 
                          className="h-5 w-5 text-blue-600 border-gray-300 rounded-full"
                          checked={filters.subcategory === subcategory}
                          onChange={() => handleSubcategoryChange(subcategory)}
                        />
                        <span className="ml-3 text-sm">{subcategory}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
          
          {/* Price Range */}
          <div>
            <div 
              className="px-4 py-3 flex justify-between items-center cursor-pointer"
              onClick={() => toggleSection('priceRange')}
            >
              <h3 className="font-semibold">Price Range</h3>
              {expandedSections.priceRange ? <ChevronDown className="h-5 w-5" /> : <ChevronUp className="h-5 w-5" />}
            </div>
            
            {expandedSections.priceRange && (
              <div className="px-4 pb-4">
                <div className="space-y-3">
                  <label className="flex items-center">
                    <input 
                      type="radio" 
                      name="priceRange" 
                      className="h-5 w-5 text-blue-600 border-gray-300 rounded-full"
                      checked={filters.priceRange === 'all'}
                      onChange={() => handlePriceRangeChange('all')}
                    />
                    <span className="ml-3 text-sm">All Prices</span>
                  </label>
                  
                  <label className="flex items-center">
                    <input 
                      type="radio" 
                      name="priceRange" 
                      className="h-5 w-5 text-blue-600 border-gray-300 rounded-full"
                      checked={filters.priceRange === 'under-50'}
                      onChange={() => handlePriceRangeChange('under-50')}
                    />
                    <span className="ml-3 text-sm">Under £50</span>
                  </label>
                  
                  <label className="flex items-center">
                    <input 
                      type="radio" 
                      name="priceRange" 
                      className="h-5 w-5 text-blue-600 border-gray-300 rounded-full"
                      checked={filters.priceRange === '50-100'}
                      onChange={() => handlePriceRangeChange('50-100')}
                    />
                    <span className="ml-3 text-sm">£50 - £100</span>
                  </label>
                  
                  <label className="flex items-center">
                    <input 
                      type="radio" 
                      name="priceRange" 
                      className="h-5 w-5 text-blue-600 border-gray-300 rounded-full"
                      checked={filters.priceRange === '100-250'}
                      onChange={() => handlePriceRangeChange('100-250')}
                    />
                    <span className="ml-3 text-sm">£100 - £250</span>
                  </label>
                  
                  <label className="flex items-center">
                    <input 
                      type="radio" 
                      name="priceRange" 
                      className="h-5 w-5 text-blue-600 border-gray-300 rounded-full"
                      checked={filters.priceRange === 'over-250'}
                      onChange={() => handlePriceRangeChange('over-250')}
                    />
                    <span className="ml-3 text-sm">Over £250</span>
                  </label>
                </div>
              </div>
            )}
          </div>
          
          {/* Brands */}
          <div>
            <div 
              className="px-4 py-3 flex justify-between items-center cursor-pointer"
              onClick={() => toggleSection('brands')}
            >
              <h3 className="font-semibold">Brands</h3>
              {expandedSections.brands ? <ChevronDown className="h-5 w-5" /> : <ChevronUp className="h-5 w-5" />}
            </div>
            
            {expandedSections.brands && (
              <div className="px-4 pb-4">
                <div className="space-y-3">
                  <div className="mb-2">
                    <button 
                      onClick={() => handleBrandChange(null)} 
                      className="text-blue-600 text-sm font-medium flex items-center"
                    >
                      Clear selection
                    </button>
                  </div>
                  
                  {brands.map(brand => (
                    <label key={brand} className="flex items-center">
                      <input 
                        type="radio" 
                        name="brand" 
                        className="h-5 w-5 text-blue-600 border-gray-300 rounded-full"
                        checked={filters.brand === brand}
                        onChange={() => handleBrandChange(brand)}
                      />
                      <span className="ml-3 text-sm">{brand}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {/* On Sale */}
          <div className="px-4 py-3">
            <label className="flex items-center">
              <input 
                type="checkbox" 
                className="h-5 w-5 text-blue-600 border-gray-300 rounded"
                checked={filters.onSale}
                onChange={handleSaleToggle}
              />
              <span className="ml-3 text-sm font-medium">On Sale <span className="text-red-500 text-xs rounded-full bg-red-50 px-2 py-0.5 ml-1">20</span></span>
            </label>
          </div>
        </div>
        
        {/* Apply filters button */}
        <div className="border-t border-gray-200 p-4">
          <button
            onClick={onClose}
            className="w-full bg-blue-600 text-white font-medium py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Apply Filters {countSelectedFilters() > 0 && `(${countSelectedFilters()})`}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MobileFilterSheet; 