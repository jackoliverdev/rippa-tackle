"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Video, VideoCategory, VideoChannel } from '@/lib/types';
import { createVideo, updateVideo } from '@/lib/video-service';
import { X, Image as ImageIcon, Loader2, Check, Youtube } from 'lucide-react';
import Image from 'next/image';

// Available video categories
const VIDEO_CATEGORIES: { value: string; label: string }[] = [
  { value: 'Fishing Sessions', label: 'Fishing Sessions' },
  { value: 'Tutorials', label: 'Tutorials' },
  { value: 'Reviews', label: 'Reviews' },
  { value: 'Adventure', label: 'Adventure' },
  { value: 'Tips and Tactics', label: 'Tips and Tactics' },
  { value: 'Product Reviews', label: 'Product Reviews' },
];

// Available video channels
const VIDEO_CHANNELS: { value: string; label: string }[] = [
  { value: 'Jacob London Carper', label: 'Jacob London Carper' },
  { value: 'Henry Lennon', label: 'Henry Lennon' },
  { value: 'Other', label: 'Other' },
];

// Common tags for fishing videos
const VIDEO_TAGS: { value: string; label: string }[] = [
  { value: 'carp', label: 'Carp' },
  { value: 'lake', label: 'Lake' },
  { value: 'river', label: 'River' },
  { value: 'summer', label: 'Summer' },
  { value: 'winter', label: 'Winter' },
  { value: 'spring', label: 'Spring' },
  { value: 'autumn', label: 'Autumn' },
  { value: 'bait', label: 'Bait' },
  { value: 'rigs', label: 'Rigs' },
  { value: 'tackle', label: 'Tackle' },
  { value: 'tips', label: 'Tips' },
  { value: 'tutorial', label: 'Tutorial' },
  { value: 'adventure', label: 'Adventure' },
  { value: 'review', label: 'Review' },
];

interface VideoFormProps {
  video?: Video;
  isEdit?: boolean;
}

