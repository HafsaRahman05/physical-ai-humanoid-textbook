# Feature Specification: FastEmbed Migration from Gemini Embeddings

**Feature Branch**: `013-fastembed-migration`  
**Created**: 2025-01-27  
**Status**: Draft  
**Input**: User description: "Convert from Gemini embedding-001 model to FastEmbed BAAI/bge-small-en-v1.5 model for both book content embedding and user query embedding."

## Clarifications

### Session 2025-01-27

- Q: Where should the FastEmbed model be initialized and pre-downloaded? → A: Pre-initialize in main.py lifespan startup event
- Q: How should FastEmbed embedding errors be handled? → A: Reuse EmbeddingGenerationError for all FastEmbed errors, remove Gemini-specific errors
- Q: Should we use different FastEmbed methods for queries vs documents? → A: Use query_embed() for user queries, embed() for document content
- Q: Should GEMINI_API_KEY remain required after migration? → A: Keep GEMINI_API_KEY required (still needed for agent LLM responses)
- Q: How should we handle the Qdrant collection during migration? → A: Delete and recreate the collection to ensure clean state and avoid dimension mismatches

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Migrate Embedding System (Priority: P1)

As a system administrator, I need to migrate the chatbot's embedding system from Gemini API to a local FastEmbed solution so that the system operates without API rate limits, quota restrictions, or external service dependencies.

**Why this priority**: This is a critical infrastructure change that eliminates quota-related failures and ensures the chatbot can operate reliably without external API dependencies. Without this, the system experiences service interruptions due to rate limits.

**Independent Test**: Can be fully tested by running the migration script, verifying embeddings are generated locally, and confirming the chatbot responds to queries without rate limit errors. This delivers a reliable, self-contained embedding system.

**Acceptance Scenarios**:

1. **Given** the system currently uses Gemini API for embeddings, **When** the migration is executed, **Then** all existing embeddings are replaced with FastEmbed-generated embeddings and the system operates without API calls
2. **Given** textbook content exists in the system, **When** the re-embedding process runs, **Then** all content is successfully embedded using FastEmbed and stored in the vector database
3. **Given** a user submits a query via the chatbot, **When** the backend processes the query, **Then** the query is embedded using FastEmbed and similarity search returns relevant results without errors
4. **Given** the system is deployed, **When** the application starts, **Then** the FastEmbed model is pre-initialized in the lifespan startup event and ready for use without external API dependencies

---

### User Story 2 - Eliminate Rate Limit Errors (Priority: P1)

As a chatbot user, I need the system to respond to my queries without rate limit errors so that I can use the chatbot reliably whenever I need help.

**Why this priority**: Rate limit errors directly impact user experience and prevent users from accessing the chatbot when they need it. This is a critical reliability issue.

**Independent Test**: Can be fully tested by sending multiple queries in succession and verifying no rate limit errors occur. This delivers uninterrupted chatbot access for users.

**Acceptance Scenarios**:

1. **Given** a user submits multiple queries in quick succession, **When** each query is processed, **Then** all queries are processed successfully without rate limit errors
2. **Given** the system is under high load, **When** multiple users submit queries simultaneously, **Then** all queries are processed without quota-related failures

---

### User Story 3 - Maintain Search Quality (Priority: P2)

As a chatbot user, I need the chatbot to return relevant and accurate results to my queries so that I receive helpful information from the textbook content.

**Why this priority**: While migration is important, maintaining search quality ensures users continue to receive valuable responses. This validates that the new embedding system performs as well as the previous one.

**Independent Test**: Can be fully tested by submitting various queries and comparing the relevance and accuracy of results before and after migration. This delivers confidence that the migration doesn't degrade user experience.

**Acceptance Scenarios**:

1. **Given** a user submits a query about a specific topic, **When** the system performs similarity search, **Then** the returned results are relevant to the query topic
2. **Given** the system has been migrated to FastEmbed, **When** users submit queries, **Then** the quality of search results is comparable to or better than the previous system

---

### Edge Cases

