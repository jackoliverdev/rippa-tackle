'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface VideoPlayerModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoId: string;
  title: string;
}

export const VideoPlayerModal = ({ isOpen, onClose, videoId, title }: VideoPlayerModalProps) => {
  // Handle escape key press
  useEffect(() => {
    const handleEscapeKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscapeKey);
    
    // Disable body scroll when modal is open
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/90 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal content */}
      <div className="relative z-10 w-full max-w-5xl mx-auto">
        {/* Close button */}
        <button 
          onClick={onClose}
          className="absolute -top-12 right-0 text-white hover:text-blue-300 transition-colors"
          aria-label="Close video"
        >
          <X className="h-8 w-8" />
        </button>
        
        {/* Video title */}
        <h2 className="text-white font-medium text-lg md:text-xl mb-4 line-clamp-1">{title}</h2>
        
        {/* Video player */}
        <div className="relative aspect-video w-full bg-black rounded-xl overflow-hidden shadow-2xl">
          <iframe
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 w-full h-full"
            title={title}
          />
        </div>
      </div>
    </div>
  );
}; 