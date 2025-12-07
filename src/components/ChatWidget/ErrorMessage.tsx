/**
 * ErrorMessage component
 * Displays specific error messages with retry option
 */

import type {ReactNode} from 'react';
import type {ErrorInfo} from './types';
import styles from './styles.module.css';

interface ErrorMessageProps {
  error: ErrorInfo;
  onRetry?: () => void;
}

export default function ErrorMessage({
  error,
  onRetry,
}: ErrorMessageProps): ReactNode {
  const getErrorMessage = (): string => {
    switch (error.type) {
      case 'network':
        return 'Network connection lost';
      case 'timeout':
        return 'Request timed out';
      case '4xx':
        return 'Invalid request';
      case '5xx':
        return 'Server error';
      case 'validation':
        return error.message;
      default:
        return 'An error occurred';
    }
  };

  return (
    <div className={styles.errorMessage} role="alert">
      <div className={styles.errorContent}>
        <span className={styles.errorIcon} aria-hidden="true">
          ⚠️
        </span>
        <span className={styles.errorText}>{getErrorMessage()}</span>
      </div>
      {error.retryable && onRetry && (
        <button
          className={styles.retryButton}
          onClick={onRetry}
          type="button"
          aria-label="Retry request">
          Retry
        </button>
      )}
    </div>
  );
}

