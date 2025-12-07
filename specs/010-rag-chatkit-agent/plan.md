# Implementation Plan: RAG ChatKit Agent Integration

**Branch**: `010-rag-chatkit-agent` | **Date**: 2025-12-05 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/010-rag-chatkit-agent/spec.md`

## Summary

The RAG ChatKit Agent Integration feature enables interactive, AI-powered learning through a chat interface embedded in the Docusaurus textbook. The system integrates OpenAI ChatKit (React component) in the frontend, FastAPI backend with OpenAI Agents SDK orchestration, Qdrant vector database querying, and Gemini chat completion for generating contextual answers with citations. The implementation provides real-time streaming responses, conversation context management, and source citations linking back to textbook content.

**Technical Approach**: Frontend ChatKit React component embedded in Docusaurus pages, FastAPI backend in Chatbot folder with OpenAI Agents SDK agent, custom Qdrant query tool function, Gemini embedding for query vectors, Gemini chat completion for answer generation, Server-Sent Events (SSE) for streaming, and Docker deployment to Hugging Face Spaces.

## Technical Context

**Language/Version**: 
- Python 3.11+ (backend - FastAPI, Agents SDK, Qdrant client)
- TypeScript/JavaScript (frontend - React, ChatKit)
- Node.js 18+ (for Docusaurus build)

**Primary Dependencies**: 
- Backend:
  - `fastapi` (latest stable) - Web framework
  - `openai-agents` (latest stable) - OpenAI Agents SDK
  - `qdrant-client` (latest stable) - Qdrant Python client (from feature 009)
  - `google-generativeai` (latest stable) - Gemini API client
  - `litellm` (latest stable) - LLM provider abstraction (for Gemini integration with Agents SDK)
  - `pydantic` - Configuration and data validation
  - `uvicorn` - ASGI server
- Frontend:
  - `@openai/chatkit-react` (latest stable) - ChatKit React component
  - `react` (latest stable) - React framework
  - `docusaurus` (latest stable) - Documentation framework

**Storage**: 
- Qdrant vector database (existing from feature 009-qdrant-setup)
- In-memory session storage (FastAPI) or optional Redis for distributed sessions
- No persistent database required for MVP (session state managed by ChatKit)

**Testing**: 
- Backend:
  - `pytest` - Test framework
  - `pytest-asyncio` - Async test support
  - `httpx` - Async HTTP client for testing FastAPI endpoints
  - `pytest-mock` - Mocking for Qdrant and Gemini API testing
- Frontend:
  - `@testing-library/react` - React component testing
  - `jest` - JavaScript test runner (if Docusaurus supports it)

**Target Platform**: 
- Frontend: Web browser (Docusaurus deployed to GitHub Pages)
- Backend: Hugging Face Spaces (Docker container, Linux-based)
- Development: Local Python environment with local Qdrant instance

**Project Type**: Full-stack web application (frontend + backend API)

**Performance Goals**: 
- Response time: 90% of queries answered within 5 seconds (SC-001)
- Streaming latency: 90% of responses begin streaming within 2 seconds (SC-005)
- Concurrent sessions: Support 10+ simultaneous chat sessions without degradation (SC-006)
- Query success rate: 95% of valid queries processed successfully (SC-008)
- Citation accuracy: 95% of responses include accurate citations (SC-003)

**Constraints**: 
- Must integrate with existing Qdrant infrastructure from feature 009-qdrant-setup (FR-021)
- Must be implemented in Chatbot folder in project root (FR-020)
- Must support Docker deployment to Hugging Face Spaces (FR-019)
- Must use Gemini for both embeddings (gemini-embedding-001) and chat completion (gemini-2.5-flash) (FR-010, FR-011)
- Must support streaming responses via SSE (FR-006)
- Must maintain conversation context across multiple turns (FR-005)
- Must validate queries (non-empty, reasonable length) (FR-016)
- Must implement rate limiting (FR-018)
- Must handle errors gracefully with user-friendly messages (FR-014)

**Scale/Scope**: 
- Single FastAPI application module in Chatbot folder
- One OpenAI Agents SDK agent instance with Qdrant query tool
- ChatKit React component embedded in Docusaurus pages
- Support for multiple concurrent chat sessions (10+ users)
- Real-time streaming responses
- Citation generation and linking

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### I. Documentation-First Architecture ✅
- ChatKit integration documentation in Docusaurus (React component usage)
- API documentation via FastAPI OpenAPI/Swagger
- Agent configuration and tool documentation
- Code comments and README for Chatbot folder

### II. Modular Content Organization ✅
- N/A for this feature (backend/frontend integration, not content module)
- Code organized in modular Python package structure (Chatbot/src/chatbot/)
- Frontend component isolated and reusable

### III. Vector Database Integration ✅
- Feature uses existing Qdrant infrastructure from feature 009-qdrant-setup
- Retrieves embedded textbook content via vector similarity search
- Supports citation generation from retrieved chunks with metadata
- Integrates with existing Qdrant connection and query infrastructure

### IV. AI Agent Architecture ✅
- Uses OpenAI Agents SDK for agent orchestration (FR-008)
- Connected to Qdrant vector database via custom function tool (FR-009)
- Agent responses traceable to source content via citations (FR-004)
- Agent API exposed via FastAPI with OpenAPI documentation (FR-007)
- Agent behavior deterministic for identical queries (within model constraints)

### V. Deployment Standards ✅
- FastAPI backend deploys to Hugging Face Space via Docker image (FR-019)
- Docusaurus frontend deploys to GitHub Pages (existing)
- Deployment configurations version-controlled
- Backend deployment failures don't affect book availability (decoupled systems)

### VI. API-First Backend Design ✅
- FastAPI provides RESTful endpoints for ChatKit frontend (FR-007)
- OpenAPI/Swagger documentation auto-generated
- Consistent error handling and status codes (FR-014)
- Backend independently testable and deployable
- Clear API contracts for frontend integration

**Constitution Compliance**: ✅ All applicable principles satisfied. No violations.

## Project Structure

### Documentation (this feature)

```text
specs/010-rag-chatkit-agent/
├── plan.md              # This file (/sp.plan command output)
├── research.md          # Phase 0 output (/sp.plan command)
├── data-model.md        # Phase 1 output (/sp.plan command)
├── quickstart.md        # Phase 1 output (/sp.plan command)
├── contracts/           # Phase 1 output (/sp.plan command)
│   └── api-contracts.md  # FastAPI endpoint contracts
└── tasks.md             # Phase 2 output (/sp.tasks command - NOT created by /sp.plan)
```

### Source Code (repository root)

```text
Chatbot/                          # Backend (FastAPI + Agents SDK)
├── src/
│   └── chatbot/
│       ├── __init__.py
│       ├── main.py              # FastAPI app entry point
│       ├── config.py             # Configuration (extends from 009)
│       ├── api/
│       │   ├── __init__.py
│       │   ├── routes.py         # ChatKit session and chat endpoints
│       │   └── dependencies.py  # FastAPI dependencies
│       ├── agent/
│       │   ├── __init__.py
│       │   ├── agent.py          # OpenAI Agents SDK agent definition
│       │   └── tools.py          # Qdrant query tool function
│       ├── services/
│       │   ├── __init__.py
│       │   ├── embedding.py      # Gemini embedding generation
│       │   ├── chat.py           # Gemini chat completion
│       │   └── streaming.py     # SSE streaming handler
│       ├── qdrant/               # Existing from 009 (reuse)
│       │   ├── client.py
│       │   ├── queries.py
│       │   └── collections.py
│       └── utils/
│           ├── __init__.py
│           ├── logging.py       # Existing from 009
│           └── retry.py         # Existing from 009
├── tests/
│   ├── unit/
│   │   ├── test_agent.py
│   │   ├── test_tools.py
│   │   └── test_services.py
│   ├── integration/
│   │   ├── test_chat_endpoint.py
│   │   └── test_streaming.py
│   └── contract/
│       └── test_api_contracts.py
├── pyproject.toml               # Dependencies (extends from 009)
├── Dockerfile                    # For Hugging Face Spaces
└── README.md

src/pages/                        # Docusaurus frontend
└── chat.tsx                      # ChatKit React component page

src/components/                   # Optional: Reusable components
└── ChatWidget.tsx                # ChatKit widget component (if reusable)
```

**Structure Decision**: 
- Backend code in `Chatbot/` folder (per FR-020 and existing structure from feature 009)
- Frontend ChatKit component in Docusaurus `src/pages/` for dedicated chat page
- Reuse existing Qdrant infrastructure from feature 009 (qdrant/ folder)
- Modular agent and services structure for maintainability
- Separate streaming service for SSE handling

## Complexity Tracking

> **No violations - all complexity justified by requirements**
