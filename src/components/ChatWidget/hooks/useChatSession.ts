/**
 * React hook for managing chat session
 * Handles sessionStorage operations for session persistence
 */

import {useState, useEffect, useCallback} from 'react';

const SESSION_STORAGE_KEY = 'chatSessionId';

/**
 * Hook for managing chat session ID in sessionStorage
 *
 * @returns Object with sessionId and functions to manage session
 */
export function useChatSession() {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [storageError, setStorageError] = useState<Error | null>(null);

  // Retrieve session ID from sessionStorage on mount
  useEffect(() => {
    try {
      const stored = sessionStorage.getItem(SESSION_STORAGE_KEY);
      if (stored && stored.trim() !== '') {
        setSessionId(stored);
      }
    } catch (error) {
      // Handle QuotaExceededError or privacy mode (storage disabled)
      if (error instanceof DOMException) {
        if (error.name === 'QuotaExceededError') {
          console.warn('SessionStorage quota exceeded, falling back to in-memory storage');
          setStorageError(error);
        } else if (error.name === 'SecurityError') {
          console.warn('SessionStorage access denied (privacy mode), falling back to in-memory storage');
          setStorageError(error);
        }
      }
      // Fallback to in-memory (sessionId will be null, handled by component)
    }
  }, []);

  /**
   * Store session ID in sessionStorage
   */
  const saveSession = useCallback((id: string) => {
    try {
      sessionStorage.setItem(SESSION_STORAGE_KEY, id);
      setSessionId(id);
      setStorageError(null);
    } catch (error) {
      // Handle storage errors gracefully
      if (error instanceof DOMException) {
        if (error.name === 'QuotaExceededError') {
          console.warn('SessionStorage quota exceeded, using in-memory storage');
          setStorageError(error);
          // Still store in state for current session
          setSessionId(id);
        } else if (error.name === 'SecurityError') {
          console.warn('SessionStorage access denied, using in-memory storage');
          setStorageError(error);
          // Still store in state for current session
          setSessionId(id);
        }
      }
    }
  }, []);

  /**
   * Clear session ID from sessionStorage
   */
  const clearSession = useCallback(() => {
    try {
      sessionStorage.removeItem(SESSION_STORAGE_KEY);
      setSessionId(null);
      setStorageError(null);
    } catch (error) {
      console.warn('Failed to clear sessionStorage:', error);
      setSessionId(null);
    }
  }, []);

  /**
   * Get current session ID (from state, not storage)
   */
  const getSession = useCallback(() => {
    return sessionId;
  }, [sessionId]);

  /**
   * Initialize session from storage on mount
   * Called automatically by useEffect, but can be called manually if needed
   */
  const initializeSession = useCallback(() => {
    try {
      const stored = sessionStorage.getItem(SESSION_STORAGE_KEY);
      if (stored && stored.trim() !== '') {
        setSessionId(stored);
      }
    } catch (error) {
      // Handle storage errors
      if (error instanceof DOMException) {
        if (error.name === 'QuotaExceededError') {
          console.warn('SessionStorage quota exceeded, falling back to in-memory storage');
          setStorageError(error);
        } else if (error.name === 'SecurityError') {
          console.warn('SessionStorage access denied (privacy mode), falling back to in-memory storage');
          setStorageError(error);
        }
      }
    }
  }, []);

  return {
    sessionId,
    saveSession,
    clearSession,
    getSession,
    initializeSession,
    storageError, // Expose error for component to handle
  };
}

