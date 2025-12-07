# Research: Custom Chat Widget for Textbook

**Feature**: 012-chat-widget  
**Date**: 2025-01-27  
**Phase**: 0 - Outline & Research

## Research Questions

### 1. Docusaurus React Component Integration

**Question**: How to integrate custom React components into Docusaurus for global availability across all pages?

**Decision**: Use Docusaurus `swizzle` feature to create a root-level component wrapper, or use the `@docusaurus/theme-classic` Layout component to inject the widget at the application level.

**Rationale**: 
- Docusaurus supports React components through MDX and theme customization
- Root-level injection ensures widget is available on all pages without per-page imports
- Layout component approach provides consistent positioning and lifecycle management
- Existing codebase shows React components in `src/components/` directory

**Alternatives Considered**:
- Per-page component import: Rejected - requires manual addition to every page, maintenance burden
- Plugin-based approach: Rejected - overkill for a single component, adds unnecessary complexity
- Static HTML injection: Rejected - loses React state management and interactivity

**Implementation Notes**:
- Component should be added to root Layout or via theme configuration
- Use Docusaurus `useDocusaurusContext()` for site configuration if needed
- Ensure component doesn't interfere with existing Docusaurus functionality

### 2. Browser sessionStorage for Session Persistence

**Question**: How to reliably use sessionStorage for session ID persistence across page navigations?

**Decision**: Use browser `sessionStorage` API with error handling for storage quota and privacy mode scenarios.

**Rationale**:
- sessionStorage persists within browser tab/window session (cleared on close)
- Automatically scoped to origin, preventing cross-site issues
- Simpler than localStorage (no manual cleanup needed)
- Aligns with requirement for session-scoped persistence

**Alternatives Considered**:
- localStorage: Rejected - persists beyond session, requires manual cleanup, privacy concerns
- In-memory only: Rejected - loses session on page refresh, poor UX
- Cookie-based: Rejected - unnecessary complexity, HTTP-only cookies require backend changes

**Implementation Notes**:
- Use `sessionStorage.setItem('chatSessionId', sessionId)` on session creation
- Use `sessionStorage.getItem('chatSessionId')` on widget initialization
- Handle `QuotaExceededError` gracefully (fallback to in-memory)
- Handle privacy mode where storage may be disabled (fallback to in-memory with warning)

### 3. React State Management for Chat Widget

**Question**: What state management approach for widget state, messages, and session?

**Decision**: Use React hooks (useState, useReducer) with custom hooks for complex logic separation.

**Rationale**:
- React hooks provide sufficient state management for component-scoped state
- Custom hooks (useChatSession, useChatAPI) enable logic separation and reusability
- No need for external state management (Redux, Zustand) for single component
- Aligns with React best practices and Docusaurus patterns

**Alternatives Considered**:
- Redux/Context API: Rejected - overkill for single component, adds complexity
- External state library: Rejected - unnecessary dependency, maintenance burden
- Class components: Rejected - React 19 uses hooks, functional components are standard

**Implementation Notes**:
- Use `useState` for simple state (isOpen, isLoading)
- Use `useReducer` for complex state (messages, session state)
- Custom hooks encapsulate API calls and session management
- State resets on page navigation (widget always starts closed per spec)

### 4. API Communication Pattern

**Question**: How to structure API calls to FastAPI backend with error handling and retry logic?

**Decision**: Create a service layer (`chatService.ts`) with fetch-based API calls, timeout handling, and structured error responses.

**Rationale**:
- Service layer separates API logic from component logic
- Native `fetch` API sufficient (no need for axios dependency)
- Timeout handling via `AbortController` for 30-second limit
- Error categorization (network, timeout, 4xx, 5xx) enables specific user messages

**Alternatives Considered**:
- Axios library: Rejected - unnecessary dependency, fetch is sufficient
- GraphQL: Rejected - backend is REST, no GraphQL endpoint
- WebSocket: Rejected - backend doesn't support streaming, adds complexity

