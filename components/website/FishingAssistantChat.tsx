'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Bot, Loader2, Zap, LightbulbIcon, InfoIcon, X } from 'lucide-react';
import { useUserProfile } from '@/hooks/app/useUserProfile';
import ReactMarkdown from 'react-markdown';
import rehypeSanitize from 'rehype-sanitize';
import remarkGfm from 'remark-gfm';

interface Message {
  id?: string;
  role: 'user' | 'assistant';
  content: string;
  isStreaming?: boolean;
}

// Custom styles for the markdown content
const markdownStyles = {
  p: 'mb-2',
  h1: 'text-lg font-bold text-blue-700 mt-3 mb-1.5',
  h2: 'text-base font-bold text-blue-700 mt-2.5 mb-1.5',
  h3: 'text-sm font-bold text-blue-700 mt-2 mb-1',
  ul: 'list-disc ml-4 my-2',
  ol: 'list-decimal ml-4 my-2',
  li: 'mb-1',
  a: 'text-blue-600 hover:underline',
  blockquote: 'border-l-4 border-slate-300 pl-3 italic my-2 text-slate-600',
  table: 'min-w-full border-collapse my-2',
  th: 'bg-slate-100 border border-slate-300 px-2.5 py-1.5 text-left',
  td: 'border border-slate-300 px-2.5 py-1.5',
  code: 'bg-slate-100 px-1 py-0.5 rounded text-sm',
};

