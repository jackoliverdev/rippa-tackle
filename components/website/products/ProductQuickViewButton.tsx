'use client';

import React, { useState } from 'react';
import { Eye } from 'lucide-react';
import ProductPreviewModal from './ProductPreviewModal';

interface ProductQuickViewButtonProps {
  productSlug: string;
}

/**
 * A button that opens the product preview modal
 */
const ProductQuickViewButton: React.FC<ProductQuickViewButtonProps> = ({
  productSlug
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const handlePreview = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <button
        onClick={handlePreview}
        className="flex items-center justify-center text-sm font-medium bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 rounded-r-md border-l border-blue-700 transition-colors"
        aria-label="Quick Preview"
      >
        <Eye className="w-4 h-4 mr-1.5" />
        Preview
      </button>

      <ProductPreviewModal
        productSlug={productSlug}
        isOpen={isModalOpen}
        onClose={closeModal}
      />
    </>
  );
};

export default ProductQuickViewButton; 