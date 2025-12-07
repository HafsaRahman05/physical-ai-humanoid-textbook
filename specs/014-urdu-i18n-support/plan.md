# Implementation Plan: Urdu Language Support via i18n

**Branch**: `014-urdu-i18n-support` | **Date**: 2025-12-06 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/014-urdu-i18n-support/spec.md`

**Note**: This template is filled in by the `/sp.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Add Urdu language support to the Physical AI Humanoid Robotics Textbook using Docusaurus i18n. The implementation will configure Urdu as a locale with RTL (right-to-left) text direction, create translation file structure matching English content, and provide a language selector in the navigation. Translations will proceed incrementally: Module 1 is MVP scope (including root intro.md), proceeding one file at a time sequentially within each module, with quality review conducted per module after all files are translated. Translation strategy: Full Urdu translation with only technical terms (acronyms, proper nouns, domain-specific terms) kept in English. A shared glossary/term bank will ensure technical term consistency across translations. Additional modules (2, 3, 4) may be translated incrementally in future phases.

**Technical Approach**: Use Docusaurus built-in i18n plugin with RTL locale configuration. No additional dependencies required. Translation files mirror English content structure in `i18n/ur/docusaurus-plugin-content-docs/current/` directory. Shared glossary maintained in `translations/glossary/technical-terms.json` for term consistency.

## Technical Context

**Language/Version**: TypeScript 5.6.2, Node.js >=20.0  
**Primary Dependencies**: Docusaurus 3.9.2, React 19.0.0, @docusaurus/preset-classic 3.9.2  
**Storage**: File-based (markdown files in `i18n/ur/docusaurus-plugin-content-docs/current/` directory structure)  
**Testing**: Docusaurus build process, manual browser testing for RTL layout  
**Target Platform**: Web (GitHub Pages deployment), modern browsers (Chrome, Firefox, Safari, Edge)  
**Project Type**: Web (Docusaurus static site)  
**Performance Goals**: Page load time increase <500ms when switching languages (NFR-003)  
**Constraints**: Must maintain existing English content structure, preserve code examples in English, ensure RTL layout compatibility across browsers  
**Scale/Scope**: Module 1 initially (intro.md + ~7 module files), expandable to all modules incrementally

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### I. Documentation-First Architecture ✅
- **Status**: PASS
- **Rationale**: Feature adds Urdu translations of existing documentation content. All content remains structured as modular documentation chapters in Docusaurus. No changes to content structure, only addition of translated versions.

### II. Modular Content Organization ✅
- **Status**: PASS
- **Rationale**: Translations follow the same modular structure as English content. Each module's Urdu translations are organized identically to English versions, maintaining clear boundaries and dependencies.

### III. Vector Database Integration ✅
- **Status**: PASS (No impact)
- **Rationale**: This feature does not modify the embedding system. Urdu content structure will match English content structure, enabling future Urdu embedding support if needed (out of scope for this phase).

### IV. AI Agent Architecture ✅
- **Status**: PASS (No impact)
- **Rationale**: This feature does not modify the AI Agent or FastAPI backend. Chatbot Urdu support is explicitly out of scope.

### V. Deployment Standards ✅
- **Status**: PASS
- **Rationale**: Docusaurus i18n builds generate separate builds for each locale, compatible with existing GitHub Pages deployment. No changes to deployment configuration required.

### VI. API-First Backend Design ✅
- **Status**: PASS (No impact)
- **Rationale**: This feature does not modify backend APIs. All changes are frontend/documentation layer only.

**Overall Gate Status**: ✅ PASS - All constitution principles satisfied

## Project Structure

### Documentation (this feature)

```text
specs/[###-feature]/
├── plan.md              # This file (/sp.plan command output)
├── research.md          # Phase 0 output (/sp.plan command)
├── data-model.md        # Phase 1 output (/sp.plan command)
├── quickstart.md        # Phase 1 output (/sp.plan command)
├── contracts/           # Phase 1 output (/sp.plan command)
└── tasks.md             # Phase 2 output (/sp.tasks command - NOT created by /sp.plan)
```

### Source Code (repository root)

```text
# Docusaurus configuration and content
docusaurus.config.ts          # Main config - add Urdu locale and RTL settings
sidebars.ts                   # Sidebar config - may need Urdu labels
package.json                  # Dependencies (no changes needed)

# English content (existing)
docs/
└── modules/
    └── module-1-ros2-nervous-system/
        ├── index.md
        ├── introduction.md
        ├── ros2-fundamentals.md
        ├── communication-patterns.md
        ├── humanoid-applications.md
        ├── workspace-overview.md
        └── glossary.md

# Urdu translations (new)
i18n/
└── ur/
    └── docusaurus-plugin-content-docs/
        └── current/
            ├── intro.md                    # Root introduction - REQUIRED (maps to /ur/ and /ur/intro)
            └── modules/
                └── module-1-ros2-nervous-system/
                    ├── index.md            # Module landing page
                    ├── introduction.md
                    ├── ros2-fundamentals.md
                    ├── communication-patterns.md
                    ├── humanoid-applications.md
                    ├── workspace-overview.md
                    └── glossary.md

# Translation workflow support (new)
translations/
└── glossary/
    └── technical-terms.json   # Shared glossary/term bank for consistency
```

**Structure Decision**: This is a Docusaurus static site. The feature adds:
1. Configuration changes to `docusaurus.config.ts` (i18n settings, locale dropdown)
2. New translation directory structure `i18n/ur/` mirroring `docs/` structure
3. Shared glossary file for technical term consistency (outside Docusaurus structure, used during translation process)

**URL Routing Structure**: Docusaurus i18n automatically handles URL routing based on file structure:
- English root page `docs/intro.md` → `/` (root) and `/intro` in English locale
- Urdu root page `i18n/ur/docusaurus-plugin-content-docs/current/intro.md` → `/ur/` (root) and `/ur/intro` in Urdu locale
- English module page `docs/modules/module-1-ros2-nervous-system/introduction.md` → `/modules/module-1-ros2-nervous-system/introduction` in English locale
- Urdu module page `i18n/ur/docusaurus-plugin-content-docs/current/modules/module-1-ros2-nervous-system/introduction.md` → `/ur/modules/module-1-ros2-nervous-system/introduction` in Urdu locale
- All internal links in Urdu content MUST use absolute paths with `/ur/` prefix (e.g., `/ur/modules/...` not `/modules/...`)

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| [e.g., 4th project] | [current need] | [why 3 projects insufficient] |
| [e.g., Repository pattern] | [specific problem] | [why direct DB access insufficient] |
