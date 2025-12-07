# Research: RAG ChatKit Agent Integration

**Feature**: 010-rag-chatkit-agent  
**Date**: 2025-12-05  
**Status**: Complete

## Research Questions

### Q1: How does OpenAI Agents SDK integrate with Gemini models?

**Decision**: Use LiteLLM integration via `LitellmModel` class from `agents.extensions.models.litellm_model`.

**Rationale**: 
- OpenAI Agents SDK provides built-in support for multiple LLM providers through LiteLLM
- LiteLLM supports Gemini models via `gemini/gemini-2.5-flash` model identifier
- No need for custom provider implementation
- Maintains compatibility with Agents SDK tool calling and session management

**Alternatives Considered**:
- Direct Gemini API calls: Rejected - would lose Agents SDK orchestration benefits
- Custom provider implementation: Rejected - unnecessary complexity when LiteLLM exists
- OpenAI models only: Rejected - user requirement specifies Gemini for cost/quality reasons

**Implementation Pattern**:
```python
from agents.extensions.models.litellm_model import LitellmModel

agent = Agent(
    name="Textbook Assistant",
    model=LitellmModel(
        model="gemini/gemini-2.5-flash",
        api_key=os.getenv("GEMINI_API_KEY")
    ),
    tools=[query_textbook_tool]
)
```

---

### Q2: How does ChatKit session creation work with FastAPI backend?

**Decision**: Use OpenAI ChatKit Sessions API via `openai.chatkit.sessions.create()` to generate `client_secret` tokens.

**Rationale**:
- ChatKit requires a `client_secret` for frontend initialization
- Sessions API manages authentication and session lifecycle
- FastAPI endpoint `/api/chatkit/session` creates sessions on-demand
- Supports workflow-based agents (can specify agent workflow ID)

**Alternatives Considered**:
- Custom token generation: Rejected - ChatKit requires OpenAI-managed sessions
- Static client tokens: Rejected - sessions provide better security and lifecycle management
- No session management: Rejected - ChatKit requires client secrets for initialization

**Implementation Pattern**:
```python
from openai import OpenAI

@app.post("/api/chatkit/session")
async def create_chatkit_session():
    openai_client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
    session = openai_client.chatkit.sessions.create({
        # Optional: workflow configuration
    })
    return {"client_secret": session.client_secret}
```

---

### Q3: How to implement streaming responses with FastAPI and ChatKit?

**Decision**: Use Server-Sent Events (SSE) for streaming, with ChatKit's built-in streaming support.

**Rationale**:
- ChatKit supports streaming responses natively
- SSE is standard for one-way streaming from server to client
- FastAPI supports SSE via `StreamingResponse` with async generators
- Gemini chat completion supports streaming via `send_message_stream()`

**Alternatives Considered**:
- WebSocket: Rejected - overkill for one-way streaming, more complex
- Polling: Rejected - inefficient, higher latency
- No streaming: Rejected - user requirement (FR-006) and UX improvement (P2)

**Implementation Pattern**:
```python
from fastapi.responses import StreamingResponse
import json

@app.post("/api/chat/stream")
async def stream_chat(request: ChatRequest):
    async def generate():
        async for chunk in agent_stream_response:
            yield f"data: {json.dumps(chunk)}\n\n"
    
    return StreamingResponse(generate(), media_type="text/event-stream")
```

---

### Q4: How to structure the Qdrant query tool for Agents SDK?

**Decision**: Create a `@function_tool` decorated function that generates embeddings, queries Qdrant, and returns formatted chunks with metadata.

**Rationale**:
- Agents SDK automatically handles tool calling based on function signatures
- Tool function can be async and return structured data
- Metadata (module, section, URL) enables citation generation
- Reuses existing Qdrant infrastructure from feature 009

**Alternatives Considered**:
- Separate service layer: Accepted - tool function calls embedding and query services
- Direct Qdrant access in tool: Rejected - violates separation of concerns
- Synchronous tool: Rejected - async is better for I/O operations

**Implementation Pattern**:
```python
from agents import function_tool

@function_tool
async def query_textbook(
    query: str,
    max_results: int = 5
) -> str:
    """Query textbook content from Qdrant vector database."""
    # 1. Generate embedding
    embedding = await generate_embedding(query)
    # 2. Query Qdrant
    chunks = await qdrant_query(embedding, limit=max_results)
    # 3. Format with citations
    return format_chunks_with_citations(chunks)
```

---

### Q5: How to integrate ChatKit React component in Docusaurus?

**Decision**: Create a custom React page in `src/pages/chat.tsx` using ChatKit React bindings.

**Rationale**:
- Docusaurus supports custom React pages in `src/pages/`
- ChatKit React component (`@openai/chatkit-react`) provides declarative API
- Can be embedded as dedicated page or reusable component
- Supports Docusaurus routing and navigation

**Alternatives Considered**:
- MDX component: Possible but React page is cleaner for complex UI
- Iframe embedding: Rejected - loses integration benefits
- External page: Rejected - breaks user experience

**Implementation Pattern**:
```tsx
// src/pages/chat.tsx
import { ChatKit, useChatKit } from '@openai/chatkit-react';

export default function ChatPage() {
  const { control } = useChatKit({
    api: {
      async getClientSecret() {
        const res = await fetch('/api/chatkit/session', { method: 'POST' });
        return (await res.json()).client_secret;
      },
    },
  });

  return <ChatKit control={control} className="h-[600px]" />;
}
```

---

## Technology Decisions

### Gemini Embedding Model
- **Model**: `gemini-embedding-001`
- **Dimensions**: 1536 (matches Qdrant collection configuration from feature 009)
- **Rationale**: Free tier, multilingual support, matches existing Qdrant setup

### Gemini Chat Model
- **Model**: `gemini-2.5-flash`
- **Rationale**: Fast, free tier, good quality, streaming support

### Streaming Protocol
- **Protocol**: Server-Sent Events (SSE)
- **Rationale**: Standard, one-way streaming, ChatKit native support

### Session Management
- **Backend**: FastAPI in-memory (MVP) or optional Redis for distributed
- **Frontend**: ChatKit manages session state
- **Rationale**: Simple for MVP, scalable with Redis if needed

### Error Handling
- **Strategy**: Graceful degradation with user-friendly messages
- **Logging**: Structured logging for debugging
- **Fallbacks**: Return error messages instead of crashing

---

## Integration Patterns

### Agent → Tool → Qdrant Flow
1. User query received by agent
2. Agent decides to call `query_textbook` tool
3. Tool generates embedding (Gemini embedding-001)
4. Tool queries Qdrant for top 3-5 chunks
5. Tool formats chunks with citations
6. Agent receives tool result
7. Agent formats context for Gemini
8. Agent calls Gemini chat completion
9. Agent returns response with citations

### Frontend → Backend → Agent Flow
1. ChatKit sends message to `/api/chat`
2. FastAPI receives request, extracts query
3. FastAPI calls Agents SDK Runner with agent
4. Runner processes query through agent loop
5. Agent calls tools, generates response
6. Response streamed back via SSE
7. ChatKit displays response incrementally

---

## Dependencies Resolved

- ✅ OpenAI Agents SDK supports Gemini via LiteLLM
- ✅ ChatKit requires OpenAI Sessions API for client secrets
- ✅ FastAPI supports SSE streaming
- ✅ Gemini supports streaming chat completion
- ✅ Docusaurus supports custom React pages
- ✅ Qdrant infrastructure ready from feature 009

---

## Open Questions (None)

All technical questions resolved. Ready for implementation.

