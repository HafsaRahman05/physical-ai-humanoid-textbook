# Embedding Service Contract

**Feature**: 013-fastembed-migration  
**Date**: 2025-12-06  
**Service**: EmbeddingServiceInterface

## Service Interface

### EmbeddingServiceInterface

```python
from abc import ABC, abstractmethod

class EmbeddingServiceInterface(ABC):
    """Interface for embedding generation service."""
    
    @abstractmethod
    async def generate_embedding(self, text: str) -> list[float]:
        """Generate embedding vector for text.
        
        Args:
            text: Input text to embed (non-empty string)
            
        Returns:
            384-dimensional embedding vector (list of floats)
            
        Raises:
            EmbeddingGenerationError: If embedding generation fails
            ValueError: If text is empty or invalid
        """
        pass
```

## Implementation Contract: FastEmbedEmbeddingService

### Class Definition

```python
from fastembed import TextEmbedding
from chatbot.services import EmbeddingServiceInterface
from chatbot.exceptions import EmbeddingGenerationError

class FastEmbedEmbeddingService(EmbeddingServiceInterface):
    """Service for generating embeddings using FastEmbed BAAI/bge-small-en-v1.5."""
    
    def __init__(self, model_name: str = "BAAI/bge-small-en-v1.5"):
        """Initialize FastEmbed model.
        
        Args:
            model_name: FastEmbed model identifier (default: BAAI/bge-small-en-v1.5)
        """
        self.model = TextEmbedding(model_name=model_name)
    
    async def generate_embedding(self, text: str) -> list[float]:
        """Generate embedding vector for text using FastEmbed.
        
        Args:
            text: Input text to embed
            
        Returns:
            384-dimensional embedding vector
            
        Raises:
            EmbeddingGenerationError: If embedding generation fails
            ValueError: If text is empty or invalid
        """
        # Implementation details...
```

## Method Contracts

### generate_embedding()

**Signature**: `async def generate_embedding(self, text: str) -> list[float]`

**Preconditions**:
- `text` must be a non-empty string
- `text` must be a valid UTF-8 string
- Model must be initialized (done in `__init__`)

**Postconditions**:
- Returns a list of exactly 384 floats
- All float values are finite (not NaN, not infinity)
- Embedding is deterministic for identical input text

**Error Conditions**:
- `ValueError`: If `text` is empty or None
- `EmbeddingGenerationError`: If FastEmbed model fails to generate embedding
- `EmbeddingGenerationError`: If generated embedding has incorrect dimensions

**Usage Patterns**:

1. **For User Queries** (in `agent/tools.py`):
   ```python
   embedding_service = get_embedding_service()
   query_embedding = await embedding_service.generate_embedding(user_query)
   # query_embedding is 384-dimensional vector
   ```

2. **For Document Content** (in `embed_textbook.py`):
   ```python
   embedding_service = get_embedding_service()
   doc_embedding = await embedding_service.generate_embedding(chunk_text)
   # doc_embedding is 384-dimensional vector
   ```

## Implementation Notes

### Query vs Document Embedding

While the interface uses a single `generate_embedding()` method, the implementation should use:
- `query_embed()` for user queries (optimized for search)
- `embed()` for document content (general-purpose)

This optimization is internal to the service implementation and does not affect the interface contract.

### Model Initialization

The FastEmbed model should be:
- Pre-initialized in `main.py` lifespan startup event
- Cached globally via `get_embedding_service()` singleton pattern
- Reused across all embedding requests

### Error Handling

All errors should be wrapped in `EmbeddingGenerationError`:
- FastEmbed-specific errors → `EmbeddingGenerationError`
- Invalid input → `ValueError` (then wrapped if needed)
- Dimension mismatches → `EmbeddingGenerationError`

## Migration Contract

### Before Migration (GeminiEmbeddingService)

- **Dimensions**: 1536
- **Provider**: Google Gemini API
- **Error Types**: `GeminiAPIError`, `GeminiAuthenticationError`, `EmbeddingGenerationError`
- **API Key**: Required (`GEMINI_API_KEY`)
- **Rate Limits**: Yes

### After Migration (FastEmbedEmbeddingService)

- **Dimensions**: 384
- **Provider**: FastEmbed (local)
- **Error Types**: `EmbeddingGenerationError` only
- **API Key**: Not required for embeddings
- **Rate Limits**: No

### Interface Compatibility

The interface remains unchanged:
- Same method signature
- Same return type (list[float], only dimension changes)
- Same error handling pattern (EmbeddingGenerationError)
- Backward compatible for all callers

## Testing Contract

### Unit Tests

- Test `generate_embedding()` with valid text
- Test `generate_embedding()` with empty text (should raise ValueError)
- Test `generate_embedding()` returns 384 dimensions
- Test `generate_embedding()` returns deterministic results
- Test error handling for model failures

### Integration Tests

- Test embedding service with Qdrant storage
- Test query embedding + similarity search
- Test document embedding + storage
- Test dimension validation (384)

## Version History

- **v1.0** (2025-12-06): Initial contract for FastEmbed migration
- **v0.0** (Previous): Gemini embedding service contract (1536 dimensions)

