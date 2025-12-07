# Data Model: Missing Concepts Content Additions

**Feature**: 006-missing-concepts-content  
**Date**: 2025-12-01

## Content Addition Entities

### ContentAddition
**Description**: New subsection being added to an existing module file

**Attributes**:
- `addition_id`: Unique identifier (e.g., "urdf-humanoids", "agent-bridging") (string, unique)
- `concept_name`: Name of concept being added (string)
- `target_file`: Existing file to modify (string, path relative to module)
- `target_module`: "module-1" | "module-2" (enum)
- `subsection_title`: Heading for new subsection (string)
- `content`: Markdown content body for subsection (string, markdown)
- `insertion_point`: Location within target file (string, description or line reference)
- `order`: Suggested order relative to other subsections (integer, optional)

**Relationships**:
- Modifies one `ExistingFile` entity
- Contains zero or more `CodeExample` entities
- Contains zero or more `VisualAid` entities
- References `Concept` entities
- May reference other sections via `CrossReference` entities

**Validation Rules**:
- Target file must exist in specified module
- Subsection title must be unique within target file
- Content must be valid markdown
- Insertion point must be clearly defined
- Content must align with existing file structure and style

**Examples**:
- `urdf-humanoids`: Adds URDF subsection to workspace-overview.md in Module 1
- `agent-bridging`: Adds agent bridging subsection to humanoid-applications.md in Module 1
- `gazebo-simulation`: Adds Gazebo subsection to simulation-fundamentals.md in Module 2

### ExistingFile
**Description**: Existing module file that will be modified with new subsections

**Attributes**:
- `file_id`: Unique identifier (string, unique)
- `file_path`: Path to file (string, relative to module directory)
- `module_id`: "module-1-ros2-nervous-system" | "module-2-digital-twins-simulation" (enum)
- `current_sections`: Array of existing section titles (array of strings)
- `content_structure`: Description of existing content organization (string)
- `insertion_points`: Array of logical insertion points for new subsections (array of strings)

**Relationships**:
- Modified by one or more `ContentAddition` entities
- Contains existing `Section` entities (not modeled in detail here)
- Belongs to one `Module` entity

**Validation Rules**:
- File must exist and be valid markdown
- Insertion points must be logically appropriate
- New subsections must not disrupt existing content flow

**Examples**:
- `workspace-overview.md`: Module 1 file, insertion point after workspace structure discussion
- `humanoid-applications.md`: Module 1 file, insertion point for agent bridging pattern
- `simulation-fundamentals.md`: Module 2 file, insertion points for Gazebo and Unity
- `sensor-integration.md`: Module 2 file, insertion points for LiDAR and depth camera

### NewConcept
**Description**: New concept being introduced in the additions

**Attributes**:
- `concept_id`: Unique identifier (e.g., "urdf", "agent-bridging", "gazebo", "unity", "lidar", "depth-camera") (string, unique)
- `term`: Canonical term name (string)
- `definition`: Clear explanation of the concept (string)
- `context`: Where/how concept is used (string)
- `related_concepts`: Array of existing or new concept IDs (array of strings)
- `difficulty_level`: "beginner" | "intermediate" (enum)
- `module_context`: "module-1" | "module-2" (enum)

**Relationships**:
- Introduced in one or more `ContentAddition` entities
- May reference existing `Concept` entities from modules
- Illustrated by `CodeExample` entities
- Illustrated by `VisualAid` entities

**Validation Rules**:
- Term must be defined clearly in subsection
- Related concepts must exist (existing concepts) or be introduced in same addition
- Definition must align with module context and educational level

**Examples**:
- `urdf`: Unified Robot Description Format, Module 1 context
- `agent-bridging`: Python agent to ROS controller communication, Module 1 context
- `gazebo`: Physics simulation environment, Module 2 context
- `lidar`: Light Detection and Ranging sensor simulation, Module 2 context

### CodeExample (Enhanced for Additions)
**Description**: Python code example in new subsection

