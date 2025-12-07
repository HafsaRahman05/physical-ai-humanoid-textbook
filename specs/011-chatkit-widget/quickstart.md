# Quickstart: ChatKit Widget Integration

**Feature**: 011-chatkit-widget  
**Date**: 2025-01-27

## Prerequisites

- Node.js >= 20.0
- npm or yarn
- FastAPI backend running (default: `http://localhost:8000`)
- Docusaurus development server

## Installation

### 1. Install ChatKit React Package

```bash
npm install @openai/chatkit-react
```

### 2. Verify Dependencies

Ensure these are in `package.json`:
- `@openai/chatkit-react` (new)
- `react` ^19.0.0 (existing)
- `react-dom` ^19.0.0 (existing)
- `@docusaurus/core` 3.9.2 (existing)

## Development Setup

### 1. Create Widget Component Structure

```bash
mkdir -p src/components/ChatWidget
```

### 2. Create Main Widget Component

Create `src/components/ChatWidget/index.tsx`:

```tsx
'use client';

import { useState } from 'react';
import ChatKitWrapper from './ChatKitWrapper';
import styles from './styles.module.css';

const BACKEND_URL = 
  process.env.NODE_ENV === 'production'
    ? 'https://your-production-backend.com'
    : 'http://localhost:8000';

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {!isOpen && (
        <button
          className={styles.toggleButton}
          onClick={() => setIsOpen(true)}
          aria-label="Open chat"
        >
          💬
        </button>
      )}
      {isOpen && (
        <div className={styles.widgetContainer}>
          <ChatKitWrapper backendUrl={BACKEND_URL} />
          <button
            className={styles.closeButton}
            onClick={() => setIsOpen(false)}
            aria-label="Close chat"
          >
            ×
          </button>
        </div>
      )}
    </>
  );
}
```

### 3. Create ChatKit Wrapper

Create `src/components/ChatWidget/ChatKitWrapper.tsx`:

```tsx
'use client';

import { ChatKit, useChatKit } from '@openai/chatkit-react';
import { useErrorRetry } from './useErrorRetry';
import styles from './styles.module.css';

interface ChatKitWrapperProps {
  backendUrl: string;
}

export default function ChatKitWrapper({ backendUrl }: ChatKitWrapperProps) {
  const { fetchWithRetry } = useErrorRetry();

  const { control } = useChatKit({
    api: {
      async getClientSecret() {
        const response = await fetchWithRetry(
          `${backendUrl}/api/chatkit/session`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
          }
        );
        const { client_secret } = await response.json();
        return client_secret;
      },
      url: `${backendUrl}/chatkit`,
    },
    onError: ({ error }) => {
      console.error('ChatKit error:', error);
    },
  });

  return (
    <ChatKit
      control={control}
      className={styles.chatKit}
    />
  );
}
```

### 4. Create Error Retry Hook

Create `src/components/ChatWidget/useErrorRetry.ts`:

```tsx
import { useState, useCallback } from 'react';

export function useErrorRetry() {
  const [retryCount, setRetryCount] = useState(0);

  const fetchWithRetry = useCallback(
    async (url: string, options: RequestInit, maxRetries = 3) => {
      for (let i = 0; i < maxRetries; i++) {
        try {
          const response = await fetch(url, options);
          if (response.ok) {
            setRetryCount(0);
            return response;
          }
          throw new Error(`HTTP ${response.status}`);
        } catch (error) {
          if (i === maxRetries - 1) {
            setRetryCount(maxRetries);
            throw error;
          }
          await new Promise((resolve) =>
            setTimeout(resolve, Math.pow(2, i) * 1000)
          );
        }
      }
    },
    []
  );

  return { fetchWithRetry, retryCount };
}
```

### 5. Create Styles

Create `src/components/ChatWidget/styles.module.css`:

```css
.toggleButton {
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: var(--ifm-color-primary);
  color: white;
  border: none;
  cursor: pointer;
  font-size: 24px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  z-index: 1000;
}

.toggleButton:hover {
  transform: scale(1.1);
}

.widgetContainer {
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: min(400px, 90vw);
  height: min(600px, 80vh);
  max-width: 400px;
  max-height: 600px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  z-index: 1000;
  display: flex;
  flex-direction: column;
}

.chatKit {
  flex: 1;
  border-radius: 8px;
  overflow: hidden;
}

.closeButton {
  position: absolute;
  top: 10px;
  right: 10px;
  background: transparent;
  border: none;
  font-size: 24px;
  cursor: pointer;
  z-index: 1001;
}
```

### 6. Inject Widget Globally

Swizzle the Root component:

```bash
npm run swizzle @docusaurus/theme-classic Root -- --wrap
```

Edit `src/theme/Root/index.tsx`:

```tsx
import OriginalRoot from '@theme-original/Root';
import ChatWidget from '@site/src/components/ChatWidget';

export default function Root(props) {
  return (
    <>
      <OriginalRoot {...props} />
      <ChatWidget />
    </>
  );
}
```

## Testing

### 1. Start Backend

```bash
cd Chatbot
uv run uvicorn chatbot.main:app --reload --host 0.0.0.0 --port 8000
```

### 2. Start Docusaurus

```bash
npm start
```

### 3. Verify Widget

1. Open browser to `http://localhost:3000`
2. Look for chat toggle button (bottom-right corner)
3. Click button to open widget
4. Verify session creation (check browser console for network requests)
5. Send a test message
6. Verify streaming response appears

## Troubleshooting

### Widget Not Appearing

- Check browser console for errors
- Verify Root component swizzle was successful
- Check that ChatWidget component is imported correctly

### Session Creation Fails

- Verify FastAPI backend is running on `http://localhost:8000`
- Check CORS configuration in backend
- Verify `/api/chatkit/session` endpoint is accessible

### Streaming Not Working

- Check browser console for errors
- Verify `/chatkit` endpoint is accessible
- Check that backend is streaming responses correctly

### Styling Issues

- Verify CSS module is imported correctly
- Check that Docusaurus CSS variables are available
- Inspect element to verify styles are applied

## Next Steps

1. Customize widget styling to match Docusaurus theme
2. Add error handling UI (error messages, retry buttons)
3. Implement conversation history persistence (if needed)
4. Add accessibility improvements (keyboard navigation, ARIA labels)

## Production Deployment

### 1. Update Backend URL

Edit `src/components/ChatWidget/index.tsx`:

```tsx
const BACKEND_URL = 'https://your-production-backend.com';
```

### 2. Build Docusaurus

```bash
npm run build
```

### 3. Deploy

Deploy to GitHub Pages (automatic via GitHub Actions) or your hosting platform.

## Resources

- [ChatKit React Documentation](https://github.com/openai/chatkit-js)
- [Docusaurus React Components](https://docusaurus.io/docs/markdown-features/react)
- [FastAPI Backend Documentation](../010-rag-chatkit-agent/)

