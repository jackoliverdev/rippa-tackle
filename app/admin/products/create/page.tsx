import { Package } from 'lucide-react';
import PageTitle from '@/components/admin/page-title';
import ProductForm from '@/components/admin/products/product-form';

export default function CreateProductPage() {
  return (
    <div>
      <PageTitle 
        title="Add New Product" 
        description="Create a new product to sell in your store"
        icon={<Package className="w-5 h-5" />}
      />
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <ProductForm />
      </div>
    </div>
  );
} 