**Implementation Notes**:
- Use `fetch` with `AbortController` for timeout (30 seconds)
- Implement retry logic with exponential backoff (2-3 attempts)
- Map HTTP status codes to user-friendly error messages
- Handle network errors (offline, CORS) separately from HTTP errors

### 5. Responsive Design for Floating Widget

**Question**: How to ensure widget remains accessible and properly positioned across screen sizes (320px-2560px)?

**Decision**: Use CSS positioning (fixed) with responsive breakpoints and max-width constraints.

**Rationale**:
- Fixed positioning ensures widget stays in viewport
- Responsive breakpoints adjust widget size for mobile vs desktop
- Max-width constraints prevent widget from becoming too large on wide screens
- CSS modules provide scoped styling without global conflicts

**Alternatives Considered**:
- Absolute positioning: Rejected - relative to parent, breaks on scroll
- CSS-in-JS: Rejected - Docusaurus uses CSS modules, consistency important
- Media queries only: Rejected - need both media queries and max-width for full coverage

**Implementation Notes**:
- Use `position: fixed` with `bottom-right` positioning
- Set `max-width: 400px` and `max-height: 600px` for desktop
- Use media queries for mobile (<768px): smaller max dimensions
- Ensure z-index doesn't conflict with Docusaurus UI elements
- Test on actual devices/screen sizes per SC-005

### 6. Citation Display and Navigation

**Question**: How to parse and display citations from backend responses and enable navigation to textbook sections?

**Decision**: Parse citation objects from API response, render as clickable links using Docusaurus routing.

**Rationale**:
- Backend returns citations as structured objects (per existing API)
- Docusaurus `Link` component handles internal routing
- Citation format matches existing textbook URL structure
- Clickable links provide direct navigation to referenced content

**Alternatives Considered**:
- Plain text citations: Rejected - not clickable, poor UX
- External links: Rejected - breaks internal navigation, loses context
- Modal/popup for citations: Rejected - adds complexity, interrupts reading flow

**Implementation Notes**:
- Parse `citations` array from API response
- Use Docusaurus `Link` component for internal navigation
- Format citations clearly (e.g., "Module 1, Section 2.3")
- Handle missing or malformed citations gracefully
- Support multiple citations per response

### 7. Input Validation and Character Limits

**Question**: How to implement client-side validation for 2000 character limit with user feedback?

**Decision**: Real-time character counting with visual feedback and disabled submit button when limit exceeded.

**Rationale**:
- Client-side validation prevents unnecessary API calls
- Real-time feedback improves UX (users see limit approaching)
- Disabled submit button prevents invalid submissions
- Aligns with backend validation (2000 character limit)

**Alternatives Considered**:
- Server-side only: Rejected - poor UX, users discover limit after sending
- Truncation: Rejected - loses user input, frustrating experience
- Warning only: Rejected - users may ignore, still sends invalid data

**Implementation Notes**:
- Track character count in real-time as user types
- Display character count (e.g., "1500/2000")
- Change color/style when approaching limit (e.g., >1800 chars)
- Disable submit button when limit exceeded
- Show validation message if user attempts to exceed limit

## Technology Decisions Summary

| Technology | Decision | Rationale |
|------------|----------|-----------|
| Component Integration | Docusaurus Layout/Theme | Global availability, consistent with Docusaurus patterns |
| Session Storage | Browser sessionStorage | Session-scoped persistence, automatic cleanup |
| State Management | React Hooks | Sufficient for component scope, no external dependencies |
| API Communication | Fetch API + Service Layer | Native API, timeout support, structured error handling |
| Styling | CSS Modules | Consistent with Docusaurus, scoped styles |
| Routing | Docusaurus Link | Internal navigation, maintains context |
| Validation | Client-side + Real-time | Better UX, prevents invalid submissions |

## Open Questions Resolved

All research questions have been resolved. No outstanding clarifications needed for implementation planning.

## Next Steps

Proceed to Phase 1: Design & Contracts
- Generate data-model.md with entity definitions
- Create API contracts for frontend-backend communication
- Generate quickstart.md for developer onboarding

