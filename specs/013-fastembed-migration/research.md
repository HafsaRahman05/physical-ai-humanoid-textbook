# Research Document: FastEmbed Migration

**Feature**: 013-fastembed-migration  
**Date**: 2025-01-27  
**Status**: Complete

## Research Questions

### Q1: What is FastEmbed and who maintains it?

**Answer**: FastEmbed is a lightweight, fast Python library for generating text embeddings, maintained by Qdrant. It uses ONNX Runtime for optimized inference and supports various embedding models.

**Sources**:
- GitHub: https://github.com/qdrant/fastembed
- Documentation: https://qdrant.github.io/fastembed/
- Maintained by: Qdrant (https://github.com/qdrant)

**Key Findings**:
- Open-source library (MIT/Apache 2.0 license)
- Optimized with ONNX Runtime (faster than PyTorch)
- Supports multiple embedding models
- Designed for speed and efficiency

### Q2: Is FastEmbed free to use?

**Answer**: Yes, FastEmbed is completely free to use. The library itself is open-source (MIT/Apache 2.0), and most models are also free for commercial use.

**Model Licenses** (from supported models page):
- **MIT License**: BAAI/bge-small-en-v1.5, BAAI/bge-base-en-v1.5, BAAI/bge-large-en-v1.5, thenlper/gte-large
- **Apache 2.0**: snowflake/snowflake-arctic-embed-*, jinaai/jina-embeddings-v2-*, sentence-transformers/*
- **Non-Commercial Only**: jinaai/jina-colbert-v2, jinaai/jina-reranker-v2-base-multilingual (CC-BY-NC-4.0)

**Selected Model**: `BAAI/bge-small-en-v1.5` uses MIT license - **free for commercial use**.

### Q3: What are the vector dimensions of FastEmbed models?

**Answer**: Vector dimensions vary by model. The selected model `BAAI/bge-small-en-v1.5` produces **384-dimensional vectors**.

**Model Dimension Examples**:
- `BAAI/bge-small-en-v1.5`: 384 dimensions
- `BAAI/bge-base-en-v1.5`: 768 dimensions
- `BAAI/bge-large-en-v1.5`: 1024 dimensions
- `intfloat/multilingual-e5-large`: 1024 dimensions

**Current System**: Uses 1536 dimensions (Gemini `embedding-001`)

**Migration Impact**: Need to change from 1536 to 384 dimensions, requiring:
1. Delete existing 1536-dimensional vectors
2. Recreate Qdrant collection with 384 dimensions
3. Re-embed all textbook content with 384 dimensions

### Q4: Does bigger dimension mean better responses?

**Answer**: Not necessarily. Vector dimensions affect storage, search speed, and model capacity, but quality depends more on model architecture and training.

**Key Points**:
- **Storage**: More dimensions = more storage per vector
- **Speed**: More dimensions = slower similarity calculations
- **Quality**: Depends on model architecture, training data, and task fit
- **BGE-small Performance**: Despite 384 dimensions, achieves 62.17 average on MTEB benchmark (competitive)

**Benchmark Comparison** (MTEB Average):
- `BAAI/bge-large-en-v1.5` (1024 dim): 64.23
- `BAAI/bge-base-en-v1.5` (768 dim): 63.55
- `BAAI/bge-small-en-v1.5` (384 dim): 62.17 ✅ Selected
- `text-embedding-ada-002` (1536 dim): 60.99

**Conclusion**: 384 dimensions is sufficient for similarity search. BGE-small performs competitively despite smaller size.

### Q5: Do FastEmbed models run locally and require disk space?

**Answer**: Yes, FastEmbed models run entirely locally and require disk space equal to the model size.

**Model Storage**:
- Models download on first use from Hugging Face Hub
- Models are cached locally (default: `~/.cache/fastembed/` or `~/.cache/huggingface/`)
- `BAAI/bge-small-en-v1.5`: 0.067 GB (67 MB)
- Models persist in cache for subsequent use

**Hugging Face Spaces Deployment**:
- Models download on first use (or pre-download at startup)
- Models persist in container's persistent storage
- Pre-download at startup eliminates cold start delays
- Disk space: 0.067 GB is minimal and well within Spaces limits

**Local Development**:
- Models download automatically on first use
- Cached locally for performance
- No internet required after initial download

### Q6: Can we use FastEmbed for both book embedding and user query embedding?

**Answer**: Yes, FastEmbed supports both document and query embedding with optimized methods.

**FastEmbed Methods**:
- `embed()`: General-purpose embeddings
- `query_embed()`: Optimized for search queries (adds query-specific preprocessing)
- `passage_embed()`: Optimized for document content (adds passage-specific preprocessing)

**Usage Pattern**:
```python
from fastembed import TextEmbedding

model = TextEmbedding(model_name="BAAI/bge-small-en-v1.5")

# For user queries (optimized)
query_embeddings = list(model.query_embed([user_query]))

# For document content (during indexing)
document_embeddings = list(model.embed([document_text]))
```

**Best Practice**: Use `query_embed()` for user queries and `embed()` or `passage_embed()` for document content.

### Q7: What happens when deploying to Hugging Face Spaces?

**Answer**: FastEmbed models work correctly on Hugging Face Spaces. Models download on first use and persist in container storage.

**Deployment Behavior**:
1. **First Request**: Model downloads (30-60 second delay)
2. **Subsequent Requests**: Fast (model already loaded)
3. **Container Restarts**: Models persist (unless space is deleted/rebuilt)
4. **Disk Space**: Models stored in container's filesystem

**Best Practice**: Pre-download model at startup to avoid cold start delays:
```python
@app.on_event("startup")
async def startup():
    from fastembed import TextEmbedding
    model = TextEmbedding(model_name="BAAI/bge-small-en-v1.5")
    list(model.embed(["warmup"]))  # Trigger download
```

### Q8: Can we use Hugging Face Inference API instead of local models?

**Answer**: Yes, but it has significant limitations that make it unsuitable for production.

**Hugging Face Inference API Limits**:
- **Free Tier**: ~1,000 requests per day ($0.10 monthly credits)
- **Pro Tier ($9/month)**: ~20,000 requests per day
- **Rate Limits**: Can cause service interruptions
- **Network Latency**: API calls add network overhead

**Comparison with FastEmbed**:
- FastEmbed: No rate limits, free forever, fast local inference
- HF API: Rate limits, potential costs, network latency

**Decision**: FastEmbed (local) chosen to avoid rate limit issues similar to Gemini.

### Q9: What is the exact rate limit for Hugging Face Inference API free tier?

**Answer**: Free tier provides approximately **1,000 requests per day** ($0.10 in monthly credits).

**Details**:
- Free tier: $0.10 monthly credits ≈ 1,000 requests/day
- Pro tier ($9/month): $2.00 monthly credits ≈ 20,000 requests/day
- Exceeding limits causes rate limiting errors

**For a Chatbot**: 1,000 requests/day is insufficient for production use, making local FastEmbed the better choice.

## Research Conclusions

### Selected Solution: FastEmbed BAAI/bge-small-en-v1.5

**Rationale**:
1. **No Rate Limits**: Eliminates quota/rate limit issues (unlike Gemini and HF API)
2. **Free Forever**: Open-source, no API costs
3. **Fast Performance**: ONNX Runtime optimization
4. **Reliable**: No external API dependencies
5. **Deployment Ready**: Works on Hugging Face Spaces with persistent storage
6. **Competitive Quality**: 62.17 MTEB score despite 384 dimensions

### Migration Requirements

1. **Dimension Change**: 1536 → 384 (requires re-embedding)
2. **Model Download**: FastEmbed downloads automatically (0.067 GB)
3. **Collection Recreation**: Delete old vectors, recreate with 384 dimensions
4. **Re-embedding**: One-time operation to re-embed all textbook content
5. **Service Update**: Replace Gemini embedding service with FastEmbed

### Trade-offs

**Pros**:
- No rate limits or quotas
- Free forever
- Fast local inference
- Reliable (no external dependencies)
- Works in deployment

**Cons**:
- One-time re-embedding effort required
- Dimension change (384 vs 1536) - but quality is still competitive
- Model download time on first use (mitigated by pre-download)

### Final Recommendation

**Use FastEmbed locally** for both book content embedding and user query embedding. The one-time re-embedding effort is worth avoiding rate limits and quota issues. The free tier API limit (1,000/day) is too low for production chatbot use.

## References

1. FastEmbed GitHub: https://github.com/qdrant/fastembed
2. FastEmbed Supported Models: https://qdrant.github.io/fastembed/examples/Supported_Models/
3. BAAI/bge-small-en-v1.5 Model Card: https://huggingface.co/BAAI/bge-small-en-v1.5
4. Hugging Face Inference API Rate Limits: https://huggingface.co/docs/api-inference/rate-limits
5. FastEmbed Documentation: https://qdrant.github.io/fastembed/

