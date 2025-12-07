# Data Model: ChatKit Widget Integration

**Feature**: 011-chatkit-widget  
**Date**: 2025-01-27

## Overview

The ChatKit widget integration primarily manages client-side state. The data model is minimal since most data (messages, sessions) is managed by the ChatKit library and backend. This document describes the widget's internal state and data flow.

## Entities

### WidgetState

Represents the current state of the ChatKit widget component.

**Fields**:
- `isOpen: boolean` - Whether the widget chat interface is currently visible
- `isInitialized: boolean` - Whether ChatKit has been initialized (lazy initialization)
- `isConnecting: boolean` - Whether a session is being established with backend
- `isLoading: boolean` - Whether an AI response is being generated
- `error: ErrorState | null` - Current error state, if any
- `retryCount: number` - Number of automatic retry attempts made for current operation

**State Transitions**:
1. Initial: `isOpen: false, isInitialized: false`
2. User clicks toggle: `isOpen: true, isConnecting: true`
3. Session established: `isConnecting: false, isInitialized: true`
4. User sends message: `isLoading: true`
5. Response received: `isLoading: false`
6. Error occurs: `error: { message, type, retryable }`
7. Retry successful: `error: null, retryCount: 0`
8. User closes: `isOpen: false` (initialized state persists)

### ErrorState

Represents an error condition in the widget.

**Fields**:
- `message: string` - User-friendly error message
- `type: 'network' | 'backend' | 'session' | 'unknown'` - Error category
- `retryable: boolean` - Whether the error can be retried
- `timestamp: Date` - When the error occurred

**Validation Rules**:
- `message` must be non-empty and user-friendly (no technical details)
- `type` must be one of the defined types
- `timestamp` must be a valid Date object

### ChatSession (Managed by ChatKit)

Represents an authenticated conversation session. Managed internally by ChatKit library.

**Fields** (from backend response):
- `client_secret: string` - Authentication token for ChatKit protocol
- `session_id: string` - Unique session identifier
- `expires_at: string` - ISO 8601 timestamp of expiration (optional)

**Lifecycle**:
1. Created when widget first opens (lazy initialization)
2. Used for all subsequent chat messages in the session
3. May expire (handled by ChatKit's `getClientSecret` refresh logic)
4. Persists for browser session (lost on page refresh per MVP scope)

### ChatMessage (Managed by ChatKit)

Represents a single message in the conversation. Managed internally by ChatKit library.

**Fields** (ChatKit internal structure):
- `id: string` - Unique message identifier
- `content: string` - Message text content
- `role: 'user' | 'assistant'` - Message sender
- `timestamp: Date` - When message was sent/received
- `streaming: boolean` - Whether message is currently streaming

**Note**: ChatKit manages message history internally. Widget doesn't need to store messages separately.

## Data Flow

### Session Creation Flow

```
User clicks toggle button
  → Widget sets isOpen: true, isConnecting: true
  → ChatKit calls getClientSecret()
  → Widget fetches POST /api/chatkit/session
  → Backend returns { client_secret, session_id }
  → ChatKit initializes with client_secret
  → Widget sets isConnecting: false, isInitialized: true
```

### Message Sending Flow

```
User types message and sends
  → Widget sets isLoading: true
  → ChatKit sends message to POST /chatkit endpoint
  → Backend streams response via SSE
  → ChatKit updates UI with streaming content
  → Streaming completes
  → Widget sets isLoading: false
```

### Error Handling Flow

```
Error occurs (network, backend, etc.)
  → Widget catches error
  → Widget creates ErrorState object
  → Widget sets error state, retryCount: 0
  → Automatic retry logic triggers (if retryable)
  → Retry attempts with exponential backoff (1s, 2s, 4s)
  → If retries exhausted: show manual retry button
  → User clicks retry: reset error, retryCount: 0, retry operation
```

## Storage

### Browser Session Storage

**Purpose**: Persist widget open/closed state across page navigation within browser session.

**Data Stored**:
- `chatkit-widget-open: boolean` - Whether widget was open when user navigated

**Lifecycle**:
- Set when user opens/closes widget
- Read on page load to restore state
- Cleared when browser session ends

**Note**: Conversation history is managed by ChatKit and backend, not stored in browser storage for MVP.

## Validation Rules

### WidgetState Validation

- `isOpen` and `isInitialized` can be independently true/false
- `isConnecting` can only be true if `isOpen` is true
- `isLoading` can only be true if `isInitialized` is true
- `error` must be null when `isConnecting` or `isLoading` are true (errors clear on new operations)

### ErrorState Validation

- `message` must not contain technical details (no stack traces, HTTP status codes visible to user)
- `retryable` must be false for session errors (requires new session)
- `type: 'network'` implies `retryable: true`

## Relationships

```
WidgetState
  ├── has one ErrorState (optional, nullable)
  ├── manages one ChatSession (via ChatKit)
  └── displays many ChatMessages (via ChatKit)

ChatSession
  └── contains many ChatMessages

ChatMessage
  └── belongs to one ChatSession
```

## Constraints

1. **Session Uniqueness**: Only one active session per widget instance
2. **Message Ordering**: Messages must be displayed in chronological order (handled by ChatKit)
3. **State Consistency**: Widget state must reflect ChatKit's internal state
4. **Error Recovery**: Errors must not persist across successful operations

## Future Considerations

For post-MVP enhancements:
- Persist conversation history across browser sessions (localStorage)
- Support multiple concurrent sessions (not in MVP scope)
- Store user preferences (theme, widget position)

