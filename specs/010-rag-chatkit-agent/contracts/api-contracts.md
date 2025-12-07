# API Contracts: RAG ChatKit Agent Integration

**Feature**: 010-rag-chatkit-agent  
**Date**: 2025-12-05  
**Phase**: 1 - Design & Contracts

## Overview

This document defines the API contracts for the RAG ChatKit Agent Integration feature. The API provides endpoints for ChatKit session management and chat message processing with streaming support.

## API Endpoints

### POST /api/chatkit/session

**Description**: Creates a new ChatKit session and returns a client secret token for frontend initialization.

**Method**: POST

**Path**: `/api/chatkit/session`

**Query Parameters**: None

**Request Headers**:
- `Content-Type: application/json` (optional, no body required)

**Request Body**: None (empty body or `{}`)

**Response Codes**:
- `200 OK`: Session created successfully
- `500 Internal Server Error`: Failed to create session

**Response Body (200 OK)**:
```json
{
  "client_secret": "chatkit_secret_abc123xyz...",
  "session_id": "sess_abc123xyz...",
  "expires_at": "2025-12-05T13:00:00Z"
}
```

**Response Body (500 Internal Server Error)**:
```json
{
  "error": {
    "type": "SessionCreationError",
    "message": "Failed to create ChatKit session: ..."
  },
  "timestamp": "2025-12-05T12:00:00Z"
}
```

**Contract Validation**:
- Response must include `client_secret` string
- Response may include `session_id` string
- Response may include `expires_at` ISO 8601 timestamp
- Error responses must include `error` object with `type` and `message`

**Rate Limiting**: 
- 10 requests per minute per IP (FR-018)

---

### POST /api/chat

**Description**: Processes a user chat message through the AI agent and returns a response. Supports both streaming and non-streaming modes.

**Method**: POST

**Path**: `/api/chat`

**Query Parameters**:
- `stream` (boolean, optional): Enable streaming response (default: `false`)

**Request Headers**:
- `Content-Type: application/json`
- `Accept: application/json` (non-streaming) or `text/event-stream` (streaming)

**Request Body**:
```json
{
  "message": "What is ROS 2?",
  "session_id": "sess_abc123xyz...",
  "thread_id": "thread_abc123xyz..." // Optional
}
```

**Response Codes**:
- `200 OK`: Response generated successfully (non-streaming)
- `200 OK`: Streaming response (streaming mode)
- `400 Bad Request`: Invalid request (empty message, invalid session)
- `429 Too Many Requests`: Rate limit exceeded
- `500 Internal Server Error`: Agent processing failed

**Response Body (200 OK, non-streaming)**:
```json
{
  "response": "ROS 2 (Robot Operating System 2) is a middleware framework...",
  "citations": [
    {
      "citation_id": "cit_123",
      "module": "module-1-ros2-nervous-system",
      "section": "Introduction",
      "url": "/modules/module-1-ros2-nervous-system/introduction",
      "excerpt": "ROS 2 is the next generation of the Robot Operating System..."
    }
  ],
  "session_id": "sess_abc123xyz...",
  "thread_id": "thread_abc123xyz...",
  "metadata": {
    "model_used": "gemini-2.5-flash",
    "tokens_used": 150,
    "generation_time": 2.5
  }
}
```

**Response Body (200 OK, streaming)**:
```
Content-Type: text/event-stream

data: {"type": "start", "session_id": "sess_abc123xyz..."}

data: {"type": "chunk", "text": "ROS 2"}

data: {"type": "chunk", "text": " (Robot Operating System 2)"}

data: {"type": "chunk", "text": " is a middleware framework..."}

data: {"type": "citations", "citations": [...]}

data: {"type": "done", "metadata": {...}}

```

**Response Body (400 Bad Request)**:
```json
{
  "error": {
    "type": "ValidationError",
    "message": "Message cannot be empty"
  },
  "timestamp": "2025-12-05T12:00:00Z"
}
```

**Response Body (429 Too Many Requests)**:
```json
{
  "error": {
    "type": "RateLimitError",
    "message": "Rate limit exceeded. Please try again later.",
    "retry_after": 60
  },
  "timestamp": "2025-12-05T12:00:00Z"
}
```

**Response Body (500 Internal Server Error)**:
```json
{
  "error": {
    "type": "AgentError",
    "message": "Failed to process query: ..."
  },
  "timestamp": "2025-12-05T12:00:00Z"
}
```

**Contract Validation**:
- Request must include `message` string (non-empty, max 2000 chars)
- Request must include `session_id` string
- Response must include `response` string (non-streaming)
- Response must include `citations` array
- Each citation must include `module`, `url`, and optionally `section`, `excerpt`
- Streaming responses must use Server-Sent Events format
- Error responses must include `error` object with `type` and `message`

**Rate Limiting**: 
- 20 requests per minute per session (FR-018)

---

### GET /api/chat/health

**Description**: Health check endpoint for chat service, verifying agent and dependencies are operational.

**Method**: GET

**Path**: `/api/chat/health`

**Query Parameters**: None

**Request Headers**: None

**Request Body**: None

