---
id: a1b2c3d4
title: RAG ChatKit Agent Spec
stage: spec
date: 2025-12-05
surface: chat
model: claude-sonnet-4.5
feature: 010-rag-chatkit-agent
branch: 010-rag-chatkit-agent
user: user
command: /sp.specify
labels: [specification, rag, chatkit, agent, gemini]
links:
  spec: specs/010-rag-chatkit-agent/spec.md
  ticket: null
  adr: null
  pr: null
files:
  created:
    - specs/010-rag-chatkit-agent/spec.md
    - specs/010-rag-chatkit-agent/checklists/requirements.md
  modified: []
tests:
  unit: []
  integration: []
---

## Prompt

```text
/sp.specify  Researching OpenAI ChatKit, OpenAI Agents SDK, and Gemini chat completion for integration into Docusaurus. Gathering documentation:

Architecture overview

High-level flow

User (Docusaurus Page)    ↓ChatKit React Component (Frontend)    ↓FastAPI Endpoint (Backend in Chatbot/)    ↓OpenAI Agents SDK Agent (Python)    ↓Custom Tool: Query Qdrant Vector DB    ↓Gemini Chat Completion (gemini-2.5-flash)    ↓Response back through FastAPI → ChatKit → User

Component breakdown

1. Frontend: OpenAI ChatKit in Docusaurus

What it is:

React component library (@openai/chatkit-react)

Pre-built chat UI with streaming, file uploads, widgets

Customizable styling

How to integrate:

Install: npm install @openai/chatkit-react

Create a custom Docusaurus page (React component)

Embed the <ChatKit> component

ChatKit calls your FastAPI backend to get a client_secret for session management

Key point: ChatKit needs a backend endpoint (/api/chatkit/session) that returns a client_secret. This is where your FastAPI backend comes in.

2. Backend: FastAPI in Chatbot folder

What you need:

Endpoint: POST /api/chatkit/session → Creates ChatKit session, returns client_secret

Endpoint: POST /api/chat → Receives user messages, processes through agent, returns response

Streaming support: For real-time response streaming

Architecture:

FastAPI App├── /api/chatkit/session (creates ChatKit session)├── /api/chat (main chat endpoint)└── Agent orchestration layer

3. OpenAI Agents SDK (Python)

What it is:

Framework for building AI agents

Supports function tools (your Qdrant query will be a tool)

Handles conversation history automatically

Built-in tracing/debugging

How it works:

Create an Agent with instructions (e.g., "You are a helpful assistant for the Physical AI textbook")

Add a custom function tool: @function_tool decorator for querying Qdrant

Agent automatically decides when to call the tool based on user query

Agent uses tool results + Gemini to generate response

Example structure:

@function_tooldef query_textbook(query: str) -> str:    """Query the textbook content from Qdrant vector database."""    # 1. Generate embedding for user query (using Gemini embedding)    # 2. Search Qdrant for similar chunks    # 3. Return relevant textbook content    agent = Agent(    name="Textbook Assistant",    instructions="You help students understand the Physical AI textbook...",    tools=[query_textbook]  # Your Qdrant query tool)

4. Gemini for chat completion

Why Gemini:

Free tier available

Good quality

Multilingual support

Streaming support

How to use:

Model: gemini-2.5-flash (fast, free tier)

Chat API: client.chats.create(model='gemini-2.5-flash')

Streaming: chat.send_message_stream('user query')

Multi-turn: Chat maintains conversation history automatically

Integration with Agents SDK:

The Agents SDK can use Gemini as the LLM provider

You configure the agent to use Gemini instead of OpenAI models

Complete data flow

Step-by-step:

User types question in ChatKit (Docusaurus page)

ChatKit sends message to your FastAPI endpoint

FastAPI receives request

Extracts user query

Calls OpenAI Agents SDK Runner

Agent processes query

Analyzes: "Does this need textbook content?"

If yes → Calls query_textbook tool

Tool function:

Generates embedding for query (Gemini embedding-001)

Searches Qdrant for top 3-5 relevant chunks

Returns chunks with metadata (module, section, URL)

Agent receives tool results

Gets relevant textbook chunks

Formats context for Gemini

Calls Gemini chat completion with:

System prompt: "You are a helpful assistant..."

User query: Original question

Context: Retrieved textbook chunks

Gemini generates response

Uses retrieved chunks as context

Generates answer with citations

Streams response back

Response flows back

FastAPI streams response to ChatKit

ChatKit displays in real-time

User sees answer with source citations

Technical details

ChatKit integration in Docusaurus:

Docusaurus supports:

Custom React pages (src/pages/chat.tsx)

React components in markdown (via MDX)

Custom layouts

You can:

Create a dedicated chat page: /chat

Embed in sidebar as a widget

Add to every page as a floating button

FastAPI endpoints needed:

POST /api/chatkit/session

Creates ChatKit session

Returns client_secret

Handles authentication

POST /api/chat (or streaming endpoint)

Receives: { "message": "user query", "thread_id": "..." }

Processes through agent

Returns: { "response": "agent output", "sources": [...] }

Supports Server-Sent Events (SSE) for streaming

Agent tool function structure:

@function_toolasync def query_textbook(    query: str,    max_results: int = 5) -> str:    """    Query the Physical AI Humanoid Robotics textbook content.        Searches the vector database for relevant content chunks    based on the user's question.        Args:        query: The user's question about the textbook        max_results: Maximum number of relevant chunks to retrieve            Returns:        Formatted string with relevant textbook content and citations    """    # 1. Generate query embedding (Gemini embedding-001)    # 2. Search Qdrant    # 3. Format results with citations    # 4. Return as string

Gemini chat integration:

The agent will use Gemini like this:

# In your agent's tool handler or response generationchat = gemini_client.chats.create(model='gemini-2.5-flash')response = chat.send_message(    f"""Context from textbook:    {retrieved_chunks}        User question: {user_query}        Answer based on the context above, with citations.""")

Important considerations

1. Session management

ChatKit manages conversation threads

Your FastAPI needs to track thread_id

Agents SDK has built-in session management (can integrate)

2. Streaming

ChatKit supports streaming responses

Gemini supports streaming (send_message_stream)

FastAPI needs to support SSE or WebSocket for streaming

3. Authentication

ChatKit requires client_secret generation

Your FastAPI needs to handle this securely

Can use simple API keys or more complex auth

4. Error handling

What if Qdrant is down?

What if Gemini API fails?

Need graceful fallbacks

5. Citations

Agent should return source URLs

ChatKit can display these as links

Format: [Source: Module 1 - Introduction](/modules/...)

Why this architecture works

Separation of concerns:

Frontend: ChatKit (UI only)

Backend: FastAPI (orchestration)

Agent: OpenAI Agents SDK (logic)

Database: Qdrant (retrieval)

LLM: Gemini (generation)

Flexibility:

Can swap Gemini for other models

Can add more tools (web search, etc.)

Can use multiple agents

Scalability:

FastAPI handles concurrent requests

Qdrant handles vector search efficiently

Streaming reduces perceived latency

Summary

Frontend: ChatKit React component embedded in Docusaurus

Backend: FastAPI with OpenAI Agents SDK

Agent: Has a Qdrant query tool function

LLM: Gemini for chat completion (not embeddings - those are already done)

Flow: User → ChatKit → FastAPI → Agent → Qdrant Tool → Gemini → Response

The key insight: The OpenAI Agents SDK agent acts as the orchestrator. It decides when to query Qdrant, formats the context, and uses Gemini to generate the final answer. ChatKit is just the UI layer that displays everything.

FastAPI, and Agent code will be implemented in 'Chatbot' folder, since this will be deployed on hugging face with docker image.
```

