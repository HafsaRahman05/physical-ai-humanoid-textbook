<!--
Sync Impact Report:
Version change: N/A → 1.0.0 (Initial constitution)
Modified principles: N/A (all new)
Added sections: Technology Stack, Deployment Strategy, RAG System Architecture
Removed sections: N/A
Templates requiring updates:
  - ⚠ pending: .specify/templates/plan-template.md (not found, will create if needed)
  - ⚠ pending: .specify/templates/spec-template.md (not found, will create if needed)
  - ⚠ pending: .specify/templates/tasks-template.md (not found, will create if needed)
Follow-up TODOs: None
-->

# Physical AI Humanoid Robotics Textbook Constitution

## Core Principles

### I. Documentation-First Architecture
All project content MUST be structured as modular documentation chapters suitable for Docusaurus. Each module (chapter) MUST be self-contained, independently navigable, and maintainable. Content structure MUST support both human reading and programmatic embedding into vector databases. Clear separation between content (markdown) and presentation (Docusaurus configuration) is required.

**Rationale**: The primary deliverable is an educational textbook. All technical components (RAG system, AI agent) serve to enhance the book's accessibility and interactivity, not replace it.

### II. Modular Content Organization
The book MUST be organized into discrete modules (chapters), each covering a distinct topic within Physical AI, Humanoid Robotics. Modules MUST have clear boundaries, dependencies, and learning progression. Each module MUST be version-controlled independently where possible, with clear ownership and update procedures.

**Rationale**: Modular structure enables parallel development, easier maintenance, and supports granular embedding strategies for the RAG system.

### III. Vector Database Integration (NON-NEGOTIABLE)
All book content MUST be embeddable into the Qdrant vector database. Content structure MUST support chunking strategies that preserve semantic meaning. Embedding pipeline MUST be reproducible, versioned, and testable. Vector database schema MUST be documented and version-controlled.

**Rationale**: The RAG chatkit is a core feature requiring reliable, accurate retrieval of book content. Content structure must be optimized for embedding quality.

### IV. AI Agent Architecture
The AI Agent MUST use OpenAI Agents SDK and MUST be connected to the Qdrant vector database for retrieval. Agent responses MUST be traceable to source content (citations). Agent API MUST be exposed via FastAPI with clear endpoint documentation. Agent behavior MUST be deterministic for identical queries (within model constraints).

**Rationale**: Consistent, citable responses enhance educational value and user trust in the system.

### V. Deployment Standards
The Docusaurus book MUST deploy to GitHub Pages with automated CI/CD. The AI Agent MUST deploy to Hugging Face Space via Docker image. All deployment configurations MUST be version-controlled, reproducible, and documented. Deployment failures MUST not affect the book's availability (decoupled systems).

**Rationale**: Reliable, automated deployments reduce maintenance overhead and ensure consistent user experience.

### VI. API-First Backend Design
The FastAPI backend MUST provide RESTful endpoints for the chatkit frontend. API responses MUST follow consistent error handling and status codes. API schema MUST be documented (OpenAPI/Swagger). Backend MUST be independently testable and deployable.

**Rationale**: Clear API contracts enable frontend development and future integrations.

## Technology Stack Requirements

### Mandatory Technologies
- **Documentation**: Docusaurus (latest stable)
- **Deployment (Book)**: GitHub Pages
- **Vector Database**: Qdrant
- **AI Framework**: OpenAI Agents SDK
- **Backend API**: FastAPI
- **Deployment (Agent)**: Hugging Face Space (Docker)
- **Frontend (Chatkit)**: To be determined, but MUST consume FastAPI endpoints

### Technology Selection Criteria
New technology additions MUST be justified by:
1. Direct requirement from core principles
2. Integration compatibility with existing stack
3. Maintenance burden assessment
4. Community support and documentation quality

## Development Workflow

### Content Development
1. Content MUST be written in Markdown following Docusaurus conventions
2. Each module MUST be reviewed for embedding compatibility before merging
3. Content updates MUST trigger re-embedding pipeline (automated or manual)

### Code Development
1. All code (FastAPI, embedding scripts, Docker configs) MUST follow language-specific best practices
2. API changes MUST be backward-compatible or versioned
3. Docker images MUST be tagged and versioned

### Testing Requirements
1. Embedding pipeline MUST be tested with sample content
2. API endpoints MUST have integration tests
3. Agent responses MUST be validated for citation accuracy
4. Deployment pipelines MUST be tested in staging before production

## Governance

This constitution supersedes all other development practices and guidelines. Amendments require:
1. Documentation of rationale and impact assessment
2. Update to this file with version increment
3. Propagation to dependent templates and documentation
4. Review and approval process (to be defined by project maintainers)

All pull requests and code reviews MUST verify compliance with these principles. Complexity beyond these principles MUST be explicitly justified. Use `.specify/templates/` for development guidance templates.

**Version**: 1.0.0 | **Ratified**: 2025-12-01 | **Last Amended**: 2025-12-01
