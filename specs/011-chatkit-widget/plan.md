# Implementation Plan: OpenAI ChatKit Widget Integration

**Branch**: `011-chatkit-widget` | **Date**: 2025-01-27 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/011-chatkit-widget/spec.md`

**Note**: This template is filled in by the `/sp.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Integrate OpenAI ChatKit widget as a floating React component in the Docusaurus frontend that connects to the existing FastAPI backend. The widget will be displayed as a toggle button (bottom-right corner) that opens a chat interface when clicked. It uses lazy initialization to connect to the backend only when first opened, supports streaming responses, and includes comprehensive error handling with automatic retry and manual retry options.

## Technical Context

**Language/Version**: TypeScript 5.6.2, React 19.0.0  
**Primary Dependencies**: `@openai/chatkit-react` (OpenAI ChatKit React library), `@docusaurus/core` 3.9.2, `@docusaurus/preset-classic` 3.9.2  
**Storage**: Browser sessionStorage for conversation history (session-only, no persistence across browser sessions). ChatKit manages conversation history internally via its protocol.  
**Testing**: Jest + React Testing Library (for component tests), manual integration testing with FastAPI backend  
**Target Platform**: Modern web browsers (Chrome, Firefox, Safari - last 3-5 versions), responsive design (320px to 2560px width)  
**Project Type**: Web application (Docusaurus frontend + FastAPI backend)  
**Performance Goals**: Widget toggle button visible within 2 seconds of page load, session establishment in <1 second (95% of attempts), streaming response begins within 3 seconds (90% of requests)  
**Constraints**: Responsive dimensions (max 600px height, max 400px width), must work with existing Docusaurus theme, CORS must be configured on FastAPI backend  
**Scale/Scope**: Single widget instance per page, supports concurrent users (backend handles concurrency), session-only conversation history

**ChatKit API Details** (from official documentation):
- `useChatKit` hook provides `control` object for ChatKit component
- `getClientSecret(existing?)` callback: Required async function returning `client_secret` string. `existing` parameter indicates token refresh scenario.
- `api.url`: Required string property pointing to backend ChatKit protocol endpoint (e.g., `${BACKEND_URL}/chatkit`)
- Event handlers: `onReady`, `onError({ error })`, `onResponseStart()`, `onResponseEnd()`, `onThreadChange({ threadId })`
- Streaming: Automatic via Server-Sent Events (SSE) - ChatKit handles streaming internally, no manual implementation needed
- Error handling: Use `onError` callback to catch ChatKit errors. Error object contains `message` and `stack` properties.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### I. Documentation-First Architecture
✅ **PASS**: Widget integration enhances the textbook's interactivity without replacing documentation. Content remains primary deliverable.

### II. Modular Content Organization
✅ **PASS**: Widget is a standalone React component that can be integrated into any page without affecting content structure.

### III. Vector Database Integration
✅ **PASS**: Widget connects to existing FastAPI backend which already integrates with Qdrant. No changes to vector database required.

### IV. AI Agent Architecture
✅ **PASS**: Widget uses existing FastAPI endpoints (`/api/chatkit/session`, `/chatkit`) that connect to OpenAI Agents SDK agent. No changes to agent architecture required.

### V. Deployment Standards
✅ **PASS**: Widget is part of Docusaurus frontend and will deploy to GitHub Pages automatically with the rest of the site. No additional deployment requirements.

### VI. API-First Backend Design
✅ **PASS**: Widget consumes existing FastAPI RESTful endpoints. API contracts are already defined and documented.

**Constitution Compliance**: All gates pass. No violations.

## Project Structure

### Documentation (this feature)

```text
specs/011-chatkit-widget/
├── plan.md              # This file (/sp.plan command output)
├── research.md          # Phase 0 output (/sp.plan command)
├── data-model.md        # Phase 1 output (/sp.plan command)
├── quickstart.md        # Phase 1 output (/sp.plan command)
├── contracts/           # Phase 1 output (/sp.plan command)
│   └── api-contracts.md # FastAPI endpoint contracts
└── tasks.md             # Phase 2 output (/sp.tasks command - NOT created by /sp.plan)
```

### Source Code (repository root)

```text
src/
├── components/
│   ├── ChatWidget/          # NEW: ChatKit widget component
│   │   ├── index.tsx       # Main widget component with toggle button
│   │   ├── ChatKitWrapper.tsx  # ChatKit integration wrapper
│   │   ├── useChatKitSession.ts # Custom hook for session management
│   │   ├── useErrorRetry.ts     # Custom hook for error retry logic
│   │   └── styles.module.css    # Widget-specific styles
│   └── HomepageFeatures/    # Existing component
│       ├── index.tsx
│       └── styles.module.css
├── theme/
│   └── Root/                # Docusaurus root component (may need swizzle)
│       └── index.tsx        # Inject widget globally
├── css/
│   └── custom.css           # Global styles (may add widget overrides)
└── pages/                   # Existing pages

package.json                 # Add @openai/chatkit-react dependency
```

**Structure Decision**: Single frontend project structure. Widget is integrated as a React component in the existing Docusaurus structure. Component is placed in `src/components/ChatWidget/` following existing component organization pattern. Widget will be injected globally via Docusaurus Root component to appear on all pages.

## Complexity Tracking

> **No violations detected - all constitution gates pass**
