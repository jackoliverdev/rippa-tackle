import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { vibeQuizService } from '@/lib/vibe-quiz-service';
import { 
  VibeQuizConversation, 
  VibeQuizMessage, 
  AdminVibeQuizInstructions,
  AdminVibeQuizQuestion,
  AdminVibeQuizConditionalResponse,
  AdminVibeQuizDocument
} from '@/lib/types';

interface VibeQuizContextType {
  currentConversation: VibeQuizConversation | null;
  messages: VibeQuizMessage[];
  instructions: AdminVibeQuizInstructions[];
  questions: AdminVibeQuizQuestion[];
  documents: AdminVibeQuizDocument[];
  isLoading: boolean;
  error: string | null;
  createConversation: (userId: string) => Promise<void>;
  sendMessage: (content: string) => Promise<void>;
  loadConversation: (id: string) => Promise<void>;
  updateConversation: (updates: Partial<VibeQuizConversation>) => Promise<void>;
}

const VibeQuizContext = createContext<VibeQuizContextType | undefined>(undefined);

export const VibeQuizProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentConversation, setCurrentConversation] = useState<VibeQuizConversation | null>(null);
  const [messages, setMessages] = useState<VibeQuizMessage[]>([]);
  const [instructions, setInstructions] = useState<AdminVibeQuizInstructions[]>([]);
  const [questions, setQuestions] = useState<AdminVibeQuizQuestion[]>([]);
  const [documents, setDocuments] = useState<AdminVibeQuizDocument[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setIsLoading(true);
        const [instructionsData, questionsData, documentsData] = await Promise.all([
          vibeQuizService.getInstructions(),
          vibeQuizService.getQuestions(),
          vibeQuizService.getDocuments()
        ]);
        setInstructions(instructionsData);
        setQuestions(questionsData);
        setDocuments(documentsData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialData();
  }, []);

  const createConversation = async (userId: string) => {
    try {
      setIsLoading(true);
      const conversation = await vibeQuizService.createConversation(userId);
      setCurrentConversation(conversation);
      setMessages([]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const loadConversation = async (id: string) => {
    try {
      setIsLoading(true);
      const [conversation, conversationMessages] = await Promise.all([
        vibeQuizService.getConversation(id),
        vibeQuizService.getMessages(id)
      ]);
      setCurrentConversation(conversation);
      setMessages(conversationMessages);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const updateConversation = async (updates: Partial<VibeQuizConversation>) => {
    if (!currentConversation) return;
    
    try {
      setIsLoading(true);
      const updatedConversation = await vibeQuizService.updateConversation(
        currentConversation.id,
        updates
      );
      setCurrentConversation(updatedConversation);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = async (content: string) => {
    if (!currentConversation) return;

    try {
      setIsLoading(true);
      
      // Create user message
      const userMessage = await vibeQuizService.createMessage(
        currentConversation.id,
        'user',
        content
      );
      
      // Generate AI response
      const aiResponse = await vibeQuizService.generateAIResponse(
        currentConversation.id,
        content
      );
      
      // Create AI message
      const aiMessage = await vibeQuizService.createMessage(
        currentConversation.id,
        'assistant',
        aiResponse
      );

      // Update messages state
      setMessages(prev => [...prev, userMessage, aiMessage]);

      // Update conversation last message timestamp
      await updateConversation({
        last_message_at: new Date().toISOString()
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    currentConversation,
    messages,
    instructions,
    questions,
    documents,
    isLoading,
    error,
    createConversation,
    sendMessage,
    loadConversation,
    updateConversation
  };

  return (
    <VibeQuizContext.Provider value={value}>
      {children}
    </VibeQuizContext.Provider>
  );
};

export const useVibeQuiz = () => {
  const context = useContext(VibeQuizContext);
  if (context === undefined) {
    throw new Error('useVibeQuiz must be used within a VibeQuizProvider');
  }
  return context;
}; 