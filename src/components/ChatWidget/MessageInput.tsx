/**
 * MessageInput component
 * Text input field with send button and character count
 */

import type {ReactNode, FormEvent} from 'react';
import {useState} from 'react';
import clsx from 'clsx';
import type {useMessageValidation} from './hooks/useMessageValidation';
import styles from './styles.module.css';

interface MessageInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
  isLoading?: boolean;
  validation: ReturnType<typeof useMessageValidation>;
}

export default function MessageInput({
  onSend,
  disabled = false,
  isLoading = false,
  validation,
}: MessageInputProps): ReactNode {
  const [inputValue, setInputValue] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setInputValue(value);
    validation.updateCount(value);
    // Clear validation error when user starts typing
    if (validationError) {
      setValidationError(null);
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const result = validation.validate(inputValue);
    if (!result.isValid) {
      setValidationError(result.error || 'Invalid message');
      return;
    }

    onSend(inputValue.trim());
    setInputValue('');
    validation.updateCount('');
    setValidationError(null);
  };

  const isDisabled = disabled || isLoading || validation.exceedsLimit();

  return (
    <form className={styles.messageInputForm} onSubmit={handleSubmit}>
      {validationError && (
        <div className={styles.validationError} role="alert">
          {validationError}
        </div>
      )}
      <div className={styles.messageInputContainer}>
        <textarea
          className={clsx(styles.messageInput, {
            [styles.messageInputError]: validationError,
            [styles.messageInputWarning]: validation.isApproachingLimit(),
          })}
          value={inputValue}
          onChange={handleInputChange}
          placeholder="Ask a question about the textbook..."
          disabled={isDisabled}
          rows={3}
          maxLength={validation.MAX_LENGTH}
          aria-label="Message input"
          aria-describedby="char-count"
        />
        <div className={styles.messageInputFooter}>
          <span
            id="char-count"
            className={clsx(styles.charCount, {
              [styles.charCountWarning]: validation.isApproachingLimit(),
              [styles.charCountError]: validation.exceedsLimit(),
            })}>
            {validation.characterCount}/{validation.MAX_LENGTH}
          </span>
          <button
            type="submit"
            className={styles.sendButton}
            disabled={isDisabled}
            aria-label="Send message">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true">
              <path
                d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>
    </form>
  );
}

