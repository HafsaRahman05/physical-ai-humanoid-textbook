# Data Model: Module 4 - Vision-Language-Action (VLA)

**Feature**: Module 4 - Vision-Language-Action (VLA)  
**Date**: 2025-01-27

## Content Entities

### Module
**Description**: Module 4 container entity representing the complete Vision-Language-Action module

**Attributes**:
- `module_id`: "module-4-vision-language-action" (string, unique)
- `module_title`: "Module 4: Vision-Language-Action (VLA)" (string)
- `module_description`: Overview of module covering LLM-robotics convergence, voice-to-action, cognitive planning, and capstone project (string)
- `learning_objectives`: Array of learning objective IDs (array of strings)
- `prerequisites`: Array of prerequisite module IDs (array of strings) - ["module-1", "module-2", "module-3"]
- `estimated_reading_time`: Reading time in hours (number) - 1.5-2.5 hours per SC-001
- `sections`: Array of section IDs (array of strings)

**Relationships**:
- Contains multiple `Section` entities
- Contains multiple `LearningObjective` entities
- Depends on `Module` entities (Module 1, Module 2, Module 3)
- Referenced by `CrossReference` entities from other modules

**Validation Rules**:
- Must have at least one section
- All learning objectives must be defined
- Reading time must be 1.5-2.5 hours (SC-001)
- Must be self-contained while acknowledging dependencies (FR-018)

**Examples**:
- Module 4 with sections: introduction, llm-robotics-convergence, voice-to-action, cognitive-planning, safety-validation, capstone-project, module-integration, glossary

### Section
**Description**: Individual content file within Module 4 (e.g., voice-to-action.md, cognitive-planning.md)

**Attributes**:
- `section_id`: Unique identifier (e.g., "llm-robotics-convergence", "voice-to-action", "cognitive-planning", "capstone-project") (string, unique)
- `section_title`: Human-readable section title (string)
- `file_path`: Path to markdown file (string, relative to module directory)
- `sidebar_position`: Order in navigation (integer)
- `section_type`: "introduction" | "concept" | "tool" | "integration" | "project" | "reference" (enum)
- `content`: Markdown content body (string, markdown)
- `tags`: Array of concept tags (array of strings)
- `learning_objectives`: Array of learning objective IDs addressed (array of strings)

**Relationships**:
- Belongs to one `Module` entity (Module 4)
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
- `llm-robotics-convergence`: Concept section covering LLM-robotics convergence
- `voice-to-action`: Tool section covering OpenAI Whisper and voice-to-action pipeline
- `cognitive-planning`: Concept section covering LLM cognitive planning
- `capstone-project`: Project section demonstrating complete VLA pipeline

### Concept
**Description**: Key concept introduced or explained in Module 4

**Attributes**:
- `concept_id`: Unique identifier (e.g., "vla", "voice-to-action", "cognitive-planning", "natural-language-intent") (string, unique)
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
- May reference concepts from Module 1, 2, or 3

**Validation Rules**:
- Term must be defined clearly in section
- Definition must align with module context and educational level
- Related concepts must exist (existing concepts) or be introduced in module
- Must appear in glossary (FR-021)

**Examples**:
- `vla`: Vision-Language-Action - convergence of vision, language, and action in robotics
- `voice-to-action`: Pipeline from voice commands to robot actions
- `cognitive-planning`: LLM-based planning translating natural language to robot actions
- `natural-language-intent`: Semantic meaning extracted from voice commands

### CodeExample
**Description**: Code example in Module 4 section

**Attributes**:
- `example_id`: Unique identifier (string, unique)
- `section_id`: Section containing example (string)
- `example_type`: "python" | "integration-pattern" (enum) - per FR-015 and clarification
- `language`: "python" (enum) - Python exclusively per FR-015
- `code`: Code content showing integration patterns (string)
- `description`: Explanation of what example demonstrates (string)
- `concept_id`: Concept illustrated by example (string, optional)
- `is_snippet`: Whether example is snippet or complete (boolean) - typically snippets showing patterns

**Relationships**:
- Belongs to one `Section` entity
- Illustrates one or more `Concept` entities

**Validation Rules**:
- Code must be Python (FR-015)
- Code must show integration patterns (Whisper calls, LLM prompts, ROS 2 actions) - per clarification
- Code must be valid Python syntax
- Description must explain educational purpose
- Must demonstrate relevant concept effectively

**Examples**:
- Python example: Whisper API call pattern for voice transcription
- Python example: LLM prompt structure for cognitive planning (provider-agnostic)
- Python example: ROS 2 action generation from cognitive plan

### VisualAid
**Description**: Diagram or illustration in Module 4 section

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
- Must enhance understanding of concept (SC-012)
- Visual type must be appropriate for concept complexity
- Required for VLA pipeline and capstone project flow (FR-020)

