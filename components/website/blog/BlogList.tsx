'use client';

import React, { useState, useEffect } from 'react';
import { Blog, BlogCategory } from '@/lib/types';
import BlogCard from './BlogCard';
import { getAllBlogs, getBlogsByCategory } from '@/lib/blog-service';
import { Loader2 } from 'lucide-react';

interface BlogListProps {
  blogs: Blog[];
  title?: string;
  description?: string;
  loading?: boolean;
  error?: string;
  columns?: 2 | 3 | 4;
  showPagination?: boolean;
  itemsPerPage?: number;
  showFilters?: boolean;
  categories?: BlogCategory[];
  onCategorySelect?: (category: BlogCategory | null) => void;
  selectedCategory?: BlogCategory | null;
  className?: string;
}

export default function BlogList({
  blogs: initialBlogs,
  title,
  description,
  loading: initialLoading = false,
  error: initialError,
  columns = 3,
  showPagination = true,
  itemsPerPage = 9,
  showFilters = false,
  categories: initialCategories = [],
  onCategorySelect,
  selectedCategory = null,
  className = '',
}: BlogListProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | undefined>(undefined);

  // Simple direct fetch approach (just like FeaturedBlogs)
  useEffect(() => {
    const fetchBlogs = async () => {
      setLoading(true);
      try {
        // Fetch blogs based on category or get all - EXACT SAME APPROACH AS FEATUREDBLOGS
        let data = selectedCategory 
          ? await getBlogsByCategory(selectedCategory) 
          : await getAllBlogs();
        
        console.log("BlogList fetch result:", data.length, "blogs found");
        
        if (data && data.length > 0) {
          setBlogs(data);
          
          // Get unique categories from blogs for the filter
          if (showFilters) {
            const uniqueCategories = Array.from(
              new Set(data.map(blog => blog.category).filter(Boolean))
            ) as BlogCategory[];
            setCategories(uniqueCategories);
          }
        } else {
          console.warn("No blogs returned from API");
        }
      } catch (fetchError) {
        console.error('Error fetching blogs:', fetchError);
        setError('Failed to load blogs');
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, [selectedCategory, showFilters]);

  // Handle category selection
  const handleCategoryClick = (category: BlogCategory | null) => {
    if (onCategorySelect) {
      onCategorySelect(category);
    } else {
      // Update selected category directly which will trigger the useEffect
      window.history.pushState(
        {}, 
        '', 
        category ? `?category=${category}` : window.location.pathname
      );
      
      // Need to manually refresh in client component
      window.location.reload();
    }
  };

  // Calculate pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentBlogs = blogs.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(blogs.length / itemsPerPage);

  // Change page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  // Determine column class based on columns prop
  const columnClass = {
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
  }[columns];

  if (error) {
    return (
      <div className="text-center py-10">
        <h3 className="text-xl text-red-600 mb-2">Error</h3>
        <p className="text-gray-600 dark:text-gray-400">{error}</p>
      </div>
    );
  }

  return (
    <div className={`w-full ${className}`}>
      {/* Header Section */}
      {(title || description) && (
        <div className="text-center mb-10">
          {title && <h2 className="text-3xl font-bold mb-4">{title}</h2>}
          {description && <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">{description}</p>}
        </div>
      )}

      {/* Category Filters */}
      {showFilters && categories.length > 0 && (
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          <button
            onClick={() => handleCategoryClick(null)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors
              ${!selectedCategory
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
          >
            All
          </button>
          
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => handleCategoryClick(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors
                ${selectedCategory === category
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
            >
              {category.replace('-', ' ')}
            </button>
          ))}
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        <div className="flex justify-center items-center h-60">
          <Loader2 className="h-12 w-12 text-blue-600 animate-spin" />
        </div>
      ) : (
        <>
          {/* Blogs Grid */}
          {currentBlogs.length > 0 ? (
            <div className={`grid gap-6 ${columnClass}`}>
              {currentBlogs.map((blog) => (
                <BlogCard key={blog.id} blog={blog} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-gray-500 dark:text-gray-400">No blogs found</p>
            </div>
          )}

          {/* Pagination */}
          {showPagination && totalPages > 1 && (
            <div className="flex justify-center mt-10">
              <nav className="flex items-center">
                <button
                  onClick={() => paginate(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="mr-4 p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 disabled:opacity-50"
                  aria-label="Previous page"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
                
                <span className="px-4 py-2 text-gray-700 dark:text-gray-300">
                  {currentPage} of {totalPages}
                </span>
                
                <button
                  onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="ml-4 p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 disabled:opacity-50"
                  aria-label="Next page"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </button>
              </nav>
            </div>
          )}
        </>
      )}
    </div>
  );
} 