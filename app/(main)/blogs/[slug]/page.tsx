import React from 'react';
import { Metadata } from 'next';
import { getBlogBySlug } from '@/lib/blog-service';
import { notFound } from 'next/navigation';
import BlogHero from '@/components/website/blog/BlogHero';
import BlogTitle from '@/components/website/blog/BlogTitle';
import BlogDetail from '@/components/website/blog/BlogDetail';
import BlogRelated from '@/components/website/blog/BlogRelated';

// Mark this component as dynamic with no caching
export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface BlogPostPageProps {
  params: {
    slug: string;
  };
}

// Generate metadata for the blog post
export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = params;
  console.log(`Generating metadata for blog with slug: ${slug}`);
  const blog = await getBlogBySlug(slug);
  
  if (!blog) {
    return {
      title: 'Blog Post Not Found',
      description: 'The requested blog post could not be found.',
    };
  }
  
  return {
    title: `${blog.title} | Rippa Tackle Blog`,
    description: blog.summary || `Read about ${blog.title} in our fishing blog.`,
    openGraph: blog.feature_image ? {
      images: [{ url: blog.feature_image, width: 1200, height: 630, alt: blog.title }],
    } : undefined,
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = params;
  console.log(`Rendering BlogPostPage for slug: ${slug} at ${new Date().toISOString()}`);
  
  try {
    const blog = await getBlogBySlug(slug);
    
    if (!blog) {
      console.error(`Blog not found for slug: ${slug}`);
      return notFound();
    }
    
    console.log(`Successfully loaded blog: ${blog.title} (ID: ${blog.id})`);
    
    return (
      <main>
        {/* Hero Section */}
        <BlogHero blog={blog} />
        
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            {/* Blog Title & Author Section */}
            <BlogTitle blog={blog} />
            
            {/* Blog Content */}
            <BlogDetail blog={blog} className="mt-10" />
            
            {/* Related Posts */}
            <BlogRelated blogId={blog.id} limit={3} className="mt-20" />
          </div>
        </div>
      </main>
    );
  } catch (error) {
    console.error('Error fetching blog post:', error);
    return notFound();
  }
} 