# Data Model: Module 2 Content Structure

**Feature**: Module 2 - Digital Twins - Simulation & Sensors  
**Date**: 2025-12-01

## Content Entities

### Module
**Description**: Top-level container for Module 2 content

**Attributes**:
- `module_id`: "module-2-digital-twins-simulation" (string, unique)
- `title`: "Digital Twins - Simulation & Sensors" (string)
- `learning_objectives`: Array of learning objective strings
- `estimated_reading_time`: "1-2 hours" (string)
- `prerequisites`: ["Module 1 (ROS 2 fundamentals)", "Python programming knowledge", "Basic robotics concepts"] (array)

**Relationships**:
- Contains multiple `Section` entities
- References `Concept` entities
- Links to Module 1 (backward references)
- Links to future modules (forward references)

### Section
**Description**: Discrete unit of content covering a specific topic within the module

**Attributes**:
- `section_id`: Unique identifier (e.g., "introduction", "digital-twins", "simulation-fundamentals") (string, unique within module)
- `title`: Section heading (string)
- `content`: Markdown content body (string, markdown)
- `order`: Sequential order within module (integer)
- `learning_objective_tags`: Array of learning objective IDs this section addresses
- `concept_tags`: Array of concept IDs covered (e.g., ["digital-twin", "simulation", "sensor"])
- `topic_category`: "digital-twin" | "simulation" | "sensor" | "application" (enum)

**Relationships**:
- Belongs to one `Module`
- Contains zero or more `CodeExample` entities
- Contains zero or more `VisualAid` entities
- References other `Section` entities (cross-references)
- References `Concept` entities
- References Module 1 sections (backward references)

**Validation Rules**:
- Section title must be unique within module
- Order must be sequential (no gaps)
- Content must be valid markdown
- Section must address at least one learning objective
- Topic category must be assigned

### Concept
**Description**: Abstract idea or technical term explained in the module

**Attributes**:
- `concept_id`: Unique identifier (e.g., "digital-twin", "physics-engine", "sensor-data-flow") (string, unique)
- `term`: Canonical term name (string)
- `definition`: Clear explanation of the concept (string)
- `context`: Where/how concept is used (string)
- `related_concepts`: Array of related concept IDs (array of strings)
- `difficulty_level`: "beginner" | "intermediate" (enum)
- `topic_category`: "digital-twin" | "simulation" | "sensor" (enum)

**Relationships**:
- Referenced by multiple `Section` entities
- May reference other `Concept` entities (prerequisites, related concepts)
- May reference Module 1 concepts (e.g., "ros2-topic", "ros2-node")
- Illustrated by `CodeExample` entities
- Illustrated by `VisualAid` entities

**Validation Rules**:
- Term must be defined before first use in content
- Definition must be clear and unambiguous
- Related concepts must exist (forward references allowed for future modules)
- Topic category must be assigned

**Examples**:
- `digital-twin`: A virtual replica of a physical system with bidirectional synchronization
- `physics-engine`: Computational system that simulates physical laws in simulation
- `sensor-data-flow`: How sensor information moves through ROS 2 topics to processing nodes
- `simulation-environment`: Virtual world where robots can operate with physics and sensors

### CodeExample
**Description**: Python code example illustrating a concept

**Attributes**:
- `example_id`: Unique identifier (string, unique)
- `code`: Python code content (string, Python syntax)
- `explanation`: Brief explanation of what the code demonstrates (string)
- `concept_tags`: Array of concept IDs this example illustrates (array)
- `section_id`: Parent section (string, foreign key to Section)
- `example_type`: "sensor" | "simulation" | "ros2-integration" (enum)

**Relationships**:
- Belongs to one `Section`
- Illustrates one or more `Concept` entities

**Validation Rules**:
- Code must be valid Python syntax
- Code must use ROS 2 Python API (rclpy) when demonstrating ROS 2 integration
- Code must be executable (conceptually, not requiring full setup)
- Explanation must connect code to concept being taught
- Example type must be assigned

### VisualAid
**Description**: Diagram or illustration enhancing understanding

**Attributes**:
- `visual_id`: Unique identifier (string, unique)
- `type`: "diagram" | "illustration" | "mermaid" (enum)
- `content`: Mermaid code or image reference (string)
- `caption`: Descriptive caption (string)
- `concept_tags`: Array of concept IDs this visual illustrates (array)
- `section_id`: Parent section (string, foreign key to Section)
- `visual_category`: "architecture" | "data-flow" | "component" (enum)

**Relationships**:
- Belongs to one `Section`
- Illustrates one or more `Concept` entities

**Validation Rules**:
- Visual must enhance understanding of at least one concept
- Caption must be descriptive
- Mermaid diagrams must be valid syntax
- Image references must be resolvable
- Visual category must be assigned

**Required Visuals**:
- Digital twin architecture diagram (FR-017)
- Sensor data flow diagram (FR-017)
- Simulation components diagram (FR-017)

### LearningObjective
**Description**: Specific knowledge or skill students should acquire

**Attributes**:
- `objective_id`: Unique identifier (string, unique)
- `description`: Clear statement of what students will learn (string)
- `section_tags`: Array of section IDs that address this objective (array)
- `assessment_criteria`: How to verify objective is met (string)
- `topic_category`: "digital-twin" | "simulation" | "sensor" | "application" (enum)

**Relationships**:
- Addressed by multiple `Section` entities

**Validation Rules**:
- Description must be measurable and testable
- At least one section must address each objective
- Objectives must align with success criteria (SC-001 through SC-010)
- Topic category must be assigned

**Examples**:
- `lo-001`: Students can explain what a digital twin is and how it differs from a traditional simulation
- `lo-002`: Students can identify key components of a simulation environment
- `lo-003`: Students can describe how sensor data flows through ROS 2 topics
- `lo-004`: Students can explain practical use cases for digital twins in humanoid robotics

