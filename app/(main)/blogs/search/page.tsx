import React from 'react';
import { Metadata } from 'next';
import { searchBlogs } from '@/lib/blog-service';
import { Blog } from '@/lib/types';
import BlogList from '@/components/website/blog/BlogList';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Search Blog | Rippa Tackle',
  description: 'Search our fishing blog for carp fishing tips, tackle reviews, and angling advice.',
};

interface SearchPageProps {
  searchParams: {
    query?: string;
    page?: string;
  };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { query } = searchParams;
  const currentPage = searchParams.page ? parseInt(searchParams.page) : 1;
  
  let blogs: Blog[] = [];
  let loading = false;
  let error: string | null = null;
  
  if (query) {
    try {
      loading = true;
      blogs = await searchBlogs(query);
      loading = false;
    } catch (err) {
      console.error('Error searching blogs:', err);
      error = 'Failed to perform search. Please try again.';
      loading = false;
    }
  }
  
  return (
    <main className="container mx-auto px-4 py-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Search Results</h1>
          
          {query ? (
            <p className="text-gray-600 dark:text-gray-400">
              Showing results for <span className="font-semibold">"{query}"</span>
            </p>
          ) : (
            <p className="text-gray-600 dark:text-gray-400">
              Enter a search term to find blog posts
            </p>
          )}
          
          {/* Search Form */}
          <div className="mt-8 max-w-xl mx-auto">
            <form action="/blogs/search" method="get" className="flex items-center">
              <input
                type="text"
                name="query"
                defaultValue={query || ''}
                placeholder="Search for fishing tips, techniques..."
                className="flex-grow px-4 py-3 border border-gray-300 dark:border-gray-700 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-800 dark:text-white"
                required
              />
              <button
                type="submit"
                className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-r-lg transition-colors duration-300"
              >
                Search
              </button>
            </form>
          </div>
        </div>
        
        {/* Results */}
        {query ? (
          <>
            {blogs.length > 0 ? (
              <BlogList
                blogs={blogs}
                loading={loading}
                error={error || undefined}
                showPagination={true}
                itemsPerPage={9}
                columns={3}
              />
            ) : !loading && (
              <div className="text-center py-12">
                <h2 className="text-2xl font-semibold mb-4">No matches found</h2>
                <p className="text-gray-600 dark:text-gray-400 mb-8">
                  We couldn't find any blog posts matching "{query}". Please try different keywords.
                </p>
                <Link
                  href="/blogs"
                  className="inline-block bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg transition-colors duration-300"
                >
                  View All Blogs
                </Link>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400">
              Search for blog content above or{' '}
              <Link 
                href="/blogs" 
                className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 underline"
              >
                browse all blogs
              </Link>
            </p>
          </div>
        )}
      </div>
    </main>
  );
}