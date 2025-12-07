---
id: 014-urdu-i18n-clarification-20251206
title: urdu-i18n-clarification
stage: spec
date: 2025-12-06
surface: cursor
model: auto
feature: 014-urdu-i18n-support
branch: 014-urdu-i18n-support
user: user
command: /sp.clarify
labels: [spec, clarification, i18n, urdu, translation-workflow]
links:
  spec: ../../specs/014-urdu-i18n-support/spec.md
  ticket: 
  adr: 
  pr: 
files:
  - path: specs/014-urdu-i18n-support/spec.md
    action: updated
tests:
  - type: specification-clarity
    status: pass
---

## Prompt

/sp.clarify I need to make sure the specs is clear about going through each module one file of one chapter at a time and translating it into urdu.

- Quality matters for educational content

- Technical terms need accurate translation

- Code examples should not be translated

## Response snapshot

Clarified 3 critical ambiguities in the Urdu i18n specification:

1. **Translation Workflow**: Clarified that translations proceed one file at a time within each chapter, translating files sequentially
2. **Quality Review Process**: Clarified that quality review is conducted per chapter after all files in that chapter have been translated
3. **Technical Term Consistency**: Clarified that a shared glossary/term bank must be maintained and consulted during each file translation to ensure consistency

Updated sections:
- Added Clarifications section with Q&A record
- Updated FR-006 to specify one-file-at-a-time workflow with chapter-level review
- Updated FR-008 to require shared glossary/term bank for technical term consistency
- Updated NFR-001 to specify chapter-level review timing
- Added TermBank entity to Key Entities
- Updated Assumptions to reflect workflow and glossary requirements
- Updated Translation Dependencies to include shared glossary/term bank

## Outcome

- ✅ Impact: Specification now clearly defines incremental translation workflow, quality review process, and technical term consistency requirements
- 🧪 Tests: All clarifications integrated into requirements and assumptions
- 📁 Files: Updated spec.md with clarifications
- 🔁 Next prompts: Ready for `/sp.plan`
- 🧠 Reflection: Clarifications ensure quality-focused, incremental translation process that maintains consistency for educational content

## Evaluation notes (flywheel)

- Failure modes observed: None
- Graders run and results (PASS/FAIL): Specification clarity - PASS
- Prompt variant (if applicable): N/A
- Next experiment (smallest change to try): Proceed to planning phase

