# Feature Specification: Urdu Language Support via Docusaurus i18n

**Feature Branch**: `014-urdu-i18n-support`  
**Created**: 2025-12-06  
**Status**: Draft  
**Input**: User description: "Add Urdu language support to the Physical AI Humanoid Robotics Textbook using Docusaurus i18n. Allow users to select between English and Urdu at the start of each chapter. Implement proper RTL (right-to-left) layout support for Urdu content."

## Clarifications

### Initial Questions to Resolve

- Q: Should Urdu translations be manually created or use automated translation tools initially? → A: Manual translations for quality, but can use translation tools as a starting point for review
- Q: Should code examples and technical terms remain in English in Urdu versions? → A: Code examples should remain in English, but technical terms can be transliterated with English in parentheses
- Q: How should we handle the embedding system for Urdu content? → A: Urdu content should be embedded separately in the vector database with language tags
- Q: Should the chatbot support Urdu queries? → A: This is out of scope for this feature, but the infrastructure should support future Urdu chatbot integration
- Q: Should all modules be translated at once or incrementally? → A: Incremental approach - start with Module 1, then expand to other modules

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Language Selection (Priority: P1)

As a Urdu-speaking student, I need to select Urdu as my preferred language at the start of each chapter so that I can read the textbook content in my native language.

**Why this priority**: This is the core functionality that enables Urdu-speaking users to access the textbook. Without this, the feature cannot be used.

**Independent Test**: Can be fully tested by navigating to any chapter, selecting Urdu from the language selector, and verifying the content displays in Urdu with proper RTL layout. This delivers accessible educational content for Urdu speakers.

**Acceptance Scenarios**:

1. **Given** a user visits any chapter page, **When** they view the page, **Then** a language selector is visible at the top of the content allowing them to choose between English and Urdu
2. **Given** a user selects Urdu from the language selector, **When** the page reloads, **Then** the content displays in Urdu with proper RTL (right-to-left) text direction
3. **Given** a user is viewing content in Urdu, **When** they navigate to another chapter, **Then** their language preference is maintained and the new chapter displays in Urdu
4. **Given** a user selects English from the language selector while viewing Urdu content, **When** the page reloads, **Then** the content switches back to English with LTR (left-to-right) layout

---

### User Story 2 - RTL Layout Support (Priority: P1)

As a Urdu-speaking user, I need the textbook content to display with proper right-to-left (RTL) text direction and layout so that the text is readable and natural in Urdu.

**Why this priority**: Urdu is a right-to-left language, and incorrect text direction makes content unreadable. This is essential for usability.

**Independent Test**: Can be fully tested by selecting Urdu language and verifying all text, navigation, and UI elements properly align to the right with RTL text flow. This delivers a native reading experience for Urdu speakers.

**Acceptance Scenarios**:

1. **Given** a user selects Urdu language, **When** the page displays, **Then** all text content flows from right to left with proper alignment
2. **Given** a user is viewing Urdu content, **When** they scroll through the page, **Then** navigation menus, sidebars, and UI elements are properly positioned for RTL layout
3. **Given** a user is viewing Urdu content, **When** they interact with code examples, **Then** code blocks remain in LTR (left-to-right) as code is language-agnostic
4. **Given** a user is viewing Urdu content, **When** they view images or diagrams, **Then** captions and labels are properly aligned for RTL reading

---

### User Story 3 - Content Translation Quality (Priority: P2)

As a Urdu-speaking student, I need the translated content to be accurate and maintain technical accuracy so that I can learn the concepts correctly.

**Why this priority**: Educational content requires high translation quality to ensure learning outcomes. Poor translations can lead to misunderstandings of technical concepts.

**Independent Test**: Can be fully tested by having native Urdu speakers review translated content and verify technical accuracy, readability, and educational value. This delivers high-quality educational content in Urdu.

**Acceptance Scenarios**:

1. **Given** a user reads Urdu-translated content, **When** they compare it with English content, **Then** the technical concepts and meaning are accurately preserved
2. **Given** a user reads Urdu content, **When** they encounter technical terms, **Then** terms are either properly translated or transliterated with English in parentheses for clarity
3. **Given** a user reads Urdu content, **When** they view code examples, **Then** code remains in English with Urdu comments/explanations where appropriate
4. **Given** a user reads Urdu content, **When** they follow learning objectives, **Then** the learning outcomes are clearly communicated in Urdu

---

### User Story 4 - Navigation and URL Structure (Priority: P2)

As a user, I need the URL structure to reflect my language choice so that I can bookmark, share, and navigate between English and Urdu versions of the same content.

**Why this priority**: Proper URL structure enables better user experience, SEO, and allows users to share language-specific links. This supports discoverability and usability.

