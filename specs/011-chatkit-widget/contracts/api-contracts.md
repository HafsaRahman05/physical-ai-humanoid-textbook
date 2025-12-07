# API Contracts: ChatKit Widget Integration

**Feature**: 011-chatkit-widget  
**Date**: 2025-01-27  
**Backend**: FastAPI (existing implementation)

## Overview

The widget integrates with existing FastAPI backend endpoints. This document describes the API contracts from the frontend widget's perspective.

## Endpoints

### 1. Create ChatKit Session

**Endpoint**: `POST /api/chatkit/session`

**Purpose**: Create a new ChatKit session and obtain client secret for authentication.

**Request**:
```typescript
// No request body required
// Headers:
Content-Type: application/json
```

**Response** (Success - 200):
```typescript
{
  client_secret: string;  // Authentication token for ChatKit protocol
  session_id: string;     // Unique session identifier
  expires_at: string;     // ISO 8601 timestamp (optional, MVP may not expire)
}
```

**Response** (Error - 500):
```typescript
{
  error: {
    type: "SessionCreationError";
    message: string;      // User-friendly error message
  };
  timestamp: string;      // ISO 8601 timestamp
}
```

**Error Handling**:
- Network errors: Retry with exponential backoff (2-3 attempts)
- 500 errors: Show error message, allow manual retry
- Timeout: Treat as network error

**Usage in Widget**:
```typescript
const response = await fetch(`${BACKEND_URL}/api/chatkit/session`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
});
const { client_secret } = await response.json();
```

### 2. ChatKit Protocol Endpoint

**Endpoint**: `POST /chatkit`

**Purpose**: Send chat messages and receive streaming responses using ChatKit protocol.

**Request**:
```typescript
// ChatKit protocol format (handled by ChatKit library)
// Headers:
Content-Type: application/json
// Body: ChatKit protocol message (managed by ChatKit library)
```

**Response** (Streaming - 200):
```
Content-Type: text/event-stream
Cache-Control: no-cache
Connection: keep-alive

// Server-Sent Events (SSE) stream
// Format: ChatKit protocol events
```

**Response** (Error - 500):
```typescript
{
  error: {
    type: "ChatKitError";
    message: string;      // User-friendly error message
  };
  timestamp: string;      // ISO 8601 timestamp
}
```

**Error Handling**:
- Network errors: Retry with exponential backoff (2-3 attempts)
- 500 errors: Show error message, allow manual retry
- Streaming errors: ChatKit handles automatically

**Usage in Widget**:
```typescript
// Handled automatically by ChatKit library
// Widget configures ChatKit with backend URL:
const { control } = useChatKit({
  api: {
    url: `${BACKEND_URL}/chatkit`,
    getClientSecret: async () => {
      // Returns client_secret from session endpoint
    },
  },
});
```

## Protocol Details

### ChatKit Protocol

The ChatKit protocol is handled by the `@openai/chatkit-react` library. The widget doesn't need to implement protocol details directly.

**Key Points**:
- Uses Server-Sent Events (SSE) for streaming
- Messages are sent as JSON in request body
- Responses are streamed as SSE events
- Protocol is abstracted by ChatKit library

### Authentication

**Method**: Client secret token (obtained from `/api/chatkit/session`)

**Usage**:
- Token is passed to ChatKit library via `getClientSecret` callback
- ChatKit library handles token inclusion in requests
- Token may be refreshed automatically by ChatKit if expired

## Error Response Format

All error responses follow this structure:

```typescript
{
  error: {
    type: string;         // Error type identifier
    message: string;     // User-friendly error message
  };
  timestamp: string;     // ISO 8601 timestamp
}
```

**Error Types**:
- `SessionCreationError`: Failed to create session
- `ChatKitError`: ChatKit protocol error
- `ConfigurationError`: Backend configuration issue

## CORS Requirements

**Allowed Origins**:
- Development: `http://localhost:3000`, `http://127.0.0.1:3000`
- Production: `https://Tahasiraj1.github.io` (GitHub Pages)

**Allowed Methods**: `GET`, `POST`, `OPTIONS`

**Allowed Headers**: `Content-Type`, `Accept`, `Authorization`

**Credentials**: `true` (if using cookies, not required for MVP)

## Rate Limiting

**Current**: No rate limiting specified (backend may implement)

**Future Consideration**: If rate limiting is added, widget should handle 429 responses gracefully.

## Timeout Handling

**Session Creation**: 5 seconds timeout
**Chat Messages**: 30 seconds timeout (for streaming responses)

**Behavior on Timeout**:
- Treat as network error
- Retry with exponential backoff
- Show manual retry option after automatic retries exhausted

## Backend URL Configuration

**Development**: `http://localhost:8000`
**Production**: To be determined (hardcoded in component)

**Configuration Method**:
```typescript
const BACKEND_URL = 
  process.env.NODE_ENV === 'production'
    ? 'https://your-production-backend.com'
    : 'http://localhost:8000';
```

## Testing Contracts

### Unit Tests

- Mock `fetch` for session creation endpoint
- Verify request format and headers
- Verify error handling and retry logic

### Integration Tests

- Test with running FastAPI backend
- Verify session creation flow
- Verify message sending and streaming
- Verify error scenarios

### Contract Tests

- Verify response format matches contract
- Verify error response format
- Verify CORS headers

## Versioning

**Current Version**: v1 (implicit, no versioning in MVP)

**Future**: If API changes, consider versioning:
- URL-based: `/api/v1/chatkit/session`
- Header-based: `Accept: application/vnd.chatkit.v1+json`

## Security Considerations

1. **Client Secret**: Transmitted over HTTPS in production
2. **CORS**: Properly configured to prevent unauthorized access
3. **No Sensitive Data**: Widget doesn't handle user authentication
4. **Session Security**: Backend manages session security

## Notes

- All endpoints are already implemented in FastAPI backend
- Widget is a consumer of these contracts, not a provider
- ChatKit library abstracts most protocol details
- Widget focuses on UI/UX, not protocol implementation

