# Tasks: RAG ChatKit Agent Integration

**Input**: Design documents from `/specs/010-rag-chatkit-agent/`  
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: Tests are OPTIONAL - not explicitly requested in spec, so test tasks are omitted. Focus on implementation tasks.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Backend**: `Chatbot/src/chatbot/` (extends existing structure from feature 009)
- **Frontend**: `src/pages/` (Docusaurus pages)
- **Tests**: `Chatbot/tests/` (if needed)

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and dependency management

- [X] T001 Extend pyproject.toml in Chatbot/ with OpenAI Agents SDK and LiteLLM dependencies
- [X] T002 [P] Create agent/ directory structure in Chatbot/src/chatbot/agent/ with __init__.py
- [X] T003 [P] Create services/ directory structure in Chatbot/src/chatbot/services/ with __init__.py
- [X] T004 [P] Create api/ directory structure in Chatbot/src/chatbot/api/ with __init__.py (if not exists)
- [X] T005 Extend .env.example in Chatbot/ with GEMINI_API_KEY and OPENAI_API_KEY configuration
- [X] T006 [P] Install ChatKit React package in project root: npm install @openai/chatkit-react

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T007 Extend config.py in Chatbot/src/chatbot/config.py with Gemini and OpenAI API key configuration
- [X] T008 [P] Create exception classes in Chatbot/src/chatbot/exceptions.py for agent, embedding, and chat errors
- [X] T009 [P] Create agent initialization infrastructure in Chatbot/src/chatbot/agent/__init__.py for agent instance management
- [X] T010 [P] Create base service interfaces in Chatbot/src/chatbot/services/__init__.py
- [X] T011 Update main.py in Chatbot/src/chatbot/main.py to initialize agent at startup (lifespan event)
- [X] T012 [P] Add CORS middleware configuration in Chatbot/src/chatbot/main.py for Docusaurus frontend

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Ask Questions About Textbook Content (Priority: P1) 🎯 MVP

**Goal**: Enable users to ask questions about textbook content through chat interface and receive AI-generated answers with citations

**Independent Test**: Embed ChatKit component in Docusaurus page, send test query "What is ROS 2?", verify system returns relevant answer with citations to textbook modules

### Implementation for User Story 1

- [X] T013 [P] [US1] Implement EmbeddingService in Chatbot/src/chatbot/services/embedding.py using Gemini embedding-001 model
- [X] T014 [P] [US1] Implement Qdrant query tool function in Chatbot/src/chatbot/agent/tools.py with @function_tool decorator
- [X] T015 [US1] Implement ChatService in Chatbot/src/chatbot/services/chat.py using Gemini 2.5 Flash for chat completion (depends on T013)
- [X] T016 [US1] Create Agent definition in Chatbot/src/chatbot/agent/agent.py with Qdrant query tool and Gemini model via LiteLLM (depends on T014, T015)
- [X] T017 [US1] Implement citation formatting utility in Chatbot/src/chatbot/utils/citations.py to format Retrieved Chunks as citations
- [X] T018 [US1] Implement POST /api/chatkit/session endpoint in Chatbot/src/chatbot/api/routes.py for ChatKit session creation
- [X] T019 [US1] Implement POST /api/chat endpoint in Chatbot/src/chatbot/api/routes.py for non-streaming chat message processing (depends on T016)
- [X] T020 [US1] Implement query validation in Chatbot/src/chatbot/api/routes.py (non-empty, max 2000 chars per FR-016)
- [X] T021 [US1] Implement get_agent dependency in Chatbot/src/chatbot/api/dependencies.py for FastAPI dependency injection
- [X] T022 [US1] Create ChatKit React component page in src/pages/chat.tsx with useChatKit hook and session creation
- [X] T023 [US1] Configure ChatKit component in src/pages/chat.tsx to call /api/chat endpoint for message processing
- [X] T024 [US1] Add basic error handling in Chatbot/src/chatbot/api/routes.py with user-friendly error messages
- [X] T025 [US1] Add logging for chat interactions in Chatbot/src/chatbot/api/routes.py per FR-017

**Checkpoint**: At this point, User Story 1 should be fully functional - users can ask questions and receive answers with citations

---

## Phase 4: User Story 2 - Real-Time Streaming Responses (Priority: P2)

**Goal**: Enable real-time streaming of AI responses as they are generated, improving perceived responsiveness

**Independent Test**: Submit query with stream=true parameter, verify responses appear incrementally in chat interface within 2 seconds

