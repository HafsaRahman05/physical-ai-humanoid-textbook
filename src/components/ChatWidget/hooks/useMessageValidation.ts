/**
 * React hook for message input validation
 * Handles character counting and validation rules
 */

import {useState, useCallback} from 'react';

/**
 * Maximum character limit for messages (per spec clarification)
 */
export const MAX_MESSAGE_LENGTH = 2000;

/**
 * Hook for validating message input
 *
 * @returns Object with validation functions and character count
 */
export function useMessageValidation() {
  const [characterCount, setCharacterCount] = useState(0);

  /**
   * Update character count as user types
   */
  const updateCount = useCallback((text: string) => {
    setCharacterCount(text.length);
  }, []);

  /**
   * Validate message text
   * @param text - Message text to validate
   * @returns Object with isValid flag and error message if invalid
   */
  const validate = useCallback(
    (text: string): {isValid: boolean; error?: string} => {
      const trimmed = text.trim();

      // Check if empty
      if (trimmed.length === 0) {
        return {
          isValid: false,
          error: 'Message cannot be empty',
        };
      }

      // Check character limit
      if (text.length > MAX_MESSAGE_LENGTH) {
        return {
          isValid: false,
          error: `Message exceeds maximum length of ${MAX_MESSAGE_LENGTH} characters`,
        };
      }

      return {isValid: true};
    },
    [],
  );

  /**
   * Check if message is approaching limit (for visual feedback)
   * @param threshold - Percentage threshold (default 90%)
   */
  const isApproachingLimit = useCallback(
    (threshold: number = 0.9): boolean => {
      return characterCount >= MAX_MESSAGE_LENGTH * threshold;
    },
    [characterCount],
  );

  /**
   * Check if message exceeds limit
   */
  const exceedsLimit = useCallback((): boolean => {
    return characterCount > MAX_MESSAGE_LENGTH;
  }, [characterCount]);

  return {
    characterCount,
    updateCount,
    validate,
    isApproachingLimit,
    exceedsLimit,
    MAX_LENGTH: MAX_MESSAGE_LENGTH,
  };
}