**Attributes**:
- `example_id`: Unique identifier (string, unique)
- `code`: Python code content (string, Python syntax)
- `explanation`: Brief explanation of what the code demonstrates (string)
- `concept_tags`: Array of concept IDs this example illustrates (array)
- `addition_id`: Parent content addition (string, foreign key)
- `example_type`: "urdf" | "agent-bridging" | "gazebo" | "unity" | "lidar" | "depth-camera" (enum)

**Relationships**:
- Belongs to one `ContentAddition`
- Illustrates one or more `NewConcept` entities
- May reference existing ROS 2 concepts (topics, services, actions)

**Validation Rules**:
- Code must be valid Python syntax
- Code must use ROS 2 Python API (rclpy) when demonstrating ROS 2 integration
- Code must be executable conceptually (not requiring full setup)
- Explanation must connect code to concept being taught
- Must align with existing module code example style

### VisualAid (Enhanced for Additions)
**Description**: Optional diagram or illustration for new subsection

**Attributes**:
- `visual_id`: Unique identifier (string, unique)
- `type`: "diagram" | "illustration" | "mermaid" (enum)
- `content`: Mermaid code or image reference (string)
- `caption`: Descriptive caption (string)
- `concept_tags`: Array of concept IDs this visual illustrates (array)
- `addition_id`: Parent content addition (string, foreign key, optional - only if beneficial)
- `visual_category`: "structure" | "architecture" | "data-flow" | "component" (enum)

**Relationships**:
- Belongs to one `ContentAddition` (optional - only if beneficial)
- Illustrates one or more `NewConcept` entities

**Validation Rules**:
- Visual must enhance understanding (only add if beneficial)
- Caption must be descriptive
- Mermaid diagrams must be valid syntax
- Image references must be resolvable

### CrossReference (Enhanced for Additions)
**Description**: Link from new content to existing content or between modules

**Attributes**:
- `reference_id`: Unique identifier (string, unique)
- `source_addition_id`: Content addition containing the reference (string, foreign key)
- `target_path`: Path to referenced content (string, markdown link format)
- `reference_type`: "prerequisite" | "related" | "backward" | "forward" (enum)
- `context`: Brief explanation of why this reference is relevant (string)
- `target_module`: "module-1" | "module-2" | "future-module" (enum)

**Relationships**:
- Originates from one `ContentAddition`
- Points to existing `Section` or Module 1 section

**Validation Rules**:
- Target path must be valid (or placeholder for future modules)
- Reference type must be appropriate for relationship
- Context must explain relevance
- Backward references must point to Module 1 when applicable (FR-022)

## Content Addition Mapping

### Module 1 Additions

**File: workspace-overview.md**
- Addition: `urdf-humanoids`
  - Concept: URDF (Unified Robot Description Format)
  - Insertion: After workspace structure discussion
  - Content: URDF structure, humanoid-specific elements, ROS 2 connection

**File: humanoid-applications.md**
- Addition: `agent-bridging`
  - Concept: Python Agent Bridging to ROS Controllers
  - Insertion: As new subsection in humanoid applications context
  - Content: Agent-to-controller communication patterns, rclpy examples

### Module 2 Additions

**File: simulation-fundamentals.md**
- Addition: `gazebo-physics`
  - Concept: Gazebo Physics Simulation
  - Insertion: After general physics engine discussion
  - Content: Gazebo features, humanoid examples, connection to general concepts

- Addition: `unity-rendering-hri`
  - Concept: Unity Rendering and Human-Robot Interaction
  - Insertion: After Gazebo subsection
  - Content: Unity capabilities, HRI examples, complementarity with physics simulation

**File: sensor-integration.md**
- Addition: `lidar-simulation`
  - Concept: LiDAR Sensor Simulation
  - Insertion: With existing sensor coverage
  - Content: Virtual LiDAR operation, point clouds, ROS 2 integration

- Addition: `depth-camera-simulation`
  - Concept: Depth Camera (RGB-D) Sensor Simulation
  - Insertion: After LiDAR subsection
  - Content: Depth maps, RGB-D data, ROS 2 integration

