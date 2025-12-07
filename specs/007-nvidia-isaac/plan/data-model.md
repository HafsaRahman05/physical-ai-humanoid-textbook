# Data Model: Module 3 - The AI-Robot Brain (NVIDIA Isaac™)

**Feature**: Module 3 - The AI-Robot Brain (NVIDIA Isaac™)  
**Date**: 2025-12-01

## Content Entities

### Module
**Description**: Module 3 container entity representing the complete AI-Robot Brain module

**Attributes**:
- `module_id`: "module-3-ai-robot-brain" (string, unique)
- `module_title`: "Module 3: The AI-Robot Brain (NVIDIA Isaac™)" (string)
- `module_description`: Overview of module covering advanced perception and training (string)
- `learning_objectives`: Array of learning objective IDs (array of strings)
- `prerequisites`: Array of prerequisite module IDs (array of strings) - ["module-1", "module-2"]
- `estimated_reading_time`: Reading time in hours (number) - 1-2 hours per SC-001
- `sections`: Array of section IDs (array of strings)

**Relationships**:
- Contains multiple `Section` entities
- Contains multiple `LearningObjective` entities
- Depends on `Module` entities (Module 1, Module 2)
- Referenced by `CrossReference` entities from other modules

**Validation Rules**:
- Must have at least one section
- All learning objectives must be defined
- Reading time must be 1-2 hours (SC-001)
- Must be self-contained while acknowledging dependencies (FR-015)

**Examples**:
- Module 3 with sections: introduction, ai-robot-brain-concept, isaac-sim, isaac-ros, nav2-path-planning, integrated-applications, glossary

### Section
**Description**: Individual content file within Module 3 (e.g., isaac-sim.md, isaac-ros.md)

**Attributes**:
- `section_id`: Unique identifier (e.g., "isaac-sim", "isaac-ros", "nav2-path-planning") (string, unique)
- `section_title`: Human-readable section title (string)
- `file_path`: Path to markdown file (string, relative to module directory)
- `sidebar_position`: Order in navigation (integer)
- `section_type`: "introduction" | "concept" | "tool" | "integration" | "reference" (enum)
- `content`: Markdown content body (string, markdown)
- `tags`: Array of concept tags (array of strings)
- `learning_objectives`: Array of learning objective IDs addressed (array of strings)

**Relationships**:
- Belongs to one `Module` entity (Module 3)
- Contains multiple `Concept` entities
- Contains zero or more `CodeExample` entities
- Contains zero or more `VisualAid` entities
- Referenced by `CrossReference` entities

**Validation Rules**:
- File path must exist in module directory structure
- Sidebar position must be unique within module
- Content must be valid markdown
- Must address at least one learning objective
- Tags must align with concepts covered

**Examples**:
- `isaac-sim`: Tool section covering NVIDIA Isaac Sim capabilities
- `isaac-ros`: Tool section covering Isaac ROS VSLAM and navigation
- `nav2-path-planning`: Tool section covering Nav2 path planning
- `integrated-applications`: Integration section showing how tools work together

### Concept
**Description**: Key concept introduced or explained in Module 3

**Attributes**:
- `concept_id`: Unique identifier (e.g., "photorealistic-simulation", "vslam", "bipedal-constraints") (string, unique)
- `term`: Canonical term name (string)
- `definition`: Clear explanation of the concept (string)
- `context`: Where/how concept is used (string)
- `related_concepts`: Array of concept IDs (array of strings)
- `difficulty_level`: "beginner" | "intermediate" | "advanced" (enum)
- `section_id`: Section where concept is primarily introduced (string)

**Relationships**:
- Introduced in one or more `Section` entities
- Illustrated by `CodeExample` entities
- Illustrated by `VisualAid` entities
- May reference concepts from Module 1 or Module 2

**Validation Rules**:
- Term must be defined clearly in section
- Definition must align with module context and educational level
- Related concepts must exist (existing concepts) or be introduced in module
- Must appear in glossary (FR-018)

**Examples**:
- `photorealistic-simulation`: Realistic rendering in simulation for training data generation
- `vslam`: Visual SLAM - simultaneous mapping and localization using visual sensors
- `hardware-acceleration`: GPU-accelerated processing for improved performance
- `bipedal-constraints`: Balance, foot placement, terrain adaptation requirements for humanoids

### CodeExample
**Description**: Code example in Module 3 section

**Attributes**:
- `example_id`: Unique identifier (string, unique)
- `section_id`: Section containing example (string)
- `example_type`: "python" | "conceptual" | "configuration" (enum) - per FR-012 clarification
- `language`: "python" | "yaml" | "markdown" | "none" (enum)
- `code`: Code or configuration content (string)
- `description`: Explanation of what example demonstrates (string)
- `concept_id`: Concept illustrated by example (string, optional)
- `is_snippet`: Whether example is snippet or complete (boolean)

**Relationships**:
- Belongs to one `Section` entity
- Illustrates one or more `Concept` entities

**Validation Rules**:
- Code must align with example_type (Python for Isaac Sim, conceptual/configuration for Isaac ROS/Nav2)
- Code must be valid syntax for specified language
- Description must explain educational purpose
- Must demonstrate relevant concept effectively

**Examples**:
- Python example: Isaac Sim synthetic data generation script
- Conceptual example: VSLAM workflow description
- Configuration example: Nav2 humanoid constraint YAML configuration

### VisualAid
**Description**: Diagram or illustration in Module 3 section

