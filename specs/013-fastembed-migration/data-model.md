# Data Model: FastEmbed Migration

**Feature**: 013-fastembed-migration  
**Date**: 2025-01-27

## Entity: EmbeddingModel

Represents the embedding model configuration and state.

### Attributes

- **model_name**: `str` - Model identifier: `"BAAI/bge-small-en-v1.5"`
- **dimensions**: `int` - Vector dimension: `384`
- **provider**: `str` - Provider name: `"fastembed"`
- **cache_location**: `str | None` - Optional custom cache directory path
- **model_size_gb**: `float` - Model file size: `0.067`
- **license**: `str` - License type: `"MIT"`
- **sequence_length**: `int` - Maximum input tokens: `512`

### Methods

- `embed(texts: list[str]) -> Generator[np.ndarray]` - Generate embeddings for documents
- `query_embed(queries: list[str]) -> Generator[np.ndarray]` - Generate query-optimized embeddings
- `passage_embed(passages: list[str]) -> Generator[np.ndarray]` - Generate passage-optimized embeddings

### State Transitions

```
Not Downloaded → Downloading → Ready → In Use
                                    ↓
                                 Cached
```

## Entity: QdrantCollection

Represents the Qdrant vector collection configuration.

### Attributes (Before Migration)

- **name**: `str` - `"textbook_content"`
- **vector_dimension**: `int` - `1536` (Gemini)
- **distance_metric**: `str` - `"COSINE"`
- **point_count**: `int` - Number of stored vectors
- **status**: `str` - `"active"` or `"migrating"`

### Attributes (After Migration)

- **name**: `str` - `"textbook_content"`
- **vector_dimension**: `int` - `384` (FastEmbed) ⚠️ Changed
- **distance_metric**: `str` - `"COSINE"` (unchanged)
- **point_count**: `int` - Number of stored vectors (reset to 0, then re-populated)
- **status**: `str` - `"active"`

### Migration State

```
Active (1536) → Deleting → Empty → Recreating (384) → Active (384)
```

## Entity: EmbeddingService

Service for generating embeddings.

### Interface (Unchanged)

```python
class EmbeddingServiceInterface(ABC):
    @abstractmethod
    async def generate_embedding(self, text: str) -> list[float]:
        """Generate embedding vector for text.
        
        Returns:
            384-dimensional embedding vector (changed from 1536)
        """
```

### Implementation (Before)

- **Type**: `EmbeddingService` (Gemini)
- **Provider**: Google Gemini API
- **Model**: `models/embedding-001`
- **Dimensions**: 1536
- **API Key Required**: Yes (`GEMINI_API_KEY`)
- **Rate Limits**: Yes (quota restrictions)

### Implementation (After)

- **Type**: `FastEmbedEmbeddingService` (FastEmbed)
- **Provider**: FastEmbed (local)
- **Model**: `BAAI/bge-small-en-v1.5`
- **Dimensions**: 384 ⚠️ Changed
- **API Key Required**: No
- **Rate Limits**: No

## Entity: VectorPoint

Represents a single vector point in Qdrant.

### Attributes (Before Migration)

- **point_id**: `str | int` - Unique identifier
- **vector**: `list[float]` - 1536-dimensional embedding vector
- **payload**: `dict` - Metadata (module, section, url, content, etc.)
- **score**: `float | None` - Similarity score (when retrieved)

### Attributes (After Migration)

- **point_id**: `str | int` - Unique identifier (may change during re-embedding)
- **vector**: `list[float]` - 384-dimensional embedding vector ⚠️ Changed
- **payload**: `dict` - Metadata (unchanged: module, section, url, content, etc.)
- **score**: `float | None` - Similarity score (when retrieved)

## Entity: QueryEmbedding

Represents an embedding generated for a user query.

### Attributes

- **query_text**: `str` - Original user query
- **embedding**: `list[float]` - 384-dimensional vector (FastEmbed)
- **method**: `str` - `"query_embed"` (optimized for queries)
- **timestamp**: `datetime` - When embedding was generated

### Flow

```
User Query → FastEmbed.query_embed() → 384-dim vector → Qdrant Search
```

## Entity: DocumentEmbedding

Represents an embedding generated for textbook content.

### Attributes

- **content**: `str` - Document text chunk
- **embedding**: `list[float]` - 384-dimensional vector (FastEmbed)
- **method**: `str` - `"embed"` or `"passage_embed"`
- **metadata**: `dict` - Module, section, URL, etc.
- **timestamp**: `datetime` - When embedding was generated

### Flow

```
Textbook Content → FastEmbed.embed() → 384-dim vector → Qdrant Storage
```

## Entity: MigrationState

Tracks the migration process state.

### Attributes

- **phase**: `str` - Current migration phase
  - `"preparation"` - Installing dependencies, updating config
  - `"model_integration"` - Implementing FastEmbed service
  - `"data_migration"` - Deleting old vectors, re-embedding
  - `"service_update"` - Updating agent and API routes
  - `"deployment"` - Deploying to Hugging Face Spaces
- **old_dimension**: `int` - 1536 (Gemini)
- **new_dimension**: `int` - 384 (FastEmbed)
- **vectors_deleted**: `bool` - Whether old vectors are deleted
- **vectors_re_embedded**: `bool` - Whether re-embedding is complete
- **collection_recreated**: `bool` - Whether collection is recreated

## Relationships

```
EmbeddingModel (1) ──generates──> (N) VectorPoint
EmbeddingService (1) ──uses──> (1) EmbeddingModel
QueryEmbedding (1) ──searches──> (N) VectorPoint
DocumentEmbedding (1) ──stored_as──> (1) VectorPoint
QdrantCollection (1) ──contains──> (N) VectorPoint
MigrationState (1) ──tracks──> (1) QdrantCollection
```

## Data Flow

### Current Flow (Gemini)

```
User Query → Gemini API → 1536-dim vector → Qdrant Search (1536-dim) → Results
Textbook Content → Gemini API → 1536-dim vector → Qdrant Storage (1536-dim)
```

### Target Flow (FastEmbed)

```
User Query → FastEmbed (local) → 384-dim vector → Qdrant Search (384-dim) → Results
Textbook Content → FastEmbed (local) → 384-dim vector → Qdrant Storage (384-dim)
```

## Migration Impact

### Data Changes

1. **Vector Dimensions**: 1536 → 384 (all vectors)
2. **Collection Configuration**: Dimension parameter updated
3. **Point IDs**: May change during re-embedding (if regenerating IDs)
4. **Metadata**: Unchanged (module, section, URL, content)

### Service Changes

1. **Embedding Service**: Gemini API → FastEmbed (local)
2. **API Dependencies**: Remove Gemini embedding dependency
3. **Configuration**: Update vector_dimension to 384
4. **Error Handling**: Update for FastEmbed-specific errors

### No Changes

1. **Agent**: Still uses Gemini 2.5 Flash for response generation
2. **API Routes**: Same endpoints, same response format
3. **Frontend**: No changes required
4. **Qdrant Client**: Same client, different collection dimension