**Response Codes**:
- `200 OK`: Service is healthy
- `503 Service Unavailable`: Service is unhealthy

**Response Body (200 OK)**:
```json
{
  "status": "healthy",
  "agent_ready": true,
  "qdrant_connected": true,
  "gemini_available": true,
  "timestamp": "2025-12-05T12:00:00Z"
}
```

**Response Body (503 Service Unavailable)**:
```json
{
  "status": "unhealthy",
  "agent_ready": false,
  "qdrant_connected": true,
  "gemini_available": false,
  "errors": [
    "Gemini API unavailable"
  ],
  "timestamp": "2025-12-05T12:00:00Z"
}
```

**Contract Validation**:
- Response must include `status` field ("healthy" or "unhealthy")
- Response must include boolean flags for each dependency
- Response must include `timestamp` in ISO 8601 format
- Unhealthy responses must include `errors` array

---

## Internal API Contracts

### Dependency: get_agent

**Description**: FastAPI dependency that provides OpenAI Agents SDK Agent instance to route handlers.

**Type**: Dependency function (can be async)

**Signature**:
```python
def get_agent() -> Agent:
    """
    Dependency that provides Agent instance.
    Agent is initialized at application startup.
    """
    return agent_instance  # Agent from app state
```

**Usage**:
```python
@app.post("/api/chat")
async def chat_endpoint(
    request: ChatRequest,
    agent: Agent = Depends(get_agent)
):
    # Use agent for processing
    pass
```

**Contract Validation**:
- Must return Agent instance
- Agent must be initialized with Qdrant query tool
- Agent must be configured with Gemini model via LiteLLM

---

### Service: EmbeddingService

**Description**: Service for generating embeddings using Gemini embedding model.

**Interface**:
```python
class EmbeddingService:
    async def generate_embedding(self, text: str) -> list[float]:
        """
        Generate embedding vector for text using Gemini embedding-001.
        
        Args:
            text: Input text to embed
            
        Returns:
            1536-dimensional embedding vector
        """
```

**Contract Validation**:
- Must return list of 1536 floats
- Must handle API errors gracefully
- Must support async execution

---

### Service: ChatService

**Description**: Service for generating chat completions using Gemini chat model.

**Interface**:
```python
class ChatService:
    async def generate_response(
        self,
        messages: list[dict],
        stream: bool = False
    ) -> str | AsyncIterator[str]:
        """
        Generate chat completion using Gemini 2.5 Flash.
        
        Args:
            messages: Conversation history with roles and content
            stream: Whether to stream response
            
        Returns:
            Response text (non-streaming) or async iterator of chunks (streaming)
        """
```

**Contract Validation**:
- Must support streaming and non-streaming modes
- Must handle conversation history
- Must return formatted response text
- Streaming must yield incremental chunks

---

### Service: StreamingService

**Description**: Service for handling Server-Sent Events streaming.

**Interface**:
```python
class StreamingService:
    async def stream_response(
        self,
        agent_response: AsyncIterator[str],
        citations: list[dict]
    ) -> AsyncIterator[str]:
        """
        Format agent response as SSE events.
        
        Args:
            agent_response: Async iterator of response chunks
            citations: List of citation objects
            
        Yields:
            SSE-formatted event strings
        """
```

**Contract Validation**:
- Must yield SSE-formatted strings
- Must include start, chunk, citations, and done events
- Must handle errors gracefully

---

## Error Handling

### Standard Error Response Format

All error responses follow this structure:

```json
{
  "error": {
    "type": "ErrorType",
    "message": "Human-readable error message",
    "details": {} // Optional additional details
  },
  "timestamp": "2025-12-05T12:00:00Z"
}
```

### Error Types

- `ValidationError`: Invalid request (400)
- `RateLimitError`: Rate limit exceeded (429)
- `SessionError`: Session-related errors (401, 403)
- `AgentError`: Agent processing errors (500)
- `QdrantError`: Qdrant connection/query errors (503)
- `GeminiError`: Gemini API errors (503)
- `InternalError`: Unexpected errors (500)

---

## Rate Limiting

### Limits

- `/api/chatkit/session`: 10 requests/minute per IP
- `/api/chat`: 20 requests/minute per session

### Rate Limit Headers

```
X-RateLimit-Limit: 20
X-RateLimit-Remaining: 19
X-RateLimit-Reset: 1701777600
```

---

## Authentication

### MVP Authentication

- No authentication required (public access)
- Session-based identification via `session_id`
- Optional: API key for production (future enhancement)

---

## CORS Configuration

### Allowed Origins

- Docusaurus site domain (GitHub Pages)
- Local development origins (`localhost`, `127.0.0.1`)

### Headers

- `Access-Control-Allow-Origin: *` (MVP, restrict in production)
- `Access-Control-Allow-Methods: GET, POST, OPTIONS`
- `Access-Control-Allow-Headers: Content-Type, Accept`

---

## OpenAPI Schema

The FastAPI application auto-generates OpenAPI/Swagger documentation at `/docs` endpoint, including:

- All endpoint definitions
- Request/response schemas
- Error response formats
- Authentication requirements (if any)

