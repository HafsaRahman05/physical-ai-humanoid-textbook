# Implementation Plan: Custom Chat Widget for Textbook

**Branch**: `012-chat-widget` | **Date**: 2025-01-27 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/012-chat-widget/spec.md`

## Summary

Build a custom React-based chat widget component for the Docusaurus textbook frontend that enables students to ask questions about book content. The widget will be positioned as a floating button in the bottom-right corner, connect to the existing FastAPI backend at `/api/chat`, maintain conversation history using browser sessionStorage, and display AI responses with citations. The implementation will use React components without external chat libraries, following Docusaurus component integration patterns.

## Technical Context

**Language/Version**: TypeScript 5.6.2, React 19.0.0  
**Primary Dependencies**: React, React DOM, Docusaurus 3.9.2, @mdx-js/react  
**Storage**: Browser sessionStorage (for session ID persistence)  
**Testing**: Jest/React Testing Library (to be configured)  
**Target Platform**: Web browsers (modern browsers supporting ES6+, sessionStorage)  
**Project Type**: Web application (frontend component for Docusaurus)  
**Performance Goals**: Widget opens within 5 seconds of page load (SC-001), responses displayed within 10 seconds for 90% of queries (SC-003)  
**Constraints**: 2000 character message limit, 30 second timeout, responsive design (320px-2560px width), no external chat library dependencies  
**Scale/Scope**: Single React component with sub-components, integrated into existing Docusaurus site, connects to existing FastAPI backend

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### I. Documentation-First Architecture ✅
- Widget is a frontend component enhancing the textbook interface
- No impact on documentation structure
- Widget displays citations linking back to textbook content

### II. Modular Content Organization ✅
- Widget is a standalone React component
- No impact on module structure
- Citations reference existing modular content

### III. Vector Database Integration ✅
- N/A - Widget is frontend component, backend handles Qdrant integration
- Widget displays citations from backend responses

### IV. AI Agent Architecture ✅
- Widget consumes FastAPI endpoints (already implemented)
- Backend uses OpenAI Agents SDK with Gemini API (existing)
- Citations displayed in widget responses

### V. Deployment Standards ✅
- Widget deploys with Docusaurus to GitHub Pages
- No additional deployment requirements
- Backend already deployed separately

### VI. API-First Backend Design ✅
- Widget consumes existing FastAPI `/api/chat` endpoint
- API contract already defined in backend
- Widget follows RESTful patterns

**Constitution Compliance**: All applicable principles satisfied. Widget is a frontend enhancement that integrates with existing backend architecture.

## Project Structure

### Documentation (this feature)

```text
specs/012-chat-widget/
├── plan.md              # This file (/sp.plan command output)
├── research.md          # Phase 0 output (/sp.plan command)
├── data-model.md        # Phase 1 output (/sp.plan command)
├── quickstart.md        # Phase 1 output (/sp.plan command)
├── contracts/           # Phase 1 output (/sp.plan command)
└── tasks.md             # Phase 2 output (/sp.tasks command - NOT created by /sp.plan)
```

### Source Code (repository root)

```text
src/
├── components/
│   └── ChatWidget/
│       ├── index.tsx              # Main ChatWidget component
│       ├── ChatButton.tsx          # Floating toggle button
│       ├── ChatWindow.tsx          # Chat interface container
│       ├── MessageList.tsx         # Message history display
│       ├── MessageInput.tsx        # Message input field
│       ├── Citation.tsx           # Citation display component
│       ├── ErrorMessage.tsx        # Error display component
│       ├── LoadingIndicator.tsx   # Loading state component
│       ├── types.ts                # TypeScript type definitions
│       ├── hooks/
│       │   ├── useChatSession.ts   # Session management hook
│       │   ├── useChatAPI.ts       # API communication hook
│       │   └── useMessageValidation.ts  # Input validation hook
│       ├── services/
│       │   └── chatService.ts      # API service layer
│       └── styles.module.css       # Component styles
└── css/
    └── custom.css                   # Global styles (may include widget positioning)

Chatbot/                              # Existing backend (no changes required)
└── src/chatbot/api/routes.py        # Existing /api/chat endpoint
```

**Structure Decision**: Frontend component structure following Docusaurus React component patterns. Components organized by feature (ChatWidget) with sub-components, hooks for state management, and services for API communication. No backend changes required as existing FastAPI endpoints are sufficient.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

No violations - all constitution principles satisfied.
