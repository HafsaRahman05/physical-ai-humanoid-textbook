---
id: chatkit-widget-frontend-integration-plan-20250127
title: ChatKit Widget Frontend Integration Plan
stage: plan
date: 2025-01-27
surface: chat
model: claude-sonnet-4.5
feature: 011-chatkit-widget
branch: 011-chatkit-widget
user: user
command: /sp.plan
labels: [planning, chatkit, frontend, widget, react, docusaurus, implementation]
links:
  spec: specs/011-chatkit-widget/spec.md
  plan: specs/011-chatkit-widget/plan.md
  ticket: null
  adr: null
  pr: null
files:
  created:
    - specs/011-chatkit-widget/plan.md
    - specs/011-chatkit-widget/research.md
    - specs/011-chatkit-widget/data-model.md
    - specs/011-chatkit-widget/contracts/api-contracts.md
    - specs/011-chatkit-widget/quickstart.md
  modified:
    - .cursor/rules/specify-rules.mdc
tests:
  unit: []
  integration: []
---

## Prompt

```text
/sp.plan Plan the frontend chatkit widget integration extensively, utilize mcp servers like use context7 for latest docs of OpenAI Chatkit, Docusaurus.
```

## Response snapshot

Created comprehensive implementation plan for OpenAI ChatKit Widget Integration feature (011-chatkit-widget). The planning phase included:

**Phase 0: Research**
- Researched ChatKit React integration using Context7 MCP server
- Researched Docusaurus React component integration patterns
- Resolved 10 technical questions covering:
  - ChatKit React component integration in Docusaurus
  - Floating widget with toggle button implementation
  - Lazy initialization and session management
  - Error retry with exponential backoff
  - Responsive widget dimensions
  - Global widget injection in Docusaurus
  - Backend URL configuration
  - Streaming response handling
  - Theme styling to match Docusaurus
  - Testing strategies

**Phase 1: Design Artifacts**
- **plan.md**: Complete implementation plan with technical context, constitution check (all gates pass), and project structure
- **research.md**: Comprehensive research findings with decisions, rationale, and alternatives for all technical questions
- **data-model.md**: Data model for widget state, error handling, and session management
- **contracts/api-contracts.md**: API contracts for FastAPI backend endpoints (`/api/chatkit/session`, `/chatkit`)
- **quickstart.md**: Step-by-step implementation guide with code examples

**Key Technical Decisions**:
1. Use `@openai/chatkit-react` package with `useChatKit` hook
2. Implement floating widget with toggle button (bottom-right corner)
3. Lazy initialization - widget only connects when first opened
4. Automatic retry with exponential backoff (2-3 attempts) + manual retry
5. Responsive dimensions with max constraints (400px × 600px)
6. Global injection via Docusaurus Root component swizzle
7. Hardcoded backend URL with environment-based values

**Constitution Check**: All 6 gates pass - no violations

**Project Structure**: Single frontend project, widget component in `src/components/ChatWidget/`

**Agent Context Updated**: Added TypeScript 5.6.2, React 19.0.0, ChatKit React, Docusaurus dependencies to Cursor IDE context

## Outcome

- ✅ Impact: Complete implementation plan ready for task breakdown and development
- 🧪 Tests: Testing strategy defined (unit, integration, E2E)
- 📁 Files: Created plan.md, research.md, data-model.md, contracts/api-contracts.md, quickstart.md
- 🔁 Next prompts: `/sp.tasks` to create detailed task breakdown
- 🧠 Reflection: Plan successfully leverages Context7 MCP for latest documentation, resolves all technical ambiguities, and provides clear implementation path. All constitution gates pass, ensuring alignment with project principles.

## Evaluation notes (flywheel)

- Failure modes observed: None
- Graders run and results (PASS/FAIL): All constitution gates PASS
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): Proceed to task breakdown phase