### CrossReference
**Description**: Link to related content within module or to other modules

**Attributes**:
- `reference_id`: Unique identifier (string, unique)
- `source_section_id`: Section containing the reference (string, foreign key)
- `target_path`: Path to referenced content (string, markdown link format)
- `reference_type`: "prerequisite" | "related" | "advanced" | "backward" | "forward" (enum)
- `context`: Brief explanation of why this reference is relevant (string)
- `target_module`: "module-1" | "module-2" | "future-module" (enum)

**Relationships**:
- Originates from one `Section`
- Points to another `Section` or Module 1 section

**Validation Rules**:
- Target path must be valid (or placeholder for future modules)
- Reference type must be appropriate for relationship
- Context must explain relevance
- Backward references must point to Module 1
- Forward references must be clearly marked

### SensorType
**Description**: Specific sensor type used in humanoid robots

**Attributes**:
- `sensor_id`: Unique identifier (e.g., "camera", "imu", "joint-encoder", "tactile") (string, unique)
- `sensor_name`: Human-readable name (string)
- `sensor_category`: "vision" | "proprioception" | "tactile" (enum)
- `purpose`: What the sensor is used for (string)
- `data_format`: Description of sensor data structure (string)
- `ros2_topic_pattern`: Typical ROS 2 topic name pattern (string)
- `humanoid_use_case`: How used in humanoid robots (string)

**Relationships**:
- Referenced by `Section` entities (sensor-integration section)
- Illustrated by `CodeExample` entities
- Illustrated by `VisualAid` entities

**Validation Rules**:
- Sensor category must be assigned
- Purpose must be clear
- Humanoid use case must be provided
- ROS 2 topic pattern must follow Module 1 conventions

**Examples**:
- `camera`: Vision sensor for perception, publishes image data to `/camera/image_raw` topic
- `imu`: Proprioceptive sensor for balance, publishes orientation data to `/imu/data` topic
- `joint-encoder`: Proprioceptive sensor for joint position, publishes joint states to `/joint_states` topic

## Content Chunking Model (for Vector Database)

### ContentChunk
**Description**: Semantic unit for embedding into Qdrant vector database

**Attributes**:
- `chunk_id`: Unique identifier (string, unique)
- `section_id`: Source section (string, foreign key)
- `chunk_text`: Text content for embedding (string)
- `chunk_metadata`: JSON object containing:
  - `module_id`: "module-2-digital-twins-simulation"
  - `section_id`: Source section identifier
  - `topic_category`: "digital-twin" | "simulation" | "sensor" | "application"
  - `concept_tags`: Array of concept IDs
  - `learning_objective_tags`: Array of objective IDs
  - `chunk_type`: "introduction" | "concept" | "example" | "application"
  - `reading_order`: Sequential order within section
  - `has_code_example`: Boolean indicating if chunk contains code
  - `has_visual_aid`: Boolean indicating if chunk references visual
- `embedding_vector`: Vector representation (array of floats, generated by embedding model)

**Relationships**:
- Derived from `Section` content
- Maps to `Concept` entities via tags
- Maps to `LearningObjective` entities via tags
- Maps to `SensorType` entities via tags (if applicable)

**Validation Rules**:
- Chunk text must preserve semantic meaning
- Chunk size: 300-500 words (optimal for educational content with code examples)
- Chunk boundaries must align with semantic breaks
- Metadata must include all relevant tags for filtering
- Topic category must be assigned for filtering

**Chunking Strategy**:
- One chunk per major concept within a section
- Include section context in chunk (title, parent module)
- Preserve code examples and visual aid references in metadata
- Maintain reading order for sequential retrieval
- Separate chunks for different topics (digital-twin vs simulation vs sensor) for better filtering

## State Transitions

### Content Lifecycle
```
Draft → Review → Approved → Published → Updated
```

**States**:
- `Draft`: Initial content creation
- `Review`: Content under review for quality and requirements
- `Approved`: Content meets all requirements, ready for embedding
- `Published`: Content live on GitHub Pages
- `Updated`: Content modified, requires re-embedding

### Embedding Pipeline State
```
Content Created → Chunked → Embedded → Indexed → Available for RAG
```

**States**:
- `Content Created`: Markdown content written
- `Chunked`: Content divided into semantic chunks with metadata
- `Embedded`: Chunks converted to vector embeddings
- `Indexed`: Embeddings stored in Qdrant with metadata
- `Available for RAG`: Ready for retrieval by chatkit

## Data Constraints

### Content Constraints
- Module must have at least 6 major sections (introduction, digital-twins, simulation, sensors, applications, deployment)
- Each section must address at least one learning objective
- All concepts must be defined before use
- Code examples must use Python exclusively (rclpy for ROS 2)
- Visual aids required for: digital twin architecture, sensor data flow, simulation components (FR-017)
- At least 3 sensor types must be covered (vision, proprioception, tactile) (SC-002)

### Embedding Constraints
- All sections must be chunkable (no sections > 2000 words without subsections)
- Chunk metadata must include topic category for filtering
- Chunk metadata must include concept tags for filtering
- Chunks must preserve section context for citation accuracy
- Total chunks per module: estimated 10-15 chunks (more than Module 1 due to three topics)

### Navigation Constraints
- All sections must be reachable within 3 clicks from module landing page (SC-006)
- Cross-references must be valid (backward references to Module 1, forward references clearly marked)
- Table of contents must reflect actual section structure

### Cross-Reference Constraints
- Module 1 references must point to valid Module 1 sections
- Forward references must be clearly marked as "Coming in Module X"
- All internal references must resolve to existing sections
