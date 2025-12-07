# API Contracts: Chat Widget Frontend-Backend

**Feature**: 012-chat-widget  
**Date**: 2025-01-27  
**Phase**: 1 - Design & Contracts

## Overview

This document defines the API contract between the chat widget frontend and the FastAPI backend. The backend endpoints are already implemented; this contract documents the expected request/response formats for frontend implementation.

## Base URL

- **Development**: `http://localhost:8000` (or configured backend URL)
- **Production**: Backend deployment URL (to be configured)

## Endpoints

### POST /api/chat

Send a chat message to the AI agent and receive a response.

**Request**:
```typescript
interface ChatRequest {
  message: string;        // User message (1-2000 characters)
  session_id: string;     // Session identifier (UUID)
  thread_id?: string;     // Optional thread ID (not used in MVP)
}
```

**Request Headers**:
```
Content-Type: application/json
```

**Request Example**:
```json
{
  "message": "What is ROS 2?",
  "session_id": "550e8400-e29b-41d4-a716-446655440000"
}
```

**Response** (Success - 200 OK):
```typescript
interface ChatResponse {
  response: string;                    // AI-generated response text
  citations: Citation[];               // Array of source citations
  session_id: string;                  // Session ID (echoed back)
  thread_id?: string;                  // Optional thread ID
  metadata: {
    model_used: string;                // e.g., "gemini-2.5-flash"
    generation_time: number;           // Response time in seconds
  };
}

interface Citation {
  id?: string;                         // Optional citation ID
  text: string;                        // Display text (e.g., "Module 1, Section 2.3")
  url: string;                         // Link to referenced content
  chapter?: string;                    // Optional chapter/module identifier
  section?: string;                    // Optional section identifier
  page?: number;                       // Optional page number
}
```

**Response Example** (Success):
```json
{
  "response": "ROS 2 (Robot Operating System 2) is a middleware framework for robotics applications...",
  "citations": [
    {
      "text": "Module 1: ROS 2 Nervous System, Section 2.3",
      "url": "/modules/module-1-ros2-nervous-system/ros2-fundamentals",
      "chapter": "module-1-ros2-nervous-system",
      "section": "ros2-fundamentals"
    }
  ],
  "session_id": "550e8400-e29b-41d4-a716-446655440000",
  "metadata": {
    "model_used": "gemini-2.5-flash",
    "generation_time": 2.45
  }
}
```

**Error Responses**:

**400 Bad Request** (Validation Error):
```json
{
  "error": {
    "type": "ValidationError",
    "message": "Message cannot be empty" | "Message exceeds maximum length of 2000 characters"
  },
  "timestamp": "2025-01-27T12:00:00Z"
}
```

**500 Internal Server Error** (Agent Error):
```json
{
  "error": {
    "type": "AgentError" | "InternalError",
    "message": "Agent processing failed: [details]"
  },
  "timestamp": "2025-01-27T12:00:00Z"
}
```

**503 Service Unavailable** (Backend Unavailable):
```json
{
  "error": {
    "type": "ServiceUnavailable",
    "message": "Backend service is currently unavailable"
  },
  "timestamp": "2025-01-27T12:00:00Z"
}
```

## Error Handling

### Error Categories

| HTTP Status | Error Type | Frontend Action |
|-------------|------------|-----------------|
| 400 | ValidationError | Show "Invalid request" message, allow retry with corrected input |
| 500 | AgentError, InternalError | Show "Server error" message, provide retry option |
| 503 | ServiceUnavailable | Show "Service unavailable" message, provide retry option |
| Network Error | NetworkError | Show "Network connection lost" message, provide retry option |
| Timeout (>30s) | TimeoutError | Show "Request timed out" message, provide retry option |

### Retry Logic

- **Automatic Retry**: Not implemented (user-initiated retry only)
- **Manual Retry**: User clicks retry button after error
- **Max Retries**: No limit (user-controlled)
- **Retry Delay**: Immediate (no exponential backoff on manual retry)

## Session Management

### Session Creation

- Session is created implicitly on first message to `/api/chat`
- Backend returns `session_id` in response
- Frontend stores `session_id` in browser sessionStorage
- Subsequent messages include stored `session_id`

### Session Validation

- Backend validates `session_id` on each request
- If session invalid/expired, backend may return error
- Frontend should handle session expiration gracefully (create new session)

## Timeout Configuration

- **Request Timeout**: 30 seconds (client-side)
- **Backend Processing**: No explicit timeout (handled by backend)

## CORS Configuration

Backend CORS middleware configured to allow:
- Origins: `http://localhost:3000`, `https://*.github.io`, `*` (MVP)
- Methods: `GET`, `POST`, `OPTIONS`
- Headers: `Content-Type`, `Accept`, `Authorization`
- Credentials: Allowed

## Rate Limiting

- Not implemented in MVP
- Future consideration: Backend may implement rate limiting

## Data Validation

### Client-Side Validation (Frontend)
- Message: Non-empty, max 2000 characters
- Session ID: Non-empty string (UUID format)

### Server-Side Validation (Backend)
- Message: Non-empty, max 2000 characters (enforced)
- Session ID: Valid UUID format (enforced)

## Response Format Consistency

All responses follow consistent structure:
- Success: `{ response, citations, session_id, metadata }`
- Error: `{ error: { type, message }, timestamp }`

## Versioning

- **Current Version**: v1 (implicit)
- **Versioning Strategy**: Not implemented in MVP
- **Future**: Consider API versioning if breaking changes needed

## Testing Contracts

### Test Scenarios

1. **Valid Request**: 200 OK with response and citations
2. **Empty Message**: 400 Bad Request with ValidationError
3. **Message Too Long**: 400 Bad Request with ValidationError
4. **Invalid Session**: 400/500 Error (backend-dependent)
5. **Network Error**: Network failure, timeout handling
6. **Server Error**: 500 Internal Server Error
7. **Service Unavailable**: 503 Service Unavailable

### Contract Testing

- Frontend should handle all documented error responses
- Frontend should validate request format before sending
- Frontend should handle missing optional fields gracefully

