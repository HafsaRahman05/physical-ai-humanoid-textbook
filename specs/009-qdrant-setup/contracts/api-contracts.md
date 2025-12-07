# API Contracts: Qdrant Vector Database Setup

**Feature**: Qdrant Vector Database Setup for Chatbot Agent  
**Date**: 2025-01-27  
**Phase**: 1 - Design & Contracts

## Overview

This feature primarily provides infrastructure components (Qdrant client, collection management, query execution) that are used internally by the FastAPI backend. The main external API contracts are:

1. **Health Check Endpoint** - Verify Qdrant connectivity
2. **Internal Dependencies** - FastAPI dependency injection contracts

## API Endpoints

### GET /health/qdrant

**Description**: Health check endpoint to verify Qdrant database connectivity and collection availability.

**Method**: GET

**Path**: `/health/qdrant`

**Query Parameters**: None

**Request Headers**: None

**Request Body**: None

**Response Codes**:
- `200 OK`: Qdrant is healthy and accessible
- `503 Service Unavailable`: Qdrant is unavailable or unhealthy

**Response Body (200 OK)**:
```json
{
  "status": "healthy",
  "qdrant_connected": true,
  "collections": {
    "textbook_content": {
      "exists": true,
      "vector_dimension": 1536,
      "distance_metric": "COSINE",
      "points_count": 1234
    }
  },
  "timestamp": "2025-01-27T12:00:00Z"
}
```

**Response Body (503 Service Unavailable)**:
```json
{
  "status": "unhealthy",
  "qdrant_connected": false,
  "error": "Connection timeout after 30 seconds",
  "timestamp": "2025-01-27T12:00:00Z"
}
```

**Error Responses**:
- `500 Internal Server Error`: Unexpected error during health check

**Contract Validation**:
- Response must include `status` field
- Response must include `qdrant_connected` boolean
- If healthy, response must include `collections` object
- Each collection must include `exists`, `vector_dimension`, `distance_metric`
- Response must include `timestamp` in ISO 8601 format

## Internal API Contracts

### Dependency: get_qdrant_client

**Description**: FastAPI dependency that provides AsyncQdrantClient instance to route handlers.

**Type**: Async dependency function with `yield`

**Signature**:
```python
async def get_qdrant_client() -> AsyncGenerator[AsyncQdrantClient, None]:
    """
    Dependency that provides Qdrant client instance.
    Client is initialized at application startup via lifespan event.
    """
    yield qdrant_client  # Client instance from app state
```

**Usage**:
```python
@app.get("/api/query")
async def query_endpoint(
    client: AsyncQdrantClient = Depends(get_qdrant_client)
):
    # Use client for queries
    pass
```

**Contract Validation**:
- Must return AsyncQdrantClient instance
- Must use `yield` pattern for proper resource management
- Client must be initialized before first use
- Client must be available throughout request lifecycle

### Service: CollectionManager

**Description**: Service for managing Qdrant collections (verify, create, validate).

**Methods**:

#### verify_collection(collection_name: str) -> bool
- Verifies collection exists
- Returns: True if exists, False otherwise

#### create_collection(collection_name: str, config: CollectionConfig) -> None
- Creates collection with specified configuration
- Raises: CollectionCreationError if creation fails

#### validate_collection_config(collection_name: str) -> ValidationResult
- Validates collection configuration matches expected values
- Returns: ValidationResult with validation status and details

**Contract Validation**:
- All methods must be async
- Methods must handle Qdrant errors appropriately
- Validation must check vector dimension and distance metric

### Service: QueryExecutor

**Description**: Service for executing vector similarity search queries.

**Methods**:

#### execute_query(query: VectorQuery) -> List[QueryResult]
- Executes vector similarity search
- Returns: List of QueryResult objects sorted by score (descending)
- Raises: QueryExecutionError if query fails

**Contract Validation**:
- Method must be async
- Must validate query vector dimension matches collection
- Must apply filters if provided
- Must respect limit parameter
- Must handle timeout appropriately
- Results must be sorted by similarity score (descending)

