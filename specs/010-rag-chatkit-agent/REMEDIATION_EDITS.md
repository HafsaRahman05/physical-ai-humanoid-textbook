# Remediation Edits: RAG ChatKit Agent Integration

**Date**: 2025-12-05  
**Issues Addressed**: Top 2 medium-severity issues from analysis

## Issue 1: T051 - Conversation Context Management Underspecification

**Current Task**:
```
- [ ] T051 [P] Add conversation context management in Chatbot/src/chatbot/api/routes.py to maintain session history per FR-005
```

**Problem**: Task lacks specific implementation details (storage mechanism, context format, session linking).

**Proposed Remediation**:

Replace T051 with enhanced version:

```
- [ ] T051 [P] Implement conversation context management in Chatbot/src/chatbot/api/routes.py to maintain session history per FR-005:
  - Create in-memory session storage: Dict[str, List[Dict[str, Any]]] keyed by session_id
  - Message format: {"role": "user|assistant", "content": str, "timestamp": datetime}
  - Store conversation history per session (max 20 messages per session for memory efficiency)
  - Integrate with Agents SDK session management (use Runner with session parameter)
  - Retrieve history before agent.run() and append new messages after response
  - Support context retrieval for follow-up questions (FR-005, SC-004)
```

---

## Issue 2: T053 - Concurrent Sessions Coverage Gap

**Current Task**:
```
- [ ] T053 [P] Add session management in Chatbot/src/chatbot/api/routes.py (in-memory storage for MVP)
```

**Problem**: Task doesn't clarify that in-memory dictionary supports concurrent access via FastAPI's async nature.

**Proposed Remediation**:

Replace T053 with enhanced version:

```
- [ ] T053 [P] Implement session management in Chatbot/src/chatbot/api/routes.py (in-memory storage for MVP):
  - Create session storage dictionary: Dict[str, SessionData] keyed by session_id
  - SessionData structure: {session_id, created_at, last_activity, thread_id, message_count}
  - FastAPI async request handling enables concurrent access (no explicit locking needed for reads)
  - Support 10+ concurrent sessions per SC-006 (FastAPI async handles concurrent requests)
  - Track session metadata for rate limiting and analytics
  - Optional: Add session cleanup task for expired sessions (future enhancement)
```

**Alternative**: If T051 and T053 are too similar, consider merging them:

```
- [ ] T051 [P] Implement session and conversation context management in Chatbot/src/chatbot/api/routes.py:
  - Session storage: Dict[str, SessionData] with session_id, created_at, last_activity, thread_id
  - Conversation history: Dict[str, List[Message]] keyed by session_id
  - Message format: {"role": "user|assistant", "content": str, "timestamp": datetime}
  - FastAPI async enables concurrent access (10+ sessions per SC-006)
  - Integrate with Agents SDK Runner session parameter for context management
  - Store max 20 messages per session for memory efficiency
```

---

## Issue 3: Terminology Standardization (Optional - Low Priority)

**Status**: After review, terminology is already consistent:
- "ChatKit" (capitalized) used for component/library names ✅
- "/api/chatkit/session" (lowercase) used for URL paths ✅ (correct - URLs are lowercase)
- "@openai/chatkit-react" (lowercase) used for package name ✅ (correct - npm packages are lowercase)

**Conclusion**: No changes needed - terminology is correct as-is.

---

## Recommended Approach

**Option A: Enhance Both Tasks Separately** (Recommended)
- Keep T051 and T053 as separate tasks
- Enhance T051 with conversation history details
- Enhance T053 with concurrent access clarification
- Both tasks remain in Polish phase (Phase 7)

**Option B: Merge Tasks**
- Combine T051 and T053 into single comprehensive task
- Reduces task count from 56 to 55
- More cohesive but less granular

**Recommendation**: **Option A** - Keep tasks separate for better granularity and traceability.

---

## Implementation Notes

### For T051 (Conversation Context):
- Storage location: Module-level dictionary in `routes.py` or separate `services/session.py`
- Integration point: Before calling `Runner.run(agent, query)`, retrieve history
- Agents SDK: Use `Runner.run()` with session context or manual history prepending
- Memory management: Implement LRU eviction or message limit (20 messages)

### For T053 (Session Management):
- FastAPI async nature: Each request runs in async context, dictionary access is safe for concurrent reads
- Write safety: If writes are needed, consider `asyncio.Lock` for session updates (unlikely needed for MVP)
- Session tracking: Store minimal metadata (id, timestamps, counts) separate from conversation history

---

## Files to Update

1. `specs/010-rag-chatkit-agent/tasks.md`:
   - Replace T051 with enhanced version
   - Replace T053 with enhanced version

2. Optional: Update `specs/010-rag-chatkit-agent/ANALYSIS_REPORT.md`:
   - Mark U1 and C2 as resolved after remediation

---

## Approval Required

Please review these remediation edits and approve before I apply them to `tasks.md`.

**Questions for consideration**:
1. Do you prefer Option A (separate tasks) or Option B (merged task)?
2. Should conversation history be in `routes.py` or separate `services/session.py`?
3. Any specific memory limits or session expiration policies to include?

