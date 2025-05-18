'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Bot, Loader2, InfoIcon } from 'lucide-react';
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

export const FishingAssistantModalChat: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const latestMessageRef = useRef<HTMLDivElement>(null);
  const { user } = useUserProfile();
  const [initializing, setInitializing] = useState(true);

  // Ensure latest message is visible
  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
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

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
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
              
              // Scroll to bottom with each significant update
              if (parsedChunk.content.includes('\n') || parsedChunk.content.length > 30) {
                setTimeout(scrollToBottom, 50);
              }
            } else {
              // Stream is complete, mark the message as no longer streaming
              setMessages(prevMessages => {
                const updatedMessages = [...prevMessages];
                updatedMessages[updatedMessages.length - 1].isStreaming = false;
                return updatedMessages;
              });
              setTimeout(scrollToBottom, 100);
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
    <div className="flex flex-col h-full">
      {/* Chat Messages */}
      <div 
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto p-4 bg-slate-50"
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
        
        {initializing && (
          <div className="flex justify-center items-center h-32">
            <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
          </div>
        )}
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-lg mb-4">
            {error}
          </div>
        )}
      </div>
      
      {/* Chat Input */}
      <div className="p-4 bg-white border-t border-slate-200">
        <form onSubmit={sendMessage} className="flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a fishing question..."
            className="flex-1 px-4 py-2 border border-slate-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="bg-blue-600 text-white px-4 py-2 rounded-r-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:hover:bg-blue-600"
          >
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Send className="h-5 w-5" />
            )}
          </button>
        </form>
      </div>
    </div>
  );
}; 