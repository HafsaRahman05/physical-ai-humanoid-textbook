# Quickstart: RAG ChatKit Agent Integration

**Feature**: 010-rag-chatkit-agent  
**Date**: 2025-12-05

## Prerequisites

- Python 3.11+ installed
- `uv` package manager installed
- Node.js 18+ and npm installed
- Qdrant vector database set up (feature 009-qdrant-setup complete)
- Textbook content embedded in Qdrant
- OpenAI API key (for ChatKit sessions)
- Gemini API key (for embeddings and chat completion)
- Docusaurus site set up and running

## Backend Setup

### 1. Navigate to Chatbot Directory

```bash
cd Chatbot
```

### 2. Install Dependencies

```bash
uv sync
```

This installs:
- `fastapi` - Web framework
- `openai-agents[litellm]` - Agents SDK with LiteLLM support
- `google-generativeai` - Gemini API client
- `qdrant-client` - Qdrant client (from feature 009)
- `uvicorn` - ASGI server
- Development dependencies (pytest, httpx, etc.)

### 3. Configure Environment Variables

Create `.env` file in `Chatbot/` directory:

```bash
# Qdrant Configuration (from feature 009)
QDRANT_URL=https://your-qdrant-cluster.qdrant.io
QDRANT_API_KEY=your-qdrant-api-key
QDRANT_COLLECTION_NAME=textbook_content

# Gemini Configuration
GEMINI_API_KEY=your-gemini-api-key

# OpenAI Configuration (for ChatKit sessions)
OPENAI_API_KEY=your-openai-api-key

# Optional: Streaming
ENABLE_STREAMING=true
```

### 4. Run FastAPI Server

```bash
uv run uvicorn chatbot.main:app --reload --host 0.0.0.0 --port 8000
```

Server starts at `http://localhost:8000`

### 5. Verify Backend

```bash
# Health check
curl http://localhost:8000/api/chat/health

# Create ChatKit session
curl -X POST http://localhost:8000/api/chatkit/session
```

## Frontend Setup

### 1. Install ChatKit React Package

```bash
cd ..  # Back to project root
npm install @openai/chatkit-react
```

### 2. Create Chat Page

Create `src/pages/chat.tsx`:

```tsx
import React from 'react';
import { ChatKit, useChatKit } from '@openai/chatkit-react';

export default function ChatPage() {
  const { control } = useChatKit({
    api: {
      async getClientSecret() {
        const res = await fetch('http://localhost:8000/api/chatkit/session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        });
        const { client_secret } = await res.json();
        return client_secret;
      },
    },
  });

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Textbook Chat Assistant</h1>
      <ChatKit control={control} className="h-[600px] w-full" />
    </div>
  );
}
```

### 3. Configure ChatKit Backend URL

Update ChatKit configuration to point to your FastAPI backend:

```tsx
const { control } = useChatKit({
  api: {
    url: 'http://localhost:8000/api/chat',  // Your FastAPI backend
    async getClientSecret() {
      // ... session creation
    },
  },
});
```

### 4. Run Docusaurus

```bash
npm start
```

Navigate to `http://localhost:3000/chat` to see the chat interface.

## Testing

### Backend Tests

```bash
cd Chatbot
uv run pytest
```

### Manual Testing

1. **Test Session Creation**:
   ```bash
   curl -X POST http://localhost:8000/api/chatkit/session
   ```

2. **Test Chat Endpoint** (non-streaming):
   ```bash
   curl -X POST http://localhost:8000/api/chat \
     -H "Content-Type: application/json" \
     -d '{
       "message": "What is ROS 2?",
       "session_id": "test-session"
     }'
   ```

3. **Test Streaming**:
   ```bash
   curl -X POST "http://localhost:8000/api/chat?stream=true" \
     -H "Content-Type: application/json" \
     -H "Accept: text/event-stream" \
     -d '{
       "message": "What is ROS 2?",
       "session_id": "test-session"
     }'
   ```

## Deployment

### Backend (Hugging Face Spaces)

1. **Build Docker Image**:
   ```bash
   cd Chatbot
   docker build -t rag-chatkit-agent .
   ```

2. **Push to Hugging Face**:
   - Create Hugging Face Space
   - Configure secrets (API keys, Qdrant credentials)
   - Deploy Docker image

### Frontend (GitHub Pages)

1. **Update ChatKit Backend URL**:
   ```tsx
   const API_URL = process.env.NODE_ENV === 'production'
     ? 'https://your-huggingface-space.hf.space'
     : 'http://localhost:8000';
   ```

2. **Build and Deploy**:
   ```bash
   npm run build
   # Deploy to GitHub Pages (existing workflow)
   ```

## Troubleshooting

### Backend Issues

- **Qdrant Connection Failed**: Check `QDRANT_URL` and `QDRANT_API_KEY`
- **Gemini API Error**: Verify `GEMINI_API_KEY` is set
- **Agent Not Responding**: Check agent initialization in `chatbot/agent/agent.py`

### Frontend Issues

- **ChatKit Not Loading**: Check browser console for errors
- **Session Creation Failed**: Verify backend is running and accessible
- **CORS Errors**: Configure CORS in FastAPI (`main.py`)

### Common Errors

- `ModuleNotFoundError: No module named 'agents'`: Run `uv sync`
- `QdrantConnectionError`: Check Qdrant credentials and network
- `Gemini API Key not found`: Set `GEMINI_API_KEY` in `.env`

## Next Steps

- Implement rate limiting (FR-018)
- Add error handling improvements (FR-014)
- Optimize streaming performance (FR-006)
- Add citation formatting (FR-004)
- Implement session persistence (optional Redis)

## Resources

- [OpenAI Agents SDK Docs](https://github.com/openai/openai-agents-python)
- [ChatKit React Docs](https://github.com/openai/chatkit-js)
- [Gemini API Docs](https://ai.google.dev/docs)
- [FastAPI Docs](https://fastapi.tiangolo.com)
- [Qdrant Docs](https://qdrant.tech/documentation/)

