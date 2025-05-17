"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Edit, Trash2, Package, Eye, AlertCircle, Star } from 'lucide-react';
import { Product } from '@/types/product';
import { formatCurrency } from '@/lib/utils';
import DeleteModal from '@/components/admin/delete-modal';

interface ProductListProps {
  products: Product[];
  onDelete?: (id: string) => void;
}

export default function ProductList({ products, onDelete }: ProductListProps) {
  const [expandedProductId, setExpandedProductId] = useState<string | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedProductId(expandedProductId === id ? null : id);
  };

  const handleDeleteClick = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    setProductToDelete(product);
    setDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (productToDelete && onDelete) {
      onDelete(productToDelete.id);
      setDeleteModalOpen(false);
      setProductToDelete(null);
    }
  };

  if (!products || products.length === 0) {
    return (
      <div className="bg-white rounded-xl p-10 text-center shadow-sm border border-gray-200">
        <Package className="w-12 h-12 mx-auto text-blue-200 mb-4" />
        <h3 className="text-xl font-medium text-gray-600 mb-1">No Products Found</h3>
        <p className="text-gray-500 mb-6">There are no products available matching your criteria.</p>
        <Link 
          href="/admin/products/create" 
          className="inline-flex items-center justify-center px-5 py-2 bg-blue-600 text-white rounded-lg font-medium shadow-sm hover:bg-blue-700 transition-colors"
        >
          Add Your First Product
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="overflow-hidden bg-white rounded-xl shadow-sm border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Product
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Price
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Inventory
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {products.map((product) => (
              <React.Fragment key={product.id}>
                <tr className="hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => toggleExpand(product.id)}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0 bg-gray-100 rounded overflow-hidden">
                        {product.images && product.images.length > 0 ? (
                          <Image
                            src={product.images[0].url}
                            alt={product.images[0].alt}
                            width={40}
                            height={40}
                            className="h-10 w-10 object-cover"
                          />
                        ) : (
                          <Package className="h-6 w-6 m-2 text-gray-400" />
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{product.name}</div>
                        <div className="text-sm text-gray-500">{product.sku || 'No SKU'}</div>
                      </div>
                      {product.tags?.includes('featured') && (
                        <Star className="h-4 w-4 ml-2 text-amber-400" fill="currentColor" />
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{formatCurrency(Number(product.price))}</div>
                    {product.compareAtPrice && (
                      <div className="text-xs text-gray-500 line-through">
                        {formatCurrency(Number(product.compareAtPrice))}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {product.inventory !== undefined ? product.inventory : 'N/A'}
                    </div>
                    {product.inventory !== undefined && product.inventory <= 5 && product.inventory > 0 && (
                      <div className="text-xs text-amber-600 flex items-center mt-1">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        Low stock
                      </div>
                    )}
                    {product.inventory !== undefined && product.inventory <= 0 && (
                      <div className="text-xs text-red-600 flex items-center mt-1">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        Out of stock
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                      {product.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      product.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {product.isActive ? 'Active' : 'Draft'}
                    </span>
                    {product.sale && (
                      <span className="ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                        Sale
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <Link
                        href={`/products/${product.slug}`}
                        className="text-gray-400 hover:text-gray-500"
                        onClick={(e) => e.stopPropagation()}
                        target="_blank"
                      >
                        <Eye className="h-5 w-5" />
                      </Link>
                      <Link
                        href={`/admin/products/${product.id}`}
                        className="text-blue-600 hover:text-blue-900"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Edit className="h-5 w-5" />
                      </Link>
                      {onDelete && (
                        <button
                          onClick={(e) => handleDeleteClick(e, product)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
                {expandedProductId === product.id && (
                  <tr className="bg-gray-50">
                    <td colSpan={6} className="px-6 py-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="text-sm font-medium text-gray-700 mb-2">Description</h4>
                          <p className="text-sm text-gray-600">
                            {product.description || product.shortDescription || 'No description available.'}
                          </p>
                          
                          {product.tags && product.tags.length > 0 && (
                            <div className="mt-3">
                              <h4 className="text-sm font-medium text-gray-700 mb-1">Tags</h4>
                              <div className="flex flex-wrap gap-1">
                                {product.tags.map(tag => (
                                  <span key={tag} className="px-2 py-0.5 text-xs rounded bg-gray-200 text-gray-800">
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                        
                        <div>
                          {product.variants && product.variants.length > 0 && (
                            <div>
                              <h4 className="text-sm font-medium text-gray-700 mb-2">Variants</h4>
                              <div className="grid grid-cols-1 gap-2">
                                {product.variants.map(variant => (
                                  <div key={variant.id} className="text-sm flex justify-between bg-white p-2 rounded">
                                    <div className="font-medium">{variant.name}</div>
                                    <div className="text-gray-600">
                                      {formatCurrency(variant.price)} - Stock: {variant.inventory}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                          
                          {product.images && product.images.length > 1 && (
                            <div className="mt-3">
                              <h4 className="text-sm font-medium text-gray-700 mb-2">Images</h4>
                              <div className="flex flex-wrap gap-2">
                                {product.images.map((image, index) => (
                                  <div key={index} className="w-12 h-12 bg-gray-100 rounded overflow-hidden">
                                    <Image
                                      src={image.url}
                                      alt={image.alt}
                                      width={48}
                                      height={48}
                                      className="h-12 w-12 object-cover"
                                    />
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {/* Delete confirmation modal */}
      <DeleteModal 
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setProductToDelete(null);
        }}
        onConfirm={confirmDelete}
        title="Delete Product"
        description="Are you sure you want to delete this product?"
        itemName={productToDelete?.name}
      />
    </>
  );
} 