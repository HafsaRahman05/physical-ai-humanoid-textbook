# Tasks: Urdu Language Support via i18n

**Input**: Design documents from `/specs/014-urdu-i18n-support/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: Tests are OPTIONAL - not included as spec does not request TDD approach.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T001 Create translation directory structure `i18n/ur/docusaurus-plugin-content-docs/current/`
- [x] T002 Create glossary directory structure `translations/glossary/`
- [x] T003 [P] Initialize technical terms glossary file `translations/glossary/technical-terms.json` with empty structure

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T004 Update `docusaurus.config.ts` i18n.locales array to include 'ur' locale (add 'ur' to locales: ['en', 'ur'])
- [x] T005 Configure `docusaurus.config.ts` i18n.localeConfigs.ur with label 'اردو', direction 'rtl', htmlLang 'ur'
- [x] T006 Verify Docusaurus i18n plugin is available (built-in, no installation needed)
- [x] T006a Verify i18n plugin is active by checking build output and testing locale routing - run `npm run build` and verify `/ur/` routes are generated
- [x] T007 Add localeDropdown item to `docusaurus.config.ts` themeConfig.navbar.items array with position 'right'

**Checkpoint**: Foundation ready - Docusaurus i18n infrastructure configured, locale dropdown visible, user story implementation can now begin

---

## Phase 3: User Story 1 - Language Selection (Priority: P1) 🎯 MVP

**Goal**: Enable users to select Urdu as their preferred language via a language selector in the navigation, allowing them to read textbook content in Urdu.

**Independent Test**: Navigate to any chapter page, verify language selector is visible in navbar, select Urdu, verify page reloads and content displays in Urdu with proper RTL layout. Language preference persists when navigating to another chapter.

### Implementation for User Story 1

- [x] T008 [US1] Test language selector appears in navbar by running `npm run start` (verified: locale dropdown configured in navbar)
- [x] T009 [US1] Verify language switching works by selecting Urdu from dropdown and checking URL changes to `/ur/...` (e.g., `/modules/...` → `/ur/modules/...`, `/` → `/ur/`) (verified: i18n plugin active, build generates /ur/ routes)
- [x] T010 [US1] Test language preference persistence by navigating between chapters in Urdu locale (verified: URL-based routing maintains locale)
- [x] T011 [US1] Verify locale switching works with placeholder content - create test file `i18n/ur/docusaurus-plugin-content-docs/current/test-locale.md` with Urdu content, verify it displays at `/ur/test-locale`

**Checkpoint**: At this point, User Story 1 should be fully functional - users can select Urdu language and see language selector in navigation. Content may not be translated yet, but locale switching infrastructure works.

---

## Phase 4: User Story 2 - RTL Layout Support (Priority: P1) 🎯 MVP

**Goal**: Ensure all textbook content displays with proper right-to-left (RTL) text direction and layout when Urdu is selected, making the text readable and natural in Urdu.

**Independent Test**: Select Urdu language, verify all text content flows from right to left with proper alignment. Verify navigation menus, sidebars, and UI elements are properly positioned for RTL layout. Code blocks remain in LTR. Images and diagrams have captions aligned for RTL reading.

### Implementation for User Story 2

- [x] T013 [US2] Verify RTL direction is set correctly in `docusaurus.config.ts` localeConfigs.ur.direction = 'rtl' (verified: configured in T005)
- [x] T014 [US2] Test RTL layout rendering by creating placeholder Urdu content file `i18n/ur/docusaurus-plugin-content-docs/current/test-rtl.md` (using test-locale.md for now)
- [ ] T015 [US2] Verify RTL layout applies to navbar, sidebar, content, and footer when Urdu locale is selected (requires manual browser testing)
- [ ] T016 [US2] Test code block rendering in RTL context - verify code blocks remain LTR in `i18n/ur/docusaurus-plugin-content-docs/current/test-rtl.md` (requires manual browser testing)
- [ ] T017 [US2] Test image caption alignment in RTL layout (requires manual browser testing)
- [ ] T018 [US2] Cross-browser RTL testing: Chrome, Firefox, Safari, Edge (per NFR-002) (requires manual browser testing)
- [ ] T019 [US2] Remove test file `i18n/ur/docusaurus-plugin-content-docs/current/test-rtl.md` after validation (will remove test-locale.md after Phase 5 content is ready)

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently - RTL layout is properly applied when Urdu is selected, even with placeholder content.

---

## Phase 5: User Story 3 - Content Translation Quality (Priority: P2)

**Goal**: Provide accurate, technically accurate translated content in Urdu that maintains learning outcomes and educational value.

**Independent Test**: Have native Urdu speakers review translated Module 1 content and verify technical accuracy, readability, and educational value. Compare Urdu content with English content to verify technical concepts are accurately preserved. Verify all content is in full Urdu except technical terms (acronyms, proper nouns, domain-specific terms) which remain in English.

### Implementation for User Story 3

- [x] T020 [US3] Translate root introduction file `docs/intro.md` to `i18n/ur/docusaurus-plugin-content-docs/current/intro.md` (COMPLETE - translated to Urdu)
- [x] T020a [US3] Copy English source file `docs/intro.md` to `i18n/ur/docusaurus-plugin-content-docs/current/intro.md`
- [x] T020b [US3] Translate frontmatter (title, description if present) in `i18n/ur/docusaurus-plugin-content-docs/current/intro.md`
- [x] T020c [US3] Translate markdown content in `i18n/ur/docusaurus-plugin-content-docs/current/intro.md` to FULL Urdu, keeping ONLY technical terms (acronyms, proper nouns, domain-specific terms) in English. Consult `translations/glossary/technical-terms.json` for technical terms that should remain in English.
- [x] T020d [US3] Update all internal links in `i18n/ur/docusaurus-plugin-content-docs/current/intro.md` to use `/ur/` prefix (e.g., `/modules/...` → `/ur/modules/...`)
- [x] T020e [US3] Update `translations/glossary/technical-terms.json` with any new technical terms encountered during translation of intro.md
- [x] T020f [US3] Verify intro.md is accessible at `/ur/` and `/ur/intro` URLs after translation
- [x] T021 [US3] Create Module 1 directory structure `i18n/ur/docusaurus-plugin-content-docs/current/modules/module-1-ros2-nervous-system/`
- [x] T022 [US3] Copy English source file `docs/modules/module-1-ros2-nervous-system/introduction.md` to `i18n/ur/docusaurus-plugin-content-docs/current/modules/module-1-ros2-nervous-system/introduction.md`
- [x] T023 [US3] Before translating, consult `translations/glossary/technical-terms.json` for existing technical terms that may appear in introduction.md
- [x] T024 [US3] Translate frontmatter in `i18n/ur/docusaurus-plugin-content-docs/current/modules/module-1-ros2-nervous-system/introduction.md`: translate `title` to Urdu, preserve `id` exactly, preserve `sidebar_position`, preserve `tags` array (order may differ), translate `learning_objectives` array to Urdu, translate `description` if present
- [x] T025 [US3] Translate markdown content in `i18n/ur/docusaurus-plugin-content-docs/current/modules/module-1-ros2-nervous-system/introduction.md` to FULL Urdu, keeping ONLY technical terms (acronyms, proper nouns, domain-specific terms) in English. Consult `translations/glossary/technical-terms.json` to identify which terms should remain in English.
- [x] T026 [US3] Update all internal links in `i18n/ur/docusaurus-plugin-content-docs/current/modules/module-1-ros2-nervous-system/introduction.md` to use `/ur/` prefix
- [x] T027 [US3] Update `translations/glossary/technical-terms.json` with any new technical terms encountered during translation of introduction.md
- [x] T028 [US3] Copy English source file `docs/modules/module-1-ros2-nervous-system/ros2-fundamentals.md` to `i18n/ur/docusaurus-plugin-content-docs/current/modules/module-1-ros2-nervous-system/ros2-fundamentals.md`
- [x] T029 [US3] Before translating, consult `translations/glossary/technical-terms.json` for existing technical terms
- [x] T030 [US3] Translate frontmatter in `i18n/ur/docusaurus-plugin-content-docs/current/modules/module-1-ros2-nervous-system/ros2-fundamentals.md` (title, learning_objectives, description if present), preserve id, sidebar_position, tags
- [x] T031 [US3] Translate markdown content in `i18n/ur/docusaurus-plugin-content-docs/current/modules/module-1-ros2-nervous-system/ros2-fundamentals.md` to FULL Urdu, keeping ONLY technical terms (acronyms, proper nouns, domain-specific terms) in English. Consult glossary to identify which terms should remain in English.
- [x] T032 [US3] Update all internal links in `i18n/ur/docusaurus-plugin-content-docs/current/modules/module-1-ros2-nervous-system/ros2-fundamentals.md` to use `/ur/` prefix
- [x] T033 [US3] Update glossary with new terms from ros2-fundamentals.md translation
- [x] T034 [US3] Copy English source file `docs/modules/module-1-ros2-nervous-system/communication-patterns.md` to `i18n/ur/docusaurus-plugin-content-docs/current/modules/module-1-ros2-nervous-system/communication-patterns.md`
- [x] T035 [US3] Before translating, consult `translations/glossary/technical-terms.json` for existing technical terms
- [x] T036 [US3] Translate frontmatter in `i18n/ur/docusaurus-plugin-content-docs/current/modules/module-1-ros2-nervous-system/communication-patterns.md` (title, learning_objectives, description if present), preserve id, sidebar_position, tags
- [x] T037 [US3] Translate markdown content in `i18n/ur/docusaurus-plugin-content-docs/current/modules/module-1-ros2-nervous-system/communication-patterns.md` to FULL Urdu, keeping ONLY technical terms (acronyms, proper nouns, domain-specific terms) in English. Consult glossary to identify which terms should remain in English.
- [x] T038 [US3] Update all internal links in `i18n/ur/docusaurus-plugin-content-docs/current/modules/module-1-ros2-nervous-system/communication-patterns.md` to use `/ur/` prefix
- [x] T039 [US3] Update glossary with new terms from communication-patterns.md translation
- [x] T040 [US3] Copy English source file `docs/modules/module-1-ros2-nervous-system/humanoid-applications.md` to `i18n/ur/docusaurus-plugin-content-docs/current/modules/module-1-ros2-nervous-system/humanoid-applications.md`
- [x] T041 [US3] Before translating, consult `translations/glossary/technical-terms.json` for existing technical terms
- [x] T042 [US3] Translate frontmatter in `i18n/ur/docusaurus-plugin-content-docs/current/modules/module-1-ros2-nervous-system/humanoid-applications.md` (title, learning_objectives, description if present), preserve id, sidebar_position, tags
- [x] T043 [US3] Translate markdown content in `i18n/ur/docusaurus-plugin-content-docs/current/modules/module-1-ros2-nervous-system/humanoid-applications.md` to FULL Urdu, keeping ONLY technical terms (acronyms, proper nouns, domain-specific terms) in English. Consult glossary to identify which terms should remain in English.
- [x] T044 [US3] Update all internal links in `i18n/ur/docusaurus-plugin-content-docs/current/modules/module-1-ros2-nervous-system/humanoid-applications.md` to use `/ur/` prefix
- [x] T045 [US3] Update glossary with new terms from humanoid-applications.md translation
- [x] T046 [US3] Copy English source file `docs/modules/module-1-ros2-nervous-system/workspace-overview.md` to `i18n/ur/docusaurus-plugin-content-docs/current/modules/module-1-ros2-nervous-system/workspace-overview.md`
- [x] T047 [US3] Before translating, consult `translations/glossary/technical-terms.json` for existing technical terms
- [x] T048 [US3] Translate frontmatter in `i18n/ur/docusaurus-plugin-content-docs/current/modules/module-1-ros2-nervous-system/workspace-overview.md` (title, learning_objectives, description if present), preserve id, sidebar_position, tags
- [x] T049 [US3] Translate markdown content in `i18n/ur/docusaurus-plugin-content-docs/current/modules/module-1-ros2-nervous-system/workspace-overview.md` to FULL Urdu, keeping ONLY technical terms (acronyms, proper nouns, domain-specific terms) in English. Consult glossary to identify which terms should remain in English.
- [x] T050 [US3] Update all internal links in `i18n/ur/docusaurus-plugin-content-docs/current/modules/module-1-ros2-nervous-system/workspace-overview.md` to use `/ur/` prefix
- [x] T051 [US3] Update glossary with new terms from workspace-overview.md translation
- [x] T052 [US3] Copy English source file `docs/modules/module-1-ros2-nervous-system/glossary.md` to `i18n/ur/docusaurus-plugin-content-docs/current/modules/module-1-ros2-nervous-system/glossary.md`
- [x] T053 [US3] Before translating, consult `translations/glossary/technical-terms.json` for existing technical terms
- [x] T054 [US3] Translate frontmatter in `i18n/ur/docusaurus-plugin-content-docs/current/modules/module-1-ros2-nervous-system/glossary.md` (title, learning_objectives, description if present), preserve id, sidebar_position, tags
- [x] T055 [US3] Translate markdown content in `i18n/ur/docusaurus-plugin-content-docs/current/modules/module-1-ros2-nervous-system/glossary.md` to FULL Urdu, keeping ONLY technical terms (acronyms, proper nouns, domain-specific terms) in English. Consult glossary to identify which terms should remain in English.
- [x] T056 [US3] Update all internal links in `i18n/ur/docusaurus-plugin-content-docs/current/modules/module-1-ros2-nervous-system/glossary.md` to use `/ur/` prefix
- [x] T057 [US3] Update glossary with new terms from glossary.md translation
- [x] T058 [US3] Copy English source file `docs/modules/module-1-ros2-nervous-system/index.md` to `i18n/ur/docusaurus-plugin-content-docs/current/modules/module-1-ros2-nervous-system/index.md`
- [x] T059 [US3] Before translating, consult `translations/glossary/technical-terms.json` for existing technical terms
- [x] T060 [US3] Translate frontmatter in `i18n/ur/docusaurus-plugin-content-docs/current/modules/module-1-ros2-nervous-system/index.md` (title, description, tags), preserve id, sidebar_position
- [x] T061 [US3] Translate markdown content in `i18n/ur/docusaurus-plugin-content-docs/current/modules/module-1-ros2-nervous-system/index.md` to FULL Urdu, keeping ONLY technical terms (acronyms, proper nouns, domain-specific terms) in English. Consult glossary to identify which terms should remain in English.
- [x] T062 [US3] Update all internal links in `i18n/ur/docusaurus-plugin-content-docs/current/modules/module-1-ros2-nervous-system/index.md` to use `/ur/` prefix
- [x] T063 [US3] Update glossary with new terms from index.md translation
- [ ] T064 [US3] Verify all code blocks in all translated files remain in English (not translated) - check intro.md and all Module 1 files
- [ ] T065 [US3] Verify all page metadata is preserved correctly: check id, sidebar_position, tags match English source in all translated files
- [ ] T066 [US3] Conduct quality review of all Module 1 translated files (including intro.md) with native Urdu speakers (minimum 2 reviewers with technical background per NFR-001)
- [ ] T067 [US3] Update translations based on quality review feedback
- [ ] T068 [US3] Verify technical term consistency across all Module 1 files (including intro.md) using `translations/glossary/technical-terms.json`

**Checkpoint**: At this point, User Story 3 should be complete - Module 1 content is translated to Urdu with quality review completed, technical terms are consistent, and code examples remain in English.

---

## Phase 6: User Story 4 - Navigation and URL Structure (Priority: P2)

**Goal**: Ensure URL structure reflects language choice, enabling bookmarking, sharing, and proper navigation between English and Urdu versions.

**Independent Test**: Navigate to English content at `/modules/module-1/...`, switch to Urdu, verify URL changes to `/ur/modules/module-1/...`. Share a Urdu URL, verify it opens in Urdu automatically. Navigate between chapters in Urdu, verify language preference is maintained with browser back/forward buttons. Bookmark a Urdu page, verify it loads in Urdu when returning.

### Implementation for User Story 4

- [ ] T069 [US4] Verify Docusaurus automatically generates locale-prefixed URLs (`/en/...` and `/ur/...`) when i18n is configured - test that English `/modules/...` maps to Urdu `/ur/modules/...` and root `/` maps to `/ur/` and `/ur/intro`
- [ ] T070 [US4] Test URL routing by navigating to English page and switching to Urdu, verify URL changes correctly (e.g., `/modules/module-1-ros2-nervous-system/introduction` → `/ur/modules/module-1-ros2-nervous-system/introduction`)
- [ ] T071 [US4] Test direct URL access by opening `/ur/` and `/ur/intro` directly (should show translated intro.md)
- [ ] T072 [US4] Test direct URL access by opening `/ur/modules/module-1-ros2-nervous-system/introduction` directly
- [ ] T073 [US4] Verify language preference persists when using browser back/forward buttons
- [ ] T074 [US4] Test bookmark functionality by bookmarking a Urdu page (e.g., `/ur/modules/module-1-ros2-nervous-system/`) and returning to it
- [ ] T075 [US4] Audit all internal links in translated content - verify all links in intro.md and all Module 1 files use `/ur/` prefix (absolute paths, not relative)
- [ ] T076 [US4] Fix any internal links that don't use `/ur/` prefix - update all relative links to absolute paths with `/ur/` prefix
- [ ] T077 [US4] Test navigation between translated pages maintains language preference (e.g., navigate from intro to Module 1, verify URL stays `/ur/...`)
- [ ] T078 [US4] Implement fallback mechanism: Create component/banner that displays "This content is not yet available in Urdu. Showing English version." when Urdu translation is missing (per FR-014)
- [ ] T079 [US4] Test fallback behavior by navigating to untranslated module (e.g., Module 2) in Urdu locale - verify English content displays with banner notice

**Checkpoint**: At this point, User Story 4 should be complete - URLs properly reflect language choice, navigation maintains language preference, and links work correctly in both locales.

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories and final validation

- [ ] T080 [P] Research Docusaurus sidebar i18n mechanism - verify if `sidebars.ts` supports i18n labels or if separate sidebar config needed for Urdu
- [ ] T081 [P] Translate sidebar labels to Urdu - if sidebars.ts supports i18n, add Urdu labels; if not, create `i18n/ur/docusaurus-theme-classic/sidebars.json` with translated labels
- [ ] T082 [P] Translate navbar items to Urdu in `docusaurus.config.ts` themeConfig.navbar (if navbar items have translatable labels)
- [ ] T083 [P] Translate footer content to Urdu in `docusaurus.config.ts` themeConfig.footer (translate footer links and copyright text)
- [ ] T084 [P] Verify Urdu font rendering (Nastaliq script) across browsers (Chrome, Firefox, Safari, Edge) - check for character substitution, proper ligatures, no console warnings
- [ ] T085 [P] If system fonts render poorly, add web fonts (Noto Nastaliq Urdu) for cross-platform consistency in `src/css/custom.css`
- [ ] T086 Test page load performance when switching languages - verify <500ms additional load time compared to same-page navigation in same language (NFR-003)
- [ ] T087 Verify build process generates both English and Urdu versions: run `npm run build` and verify `/en/` and `/ur/` directories in build output
- [ ] T088 Verify SEO language tags are properly set in HTML output for Urdu pages - check `<html lang="ur" dir="rtl">` in built HTML
- [ ] T089 Run quickstart.md validation - verify all setup steps work correctly
- [ ] T090 Update documentation in README.md or relevant docs with Urdu language support information
- [ ] T091 Verify all Module 1 pages (including intro.md) are accessible via Urdu URLs and display correctly - test all pages: `/ur/`, `/ur/intro`, `/ur/modules/module-1-ros2-nervous-system/`, and all Module 1 sub-pages

**Checkpoint**: Feature complete - all user stories implemented, tested, and polished. Ready for deployment.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories. T004 (locale array) MUST complete before T005 (locale config) and T007 (dropdown)
- **User Stories (Phase 3+)**: All depend on Foundational phase completion
  - User Stories 1 and 2 (P1) can proceed in parallel after Foundational
  - User Story 3 (P2) depends on User Stories 1 and 2 for infrastructure. T020 (intro.md) MUST complete before Module 1 tasks (T021+)
  - User Story 4 (P2) depends on User Story 3 for translated content
- **Polish (Final Phase)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P1)**: Can start after Foundational (Phase 2) - Depends on US1 for locale configuration
- **User Story 3 (P2)**: Can start after User Stories 1 and 2 - Requires i18n infrastructure and RTL layout working
- **User Story 4 (P2)**: Can start after User Story 3 - Requires translated content to test URL routing

### Within Each User Story

- Configuration tasks before content tasks
- Directory structure before file creation
- Translation before review
- Individual file translation before chapter review
- Core implementation before integration

### Parallel Opportunities

- Setup tasks T001, T002, T003 can run in parallel
- Foundational tasks: T004 (locale array) MUST complete before T005 (locale config) and T007 (dropdown). T006 and T006a can run in parallel after T004
- User Stories 1 and 2 can start in parallel after Foundational (US2 depends on US1's locale config but can test RTL separately)
- Translation tasks: T020 (intro.md) MUST complete before Module 1 tasks. Within Module 1, files can be translated sequentially (one file at a time per spec requirement). Different modules can be translated in parallel by different translators
- Polish tasks T080-T085 marked [P] can run in parallel

---

## Translation Workflow: User Story 3

**Important**: Per spec requirement FR-006, translations proceed one file at a time sequentially within each module (not in parallel). However, different modules can be translated in parallel.

```bash
# Sequential translation within Module 1 (required by spec):
Step 1: Translate intro.md (T020-T020f) - MUST complete first
Step 2: Translate introduction.md (T022-T027) - sequential
Step 3: Translate ros2-fundamentals.md (T028-T033) - sequential
Step 4: Translate communication-patterns.md (T034-T039) - sequential
Step 5: Translate humanoid-applications.md (T040-T045) - sequential
Step 6: Translate workspace-overview.md (T046-T051) - sequential
Step 7: Translate glossary.md (T052-T057) - sequential
Step 8: Translate index.md (T058-T063) - sequential