### Implementation for User Story 2

- [ ] T026 [P] [US2] Implement StreamingService in Chatbot/src/chatbot/services/streaming.py for SSE event formatting
- [ ] T027 [US2] Extend ChatService in Chatbot/src/chatbot/services/chat.py to support streaming mode with async iterator (depends on T015)
- [ ] T028 [US2] Implement streaming endpoint variant in Chatbot/src/chatbot/api/routes.py for POST /api/chat?stream=true (depends on T026, T027)
- [ ] T029 [US2] Update ChatKit component in src/pages/chat.tsx to handle streaming responses via EventSource or fetch streaming
- [ ] T030 [US2] Add streaming indicator UI in src/pages/chat.tsx to show when response is being generated
- [ ] T031 [US2] Handle streaming errors gracefully in Chatbot/src/chatbot/api/routes.py with fallback to non-streaming

**Checkpoint**: At this point, User Stories 1 AND 2 should both work - users can get streaming responses

---

## Phase 5: User Story 3 - View Source Citations (Priority: P2)

**Goal**: Display clickable citations in chat responses linking back to source textbook content

**Independent Test**: Receive answer with citations, verify citations display with module/section info and clickable URLs

### Implementation for User Story 3

- [ ] T032 [P] [US3] Enhance citation formatting in Chatbot/src/chatbot/utils/citations.py to include module, section, URL, excerpt
- [ ] T033 [US3] Update Agent response generation in Chatbot/src/chatbot/agent/agent.py to include formatted citations in response (depends on T032)
- [ ] T034 [US3] Update API response format in Chatbot/src/chatbot/api/routes.py to include citations array in response payload
- [ ] T035 [US3] Implement citation rendering in src/pages/chat.tsx to display citations as clickable links
- [ ] T036 [US3] Add citation click handler in src/pages/chat.tsx to navigate to Docusaurus URL
- [ ] T037 [US3] Style citations in src/pages/chat.tsx with clear visual distinction and hover effects

**Checkpoint**: At this point, all P1 and P2 stories should work - users see citations and can navigate to sources

---

## Phase 6: User Story 4 - Handle Errors Gracefully (Priority: P3)

**Goal**: Provide user-friendly error messages and graceful fallbacks for various failure conditions

**Independent Test**: Simulate Qdrant unavailability, invalid API keys, network timeouts - verify clear error messages displayed

### Implementation for User Story 4

- [ ] T038 [P] [US4] Extend exception classes in Chatbot/src/chatbot/exceptions.py with specific error types (QdrantError, GeminiError, AgentError)
- [ ] T039 [US4] Implement error handling middleware in Chatbot/src/chatbot/middleware.py for standardized error responses (depends on T038)
- [ ] T040 [US4] Add Qdrant connection error handling in Chatbot/src/chatbot/agent/tools.py with fallback messages
- [ ] T041 [US4] Add Gemini API error handling in Chatbot/src/chatbot/services/chat.py and Chatbot/src/chatbot/services/embedding.py
- [ ] T042 [US4] Implement "no results" handling in Chatbot/src/chatbot/agent/tools.py when Qdrant returns empty results
- [ ] T043 [US4] Add error message display in src/pages/chat.tsx for API errors with retry suggestions
- [ ] T044 [US4] Implement GET /api/chat/health endpoint in Chatbot/src/chatbot/api/routes.py to check agent, Qdrant, Gemini status
- [ ] T045 [US4] Add structured error logging in Chatbot/src/chatbot/api/routes.py for debugging

**Checkpoint**: All user stories should now handle errors gracefully

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] T046 [P] Implement rate limiting middleware in Chatbot/src/chatbot/middleware.py (10 req/min for session, 20 req/min for chat per FR-018)
- [ ] T047 [P] Add rate limit headers in Chatbot/src/chatbot/middleware.py (X-RateLimit-Limit, X-RateLimit-Remaining, X-RateLimit-Reset)
- [ ] T048 [P] Update README.md in Chatbot/ with agent setup, API endpoints, and configuration instructions
- [ ] T049 [P] Add API documentation comments in Chatbot/src/chatbot/api/routes.py for OpenAPI/Swagger generation
- [ ] T050 [P] Update Dockerfile in Chatbot/ for Hugging Face Spaces deployment with all new dependencies
- [ ] T051 [P] Implement conversation context management in Chatbot/src/chatbot/api/routes.py to maintain session history per FR-005:
  - Create in-memory conversation history storage: Dict[str, List[Dict[str, Any]]] keyed by session_id
  - Message format: {"role": "user|assistant", "content": str, "timestamp": datetime}
  - Store conversation history per session (max 20 messages per session for memory efficiency)
  - Integrate with Agents SDK Runner session parameter or manual history prepending
  - Retrieve history before agent.run() and append new messages after response
  - Support context retrieval for follow-up questions (FR-005, SC-004: 5+ turns)
