# Tasks: FastEmbed Migration from Gemini Embeddings

**Input**: Design documents from `/specs/013-fastembed-migration/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Tests are OPTIONAL and not explicitly requested in the specification. Focus on implementation tasks.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Single project**: `Chatbot/src/`, `Chatbot/tests/` at repository root
- Paths shown below use `Chatbot/` prefix for all files

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and dependency management

- [X] T001 Add FastEmbed dependency to Chatbot/pyproject.toml (fastembed>=0.7.4)
- [X] T002 [P] Install FastEmbed dependency via `uv pip install fastembed` or `pip install fastembed`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T003 Update vector_dimension configuration from 1536 to 384 in Chatbot/src/chatbot/config.py
- [X] T004 [P] Update EmbeddingServiceInterface docstring to reflect 384 dimensions in Chatbot/src/chatbot/services/__init__.py
- [X] T005 [P] [US1] Remove GeminiAPIError and GeminiAuthenticationError imports from Chatbot/src/chatbot/services/embedding.py (keep in exceptions.py as they're still used by chat.py for agent LLM)

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Migrate Embedding System (Priority: P1) 🎯 MVP

**Goal**: Replace Gemini embedding service with FastEmbed local implementation, update configuration, and migrate Qdrant collection to 384 dimensions.

**Independent Test**: Run migration script, verify embeddings are generated locally, confirm chatbot responds to queries without rate limit errors.

### Implementation for User Story 1

- [X] T006 [P] [US1] Replace EmbeddingService class with FastEmbedEmbeddingService in Chatbot/src/chatbot/services/embedding.py
- [X] T007 [US1] Implement FastEmbedEmbeddingService.__init__() with TextEmbedding model initialization in Chatbot/src/chatbot/services/embedding.py
- [X] T008 [US1] Implement FastEmbedEmbeddingService.generate_embedding() using query_embed() method in Chatbot/src/chatbot/services/embedding.py
- [X] T009 [US1] Add dimension validation (384) and error handling in Chatbot/src/chatbot/services/embedding.py
- [X] T010 [US1] Update get_embedding_service() to return FastEmbedEmbeddingService instance in Chatbot/src/chatbot/services/embedding.py
- [X] T011 [P] [US1] Add FastEmbed model pre-initialization in lifespan startup event in Chatbot/src/chatbot/main.py
- [X] T011A [US1] Add error handling for FastEmbed model download failure in Chatbot/src/chatbot/main.py lifespan startup (log error, continue startup, model will download on first use)
- [X] T012 [P] [US1] Update dimension validation in validate_collection_config() to expect 384 dimensions in Chatbot/src/chatbot/qdrant/collections.py
- [X] T013 [US1] Create migration script Chatbot/migrate_collection.py that deletes existing 'textbook_content' collection and recreates it with 384 dimensions using create_collection() from chatbot.qdrant.collections
- [X] T014 [US1] Update embed_textbook.py to use FastEmbed embed() method for documents in Chatbot/embed_textbook.py
- [X] T015 [US1] Update embed_missing_files.py to use FastEmbed embed() method in Chatbot/embed_missing_files.py
- [X] T016 [US1] Execute migration script: `python Chatbot/migrate_collection.py` to delete and recreate collection with 384 dimensions
- [X] T017 [US1] Run re-embedding script: `python Chatbot/embed_textbook.py` to populate Qdrant with FastEmbed embeddings (384 dimensions)

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently. FastEmbed service is implemented, collection is migrated, and content is re-embedded.

---

## Phase 4: User Story 2 - Eliminate Rate Limit Errors (Priority: P1)

**Goal**: Verify and validate that the system operates without rate limits or quota restrictions.

**Independent Test**: Send multiple queries in quick succession and verify no rate limit errors occur.

### Implementation for User Story 2

- [X] T018 [US2] Verify agent/tools.py uses get_embedding_service() correctly (no changes needed) in Chatbot/src/chatbot/agent/tools.py
- [X] T019 [US2] Test multiple sequential queries to verify no rate limit errors
- [X] T020 [US2] Test concurrent queries to verify no quota-related failures
- [X] T021 [US2] Verify all embedding generation requests complete successfully (99.9% success rate)

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently. System operates without rate limits.

---

## Phase 5: User Story 3 - Maintain Search Quality (Priority: P2)

**Goal**: Validate that search quality is maintained or improved after migration.

**Independent Test**: Submit various queries and compare relevance and accuracy of results before and after migration.

### Implementation for User Story 3

- [X] T022 [US3] Test similarity search returns relevant results for various query topics
- [X] T023 [US3] Compare search result quality before and after migration (manual validation)
- [X] T024 [US3] Verify similarity scores are reasonable and results are contextually relevant
- [X] T025 [US3] Document any quality differences or improvements observed

**Checkpoint**: All user stories should now be independently functional. Search quality is validated.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [X] T027 [P] Remove unused Gemini embedding imports from Chatbot/src/chatbot/services/embedding.py if any remain
- [X] T028 [P] Update any documentation references to embedding dimensions in Chatbot/README.md or Chatbot/EMBEDDING_GUIDE.md
- [X] T029 Verify startup time meets <30 seconds requirement for model initialization
- [X] T030 Verify embedding generation time meets <2 seconds requirement per query
- [X] T031 Run quickstart.md validation steps to ensure migration guide is accurate
- [X] T032 [P] Clean up any temporary migration scripts or files

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - User Story 1 (P1) can start after Foundational
  - User Story 2 (P1) depends on User Story 1 completion (needs migrated system to test)
  - User Story 3 (P2) depends on User Story 1 completion (needs migrated system to validate)
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P1)**: Depends on User Story 1 completion - Needs migrated system to test rate limit elimination
- **User Story 3 (P2)**: Depends on User Story 1 completion - Needs migrated system to validate search quality

### Within Each User Story

- Core service implementation before scripts
- Service implementation before collection migration
- Collection migration before re-embedding
- Re-embedding before validation/testing
- Story complete before moving to next priority

### Parallel Opportunities

- **Phase 1**: T001 and T002 can run in parallel (different activities)
- **Phase 2**: T004 and T005 can run in parallel (different files)
- **Phase 3 (US1)**: 
  - T006, T011, T012 can start in parallel (different files)
  - T011A depends on T011 (error handling for same startup event)
  - T013, T014, T015 can run in parallel (different scripts)
- **Phase 4 (US2)**: T018, T019, T020 can run in parallel (different test scenarios)
- **Phase 5 (US3)**: T022, T023, T024 can run in parallel (different validation activities)
- **Phase 6**: T027, T028 can run in parallel (different files)

---

## Parallel Example: User Story 1

```bash
# Launch service implementation tasks in parallel:
Task: "Replace EmbeddingService class with FastEmbedEmbeddingService in Chatbot/src/chatbot/services/embedding.py"
Task: "Add FastEmbed model pre-initialization in lifespan startup event in Chatbot/src/chatbot/main.py"
Task: "Update dimension validation in validate_collection_config() to expect 384 dimensions in Chatbot/src/chatbot/qdrant/collections.py"

# Launch script updates in parallel:
Task: "Update embed_textbook.py to use FastEmbed embed() method for documents in Chatbot/embed_textbook.py"
Task: "Update embed_missing_files.py to use FastEmbed embed() method in Chatbot/embed_missing_files.py"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (add FastEmbed dependency)
2. Complete Phase 2: Foundational (update config, interface)
3. Complete Phase 3: User Story 1 (implement service, migrate collection, re-embed)
4. **STOP and VALIDATE**: Test User Story 1 independently
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 → Test independently → Deploy/Demo (Rate limit elimination verified)
4. Add User Story 3 → Test independently → Deploy/Demo (Quality validated)
5. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1 (service implementation)
   - Developer B: User Story 1 (script updates) - can work in parallel
   - Developer C: User Story 1 (collection migration) - after service is ready
3. After User Story 1:
   - Developer A: User Story 2 (rate limit testing)
   - Developer B: User Story 3 (quality validation)
4. Stories complete and integrate independently

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: vague tasks, same file conflicts, cross-story dependencies that break independence
- **Critical Path**: T001 → T002 → T003 → T006-T017 (US1) → T018-T021 (US2) → T022-T025 (US3) → T027-T032 (Polish)

