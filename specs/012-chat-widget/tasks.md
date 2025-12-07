# Tasks: Custom Chat Widget for Textbook

**Input**: Design documents from `/specs/012-chat-widget/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), data-model.md, contracts/, research.md, quickstart.md

**Tests**: Tests are OPTIONAL - not included as this is frontend component development without explicit TDD requirement.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3, US4)
- Include exact file paths in descriptions

## Path Conventions

- **Component directory**: `src/components/ChatWidget/` at repository root
- **Hooks**: `src/components/ChatWidget/hooks/`
- **Services**: `src/components/ChatWidget/services/`
- **Types**: `src/components/ChatWidget/types.ts`
- **Styles**: `src/components/ChatWidget/styles.module.css`
- **Integration**: `src/theme/Root.tsx` or `docusaurus.config.ts`

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and component structure

- [x] T001 Create ChatWidget component directory structure `src/components/ChatWidget/`
- [x] T002 [P] Create hooks subdirectory `src/components/ChatWidget/hooks/`
- [x] T003 [P] Create services subdirectory `src/components/ChatWidget/services/`
- [x] T004 [P] Verify Docusaurus configuration supports React component integration

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core types and infrastructure that MUST be complete before ANY user story implementation can begin

**⚠️ CRITICAL**: No user story implementation can begin until this phase is complete

- [x] T005 Create TypeScript type definitions file `src/components/ChatWidget/types.ts` with ChatMessage, ChatSession, Citation, ErrorInfo interfaces per data-model.md
- [x] T006 [P] Create chatService API layer `src/components/ChatWidget/services/chatService.ts` with base fetch configuration and error handling structure
- [x] T007 [P] Create useChatSession hook `src/components/ChatWidget/hooks/useChatSession.ts` with sessionStorage management functions (get, set, clear)
- [x] T008 [P] Create useMessageValidation hook `src/components/ChatWidget/hooks/useMessageValidation.ts` with character count and validation logic (2000 char limit, non-empty check)

**Checkpoint**: Foundation ready - user story implementation can now begin

---

## Phase 3: User Story 1 - Display Chat Widget on Textbook Pages (Priority: P1) 🎯 MVP

**Goal**: Students can see a chat widget integrated into the textbook interface that allows them to start a conversation with the AI assistant. The widget appears as a floating button in the bottom-right corner and can be toggled open/closed.

**Independent Test**: Can be fully tested by verifying the chat widget component renders correctly on a textbook page, displays as a floating button in the bottom-right corner, and opens to show the chat interface when clicked. This delivers immediate visual confirmation that the integration is working.

### Implementation for User Story 1

- [x] T009 [US1] Create ChatButton component `src/components/ChatWidget/ChatButton.tsx` with floating button UI, positioned bottom-right, with toggle icon
- [x] T010 [US1] Create ChatWindow component `src/components/ChatWidget/ChatWindow.tsx` as container for chat interface with open/closed state management
- [x] T011 [US1] Create main ChatWidget component `src/components/ChatWidget/index.tsx` that combines ChatButton and ChatWindow with toggle functionality
- [x] T012 [US1] Add CSS styles for floating button positioning in `src/components/ChatWidget/styles.module.css` (fixed position, bottom-right, z-index)
- [x] T013 [US1] Add CSS styles for ChatWindow container in `src/components/ChatWidget/styles.module.css` (dimensions, positioning, transitions)
- [x] T014 [US1] Integrate ChatWidget into Docusaurus root layout `src/theme/Root/index.tsx` (create if doesn't exist) or configure in `docusaurus.config.ts`

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently - widget displays and toggles open/closed

---

## Phase 4: User Story 2 - Connect Widget to FastAPI Backend (Priority: P1)

**Goal**: Students can ask questions through the chat widget. The widget successfully establishes a session with the FastAPI backend and sends messages to receive AI-generated responses about textbook content.

**Independent Test**: Can be fully tested by opening the browser developer console, sending a message through the widget, and verifying that a session is created with the FastAPI backend and that the widget receives a valid response. This delivers functional connectivity confirmation.

### Implementation for User Story 2

- [x] T015 [US2] Implement sendMessage function in `src/components/ChatWidget/services/chatService.ts` with POST request to `/api/chat` endpoint, request body formatting, and 30-second timeout using AbortController
- [x] T016 [US2] Create useChatAPI hook `src/components/ChatWidget/hooks/useChatAPI.ts` that wraps chatService.sendMessage with React state management for loading, error states
- [x] T017 [US2] Update useChatSession hook `src/components/ChatWidget/hooks/useChatSession.ts` to create session on first message (implicit session creation) and store sessionId in sessionStorage
- [x] T018 [US2] Create MessageInput component `src/components/ChatWidget/MessageInput.tsx` with text input field, send button, and integration with useMessageValidation hook
- [x] T019 [US2] Create MessageList component `src/components/ChatWidget/MessageList.tsx` to display conversation messages (user and assistant messages)
- [x] T020 [US2] Create LoadingIndicator component `src/components/ChatWidget/LoadingIndicator.tsx` to show loading state during API calls
- [x] T021 [US2] Integrate useChatAPI hook into ChatWidget `src/components/ChatWidget/index.tsx` to handle message sending and response display
- [x] T022 [US2] Update ChatWindow component `src/components/ChatWidget/ChatWindow.tsx` to include MessageList and MessageInput components
- [x] T023 [US2] Add error handling in useChatAPI hook `src/components/ChatWidget/hooks/useChatAPI.ts` to categorize errors (network, timeout, 4xx, 5xx) per FR-007
- [x] T024 [US2] Create ErrorMessage component `src/components/ChatWidget/ErrorMessage.tsx` to display specific error messages with retry button per FR-007 and FR-008

**Checkpoint**: At this point, User Story 2 should be fully functional and testable independently - widget connects to backend and displays responses

---

## Phase 5: User Story 3 - Maintain Conversation Context (Priority: P2)

**Goal**: Students can have multi-turn conversations with the AI assistant. The widget maintains conversation history within a session so the AI can provide contextually relevant follow-up responses.

**Independent Test**: Can be fully tested by sending multiple messages in sequence and verifying that each response is contextually aware of previous messages in the conversation. This delivers enhanced user experience for learning.

### Implementation for User Story 3

- [x] T025 [US3] Update ChatWidget component `src/components/ChatWidget/index.tsx` to maintain messages array in state, persisting across widget open/close
- [x] T026 [US3] Update useChatSession hook `src/components/ChatWidget/hooks/useChatSession.ts` to retrieve existing sessionId from sessionStorage on widget initialization
- [x] T027 [US3] Update useChatAPI hook `src/components/ChatWidget/hooks/useChatAPI.ts` to include sessionId in all API requests, using stored sessionId from useChatSession
- [x] T028 [US3] Update MessageList component `src/components/ChatWidget/MessageList.tsx` to display full conversation history from messages array
- [x] T029 [US3] Update ChatWidget component `src/components/ChatWidget/index.tsx` to preserve messages state when widget is closed and reopened (widget always starts closed on new page per FR-011)
- [x] T030 [US3] Add session reconnection logic in ChatWidget `src/components/ChatWidget/index.tsx` to restore conversation history when sessionId exists in sessionStorage on page navigation

**Checkpoint**: At this point, User Story 3 should be fully functional and testable independently - conversation history persists across page navigations

---

## Phase 6: User Story 4 - Display Citations and Source References (Priority: P2)

**Goal**: Students can verify information and explore source material. The widget displays citations that link back to relevant sections of the textbook when included in AI responses.

**Independent Test**: Can be fully tested by asking a question that should return citations and verifying that source references are displayed in the chat response with links to relevant textbook sections. This delivers transparency and educational value.

### Implementation for User Story 4

- [x] T031 [US4] Create Citation component `src/components/ChatWidget/Citation.tsx` to render individual citation with clickable link using Docusaurus Link component
- [x] T032 [US4] Update ChatMessage type in `src/components/ChatWidget/types.ts` to include citations array in assistant messages
- [x] T033 [US4] Update useChatAPI hook `src/components/ChatWidget/hooks/useChatAPI.ts` to parse citations array from API response and attach to assistant message
- [x] T034 [US4] Update MessageList component `src/components/ChatWidget/MessageList.tsx` to render Citation components for assistant messages with citations
- [x] T035 [US4] Add CSS styles for citation display in `src/components/ChatWidget/styles.module.css` (formatting, spacing, link styling)
- [x] T036 [US4] Implement citation navigation in Citation component `src/components/ChatWidget/Citation.tsx` using Docusaurus Link component for internal routing to textbook sections

**Checkpoint**: At this point, User Story 4 should be fully functional and testable independently - citations display and navigate correctly

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Error handling, validation, responsive design, and edge case handling

**Note**: Performance metrics (SC-001: 5 second load time, SC-003: 10 second response time) are production monitoring metrics. Frontend implementation focuses on efficient rendering and API timeout handling. Performance testing should be conducted in production environment with real network conditions.

- [x] T037 Implement input validation in MessageInput component `src/components/ChatWidget/MessageInput.tsx` to prevent empty messages and enforce 2000 character limit per FR-013
- [x] T038 Add character count display in MessageInput component `src/components/ChatWidget/MessageInput.tsx` showing current count and limit (e.g., "1500/2000") with visual feedback when approaching limit
- [x] T039 Add duplicate message prevention in ChatWidget `src/components/ChatWidget/index.tsx` to disable send button while message is sending per FR-016
- [x] T040 Implement responsive design breakpoints in `src/components/ChatWidget/styles.module.css` for mobile (<768px) and desktop (≥768px) with appropriate max-width and max-height constraints per FR-015 and SC-005
- [x] T041 Add error message display for validation errors in MessageInput component `src/components/ChatWidget/MessageInput.tsx` (empty message, character limit exceeded)
- [x] T042 Implement timeout error handling in chatService `src/components/ChatWidget/services/chatService.ts` with 30-second timeout and specific "Request timed out" message per FR-017
- [x] T043 Add retry functionality in ErrorMessage component `src/components/ChatWidget/ErrorMessage.tsx` to allow users to retry failed requests per FR-008
- [x] T044 Add sessionStorage error handling in useChatSession hook `src/components/ChatWidget/hooks/useChatSession.ts` for QuotaExceededError and privacy mode scenarios (fallback to in-memory)
- [x] T045 Test widget on multiple screen sizes (320px, 768px, 1024px, 2560px) to verify responsive design per SC-005
- [x] T046 Verify widget positioning doesn't overlap with Docusaurus UI elements (navigation, footer) by testing z-index and positioning
- [x] T047 Add network interruption detection and recovery in chatService `src/components/ChatWidget/services/chatService.ts` to detect offline/network errors with user-friendly messages
- [x] T048 Add response format validation in chatService `src/components/ChatWidget/services/chatService.ts` to validate API response structure (required fields: response, session_id, optional citations array) and handle malformed responses with user-friendly error message per edge case specification
- [x] T049 Add performance considerations for widget initialization in ChatWidget component `src/components/ChatWidget/index.tsx` to verify widget opens within 5 seconds of page load per SC-001, including sessionStorage retrieval and initial render timing

---

## Dependencies

### User Story Completion Order

1. **User Story 1 (P1)** - Display Widget: Must complete first (foundational UI)
2. **User Story 2 (P1)** - Backend Connectivity: Depends on US1 (needs widget UI to send messages)
3. **User Story 3 (P2)** - Conversation Context: Depends on US2 (needs working API to maintain history)
4. **User Story 4 (P2)** - Citations: Depends on US2 (needs API responses with citations)

### Task Dependencies

- T005-T008 (Foundational): Must complete before any user story tasks
- T009-T014 (US1): Can start after foundational phase
- T015-T024 (US2): Depends on US1 completion
- T025-T030 (US3): Depends on US2 completion
- T031-T036 (US4): Depends on US2 completion
- T037-T046 (Polish): Can be done in parallel with US3/US4 or after

## Parallel Execution Opportunities

### Within User Story 1
- T009, T010, T011 can be developed in parallel (different components)
- T012, T013 can be done in parallel (different CSS sections)

### Within User Story 2
- T015, T016 can be done in parallel (service and hook)
- T018, T019, T020 can be done in parallel (different components)
- T021, T022 can be done after T018-T020

### Within User Story 4
- T031, T032 can be done in parallel (component and type update)
- T033, T034 can be done after T031-T032

### Polish Phase
- Most polish tasks (T037-T044) can be done in parallel as they touch different components

## Implementation Strategy

### MVP Scope (Minimum Viable Product)

**MVP includes**: User Story 1 + User Story 2
- Widget displays and toggles (US1)
- Widget connects to backend and shows responses (US2)

This delivers core functionality: users can see the widget and have conversations with the AI assistant.

### Incremental Delivery

1. **Sprint 1 (MVP)**: US1 + US2
   - Deliverable: Functional chat widget with backend connectivity
   - Test: Widget appears, sends messages, receives responses

2. **Sprint 2**: US3
   - Deliverable: Conversation history persistence
   - Test: Multi-turn conversations work, history persists across pages

3. **Sprint 3**: US4 + Polish
   - Deliverable: Citations display + error handling + responsive design
   - Test: Citations clickable, errors handled gracefully, responsive on all screen sizes

## Summary

- **Total Tasks**: 49
- **Tasks per User Story**:
  - User Story 1: 6 tasks
  - User Story 2: 10 tasks
  - User Story 3: 6 tasks
  - User Story 4: 6 tasks
  - Polish: 13 tasks
  - Setup/Foundational: 8 tasks

- **Parallel Opportunities**: Multiple tasks can be executed in parallel within each phase
- **Independent Test Criteria**: Each user story has clear, independent test criteria
- **Suggested MVP Scope**: User Story 1 + User Story 2 (16 tasks total)

