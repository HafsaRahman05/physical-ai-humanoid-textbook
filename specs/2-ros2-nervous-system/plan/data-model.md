# Data Model: Module 1 Content Structure

**Feature**: Module 1 - The Robotic Nervous System (ROS 2)  
**Date**: 2025-12-01

## Content Entities

### Module
**Description**: Top-level container for Module 1 content

**Attributes**:
- `module_id`: "module-1-ros2-nervous-system" (string, unique)
- `title`: "The Robotic Nervous System (ROS 2)" (string)
- `learning_objectives`: Array of learning objective strings
- `estimated_reading_time`: "1-2 hours" (string)
- `prerequisites`: ["Python programming knowledge", "Basic robotics concepts"] (array)

**Relationships**:
- Contains multiple `Section` entities
- References `Concept` entities
- Links to future modules (forward references)

### Section
**Description**: Discrete unit of content covering a specific topic within the module

**Attributes**:
- `section_id`: Unique identifier (e.g., "introduction", "ros2-fundamentals") (string, unique within module)
- `title`: Section heading (string)
- `content`: Markdown content body (string, markdown)
- `order`: Sequential order within module (integer)
- `learning_objective_tags`: Array of learning objective IDs this section addresses
- `concept_tags`: Array of concept IDs covered (e.g., ["nodes", "topics"])

**Relationships**:
- Belongs to one `Module`
- Contains zero or more `CodeExample` entities
- Contains zero or more `VisualAid` entities
- References other `Section` entities (cross-references)
- References `Concept` entities

**Validation Rules**:
- Section title must be unique within module
- Order must be sequential (no gaps)
- Content must be valid markdown
- Section must address at least one learning objective

### Concept
**Description**: Abstract idea or technical term explained in the module

**Attributes**:
- `concept_id`: Unique identifier (e.g., "ros2-node", "publish-subscribe") (string, unique)
- `term`: Canonical term name (string)
- `definition`: Clear explanation of the concept (string)
- `context`: Where/how concept is used (string)
- `related_concepts`: Array of related concept IDs (array of strings)
- `difficulty_level`: "beginner" | "intermediate" (enum)

**Relationships**:
- Referenced by multiple `Section` entities
- May reference other `Concept` entities (prerequisites, related concepts)
- Illustrated by `CodeExample` entities
- Illustrated by `VisualAid` entities

**Validation Rules**:
- Term must be defined before first use in content
- Definition must be clear and unambiguous
- Related concepts must exist (forward references allowed for future modules)

**Examples**:
- `ros2-node`: A process that performs computation in ROS 2
- `topic`: Named communication channel for publish-subscribe messaging
- `service`: Synchronous request-response communication pattern
- `action`: Asynchronous long-running task with feedback

### CodeExample
**Description**: Python code example illustrating a ROS 2 concept

**Attributes**:
- `example_id`: Unique identifier (string, unique)
- `code`: Python code content (string, Python syntax)
- `explanation`: Brief explanation of what the code demonstrates (string)
- `concept_tags`: Array of concept IDs this example illustrates (array)
- `section_id`: Parent section (string, foreign key to Section)

**Relationships**:
- Belongs to one `Section`
- Illustrates one or more `Concept` entities

**Validation Rules**:
- Code must be valid Python syntax
- Code must use ROS 2 Python API (rclpy)
- Code must be executable (conceptually, not requiring full setup)
- Explanation must connect code to concept being taught

### VisualAid
**Description**: Diagram or illustration enhancing understanding

**Attributes**:
- `visual_id`: Unique identifier (string, unique)
- `type`: "diagram" | "illustration" | "mermaid" (enum)
- `content`: Mermaid code or image reference (string)
- `caption`: Descriptive caption (string)
- `concept_tags`: Array of concept IDs this visual illustrates (array)
- `section_id`: Parent section (string, foreign key to Section)

**Relationships**:
- Belongs to one `Section`
- Illustrates one or more `Concept` entities

**Validation Rules**:
- Visual must enhance understanding of at least one concept
- Caption must be descriptive
- Mermaid diagrams must be valid syntax
- Image references must be resolvable

### LearningObjective
**Description**: Specific knowledge or skill students should acquire

**Attributes**:
- `objective_id`: Unique identifier (string, unique)
- `description`: Clear statement of what students will learn (string)
- `section_tags`: Array of section IDs that address this objective (array)
- `assessment_criteria`: How to verify objective is met (string)

**Relationships**:
- Addressed by multiple `Section` entities

**Validation Rules**:
- Description must be measurable and testable
- At least one section must address each objective
- Objectives must align with success criteria (SC-002, SC-003)

**Examples**:
- `lo-001`: Students can explain what ROS 2 is and its role in robotics
- `lo-002`: Students can identify appropriate ROS 2 communication patterns for scenarios
- `lo-003`: Students can map ROS 2 components to humanoid robot subsystems

### CrossReference
**Description**: Link to related content within module or to other modules

**Attributes**:
- `reference_id`: Unique identifier (string, unique)
- `source_section_id`: Section containing the reference (string, foreign key)
- `target_path`: Path to referenced content (string, markdown link format)
- `reference_type`: "prerequisite" | "related" | "advanced" | "forward" (enum)
- `context`: Brief explanation of why this reference is relevant (string)

**Relationships**:
- Originates from one `Section`
- Points to another `Section` or future module

**Validation Rules**:
- Target path must be valid (or placeholder for future modules)
- Reference type must be appropriate for relationship
- Context must explain relevance

## Content Chunking Model (for Vector Database)

### ContentChunk
**Description**: Semantic unit for embedding into Qdrant vector database

**Attributes**:
- `chunk_id`: Unique identifier (string, unique)
- `section_id`: Source section (string, foreign key)
- `chunk_text`: Text content for embedding (string)
- `chunk_metadata`: JSON object containing:
  - `module_id`: "module-1-ros2-nervous-system"
  - `section_id`: Source section identifier
  - `concept_tags`: Array of concept IDs
  - `learning_objective_tags`: Array of objective IDs
  - `chunk_type`: "introduction" | "concept" | "example" | "application"
  - `reading_order`: Sequential order within section
- `embedding_vector`: Vector representation (array of floats, generated by embedding model)

**Relationships**:
- Derived from `Section` content
- Maps to `Concept` entities via tags
- Maps to `LearningObjective` entities via tags

**Validation Rules**:
- Chunk text must preserve semantic meaning
- Chunk size: 300-500 words (optimal for educational content)
- Chunk boundaries must align with semantic breaks
- Metadata must include all relevant tags for filtering

**Chunking Strategy**:
- One chunk per major concept within a section
- Include section context in chunk (title, parent module)
- Preserve code examples and visual aid references in metadata
- Maintain reading order for sequential retrieval

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
- Module must have at least 4 major sections (introduction, fundamentals, patterns, applications)
- Each section must address at least one learning objective
- All concepts must be defined before use
- Code examples must use Python exclusively
- Visual aids required for complex concepts (SC-010)

### Embedding Constraints
- All sections must be chunkable (no sections > 2000 words without subsections)
- Chunk metadata must include concept tags for filtering
- Chunks must preserve section context for citation accuracy
- Total chunks per module: estimated 8-12 chunks

### Navigation Constraints
- All sections must be reachable within 3 clicks from module landing page (SC-008)
- Cross-references must be valid (or clearly marked as forward references)
- Table of contents must reflect actual section structure