## Response snapshot

Created comprehensive specification for RAG ChatKit Agent Integration feature (010-rag-chatkit-agent). The specification includes:

**User Stories (4 total)**:
- P1: Ask Questions About Textbook Content (core interactive learning)
- P2: Real-Time Streaming Responses (UX enhancement)
- P2: View Source Citations (educational credibility)
- P3: Handle Errors Gracefully (production reliability)

**Functional Requirements (21 total)**:
- ChatKit frontend integration in Docusaurus
- FastAPI endpoints for session management and chat
- OpenAI Agents SDK agent orchestration
- Qdrant query tool function
- Gemini chat completion integration
- Streaming support
- Citation generation
- Error handling
- Session management
- Rate limiting

**Success Criteria (10 measurable outcomes)**:
- Response time targets (5 seconds for 90% of queries)
- Citation accuracy (95% of responses)
- Context maintenance (5+ turns)
- Streaming performance (2 seconds to first token)
- Concurrent session handling (10+ users)
- Error message delivery (1 second)
- Query success rate (95%)

**Key Entities (5)**:
- Chat Session
- User Query
- Retrieved Chunk
- Agent Response
- Citation

**Dependencies**:
- Feature 009-qdrant-setup (Qdrant infrastructure)
- Textbook content embeddings (must be complete)
- Gemini API access
- OpenAI Agents SDK

**Out of Scope**:
- User authentication (public access initially)
- Payment/subscription management
- Multi-language UI support
- Voice input/output
- File uploads
- External knowledge bases

Specification validated against quality checklist - all items pass. Ready for `/sp.plan` phase.

## Outcome

- ✅ Impact: Complete specification for RAG chat system with ChatKit frontend, OpenAI Agents SDK backend, and Gemini LLM integration
- 🧪 Tests: Specification includes testable acceptance scenarios for all user stories
- 📁 Files: Created spec.md and requirements checklist
- 🔁 Next prompts: `/sp.plan` to create implementation plan
- 🧠 Reflection: Specification successfully captures the architecture from research while maintaining technology-agnostic requirements and measurable success criteria

## Evaluation notes (flywheel)

- Failure modes observed: None
- Graders run and results (PASS/FAIL): All checklist items PASS
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): Proceed to planning phase

