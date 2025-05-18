'use client';

import React, { useRef, useEffect } from 'react';
import { X, Fish } from 'lucide-react';
import { FishingAssistantModalChat } from './FishingAssistantModalChat';

interface FishingAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function FishingAssistantModal({ isOpen, onClose }: FishingAssistantModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  // Handle keyboard events (Escape to close)
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    
    // Prevent background scrolling when modal is open
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 md:p-6 overflow-y-auto">
      <div 
        ref={modalRef}
        className="bg-white rounded-xl shadow-xl w-full max-w-3xl h-[80vh] max-h-[800px] overflow-hidden flex flex-col"
      >
        <div className="p-4 border-b flex justify-between items-center bg-blue-700 text-white">
          <h2 className="text-lg font-bold flex items-center">
            <Fish className="h-5 w-5 mr-2" />
            Rippa Tackle Fishing AI Assistant
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-blue-600 transition-colors"
            aria-label="Close"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        
        <div className="flex-1 overflow-hidden">
          <FishingAssistantModalChat />
        </div>
      </div>
    </div>
  );
} 