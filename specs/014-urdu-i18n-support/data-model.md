# Data Model: Urdu Language Support via i18n

**Feature**: 014-urdu-i18n-support  
**Date**: 2025-12-06

## Overview

This feature primarily involves file-based content translation rather than traditional database entities. The data model consists of:
1. Configuration entities (Docusaurus i18n config)
2. Content file structure (markdown files)
3. Translation metadata (glossary/term bank)

## Entities

### Locale

Represents a language configuration in Docusaurus.

**Attributes**:
- `code` (string): ISO 639-1 language code (e.g., "en", "ur")
- `label` (string): Display name for the locale (e.g., "English", "اردو")
- `direction` (string): Text direction - "ltr" or "rtl"
- `htmlLang` (string): HTML lang attribute value (e.g., "en-US", "ur")
- `calendar` (string, optional): Calendar system (e.g., "gregory")

**Relationships**:
- One-to-many with `ContentPage` (each locale has multiple content pages)

**Validation Rules**:
- `code` must be valid ISO 639-1 code
- `direction` must be "ltr" or "rtl"
- `htmlLang` must be valid BCP 47 language tag

**State**: Static configuration, no state transitions

### LocaleConfig

Configuration object defining locale properties in Docusaurus config.

**Attributes**:
- `label` (string): Display name in the locale's language
- `direction` (string): "ltr" or "rtl"
- `htmlLang` (string): HTML lang attribute
- `calendar` (string, optional): Calendar system

**Relationships**:
- Part of `DocusaurusConfig.i18n.localeConfigs` object

**Validation Rules**:
- `direction` must match language's natural text direction
- For Urdu: `direction: "rtl"`, `htmlLang: "ur"`

### ContentPage

A page that exists in both English and Urdu versions.

**Attributes**:
- `id` (string): Unique identifier (matches between locales)
- `title` (string): Page title (translated per locale)
- `sidebar_position` (number): Position in sidebar (same across locales)
- `tags` (array<string>): Content tags (same across locales)
- `learning_objectives` (array<string>): Learning objectives (translated per locale)
- `content` (string): Markdown content (translated per locale)
- `locale` (string): Locale code ("en" or "ur")
- `file_path` (string): File system path relative to locale root

**Relationships**:
- Many-to-one with `Locale` (each page belongs to one locale)
- One-to-one with corresponding page in other locale (same `id`)

**Validation Rules**:
- `id` must be consistent across locales for same content
- `sidebar_position` must match across locales
- `tags` array must match across locales (order may differ)
- `content` must be properly formatted markdown
- For Urdu: `content` must render correctly in RTL layout

**State Transitions**: None (static content files)

### TranslationFile

Represents a translated markdown file matching the structure of English content files.

**Attributes**:
- `source_path` (string): Path to English source file (e.g., `docs/modules/module-1/introduction.md`)
- `target_path` (string): Path to Urdu translation file (e.g., `i18n/ur/docusaurus-plugin-content-docs/current/modules/module-1/introduction.md`)
- `status` (string): Translation status - "pending", "in_progress", "translated", "reviewed", "approved"
- `translator` (string, optional): Translator identifier
- `reviewer` (string, optional): Reviewer identifier
- `last_updated` (datetime, optional): Last modification timestamp
- `glossary_terms_used` (array<string>, optional): List of technical terms from glossary used in this file

**Relationships**:
- One-to-one with `ContentPage` (each file represents one page)
- Many-to-many with `TechnicalTerm` (files use multiple terms)

**Validation Rules**:
- `target_path` must mirror `source_path` structure under `i18n/ur/`
- `status` must follow workflow: pending → in_progress → translated → reviewed → approved
- All `glossary_terms_used` must exist in `TermBank`

**State Transitions**:
```
pending → in_progress (translation started)
in_progress → translated (translation completed)
translated → reviewed (quality review completed)
reviewed → approved (final approval)
```

### TechnicalTerm

A term that needs special handling (translation vs transliteration), stored in shared glossary.

