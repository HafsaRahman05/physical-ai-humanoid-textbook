# Feature Specification: OpenAI ChatKit Widget Integration

**Feature Branch**: `011-chatkit-widget`  
**Created**: 2025-01-27  
**Status**: Draft  
**Input**: User description: "Create specification for OpenAI ChatKit integration in our frontend, use context7 for latest chatkit docs."

## Clarifications

### Session 2025-01-27

- Q: Which ChatKit library to use? → A: **OpenAI ChatKit** - Specifically the `@openai/chatkit-react` package from OpenAI. This is the official OpenAI ChatKit React library, not any other ChatKit implementation.
- Q: Widget Placement and Display Mode → A: Floating widget with toggle button (fixed position, typically bottom-right corner)
- Q: Backend URL Configuration → A: Hardcoded URL in component code (different values for dev/prod)
- Q: Widget Initialization Timing → A: Initialize only when user first opens the widget (lazy initialization)
- Q: Error Retry Behavior → A: Automatic retry with exponential backoff (2-3 attempts), then show manual retry button
- Q: Widget Dimensions When Opened → A: Responsive with maximum constraints (e.g., max 600px height, max 400px width, scales down on smaller screens)

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Display ChatKit Widget on Textbook Pages (Priority: P1)

A student reading the textbook wants to ask questions about the content they're learning. They should see a ChatKit widget integrated into the textbook interface that allows them to start a conversation with the AI assistant.

**Why this priority**: This is the core functionality - without the widget visible and accessible, users cannot interact with the AI assistant. This delivers the primary value proposition of the feature.

**Independent Test**: Can be fully tested by verifying the ChatKit widget component renders correctly on a textbook page, displays the chat interface, and shows the initial greeting message. This delivers immediate visual confirmation that the integration is working.

**Acceptance Scenarios**:

1. **Given** a user is viewing any page in the textbook, **When** the page loads, **Then** a floating toggle button is visible (typically in the bottom-right corner) that opens the ChatKit widget when clicked
2. **Given** the ChatKit widget is displayed, **When** the user views the widget, **Then** they see a welcome greeting message and an empty chat composer ready for input
3. **Given** the widget is rendered, **When** the page is resized or viewed on different screen sizes, **Then** the widget maintains appropriate dimensions and remains usable

---

### User Story 2 - Connect Widget to FastAPI Backend (Priority: P1)

A student wants to ask a question through the ChatKit widget. The widget must successfully authenticate with the FastAPI backend and establish a session to enable conversation.

**Why this priority**: Without backend connectivity, the widget is non-functional. This is essential for the feature to deliver any value beyond visual presence.

**Independent Test**: Can be fully tested by opening the browser developer console, sending a message through the widget, and verifying that a session is created with the FastAPI backend at `/api/chatkit/session` and that the widget receives a valid `client_secret`. This delivers functional connectivity confirmation.

**Acceptance Scenarios**:

1. **Given** the ChatKit widget toggle button is visible, **When** the user first clicks to open the widget, **Then** it automatically requests a session from the FastAPI backend at `/api/chatkit/session` and receives a `client_secret`
2. **Given** a valid session is established, **When** the user types a message and sends it, **Then** the message is transmitted to the FastAPI backend at `/chatkit` endpoint
3. **Given** the backend is unavailable or returns an error, **When** the widget attempts to connect, **Then** the user sees a clear error message indicating the connection issue

---

### User Story 3 - Display Streaming AI Responses (Priority: P2)

A student asks a question and expects to see the AI's response appear in real-time as it's generated, providing immediate feedback and a natural conversation experience.

**Why this priority**: Streaming responses significantly improve user experience by providing immediate feedback. While non-streaming responses would still work, streaming is a key differentiator for modern AI chat interfaces.

**Independent Test**: Can be fully tested by sending a question through the widget and observing that the AI's response appears incrementally (word-by-word or chunk-by-chunk) rather than all at once after completion. This delivers real-time interaction confirmation.

**Acceptance Scenarios**:

1. **Given** a user sends a message, **When** the AI begins generating a response, **Then** the response text appears incrementally in the chat interface as it's streamed from the backend
2. **Given** a response is streaming, **When** the user views the chat, **Then** they see a visual indicator (such as a typing indicator) that a response is being generated
3. **Given** streaming completes, **When** the full response is displayed, **Then** the chat interface is ready for the next user message

---

### User Story 4 - Handle Widget Errors Gracefully (Priority: P2)

A student encounters an error while using the chat widget (network failure, backend error, or invalid response). The widget should display user-friendly error messages and allow recovery without requiring a page refresh.

