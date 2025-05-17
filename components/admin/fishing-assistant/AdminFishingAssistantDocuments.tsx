'use client';

import React, { useEffect, useState } from 'react';
import { Upload, Trash2, FileText, Loader2, AlertCircle, Plus, X } from 'lucide-react';
import { useUserProfile } from '@/hooks/app/useUserProfile';
import { AdminFishingAssistantDocument } from '@/lib/types';
import DeleteModal from '@/components/admin/delete-modal';

export const AdminFishingAssistantDocuments: React.FC = () => {
  const [documents, setDocuments] = useState<AdminFishingAssistantDocument[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useUserProfile();

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteDocInfo, setDeleteDocInfo] = useState<{id: string, fileId: string, title: string} | null>(null);

  const fetchDocuments = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/fishing-assistant/admin/documents');
      if (!response.ok) throw new Error('Failed to fetch documents');
      const data = await response.json();
      setDocuments(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const uploadDocument = async (file: File, title: string, description?: string) => {
    setIsUploading(true);
    setError(null);
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('title', title);
      if (description) formData.append('description', description);

      const response = await fetch('/api/fishing-assistant/admin/documents', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to upload document');
      }

      fetchDocuments();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload document');
    } finally {
      setIsUploading(false);
    }
  };

  const deleteDocument = async (documentId: string, fileId: string) => {
    setError(null);
    try {
      const response = await fetch(
        `/api/fishing-assistant/admin/documents/${documentId}?fileId=${fileId}`,
        { method: 'DELETE' }
      );
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete document');
      }
      
      fetchDocuments();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete document');
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const [showUploadModal, setShowUploadModal] = useState(false);
  const [newDocTitle, setNewDocTitle] = useState('');
  const [newDocDescription, setNewDocDescription] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;
    
    await uploadDocument(selectedFile, newDocTitle, newDocDescription);
    setShowUploadModal(false);
    setNewDocTitle('');
    setNewDocDescription('');
    setSelectedFile(null);
  };

  const handleDeleteClick = (doc: AdminFishingAssistantDocument) => {
    setDeleteDocInfo({
      id: doc.id,
      fileId: doc.file_id,
      title: doc.title
    });
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!deleteDocInfo) return;
    
    try {
      await deleteDocument(deleteDocInfo.id, deleteDocInfo.fileId);
      setShowDeleteModal(false);
      setDeleteDocInfo(null);
    } catch (err) {
      setShowDeleteModal(false);
      setDeleteDocInfo(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'completed': 
        return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-900/50';
      case 'error': 
        return 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 border-red-200 dark:border-red-900/50';
      case 'processing':
      default:
        return 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-900/50';
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-48 bg-white dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-700">
        <Loader2 className="w-8 h-8 animate-spin text-primary-500 mb-2" />
        <p className="text-slate-600 dark:text-slate-300 text-sm">Loading documents...</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-slate-800 dark:text-white">Knowledge Documents</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Upload files to enhance the AI's knowledge about fishing.
          </p>
        </div>
        <button
          onClick={() => setShowUploadModal(true)}
          className="inline-flex items-center px-3 py-1.5 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-all text-sm"
          disabled={isUploading}
        >
          <Plus className="w-4 h-4 mr-1.5" />
          Upload Document
        </button>
      </div>

      {error && (
        <div className="flex items-center p-3 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-lg border border-red-100 dark:border-red-900/50 text-sm">
          <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0" />
          <div className="text-xs font-medium">{error}</div>
        </div>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl p-4 max-w-md w-full m-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Upload Knowledge Document</h3>
              <button 
                onClick={() => setShowUploadModal(false)}
                className="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-500 dark:hover:text-slate-300 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleUploadSubmit} className="space-y-3">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Title
                  </label>
                  <span className="text-xs text-red-500">*Required</span>
                </div>
                <input
                  type="text"
                  value={newDocTitle}
                  onChange={(e) => setNewDocTitle(e.target.value)}
                  className="w-full border-2 border-slate-200 dark:border-slate-600 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-300 shadow-sm dark:bg-slate-700 dark:text-white text-sm"
                  placeholder="Document title"
                  required
                />
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Description
                  </label>
                  <span className="text-xs text-slate-500 dark:text-slate-400">Optional</span>
                </div>
                <textarea
                  value={newDocDescription}
                  onChange={(e) => setNewDocDescription(e.target.value)}
                  className="w-full border-2 border-slate-200 dark:border-slate-600 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-300 shadow-sm dark:bg-slate-700 dark:text-white text-sm"
                  rows={2}
                  placeholder="Brief description of the document content"
                />
              </div>
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    File
                  </label>
                  <span className="text-xs text-red-500">*Required</span>
                </div>
                <div className="mt-1 border-2 border-dashed border-slate-200 dark:border-slate-600 rounded-lg p-3 bg-slate-50 dark:bg-slate-700/30">
                  <div className="flex justify-center">
                    <label className="cursor-pointer">
                      <div className="flex flex-col items-center">
                        <Upload className="w-6 h-6 text-primary-500 mb-1" />
                        <span className="text-xs font-medium text-slate-700 dark:text-white mb-0.5">
                          {selectedFile ? selectedFile.name : 'Select a file'}
                        </span>
                        <span className="text-xs text-slate-500 dark:text-slate-400">
                          {selectedFile 
                            ? `${(selectedFile.size / 1024 / 1024).toFixed(2)} MB` 
                            : 'Supports PDF, DOCX, TXT (max 10MB)'}
                        </span>
                      </div>
                      <input
                        type="file"
                        onChange={handleFileSelect}
                        className="hidden"
                        required
                        accept=".pdf,.docx,.txt"
                      />
                    </label>
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-3 py-1.5 rounded-lg border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-white font-medium hover:bg-slate-50 dark:hover:bg-slate-700 transition-all text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!selectedFile || !newDocTitle || isUploading}
                  className="px-3 py-1.5 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-all disabled:opacity-70 flex items-center text-sm"
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-1.5 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4 mr-1.5" />
                      Upload
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Documents List */}
      <div className="space-y-2">
        {documents.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 px-6 bg-white dark:bg-slate-800/30 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl">
            <FileText className="w-8 h-8 text-slate-300 dark:text-slate-600 mb-3" />
            <p className="text-slate-700 dark:text-slate-300 font-medium text-sm">No documents have been uploaded yet</p>
            <p className="text-slate-500 dark:text-slate-400 text-xs mt-1 max-w-md text-center">
              Upload fishing knowledge documents to help the AI provide better assistance to users.
            </p>
            <button
              onClick={() => setShowUploadModal(true)}
              className="mt-4 inline-flex items-center px-3 py-1.5 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-all text-sm"
            >
              <Plus className="w-4 h-4 mr-1.5" />
              Add Your First Document
            </button>
          </div>
        ) : (
          documents.map((doc) => (
            <div
              key={doc.id}
              className="flex items-center justify-between py-3 px-4 bg-white dark:bg-slate-800 rounded-lg border border-slate-100 dark:border-slate-700 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start gap-3">
                <div className="bg-primary-50 dark:bg-primary-900/20 p-2 rounded-lg">
                  <FileText className="w-5 h-5 text-primary-500 dark:text-primary-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-white text-sm">{doc.title}</h3>
                  {doc.description && (
                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                      {doc.description}
                    </p>
                  )}
                  <div className="mt-1.5 flex flex-wrap items-center gap-2">
                    {doc.file_type && (
                      <span className="text-xs py-0.5 px-2 bg-slate-100 dark:bg-slate-700 rounded-full text-slate-600 dark:text-slate-300 font-medium border border-slate-200 dark:border-slate-600">
                        {doc.file_type.toUpperCase()}
                      </span>
                    )}
                    {doc.processing_status && (
                      <span className={`text-xs py-0.5 px-2 rounded-full font-medium border ${getStatusColor(doc.processing_status)}`}>
                        {doc.processing_status === 'completed' 
                          ? 'Processed' 
                          : doc.processing_status === 'error' 
                          ? 'Failed' 
                          : 'Processing'
                        }
                      </span>
                    )}
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      Added {new Date(doc.created_at).toLocaleDateString('en-GB', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => handleDeleteClick(doc)}
                className="p-1.5 text-slate-400 hover:text-red-500 dark:text-slate-500 dark:hover:text-red-400 transition-colours rounded-lg hover:bg-red-50 dark:hover:bg-red-900/10"
                title="Delete document"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))
        )}
      </div>
      
      {/* Delete Confirmation Modal */}
      <DeleteModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
        title="Delete Document"
        description="Are you sure you want to delete this document? This will permanently remove the document from the AI's knowledge base."
        itemName={deleteDocInfo?.title}
        confirmText="Delete Document"
        cancelText="Cancel"
      />
    </div>
  );
}; 