**Attributes**:
- `term` (string): English technical term (unique key)
- `urdu_translation` (string, optional): Urdu translation if term should be translated
- `urdu_transliteration` (string, optional): Urdu transliteration if term should be transliterated
- `usage` (string): "translation", "transliteration", or "both"
- `english_in_parentheses` (boolean): Whether to include English term in parentheses
- `notes` (string, optional): Usage guidelines or context
- `category` (string, optional): Term category (e.g., "robotics", "software", "hardware")
- `created_at` (datetime): When term was added to glossary
- `updated_at` (datetime): Last modification timestamp

**Relationships**:
- Many-to-many with `TranslationFile` (terms used in multiple files)

**Validation Rules**:
- `term` must be unique (case-insensitive)
- At least one of `urdu_translation` or `urdu_transliteration` must be provided
- `usage` must be one of: "translation", "transliteration", "both"
- If `usage` is "translation", `urdu_translation` is required
- If `usage` is "transliteration", `urdu_transliteration` is required

**State**: Static reference data, updated as new terms are encountered

### TermBank

Shared reference glossary containing technical terms and their Urdu translations/transliterations.

**Attributes**:
- `terms` (array<TechnicalTerm>): Collection of all technical terms
- `version` (string): Glossary version identifier
- `last_updated` (datetime): Last modification timestamp
- `maintainer` (string, optional): Person responsible for glossary maintenance

**Relationships**:
- One-to-many with `TechnicalTerm` (bank contains multiple terms)

**Validation Rules**:
- All terms must have unique `term` values
- Version must increment on significant changes

**Storage**: JSON file at `translations/glossary/technical-terms.json`

**State**: Updated incrementally as new terms are encountered during translation

### SidebarItem

Navigation item that needs translation in both languages.

**Attributes**:
- `id` (string): Unique identifier (same across locales)
- `label_en` (string): English label
- `label_ur` (string): Urdu label (translated)
- `type` (string): Item type (e.g., "doc", "category", "link")
- `position` (number): Position in sidebar (same across locales)

**Relationships**:
- Part of `SidebarConfig` structure

**Validation Rules**:
- `id` must be consistent across locales
- `position` must match across locales
- `label_ur` must be proper Urdu text with RTL rendering

**State**: Static configuration, updated when sidebar structure changes

## Data Flow

### Translation Workflow

1. **Source Content**: English markdown files in `docs/` directory
2. **Translation Process**: 
   - Create corresponding file in `i18n/ur/docusaurus-plugin-content-docs/current/`
   - Translate content, consulting `TermBank` for technical terms
   - Update `TermBank` if new terms encountered
   - Mark `TranslationFile.status` as "translated"
3. **Review Process**:
   - Reviewer validates translation quality
   - Checks glossary term usage consistency
   - Marks `TranslationFile.status` as "reviewed" or "approved"
4. **Build Process**:
   - Docusaurus reads both `docs/` and `i18n/ur/` directories
   - Generates separate builds for each locale
   - Creates URL routes: `/en/...` and `/ur/...`

## File Structure

```
docs/                                    # English source
├── intro.md                             # Root introduction (en)
└── modules/
    └── module-1-ros2-nervous-system/
        ├── introduction.md              # ContentPage (en)
        └── ...

i18n/                                    # Translations
└── ur/
    └── docusaurus-plugin-content-docs/
        └── current/
            ├── intro.md                 # Root introduction (ur) - REQUIRED
            └── modules/
                └── module-1-ros2-nervous-system/
                    ├── introduction.md  # ContentPage (ur)
                    └── ...

translations/                            # Translation metadata
└── glossary/
    └── technical-terms.json            # TermBank storage
```

## Constraints

1. **File Structure Consistency**: Urdu translation files must mirror English file structure exactly
2. **ID Consistency**: Page IDs must match across locales for same content
3. **Metadata Consistency**: `sidebar_position`, `tags` must match across locales
4. **Glossary Usage**: All technical terms must be referenced from `TermBank`
5. **RTL Compatibility**: Urdu content must render correctly in RTL layout

## Future Enhancements

- Translation status tracking database (currently file-based)
- Automated glossary term detection
- Translation memory system
- Multi-translator collaboration workflow

