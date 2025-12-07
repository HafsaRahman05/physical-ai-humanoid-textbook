# Feature Specification: Urdu Language Support via i18n

**Feature Branch**: `014-urdu-i18n-support`  
**Created**: 2025-12-06  
**Status**: Draft  
**Input**: User description: "Add Urdu language support to the Physical AI Humanoid Robotics Textbook using Docusaurus i18n. Allow users to select between English and Urdu at the start of each chapter. Implement proper RTL (right-to-left) layout support for Urdu content."

## Clarifications

### Session 2025-12-06

- Q: Should translations proceed one file at a time within each chapter, completing and reviewing each file before moving to the next? → A: One file at a time, per chapter - translate files sequentially within each chapter
- Q: Should each translated file be reviewed for quality before proceeding to the next file, or can multiple files be reviewed together? → A: Review per chapter - translate all files in a chapter, then review the entire chapter together
- Q: Should a shared glossary or term bank be maintained and referenced during translation to ensure technical terms are translated consistently across all files? → A: Maintain a shared glossary/term bank - create and maintain a reference glossary of technical terms and their Urdu translations/transliterations, which must be consulted and updated during each file translation

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
2. **Given** a user reads Urdu content, **When** they encounter technical terms, **Then** technical terms remain in English (e.g., "ROS 2", "Python", "topic") while all surrounding content is in full Urdu
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

- **Untranslated Content**: When a module/page doesn't have a Urdu translation yet, show English content with persistent banner notice: "This content is not yet available in Urdu. Showing English version." (per FR-014)
- **Mixed Content**: English code examples within Urdu text are handled per FR-007 - code blocks remain in English, code comments may be translated to Urdu
- **Browser Language Detection**: If user's browser language is set to Urdu but they haven't selected it, default to English. Auto-detection is out of scope for this feature (future enhancement)
- **Glossary Terms Without Direct Translations**: Use transliteration with English term in parentheses (e.g., "ROS 2 (روبوٹک آپریٹنگ سسٹم)") per FR-008
- **Navigating to Untranslated Content**: When navigating from translated module to untranslated one, show English content with banner notice. Language preference (URL locale) is maintained, but content falls back to English
- **Images with Embedded Text**: Handle per FR-013 - either create Urdu versions of images or add translated captions explaining embedded text
- **Language Switching Mid-Session**: User can switch languages at any time via language selector. URL updates to reflect new locale, page reloads with selected language content (or English fallback if translation unavailable)

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST support English (en) and Urdu (ur) as available language options
- **FR-002**: System MUST configure Urdu language with RTL (right-to-left) text direction
- **FR-003**: System MUST provide a language selector in the navigation allowing users to switch between English and Urdu
- **FR-004**: System MUST maintain language preference across page navigation using URL-based language routing. English content at `/modules/...` MUST map to Urdu content at `/ur/modules/...`. Root page `docs/intro.md` MUST map to `/ur/` (root) and `/ur/intro` in Urdu locale. All internal links in Urdu content MUST use absolute paths with `/ur/` prefix.
- **FR-005**: System MUST create Urdu translation files matching the structure of English content files, including root-level files (e.g., `intro.md`) and module content files
- **FR-006**: System MUST translate Module 1 content files (introduction, glossary, index, etc.) to Urdu initially (MVP scope), proceeding one file at a time sequentially within each module, translating all files in a module before conducting quality review of the entire module together. Additional modules (2, 3, 4) may be translated incrementally in future phases.
- **FR-007**: System MUST preserve code examples in English within Urdu-translated content (code blocks should not be translated)
- **FR-008**: System MUST translate all content to full Urdu, keeping ONLY technical terms in English (no English in parentheses). Technical terms that must remain in English include: acronyms (e.g., ROS 2, AI), proper nouns/brand names (e.g., Python, Docusaurus), and domain-specific terms that lack direct Urdu equivalents (e.g., "topic", "service", "action" in ROS 2 context). All other content MUST be fully translated to Urdu. Maintain a shared glossary/term bank of technical terms and their handling (English vs translated). Workflow: (1) Before translating each file, consult glossary for existing terms, (2) During translation, translate all content to Urdu except technical terms marked as "keep in English" in glossary, (3) After translation, update glossary with any new terms encountered, (4) Verify consistency across all files using glossary
- **FR-009**: System MUST ensure proper RTL layout for all UI elements when Urdu is selected (navigation, sidebar, content, footer)
- **FR-010**: System MUST maintain consistent navigation structure between English and Urdu versions
- **FR-011**: System MUST preserve page metadata in Urdu translations: `id` MUST match English source exactly, `title` MUST be translated to Urdu, `sidebar_position` MUST match English source, `tags` array MUST match English source (order may differ), `learning_objectives` array MUST be translated to Urdu, `description` (if present) MUST be translated to Urdu
- **FR-012**: System MUST translate sidebar labels and navigation items to Urdu
- **FR-013**: System MUST handle images and diagrams appropriately: image alt text and captions MUST be translated to Urdu, image paths remain unchanged (relative to file location), if images contain embedded English text, either create Urdu versions of images or add translated captions explaining the embedded text
- **FR-014**: System MUST provide fallback to English if a specific page doesn't have Urdu translation yet. Fallback behavior: Display English content with a persistent banner notice at the top of the page stating "This content is not yet available in Urdu. Showing English version." The banner MUST be visible on all pages that lack Urdu translations and MUST not interfere with content readability.
- **FR-015**: System MUST ensure proper rendering of Urdu fonts and characters (Nastaliq script support). Proper rendering criteria: Urdu text renders without character substitution, proper Nastaliq script display with correct ligatures, no font fallback warnings in browser console, consistent rendering across target browsers (Chrome, Firefox, Safari, Edge). If system fonts render poorly, web fonts (e.g., Noto Nastaliq Urdu) MUST be added via `src/css/custom.css`

