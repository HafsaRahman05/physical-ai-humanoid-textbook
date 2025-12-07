# Quickstart Guide: FastEmbed Migration

**Feature**: 013-fastembed-migration  
**Date**: 2025-01-27

## Overview

This guide provides step-by-step instructions for migrating from Gemini `embedding-001` to FastEmbed `BAAI/bge-small-en-v1.5`.

## Prerequisites

- Python 3.11+
- Access to Qdrant database
- Textbook content in `docs/modules/` directory
- Environment variables configured (`.env` file)

## Step 1: Install FastEmbed

```bash
cd Chatbot
uv pip install fastembed
# Or with pip:
# pip install fastembed
```

Update `pyproject.toml`:
```toml
dependencies = [
    # ... existing dependencies ...
    "fastembed>=0.7.4",
]
```

## Step 2: Update Configuration

Update `Chatbot/src/chatbot/config.py`:

```python
vector_dimension: int = 384  # Changed from 1536
```

Update `.env` file (if using environment variables):
```env
QDRANT_VECTOR_DIMENSION=384
```

## Step 3: Delete Existing Vectors

**Option A: Delete Collection (Recommended)**

```python
from chatbot.qdrant.client import get_qdrant_client

client = get_qdrant_client()
await client.delete_collection("textbook_content")
```

**Option B: Delete All Points**

```python
from chatbot.qdrant.client import get_qdrant_client

client = get_qdrant_client()
await client.delete(
    collection_name="textbook_content",
    points_selector=models.FilterSelector(
        filter=models.Filter(
            must=[
                models.FieldCondition(
                    key="id",
                    match=models.MatchAny(any=list(range(0, 1000000)))  # Adjust range
                )
            ]
        )
    )
)
```

## Step 4: Recreate Collection

The collection will be automatically recreated with 384 dimensions when you run the embedding script, or manually:

```python
from chatbot.qdrant.collections import create_collection

await create_collection("textbook_content")  # Uses config.vector_dimension (384)
```

## Step 5: Update Embedding Service

Replace `Chatbot/src/chatbot/services/embedding.py`:

```python
"""Embedding service using FastEmbed model."""

from fastembed import TextEmbedding
from typing import Any

from chatbot.services import EmbeddingServiceInterface
from chatbot.utils.logging import get_logger

logger = get_logger(__name__)


class FastEmbedEmbeddingService(EmbeddingServiceInterface):
    """Service for generating embeddings using FastEmbed BAAI/bge-small-en-v1.5."""

    def __init__(self):
        """Initialize FastEmbed model."""
        logger.info("Initializing FastEmbed model...")
        self.model = TextEmbedding(model_name="BAAI/bge-small-en-v1.5")
        logger.info("FastEmbed model ready")

    async def generate_embedding(self, text: str) -> list[float]:
        """Generate embedding vector for text using FastEmbed.
        
        Args:
            text: Input text to embed
            
        Returns:
            384-dimensional embedding vector
        """
        if not text or not text.strip():
            raise ValueError("Text cannot be empty")
        
        try:
            logger.debug(f"Generating embedding for text (length: {len(text)})")
            
            # Use query_embed for user queries (optimized for search)
            # Note: For document embedding in scripts, use embed() instead
            embeddings = list(self.model.query_embed([text]))
            embedding = embeddings[0].tolist()
            
            if len(embedding) != 384:
                raise ValueError(f"Expected 384 dimensions, got {len(embedding)}")
            
            logger.debug(f"Generated embedding with {len(embedding)} dimensions")
            return embedding
            
        except Exception as e:
            logger.error(f"Failed to generate embedding: {e}", exc_info=True)
            raise


# Global service instance
_embedding_service: FastEmbedEmbeddingService | None = None


def get_embedding_service() -> FastEmbedEmbeddingService:
    """Get or create global embedding service instance."""
    global _embedding_service
    if _embedding_service is None:
        _embedding_service = FastEmbedEmbeddingService()
    return _embedding_service
```

## Step 6: Update Embedding Scripts

Update `Chatbot/embed_textbook.py` to use FastEmbed:

```python
from fastembed import TextEmbedding

# Initialize FastEmbed model
embedding_model = TextEmbedding(model_name="BAAI/bge-small-en-v1.5")

# Generate embeddings (use embed() for documents)
embeddings = list(embedding_model.embed([chunk_text]))
embedding_vector = embeddings[0].tolist()  # 384 dimensions
```

