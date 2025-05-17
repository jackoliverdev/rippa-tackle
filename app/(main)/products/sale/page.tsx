import { Metadata } from 'next';
import { ProductGrid } from '@/components/website/products/ProductGrid';
import SaleHero from '@/components/website/products/sale/SaleHero';

export const metadata: Metadata = {
  title: 'Sale Items | Rippa Tackle',
  description: 'Limited time offers on fishing tackle, bait, and accessories. Grab a bargain on premium carp fishing gear at discounted prices.',
};

export default function SalePage() {
  return (
    <main className="min-h-screen">
      <SaleHero />
      <ProductGrid 
        title="Sale Products"
        showSaleOnly={true}
      />
    </main>
  );
} 