**Independent Test**: Can be fully tested by navigating between English and Urdu versions and verifying URLs change appropriately (e.g., `/en/modules/...` vs `/ur/modules/...`). This delivers proper language-specific navigation and sharing.

**Acceptance Scenarios**:

1. **Given** a user is viewing English content at `/modules/module-1/...`, **When** they switch to Urdu, **Then** the URL changes to `/ur/modules/module-1/...`
2. **Given** a user shares a URL for Urdu content, **When** another user opens the link, **Then** the content displays in Urdu automatically
3. **Given** a user navigates between chapters in Urdu, **When** they use browser back/forward buttons, **Then** their language preference is maintained
4. **Given** a user bookmarks a page in Urdu, **When** they return to the bookmark, **Then** the page loads in Urdu

---

### Edge Cases

- What happens when a chapter doesn't have a Urdu translation yet? (Should show English with a notice, or redirect to English version)
- How should we handle mixed content (English code examples within Urdu text)?
- What happens if a user's browser language is set to Urdu but they haven't selected it? (Should auto-detect or default to English)
- How should we handle glossary terms that don't have direct Urdu translations?
- What happens when navigating from a translated chapter to an untranslated one?
- How should we handle images with embedded text in translations?
- What happens if a user switches languages mid-reading session?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST support English (en) and Urdu (ur) as available locales in Docusaurus configuration
- **FR-002**: System MUST configure Urdu locale with RTL (right-to-left) text direction in Docusaurus i18n settings
- **FR-003**: System MUST provide a locale dropdown selector in the navbar allowing users to switch between English and Urdu
- **FR-004**: System MUST maintain language preference across page navigation using URL-based locale routing (`/en/...` and `/ur/...`)
- **FR-005**: System MUST create Urdu translation files in the `i18n/ur/docusaurus-plugin-content-docs/current/` directory structure
- **FR-006**: System MUST translate all module content files (introduction.md, glossary.md, etc.) to Urdu
- **FR-007**: System MUST preserve code examples in English within Urdu-translated content (code blocks should not be translated)
- **FR-008**: System MUST handle technical terms appropriately (translate where possible, transliterate with English in parentheses where needed)
- **FR-009**: System MUST ensure proper RTL layout for all UI elements when Urdu is selected (navbar, sidebar, content, footer)
- **FR-010**: System MUST maintain consistent navigation structure between English and Urdu versions
- **FR-011**: System MUST preserve frontmatter metadata (id, title, sidebar_position, tags, learning_objectives) in Urdu translations
- **FR-012**: System MUST translate sidebar labels and navigation items to Urdu
- **FR-013**: System MUST handle images and diagrams appropriately (captions translated, embedded text handled)
- **FR-014**: System MUST provide fallback to English if a specific page doesn't have Urdu translation yet
- **FR-015**: System MUST ensure proper rendering of Urdu fonts and characters (Nastaliq script support)

### Non-Functional Requirements

- **NFR-001**: Translation quality MUST be reviewed by native Urdu speakers with technical knowledge
- **NFR-002**: RTL layout MUST be tested across different browsers (Chrome, Firefox, Safari, Edge)
- **NFR-003**: Page load performance MUST not degrade significantly when switching languages (target: <500ms additional load time)
- **NFR-004**: Urdu content MUST be properly indexed by search engines with appropriate language tags
- **NFR-005**: Build process MUST generate separate builds for English and Urdu locales

### Key Entities *(include if feature involves data)*

- **Locale**: Represents a language configuration (en: English, LTR; ur: Urdu, RTL)
- **TranslationFile**: Represents a translated markdown file in `i18n/ur/docusaurus-plugin-content-docs/current/` matching the structure of `docs/`
- **LocaleConfig**: Configuration object defining locale properties (label, direction, calendar, etc.)
- **ContentPage**: A page that exists in both English (`docs/...`) and Urdu (`i18n/ur/...`) versions
- **SidebarItem**: Navigation item that needs translation in both languages
- **TechnicalTerm**: A term that may need special handling (translation vs transliteration)

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Language selector is visible and functional on 100% of chapter pages
- **SC-002**: All Module 1 content is successfully translated to Urdu and accessible via `/ur/modules/module-1-ros2-nervous-system/`
- **SC-003**: RTL layout is properly applied to 100% of UI elements when Urdu is selected
- **SC-004**: Language preference persists across navigation for 100% of user sessions
- **SC-005**: Page load time increase when switching languages is under 500ms
- **SC-006**: Translation quality is validated by at least 2 native Urdu speakers with technical background
- **SC-007**: All code examples render correctly in both English and Urdu versions (code remains in English)
- **SC-008**: Navigation structure is consistent between English and Urdu versions
- **SC-009**: URLs properly reflect language choice (`/en/...` and `/ur/...` paths work correctly)
- **SC-010**: Build process successfully generates both English and Urdu versions of the site

