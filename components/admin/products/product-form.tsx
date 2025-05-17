"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Product, ProductCategory, ProductTag } from '@/types/product';
import { createProduct, updateProduct, uploadProductImage } from '@/lib/products-service';
import { slugify } from '@/lib/utils';
import { Loader2, Upload, X, Plus, Trash2, Edit, FileText } from 'lucide-react';
import Image from 'next/image';
import TextEditModal from '@/components/admin/TextEditModal';

// Define product categories for select dropdown
const PRODUCT_CATEGORIES: { value: ProductCategory; label: string }[] = [
  { value: 'tackle', label: 'Tackle' },
  { value: 'bait', label: 'Bait' },
  { value: 'rigs', label: 'Rigs' },
  { value: 'accessories', label: 'Accessories' },
  { value: 'clothing', label: 'Clothing' },
  { value: 'bundles', label: 'Bundles' },
  { value: 'mystery-boxes', label: 'Mystery Boxes' },
];

// Define common product tags for selection
const COMMON_TAGS: ProductTag[] = [
  'featured',
  'best-seller',
  'new',
  'sale',
  'limited',
  'exclusive',
];

interface ProductFormProps {
  product?: Product;
  isEdit?: boolean;
}

export default function ProductForm({ product, isEdit = false }: ProductFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    slug: '',
    description: '',
    shortDescription: '',
    price: 0,
    compareAtPrice: undefined,
    sku: '',
    category: 'tackle' as ProductCategory,
    tags: [],
    inventory: 0,
    isActive: true,
    sale: false,
    images: [],
  });

  // For custom tag input
  const [customTag, setCustomTag] = useState('');
  
  // For image uploads
  const [uploadingImages, setUploadingImages] = useState(false);
  
  // For text editor modal
  const [isTextEditorOpen, setIsTextEditorOpen] = useState(false);

  // Initialize form with product data if editing
  useEffect(() => {
    if (product && isEdit) {
      setFormData({
        ...product,
      });
    }
  }, [product, isEdit]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'price' || name === 'compareAtPrice') {
      // Handle price inputs to ensure they're valid numbers
      const numericValue = value === '' ? '' : parseFloat(value);
      setFormData({ ...formData, [name]: numericValue });
    } else if (name === 'inventory') {
      // Ensure inventory is a number
      const inventoryValue = value === '' ? 0 : parseInt(value, 10);
      setFormData({ ...formData, [name]: inventoryValue });
    } else {
      setFormData({ ...formData, [name]: value });
      
      // Auto-generate slug from name if name is being changed and slug isn't manually set
      if (name === 'name' && (!formData.slug || formData.slug === '')) {
        setFormData({ 
          ...formData, 
          [name]: value,
          slug: slugify(value)
        });
      }
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData({ ...formData, [name]: checked });
  };

  const handleTagToggle = (tag: ProductTag) => {
    const currentTags = formData.tags || [];
    const newTags = currentTags.includes(tag)
      ? currentTags.filter(t => t !== tag)
      : [...currentTags, tag];
    
    setFormData({ ...formData, tags: newTags });
  };

  const handleAddCustomTag = (e: React.FormEvent) => {
    e.preventDefault();
    if (customTag.trim() === '') return;
    
    const currentTags = formData.tags || [];
    if (!currentTags.includes(customTag as ProductTag)) {
      setFormData({ ...formData, tags: [...currentTags, customTag as ProductTag] });
      setCustomTag('');
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    setUploadingImages(true);
    setError(null);
    
    try {
      const newImages = [...(formData.images || [])];
      
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        // Prepare form data for upload
        const uploadFormData = new FormData();
        uploadFormData.append('file', file);
        if (isEdit && product?.id) {
          uploadFormData.append('productId', product.id);
        }
        
        // Handle both client and server-side environments
        const baseUrl = typeof window !== 'undefined' 
          ? window.location.origin 
          : process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
        
        const uploadUrl = new URL('/api/admin/products/upload-image', baseUrl);
        
        console.log(`Uploading image to URL: ${uploadUrl.toString()}`);
        
        // Use fetch directly with the full URL
        const response = await fetch(uploadUrl.toString(), {
          method: 'POST',
          body: uploadFormData,
        });
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error('Error response:', response.status, response.statusText, errorText);
          throw new Error(`API error: ${response.status} ${response.statusText}`);
        }
        
        const result = await response.json();
        
        if (result && result.url) {
          newImages.push({
            id: result.id,
            url: result.url,
            alt: formData.name || 'Product image',
            isPrimary: newImages.length === 0, // First image is primary by default
          });
        }
      }
      
      setFormData({ ...formData, images: newImages });
    } catch (err) {
      setError('Failed to upload images. Please try again.');
      console.error('Image upload error:', err);
    } finally {
      setUploadingImages(false);
      // Clear the input value so the same file can be uploaded again if needed
      e.target.value = '';
    }
  };

  const handleRemoveImage = (indexToRemove: number) => {
    const newImages = formData.images?.filter((_, index) => index !== indexToRemove) || [];
    
    // If we removed the primary image, make the first image primary
    if (formData.images && formData.images[indexToRemove]?.isPrimary && newImages.length > 0) {
      newImages[0] = { ...newImages[0], isPrimary: true };
    }
    
    setFormData({ ...formData, images: newImages });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      // Basic validation
      if (!formData.name || !formData.price || !formData.category) {
        throw new Error('Please fill in all required fields: Name, Price, and Category');
      }
      
      if (isEdit && product) {
        // Update existing product
        const updated = await updateProduct(product.id, formData);
        if (updated) {
          router.push('/admin/products');
          router.refresh();
        } else {
          throw new Error('Failed to update product');
        }
      } else {
        // Create new product
        const created = await createProduct(formData);
        if (created) {
          router.push('/admin/products');
          router.refresh();
        } else {
          throw new Error('Failed to create product');
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      console.error('Product save error:', err);
    } finally {
      setLoading(false);
    }
  };

  // New function to handle description HTML preview
  const renderDescriptionPreview = () => {
    if (!formData.description) {
      return <p className="text-gray-400 italic">No description added</p>;
    }
    
    return (
      <div 
        className="prose prose-sm max-w-none overflow-hidden max-h-32"
        dangerouslySetInnerHTML={{ __html: formData.description }}
      />
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <div className="bg-red-50 text-red-800 p-4 rounded-lg">
          <p>{error}</p>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Product Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name || ''}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g. Carp Pro Fishing Rod"
            />
          </div>
          
          <div>
            <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-1">
              URL Slug (auto-generated if empty)
            </label>
            <input
              type="text"
              id="slug"
              name="slug"
              value={formData.slug || ''}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g. carp-pro-fishing-rod"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                Price (£) *
              </label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price || ''}
                onChange={handleInputChange}
                required
                step="0.01"
                min="0"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g. 29.99"
              />
            </div>
            
            <div>
              <label htmlFor="compareAtPrice" className="block text-sm font-medium text-gray-700 mb-1">
                Compare at Price (£)
              </label>
              <input
                type="number"
                id="compareAtPrice"
                name="compareAtPrice"
                value={formData.compareAtPrice || ''}
                onChange={handleInputChange}
                step="0.01"
                min="0"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g. 39.99"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="sku" className="block text-sm font-medium text-gray-700 mb-1">
                SKU
              </label>
              <input
                type="text"
                id="sku"
                name="sku"
                value={formData.sku || ''}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g. CPROD-123"
              />
            </div>
            
            <div>
              <label htmlFor="inventory" className="block text-sm font-medium text-gray-700 mb-1">
                Inventory
              </label>
              <input
                type="number"
                id="inventory"
                name="inventory"
                value={formData.inventory === undefined ? 0 : formData.inventory}
                onChange={handleInputChange}
                step="1"
                min="0"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g. 50"
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
              Category *
            </label>
            <select
              id="category"
              name="category"
              value={formData.category || 'tackle'}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            >
              {PRODUCT_CATEGORIES.map(category => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label htmlFor="shortDescription" className="block text-sm font-medium text-gray-700 mb-1">
              Short Description
            </label>
            <textarea
              id="shortDescription"
              name="shortDescription"
              value={formData.shortDescription || ''}
              onChange={handleInputChange}
              rows={2}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              placeholder="Brief description for product listings"
            />
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-1">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Full Description
              </label>
              <button
                type="button"
                onClick={() => setIsTextEditorOpen(true)}
                className="inline-flex items-center px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded hover:bg-blue-200"
              >
                <Edit className="h-3 w-3 mr-1" />
                Edit in Full Screen
              </button>
            </div>
            
            <div className="border border-gray-300 rounded-lg p-4 bg-gray-50 min-h-[80px]">
              {renderDescriptionPreview()}
            </div>
            
            <p className="mt-1 text-xs text-gray-500 flex items-center">
              <FileText className="h-3 w-3 mr-1" />
              HTML formatting is supported. Click "Edit in Full Screen" for a better editing experience.
            </p>
          </div>
          
          <div>
            <label className="flex items-center">
              <input
                type="checkbox"
                name="isActive"
                checked={formData.isActive === undefined ? true : !!formData.isActive}
                onChange={handleCheckboxChange}
                className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">
                Product is active (published)
              </span>
            </label>
          </div>
          
          <div>
            <label className="flex items-center">
              <input
                type="checkbox"
                name="sale"
                checked={formData.sale === undefined ? false : !!formData.sale}
                onChange={handleCheckboxChange}
                className="h-4 w-4 text-red-600 rounded focus:ring-red-500"
              />
              <span className="ml-2 text-sm text-gray-700">
                Product is on sale
              </span>
            </label>
          </div>
        </div>
        
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Images
            </label>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-4">
              {formData.images && formData.images.map((image, index) => (
                <div key={index} className="relative group">
                  <div className="aspect-square overflow-hidden bg-gray-100 rounded-md border border-gray-200">
                    <Image
                      src={image.url}
                      alt={image.alt}
                      width={200}
                      height={200}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  {image.isPrimary && (
                    <div className="absolute top-2 left-2 bg-blue-600 text-white px-1.5 py-0.5 text-xs rounded">
                      Primary
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="absolute top-2 right-2 bg-red-100 hover:bg-red-200 text-red-600 p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
              
              <div className="aspect-square bg-gray-50 rounded-md border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-500 hover:bg-gray-100 hover:border-gray-400 transition-colors">
                <label className="cursor-pointer w-full h-full flex flex-col items-center justify-center">
                  {uploadingImages ? (
                    <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                  ) : (
                    <>
                      <Upload className="h-8 w-8 mb-2" />
                      <span className="text-xs text-center px-2">Upload Image</span>
                    </>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    className="hidden"
                    disabled={uploadingImages}
                  />
                </label>
              </div>
            </div>
            
            <p className="text-xs text-gray-500">
              Upload product images. The first image will be used as the primary image.
            </p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tags
            </label>
            
            <div className="flex flex-wrap gap-2 mb-4">
              {COMMON_TAGS.map(tag => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => handleTagToggle(tag)}
                  className={`px-3 py-1 rounded-full text-sm ${
                    formData.tags?.includes(tag)
                      ? 'bg-blue-100 text-blue-800 border border-blue-300'
                      : 'bg-gray-100 text-gray-800 border border-gray-200 hover:bg-gray-200'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
            
            <div className="flex">
              <input
                type="text"
                value={customTag}
                onChange={(e) => setCustomTag(e.target.value)}
                placeholder="Add custom tag"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:ring-blue-500 focus:border-blue-500"
              />
              <button
                type="button"
                onClick={handleAddCustomTag}
                className="inline-flex items-center px-3 py-2 bg-gray-200 text-gray-800 rounded-r-md hover:bg-gray-300"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
            
            {formData.tags && formData.tags.length > 0 && (
              <div className="mt-3">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Applied Tags
                </label>
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map(tag => (
                    <div
                      key={tag}
                      className="flex items-center bg-gray-100 px-3 py-1 rounded-full text-sm text-gray-800"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleTagToggle(tag)}
                        className="ml-1 text-gray-500 hover:text-red-500"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-2 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition-colors"
          disabled={loading}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
          disabled={loading}
        >
          {loading && <Loader2 className="animate-spin h-4 w-4 mr-2" />}
          {isEdit ? 'Update Product' : 'Create Product'}
        </button>
      </div>
      
      {/* Text Editor Modal */}
      <TextEditModal
        isOpen={isTextEditorOpen}
        onClose={() => setIsTextEditorOpen(false)}
        onSave={(content) => {
          setFormData({ ...formData, description: content });
        }}
        initialContent={formData.description || ''}
        title="Edit Product Description"
      />
    </form>
  );
} 