## Step 7: Re-embed Textbook Content

Run the embedding script:

```bash
cd Chatbot
python embed_textbook.py
```

This will:
1. Scan all markdown files in `docs/modules/`
2. Generate 384-dimensional embeddings with FastEmbed
3. Store vectors in Qdrant

## Step 8: Update Agent Tool

Update `Chatbot/src/chatbot/agent/tools.py` to use FastEmbed:

```python
from chatbot.services.embedding import get_embedding_service

# In query_textbook function:
embedding_service = get_embedding_service()
query_embedding = await embedding_service.generate_embedding(query)
# query_embedding is now 384 dimensions
```

## Step 9: Pre-download Model for Deployment

Update `Chatbot/src/chatbot/main.py` lifespan startup event:

```python
@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator[None, None]:
    """FastAPI lifespan context manager for application lifecycle."""
    from chatbot.utils.logging import get_logger
    from fastembed import TextEmbedding
    
    logger = get_logger(__name__)
    
    # Startup
    logger.info("Starting application...")
    
    # Pre-initialize FastEmbed model
    logger.info("Pre-downloading FastEmbed model...")
    try:
        model = TextEmbedding(model_name="BAAI/bge-small-en-v1.5")
        # Trigger download by embedding a dummy text
        list(model.embed(["warmup"]))
        logger.info("FastEmbed model ready")
    except Exception as e:
        logger.error(f"Failed to pre-download FastEmbed model: {e}")
        # Continue anyway - model will download on first use
    
    # Initialize Qdrant client (existing code)
    async with qdrant_lifespan(app):
        # ... rest of startup code ...
        yield
    
    # Shutdown handled by qdrant_lifespan
```

## Step 10: Test the Migration

1. **Test Embedding Generation**:
```python
from chatbot.services.embedding import get_embedding_service

service = get_embedding_service()
embedding = await service.generate_embedding("test query")
assert len(embedding) == 384
```

2. **Test Similarity Search**:
```python
from chatbot.agent.tools import query_textbook

result = await query_textbook("What is ROS2?")
# Should return relevant textbook content
```

3. **Test End-to-End**:
- Send a query from frontend
- Verify backend processes it with FastEmbed
- Verify agent receives context and generates response
- Verify frontend receives response

## Step 11: Deploy to Hugging Face Spaces

1. Push changes to repository
2. Hugging Face Spaces will rebuild
3. Model downloads automatically on first use (or at startup if pre-downloaded)
4. Verify deployment works correctly

## Verification Checklist

- [ ] FastEmbed installed successfully
- [ ] Configuration updated (vector_dimension: 384)
- [ ] Old vectors deleted from Qdrant
- [ ] Collection recreated with 384 dimensions
- [ ] Embedding service uses FastEmbed
- [ ] Textbook content re-embedded (384 dimensions)
- [ ] User queries embedded with FastEmbed
- [ ] Similarity search returns results
- [ ] Agent receives context correctly
- [ ] Frontend receives responses
- [ ] No rate limit errors
- [ ] Deployment works on Hugging Face Spaces

## Troubleshooting

### Model Download Fails

**Issue**: FastEmbed model fails to download.

**Solution**: 
- Check internet connection
- Verify Hugging Face Hub access
- Try manual download: `python -c "from fastembed import TextEmbedding; TextEmbedding('BAAI/bge-small-en-v1.5')"`

### Dimension Mismatch Error

**Issue**: Qdrant returns dimension mismatch error.

**Solution**:
- Verify collection is recreated with 384 dimensions
- Check `config.vector_dimension` is 384
- Delete and recreate collection if needed

### Embedding Generation Slow

**Issue**: First embedding takes a long time.

**Solution**:
- Model is downloading on first use (normal)
- Pre-download model at startup (see Step 9)
- Subsequent embeddings will be fast

### Hugging Face Spaces Disk Full

**Issue**: Deployment fails due to disk space.

**Solution**:
- Model is only 0.067 GB (very small)
- Check other files using disk space
- Consider upgrading Spaces tier if needed

## Next Steps

After migration:
1. Monitor for errors in production
2. Verify similarity search quality
3. Update documentation
4. Remove Gemini embedding dependencies if no longer needed