**Attributes**:
- `visual_id`: Unique identifier (string, unique)
- `section_id`: Section containing visual (string)
- `visual_type`: "mermaid-diagram" | "illustration" | "diagram" (enum)
- `file_path`: Path to visual file (string, relative to module _assets directory)
- `alt_text`: Alternative text description (string)
- `caption`: Caption describing visual (string, optional)
- `concept_id`: Concept illustrated by visual (string, optional)

**Relationships**:
- Belongs to one `Section` entity
- Illustrates one or more `Concept` entities

**Validation Rules**:
- File path must exist in module _assets directory
- Alt text required for accessibility
- Must enhance understanding of concept (SC-011)
- Visual type must be appropriate for concept complexity

**Examples**:
- Mermaid diagram: AI-robot brain architecture showing Isaac Sim → Isaac ROS → Nav2 flow
- Mermaid diagram: VSLAM system components
- Illustration: Humanoid path planning with balance constraints

### LearningObjective
**Description**: Learning objective for Module 3

**Attributes**:
- `objective_id`: Unique identifier (e.g., "lo-007", "lo-008") (string, unique)
- `objective_text`: Description of what students should achieve (string)
- `module_id`: "module-3" (string)
- `sections`: Array of section IDs that address objective (array of strings)
- `success_criteria`: Related success criterion ID (string, optional)

**Relationships**:
- Belongs to one `Module` entity (Module 3)
- Addressed by one or more `Section` entities
- May map to `SuccessCriterion` entities

**Validation Rules**:
- Objective text must be clear and measurable
- Must be addressed by at least one section
- Must align with module learning objectives (FR-010)

**Examples**:
- `lo-007`: Explain NVIDIA Isaac Sim's role in photorealistic simulation and synthetic data generation
- `lo-008`: Understand Visual SLAM (VSLAM) and how hardware acceleration improves performance
- `lo-009`: Identify how Nav2 adapts path planning for bipedal humanoid movement

### CrossReference
**Description**: Reference link from Module 3 to Modules 1 or 2

**Attributes**:
- `reference_id`: Unique identifier (string, unique)
- `source_section_id`: Section in Module 3 making reference (string)
- `target_module_id`: "module-1" | "module-2" (enum)
- `target_section_id`: Section in target module (string, optional)
- `reference_text`: Display text for link (string)
- `reference_type`: "prerequisite" | "related-concept" | "builds-on" (enum)

**Relationships**:
- From one `Section` entity (Module 3)
- To one `Section` entity or `Module` entity (Module 1 or Module 2)

**Validation Rules**:
- Target module must exist (Module 1 or Module 2)
- Target section must exist if specified
- Reference text must be descriptive
- Must enhance learning progression (FR-019)

**Examples**:
- Reference from isaac-ros.md to Module 1 ROS 2 topics/services
- Reference from isaac-sim.md to Module 2 general simulation concepts
- Reference from nav2-path-planning.md to Module 2 sensor concepts

### ContentChunk
**Description**: Semantic chunk of Module 3 content for vector database embedding

**Attributes**:
- `chunk_id`: Unique identifier (string, unique)
- `section_id`: Section containing chunk (string)
- `chunk_text`: Text content of chunk (string)
- `chunk_metadata`: Metadata for chunk (object):
  - `section_title`: Title of containing section (string)
  - `concepts`: Array of concept IDs in chunk (array of strings)
  - `chunk_type`: "introduction" | "concept-explanation" | "example" | "summary" (enum)
  - `word_count`: Approximate word count (number)
- `embedding_vector`: Vector representation (array of numbers, optional - generated by pipeline)
- `chunk_order`: Order within section (integer)

**Relationships**:
- Belongs to one `Section` entity
- Contains one or more `Concept` entities (via metadata)

**Validation Rules**:
- Chunk text must preserve semantic meaning
- Chunk size should be optimal for RAG retrieval (200-500 words for educational content)
- Chunk boundaries should align with section structure
- Metadata must accurately represent chunk content
- All key concepts must be retrievable (SC-006)

**Examples**:
- Chunk: Isaac Sim photorealistic simulation capabilities explanation
- Chunk: VSLAM concept with hardware acceleration benefits
- Chunk: Nav2 humanoid constraint considerations

## Entity Relationships Summary

```
Module (Module 3)
├── Contains → Section (multiple)
│   ├── Contains → Concept (multiple)
│   ├── Contains → CodeExample (zero or more)
│   ├── Contains → VisualAid (zero or more)
│   ├── Contains → ContentChunk (multiple)
│   └── References → CrossReference (zero or more)
│
├── Contains → LearningObjective (multiple)
│
└── Depends on → Module (Module 1, Module 2)

CrossReference
├── From → Section (Module 3)
└── To → Section/Module (Module 1 or Module 2)
```

## Validation Rules Summary

1. **Module Level**:
   - Must be readable in 1-2 hours (SC-001)
   - Must be self-contained while acknowledging dependencies (FR-015)
   - Must support embedding with semantic chunks (FR-016)

2. **Section Level**:
   - Each section must address at least one learning objective
   - Sections must follow established structure patterns
   - Visual aids required for complex concepts (SC-011)

3. **Concept Level**:
   - All concepts must be defined clearly (FR-018)
   - Concepts must appear in glossary
   - Related concepts must exist or be introduced

4. **Code Example Level**:
   - Python for Isaac Sim (where supported)
   - Conceptual/configuration for Isaac ROS/Nav2 (per FR-012)
   - Examples must demonstrate concepts effectively

5. **Content Chunk Level**:
   - Chunks must preserve semantic meaning
   - Optimal size for RAG retrieval (200-500 words)
   - All key concepts must be retrievable (SC-006)