**Examples**:
- Mermaid diagram: VLA pipeline showing voice → planning → action flow
- Mermaid diagram: Voice-to-action pipeline stages
- Mermaid diagram: Cognitive planning process from natural language to ROS 2 actions
- Mermaid diagram: Capstone project flow showing complete integration

### LearningObjective
**Description**: Learning objective for Module 4

**Attributes**:
- `objective_id`: Unique identifier (e.g., "lo-010", "lo-011") (string, unique)
- `objective_text`: Description of what students should achieve (string)
- `module_id`: "module-4" (string)
- `sections`: Array of section IDs that address objective (array of strings)
- `success_criteria`: Related success criterion ID (string, optional)

**Relationships**:
- Belongs to one `Module` entity (Module 4)
- Addressed by one or more `Section` entities
- May map to `SuccessCriterion` entities

**Validation Rules**:
- Objective text must be clear and measurable
- Must be addressed by at least one section
- Must align with module learning objectives (FR-013)

**Examples**:
- `lo-010`: Explain what Vision-Language-Action (VLA) means and its significance in humanoid robotics
- `lo-011`: Understand how OpenAI Whisper enables voice-to-action capabilities for robots
- `lo-012`: Describe how LLMs translate natural language commands into ROS 2 action sequences
- `lo-013`: Explain the complete VLA pipeline from voice input to physical action

### CrossReference
**Description**: Reference link from Module 4 to Modules 1, 2, or 3

**Attributes**:
- `reference_id`: Unique identifier (string, unique)
- `source_section_id`: Section in Module 4 making reference (string)
- `target_module_id`: "module-1" | "module-2" | "module-3" (enum)
- `target_section_id`: Section in target module (string, optional)
- `reference_text`: Display text for link (string)
- `reference_type`: "prerequisite" | "related-concept" | "builds-on" | "integration" (enum)

**Relationships**:
- From one `Section` entity (Module 4)
- To one `Section` entity or `Module` entity (Module 1, 2, or 3)

**Validation Rules**:
- Target module must exist (Module 1, 2, or 3)
- Target section must exist if specified
- Reference text must be descriptive
- Must enhance learning progression (FR-022)

**Examples**:
- Reference from cognitive-planning.md to Module 1 ROS 2 actions
- Reference from capstone-project.md to Module 2 simulation concepts
- Reference from capstone-project.md to Module 3 perception/navigation

### ContentChunk
**Description**: Semantic chunk of Module 4 content for vector database embedding

**Attributes**:
- `chunk_id`: Unique identifier (string, unique)
- `section_id`: Section containing chunk (string)
- `chunk_text`: Text content of chunk (string)
- `chunk_metadata`: Metadata for chunk (object):
  - `section_title`: Title of containing section (string)
  - `concepts`: Array of concept IDs in chunk (array of strings)
  - `chunk_type`: "introduction" | "concept-explanation" | "example" | "summary" | "integration" (enum)
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
- All key concepts must be retrievable (SC-007)

**Examples**:
- Chunk: VLA concept explanation with LLM-robotics convergence
- Chunk: Voice-to-action pipeline stages
- Chunk: Cognitive planning process with provider-agnostic patterns
- Chunk: Capstone project integration demonstration

## Entity Relationships Summary

```
Module (Module 4)
├── Contains → Section (multiple)
│   ├── Contains → Concept (multiple)
│   ├── Contains → CodeExample (zero or more)
│   ├── Contains → VisualAid (zero or more)
│   ├── Contains → ContentChunk (multiple)
│   └── References → CrossReference (zero or more)
│
├── Contains → LearningObjective (multiple)
│
└── Depends on → Module (Module 1, Module 2, Module 3)

CrossReference
├── From → Section (Module 4)
└── To → Section/Module (Module 1, 2, or 3)
```

## Validation Rules Summary

1. **Module Level**:
   - Must be readable in 1.5-2.5 hours (SC-001)
   - Must be self-contained while acknowledging dependencies (FR-018)
   - Must support embedding with semantic chunks (FR-019)

2. **Section Level**:
   - Each section must address at least one learning objective
   - Sections must follow established structure patterns
   - Visual aids required for VLA pipeline and capstone project flow (SC-012)

3. **Concept Level**:
   - All concepts must be defined clearly (FR-021)
   - Concepts must appear in glossary
   - Related concepts must exist or be introduced

4. **Code Example Level**:
   - Python exclusively (FR-015)
   - Show integration patterns (Whisper, LLM prompts, ROS 2 actions) - per clarification
   - Provider-agnostic LLM patterns (no specific provider focus) - per clarification
   - Examples must demonstrate concepts effectively

5. **Content Chunk Level**:
   - Chunks must preserve semantic meaning
   - Optimal size for RAG retrieval (200-500 words)
   - All key concepts must be retrievable (SC-007)