**Why this priority**: Error handling ensures the feature remains usable even when things go wrong. Poor error handling degrades user trust and experience significantly.

**Independent Test**: Can be fully tested by simulating various error conditions (disconnecting network, stopping backend server, sending malformed requests) and verifying that appropriate error messages are displayed and the widget can recover when conditions improve. This delivers resilience confirmation.

**Acceptance Scenarios**:

1. **Given** a network error occurs, **When** the widget attempts to send a message, **Then** the user sees a clear error message explaining the connection issue and suggesting they check their internet connection
2. **Given** the backend returns an error response, **When** the widget receives the error, **Then** it automatically retries 2-3 times with exponential backoff, and if all retries fail, the user sees a user-friendly error message (not technical details) with a manual retry button
3. **Given** an error is displayed, **When** the user retries the action after the issue is resolved, **Then** the widget successfully recovers and continues normal operation

---

### User Story 5 - Maintain Conversation Context Across Page Navigation (Priority: P3)

A student asks a question on one page, navigates to another page in the textbook, and expects their conversation history to persist so they can continue the discussion.

**Why this priority**: While conversation persistence enhances user experience, the core functionality works without it. This is a nice-to-have feature that can be implemented after the MVP.

**Independent Test**: Can be fully tested by starting a conversation on one page, navigating to another page, and verifying that the chat history is still visible and the conversation can continue. This delivers continuity confirmation.

**Acceptance Scenarios**:

1. **Given** a user has an active conversation, **When** they navigate to a different page in the textbook, **Then** their conversation history remains visible in the widget
2. **Given** conversation history is preserved, **When** the user sends a new message, **Then** the AI has context from previous messages in the same session
3. **Given** the user closes and reopens the widget, **When** they return to the widget, **Then** their recent conversation history is restored (within session limits)

---

### Edge Cases

- What happens when the FastAPI backend is running on a different port or URL than expected?
- How does the widget handle very long AI responses that exceed typical message length?
- What happens when multiple users interact with the widget simultaneously on the same page?
- How does the widget behave when the browser tab is inactive for an extended period?
- What happens when the user sends a message while a previous response is still streaming?
- How does the widget handle rapid successive messages from the user?
- What happens when the session expires or becomes invalid during an active conversation?
- How does the widget handle special characters, emojis, or code snippets in user messages?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The ChatKit widget MUST be integrated into the Docusaurus frontend as a floating React component with a toggle button (fixed position, typically bottom-right corner) that opens/closes the chat interface
- **FR-002**: The widget MUST use the **OpenAI ChatKit** `@openai/chatkit-react` package (official OpenAI library) for React integration. This is explicitly OpenAI ChatKit, not any other ChatKit implementation.
- **FR-003**: The widget MUST implement `getClientSecret` callback function that fetches `client_secret` from FastAPI backend endpoint `/api/chatkit/session` when the user first opens the widget (lazy initialization). The callback MUST accept an optional `existing` parameter for token refresh scenarios
- **FR-004**: The widget MUST configure ChatKit `api.url` property to point to FastAPI backend endpoint `/chatkit` for sending chat messages using the ChatKit protocol
- **FR-015**: The widget MUST use a hardcoded backend URL in component code, with different values configured for development and production environments
- **FR-005**: The widget MUST display streaming responses from the AI assistant as they are generated. ChatKit automatically handles Server-Sent Events (SSE) streaming - no manual streaming implementation required
- **FR-006**: The widget MUST implement `onError` event handler from ChatKit to catch and display user-friendly error messages when connection or API errors occur. The handler receives `{ error }` object with error details
- **FR-007**: The widget MUST maintain responsive dimensions with maximum constraints (e.g., max 600px height, max 400px width) that scale down appropriately on smaller screens
- **FR-008**: The widget MUST implement `onResponseStart` and `onResponseEnd` event handlers from ChatKit to show/hide loading indicators when waiting for AI responses
- **FR-009**: The widget MUST allow users to send messages through a text input composer
- **FR-010**: The widget MUST display conversation history within the current session
- **FR-011**: The widget MUST handle session creation and authentication automatically without user intervention
- **FR-012**: The widget MUST gracefully handle network failures and allow retry without page refresh
- **FR-016**: The widget MUST automatically retry failed requests 2-3 times with exponential backoff, then display a manual retry button if automatic retries fail
- **FR-013**: The widget MUST be accessible via keyboard navigation and screen readers (basic accessibility)
- **FR-014**: The widget MUST be styled to match the textbook's design theme and branding

### Key Entities *(include if feature involves data)*

