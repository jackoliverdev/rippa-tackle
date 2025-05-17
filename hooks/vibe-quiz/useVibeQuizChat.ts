import { useState, useCallback } from 'react';
import { VibeQuizMessage } from '@/lib/types';

export function useVibeQuizChat(conversationId: string | null) {
  const [messages, setMessages] = useState<VibeQuizMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch all messages for a conversation
  const fetchMessages = useCallback(async () => {
    if (!conversationId) return;
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/vibe-quiz/messages?conversationId=${conversationId}`);
      const data = await res.json();
      if (res.ok) setMessages(data);
      else setError(data.error || 'Failed to fetch messages');
    } catch (err) {
      setError('Failed to fetch messages');
    } finally {
      setIsLoading(false);
    }
  }, [conversationId]);

  // Send a user message and get AI response
  const sendMessage = useCallback(async (userMessage: string) => {
    if (!conversationId) return;
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/vibe-quiz/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ conversationId, userMessage })
      });
      const data = await res.json();
      if (res.ok) {
        // Refetch messages to get both user and AI messages
        await fetchMessages();
      } else {
        setError(data.error || 'Failed to send message');
      }
    } catch (err) {
      setError('Failed to send message');
    } finally {
      setIsLoading(false);
    }
  }, [conversationId, fetchMessages]);

  return {
    messages,
    isLoading,
    error,
    fetchMessages,
    sendMessage,
  };
} 