# Research: OpenAI ChatKit Widget Integration

**Date**: 2025-01-27 (Updated: 2025-01-27 with official ChatKit API documentation)  
**Feature**: 011-chatkit-widget  
**Sources**: Context7 (OpenAI ChatKit JS, Docusaurus), official OpenAI ChatKit documentation (https://github.com/openai/chatkit-js), existing codebase

## Research Questions

### 1. How to integrate ChatKit React component in Docusaurus?

**Decision**: Use `@openai/chatkit-react` package with `useChatKit` hook and `ChatKit` component. Inject widget globally via Docusaurus Root component.

**Rationale**: 
- ChatKit provides official React bindings (`@openai/chatkit-react`) that work seamlessly with React 19.0.0 (already in Docusaurus)
- Docusaurus supports custom React components via `src/theme/Root/index.tsx` for global injection
- This approach allows the widget to appear on all pages without modifying individual pages

**Alternatives considered**:
- Creating a separate page: Rejected - widget should be accessible from any page
- MDX component: Rejected - widget needs state management and lifecycle hooks
- Plugin approach: Rejected - overkill for a single component integration

**Implementation Pattern**:
```tsx
// src/components/ChatWidget/ChatKitWrapper.tsx
import { ChatKit, useChatKit } from '@openai/chatkit-react';

export function ChatKitWrapper() {
  const { control } = useChatKit({
    api: {
      async getClientSecret() {
        const res = await fetch('/api/chatkit/session', { method: 'POST' });
        return (await res.json()).client_secret;
      },
    },
  });

  return <ChatKit control={control} className="h-[600px] w-[400px]" />;
}
```

### 2. How to implement floating widget with toggle button?

**Decision**: Create a wrapper component that manages open/closed state, renders a fixed-position toggle button, and conditionally renders the ChatKit component.

**Rationale**:
- ChatKit component itself doesn't provide toggle functionality - it's always visible when rendered
- Need custom wrapper to implement floating button pattern
- Fixed positioning (bottom-right) is standard for chat widgets

**Alternatives considered**:
- Using ChatKit's built-in visibility controls: Rejected - ChatKit doesn't have this feature
- Portal-based approach: Considered but unnecessary - fixed positioning works fine

**Implementation Pattern**:
```tsx
// src/components/ChatWidget/index.tsx
const [isOpen, setIsOpen] = useState(false);

return (
  <>
    {!isOpen && (
      <button 
        className="chat-widget-toggle"
        onClick={() => setIsOpen(true)}
        aria-label="Open chat"
      >
        {/* Toggle button icon */}
      </button>
    )}
    {isOpen && (
      <div className="chat-widget-container">
        <ChatKitWrapper />
        <button onClick={() => setIsOpen(false)}>Close</button>
      </div>
    )}
  </>
);
```

### 3. How to handle lazy initialization and session management?

**Decision**: Initialize ChatKit only when widget is first opened. Use `getClientSecret` callback that fetches from `/api/chatkit/session` endpoint.

**Rationale**:
- Improves initial page load performance
- Only creates backend session when user actually wants to chat
- ChatKit's `getClientSecret` is called automatically on first render

**Alternatives considered**:
- Eager initialization: Rejected - wastes resources if user never opens widget
- Pre-fetching session: Rejected - unnecessary complexity

**Implementation Pattern**:
```tsx
const { control } = useChatKit({
  api: {
    async getClientSecret(existing) {
      // Only called when ChatKit initializes (first open)
      const res = await fetch(`${BACKEND_URL}/api/chatkit/session`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      const { client_secret } = await res.json();
      return client_secret;
    },
  },
});
```

### 4. How to implement error retry with exponential backoff?

**Decision**: Create custom `useErrorRetry` hook that wraps fetch calls with retry logic. Use exponential backoff (1s, 2s, 4s delays) for 2-3 attempts, then show manual retry button.

**Rationale**:
- Provides automatic recovery for transient network errors
- Exponential backoff prevents overwhelming backend
- Manual retry gives user control after automatic attempts fail

**Alternatives considered**:
- Using a library (e.g., axios-retry): Considered but adds dependency for simple logic
- Fixed delay retries: Rejected - exponential backoff is better practice

**Implementation Pattern**:
```tsx
async function fetchWithRetry(url: string, options: RequestInit, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await fetch(url, options);
      if (response.ok) return response;
      throw new Error(`HTTP ${response.status}`);
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000));
    }
  }
}
```

### 5. How to make widget responsive with max constraints?

**Decision**: Use CSS with max-width/max-height constraints and responsive units. Apply Tailwind-like classes or CSS modules.

**Rationale**:
- Max constraints prevent widget from being too large on big screens
- Responsive units (vh, vw, %) ensure usability on small screens
- CSS-based approach is performant and maintainable

**Alternatives considered**:
- JavaScript-based sizing: Rejected - unnecessary complexity
- Fixed breakpoints: Rejected - fluid responsive is better

**Implementation Pattern**:
```css
.chat-widget-container {
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: min(400px, 90vw);
  height: min(600px, 80vh);
  max-width: 400px;
  max-height: 600px;
}
```

### 6. How to integrate widget globally in Docusaurus?

**Decision**: Swizzle the Root component (`@docusaurus/theme-classic/Root`) and inject the ChatWidget component there.

**Rationale**:
- Root component renders on every page
- Allows widget to persist across page navigation
- Maintains conversation history within session

**Alternatives considered**:
- Adding to Layout component: Rejected - Layout is page-specific
- Creating a plugin: Rejected - overkill for single component

**Implementation Pattern**:
```bash
npm run swizzle @docusaurus/theme-classic Root -- --wrap
```

```tsx
// src/theme/Root/index.tsx
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

### 7. How to configure backend URL for different environments?

**Decision**: Use hardcoded constants in component code with conditional logic based on `window.location.hostname` or build-time environment variables.

**Rationale**:
- Simple and explicit
- No runtime configuration needed
- Works with static site generation (Docusaurus)

**Alternatives considered**:
- Environment variables: Considered but Docusaurus static build doesn't support runtime env vars easily
- Configuration file: Rejected - adds unnecessary complexity

**Implementation Pattern**:
```tsx
const BACKEND_URL = 
  process.env.NODE_ENV === 'production'
    ? 'https://your-production-backend.com'
    : 'http://localhost:8000';
```

### 8. How to handle streaming responses?

**Decision**: ChatKit handles streaming automatically. No additional implementation needed - just ensure FastAPI backend streams correctly.

**Rationale**:
- ChatKit's `ChatKit` component automatically handles Server-Sent Events (SSE) streaming
- Backend already implements ChatKit protocol with streaming support
- No frontend changes needed for streaming

**Key Finding**: ChatKit protocol uses Server-Sent Events (SSE) for streaming. The `ChatKit` component automatically processes streaming responses from the `/chatkit` endpoint.

### 9. How to style widget to match Docusaurus theme?

**Decision**: Use Docusaurus CSS variables and theme tokens. Apply ChatKit theme customization to match Docusaurus color scheme.

**Rationale**:
- Maintains visual consistency with textbook
- Uses existing design tokens
- ChatKit supports extensive theme customization

**Implementation Pattern**:
```tsx
const { control } = useChatKit({
  theme: {
    colorScheme: 'light', // or 'dark' based on Docusaurus theme
    color: {
      accent: {
        primary: 'var(--ifm-color-primary)',
        level: 2,
      },
    },
    typography: {
      fontFamily: 'var(--ifm-font-family-base)',
    },
  },
});
```

### 10. How to test the widget integration?

**Decision**: Use React Testing Library for component tests, manual integration testing with running FastAPI backend, and browser-based E2E testing for critical flows.

**Rationale**:
- Component tests verify widget rendering and state management
- Integration tests verify backend connectivity
- E2E tests verify end-to-end user flows

**Testing Strategy**:
- Unit tests: Widget component rendering, state management, error handling
- Integration tests: Session creation, message sending, streaming responses
- E2E tests: Full user journey (open widget, send message, receive response)

## Dependencies Analysis

### New Dependencies Required

1. **@openai/chatkit-react**: Official ChatKit React bindings
   - Version: Latest stable (check npm for current version)
   - Purpose: React components and hooks for ChatKit integration
   - Size: ~200KB (estimated, verify in package.json after install)

### Existing Dependencies Used

1. **React 19.0.0**: Already in Docusaurus dependencies
2. **@docusaurus/core 3.9.2**: For Root component swizzling
3. **TypeScript 5.6.2**: For type safety

## Integration Points

### Frontend → Backend

1. **Session Creation**: `POST /api/chatkit/session` → Returns `{ client_secret, session_id }`
2. **Chat Messages**: `POST /chatkit` → ChatKit protocol endpoint, streams responses via SSE

### Docusaurus Integration

1. **Root Component**: Inject widget globally
2. **CSS Variables**: Use Docusaurus theme tokens for styling
3. **Build Process**: Widget included in static build automatically

## Performance Considerations

1. **Lazy Initialization**: Widget only initializes when opened, reducing initial page load
2. **Code Splitting**: Consider lazy loading ChatKit component if bundle size becomes issue
3. **Session Caching**: ChatKit may cache sessions - verify behavior with backend

## Security Considerations

1. **CORS**: Backend must allow frontend origin (already configured per assumptions)
2. **Client Secret**: Securely transmitted, used for session authentication
3. **No Sensitive Data**: Widget doesn't handle authentication - backend manages this

## Accessibility Considerations

1. **Keyboard Navigation**: Toggle button must be keyboard accessible
2. **Screen Readers**: Proper ARIA labels for toggle button and chat interface
3. **Focus Management**: Focus should move to chat input when widget opens

## Browser Compatibility

- Modern browsers (Chrome, Firefox, Safari - last 3-5 versions)
- Requires ES6+ support (already in Docusaurus requirements)
- Requires Fetch API support (all modern browsers)

## OpenAI ChatKit API Reference (Official Documentation)

**Source**: Official OpenAI ChatKit documentation (https://github.com/openai/chatkit-js)

### Core API Configuration

**`useChatKit` Hook**:
```typescript
import { ChatKit, useChatKit } from '@openai/chatkit-react';

const { control } = useChatKit({
  api: {
    async getClientSecret(existing) {
      // existing parameter indicates token refresh scenario
      if (existing) {
        // Refresh expired token
        const res = await fetch('/api/chatkit/refresh', {
          method: 'POST',
          body: JSON.stringify({ token: existing }),
          headers: { 'Content-Type': 'application/json' },
        });
        return (await res.json()).client_secret;
      }
      
      // Create new session
      const res = await fetch('/api/chatkit/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      return (await res.json()).client_secret;
    },
    url: 'https://your-backend.com/chatkit', // Custom backend endpoint
  },
});
```

**Key API Properties**:
- `api.getClientSecret(existing?)`: Required async function returning `client_secret` string. `existing` parameter indicates token refresh.
- `api.url`: Optional string for custom backend endpoint (default: `/chatkit`)
- `api.fetch`: Optional custom fetch function for adding headers/authentication
- `api.domainKey`: Optional domain key for OpenAI domain allowlist

### Event Handlers

**Available Event Handlers**:
```typescript
const { control } = useChatKit({
  onReady: () => {
    // ChatKit is fully initialized
  },
  onError: ({ error }) => {
    // error.message, error.stack available
    console.error('ChatKit error:', error);
  },
  onResponseStart: () => {
    // AI begins generating response
  },
  onResponseEnd: () => {
    // AI finishes generating response
  },
  onThreadChange: ({ threadId }) => {
    // Conversation thread changed
  },
  onThreadLoadStart: ({ threadId }) => {
    // Thread loading started
  },
  onThreadLoadEnd: ({ threadId }) => {
    // Thread loading completed
  },
  onLog: ({ name, data }) => {
    // Log events for analytics
  },
});
```

### Streaming Implementation

**Automatic Streaming**: ChatKit automatically handles Server-Sent Events (SSE) streaming from backend. No manual implementation required - responses appear incrementally automatically when backend streams correctly.

**Key Points**:
- Streaming is handled internally by ChatKit component
- Backend must implement SSE streaming via ChatKit protocol
- Frontend only needs to configure `api.url` correctly
- Use `onResponseStart`/`onResponseEnd` for loading indicators

### Error Handling

**Error Handling Pattern**:
```typescript
const { control } = useChatKit({
  onError: ({ error }) => {
    // error.message contains user-friendly message
    // error.stack contains technical details (for logging)
    
    // Display user-friendly message
    setError(error.message);
    
    // Log technical details
    console.error('ChatKit error:', error.stack);
  },
});
```

**Error Types**:
- Network errors: Caught automatically by ChatKit
- Backend errors: Received via `onError` callback
- Session errors: Handled via `getClientSecret` refresh logic

### Theme Customization

**Theme Configuration**:
```typescript
const { control } = useChatKit({
  theme: {
    colorScheme: 'light' | 'dark',
    color: {
      accent: {
        primary: '#3b82f6',
        level: 2,
      },
      grayscale: {
        hue: 220,
        tint: 5,
        shade: 0,
      },
      surface: {
        background: '#ffffff',
        foreground: '#1f2937',
      },
    },
    typography: {
      baseSize: 16,
      fontFamily: 'Inter, system-ui, sans-serif',
      fontFamilyMono: 'JetBrains Mono, monospace',
    },
    radius: 'soft' | 'round' | 'sharp',
    density: 'normal' | 'compact' | 'comfortable',
  },
});
```

### Component Usage

**Basic Component**:
```tsx
import { ChatKit, useChatKit } from '@openai/chatkit-react';

function MyChat() {
  const { control } = useChatKit({
    api: {
      getClientSecret: async () => {
        const res = await fetch('/api/chatkit/session', { method: 'POST' });
        return (await res.json()).client_secret;
      },
    },
  });

  return <ChatKit control={control} className="h-[600px] w-[400px]" />;
}
```

**Control Object Methods**:
- `control.ref.current?.focusComposer()`: Focus chat input
- `control.ref.current?.setThreadId(threadId)`: Switch threads
- `control.ref.current?.sendUserMessage({ text })`: Send message programmatically
- `control.ref.current?.fetchUpdates()`: Manually fetch updates

## Open Questions Resolved

All research questions have been answered. Official ChatKit API documentation has been integrated into specification, plan, and tasks. No outstanding technical ambiguities remain.

