'use client';

import React, { useState, useEffect } from 'react';
import { Fish, MessageCircle, HelpCircle } from 'lucide-react';
import { FishingAssistantModal } from './FishingAssistantModal';

// Different message prompts to cycle through
const FISHING_PROMPTS = [
  {
    title: "Need fishing advice?",
    message: "Ask about spots, techniques, or gear recommendations."
  },
  {
    title: "Planning your next session?",
    message: "I can help with bait selection and rig setups."
  },
  {
    title: "Struggling to catch carp?",
    message: "Ask me for tips on venues, seasons, and methods."
  },
  {
    title: "Looking for tackle advice?",
    message: "I can suggest the best gear for your fishing style."
  },
  {
    title: "Want to improve your PB?",
    message: "Let me share strategies for targeting bigger fish."
  }
];

export function FloatingFishingAssistant() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [currentPrompt, setCurrentPrompt] = useState(0);

  // Reset the dismissed state every 10 seconds (10000ms) to show the message again
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isModalOpen) {
        setDismissed(false);
        // Cycle to next prompt
        setCurrentPrompt(prev => (prev + 1) % FISHING_PROMPTS.length);
        setShowMessage(true);
        
        // Hide the message after 5 seconds if not interacted with
        setTimeout(() => {
          setShowMessage(false);
        }, 5000);
      }
    }, 30000); // 30 seconds

    // Show message initially after a short delay
    const initialTimeout = setTimeout(() => {
      setShowMessage(true);
      
      // Hide initial message after 5 seconds if not interacted with
      setTimeout(() => {
        setShowMessage(false);
      }, 5000);
    }, 3000); // 3 seconds after page load

    return () => {
      clearInterval(interval);
      clearTimeout(initialTimeout);
    };
  }, [isModalOpen]);

  const handleOpenModal = () => {
    setShowMessage(false);
    setDismissed(true);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleDismissMessage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowMessage(false);
    setDismissed(true);
  };

  const { title, message } = FISHING_PROMPTS[currentPrompt];

  return (
    <>
      <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end">
        {/* Message bubble */}
        {showMessage && !dismissed && (
          <div className="relative mb-4 max-w-xs animate-fade-in">
            <div className="bg-white rounded-2xl shadow-lg p-4 pr-6">
              <button 
                onClick={handleDismissMessage}
                className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
                aria-label="Dismiss message"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
              <div className="flex items-start">
                <Fish className="h-5 w-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-gray-900">{title}</p>
                  <p className="text-xs text-gray-600 mt-1">{message}</p>
                  <button 
                    onClick={handleOpenModal}
                    className="mt-2 text-xs font-medium text-blue-600 hover:text-blue-800"
                  >
                    Chat with our AI assistant →
                  </button>
                </div>
              </div>
            </div>
            
            {/* Speech bubble pointer */}
            <div className="absolute -bottom-2 right-7 h-4 w-4 bg-white transform rotate-45 shadow-bubble"></div>
          </div>
        )}
        
        {/* Main floating button with pulse animation */}
        <button
          onClick={handleOpenModal}
          className={`bg-blue-700 hover:bg-blue-800 text-white rounded-full w-14 h-14 md:w-16 md:h-16 flex items-center justify-center shadow-lg transition-colors ${showMessage ? 'animate-subtle-pulse' : ''}`}
          aria-label="Chat with fishing assistant"
        >
          <Fish className="h-7 w-7" />
        </button>
      </div>
      
      <FishingAssistantModal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
      />
      
      {/* Add animations and custom styling */}
      <style jsx global>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fade-in {
          animation: fade-in 0.3s ease-out forwards;
        }
        
        @keyframes subtle-pulse {
          0% { transform: scale(1); box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05); }
          50% { transform: scale(1.05); box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04); }
          100% { transform: scale(1); box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05); }
        }
        
        .animate-subtle-pulse {
          animation: subtle-pulse 2s ease-in-out infinite;
        }
        
        .shadow-bubble {
          box-shadow: 2px 2px 5px -2px rgba(0,0,0,0.1);
        }
      `}</style>
    </>
  );
} 