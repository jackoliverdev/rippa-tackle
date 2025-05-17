'use client';

import React, { useState } from 'react';
import { Eye } from 'lucide-react';
import ProductPreviewModal from './ProductPreviewModal';

interface ProductQuickViewProps {
  productId?: string;
  productSlug?: string;
  buttonLabel?: string;
  className?: string;
}

/**
 * ProductQuickView - A button component that opens a product preview modal
 * 
 * @example
 * // Basic usage with product ID
 * <ProductQuickView productId="12345" />
 * 
 * @example
 * // Using with product slug and custom styling
 * <ProductQuickView 
 *   productSlug="nash-tackle-scopex-boilies" 
 *   buttonLabel="Quick View" 
 *   className="text-sm bg-blue-100" 
 * />
 */
const ProductQuickView: React.FC<ProductQuickViewProps> = ({
  productId,
  productSlug,
  buttonLabel = "Quick Preview",
  className = ""
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <>
      <button
        onClick={openModal}
        className={`flex items-center justify-center px-3 py-2 text-sm font-medium rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors ${className}`}
        aria-label="Quick view product"
      >
        <Eye className="w-4 h-4 mr-1.5" />
        {buttonLabel}
      </button>

      <ProductPreviewModal
        productId={productId}
        productSlug={productSlug}
        isOpen={isModalOpen}
        onClose={closeModal}
      />
    </>
  );
};

export default ProductQuickView; 