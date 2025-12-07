/**
 * React hook for API communication
 * Wraps chatService with React state management
 */

import {useState, useCallback} from 'react';
import {sendMessage as apiSendMessage} from '../services/chatService';
import type {ChatResponse, ErrorInfo} from '../types';

interface UseChatAPIReturn {
  sendMessage: (
    message: string,
    sessionId: string,
  ) => Promise<ChatResponse>;
  isLoading: boolean;
  error: ErrorInfo | null;
  clearError: () => void;
}

/**
 * Hook for managing chat API calls with loading and error states
 *
 * @returns Object with sendMessage function and state
 */
export function useChatAPI(): UseChatAPIReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<ErrorInfo | null>(null);

  const sendMessage = useCallback(
    async (message: string, sessionId: string): Promise<ChatResponse> => {
      // Prevent duplicate sends
      if (isLoading) {
        throw {
          type: 'validation' as const,
          message: 'Request already in progress',
          retryable: false,
          timestamp: new Date().toISOString(),
        };
      }

      setIsLoading(true);
      setError(null);

      try {
        const response = await apiSendMessage(message, sessionId);
        setIsLoading(false);
        return response;
      } catch (err) {
        const errorInfo = err as ErrorInfo;
        setError(errorInfo);
        setIsLoading(false);
        throw errorInfo;
      }
    },
    [isLoading],
  );

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    sendMessage,
    isLoading,
    error,
    clearError,
  };
}

