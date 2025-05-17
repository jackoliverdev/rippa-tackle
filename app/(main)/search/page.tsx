import { Metadata } from 'next';
import { ProductGrid } from '@/components/website/products/ProductGrid';
import { SearchHero } from '@/components/website/search/SearchHero';

type SearchPageProps = {
  searchParams: { q?: string };
};

export async function generateMetadata({ searchParams }: SearchPageProps): Promise<Metadata> {
  const query = searchParams.q || '';
  
  return {
    title: `Search Results: ${query} | Rippa Tackle`,
    description: `Browse fishing tackle search results for "${query}" at Rippa Tackle. Find the best carp fishing gear, tackle, bait and more.`,
  };
}

export default function SearchPage({ searchParams }: SearchPageProps) {
  const query = searchParams.q || '';
  
  return (
    <main className="min-h-screen">
      <SearchHero query={query} />
      <ProductGrid 
        searchQuery={query} 
        title={query ? `Search Results: "${query}"` : 'All Products'} 
      />
    </main>
  );
} 