import { Search } from 'lucide-react';

type SearchHeroProps = {
  query: string;
};

export const SearchHero = ({ query }: SearchHeroProps) => {
  return (
    <div className="bg-slate-900 py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-center">
          <div className="flex items-center mb-5 text-blue-400">
            <Search className="h-6 w-6 mr-2" />
            <span className="text-sm uppercase tracking-wider font-medium">Search Results</span>
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold text-white text-center mb-4">
            {query ? (
              <>
                Results for <span className="text-blue-400">"{query}"</span>
              </>
            ) : (
              "All Products"
            )}
          </h1>
          
          <p className="text-slate-300 text-center max-w-2xl">
            {query ? (
              `Showing fishing tackle and equipment matching "${query}". Find the perfect gear for your next session on the bank.`
            ) : (
              "Browse our complete collection of premium fishing tackle, bait, and accessories."
            )}
          </p>
        </div>
      </div>
    </div>
  );
}; 