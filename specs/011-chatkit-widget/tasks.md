# Tasks: OpenAI ChatKit Widget Integration

**Input**: Design documents from `/specs/011-chatkit-widget/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Tests are OPTIONAL - not explicitly requested in specification, so test tasks are not included.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Web app**: Frontend components in `src/components/`, theme in `src/theme/`
- Paths shown below follow Docusaurus structure from plan.md

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [X] T001 Install @openai/chatkit-react package in package.json
- [X] T002 [P] Create ChatWidget component directory structure at src/components/ChatWidget/
- [X] T003 [P] Verify Docusaurus Root component swizzle capability (check if src/theme/Root/ exists)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T004 Create backend URL configuration constant in src/components/ChatWidget/config.ts
- [X] T005 [P] Swizzle Docusaurus Root component using `npm run swizzle @docusaurus/theme-classic Root -- --wrap`
- [X] T006 Create base widget state management structure (WidgetState type) in src/components/ChatWidget/types.ts

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Display ChatKit Widget on Textbook Pages (Priority: P1) 🎯 MVP

**Goal**: Display a floating toggle button on all textbook pages that opens the ChatKit widget when clicked. Widget should be visible, accessible, and responsive.

**Independent Test**: Verify the ChatKit widget toggle button renders correctly on any textbook page, displays the chat interface when clicked, and shows the initial greeting message. Test across different screen sizes (320px to 2560px width).

### Implementation for User Story 1

- [X] T007 [US1] Create main ChatWidget component with toggle button state in src/components/ChatWidget/index.tsx
- [X] T008 [US1] Implement floating toggle button UI with fixed positioning (bottom-right) in src/components/ChatWidget/index.tsx
- [X] T009 [US1] Create ChatKitWrapper component skeleton in src/components/ChatWidget/ChatKitWrapper.tsx
- [X] T010 [US1] Create widget container styles with responsive dimensions (max 400px × 600px) in src/components/ChatWidget/styles.module.css
- [X] T011 [US1] Implement widget open/close state management in src/components/ChatWidget/index.tsx
- [X] T012 [US1] Integrate ChatWidget component into Docusaurus Root component in src/theme/Root/index.tsx
- [X] T013 [US1] Add basic accessibility attributes (aria-label, keyboard navigation) to toggle button in src/components/ChatWidget/index.tsx
- [ ] T014 [US1] Test widget visibility and toggle functionality across different screen sizes

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently - widget toggle button visible, opens/closes widget interface

---

## Phase 4: User Story 2 - Connect Widget to FastAPI Backend (Priority: P1)

**Goal**: Widget successfully authenticates with FastAPI backend and establishes a session when first opened. Messages are transmitted to backend endpoints.

**Independent Test**: Open browser developer console, click widget toggle, verify session creation request to `/api/chatkit/session` endpoint, verify widget receives `client_secret`. Send a test message and verify it's transmitted to `/chatkit` endpoint.

### Implementation for User Story 2

- [X] T015 [US2] Create useChatKitSession hook for session management in src/components/ChatWidget/useChatKitSession.ts (integrated into ChatKitWrapper)
- [X] T016 [US2] Implement getClientSecret callback function (async, accepts optional existing parameter) that fetches client_secret from /api/chatkit/session endpoint in src/components/ChatWidget/ChatKitWrapper.tsx
- [X] T017 [US2] Configure ChatKit api.url property to point to backend /chatkit endpoint in src/components/ChatWidget/ChatKitWrapper.tsx
- [X] T018 [US2] Implement lazy initialization - only call useChatKit hook when widget first opens (conditional rendering) in src/components/ChatWidget/ChatKitWrapper.tsx
- [X] T019 [US2] Add connection state management (isConnecting, isInitialized) using onReady event handler in src/components/ChatWidget/index.tsx
- [X] T020 [US2] Integrate ChatKit component with useChatKit hook, passing getClientSecret and api.url configuration in src/components/ChatWidget/ChatKitWrapper.tsx
- [ ] T021 [US2] Test session creation flow with running FastAPI backend
- [ ] T022 [US2] Test message sending to /chatkit endpoint

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently - widget connects to backend and can send messages

---

## Phase 5: User Story 3 - Display Streaming AI Responses (Priority: P2)

**Goal**: AI responses appear incrementally in real-time as they're streamed from the backend, providing immediate feedback to users.

**Independent Test**: Send a question through the widget and observe that the AI's response appears incrementally (word-by-word or chunk-by-chunk) rather than all at once. Verify visual indicator shows during streaming.

### Implementation for User Story 3

- [ ] T023 [US3] Verify ChatKit streaming works automatically via SSE (no configuration needed - ChatKit handles Server-Sent Events internally) in src/components/ChatWidget/ChatKitWrapper.tsx
- [ ] T024 [US3] Implement onResponseStart and onResponseEnd event handlers to manage loading state for streaming responses in src/components/ChatWidget/ChatKitWrapper.tsx
- [ ] T025 [US3] Add visual loading indicator UI that shows/hides based on onResponseStart/onResponseEnd events in src/components/ChatWidget/index.tsx
- [ ] T026 [US3] Test streaming response display with backend
- [ ] T027 [US3] Verify response appears incrementally and completes properly

**Checkpoint**: At this point, User Stories 1, 2, AND 3 should all work independently - widget displays streaming responses

---

## Phase 6: User Story 4 - Handle Widget Errors Gracefully (Priority: P2)

**Goal**: Widget displays user-friendly error messages and allows recovery through automatic retry (exponential backoff) and manual retry options.

**Independent Test**: Simulate network errors (disconnect network, stop backend), verify automatic retry attempts (2-3 with exponential backoff), verify manual retry button appears after automatic retries fail, verify widget recovers when conditions improve.

### Implementation for User Story 4

- [ ] T028 [US4] Create ErrorState type definition (message: string, type: 'network'|'backend'|'session'|'unknown', retryable: boolean, timestamp: Date) in src/components/ChatWidget/types.ts
- [ ] T029 [US4] Create useErrorRetry hook with exponential backoff logic (delays: 1s, 2s, 4s for 2-3 attempts) in src/components/ChatWidget/useErrorRetry.ts
- [ ] T030 [US4] Implement error state management using useState hook in src/components/ChatWidget/index.tsx
- [ ] T031 [US4] Implement onError event handler from ChatKit that receives { error } object and displays user-friendly error messages (extract error.message, hide technical details) in src/components/ChatWidget/ChatKitWrapper.tsx
- [ ] T032 [US4] Integrate automatic retry logic (2-3 attempts with exponential backoff) in getClientSecret callback using useErrorRetry hook in src/components/ChatWidget/ChatKitWrapper.tsx
- [ ] T033 [US4] Implement manual retry button UI that calls getClientSecret again after automatic retries fail in src/components/ChatWidget/index.tsx
- [ ] T034 [US4] Wrap getClientSecret fetch call with try-catch and useErrorRetry for session creation error handling in src/components/ChatWidget/ChatKitWrapper.tsx
- [ ] T035 [US4] Verify ChatKit onError handler catches message sending errors automatically (ChatKit handles this internally) in src/components/ChatWidget/ChatKitWrapper.tsx
- [ ] T036 [US4] Test network error scenarios and retry behavior
- [ ] T037 [US4] Test backend error scenarios and error message display

**Checkpoint**: At this point, User Stories 1, 2, 3, AND 4 should all work independently - widget handles errors gracefully

---

## Phase 7: User Story 5 - Maintain Conversation Context Across Page Navigation (Priority: P3)

**Goal**: Conversation history persists when user navigates between pages, allowing continuation of discussion across the textbook.

**Independent Test**: Start a conversation on one page, navigate to another page, verify chat history is still visible, send a new message and verify AI has context from previous messages.

### Implementation for User Story 5

- [ ] T038 [US5] Implement sessionStorage persistence for widget open state in src/components/ChatWidget/index.tsx
- [ ] T039 [US5] Restore widget open state from sessionStorage on page load in src/components/ChatWidget/index.tsx
- [ ] T040 [US5] Verify ChatKit maintains conversation history across page navigation (handled by ChatKit library)
- [ ] T041 [US5] Test conversation persistence across multiple page navigations
- [ ] T042 [US5] Test conversation context in AI responses after navigation

**Checkpoint**: All user stories should now be independently functional - widget maintains context across navigation

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] T043 [P] Style widget to match Docusaurus theme using CSS variables in src/components/ChatWidget/styles.module.css
- [ ] T044 [P] Configure ChatKit theme property (colorScheme, typography.fontFamily, color.accent.primary) to match Docusaurus CSS variables in src/components/ChatWidget/ChatKitWrapper.tsx
- [ ] T045 [P] Add keyboard navigation improvements (Enter to send, Escape to close) in src/components/ChatWidget/index.tsx
- [ ] T046 [P] Enhance screen reader support with ARIA labels and descriptions in src/components/ChatWidget/index.tsx
- [ ] T047 [P] Optimize widget performance (lazy loading, code splitting if needed)
- [ ] T048 [P] Update production backend URL in src/components/ChatWidget/config.ts
- [ ] T049 [P] Add widget documentation comments in all component files
- [ ] T050 Run quickstart.md validation - verify all steps work end-to-end
- [ ] T051 Test widget on multiple browsers (Chrome, Firefox, Safari)
- [ ] T052 Test widget responsiveness across all target screen sizes (320px to 2560px)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3)
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P1)**: Can start after Foundational (Phase 2) - Depends on US1 (needs widget UI to connect)
- **User Story 3 (P2)**: Can start after US2 - Depends on US2 (needs backend connection for streaming)
- **User Story 4 (P2)**: Can start after US2 - Depends on US2 (needs backend connection to handle errors)
- **User Story 5 (P3)**: Can start after US2 - Depends on US2 (needs working conversation to persist)

### Within Each User Story

- Core implementation before integration
- State management before UI components
- Error handling after core functionality
- Story complete before moving to next priority

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel (T002, T003)
- All Foundational tasks marked [P] can run in parallel (T005)
- Once Foundational phase completes:
  - US1 can start immediately
  - US2 can start after US1 completes
  - US3 and US4 can start in parallel after US2 completes
  - US5 can start after US2 completes
- All Polish tasks marked [P] can run in parallel

---

## Parallel Example: User Story 1

```bash
# Launch these tasks in parallel:
Task: "Create ChatWidget component directory structure at src/components/ChatWidget/"
Task: "Verify Docusaurus Root component swizzle capability (check if src/theme/Root/ exists)"
```

---

## Parallel Example: User Story 4

```bash
# Launch these tasks in parallel:
Task: "Create ErrorState type definition in src/components/ChatWidget/types.ts"
Task: "Create useErrorRetry hook with exponential backoff logic in src/components/ChatWidget/useErrorRetry.ts"
Task: "Add error message display component with user-friendly messages in src/components/ChatWidget/index.tsx"
```

---

## Implementation Strategy

### MVP First (User Stories 1 & 2 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1 (Widget Display)
4. Complete Phase 4: User Story 2 (Backend Connection)
5. **STOP and VALIDATE**: Test User Stories 1 & 2 independently
6. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Widget visible and toggleable
3. Add User Story 2 → Test independently → Widget connects to backend (MVP!)
4. Add User Story 3 → Test independently → Streaming responses work
5. Add User Story 4 → Test independently → Error handling works
6. Add User Story 5 → Test independently → Context persistence works
7. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1 (Widget Display)
   - Developer B: Prepares for User Story 2
3. Once US1 is done:
   - Developer A: User Story 2 (Backend Connection)
4. Once US2 is done:
   - Developer A: User Story 3 (Streaming)
   - Developer B: User Story 4 (Error Handling) - can work in parallel
5. Once US3/US4 are done:
   - Developer A: User Story 5 (Context Persistence)
6. Stories complete and integrate independently

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence
- Backend endpoints are already implemented - widget is a consumer only
- ChatKit library handles most protocol details - focus on UI/UX integration