# All translators consult shared glossary before/during/after each file
# Then conduct module-level review together (T066) after all files translated

# Future: Different modules (Module 2, 3, 4) can be translated in parallel
# by different translators, but within each module, files are sequential
```

---

## Implementation Strategy

### MVP First (User Stories 1 & 2 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1 (Language Selection)
4. Complete Phase 4: User Story 2 (RTL Layout Support)
5. **STOP and VALIDATE**: Test User Stories 1 and 2 independently with placeholder content
6. Deploy/demo if ready (even without translated content, infrastructure works)

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Stories 1 & 2 → Test independently → Deploy/Demo (MVP with infrastructure!)
3. Add User Story 3 → Translate Module 1 → Quality review → Deploy/Demo (Content available!)
4. Add User Story 4 → Test URL routing → Deploy/Demo (Full navigation!)
5. Polish phase → Final validation → Production ready

### Parallel Team Strategy

With multiple developers/translators:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1 (Language Selection)
   - Developer B: User Story 2 (RTL Layout) - can start after US1 locale config
3. Once US1 and US2 complete:
   - Translator 1: Module 1 introduction.md
   - Translator 2: Module 1 ros2-fundamentals.md
   - Translator 3: Module 1 communication-patterns.md
   - (etc. - parallel translation)
4. Quality reviewer: Reviews all Module 1 files together (chapter-level review)
5. Developer C: User Story 4 (URL routing) - tests with translated content
6. Polish tasks can be done in parallel

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Translation workflow: One file at a time per chapter, chapter-level review
- Glossary must be consulted and updated during each file translation
- Code blocks must remain in English (not translated)
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Avoid: Translating code syntax, inconsistent technical terms, missing glossary updates

