# Feature Specification: Custom Chat Widget for Textbook

**Feature Branch**: `012-chat-widget`  
**Created**: 2025-01-27  
**Status**: Draft  
**Input**: User description: "Create specs for a chat widget on the frontend, this will be a custom chatbot widget, placed on the bottom right side, and will eventually connect with our FastAPI backend in 'Chatbot' in root directory."

## Clarifications

### Session 2025-01-27

- Q: How should the widget store and retrieve the session ID to maintain conversation history across page navigations? → A: Use browser sessionStorage (cleared when browser tab/window closes) - Conversation history persists during active browsing session only
- Q: Should the widget remember its open/closed state when users navigate between textbook pages? → A: Always start closed on new page - Widget resets to closed state on every page navigation
- Q: What specific error messages should users see for different failure scenarios? → A: Show specific error messages for each failure type - Network errors, timeouts, 4xx/5xx responses each have distinct messages
- Q: What is the maximum character limit for user messages that should be enforced in the widget? → A: 2000 characters
- Q: What timeout duration should the widget wait before treating a backend request as failed? → A: 30 seconds

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Display Chat Widget on Textbook Pages (Priority: P1)

A student reading the Physical AI Humanoid Robotics textbook wants to ask questions about the content they're learning. They should see a chat widget integrated into the textbook interface that allows them to start a conversation with the AI assistant about book content.

**Why this priority**: This is the core functionality - without the widget visible and accessible, users cannot interact with the AI assistant. This delivers the primary value proposition of the feature.

**Independent Test**: Can be fully tested by verifying the chat widget component renders correctly on a textbook page, displays as a floating button in the bottom-right corner, and opens to show the chat interface when clicked. This delivers immediate visual confirmation that the integration is working.

**Acceptance Scenarios**:

1. **Given** a user is viewing any page in the textbook, **When** the page loads, **Then** a floating toggle button is visible in the bottom-right corner that opens the chat widget when clicked
2. **Given** the chat widget is closed, **When** the user clicks the toggle button, **Then** the widget expands to show a chat interface with message history and input field
3. **Given** the chat widget is open, **When** the user clicks the toggle button again, **Then** the widget collapses back to the floating button state
4. **Given** the widget is rendered, **When** the page is resized or viewed on different screen sizes, **Then** the widget maintains appropriate dimensions and remains usable without overlapping critical content

---

### User Story 2 - Connect Widget to FastAPI Backend (Priority: P1)

A student wants to ask a question through the chat widget. The widget must successfully establish a session with the FastAPI backend and send messages to receive AI-generated responses about textbook content.

**Why this priority**: Without backend connectivity, the widget is non-functional. This is essential for the feature to deliver any value beyond visual presence.

**Independent Test**: Can be fully tested by opening the browser developer console, sending a message through the widget, and verifying that a session is created with the FastAPI backend and that the widget receives a valid response. This delivers functional connectivity confirmation.

**Acceptance Scenarios**:

1. **Given** the chat widget is opened for the first time, **When** the widget initializes, **Then** it automatically creates a session with the FastAPI backend and stores the session identifier
2. **Given** a valid session is established, **When** the user types a question about the textbook and sends it, **Then** the message is transmitted to the FastAPI backend at `/api/chat` endpoint with the session ID
3. **Given** the backend processes the query, **When** a response is received, **Then** the widget displays the AI-generated answer in the chat interface
4. **Given** the backend is unavailable or returns an error, **When** the widget attempts to send a message, **Then** the user sees a specific error message (e.g., "Network connection lost" for network errors, "Request timed out" for timeouts, "Server error" for 5xx responses, "Invalid request" for 4xx responses) with an option to retry

---

### User Story 3 - Maintain Conversation Context (Priority: P2)

A student is having a multi-turn conversation with the AI assistant about a complex topic. The widget should maintain conversation history within a session so the AI can provide contextually relevant follow-up responses.

