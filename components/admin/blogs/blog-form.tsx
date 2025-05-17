"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Blog, BlogCategory, BlogTag } from '@/lib/types';
import { createBlog, updateBlog, uploadBlogImage } from '@/lib/blog-service';
import { X, Image as ImageIcon, Loader2, Check, Edit2 } from 'lucide-react';
import Image from 'next/image';
import TextEditModal from '@/components/admin/TextEditModal';

// Available blog categories
const BLOG_CATEGORIES: { value: BlogCategory; label: string }[] = [
  { value: 'carp-fishing', label: 'Carp Fishing' },
  { value: 'tackle-guides', label: 'Tackle Guides' },
  { value: 'tutorials', label: 'Tutorials' },
  { value: 'venues', label: 'Venues' },
  { value: 'reviews', label: 'Reviews' },
  { value: 'tips', label: 'Tips' },
  { value: 'news', label: 'News' },
];

// Available blog tags
const BLOG_TAGS: { value: BlogTag; label: string }[] = [
  { value: 'featured', label: 'Featured' },
  { value: 'popular', label: 'Popular' },
  { value: 'beginner', label: 'Beginner' },
  { value: 'advanced', label: 'Advanced' },
  { value: 'seasonal', label: 'Seasonal' },
  { value: 'tutorial', label: 'Tutorial' },
  { value: 'rig-guide', label: 'Rig Guide' },
  { value: 'bait-guide', label: 'Bait Guide' },
  { value: 'product-review', label: 'Product Review' },
  { value: 'venue-review', label: 'Venue Review' },
  { value: 'interview', label: 'Interview' },
];

interface BlogFormProps {
  blog?: Blog;
  isEdit?: boolean;
}

