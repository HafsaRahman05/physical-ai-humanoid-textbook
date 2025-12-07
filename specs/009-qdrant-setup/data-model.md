# Data Model: Qdrant Vector Database Setup

**Feature**: Qdrant Vector Database Setup for Chatbot Agent  
**Date**: 2025-01-27  
**Phase**: 1 - Design & Contracts

## Entities

### QdrantConnection

**Description**: Represents the connection configuration and client instance for Qdrant vector database.

**Attributes**:
- `client` (AsyncQdrantClient): The Qdrant client instance (initialized at startup)
- `url` (str, optional): Qdrant server URL (for cloud/self-hosted instances)
- `api_key` (str, optional): API key for authentication (Qdrant Cloud)
- `local_mode` (bool): Whether to use local Qdrant instance
- `local_path` (str, optional): Path for local Qdrant storage (if local_mode=True)
- `timeout` (float): Connection timeout in seconds (default: 30.0)
- `prefer_grpc` (bool): Whether to prefer gRPC protocol (default: False)

**Relationships**:
- Initialized by: FastAPI lifespan event
- Provided to: Route handlers via dependency injection
- Used by: CollectionManager, QueryExecutor, HealthChecker

**Validation Rules**:
- Either `url` or `local_mode=True` must be specified
- If `url` is provided, must be valid HTTP/HTTPS URL
- If `api_key` is provided, must be non-empty string
- `timeout` must be positive number

**State Transitions**:
```
Uninitialized → Initializing → Connected → Disconnected → Reconnecting
```

**Lifecycle**:
- Created: FastAPI application startup (lifespan event)
- Used: Throughout application lifetime via dependency injection
- Destroyed: FastAPI application shutdown (lifespan cleanup)

### QdrantCollection

**Description**: Represents a named collection in Qdrant that stores vectors and metadata.

**Attributes**:
- `name` (str): Collection name (e.g., "textbook_content")
- `vector_dimension` (int): Dimension of vectors in collection (e.g., 1536)
- `distance_metric` (str): Distance metric (COSINE, EUCLIDEAN, or DOT)
- `exists` (bool): Whether collection exists in Qdrant
- `config_valid` (bool): Whether collection configuration matches expected values

**Relationships**:
- Managed by: CollectionManager
- Queried by: QueryExecutor
- Validated by: CollectionManager on startup

**Validation Rules**:
- `name` must be non-empty string
- `vector_dimension` must be positive integer
- `distance_metric` must be one of: COSINE, EUCLIDEAN, DOT
- Collection must exist before queries can be executed

**State Transitions**:
```
NotExists → Creating → Exists → Validated → Ready
NotExists → Exists (if already exists) → Validated → Ready
```

### VectorQuery

**Description**: Represents a similarity search query against a Qdrant collection.

**Attributes**:
- `query_vector` (List[float]): The embedding vector to search for
- `collection_name` (str): Target collection name
- `limit` (int): Maximum number of results to return (default: 5)
- `score_threshold` (float, optional): Minimum similarity score threshold
- `filters` (dict, optional): Metadata filters (e.g., {"module_id": "module-1"})
- `timeout` (float): Query timeout in seconds (default: 30.0)

**Relationships**:
- Executed by: QueryExecutor
- Targets: QdrantCollection
- Returns: QueryResult list

**Validation Rules**:
- `query_vector` must be non-empty list of floats
- `query_vector` length must match collection vector dimension
- `collection_name` must reference existing collection
- `limit` must be positive integer
- `score_threshold` must be between 0.0 and 1.0 (if provided)
- `filters` must be valid Qdrant filter structure (if provided)

### QueryResult

**Description**: Represents a single result from a vector similarity search.

**Attributes**:
- `point_id` (int | str): Unique identifier of the point in Qdrant
- `score` (float): Similarity score (higher = more similar)
- `vector` (List[float], optional): The vector (if requested)
- `payload` (dict): Metadata payload containing:
  - `chunk_text` (str): The text content
  - `module_id` (str): Source module identifier
  - `section_id` (str): Source section identifier
  - `chunk_type` (str): Type of chunk (e.g., "concept", "example")
  - Additional metadata fields as defined by embedding pipeline

**Relationships**:
- Returned by: QueryExecutor
- Used by: Chatbot agent for generating responses with citations

**Validation Rules**:
- `point_id` must be valid (int or str)
- `score` must be between 0.0 and 1.0 (for COSINE distance)
- `payload` must contain required fields (chunk_text, module_id, section_id)
- `payload` must be dictionary

### ConnectionConfiguration

**Description**: Represents environment-specific Qdrant connection settings loaded from environment variables.

