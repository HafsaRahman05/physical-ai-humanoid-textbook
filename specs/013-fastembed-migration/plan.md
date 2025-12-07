# Implementation Plan: FastEmbed Migration from Gemini Embeddings

**Branch**: `013-fastembed-migration` | **Date**: 2025-12-06 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/013-fastembed-migration/spec.md`

**Note**: This template is filled in by the `/sp.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Migrate the chatbot's embedding system from Google Gemini `embedding-001` API (1536 dimensions) to FastEmbed `BAAI/bge-small-en-v1.5` local model (384 dimensions). This eliminates API rate limits, quota restrictions, and external service dependencies while maintaining search quality. The migration involves replacing the embedding service implementation, updating configuration, deleting and recreating the Qdrant collection, and re-embedding all textbook content.

## Technical Context

**Language/Version**: Python 3.11+  
**Primary Dependencies**: FastEmbed >=0.7.4, FastAPI, Qdrant Client, OpenAI Agents SDK (for agent LLM)  
**Storage**: Qdrant vector database (collection: `textbook_content`, dimension: 384)  
**Testing**: pytest, pytest-asyncio, pytest-mock  
**Target Platform**: Linux server (Hugging Face Spaces deployment via Docker)  
**Project Type**: Single backend project (FastAPI service)  
**Performance Goals**: 
- Embedding generation: <2 seconds per query (excluding network latency)
- Startup initialization: <30 seconds for model download and initialization
- 99.9% success rate for embedding generation requests
**Constraints**: 
- Must maintain same EmbeddingServiceInterface for compatibility
- Must preserve all metadata (module, section, URL, content) during re-embedding
- Must work with persistent storage on Hugging Face Spaces (0.067 GB model size)
- GEMINI_API_KEY still required for agent LLM (not for embeddings)
**Scale/Scope**: 
- All existing textbook content in `docs/modules/` directory
- Existing Qdrant collection with thousands of vectors (to be re-embedded)
- Single embedding service instance (pre-initialized at startup)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### ✅ Principle I: Documentation-First Architecture
**Status**: PASS - No impact. This feature modifies backend embedding service, not documentation structure.

### ✅ Principle II: Modular Content Organization
**Status**: PASS - No impact. Content modules remain unchanged.

### ✅ Principle III: Vector Database Integration (NON-NEGOTIABLE)
**Status**: PASS - Feature directly supports this principle by:
- Maintaining Qdrant integration
- Ensuring all content remains embeddable
- Preserving embedding pipeline reproducibility
- Updating vector database schema (dimension change)

### ✅ Principle IV: AI Agent Architecture
**Status**: PASS - Feature supports this principle by:
- Maintaining OpenAI Agents SDK integration
- Ensuring agent continues to use Qdrant for retrieval
- Preserving citation traceability
- No changes to FastAPI endpoints or agent behavior

### ✅ Principle V: Deployment Standards
**Status**: PASS - Feature supports this principle by:
- Maintaining Hugging Face Space deployment compatibility
- Ensuring Docker image compatibility
- Model pre-download at startup ensures reliable deployment
- No changes to deployment configuration structure

### ✅ Principle VI: API-First Backend Design
**Status**: PASS - Feature supports this principle by:
- Maintaining same API interface (EmbeddingServiceInterface)
- No changes to FastAPI endpoints
- Preserving error handling patterns
- Backward-compatible service interface

**Overall Gate Status**: ✅ **PASS** - All constitution principles satisfied. Feature enhances vector database integration without violating any principles.

## Project Structure

### Documentation (this feature)

```text
specs/013-fastembed-migration/
├── plan.md              # This file (/sp.plan command output)
├── research.md          # Phase 0 output (already exists, will be updated)
├── data-model.md        # Phase 1 output (/sp.plan command)
├── quickstart.md        # Phase 1 output (/sp.plan command)
├── contracts/           # Phase 1 output (/sp.plan command)
│   └── embedding-service.md  # Service interface contract
└── tasks.md             # Phase 2 output (/sp.tasks command - NOT created by /sp.plan)
```

### Source Code (repository root)

```text
Chatbot/
├── src/
│   └── chatbot/
│       ├── services/
│       │   └── embedding.py          # Replace GeminiEmbeddingService with FastEmbedEmbeddingService
│       ├── config.py                  # Update vector_dimension: 1536 → 384
│       ├── main.py                    # Add FastEmbed model pre-initialization in lifespan
│       ├── qdrant/
│       │   └── collections.py        # Update dimension validation (384)
│       └── agent/
│           └── tools.py               # Uses embedding service (no changes needed)
│
├── embed_textbook.py                  # Update to use FastEmbed instead of Gemini
├── embed_missing_files.py            # Update to use FastEmbed instead of Gemini
├── pyproject.toml                    # Add fastembed>=0.7.4 dependency
│
└── tests/
    ├── unit/
    │   └── test_embedding.py         # Update tests for FastEmbed (384 dimensions)
    └── integration/
        └── test_embedding_service.py # Test FastEmbed integration
```

**Structure Decision**: Single backend project structure. The Chatbot directory contains the FastAPI backend service. The embedding service is located in `src/chatbot/services/embedding.py` and will be replaced with a FastEmbed implementation. Configuration changes are minimal (vector_dimension update). Embedding scripts at the root level will be updated to use FastEmbed.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

No violations detected. All changes align with existing architecture and constitution principles.
