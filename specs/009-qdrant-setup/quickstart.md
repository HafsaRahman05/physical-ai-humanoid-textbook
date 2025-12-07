# Quickstart Guide: Qdrant Vector Database Setup

**Feature**: Qdrant Vector Database Setup for Chatbot Agent  
**Date**: 2025-01-27

## Prerequisites

- Python 3.11 or higher
- `uv` package manager installed ([installation guide](https://github.com/astral-sh/uv))
- Qdrant instance (cloud, self-hosted, or local mode)
- Access to Qdrant API (URL and API key if using Qdrant Cloud)

## Project Setup

### 1. Initialize Project

```bash
cd Chatbot
uv init
```

This creates:
- `pyproject.toml` - Project configuration
- `src/chatbot/` - Source code directory
- `.venv/` - Virtual environment (if created)

### 2. Install Dependencies

```bash
uv add fastapi qdrant-client pydantic python-dotenv
uv add --dev pytest pytest-asyncio httpx pytest-mock
```

### 3. Project Structure

Create the following structure:

```
Chatbot/
├── src/
│   └── chatbot/
│       ├── __init__.py
│       ├── main.py
│       ├── config.py
│       ├── qdrant/
│       │   ├── __init__.py
│       │   ├── client.py
│       │   ├── collections.py
│       │   ├── queries.py
│       │   └── health.py
│       ├── api/
│       │   ├── __init__.py
│       │   ├── dependencies.py
│       │   └── routes.py
│       └── utils/
│           ├── __init__.py
│           ├── retry.py
│           └── logging.py
└── tests/
    ├── __init__.py
    └── conftest.py
```

## Configuration

### Environment Variables

Create `.env` file in `Chatbot/` directory:

**For Qdrant Cloud:**
```env
QDRANT_URL=https://your-cluster.qdrant.io
QDRANT_API_KEY=your-api-key
QDRANT_COLLECTION_NAME=textbook_content
QDRANT_VECTOR_DIMENSION=1536
QDRANT_DISTANCE_METRIC=COSINE
```

**For Self-Hosted Qdrant:**
```env
QDRANT_URL=http://localhost:6333
QDRANT_COLLECTION_NAME=textbook_content
QDRANT_VECTOR_DIMENSION=1536
QDRANT_DISTANCE_METRIC=COSINE
```

**For Local Mode (Development):**
```env
QDRANT_LOCAL_MODE=true
QDRANT_LOCAL_PATH=./qdrant_data
QDRANT_COLLECTION_NAME=textbook_content
QDRANT_VECTOR_DIMENSION=1536
QDRANT_DISTANCE_METRIC=COSINE
```

**Optional Configuration:**
```env
QDRANT_TIMEOUT=30.0
QDRANT_RETRY_COUNT=3
QDRANT_RETRY_INITIAL_DELAY=1.0
QDRANT_RETRY_MAX_DELAY=10.0
QDRANT_RETRY_MULTIPLIER=2.0
```

## Basic Implementation

### 1. Configuration (config.py)

```python
from pydantic_settings import BaseSettings

class QdrantConfig(BaseSettings):
    qdrant_url: str | None = None
    qdrant_api_key: str | None = None
    qdrant_collection_name: str
    qdrant_local_mode: bool = False
    qdrant_local_path: str | None = None
    qdrant_timeout: float = 30.0
    qdrant_retry_count: int = 3
    qdrant_retry_initial_delay: float = 1.0
    qdrant_retry_max_delay: float = 10.0
    qdrant_retry_multiplier: float = 2.0
    vector_dimension: int = 1536
    distance_metric: str = "COSINE"

    class Config:
        env_file = ".env"
        env_prefix = ""
```

### 2. Qdrant Client (qdrant/client.py)

```python
from contextlib import asynccontextmanager
from qdrant_client import AsyncQdrantClient
from fastapi import FastAPI
from chatbot.config import QdrantConfig

config = QdrantConfig()
qdrant_client: AsyncQdrantClient | None = None

async def init_qdrant_client():
    global qdrant_client
    if config.qdrant_local_mode:
        qdrant_client = AsyncQdrantClient(path=config.qdrant_local_path or ":memory:")
    else:
        qdrant_client = AsyncQdrantClient(
            url=config.qdrant_url,
            api_key=config.qdrant_api_key,
            timeout=config.qdrant_timeout
        )

async def close_qdrant_client():
    global qdrant_client
    if qdrant_client:
        await qdrant_client.close()
        qdrant_client = None

@asynccontextmanager
async def lifespan(app: FastAPI):
    await init_qdrant_client()
    yield
    await close_qdrant_client()
```

### 3. Dependency Injection (api/dependencies.py)

```python
from typing import Annotated
from fastapi import Depends
from qdrant_client import AsyncQdrantClient
from chatbot.qdrant.client import qdrant_client

async def get_qdrant_client() -> AsyncQdrantClient:
    if qdrant_client is None:
        raise RuntimeError("Qdrant client not initialized")
    return qdrant_client

QdrantClientDep = Annotated[AsyncQdrantClient, Depends(get_qdrant_client)]
```

### 4. FastAPI Application (main.py)

```python
from fastapi import FastAPI
from chatbot.qdrant.client import lifespan
from chatbot.api.routes import router

app = FastAPI(
    title="Chatbot API",
    description="RAG Chatkit Backend with Qdrant Integration",
    lifespan=lifespan
)

app.include_router(router)
```

### 5. Health Check (api/routes.py)

```python
from fastapi import APIRouter, Depends
from chatbot.api.dependencies import QdrantClientDep
from qdrant_client import AsyncQdrantClient

router = APIRouter()

@router.get("/health/qdrant")
async def health_check(client: QdrantClientDep):
    try:
        collections = await client.get_collections()
        return {
            "status": "healthy",
            "qdrant_connected": True,
            "collections": {col.name: {"exists": True} for col in collections.collections}
        }
    except Exception as e:
        return {
            "status": "unhealthy",
            "qdrant_connected": False,
            "error": str(e)
        }, 503
```

## Running the Application

### Development

```bash
# Activate virtual environment
source .venv/bin/activate  # On Windows: .venv\Scripts\activate

# Run with uvicorn
uvicorn chatbot.main:app --reload --host 0.0.0.0 --port 8000
```

### Testing

```bash
# Run all tests
pytest

# Run with coverage
pytest --cov=chatbot --cov-report=html
```

## Next Steps

1. **Collection Management**: Implement collection verification and creation
2. **Query Execution**: Implement vector similarity search
3. **Error Handling**: Add retry logic with exponential backoff
4. **Logging**: Configure structured logging
5. **Testing**: Write unit and integration tests

## Common Issues

### Connection Errors

**Issue**: Cannot connect to Qdrant  
**Solution**: 
- Verify `QDRANT_URL` is correct
- Check network connectivity
- Verify API key (for Qdrant Cloud)
- Check Qdrant server is running (for self-hosted)

### Collection Not Found

**Issue**: Collection does not exist  
**Solution**:
- Collection will be auto-created on startup if configured
- Verify `QDRANT_COLLECTION_NAME` is correct
- Check collection exists in Qdrant dashboard

### Configuration Errors

**Issue**: Invalid configuration  
**Solution**:
- Verify all required environment variables are set
- Check numeric values are valid (positive numbers)
- Verify `QDRANT_DISTANCE_METRIC` is one of: COSINE, EUCLIDEAN, DOT

## Resources

- [Qdrant Python Client Documentation](https://qdrant.tech/documentation/python-client/)
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [uv Documentation](https://github.com/astral-sh/uv)

