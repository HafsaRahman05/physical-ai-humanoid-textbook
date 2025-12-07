/**
 * MessageList component
 * Displays conversation message history with auto-scroll
 */

import type {ReactNode} from 'react';
import {useEffect, useRef} from 'react';
import clsx from 'clsx';
import type {ChatMessage} from './types';
import Citation from './Citation';
import styles from './styles.module.css';

interface MessageListProps {
  messages: ChatMessage[];
}

export default function MessageList({messages}: MessageListProps): ReactNode {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messageListRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    if (messagesEndRef.current && messageListRef.current) {
      // Smooth scroll to bottom
      messagesEndRef.current.scrollIntoView({behavior: 'smooth', block: 'end'});
    }
  }, [messages]);

  // Also scroll on initial load if there are messages
  useEffect(() => {
    if (messages.length > 0 && messageListRef.current) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
    }
  }, []);

  if (messages.length === 0) {
    return (
      <div className={styles.messageListEmpty}>
        <p>Start a conversation by asking a question about the textbook.</p>
      </div>
    );
  }

  return (
    <div 
      ref={messageListRef}
      className={styles.messageList} 
      role="log" 
      aria-live="polite">
      {messages.map((message) => (
        <div
          key={message.id}
          className={clsx(styles.message, {
            [styles.messageUser]: message.sender === 'user',
            [styles.messageAssistant]: message.sender === 'assistant',
            [styles.messageError]: message.status === 'error',
          })}>
          <div className={styles.messageContent}>
            <p>{message.text}</p>
            {message.timestamp && (
              <span className={styles.messageTimestamp}>
                {new Date(message.timestamp).toLocaleTimeString()}
              </span>
            )}
          </div>
          {message.citations && message.citations.length > 0 && (
            <div className={styles.citationsContainer}>
              {message.citations.map((citation, idx) => (
                <Citation key={citation.id || idx} citation={citation} />
              ))}
            </div>
          )}
          {message.error && (
            <div className={styles.messageError}>
              <span>{message.error.message}</span>
            </div>
          )}
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
}

