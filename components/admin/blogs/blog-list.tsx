"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Edit, Trash2, FileText, Eye, Clock, Star } from 'lucide-react';
import { Blog } from '@/lib/types';
import { formatDate } from '@/lib/utils';
import DeleteModal from '@/components/admin/delete-modal';

interface BlogListProps {
  blogs: Blog[];
  onDelete?: (id: string) => void;
}

export default function BlogList({ blogs, onDelete }: BlogListProps) {
  const [expandedBlogId, setExpandedBlogId] = useState<string | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [blogToDelete, setBlogToDelete] = useState<Blog | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedBlogId(expandedBlogId === id ? null : id);
  };

  const handleDeleteClick = (e: React.MouseEvent, blog: Blog) => {
    e.stopPropagation();
    setBlogToDelete(blog);
    setDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (blogToDelete && onDelete) {
      onDelete(blogToDelete.id);
      setDeleteModalOpen(false);
      setBlogToDelete(null);
    }
  };

  if (!blogs || blogs.length === 0) {
    return (
      <div className="bg-white rounded-xl p-10 text-center shadow-sm border border-gray-200">
        <FileText className="w-12 h-12 mx-auto text-blue-200 mb-4" />
        <h3 className="text-xl font-medium text-gray-600 mb-1">No Blog Posts Found</h3>
        <p className="text-gray-500 mb-6">There are no blog posts available matching your criteria.</p>
        <Link 
          href="/admin/blogs/new" 
          className="inline-flex items-center justify-center px-5 py-2 bg-blue-600 text-white rounded-lg font-medium shadow-sm hover:bg-blue-700 transition-colors"
        >
          Create Your First Blog Post
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
                Blog Post
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Author
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Published
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
            {blogs.map((blog) => (
              <React.Fragment key={blog.id}>
                <tr className="hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => toggleExpand(blog.id)}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0 bg-gray-100 rounded overflow-hidden">
                        {blog.feature_image ? (
                          <Image
                            src={blog.feature_image}
                            alt={blog.title}
                            width={40}
                            height={40}
                            className="h-10 w-10 object-cover"
                          />
                        ) : (
                          <FileText className="h-6 w-6 m-2 text-gray-400" />
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{blog.title}</div>
                        <div className="text-sm text-gray-500">
                          {blog.published_at ? formatDate(blog.published_at) : 'Draft'}
                        </div>
                      </div>
                      {blog.featured && (
                        <Star className="h-4 w-4 ml-2 text-amber-400" fill="currentColor" />
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{blog.author || 'Anonymous'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {blog.category ? (
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        {blog.category}
                      </span>
                    ) : (
                      <span className="text-gray-500 text-sm">Uncategorised</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      blog.published ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {blog.published ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-3 text-sm text-gray-500">
                      <span className="flex items-center">
                        <Eye className="h-4 w-4 mr-1" />
                        {blog.views || 0}
                      </span>
                      {blog.read_time && (
                        <span className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          {blog.read_time} min
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <Link
                        href={`/blogs/${blog.slug}`}
                        className="text-gray-400 hover:text-gray-500"
                        onClick={(e) => e.stopPropagation()}
                        target="_blank"
                      >
                        <Eye className="h-5 w-5" />
                      </Link>
                      <Link
                        href={`/admin/blogs/${blog.id}/edit`}
                        className="text-blue-600 hover:text-blue-900"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Edit className="h-5 w-5" />
                      </Link>
                      {onDelete && (
                        <button
                          onClick={(e) => handleDeleteClick(e, blog)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
                {expandedBlogId === blog.id && (
                  <tr className="bg-gray-50">
                    <td colSpan={6} className="px-6 py-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="text-sm font-medium text-gray-700 mb-2">Summary</h4>
                          <p className="text-sm text-gray-600">
                            {blog.summary || 'No summary available.'}
                          </p>
                          
                          {blog.tags && blog.tags.length > 0 && (
                            <div className="mt-3">
                              <h4 className="text-sm font-medium text-gray-700 mb-1">Tags</h4>
                              <div className="flex flex-wrap gap-1">
                                {blog.tags.map(tag => (
                                  <span key={tag} className="px-2 py-0.5 text-xs rounded bg-gray-200 text-gray-800">
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                        
                        <div>
                          <div className="mt-0 md:mt-0">
                            <h4 className="text-sm font-medium text-gray-700 mb-2">Stats</h4>
                            <div className="grid grid-cols-2 gap-2">
                              <div className="text-sm bg-white p-2 rounded">
                                <div className="font-medium">Views</div>
                                <div className="text-gray-600">{blog.views || 0}</div>
                              </div>
                              <div className="text-sm bg-white p-2 rounded">
                                <div className="font-medium">Likes</div>
                                <div className="text-gray-600">{blog.likes || 0}</div>
                              </div>
                              <div className="text-sm bg-white p-2 rounded">
                                <div className="font-medium">Created</div>
                                <div className="text-gray-600">{formatDate(blog.created_at)}</div>
                              </div>
                              <div className="text-sm bg-white p-2 rounded">
                                <div className="font-medium">Last Updated</div>
                                <div className="text-gray-600">{formatDate(blog.updated_at)}</div>
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
          setBlogToDelete(null);
        }}
        onConfirm={confirmDelete}
        title="Delete Blog Post"
        description="Are you sure you want to delete this blog post? This action cannot be undone."
        itemName={blogToDelete?.title}
      />
    </>
  );
} 