"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Edit, Trash2, Video as VideoIcon, Eye, Clock, Star, Youtube } from 'lucide-react';
import { Video } from '@/lib/types';
import { formatDate } from '@/lib/utils';
import DeleteModal from '@/components/admin/delete-modal';

interface VideoListProps {
  videos: Video[];
  onDelete?: (id: string) => void;
  onPreview?: (video: Video) => void;
}

export default function VideoList({ videos, onDelete, onPreview }: VideoListProps) {
  const [expandedVideoId, setExpandedVideoId] = useState<string | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [videoToDelete, setVideoToDelete] = useState<Video | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedVideoId(expandedVideoId === id ? null : id);
  };

  const handleDeleteClick = (e: React.MouseEvent, video: Video) => {
    e.stopPropagation();
    setVideoToDelete(video);
    setDeleteModalOpen(true);
  };
  
  const handlePreviewClick = (e: React.MouseEvent, video: Video) => {
    e.stopPropagation();
    if (onPreview) {
      onPreview(video);
    }
  };

  const confirmDelete = () => {
    if (videoToDelete && onDelete) {
      onDelete(videoToDelete.id);
      setDeleteModalOpen(false);
      setVideoToDelete(null);
    }
  };

  if (!videos || videos.length === 0) {
    return (
      <div className="bg-white rounded-xl p-10 text-center shadow-sm border border-gray-200">
        <VideoIcon className="w-12 h-12 mx-auto text-blue-200 mb-4" />
        <h3 className="text-xl font-medium text-gray-600 mb-1">No Videos Found</h3>
        <p className="text-gray-500 mb-6">There are no videos available matching your criteria.</p>
        <Link 
          href="/admin/videos/new" 
          className="inline-flex items-center justify-center px-5 py-2 bg-blue-600 text-white rounded-lg font-medium shadow-sm hover:bg-blue-700 transition-colors"
        >
          Add Your First Video
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="overflow-hidden bg-white rounded-xl shadow-sm border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Video
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Channel
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Stats
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {videos.map((video) => (
              <React.Fragment key={video.id}>
                <tr className="hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => toggleExpand(video.id)}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-16 w-24 flex-shrink-0 bg-gray-100 rounded overflow-hidden">
                        {video.thumbnail ? (
                          <Image
                            src={video.thumbnail}
                            alt={video.title}
                            width={96}
                            height={54}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <VideoIcon className="h-6 w-6 m-2 text-gray-400" />
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 line-clamp-2 max-w-xs">{video.title}</div>
                        <div className="text-sm text-gray-500">
                          {video.display_date || formatDate(video.created_at)}
                        </div>
                      </div>
                      {video.featured && (
                        <Star className="h-4 w-4 ml-2 text-amber-400" fill="currentColor" />
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{video.channel}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {video.category ? (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        {video.category}
                      </span>
                    ) : (
                      <span className="text-gray-500 text-sm">Uncategorised</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      video.published ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {video.published ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-3 text-sm text-gray-500">
                      <span className="flex items-center">
                        <Eye className="h-4 w-4 mr-1" />
                        {video.views || video.view_count || 0}
                      </span>
                      {video.duration && (
                        <span className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          {video.duration}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      {onPreview ? (
                        <button
                          onClick={(e) => handlePreviewClick(e, video)}
                          className="text-gray-400 hover:text-gray-500"
                          title="Preview video"
                        >
                          <Eye className="h-5 w-5" />
                        </button>
                      ) : (
                        <a
                          href={`https://www.youtube.com/watch?v=${video.embed_id}`}
                          className="text-gray-400 hover:text-gray-500"
                          onClick={(e) => e.stopPropagation()}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="Watch on YouTube"
                        >
                          <Eye className="h-5 w-5" />
                        </a>
                      )}
                      <Link
                        href={`/admin/videos/${video.id}/edit`}
                        className="text-blue-600 hover:text-blue-900"
                        onClick={(e) => e.stopPropagation()}
                        title="Edit video"
                      >
                        <Edit className="h-5 w-5" />
                      </Link>
                      {onDelete && (
                        <button
                          onClick={(e) => handleDeleteClick(e, video)}
                          className="text-red-600 hover:text-red-900"
                          title="Delete video"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
                {expandedVideoId === video.id && (
                  <tr className="bg-gray-50">
                    <td colSpan={6} className="px-6 py-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="text-sm font-medium text-gray-700 mb-2">Description</h4>
                          <p className="text-sm text-gray-600">
                            {video.description || 'No description available.'}
                          </p>
                          
                          {video.tags && video.tags.length > 0 && (
                            <div className="mt-3">
                              <h4 className="text-sm font-medium text-gray-700 mb-1">Tags</h4>
                              <div className="flex flex-wrap gap-1">
                                {video.tags.map(tag => (
                                  <span key={tag} className="px-2 py-0.5 text-xs rounded bg-gray-200 text-gray-800">
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                          
                          <div className="mt-3">
                            <h4 className="text-sm font-medium text-gray-700 mb-1">YouTube Embed</h4>
                            <div className="flex items-center">
                              <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                                {video.embed_id}
                              </code>
                              <a
                                href={`https://www.youtube.com/watch?v=${video.embed_id}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="ml-2 text-blue-600 hover:text-blue-800"
                              >
                                <Youtube className="h-4 w-4" />
                              </a>
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <div className="mt-0 md:mt-0">
                            <h4 className="text-sm font-medium text-gray-700 mb-2">Stats & Info</h4>
                            <div className="grid grid-cols-2 gap-2">
                              <div className="text-sm bg-white p-2 rounded">
                                <div className="font-medium">Views</div>
                                <div className="text-gray-600">{video.views || video.view_count || 0}</div>
                              </div>
                              <div className="text-sm bg-white p-2 rounded">
                                <div className="font-medium">Duration</div>
                                <div className="text-gray-600">{video.duration || 'Unknown'}</div>
                              </div>
                              <div className="text-sm bg-white p-2 rounded">
                                <div className="font-medium">Added</div>
                                <div className="text-gray-600">{formatDate(video.created_at)}</div>
                              </div>
                              <div className="text-sm bg-white p-2 rounded">
                                <div className="font-medium">Last Updated</div>
                                <div className="text-gray-600">{formatDate(video.updated_at)}</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      {/* Delete confirmation modal */}
      <DeleteModal 
        isOpen={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setVideoToDelete(null);
        }}
        onConfirm={confirmDelete}
        title="Delete Video"
        description="Are you sure you want to delete this video? This action cannot be undone."
        itemName={videoToDelete?.title}
      />
    </>
  );
} 