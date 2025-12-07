/**
 * ChatWindow component - Container for chat interface
 * Manages open/closed state and contains message list and input
 */

import type {ReactNode} from 'react';
import clsx from 'clsx';
import styles from './styles.module.css';

interface ChatWindowProps {
  isOpen: boolean;
  children: ReactNode;
}

export default function ChatWindow({
  isOpen,
  children,
}: ChatWindowProps): ReactNode {
  if (!isOpen) {
    return null;
  }

  return (
    <div className={styles.chatWindow} role="dialog" aria-label="Chat widget">
      {children}
    </div>
  );
}