- [ ] T052 [P] Optimize response time in Chatbot/src/chatbot/agent/agent.py and services for SC-001 (90% under 5 seconds)
- [ ] T053 [P] Implement session management in Chatbot/src/chatbot/api/routes.py (in-memory storage for MVP):
  - Create session storage dictionary: Dict[str, SessionData] keyed by session_id
  - SessionData structure: {session_id, created_at, last_activity, thread_id, message_count}
  - FastAPI async request handling enables concurrent access (no explicit locking needed for reads)
  - Support 10+ concurrent sessions per SC-006 (FastAPI async handles concurrent requests safely)
  - Track session metadata for rate limiting and analytics
  - Optional: Add session cleanup task for expired sessions (future enhancement)
- [ ] T054 [P] Update quickstart.md validation - verify all setup steps work end-to-end
- [ ] T055 Code cleanup and refactoring across all implemented files
- [ ] T056 [P] Add comprehensive logging throughout Chatbot/src/chatbot/ for debugging and monitoring

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-6)**: All depend on Foundational phase completion
  - User stories can proceed sequentially in priority order (P1 → P2 → P3)
  - US2 and US3 can potentially work in parallel after US1 (different files)
- **Polish (Phase 7)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - Depends on US1 ChatService and API structure
- **User Story 3 (P2)**: Can start after Foundational (Phase 2) - Depends on US1 citation infrastructure
- **User Story 4 (P3)**: Can start after Foundational (Phase 2) - Enhances all previous stories

### Within Each User Story

- Services before agent/endpoints (T013, T014, T015 before T016, T019)
- Agent definition before API endpoints (T016 before T019)
- Backend before frontend (API routes before React component)
- Core implementation before enhancements

### Parallel Opportunities

- **Phase 1**: T002, T003, T004, T006 can run in parallel
- **Phase 2**: T008, T009, T010, T012 can run in parallel
- **Phase 3 (US1)**: T013, T014 can run in parallel; T017, T018 can run in parallel after dependencies
- **Phase 4 (US2)**: T026 can run in parallel with other tasks
- **Phase 5 (US3)**: T032 can run in parallel
- **Phase 6 (US4)**: T038, T040, T041 can run in parallel
- **Phase 7**: Most tasks marked [P] can run in parallel

---

## Parallel Example: User Story 1

```bash
# Launch embedding and tool implementation in parallel:
Task: "Implement EmbeddingService in Chatbot/src/chatbot/services/embedding.py"
Task: "Implement Qdrant query tool function in Chatbot/src/chatbot/agent/tools.py"

# After dependencies, launch API and frontend in parallel:
Task: "Implement POST /api/chatkit/session endpoint"
Task: "Create ChatKit React component page in src/pages/chat.tsx"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (T001-T006)
2. Complete Phase 2: Foundational (T007-T012) - **CRITICAL - blocks all stories**
3. Complete Phase 3: User Story 1 (T013-T025)
4. **STOP and VALIDATE**: Test User Story 1 independently
   - Start FastAPI server
   - Open Docusaurus chat page
   - Send test query "What is ROS 2?"
   - Verify answer with citations
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 (Streaming) → Test independently → Deploy/Demo
4. Add User Story 3 (Citations) → Test independently → Deploy/Demo
5. Add User Story 4 (Error Handling) → Test independently → Deploy/Demo
6. Add Polish phase → Final deployment

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1 (core chat)
   - Developer B: User Story 2 (streaming) - can start after US1 ChatService
   - Developer C: User Story 3 (citations) - can start after US1 citation utils
3. Developer D: User Story 4 (error handling) - can enhance all stories
4. Stories complete and integrate independently

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Reuses Qdrant infrastructure from feature 009 (no need to recreate)
- ChatKit manages frontend session state - backend tracks minimal session info
- MVP focuses on User Story 1 - streaming and enhanced citations are enhancements
- All file paths are relative to project root unless specified
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: modifying existing Qdrant code from feature 009, breaking existing functionality