export const FishingAssistantChat: React.FC = () => {
  const [showMobileTip, setShowMobileTip] = useState(false);

  return (
    <section className="py-8 pb-20 bg-slate-100">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <div className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-700 mb-4">
            <Zap className="mr-1 h-4 w-4" />
            <span>Powered by AI</span>
          </div>
          <h2 className="text-3xl font-bold text-slate-800 mb-3">Talk to Our Fishing Expert</h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Get personalised fishing advice, location recommendations, and gear suggestions from our AI fishing assistant.
          </p>
        </div>
        
        <div className="relative">
          {/* Pro Tip Speech Bubble - Only visible on larger screens */}
          <div className="hidden md:block absolute right-8 -top-32 z-10 max-w-[320px] bg-blue-800 text-white p-5 rounded-lg shadow-lg transform rotate-2 border-2 border-blue-700">
            <div className="absolute -bottom-4 right-10 w-8 h-8 bg-blue-800 border-r-2 border-b-2 border-blue-700 transform rotate-45"></div>
            <div className="flex items-start">
              <LightbulbIcon className="h-6 w-6 text-yellow-300 mr-3 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-bold text-base mb-2">ANGLER'S TIP</p>
                <p className="text-sm text-blue-100 leading-relaxed">Try asking about the best rigs for your local lake, seasonal bait recommendations, or tips for larger carp!</p>
              </div>
            </div>
          </div>
          
          {/* Mobile Tip Modal - Only appears when toggled */}
          {showMobileTip && (
            <div className="md:hidden fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowMobileTip(false)}>
              <div className="bg-blue-800 text-white p-5 rounded-lg shadow-lg border-2 border-blue-700 max-w-xs relative" onClick={(e) => e.stopPropagation()}>
                <button 
                  className="absolute top-2 right-2 text-white hover:text-blue-200" 
                  onClick={() => setShowMobileTip(false)}
                >
                  <X className="h-5 w-5" />
                </button>
                <div className="flex items-start pt-2">
                  <LightbulbIcon className="h-6 w-6 text-yellow-300 mr-3 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-bold text-base mb-2">ANGLER'S TIP</p>
                    <p className="text-sm text-blue-100 leading-relaxed">Try asking about the best rigs for your local lake, seasonal bait recommendations, or tips for larger carp!</p>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <ChatInterface showMobileTip={showMobileTip} setShowMobileTip={setShowMobileTip} />
        </div>
      </div>
    </section>
  );
};

// The actual chat interface component
const ChatInterface: React.FC<{
  showMobileTip: boolean;
  setShowMobileTip: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ showMobileTip, setShowMobileTip }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const latestMessageRef = useRef<HTMLDivElement>(null);
  const { user } = useUserProfile();
  const [initializing, setInitializing] = useState(true);

  // Only scroll if AI message is out of view
  const ensureAIMessageVisible = () => {
    if (chatContainerRef.current && latestMessageRef.current) {
      const container = chatContainerRef.current;
      const latestMessage = latestMessageRef.current;
      
      // Get positions
      const containerRect = container.getBoundingClientRect();
      const messageRect = latestMessage.getBoundingClientRect();
      
      // Check if message is below or near the visible area
      if (messageRect.bottom > containerRect.bottom - 20) {
        // Custom scroll calculation - position the message about 1/3 from the bottom
        // This places it lower in the visible area rather than at the very top
        const messageHeight = messageRect.height;
        const containerHeight = containerRect.height;
        const scrollTop = latestMessage.offsetTop - (containerHeight * 0.7) + messageHeight;
        
        // Apply the custom scroll position
        container.scrollTo({
          top: Math.max(0, scrollTop),
          behavior: 'smooth'
        });
      }
    }
  };

  // Fetch initial greeting from settings or use default
  useEffect(() => {
    const fetchInitialMessage = async () => {
      try {
        const response = await fetch('/api/fishing-assistant/admin/settings');
        if (response.ok) {
          const settings = await response.json();
          const initialGreeting = settings.initial_question || 
            "👋 Hello! I'm the Rippa Tackle fishing assistant. I can help with fishing advice, locations, gear, and techniques. What would you like to know about fishing today?";
            
          setMessages([{
            role: 'assistant',
            content: initialGreeting
          }]);
        } else {
          // If unable to fetch settings, use the default message
          setMessages([{
            role: 'assistant',
            content: "👋 Hello! I'm the Rippa Tackle fishing assistant. I can help with fishing advice, locations, gear, and techniques. What would you like to know about fishing today?"
          }]);
        }
      } catch (error) {
        // Use default message on error
        setMessages([{
          role: 'assistant',
          content: "👋 Hello! I'm the Rippa Tackle fishing assistant. I can help with fishing advice, locations, gear, and techniques. What would you like to know about fishing today?"
        }]);
        console.error('Error fetching initial message:', error);
      } finally {
        setInitializing(false);
      }
    };

    fetchInitialMessage();
  }, []);

  // Check if we need to scroll to show AI message when content updates
  useEffect(() => {
    const lastMessage = messages[messages.length - 1];
    if (lastMessage && lastMessage.role === 'assistant' && !lastMessage.isStreaming) {
      ensureAIMessageVisible();
    }
  }, [messages]);

  const initConversation = async () => {
    try {
      const response = await fetch('/api/fishing-assistant/conversations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({})
      });
      
      if (!response.ok) throw new Error('Failed to start conversation');
      const data = await response.json();
      setConversationId(data.id);
      return data.id;
    } catch (err) {
      setError('Could not start conversation. Please try again later.');
      console.error('Conversation initialization error:', err);
      return null;
    }
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    // Add user message to chat
    const userMessage = { role: 'user' as const, content: input.trim() };
    setMessages(prevMessages => [...prevMessages, userMessage]);
    setInput('');
    setIsLoading(true);
    setError(null);

    try {
      // Initialize conversation if needed
      let currentConversationId = conversationId;
      if (!currentConversationId) {
        currentConversationId = await initConversation();
        if (!currentConversationId) throw new Error('Failed to initialize conversation');
      }

      // Add an assistant message that will show "Thinking..." and be populated by the stream
      setMessages(prevMessages => [
        ...prevMessages,
        { 
          role: 'assistant', 
          content: '', 
          isStreaming: true 
        }
      ]);

      // Send message to API with streaming
      const response = await fetch('/api/fishing-assistant/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversationId: currentConversationId,
          userMessage: userMessage.content
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to get response');
      }

      // Handle the streaming response
      const reader = response.body?.getReader();
      if (!reader) throw new Error('Response stream not available');

      let receivedText = '';
      
      // Process the stream chunks
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        // Convert the chunk to text
        const chunk = new TextDecoder().decode(value);
        
        try {
          // The stream sends JSON objects as text, process each one
          const lines = chunk.split('\n').filter(line => line.trim() !== '');
          
          for (const line of lines) {
            const parsedChunk = JSON.parse(line);
            
            if (!parsedChunk.done) {
              // Add the new content to the accumulated text
              receivedText += parsedChunk.content;
              
              // Update the last message with the accumulated text
              setMessages(prevMessages => {
                const updatedMessages = [...prevMessages];
                updatedMessages[updatedMessages.length - 1].content = receivedText;
                return updatedMessages;
              });
              
              // Only check if we need to scroll when there's significant new content
              if (parsedChunk.content.includes('\n') || parsedChunk.content.length > 30) {
                setTimeout(ensureAIMessageVisible, 50);
              }
            } else {
              // Stream is complete, mark the message as no longer streaming
              setMessages(prevMessages => {
                const updatedMessages = [...prevMessages];
                updatedMessages[updatedMessages.length - 1].isStreaming = false;
                return updatedMessages;
              });
            }
          }
        } catch (err) {
          console.error('Error parsing stream chunk:', err, chunk);
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
      console.error('Chat error:', err);
      
      // Remove the "Thinking..." message if there was an error
      setMessages(prevMessages => {
        // Check if the last message is an empty assistant message (the "Thinking..." one)
        if (prevMessages.length > 0 && 
            prevMessages[prevMessages.length - 1].role === 'assistant' && 
            prevMessages[prevMessages.length - 1].isStreaming) {
          return prevMessages.slice(0, -1);
        }
        return prevMessages;
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative w-full bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
      <div className="bg-gradient-to-r from-blue-700 to-blue-600 p-3 md:p-4 relative">
        <h2 className="text-white text-lg md:text-xl font-bold flex items-center">
          <Fish className="mr-2 h-5 w-5 md:h-6 md:w-6" /> 
          <span className="hidden sm:inline">Rippa Tackle</span>
          <span className="sm:hidden">AI Fishing Assistant </span>
        </h2>
        <p className="text-blue-100 text-xs md:text-sm pr-8 mt-0.5">
          <span className="hidden sm:inline">Ask me anything about fishing locations, species, techniques or tackle!</span>
          <span className="sm:hidden">Ask about techniques, locations, bait & tackle</span>
        </p>
        
        {/* Info button - only visible on mobile */}
        <button 
          className="md:hidden absolute top-3 right-3 bg-blue-500 rounded-full p-1 shadow-md border border-blue-400"
          onClick={() => setShowMobileTip(true)}
          aria-label="Show fishing tips"
        >
          <InfoIcon className="h-5 w-5 text-white" />
        </button>
      </div>
      
      <div 
        ref={chatContainerRef}
        className="h-[350px] sm:h-[400px] overflow-y-auto p-3 md:p-4 bg-slate-50"
      >
        {messages.map((message, index) => (
          <div
            key={index}
            ref={index === messages.length - 1 ? latestMessageRef : null}
            className={`mb-4 flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-3 ${
                message.role === 'user'
                  ? 'bg-blue-500 text-white rounded-tr-none'
                  : 'bg-white border border-slate-200 rounded-tl-none'
              }`}
            >
              <div className="flex items-start mb-1">
                {message.role === 'assistant' ? (
                  <Bot className="h-5 w-5 mr-2 text-blue-500 shrink-0 mt-0.5" />
                ) : (
                  <User className="h-5 w-5 mr-2 text-white shrink-0 mt-0.5" />
                )}
                <span className={`font-medium text-sm ${message.role === 'user' ? 'text-white' : 'text-blue-500'}`}>
                  {message.role === 'user' ? 'You' : 'Fishing Assistant'}
                </span>
              </div>
              
              {/* Display content or thinking indicator */}
              <div className={`${message.role === 'assistant' ? 'text-sm leading-snug' : 'whitespace-pre-wrap'}`}>
                {message.role === 'assistant' && message.isStreaming && !message.content ? (
                  <div className="flex items-center space-x-2">
                    <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
                    <span className="text-slate-500">Thinking...</span>
                  </div>
                ) : message.role === 'assistant' ? (
                  <ReactMarkdown 
                    rehypePlugins={[rehypeSanitize]} 
                    remarkPlugins={[remarkGfm]}
                    components={{
                      p: ({node, ...props}) => <p className={markdownStyles.p} {...props} />,
                      h1: ({node, ...props}) => <h1 className={markdownStyles.h1} {...props} />,
                      h2: ({node, ...props}) => <h2 className={markdownStyles.h2} {...props} />,
                      h3: ({node, ...props}) => <h3 className={markdownStyles.h3} {...props} />,
                      ul: ({node, ...props}) => <ul className={markdownStyles.ul} {...props} />,
                      ol: ({node, ...props}) => <ol className={markdownStyles.ol} {...props} />,
                      li: ({node, ...props}) => <li className={markdownStyles.li} {...props} />,
                      a: ({node, ...props}) => <a className={markdownStyles.a} {...props} />,
                      blockquote: ({node, ...props}) => <blockquote className={markdownStyles.blockquote} {...props} />,
                      table: ({node, ...props}) => <table className={markdownStyles.table} {...props} />,
                      th: ({node, ...props}) => <th className={markdownStyles.th} {...props} />,
                      td: ({node, ...props}) => <td className={markdownStyles.td} {...props} />,
                      code: ({node, inline, className, children, ...props}: any) => 
                        inline 
                          ? <code className={markdownStyles.code} {...props}>{children}</code>
                          : <code className="block bg-slate-100 p-2 rounded text-sm overflow-x-auto my-1.5" {...props}>{children}</code>,
                      strong: ({node, ...props}) => <strong className="font-bold" {...props} />,
                      em: ({node, ...props}) => <em className="italic" {...props} />
                    }}
                  >
                    {message.content}
                  </ReactMarkdown>
                ) : (
                  message.content
                )}
                
                {/* Show typing indicator if content exists and is still streaming */}
                {message.role === 'assistant' && message.isStreaming && message.content && (
                  <span className="ml-1 inline-block animate-pulse">▋</span>
                )}
              </div>
            </div>
          </div>
        ))}
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-lg mb-4">
            {error}
          </div>
        )}
      </div>
      
      <form onSubmit={sendMessage} className="p-4 sm:p-5 border-t border-slate-200 bg-white">
        <div className="flex items-center gap-2 relative">
          {/* Main input field */}
          <div className="relative flex-grow">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={window.innerWidth < 640 ? "Ask a fishing question..." : "Ask about fishing spots, species, techniques..."}
              className="w-full bg-slate-100 border-0 rounded-full py-3 pl-4 pr-12 text-sm sm:text-base text-slate-800 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:bg-white transition-all shadow-sm"
              disabled={isLoading}
            />
            
            {/* Send button - positioned inside the input on mobile */}
            <button
              type="submit"
              aria-label="Send message"
              className="absolute right-1 top-1/2 -translate-y-1/2 flex items-center justify-center bg-gradient-to-r from-blue-700 to-blue-600 hover:from-blue-800 hover:to-blue-700 active:from-blue-800 active:to-blue-800 text-white w-10 h-10 rounded-full disabled:opacity-60 transition-all duration-200 shadow-md"
              disabled={isLoading || !input.trim()}
            >
              <Send className="h-5 w-5" />
            </button>
          </div>
        </div>
        
        {/* Loading indicator - shown below input when loading */}
        {isLoading && (
          <div className="flex items-center mt-2 text-xs text-slate-500 pl-2">
            <div className="flex space-x-1 items-center">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></div>
              <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse delay-150"></div>
              <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse delay-300"></div>
            </div>
            <span className="ml-2">Sending message...</span>
          </div>
        )}
      </form>
    </div>
  );
};

// Fish icon component for the header
const Fish = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M18 16.5a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"/>
    <path d="M18 19a6 6 0 0 0 0-12c-4 0-7.5 1-10 3v6c2.5 2 6 3 10 3Z"/>
    <path d="m2 16 3-4-3-4"/>
  </svg>
); 