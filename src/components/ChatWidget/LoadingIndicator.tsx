/**
 * LoadingIndicator component
 * Displays loading state during API calls
 */

import type {ReactNode} from 'react';
import styles from './styles.module.css';

interface LoadingIndicatorProps {
  message?: string;
}

export default function LoadingIndicator({
  message = 'Loading...',
}: LoadingIndicatorProps): ReactNode {
  return (
    <div className={styles.loadingIndicator} role="status" aria-live="polite">
      <div className={styles.spinner} aria-hidden="true"></div>
      <span className={styles.loadingText}>{message}</span>
    </div>
  );
}