export default function BlogForm({ blog, isEdit = false }: BlogFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  // Form state
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<BlogCategory | ''>('');
  const [selectedTags, setSelectedTags] = useState<BlogTag[]>([]);
  const [author, setAuthor] = useState('');
  const [authorImage, setAuthorImage] = useState('');
  const [featureImage, setFeatureImage] = useState('');
  const [readTime, setReadTime] = useState<number | ''>('');
  const [published, setPublished] = useState(false);
  const [featured, setFeatured] = useState(false);
  
  // Rich text editor modal
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  
  // File uploads
  const [featureImageFile, setFeatureImageFile] = useState<File | null>(null);
  const [featureImagePreview, setFeatureImagePreview] = useState<string | null>(null);
  const [authorImageFile, setAuthorImageFile] = useState<File | null>(null);
  const [authorImagePreview, setAuthorImagePreview] = useState<string | null>(null);
  
  // Load blog data if editing
  useEffect(() => {
    if (isEdit && blog) {
      setTitle(blog.title || '');
      setSlug(blog.slug || '');
      setSummary(blog.summary || '');
      setContent(blog.content || '');
      setCategory(blog.category as (BlogCategory | '') || '');
      setSelectedTags((blog.tags || []) as BlogTag[]);
      setAuthor(blog.author || '');
      setAuthorImage(blog.author_image || '');
      setFeatureImage(blog.feature_image || '');
      setReadTime(blog.read_time || '');
      setPublished(blog.published || false);
      setFeatured(blog.featured || false);
    }
  }, [isEdit, blog]);
  
  // Generate slug from title
  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };
  
  // Handle title change and auto-generate slug if not in edit mode
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    
    if (!isEdit || slug === '') {
      setSlug(generateSlug(newTitle));
    }
  };
  
  // Handle feature image upload
  const handleFeatureImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFeatureImageFile(file);
      const preview = URL.createObjectURL(file);
      setFeatureImagePreview(preview);
    }
  };
  
  // Handle author image upload
  const handleAuthorImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAuthorImageFile(file);
      const preview = URL.createObjectURL(file);
      setAuthorImagePreview(preview);
    }
  };
  
  // Handle tag selection
  const handleTagToggle = (tag: BlogTag) => {
    setSelectedTags(prevTags => 
      prevTags.includes(tag)
        ? prevTags.filter(t => t !== tag)
        : [...prevTags, tag]
    );
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);
    
    try {
      // Validate required fields
      if (!title) throw new Error('Title is required');
      if (!slug) throw new Error('Slug is required');
      if (!content) throw new Error('Content is required');
      
      // Prepare blog data
      const blogData: Partial<Blog> = {
        title,
        slug,
        summary,
        content,
        category: category as BlogCategory,
        tags: selectedTags,
        author,
        read_time: readTime ? Number(readTime) : undefined,
        published,
        featured,
      };
      
      // Upload feature image if selected
      if (featureImageFile) {
        const imageResult = await uploadBlogImage(featureImageFile, isEdit && blog ? blog.id : undefined);
        if (imageResult) {
          blogData.feature_image = imageResult.url;
        }
      } else if (featureImage) {
        blogData.feature_image = featureImage;
      }
      
      // Upload author image if selected
      if (authorImageFile) {
        const imageResult = await uploadBlogImage(authorImageFile, isEdit && blog ? blog.id : undefined);
        if (imageResult) {
          blogData.author_image = imageResult.url;
        }
      } else if (authorImage) {
        blogData.author_image = authorImage;
      }
      
      // Create new blog or update existing one
      let result;
      if (isEdit && blog) {
        result = await updateBlog(blog.id, blogData);
      } else {
        result = await createBlog(blogData);
      }
      
      if (!result) {
        throw new Error(`Failed to ${isEdit ? 'update' : 'create'} blog post`);
      }
      
      setSuccess(true);
      
      // Redirect after successful save (with a small delay)
      setTimeout(() => {
        router.push('/admin/blogs');
      }, 1500);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(errorMessage);
      console.error('Error saving blog:', err);
    } finally {
      setLoading(false);
    }
  };
  
  // Calculate estimated read time based on content length
  const calculateReadTime = () => {
    // Average reading speed: ~200 words per minute
    const wordCount = content.trim().split(/\s+/).length;
    const minutes = Math.ceil(wordCount / 200);
    setReadTime(minutes < 1 ? 1 : minutes);
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Status bar - shows when saving/success/error */}
      {(loading || success || error) && (
        <div className={`p-4 rounded-lg flex items-center justify-between ${
          error ? 'bg-red-50 text-red-800' : 
          success ? 'bg-green-50 text-green-800' : 
          'bg-blue-50 text-blue-800'
        }`}>
          <div className="flex items-center">
            {loading && <Loader2 className="w-5 h-5 mr-2 animate-spin" />}
            {success && <Check className="w-5 h-5 mr-2" />}
            {error && <X className="w-5 h-5 mr-2" />}
            <span>{error || (success ? `Blog post ${isEdit ? 'updated' : 'created'} successfully!` : 'Saving...')}</span>
          </div>
          
          {error && (
            <button 
              type="button" 
              onClick={() => setError(null)}
              className="text-red-600 hover:text-red-800"
            >
              Dismiss
            </button>
          )}
        </div>
      )}
      
      {/* Title and Slug */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Title <span className="text-red-500">*</span>
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={handleTitleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter blog title"
            required
          />
        </div>
        
        <div>
          <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-1">
            Slug <span className="text-red-500">*</span>
            <span className="ml-2 text-xs text-gray-500 font-normal">
              (used in URL: /blogs/your-slug)
            </span>
          </label>
          <input
            id="slug"
            type="text"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            placeholder="enter-blog-slug"
            required
          />
        </div>
      </div>
      
      {/* Summary */}
      <div>
        <label htmlFor="summary" className="block text-sm font-medium text-gray-700 mb-1">
          Summary
          <span className="ml-2 text-xs text-gray-500 font-normal">
            (Brief description for previews, SEO, etc.)
          </span>
        </label>
        <textarea
          id="summary"
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          rows={3}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          placeholder="Enter a brief summary of your blog post"
        />
      </div>
      
      {/* Content */}
      <div>
        <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
          Content <span className="text-red-500">*</span>
        </label>
        <div className="border border-gray-300 rounded-lg p-4 min-h-[200px] bg-white">
          {content ? (
            <div 
              className="prose max-w-none"
              dangerouslySetInnerHTML={{ __html: content }} 
            />
          ) : (
            <p className="text-gray-400">Write your blog post content here...</p>
          )}
        </div>
        <div className="flex justify-end mt-2 space-x-2">
          <button
            type="button"
            onClick={() => setIsEditorOpen(true)}
            className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
          >
            <Edit2 className="h-4 w-4 mr-1" />
            Edit content
          </button>
          <button
            type="button"
            onClick={calculateReadTime}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            Calculate read time
          </button>
        </div>
        
        {/* Text Editor Modal */}
        <TextEditModal
          isOpen={isEditorOpen}
          onClose={() => setIsEditorOpen(false)}
          onSave={(newContent) => {
            setContent(newContent);
            setIsEditorOpen(false);
          }}
          initialContent={content}
          title="Edit Blog Content"
        />
      </div>
      
      {/* Category, Read Time */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
            Category
          </label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value as BlogCategory)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select a category</option>
            {BLOG_CATEGORIES.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <label htmlFor="read_time" className="block text-sm font-medium text-gray-700 mb-1">
            Read Time (minutes)
          </label>
          <input
            id="read_time"
            type="number"
            min="1"
            value={readTime}
            onChange={(e) => setReadTime(e.target.value === '' ? '' : Number(e.target.value))}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            placeholder="5"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Publication Status
          </label>
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={published}
                onChange={(e) => setPublished(e.target.checked)}
                className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500 mr-2"
              />
              <span>Published</span>
            </label>
            
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={featured}
                onChange={(e) => setFeatured(e.target.checked)}
                className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500 mr-2"
              />
              <span>Featured</span>
            </label>
          </div>
        </div>
      </div>
      
      {/* Tags */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Tags
        </label>
        <div className="flex flex-wrap gap-2">
          {BLOG_TAGS.map((tag) => (
            <button
              key={tag.value}
              type="button"
              onClick={() => handleTagToggle(tag.value)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                selectedTags.includes(tag.value)
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {tag.label}
            </button>
          ))}
        </div>
      </div>
      
      {/* Feature Image */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Feature Image
        </label>
        <div className="flex items-center space-x-4">
          {(featureImagePreview || featureImage) && (
            <div className="relative w-24 h-24 rounded-md overflow-hidden border border-gray-200">
              <Image
                src={featureImagePreview || featureImage}
                alt="Feature image preview"
                fill
                className="object-cover"
              />
              <button
                type="button"
                onClick={() => {
                  setFeatureImagePreview(null);
                  setFeatureImageFile(null);
                  setFeatureImage('');
                }}
                className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          )}
          
          <label className="cursor-pointer flex items-center space-x-2 px-4 py-2 border border-gray-300 bg-white rounded-md hover:bg-gray-50">
            <ImageIcon className="h-5 w-5 text-gray-500" />
            <span className="text-sm text-gray-700">Upload image</span>
            <input
              type="file"
              accept="image/*"
              onChange={handleFeatureImageChange}
              className="hidden"
            />
          </label>
        </div>
      </div>
      
      {/* Author Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="author" className="block text-sm font-medium text-gray-700 mb-1">
            Author Name
          </label>
          <input
            id="author"
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            placeholder="John Doe"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Author Image
          </label>
          <div className="flex items-center space-x-4">
            {(authorImagePreview || authorImage) && (
              <div className="relative w-12 h-12 rounded-full overflow-hidden border border-gray-200">
                <Image
                  src={authorImagePreview || authorImage}
                  alt="Author image preview"
                  fill
                  className="object-cover"
                />
                <button
                  type="button"
                  onClick={() => {
                    setAuthorImagePreview(null);
                    setAuthorImageFile(null);
                    setAuthorImage('');
                  }}
                  className="absolute top-0 right-0 bg-red-600 text-white rounded-full p-1"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            )}
            
            <label className="cursor-pointer flex items-center space-x-2 px-4 py-2 border border-gray-300 bg-white rounded-md hover:bg-gray-50">
              <ImageIcon className="h-5 w-5 text-gray-500" />
              <span className="text-sm text-gray-700">Upload author photo</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleAuthorImageChange}
                className="hidden"
              />
            </label>
          </div>
        </div>
      </div>
      
      {/* Form Actions */}
      <div className="flex items-center justify-end space-x-4 border-t pt-6">
        <button
          type="button"
          onClick={() => router.push('/admin/blogs')}
          className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50"
          disabled={loading}
        >
          Cancel
        </button>
        
        <button
          type="submit"
          className="px-6 py-2 bg-blue-600 rounded-lg text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={loading}
        >
          {loading ? (
            <span className="flex items-center">
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Saving...
            </span>
          ) : (
            `${isEdit ? 'Update' : 'Create'} Blog Post`
          )}
        </button>
      </div>
    </form>
  );
} 