- What happens when the FastEmbed model fails to download during deployment?
- How does the system handle embedding generation errors? (Uses EmbeddingGenerationError for all FastEmbed errors)
- What happens if the vector database collection has dimension mismatches? (Collection is deleted and recreated during migration to prevent mismatches)
- How does the system handle empty or invalid text inputs during embedding?
- What happens during the migration if the re-embedding process is interrupted?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST generate embeddings locally using FastEmbed without requiring external API calls
- **FR-002**: System MUST replace all existing Gemini-generated embeddings with FastEmbed-generated embeddings by deleting and recreating the Qdrant collection
- **FR-003**: System MUST operate without rate limits or quota restrictions for embedding generation
- **FR-004**: System MUST maintain the same interface for embedding generation to ensure compatibility with existing code
- **FR-012**: System MUST use EmbeddingGenerationError for all FastEmbed embedding failures (removing Gemini-specific error types)
- **FR-005**: System MUST support embedding generation for both user queries and textbook content (using query_embed() for queries and embed() for documents)
- **FR-006**: System MUST handle the dimension change from 1536 to 384 dimensions in the vector database
- **FR-007**: System MUST automatically download and cache the FastEmbed model on first use
- **FR-008**: System MUST pre-download and initialize the FastEmbed model in main.py lifespan startup event to avoid cold start delays in deployment
- **FR-009**: System MUST validate that all embeddings are generated with the correct dimensions (384)
- **FR-010**: System MUST preserve all metadata (module, section, URL, content) when re-embedding textbook content
- **FR-011**: System MUST work correctly when deployed to cloud platforms with persistent storage

### Key Entities *(include if feature involves data)*

- **EmbeddingModel**: Represents the FastEmbed model configuration (model name: BAAI/bge-small-en-v1.5, dimensions: 384, provider: FastEmbed local)
- **VectorCollection**: Represents the vector database collection that stores embeddings (dimension: 384, contains textbook content embeddings)
- **EmbeddingService**: Service that generates embeddings for text (input: text string, output: 384-dimensional vector)
- **QueryEmbedding**: Embedding generated for user queries using query_embed() method (used for similarity search)
- **DocumentEmbedding**: Embedding generated for textbook content using embed() method (stored in vector database)

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: System operates without rate limit or quota errors for 100% of embedding generation requests
- **SC-002**: All textbook content is successfully re-embedded and stored in the vector database within the migration window
- **SC-003**: User queries are embedded and processed successfully in under 2 seconds (excluding network latency)
- **SC-004**: Similarity search returns relevant results with quality comparable to the previous system (validated through user testing)
- **SC-005**: System successfully starts and initializes the FastEmbed model within 30 seconds of deployment startup
- **SC-006**: Zero external API dependencies for embedding generation (100% local execution)
- **SC-007**: All embedding generation requests complete successfully without errors for 99.9% of requests
- **SC-008**: Migration process completes successfully with all existing content re-embedded and verified

## Assumptions

1. **Dimension Compatibility**: 384-dimensional vectors provide sufficient quality for similarity search (supported by benchmark scores showing competitive performance)
2. **Re-embedding Time**: Re-embedding all textbook content is acceptable as a one-time operation during migration
3. **Storage Capacity**: Deployment platform has sufficient disk space for FastEmbed model (approximately 0.067 GB)
4. **Model Availability**: FastEmbed model downloads successfully from Hugging Face Hub
5. **Chunking Strategy**: Existing content chunking strategy remains valid for FastEmbed embeddings
6. **Collection Recreation**: Deleting and recreating the vector database collection is acceptable (no need to preserve old vectors)
7. **User Experience**: Users will not notice a difference in search quality despite the dimension change

## Dependencies

### External Dependencies
- FastEmbed library (open-source, MIT/Apache 2.0 license)
- Hugging Face Hub (for model downloads, via FastEmbed)
- Vector database (Qdrant) for storing and retrieving embeddings

### Internal Dependencies
- Existing textbook content in markdown format
- Existing embedding service interface
- Existing agent system for generating responses
- Existing API routes for handling user queries

### Removed Dependencies
- Google Gemini API for embeddings (no longer required for embeddings, but still used by agent LLM)
- Gemini API key configuration (still required for agent LLM, but not for embeddings)

## Out of Scope

1. **Multiple Embedding Models**: Not supporting multiple embedding models simultaneously
2. **Dimension Migration Tools**: No automated migration tools for preserving old vectors during transition
3. **Model Fine-tuning**: Not fine-tuning FastEmbed models for specific use cases
4. **Hybrid Search**: Not implementing sparse + dense hybrid search
5. **Embedding Caching**: Not implementing additional embedding caching beyond FastEmbed's built-in cache
6. **Model Versioning**: Not implementing model versioning or rollback mechanisms
7. **Agent LLM Changes**: Not changing the agent's language model (still uses Gemini for response generation)
