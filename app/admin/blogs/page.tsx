"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FileText, Plus, Search, FilterX } from 'lucide-react';
import PageTitle from '@/components/admin/page-title';
import BlogList from '@/components/admin/blogs/blog-list';
import { getAllBlogs, deleteBlog } from '@/lib/blog-service';
import { Blog, BlogCategory } from '@/lib/types';
import { supabase } from '@/lib/supabase';

// Blog categories for filter
const BLOG_CATEGORIES = [
  { value: 'all', label: 'All Categories' },
  { value: 'carp-fishing', label: 'Carp Fishing' },
  { value: 'tackle-guides', label: 'Tackle Guides' },
  { value: 'tutorials', label: 'Tutorials' },
  { value: 'venues', label: 'Venues' },
  { value: 'reviews', label: 'Reviews' },
  { value: 'tips', label: 'Tips' },
  { value: 'news', label: 'News' },
];

export default function BlogsPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [filteredBlogs, setFilteredBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [showPublishedOnly, setShowPublishedOnly] = useState(false);
  const [showFeaturedOnly, setShowFeaturedOnly] = useState(false);
  
  // Load blogs on initial render
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        console.log('Fetching blogs for admin panel...');
        
        // Direct Supabase query to check what's actually in the database
        const { data: directData, error: directError } = await supabase
          .from('rippa_blogs')
          .select('*');
          
        console.log('Direct Supabase query result:', { data: directData, error: directError });
        
        // Get ALL blogs, both published and drafts
        const data = await getAllBlogs(true, true); // includeAll=true to get everything
        console.log('Blogs fetched via API:', data);
        
        setBlogs(data);
        setFilteredBlogs(data);
      } catch (err) {
        console.error('Error loading blogs:', err);
        setError('Failed to load blog posts. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchBlogs();
  }, []);
  
  // Apply filters whenever filter state changes
  useEffect(() => {
    let result = [...blogs];
    
    // Apply category filter
    if (categoryFilter !== 'all') {
      result = result.filter(blog => blog.category === categoryFilter);
    }
    
    // Apply published filter
    if (showPublishedOnly) {
      result = result.filter(blog => blog.published);
    }
    
    // Apply featured filter
    if (showFeaturedOnly) {
      result = result.filter(blog => blog.featured);
    }
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(blog => 
        blog.title.toLowerCase().includes(query) || 
        blog.summary?.toLowerCase().includes(query) ||
        blog.content?.toLowerCase().includes(query) ||
        blog.author?.toLowerCase().includes(query) ||
        blog.tags?.some(tag => tag.toLowerCase().includes(query))
      );
    }
    
    setFilteredBlogs(result);
  }, [blogs, categoryFilter, showPublishedOnly, showFeaturedOnly, searchQuery]);
  
  // Handle blog deletion
  const handleDeleteBlog = async (blogId: string) => {
    try {
      const success = await deleteBlog(blogId);
      
      if (success) {
        setBlogs(blogs.filter(blog => blog.id !== blogId));
        // No need to setFilteredBlogs as the useEffect will handle that
      } else {
        throw new Error('Failed to delete blog post');
      }
    } catch (err) {
      console.error('Error deleting blog post:', err);
      // You might want to show a toast notification here
    }
  };
  
  // Reset all filters
  const resetFilters = () => {
    setSearchQuery('');
    setCategoryFilter('all');
    setShowPublishedOnly(false);
    setShowFeaturedOnly(false);
  };
  
  // Count for filters showing
  const isFiltering = categoryFilter !== 'all' || showPublishedOnly || showFeaturedOnly || searchQuery;
  
  return (
    <div>
      <PageTitle 
        title="Blog Posts" 
        description={`${blogs.length} blog posts in your site`}
        icon={<FileText className="w-5 h-5" />}
        actions={
          <Link
            href="/admin/blogs/new"
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg shadow-sm hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            New Blog Post
          </Link>
        }
      />
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search blog posts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div className="flex flex-wrap md:flex-nowrap gap-4">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            >
              {BLOG_CATEGORIES.map((category) => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
            
            <label className="flex items-center px-4 py-2 border border-gray-300 rounded-lg cursor-pointer">
              <input
                type="checkbox"
                checked={showPublishedOnly}
                onChange={(e) => setShowPublishedOnly(e.target.checked)}
                className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500 mr-2"
              />
              <span className="text-sm">Published only</span>
            </label>
            
            <label className="flex items-center px-4 py-2 border border-gray-300 rounded-lg cursor-pointer">
              <input
                type="checkbox"
                checked={showFeaturedOnly}
                onChange={(e) => setShowFeaturedOnly(e.target.checked)}
                className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500 mr-2"
              />
              <span className="text-sm">Featured only</span>
            </label>
            
            {isFiltering && (
              <button
                onClick={resetFilters}
                className="flex items-center gap-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
              >
                <FilterX className="h-4 w-4" />
                <span>Reset</span>
              </button>
            )}
          </div>
        </div>
      </div>
      
      {loading ? (
        <div className="py-8 flex justify-center">
          <div className="animate-pulse text-gray-500">Loading blog posts...</div>
        </div>
      ) : error ? (
        <div className="bg-red-50 text-red-800 p-6 rounded-xl text-center">
          <p>{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-red-100 text-red-800 rounded-lg hover:bg-red-200"
          >
            Try Again
          </button>
        </div>
      ) : (
        <>
          {isFiltering && (
            <div className="mb-4 text-sm text-gray-500">
              Showing {filteredBlogs.length} of {blogs.length} blog posts
              {categoryFilter !== 'all' && ` in ${categoryFilter}`}
              {showPublishedOnly && ', published only'}
              {showFeaturedOnly && ', featured only'}
              {searchQuery && `, matching "${searchQuery}"`}
            </div>
          )}
          
          <BlogList 
            blogs={filteredBlogs} 
            onDelete={handleDeleteBlog} 
          />
        </>
      )}
    </div>
  );
} 