**Why this priority**: Multi-turn conversations are essential for learning complex topics. Without conversation history, users cannot ask follow-up questions or clarify previous responses, significantly reducing the educational value.

**Independent Test**: Can be fully tested by sending multiple messages in sequence and verifying that each response is contextually aware of previous messages in the conversation. This delivers enhanced user experience for learning.

**Acceptance Scenarios**:

1. **Given** a user has sent a message and received a response, **When** they send a follow-up question referencing the previous response, **Then** the AI assistant provides a contextually relevant answer that acknowledges the conversation history
2. **Given** a conversation is in progress, **When** the user navigates to a different page in the textbook, **Then** the widget resets to closed state, but the conversation history is preserved and remains accessible when the user opens the widget on the new page
3. **Given** a user has an active session, **When** they refresh the page or navigate to another page within the same browser tab, **Then** the conversation history is maintained by retrieving the session ID from sessionStorage and reconnecting to the existing session

---

### User Story 4 - Display Citations and Source References (Priority: P2)

A student receives an answer from the AI assistant and wants to verify the information or read more about the topic. The widget should display citations that link back to relevant sections of the textbook.

**Why this priority**: Citations enhance educational value by allowing students to verify information and explore source material. This builds trust and supports deeper learning.

**Independent Test**: Can be fully tested by asking a question that should return citations and verifying that source references are displayed in the chat response with links to relevant textbook sections. This delivers transparency and educational value.

**Acceptance Scenarios**:

1. **Given** the AI assistant provides an answer that references textbook content, **When** the response includes citations, **Then** the widget displays clickable links or references to the relevant textbook sections
2. **Given** citations are displayed, **When** the user clicks on a citation, **Then** they are navigated to the referenced section in the textbook
3. **Given** a response contains multiple citations, **When** they are displayed, **Then** they are clearly formatted and distinguishable from the response text

---

### Edge Cases

- What happens when a user sends a very long message (exceeding 2000 character limit)? → System prevents sending and displays validation message indicating the character limit
- How does the widget handle network interruptions during message transmission? → System detects network errors (offline, connection lost), displays "Network connection lost" error message, and provides retry option. On retry, the widget re-attempts the failed request with the same message and session ID.
- What happens when the backend takes an unusually long time to respond (exceeds 30 second timeout)? → System displays timeout error message ("Request timed out") and provides retry option
- How does the widget handle rapid successive messages from the user?
- What happens when the backend returns a response in an unexpected format? → System validates response structure (checks for required fields: response, session_id, citations array), displays "Invalid response format" error message if validation fails, and provides retry option. Malformed responses are logged for debugging.
- How does the widget behave when the user's browser has JavaScript disabled? → Widget does not render (React component requires JavaScript). This is acceptable per assumption that users have JavaScript enabled. No graceful degradation needed as Docusaurus itself requires JavaScript. Widget is a progressive enhancement to the textbook interface.
- What happens when multiple browser tabs are open with the same session? → Each browser tab maintains an independent session (sessionStorage is tab-scoped). Each tab creates its own sessionId on first widget open. This is expected behavior - users can have separate conversations in different tabs. No synchronization between tabs is required or implemented.
- How does the widget handle special characters, emojis, or code snippets in messages?
- What happens when the backend returns an error response (4xx, 5xx status codes)? → System displays specific error messages: "Invalid request" for 4xx errors, "Server error" for 5xx errors, with retry option
- How does the widget handle empty or whitespace-only messages?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST display a floating chat widget button in the bottom-right corner of all textbook pages
- **FR-002**: System MUST allow users to toggle the chat widget open and closed by clicking the floating button
- **FR-003**: System MUST create a session with the FastAPI backend when the widget is first opened and store the session identifier in browser sessionStorage
- **FR-004**: System MUST send user messages to the FastAPI backend at `/api/chat` endpoint with session identifier
- **FR-005**: System MUST display AI-generated responses in the chat interface in a readable format
- **FR-006**: System MUST maintain conversation history within a session for context-aware responses
- **FR-007**: System MUST display specific, user-friendly error messages to users when backend communication fails, with distinct messages for network errors, timeouts, 4xx client errors, and 5xx server errors
- **FR-008**: System MUST provide a mechanism for users to retry failed requests
- **FR-009**: System MUST display citations and source references when included in AI responses
- **FR-010**: System MUST make citations clickable and navigate to referenced textbook sections
- **FR-011**: System MUST handle widget state (open/closed) independently of page navigation - widget always starts in closed state on each new page load
- **FR-012**: System MUST preserve conversation history across page navigations within the same browser session (using sessionStorage for session ID persistence)
- **FR-013**: System MUST validate user input before sending to backend (non-empty, maximum 2000 characters) and display validation feedback to users
- **FR-014**: System MUST display a loading indicator while waiting for backend responses
- **FR-015**: System MUST handle responsive design to work on various screen sizes without overlapping critical content
- **FR-016**: System MUST prevent sending duplicate messages if user clicks send multiple times rapidly
- **FR-017**: System MUST handle backend response timeouts gracefully (30 second timeout) with user feedback indicating the request timed out