### Non-Functional Requirements

- **NFR-001**: Translation quality MUST be reviewed by native Urdu speakers with technical knowledge, with review conducted per chapter after all files in that chapter have been translated
- **NFR-002**: RTL layout MUST be tested across different browsers (Chrome, Firefox, Safari, Edge)
- **NFR-003**: Page load performance MUST not degrade significantly when switching languages (target: <500ms additional load time)
- **NFR-004**: Urdu content MUST be properly indexed by search engines with appropriate language tags
- **NFR-005**: Build process MUST generate separate builds for English and Urdu language versions

### Key Entities *(include if feature involves data)*

- **Locale**: Represents a language configuration (en: English, LTR; ur: Urdu, RTL)
- **TranslationFile**: Represents a translated content file matching the structure of English content files
- **LocaleConfig**: Configuration object defining language properties (label, direction, calendar, etc.)
- **ContentPage**: A page that exists in both English and Urdu versions
- **SidebarItem**: Navigation item that needs translation in both languages
- **TechnicalTerm**: A term that may need special handling (translation vs transliteration), stored in a shared glossary/term bank for consistency across all translations
- **TermBank**: A shared reference glossary containing technical terms, their Urdu translations/transliterations, and usage guidelines, maintained and consulted during translation to ensure consistency

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Language selector is visible and functional on 100% of chapter pages
- **SC-002**: All Module 1 content is successfully translated to Urdu and accessible via Urdu language URLs
- **SC-003**: RTL layout is properly applied to 100% of UI elements when Urdu is selected
- **SC-004**: Language preference persists across navigation for 100% of user sessions
- **SC-005**: Page load time increase when switching languages is under 500ms
- **SC-006**: Translation quality is validated by at least 2 native Urdu speakers with technical background
- **SC-007**: All code examples render correctly in both English and Urdu versions (code remains in English)
- **SC-008**: Navigation structure is consistent between English and Urdu versions
- **SC-009**: URLs properly reflect language choice (English and Urdu paths work correctly)
- **SC-010**: Build process successfully generates both English and Urdu versions of the site

## Assumptions

1. **Translation Quality**: Manual translations will be provided or reviewed by qualified translators (minimum 2 native Urdu speakers with technical background per NFR-001)
2. **Incremental Rollout**: Module 1 is the MVP scope for this feature. Modules 2, 3, and 4 may be translated incrementally in future phases
3. **Translation Workflow**: Translations proceed one file at a time sequentially within each module (not in parallel), with all files in a module translated before conducting quality review of the entire module together. Different modules can be translated in parallel by different translators
4. **Code Examples**: Code examples will remain in English in both versions (per FR-007). Code comments may be translated to Urdu
5. **Technical Terms**: All content MUST be translated to full Urdu except technical terms (acronyms, proper nouns, domain-specific terms) which remain in English. No English text in parentheses - content should be fully in Urdu with only necessary technical terms in English. Consistency maintained through a shared glossary/term bank. Glossary consultation workflow: consult before translation, use during translation, update after translation (per FR-008)
6. **Browser Support**: Modern browsers (Chrome, Firefox, Safari, Edge) support RTL layout properly
7. **Font Support**: System fonts provide good default rendering for Urdu Nastaliq script. Web fonts (e.g., Noto Nastaliq Urdu) can be added if cross-platform consistency is needed
8. **Build Process**: Docusaurus build process will handle both language versions correctly, generating separate builds for `/en/` and `/ur/` routes
9. **SEO**: Search engines will properly index both language versions with appropriate language tags (per NFR-004)
10. **URL Routing**: Docusaurus i18n automatically handles URL routing - English content at `/modules/...` maps to Urdu at `/ur/modules/...`, root `docs/intro.md` maps to `/ur/` and `/ur/intro` in Urdu locale

## Dependencies

### External Dependencies
- i18n plugin support (built-in or available)
- Urdu language support in browsers (standard Unicode support)
- RTL CSS support

### Internal Dependencies
- Existing English content in content directory
- Existing site configuration
- Existing sidebar configuration
- Existing module structure

### Translation Dependencies
- Access to Urdu translators or translation tools
- Review process for translation quality
- Technical knowledge for accurate translations
- Shared glossary/term bank for technical term consistency

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
