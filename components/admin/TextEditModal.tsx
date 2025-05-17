"use client";

import { useState, useEffect, useRef } from 'react';
import { X, Check, Eye, Edit2, Bold, Italic, List, ListOrdered, Heading, Link, Image as ImageIcon } from 'lucide-react';

interface TextEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (content: string) => void;
  initialContent: string;
  title?: string;
}

export default function TextEditModal({
  isOpen,
  onClose,
  onSave,
  initialContent = '',
  title = 'Edit Content'
}: TextEditModalProps) {
  const [content, setContent] = useState(initialContent);
  const [isPreview, setIsPreview] = useState(false);
  const editorRef = useRef<HTMLDivElement>(null);

  // Reset content when modal is opened with new initial content
  useEffect(() => {
    if (isOpen) {
      setContent(initialContent);
      setIsPreview(false);
      
      // Set the HTML content to the editor when it's ready
      if (editorRef.current) {
        editorRef.current.innerHTML = initialContent;
      }
    }
  }, [isOpen, initialContent]);

  // Capture content from the contentEditable div before saving
  const handleSave = () => {
    // Get the HTML from the editor if we're not in preview mode
    if (!isPreview && editorRef.current) {
      setContent(editorRef.current.innerHTML);
      onSave(editorRef.current.innerHTML);
    } else {
      onSave(content);
    }
    onClose();
  };

  // If modal is not open, don't render anything
  if (!isOpen) return null;

  // Show the HTML content safely in preview mode
  const renderPreview = () => {
    return (
      <div 
        className="prose max-w-none h-full overflow-y-auto p-4 border rounded-md bg-white"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    );
  };

  // Format handlers
  const formatText = (command: string, value: string = '') => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
  };

  // Handle image insertion
  const insertImage = () => {
    const url = prompt('Enter image URL:');
    if (url) {
      document.execCommand('insertImage', false, url);
    }
  };

  // Handle link insertion
  const insertLink = () => {
    const url = prompt('Enter link URL:');
    if (url) {
      document.execCommand('createLink', false, url);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b p-4">
          <h3 className="text-lg font-medium">{title}</h3>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsPreview(!isPreview)}
              className="p-2 rounded-md hover:bg-gray-100 text-gray-700"
              title={isPreview ? "Edit mode" : "Preview mode"}
            >
              {isPreview ? <Edit2 className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-md hover:bg-gray-100 text-gray-700"
              title="Close"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Formatting toolbar */}
        {!isPreview && (
          <div className="border-b px-4 py-2 flex flex-wrap gap-1">
            <button
              type="button"
              onClick={() => formatText('bold')}
              className="p-2 rounded hover:bg-gray-100"
              title="Bold"
            >
              <Bold className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => formatText('italic')}
              className="p-2 rounded hover:bg-gray-100"
              title="Italic"
            >
              <Italic className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => formatText('insertUnorderedList')}
              className="p-2 rounded hover:bg-gray-100"
              title="Bullet List"
            >
              <List className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => formatText('insertOrderedList')}
              className="p-2 rounded hover:bg-gray-100"
              title="Numbered List"
            >
              <ListOrdered className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => formatText('formatBlock', '<h3>')}
              className="p-2 rounded hover:bg-gray-100"
              title="Heading"
            >
              <Heading className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={insertLink}
              className="p-2 rounded hover:bg-gray-100"
              title="Insert Link"
            >
              <Link className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={insertImage}
              className="p-2 rounded hover:bg-gray-100"
              title="Insert Image"
            >
              <ImageIcon className="h-5 w-5" />
            </button>
          </div>
        )}

        {/* Content area */}
        <div className="flex-1 overflow-hidden p-4">
          {isPreview ? (
            renderPreview()
          ) : (
            <div
              ref={editorRef}
              contentEditable
              className="prose prose-sm max-w-none h-full overflow-y-auto p-4 border rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              dangerouslySetInnerHTML={{ __html: content }}
            />
          )}
        </div>

        {/* Footer with actions */}
        <div className="flex justify-end gap-3 border-t p-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2"
          >
            <Check className="h-4 w-4" />
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
} 