### Key Entities

- **Chat Session**: Represents an active conversation between a user and the AI assistant. Contains session identifier (stored in browser sessionStorage), creation timestamp, and conversation history. Maintained by the backend and referenced by the widget for context. Session persists across page navigations within the same browser tab but is cleared when the tab/window closes. **Note**: Each browser tab has an independent session (sessionStorage is tab-scoped).
- **Chat Message**: Represents a single message in a conversation. Contains message text, sender (user or assistant), timestamp, and optional metadata such as citations or error information.
- **Citation**: Represents a reference to textbook content. Contains source information (chapter, section, page) and link to the referenced content. Displayed with AI responses to provide source transparency.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can open the chat widget and send their first message within 5 seconds of page load
- **SC-002**: 95% of messages sent through the widget successfully reach the backend and receive responses
- **SC-003**: Users receive AI responses within 10 seconds for 90% of queries
- **SC-004**: 80% of users who interact with the widget successfully complete a multi-turn conversation (3+ exchanges)
- **SC-005**: Widget remains functional and accessible on screen sizes from 320px to 2560px width without layout issues
- **SC-006**: Conversation history is preserved correctly for 95% of page navigation scenarios within the same session
- **SC-007**: Citations are displayed and clickable for 90% of responses that reference textbook content
- **SC-008**: Error messages are displayed clearly to users within 2 seconds of a failed request, with retry option available

## Assumptions

- The FastAPI backend is already implemented and available at a known endpoint
- The backend `/api/chat` endpoint accepts POST requests with message and session_id
- The backend returns responses in JSON format with response text and optional citations
- Session management is handled by the backend (session creation, validation, expiration)
- The textbook content structure supports citation linking (chapter/section identifiers)
- Users have JavaScript enabled in their browsers
- The widget will be integrated into the Docusaurus-based textbook frontend
- No user authentication is required for initial widget access (MVP assumption)
- The widget will use React components as specified, without external chat library dependencies

## Dependencies

- FastAPI backend in `Chatbot` directory must be running and accessible
- Backend `/api/chat` endpoint must be implemented and functional
- Backend must support session management and conversation history
- Docusaurus frontend must support React component integration
- Network connectivity between frontend and backend is required

## Out of Scope

- User authentication and authorization for chat access
- Chat history persistence across browser sessions (beyond current session)
- Advanced features like file uploads, voice input, or rich media in messages
- Admin dashboard or analytics for chat usage
- Multi-language support for the widget interface
- Customizable widget appearance or themes
- Integration with external chat platforms or services
- Real-time typing indicators or presence features
- Chat export or sharing functionality