## Content Chunking Model (for Vector Database)

### ContentChunk (Enhanced for Additions)
**Description**: Semantic unit for embedding new subsection content

**Attributes**:
- `chunk_id`: Unique identifier (string, unique)
- `addition_id`: Source content addition (string, foreign key)
- `target_file`: Modified file (string, for context)
- `chunk_text`: Text content for embedding (string)
- `chunk_metadata`: JSON object containing:
  - `module_id`: "module-1-ros2-nervous-system" | "module-2-digital-twins-simulation"
  - `file_path`: Target file path
  - `subsection_title`: New subsection title
  - `concept_tags`: Array of new concept IDs
  - `existing_concept_tags`: Array of existing concept IDs referenced
  - `chunk_type`: "concept" | "example" | "application"
  - `reading_order`: Position within file (integer)
- `embedding_vector`: Vector representation (array of floats, generated by embedding model)

**Relationships**:
- Derived from `ContentAddition` content
- Maps to `NewConcept` entities via tags
- May map to existing `Concept` entities via tags

**Validation Rules**:
- Chunk text must preserve semantic meaning
- Chunk size: 200-500 words per subsection
- Chunk boundaries align with subsection boundaries
- Metadata must include concept tags for filtering
- Chunk context must include parent file for citation

**Chunking Strategy**:
- Each new subsection becomes one or more semantic chunks
- Include file context in chunk (target file, parent module)
- Preserve code examples and visual aid references in metadata
- Maintain reading order relative to existing file content

## State Transitions

### Content Addition Lifecycle
```
Drafted → Reviewed → Integrated → Chunked → Embedded → Available for RAG
```

**States**:
- `Drafted`: Initial subsection content written
- `Reviewed`: Content reviewed for quality and requirements compliance
- `Integrated`: Content merged into target file
- `Chunked`: Content divided into semantic chunks with metadata
- `Embedded`: Chunks converted to vector embeddings
- `Available for RAG`: Ready for retrieval by chatkit

### File Modification State
```
Original → Modified (Draft) → Reviewed → Merged → Published
```

**States**:
- `Original`: Existing file before modifications
- `Modified (Draft)`: File with new subsections added (draft)
- `Reviewed`: Modified file reviewed for integration quality
- `Merged`: Changes merged into main content
- `Published`: Updated file live on GitHub Pages

## Data Constraints

### Content Addition Constraints
- Each addition must be a subsection (not a section or new file)
- Subsections must integrate logically with existing file content
- All additions must maintain existing file style and format
- Code examples must use Python (rclpy for ROS 2 integration)
- Reading time: Each subsection adds ~10-15 minutes (total module time maintained)

### Integration Constraints
- Target files must exist and be valid markdown
- Insertion points must be clearly defined and logical
- New subsections must not break existing cross-references
- File structure must remain navigable (3-click requirement maintained)
- Reading flow must be preserved

### Embedding Constraints
- New subsections must be chunkable (subsection-level chunks)
- Chunk metadata must include new concept tags
- Chunks must preserve file context for citation
- Total chunks added: ~6-8 chunks (one per major addition)
- Chunks must be distinguishable from existing chunks (via metadata)

### Cross-Reference Constraints
- New content must reference existing concepts where applicable (FR-022)
- Module 2 additions may reference Module 1 concepts
- All references must be valid (or clearly marked as forward references)
- References must enhance learning continuity

## Integration Quality Checks

### Style Consistency
- New subsections must match existing file heading levels
- Code example format must match existing examples
- Terminology must be consistent with existing content
- Visual aid style must match existing visuals (if applicable)

### Content Quality
- Each subsection must be self-contained but connected to file context
- Explanations must be clear and educational
- Code examples must be minimal but complete
- Cross-references must be relevant and helpful

### Navigation Quality
- New subsections must be discoverable via table of contents
- File navigation must remain clear
- 3-click accessibility must be maintained
- Cross-references must work correctly

