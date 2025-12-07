# Quickstart: Custom Chat Widget Development

**Feature**: 012-chat-widget  
**Date**: 2025-01-27  
**Phase**: 1 - Design & Contracts

## Prerequisites

- Node.js >= 20.0
- npm or yarn package manager
- Docusaurus development environment set up
- FastAPI backend running (see `Chatbot/README.md`)

## Setup

### 1. Install Dependencies

No additional dependencies required beyond existing Docusaurus setup. The widget uses:
- React 19.0.0 (already in package.json)
- TypeScript 5.6.2 (already configured)
- Docusaurus 3.9.2 (already installed)

### 2. Component Structure

Create the following directory structure:

```bash
src/components/ChatWidget/
├── index.tsx              # Main ChatWidget component (export)
├── ChatButton.tsx        # Floating toggle button
├── ChatWindow.tsx         # Chat interface container
├── MessageList.tsx        # Message history display
├── MessageInput.tsx       # Message input field
├── Citation.tsx           # Citation display component
├── ErrorMessage.tsx      # Error display component
├── LoadingIndicator.tsx  # Loading state component
├── types.ts              # TypeScript type definitions
├── hooks/
│   ├── useChatSession.ts      # Session management hook
│   ├── useChatAPI.ts          # API communication hook
│   └── useMessageValidation.ts # Input validation hook
├── services/
│   └── chatService.ts    # API service layer
└── styles.module.css     # Component styles
```

### 3. Backend Configuration

Ensure FastAPI backend is running:

```bash
cd Chatbot
# Follow backend setup instructions in Chatbot/README.md
# Backend should be accessible at http://localhost:8000
```

### 4. Integration into Docusaurus

#### Option A: Root Layout Integration (Recommended)

Modify `src/theme/Root.tsx` (create if doesn't exist):

```typescript
import React from 'react';
import ChatWidget from '@site/src/components/ChatWidget';

export default function Root({children}) {
  return (
    <>
      {children}
      <ChatWidget />
    </>
  );
}
```

#### Option B: Theme Configuration

Add to `docusaurus.config.ts`:

```typescript
import type {Config} from '@docusaurus/types';

const config: Config = {
  // ... existing config
  plugins: [
    [
      require.resolve('@docusaurus/plugin-content-docs'),
      {
        // ... existing plugin config
      },
    ],
  ],
  // Custom theme configuration
  customFields: {
    chatWidgetEnabled: true,
  },
};
```

Then inject widget in Layout component.

## Development Workflow

### 1. Start Development Server

```bash
npm start
# or
yarn start
```

Docusaurus dev server runs on `http://localhost:3000`

### 2. Component Development

1. Create component files in `src/components/ChatWidget/`
2. Implement TypeScript types in `types.ts`
3. Create custom hooks for state management
4. Implement API service layer
5. Add CSS styles in `styles.module.css`

### 3. Testing

#### Manual Testing Checklist

- [ ] Widget appears as floating button in bottom-right corner
- [ ] Widget opens/closes on button click
- [ ] Session created on first open
- [ ] Session ID stored in sessionStorage
- [ ] Messages send successfully to backend
- [ ] Responses display correctly
- [ ] Citations render as clickable links
- [ ] Error messages display for different error types
- [ ] Input validation works (empty, 2000 char limit)
- [ ] Loading indicator shows during API calls
- [ ] Timeout handling works (30 second limit)
- [ ] Widget responsive on different screen sizes
- [ ] Conversation history persists across page navigation
- [ ] Widget resets to closed on new page load

#### Browser Testing

Test in:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

### 4. Backend Integration Testing

1. Start backend: `cd Chatbot && uvicorn main:app --reload`
2. Verify backend health: `curl http://localhost:8000/`
3. Test API endpoint: `curl -X POST http://localhost:8000/api/chat -H "Content-Type: application/json" -d '{"message":"test","session_id":"test-session"}'`
4. Verify CORS headers allow frontend origin

## Key Implementation Points

### Session Management

```typescript
// useChatSession.ts
export function useChatSession() {
  const [sessionId, setSessionId] = useState<string | null>(null);
  
  useEffect(() => {
    // Retrieve from sessionStorage on mount
    const stored = sessionStorage.getItem('chatSessionId');
    if (stored) {
      setSessionId(stored);
    }
  }, []);
  
  const createSession = async () => {
    // Session created implicitly on first message
    // Store returned sessionId
  };
  
  return { sessionId, createSession };
}
```

### API Communication

```typescript
// chatService.ts
export async function sendMessage(
  message: string,
  sessionId: string
): Promise<ChatResponse> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 30000); // 30s timeout
  
  try {
    const response = await fetch(`${API_BASE_URL}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, session_id: sessionId }),
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
}
```

### Input Validation

```typescript
// useMessageValidation.ts
export function useMessageValidation() {
  const [characterCount, setCharacterCount] = useState(0);
  const MAX_LENGTH = 2000;
  
  const validate = (text: string): boolean => {
    const trimmed = text.trim();
    return trimmed.length > 0 && trimmed.length <= MAX_LENGTH;
  };
  
  const updateCount = (text: string) => {
    setCharacterCount(text.length);
  };
  
  return { validate, characterCount, updateCount, MAX_LENGTH };
}
```

## Common Issues

### Issue: Widget Not Appearing

**Solution**: 
- Check Root.tsx integration
- Verify component export in index.tsx
- Check browser console for errors
- Verify CSS positioning (fixed, bottom-right)

### Issue: CORS Errors

**Solution**:
- Verify backend CORS configuration
- Check backend allows frontend origin
- Verify request headers (Content-Type)

### Issue: Session Not Persisting

**Solution**:
- Check sessionStorage API availability
- Handle privacy mode (storage disabled)
- Verify sessionStorage key name consistency
- Check browser console for storage errors

### Issue: Citations Not Clickable

**Solution**:
- Verify citation URL format (relative paths)
- Use Docusaurus Link component
- Check URL matches Docusaurus route structure
- Verify citation parsing from API response

## Next Steps

1. Implement component structure
2. Add TypeScript types
3. Implement hooks and services
4. Add styling
5. Test integration
6. Deploy to GitHub Pages

## Resources

- [Docusaurus Components](https://docusaurus.io/docs/markdown-features/react)
- [React Hooks Documentation](https://react.dev/reference/react)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Fetch API Documentation](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)
- Backend API: See `Chatbot/src/chatbot/api/routes.py`

