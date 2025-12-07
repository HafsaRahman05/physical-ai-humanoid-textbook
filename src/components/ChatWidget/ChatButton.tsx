/**
 * ChatButton component - Floating toggle button
 * Displays in bottom-right corner, toggles widget open/closed
 */

import type {ReactNode} from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';

interface ChatButtonProps {
  isOpen: boolean;
  onClick: () => void;
}

export default function ChatButton({
  isOpen,
  onClick,
}: ChatButtonProps): ReactNode {
  return (
    <button
      className={clsx(styles.chatButton, {
        [styles.chatButtonOpen]: isOpen,
      })}
      onClick={onClick}
      aria-label={isOpen ? 'Close chat widget' : 'Open chat widget'}
      aria-expanded={isOpen}
      type="button">
      {isOpen ? (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true">
          <path
            d="M18 6L6 18M6 6L18 18"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ) : (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true">
          <path
            d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </button>
  );
}

