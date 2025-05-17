import { useState, useCallback } from 'react';
import {
  AdminVibeQuizInstructions,
  AdminVibeQuizQuestion,
  AdminVibeQuizConditionalResponse,
  AdminVibeQuizDocument
} from '@/lib/types';

export function useVibeQuizAdmin() {
  const [instructions, setInstructions] = useState<AdminVibeQuizInstructions[]>([]);
  const [questions, setQuestions] = useState<AdminVibeQuizQuestion[]>([]);
  const [conditionals, setConditionals] = useState<AdminVibeQuizConditionalResponse[]>([]);
  const [documents, setDocuments] = useState<AdminVibeQuizDocument[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch all admin instructions
  const fetchInstructions = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/vibe-quiz/admin/instructions');
      const data = await res.json();
      if (res.ok) setInstructions(data);
      else setError(data.error || 'Failed to fetch instructions');
    } catch (err) {
      setError('Failed to fetch instructions');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch all questions
  const fetchQuestions = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/vibe-quiz/admin/questions');
      const data = await res.json();
      if (res.ok) setQuestions(data);
      else setError(data.error || 'Failed to fetch questions');
    } catch (err) {
      setError('Failed to fetch questions');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch all conditionals for a question
  const fetchConditionals = useCallback(async (questionId: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/vibe-quiz/admin/questions?questionId=${questionId}`);
      const data = await res.json();
      if (res.ok) setConditionals(data);
      else setError(data.error || 'Failed to fetch conditionals');
    } catch (err) {
      setError('Failed to fetch conditionals');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch all documents
  const fetchDocuments = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/vibe-quiz/admin/documents');
      const data = await res.json();
      if (res.ok) setDocuments(data);
      else setError(data.error || 'Failed to fetch documents');
    } catch (err) {
      setError('Failed to fetch documents');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Add, update, delete logic can be added similarly for each resource

  return {
    instructions,
    questions,
    conditionals,
    documents,
    isLoading,
    error,
    fetchInstructions,
    fetchQuestions,
    fetchConditionals,
    fetchDocuments,
    setInstructions,
    setQuestions,
    setConditionals,
    setDocuments,
  };
} 