- **Chat Session**: Represents an authenticated conversation session between the frontend widget and the FastAPI backend, containing a `session_id` and `client_secret` for authentication
- **Chat Message**: Represents a single message in the conversation, either from the user or the AI assistant, with content, timestamp, and display status
- **Widget State**: Represents the current state of the ChatKit widget, including connection status, loading state, error state, and conversation history

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can see the ChatKit widget toggle button on any textbook page within 2 seconds of page load, and the widget initializes (connects to backend) within 1 second of first opening
- **SC-002**: The widget successfully establishes a session with the FastAPI backend in under 1 second for 95% of initialization attempts
- **SC-003**: Users can send a message and receive a streaming AI response that begins appearing within 3 seconds for 90% of requests
- **SC-004**: The widget displays clear, actionable error messages for 100% of error conditions without exposing technical implementation details
- **SC-005**: The widget maintains responsive layout and usability across screen sizes from 320px to 2560px width
- **SC-006**: Users can successfully complete a full conversation (send message, receive response, send follow-up) without errors for 95% of attempts when the backend is available
- **SC-007**: The widget recovers automatically from transient network errors (retry successful) for 80% of retry attempts within 10 seconds using exponential backoff, with manual retry option available after automatic retries are exhausted

## Assumptions

- The FastAPI backend is already running and accessible at a known URL (default: `http://localhost:8000` for development)
- The backend URL is hardcoded in the widget component code with different values for development and production environments
- The FastAPI backend endpoints `/api/chatkit/session` and `/chatkit` are implemented and functional
- The Docusaurus frontend is built with React and supports React component integration
- Users have modern browsers that support ES6+ JavaScript and React
- The textbook content is served over HTTP/HTTPS (not file:// protocol) to allow API calls
- CORS is properly configured on the FastAPI backend to allow requests from the Docusaurus frontend
- The widget will be displayed on multiple pages but does not need to persist conversation history across browser sessions (session-only persistence is acceptable for MVP)
- The widget is implemented as a floating component with a toggle button (fixed position, typically bottom-right corner) that opens/closes the chat interface
- The widget uses responsive dimensions with maximum constraints (e.g., max 600px height, max 400px width) that scale down appropriately on smaller screens when opened

## Dependencies

- FastAPI backend with OpenAI ChatKit server implementation (already exists in `Chatbot/` directory)
- **OpenAI ChatKit** `@openai/chatkit-react` npm package must be installed in the frontend (official OpenAI library: https://github.com/openai/chatkit-js)
- React 19.0.0+ (already included in Docusaurus dependencies)
- Network connectivity between frontend and backend
- CORS configuration on FastAPI backend to allow frontend origin

## OpenAI ChatKit API Reference

**Source**: Official OpenAI ChatKit documentation (https://github.com/openai/chatkit-js)

### Core ChatKit Configuration

The widget uses `useChatKit` hook from `@openai/chatkit-react` with the following required configuration:

**API Configuration**:
- `api.getClientSecret(existing?)`: Async function that returns `client_secret` string. Called on widget initialization. If `existing` parameter is provided, it indicates token refresh scenario.
- `api.url`: String URL pointing to backend ChatKit protocol endpoint (default: `/chatkit`)

**Event Handlers** (required for full functionality):
- `onReady()`: Called when ChatKit is fully initialized and ready
- `onError({ error })`: Called when errors occur - receives error object with `message` and `stack` properties
- `onResponseStart()`: Called when AI begins generating a response (for loading indicators)
- `onResponseEnd()`: Called when AI finishes generating a response (for loading indicators)
- `onThreadChange({ threadId })`: Called when conversation thread changes

**Streaming**: ChatKit automatically handles Server-Sent Events (SSE) streaming from backend. No manual streaming implementation required - responses appear incrementally automatically.

**Component Usage**:
```tsx
import { ChatKit, useChatKit } from '@openai/chatkit-react';

const { control } = useChatKit({
  api: {
    async getClientSecret(existing) {
      // Fetch from /api/chatkit/session
      const res = await fetch(`${BACKEND_URL}/api/chatkit/session`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      return (await res.json()).client_secret;
    },
    url: `${BACKEND_URL}/chatkit`,
  },
  onError: ({ error }) => { /* handle errors */ },
  onResponseStart: () => { /* show loading */ },
  onResponseEnd: () => { /* hide loading */ },
});

return <ChatKit control={control} className="..." />;
```

## Out of Scope

- User authentication or user-specific conversation history persistence across sessions
- Advanced widget customization (themes, layouts beyond basic styling)
- Widget analytics or usage tracking
- Multi-language support for the widget interface
- File uploads or attachments in chat messages
- Voice input or audio responses
- Widget configuration UI or admin panel
- Conversation export or sharing functionality
- Integration with external chat platforms or services