export default function VideoForm({ video, isEdit = false }: VideoFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  // Form state
  const [title, setTitle] = useState('');
  const [embedId, setEmbedId] = useState('');
  const [thumbnail, setThumbnail] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<string>('');
  const [channel, setChannel] = useState<string>('Jacob London Carper');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [views, setViews] = useState('');
  const [duration, setDuration] = useState('');
  const [displayDate, setDisplayDate] = useState('');
  const [displayOrder, setDisplayOrder] = useState<number | ''>('');
  const [published, setPublished] = useState(true);
  const [featured, setFeatured] = useState(false);
  
  // Preview
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  
  // Load video data if editing
  useEffect(() => {
    if (isEdit && video) {
      setTitle(video.title || '');
      setEmbedId(video.embed_id || '');
      setThumbnail(video.thumbnail || '');
      setDescription(video.description || '');
      setCategory(video.category || '');
      setChannel(video.channel || 'Jacob London Carper');
      setSelectedTags(video.tags || []);
      setViews(video.views || '');
      setDuration(video.duration || '');
      setDisplayDate(video.display_date || '');
      setDisplayOrder(video.display_order || '');
      setPublished(video.published || false);
      setFeatured(video.featured || false);
      
      // Set preview
      if (video.thumbnail) {
        setThumbnailPreview(video.thumbnail);
      }
    }
  }, [isEdit, video]);
  
  // Handle YouTube video ID extraction
  const handleEmbedIdChange = (value: string) => {
    let videoId = value;
    
    // Extract ID from YouTube URL if pasted
    if (value.includes('youtube.com') || value.includes('youtu.be')) {
      // Match for youtu.be/ID format
      const shortMatch = value.match(/youtu\.be\/([^?&]+)/);
      if (shortMatch && shortMatch[1]) {
        videoId = shortMatch[1];
      } else {
        // Match for youtube.com/watch?v=ID format
        const match = value.match(/[?&]v=([^?&]+)/);
        if (match && match[1]) {
          videoId = match[1];
        }
      }
    }
    
    setEmbedId(videoId);
    
    // Auto-set thumbnail if we have a valid embed ID
    if (videoId && videoId.length > 5) {
      const thumbnailUrl = `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`;
      setThumbnail(thumbnailUrl);
      setThumbnailPreview(thumbnailUrl);
    }
  };
  
  // Handle tag selection
  const handleTagToggle = (tag: string) => {
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
      if (!embedId) throw new Error('YouTube Embed ID is required');
      if (!thumbnail) throw new Error('Thumbnail URL is required');
      if (!channel) throw new Error('Channel is required');
      
      // Prepare video data
      const videoData: Partial<Video> = {
        title,
        embed_id: embedId,
        thumbnail,
        description,
        category,
        channel,
        tags: selectedTags,
        views,
        duration,
        display_date: displayDate,
        display_order: displayOrder !== '' ? Number(displayOrder) : undefined,
        published,
        featured,
      };
      
      // Create new video or update existing one
      let result;
      if (isEdit && video) {
        result = await updateVideo(video.id, videoData);
      } else {
        result = await createVideo(videoData);
      }
      
      if (!result) {
        throw new Error(`Failed to ${isEdit ? 'update' : 'create'} video`);
      }
      
      setSuccess(true);
      
      // Redirect after successful save (with a small delay)
      setTimeout(() => {
        router.push('/admin/videos');
      }, 1500);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(errorMessage);
      console.error('Error saving video:', err);
    } finally {
      setLoading(false);
    }
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
            <span>{error || (success ? `Video ${isEdit ? 'updated' : 'created'} successfully!` : 'Saving...')}</span>
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
      
      {/* Title */}
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
          Video Title <span className="text-red-500">*</span>
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          placeholder="Enter video title"
          required
        />
      </div>
      
      {/* YouTube Embed ID */}
      <div>
        <label htmlFor="embed_id" className="block text-sm font-medium text-gray-700 mb-1">
          YouTube Video ID or URL <span className="text-red-500">*</span>
          <span className="ml-2 text-xs text-gray-500 font-normal">
            (e.g., https://www.youtube.com/watch?v=dQw4w9WgXcQ or dQw4w9WgXcQ)
          </span>
        </label>
        <div className="flex">
          <input
            id="embed_id"
            type="text"
            value={embedId}
            onChange={(e) => handleEmbedIdChange(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-l-lg focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter YouTube video ID or URL"
            required
          />
          {embedId && (
            <a
              href={`https://www.youtube.com/watch?v=${embedId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-r-lg flex items-center"
            >
              <Youtube className="h-5 w-5" />
            </a>
          )}
        </div>
      </div>
      
      {/* Thumbnail Preview */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Thumbnail <span className="text-red-500">*</span>
        </label>
        <div className="flex items-center space-x-4">
          {thumbnailPreview && (
            <div className="relative w-40 h-24 rounded-md overflow-hidden border border-gray-200">
              <Image
                src={thumbnailPreview}
                alt="Thumbnail preview"
                fill
                className="object-cover"
              />
            </div>
          )}
          
          <div className="flex-1">
            <input
              id="thumbnail"
              type="text"
              value={thumbnail}
              onChange={(e) => {
                setThumbnail(e.target.value);
                setThumbnailPreview(e.target.value || null);
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              placeholder="Thumbnail URL (auto-filled from YouTube)"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              The thumbnail URL is automatically filled based on the YouTube video ID.
            </p>
          </div>
        </div>
      </div>
      
      {/* Description */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          placeholder="Enter a brief description of the video"
        />
      </div>
      
      {/* Channel and Category */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="channel" className="block text-sm font-medium text-gray-700 mb-1">
            Channel <span className="text-red-500">*</span>
          </label>
          <select
            id="channel"
            value={channel}
            onChange={(e) => setChannel(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            required
          >
            {VIDEO_CHANNELS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
            Category
          </label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select a category</option>
            {VIDEO_CATEGORIES.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      {/* Views, Duration, Display Date */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div>
          <label htmlFor="views" className="block text-sm font-medium text-gray-700 mb-1">
            Views
            <span className="ml-2 text-xs text-gray-500 font-normal">
              (e.g., 10K, 1.5M)
            </span>
          </label>
          <input
            id="views"
            type="text"
            value={views}
            onChange={(e) => setViews(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            placeholder="e.g., 10K"
          />
        </div>
        
        <div>
          <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-1">
            Duration
            <span className="ml-2 text-xs text-gray-500 font-normal">
              (e.g., 12:34)
            </span>
          </label>
          <input
            id="duration"
            type="text"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            placeholder="e.g., 12:34"
          />
        </div>
        
        <div>
          <label htmlFor="display_date" className="block text-sm font-medium text-gray-700 mb-1">
            Display Date
            <span className="ml-2 text-xs text-gray-500 font-normal">
              (e.g., 2 weeks ago)
            </span>
          </label>
          <input
            id="display_date"
            type="text"
            value={displayDate}
            onChange={(e) => setDisplayDate(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            placeholder="e.g., 2 weeks ago"
          />
        </div>
      </div>
      
      {/* Display Order and Publication Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="display_order" className="block text-sm font-medium text-gray-700 mb-1">
            Display Order
            <span className="ml-2 text-xs text-gray-500 font-normal">
              (Lower numbers appear first)
            </span>
          </label>
          <input
            id="display_order"
            type="number"
            min="1"
            value={displayOrder}
            onChange={(e) => setDisplayOrder(e.target.value === '' ? '' : Number(e.target.value))}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            placeholder="e.g., 10"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
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
          {VIDEO_TAGS.map((tag) => (
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
      
      {/* Form Actions */}
      <div className="flex items-center justify-end space-x-4 border-t pt-6">
        <button
          type="button"
          onClick={() => router.push('/admin/videos')}
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
            `${isEdit ? 'Update' : 'Create'} Video`
          )}
        </button>
      </div>
    </form>
  );
} 