**Attributes**:
- `qdrant_url` (str, optional): Qdrant server URL
- `qdrant_api_key` (str, optional): API key for authentication
- `qdrant_collection_name` (str): Default collection name
- `qdrant_local_mode` (bool): Whether to use local Qdrant instance
- `qdrant_local_path` (str, optional): Path for local Qdrant storage
- `qdrant_timeout` (float): Query timeout in seconds (default: 30.0)
- `qdrant_retry_count` (int): Number of retry attempts (default: 3)
- `qdrant_retry_initial_delay` (float): Initial retry delay in seconds (default: 1.0)
- `qdrant_retry_max_delay` (float): Maximum retry delay in seconds (default: 10.0)
- `qdrant_retry_multiplier` (float): Exponential backoff multiplier (default: 2.0)
- `vector_dimension` (int): Expected vector dimension (default: 1536)
- `distance_metric` (str): Expected distance metric (default: "COSINE")

**Relationships**:
- Loaded by: ConfigurationManager (Pydantic Settings)
- Used by: QdrantConnection, CollectionManager, QueryExecutor, RetryHandler

**Validation Rules**:
- Either `qdrant_url` or `qdrant_local_mode=True` must be set
- `qdrant_collection_name` must be non-empty string
- `qdrant_timeout` must be positive number
- `qdrant_retry_count` must be non-negative integer
- `qdrant_retry_initial_delay` must be positive number
- `qdrant_retry_max_delay` must be >= `qdrant_retry_initial_delay`
- `qdrant_retry_multiplier` must be >= 1.0
- `vector_dimension` must be positive integer
- `distance_metric` must be one of: COSINE, EUCLIDEAN, DOT

**Environment Variables**:
- `QDRANT_URL`: Qdrant server URL
- `QDRANT_API_KEY`: API key for authentication
- `QDRANT_COLLECTION_NAME`: Default collection name
- `QDRANT_LOCAL_MODE`: "true" or "false" (default: "false")
- `QDRANT_LOCAL_PATH`: Path for local Qdrant storage
- `QDRANT_TIMEOUT`: Query timeout in seconds (default: "30.0")
- `QDRANT_RETRY_COUNT`: Number of retry attempts (default: "3")
- `QDRANT_RETRY_INITIAL_DELAY`: Initial retry delay in seconds (default: "1.0")
- `QDRANT_RETRY_MAX_DELAY`: Maximum retry delay in seconds (default: "10.0")
- `QDRANT_RETRY_MULTIPLIER`: Exponential backoff multiplier (default: "2.0")
- `QDRANT_VECTOR_DIMENSION`: Expected vector dimension (default: "1536")
- `QDRANT_DISTANCE_METRIC`: Expected distance metric (default: "COSINE")

### RetryConfiguration

**Description**: Configuration for retry logic with exponential backoff.

**Attributes**:
- `max_attempts` (int): Maximum number of retry attempts (default: 3)
- `initial_delay` (float): Initial delay before first retry in seconds (default: 1.0)
- `max_delay` (float): Maximum delay between retries in seconds (default: 10.0)
- `multiplier` (float): Exponential backoff multiplier (default: 2.0)

**Relationships**:
- Used by: RetryHandler
- Loaded from: ConnectionConfiguration

**Validation Rules**:
- `max_attempts` must be non-negative integer
- `initial_delay` must be positive number
- `max_delay` must be >= `initial_delay`
- `multiplier` must be >= 1.0

**Retry Logic**:
- Delay calculation: `min(initial_delay * (multiplier ** attempt_number), max_delay)`
- Example with defaults: 1s, 2s, 4s, 8s, 10s (capped), 10s (capped)

## Relationships Summary

```
ConnectionConfiguration
    ↓ loads
QdrantConnection (initialized at startup)
    ↓ provides
CollectionManager, QueryExecutor, HealthChecker
    ↓ manages/queries
QdrantCollection
    ↓ used by
VectorQuery
    ↓ returns
QueryResult
```

## State Diagrams

### QdrantConnection Lifecycle

```
[Startup] → Initializing → Connected
                ↓
            Connection Lost
                ↓
            Reconnecting → Connected
                ↓
[Shutdown] → Disconnecting → Closed
```

### QdrantCollection Lifecycle

```
[Startup Check] → Collection Exists?
                    ↓ Yes
                Validate Config → Config Valid?
                                    ↓ Yes
                                Ready
                    ↓ No
                Create Collection → Ready
```

## Data Constraints

### Connection Constraints
- Only one QdrantConnection instance per FastAPI application
- Connection must be established before any queries
- Connection must support reconnection on failure

### Collection Constraints
- Collection must exist before queries
- Collection configuration must match embedding model
- Multiple collections supported (verify/create all on startup)

### Query Constraints
- Query vector dimension must match collection dimension
- Query limit must be reasonable (e.g., 1-100)
- Query timeout must be sufficient for vector search

### Result Constraints
- Results must include similarity scores
- Results must include payload with required metadata
- Results must be sortable by score (descending)

## Validation Rules Summary

1. **Connection Validation**:
   - URL or local mode must be specified
   - API key required for Qdrant Cloud
   - Connection must succeed within timeout

2. **Collection Validation**:
   - Collection name must be valid
   - Vector dimension must match expected value
   - Distance metric must match expected value

3. **Query Validation**:
   - Query vector dimension must match collection
   - Collection must exist
   - Limit must be positive

4. **Configuration Validation**:
   - All required environment variables must be set
   - Numeric values must be within valid ranges
   - String values must be non-empty where required

