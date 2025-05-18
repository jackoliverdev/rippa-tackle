import React from 'react';
import { Metadata } from 'next';
import { getAllBlogs, getBlogsByCategory } from '@/lib/blog-service';
import { Blog, BlogCategory } from '@/lib/types';
import BlogList from '@/components/website/blog/BlogList';
import BlogIndexHero from '@/components/website/blog/BlogIndexHero';

export const metadata: Metadata = {
  title: 'Rippa Tackle Blog - Carp Fishing Tips, Tackle Reviews & More',
  description: 'Discover expert carp fishing tips, tackle reviews, and angling advice. Learn to catch more and bigger carp with our comprehensive fishing blog.',
};

interface BlogsPageProps {
  searchParams: {
    category?: BlogCategory;
    page?: string;
  };
}

export default async function BlogsPage({ searchParams }: BlogsPageProps) {
  const { category } = searchParams;
  const currentPage = searchParams.page ? parseInt(searchParams.page) : 1;
  let blogs: Blog[] = [];
  let categories: BlogCategory[] = [];
  let loading = false;
  
  try {
    // Fetch blogs based on category or get all
    blogs = category 
      ? await getBlogsByCategory(category) 
      : await getAllBlogs();
      
    // Get unique categories from blogs for the filter
    categories = Array.from(
      new Set(blogs.map(blog => blog.category).filter(Boolean))
    ) as BlogCategory[];
  } catch (error) {
    // Instead of notFound(), let the client component handle fetching
    console.error('Error fetching blogs in server component:', error);
    // We'll set blogs to an empty array - the client component will fetch data itself
    blogs = [];
    categories = [];
  }
  
  return (
    <main>
      {/* Hero Section */}
      <BlogIndexHero 
        selectedCategory={category || null}
        categories={categories}
        postCount={blogs.length}
      />
      
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-7xl mx-auto">
          {/* Blog List with Filtering */}
          <BlogList
            blogs={blogs}
            showFilters={false} // Filters are now in the hero
            categories={categories}
            selectedCategory={category || null}
            showPagination={true}
            itemsPerPage={9}
            loading={loading}
          />
        </div>
      </div>
    </main>
  );
} 