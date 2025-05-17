import { ProductHero } from '@/components/website/products/ProductHero';
import { ProductGrid } from '@/components/website/products/ProductGrid';
import { Metadata } from 'next';
import { ProductCategory } from '@/types/product';

export const metadata: Metadata = {
  title: 'Fishing Tackle Products | Rippa Tackle',
  description: 'Browse our premium selection of carp fishing tackle, rigs, baits and accessories.'
};

export default async function ProductsPage({
  searchParams
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  // Extract filter parameters from URL
  const searchQuery = searchParams.search as string || '';
  const category = searchParams.category as ProductCategory | 'all' || 'all';
  const subcategory = searchParams.subcategory as string || null;
  const brand = searchParams.brand as string || null;
  
  // Generate a dynamic title based on filters
  let title = 'All Products';
  
  if (category && category !== 'all') {
    title = `${category.charAt(0).toUpperCase() + category.slice(1)}`;
    
    if (subcategory) {
      // Format subcategory for display (convert hyphens to spaces, capitalize)
      const formattedSubcategory = subcategory
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
      
      title = `${formattedSubcategory}`;
    }
  } else if (brand && brand !== 'all') {
    // Capitalize brand name
    title = `${brand.charAt(0).toUpperCase() + brand.slice(1)} Products`;
  }
  
  // Check if we should show sale products
  const showSaleOnly = searchParams.sale === 'true';
  if (showSaleOnly) {
    title = 'Sale Items';
  }

  return (
    <main className="min-h-screen">
      <ProductHero />
      <ProductGrid 
        searchQuery={searchQuery}
        title={title}
        initialCategory={category} 
        initialSubcategory={subcategory}
        initialBrand={brand}
        showSaleOnly={showSaleOnly}
      />
    </main>
  );
} 