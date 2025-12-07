# Research: Urdu Language Support via i18n

**Feature**: 014-urdu-i18n-support  
**Date**: 2025-12-06  
**Status**: Complete

## Research Objectives

1. Docusaurus i18n configuration for RTL languages (Urdu)
2. Urdu font rendering and Nastaliq script support
3. Technical term translation strategies for educational content
4. Translation workflow and quality assurance best practices

## Findings

### 1. Docusaurus i18n Configuration for RTL Languages

**Decision**: Use Docusaurus built-in i18n plugin with RTL locale configuration

**Rationale**: 
- Docusaurus 3.9.2 has native i18n support with built-in RTL handling
- The `localeConfigs` option allows specifying `direction: 'rtl'` for Urdu locale
- No additional plugins or dependencies required
- Automatic URL routing (`/en/...` vs `/ur/...`) handled by Docusaurus

**Alternatives Considered**:
- Custom RTL CSS solution: Rejected - Docusaurus built-in support is more maintainable and handles all UI elements automatically
- Third-party i18n libraries: Rejected - Docusaurus i18n is integrated and optimized for static site generation

**Implementation Notes**:
- Configure `i18n.localeConfigs.ur.direction: 'rtl'` in `docusaurus.config.ts`
- Add `localeDropdown` to navbar items for language switching
- Translation files must follow exact directory structure: `i18n/ur/docusaurus-plugin-content-docs/current/`

### 2. Urdu Font Rendering and Nastaliq Script Support

**Decision**: Use system fonts with web font fallback for Urdu Nastaliq script

**Rationale**:
- Modern browsers (Chrome, Firefox, Safari, Edge) have good Unicode support for Urdu
- System fonts (Windows: Nastalique, macOS: Noto Nastaliq Urdu) provide good default rendering
- Web fonts can be added if needed for consistency across platforms
- Docusaurus handles font loading automatically for RTL content

**Alternatives Considered**:
- Custom font loading: Rejected - System fonts are sufficient for initial implementation, can add web fonts later if needed
- Font subsetting: Deferred - Not needed initially, can optimize later if bundle size becomes an issue

**Implementation Notes**:
- No additional font configuration required initially
- Can add web fonts (e.g., Noto Nastaliq Urdu) via `src/css/custom.css` if cross-platform consistency needed
- Test font rendering across target browsers (Chrome, Firefox, Safari, Edge)

### 3. Technical Term Translation Strategies

**Decision**: Maintain shared glossary/term bank with translation and transliteration guidelines

**Rationale**:
- Educational content requires consistency in technical terminology
- Shared glossary ensures same terms translated/transliterated consistently across all files
- English in parentheses provides clarity for technical terms (e.g., "ROS 2 (روبوٹک آپریٹنگ سسٹم)")
- Allows translators to reference established translations

**Alternatives Considered**:
- Context-based translation: Rejected - Leads to inconsistency, especially for technical terms
- Automated translation tools: Rejected - Spec explicitly requires manual translations for quality

**Implementation Notes**:
- Create `translations/glossary/technical-terms.json` with structure:
  ```json
  {
    "term": "English term",
    "urdu_translation": "اردو ترجمہ",
    "urdu_transliteration": "اردو نقل حرفی",
    "usage": "translation|transliteration|both",
    "notes": "Usage guidelines"
  }
  ```
- Glossary must be consulted and updated during each file translation
- Review process validates glossary usage and consistency

### 4. Translation Workflow and Quality Assurance

**Decision**: One file at a time per chapter, with chapter-level quality review

**Rationale**:
- Incremental approach allows early feedback and course correction
- Chapter-level review enables context-aware quality assessment
- Maintains translation consistency within chapters
- Allows parallel work on different chapters if multiple translators available

**Alternatives Considered**:
- File-level review: Rejected - Too granular, slows workflow without significant quality benefit
- Module-level review: Rejected - Too large, delays feedback and makes corrections harder
- Batch review: Rejected - Chapter-level provides better context than arbitrary batches

**Implementation Notes**:
- Translation workflow: Translate files sequentially within a chapter
- Quality review: Conduct after all files in chapter are translated
- Review checklist: Technical accuracy, terminology consistency, readability, RTL formatting
- Reviewers: Minimum 2 native Urdu speakers with technical background (per NFR-001)

## Technical Decisions Summary

| Decision Area | Decision | Rationale |
|--------------|----------|-----------|
| i18n Framework | Docusaurus built-in i18n | Native support, no additional dependencies |
| RTL Support | Docusaurus localeConfigs | Built-in RTL handling for all UI elements |
| Font Strategy | System fonts with web font fallback | Good browser support, can enhance later |
| Translation Strategy | Shared glossary/term bank | Ensures consistency for educational content |
| Review Process | Chapter-level after all files translated | Balances quality and workflow efficiency |

## Open Questions Resolved

- ✅ **Q: How to handle RTL layout?** → A: Docusaurus `localeConfigs.ur.direction: 'rtl'` handles automatically
- ✅ **Q: Font support for Nastaliq?** → A: System fonts sufficient, web fonts optional enhancement
- ✅ **Q: Technical term consistency?** → A: Shared glossary/term bank with mandatory consultation
- ✅ **Q: Review timing?** → A: Chapter-level review after all files in chapter translated

## References

- [Docusaurus i18n Documentation](https://docusaurus.io/docs/i18n/introduction)
- [Docusaurus RTL Support](https://docusaurus.io/docs/i18n/i18n-routing#rtl-support)
- [Unicode Urdu Support](https://www.unicode.org/charts/PDF/U0600.pdf)
- Best practices for technical translation in educational content