### Service: RetryHandler

**Description**: Service for handling retries with exponential backoff.

**Methods**:

#### retry_async(func: Callable, *args, **kwargs) -> Any
- Executes async function with retry logic
- Applies exponential backoff between retries
- Returns: Function result or raises exception after all retries fail

**Contract Validation**:
- Must respect max_attempts configuration
- Must apply exponential backoff correctly
- Must only retry retryable errors
- Must raise exception after all retries exhausted

## Error Response Contracts

### Standard Error Response

All error responses follow this structure:

```json
{
  "error": {
    "type": "ErrorType",
    "message": "Human-readable error message",
    "details": {
      "field": "Additional error details"
    }
  },
  "timestamp": "2025-01-27T12:00:00Z"
}
```

### Error Types

- `ConnectionError`: Qdrant connection failure
- `AuthenticationError`: Invalid API key or credentials
- `CollectionNotFoundError`: Collection does not exist
- `ConfigurationError`: Collection configuration mismatch
- `QueryError`: Query execution failure
- `TimeoutError`: Operation timeout
- `ValidationError`: Invalid input parameters

## Configuration Contract

### Environment Variables

All configuration via environment variables with these contracts:

- **Required for cloud/self-hosted**:
  - `QDRANT_URL`: Valid HTTP/HTTPS URL
  - `QDRANT_COLLECTION_NAME`: Non-empty string

- **Required for Qdrant Cloud**:
  - `QDRANT_API_KEY`: Non-empty string

- **Required for local mode**:
  - `QDRANT_LOCAL_MODE`: "true" or "false"

- **Optional (with defaults)**:
  - `QDRANT_TIMEOUT`: Positive float (default: 30.0)
  - `QDRANT_RETRY_COUNT`: Non-negative integer (default: 3)
  - `QDRANT_RETRY_INITIAL_DELAY`: Positive float (default: 1.0)
  - `QDRANT_RETRY_MAX_DELAY`: Positive float (default: 10.0)
  - `QDRANT_RETRY_MULTIPLIER`: Float >= 1.0 (default: 2.0)
  - `QDRANT_VECTOR_DIMENSION`: Positive integer (default: 1536)
  - `QDRANT_DISTANCE_METRIC`: "COSINE" | "EUCLIDEAN" | "DOT" (default: "COSINE")

**Contract Validation**:
- Required variables must be set for corresponding deployment mode
- Optional variables must have valid defaults
- Numeric variables must be parseable and within valid ranges
- String variables must be non-empty where required

## Performance Contracts

### Response Time Targets

- Health check: < 1 second (SC-009)
- Query execution: < 500ms for 95% of queries (SC-002)
- Connection establishment: < 5 seconds for 99% of attempts (SC-001)

### Concurrency Contracts

- Must support 10+ simultaneous queries without degradation (SC-008)
- Connection pool must not exhaust under normal load
- Retry logic must not cause request queue buildup

## Security Contracts

### Authentication

- API key must be kept secure (not logged, not exposed in errors)
- Local mode must not require authentication
- Connection URLs must not expose credentials

### Data Privacy

- Query vectors and results must not be logged in production
- Error messages must not expose sensitive configuration details
- Health check must not expose internal collection structure details

## Versioning

- API contracts follow FastAPI OpenAPI/Swagger versioning
- Breaking changes require API version increment
- Health check endpoint is version-agnostic (always available)

## Testing Contracts

### Unit Test Contracts

- All services must be unit testable with mocked Qdrant client
- Dependency injection must support test doubles
- Configuration must support test overrides

### Integration Test Contracts

- Integration tests must use real Qdrant instance (local mode)
- Tests must clean up created collections
- Tests must verify actual Qdrant behavior

### Contract Test Contracts

- API contracts must be validated via contract tests
- Response schemas must match OpenAPI specification
- Error responses must match error contract structure