## Implementation Approach

### Phase 1: Infrastructure Setup
1. Update `docusaurus.config.ts` to add Urdu locale with RTL configuration
2. Add locale dropdown to navbar
3. Create `i18n/ur/` directory structure
4. Test locale switching with placeholder content

### Phase 2: Content Translation (Incremental)
1. Start with Module 1: Introduction page
2. Translate Module 1: ROS 2 Fundamentals
3. Translate Module 1: Communication Patterns
4. Translate Module 1: Humanoid Applications
5. Translate Module 1: Workspace Overview
6. Translate Module 1: Glossary
7. Review and refine translations

### Phase 3: UI and Navigation Translation
1. Translate sidebar labels
2. Translate navbar items
3. Translate footer content
4. Translate page metadata (titles, descriptions)

### Phase 4: Testing and Refinement
1. Test RTL layout across browsers
2. Validate translation quality with native speakers
3. Test navigation and URL structure
4. Performance testing
5. SEO validation

## Technical Details

### Docusaurus i18n Configuration

```typescript
// docusaurus.config.ts updates needed:
i18n: {
  defaultLocale: 'en',
  locales: ['en', 'ur'],
  localeConfigs: {
    en: {
      label: 'English',
      direction: 'ltr',
      htmlLang: 'en-US',
    },
    ur: {
      label: 'اردو',
      direction: 'rtl',
      htmlLang: 'ur',
      calendar: 'gregory',
    },
  },
},
```

### Directory Structure

```
i18n/
└── ur/
    └── docusaurus-plugin-content-docs/
        └── current/
            ├── intro.md
            └── modules/
                └── module-1-ros2-nervous-system/
                    ├── index.md
                    ├── introduction.md
                    ├── ros2-fundamentals.md
                    ├── communication-patterns.md
                    ├── humanoid-applications.md
                    ├── workspace-overview.md
                    └── glossary.md
```

### Navbar Configuration

```typescript
navbar: {
  items: [
    // ... existing items
    {
      type: 'localeDropdown',
      position: 'right',
      dropdownItemsAfter: true,
    },
  ],
},
```

## Assumptions

1. **Translation Quality**: Manual translations will be provided or reviewed by qualified translators
2. **Incremental Rollout**: Not all modules need to be translated immediately - can start with Module 1
3. **Code Examples**: Code examples will remain in English in both versions
4. **Technical Terms**: Technical terms can be transliterated with English in parentheses for clarity
5. **Browser Support**: Modern browsers support RTL layout properly
6. **Font Support**: System fonts or web fonts will properly render Urdu Nastaliq script
7. **Build Process**: Docusaurus build process will handle both locales correctly
8. **SEO**: Search engines will properly index both language versions

## Dependencies

### External Dependencies
- Docusaurus i18n plugin (built-in, no additional packages needed)
- Urdu language support in browsers (standard Unicode support)
- RTL CSS support (handled by Docusaurus)

### Internal Dependencies
- Existing English content in `docs/` directory
- Existing Docusaurus configuration
- Existing sidebar configuration
- Existing module structure

### Translation Dependencies
- Access to Urdu translators or translation tools
- Review process for translation quality
- Technical knowledge for accurate translations

## Out of Scope

1. **Automated Translation**: Not implementing automated translation APIs (Google Translate, etc.) - manual translations only
2. **Chatbot Urdu Support**: Not implementing Urdu language support in the chatbot (separate feature)
3. **Vector Database Urdu Embeddings**: Not implementing separate embeddings for Urdu content in this phase (future enhancement)
4. **Additional Languages**: Not adding more languages beyond Urdu in this feature
5. **Translation Management System**: Not implementing a CMS or translation management tool
6. **Audio/Video Translations**: Not translating embedded audio or video content
7. **Interactive Elements Translation**: Not translating interactive code playgrounds or embedded applications
8. **All Modules at Once**: Not requiring all modules to be translated before launch - incremental approach

## Future Enhancements

1. **Chatbot Urdu Support**: Extend chatbot to understand and respond in Urdu
2. **Urdu Content Embeddings**: Create separate vector database collections for Urdu content
3. **Additional Languages**: Add support for more languages (Arabic, Hindi, etc.)
4. **Translation Management**: Implement a translation workflow and review system
5. **Auto-detection**: Auto-detect user's browser language and suggest Urdu if applicable
6. **Translation Progress Indicator**: Show which modules/pages are available in Urdu

## Notes

- Urdu uses the Nastaliq script which may require specific font considerations
- RTL layout affects not just text but also UI elements (buttons, menus, etc.)
- Code examples should remain in English but comments can be translated
- Technical diagrams may need Urdu labels/captions
- Consider cultural context when translating examples and analogies
- Maintain consistency in technical term translations across all modules

