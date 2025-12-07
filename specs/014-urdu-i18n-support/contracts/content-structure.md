# Content Structure Contract: Urdu Translation Files

**Feature**: 014-urdu-i18n-support  
**Date**: 2025-12-06  
**Type**: File Structure Contract

## Overview

This contract defines the required structure and format for Urdu translation files to ensure compatibility with Docusaurus i18n and maintain consistency with English source files.

## Directory Structure

### Required Structure

```
i18n/
└── ur/
    └── docusaurus-plugin-content-docs/
        └── current/
            ├── intro.md                    # Root introduction - REQUIRED (docs/intro.md exists, must be translated)
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

### Mapping Rules

1. **Path Mapping**: 
   - English root: `docs/intro.md` → Urdu: `i18n/ur/docusaurus-plugin-content-docs/current/intro.md`
   - English module: `docs/modules/module-1-ros2-nervous-system/introduction.md` → Urdu: `i18n/ur/docusaurus-plugin-content-docs/current/modules/module-1-ros2-nervous-system/introduction.md`

2. **URL Mapping**:
   - English root: `docs/intro.md` → URLs: `/` and `/intro` in English locale
   - Urdu root: `i18n/ur/docusaurus-plugin-content-docs/current/intro.md` → URLs: `/ur/` and `/ur/intro` in Urdu locale
   - English module: `docs/modules/module-1-ros2-nervous-system/introduction.md` → URL: `/modules/module-1-ros2-nervous-system/introduction` in English locale
   - Urdu module: `i18n/ur/docusaurus-plugin-content-docs/current/modules/module-1-ros2-nervous-system/introduction.md` → URL: `/ur/modules/module-1-ros2-nervous-system/introduction` in Urdu locale

3. **File Naming**: File names must match exactly between English and Urdu versions

4. **Directory Structure**: Directory structure must mirror exactly, replacing `docs/` with `i18n/ur/docusaurus-plugin-content-docs/current/`

## File Format Contract

### Frontmatter Requirements

Each Urdu translation file MUST include frontmatter with the following structure:

```yaml
---
id: <same-as-english-source>
title: <urdu-translated-title>
sidebar_position: <same-as-english-source>
tags: [<same-tags-as-english>]
learning_objectives:
  - <urdu-translated-objective-1>
  - <urdu-translated-objective-2>
---
```

### Required Fields

| Field | Type | Requirement | Notes |
|-------|------|-------------|-------|
| `id` | string | MUST match English source | Used for routing and linking |
| `title` | string | MUST be translated to Urdu | Displayed in navigation and page header |
| `sidebar_position` | number | MUST match English source | Ensures consistent navigation order |
| `tags` | array<string> | MUST match English source tags | Order may differ, but same tags |
| `learning_objectives` | array<string> | MUST be translated to Urdu | Each objective translated |

### Content Body Requirements

1. **Markdown Format**: Content must be valid Markdown, compatible with Docusaurus MDX
2. **Code Blocks**: Code blocks MUST remain in English (not translated)
3. **Code Comments**: Code comments MAY be translated to Urdu
4. **Technical Terms**: Technical terms MUST follow glossary/term bank guidelines
5. **RTL Compatibility**: All text must render correctly in RTL layout
6. **Links**: Internal links must use locale-aware paths (e.g., `/ur/modules/...`)

### Translation Strategy Contract

**Rule**: All content MUST be translated to full Urdu except:
- **Acronyms**: Keep in English (e.g., "ROS 2", "AI", "API")
- **Proper Nouns/Brand Names**: Keep in English (e.g., "Python", "Docusaurus", "GitHub")
- **Domain-Specific Technical Terms**: Keep in English if no direct Urdu equivalent exists (e.g., "topic", "service", "action" in ROS 2 context)

**Examples**:
- ✅ "ROS 2 کے بارے میں جانیں" (Learn about ROS 2)
- ✅ "Python پروگرامنگ کی معلومات" (Python programming knowledge)
- ❌ "ROS 2 (روبوٹ آپریٹنگ سسٹم 2)" - No English in parentheses
- ❌ "Python (پائتھون)" - No transliteration in parentheses

**Glossary Usage**: Consult glossary to identify which terms should remain in English. All other words MUST be translated to Urdu.

### Code Block Contract

```markdown
```python
# This comment MAY be translated to Urdu
def example_function():
    # Code MUST remain in English
    return "Hello World"
```
```

**Rules**:
- Code syntax MUST remain in English
- Code comments MAY be translated
- Code examples MUST be functional and identical to English version

### Link Contract

**Internal Links**:
- English: `[Link Text](/modules/module-1/introduction)`
- Urdu: `[Link Text](/ur/modules/module-1/introduction)`

**Rules**:
- All internal links MUST include locale prefix (`/ur/`) for Urdu version
- External links remain unchanged
- Anchor links must account for RTL layout

### Image Contract

```markdown
![Alt text in Urdu](path/to/image.png)
```

**Rules**:
- Alt text MUST be translated to Urdu
- Image paths remain unchanged (relative to file location)
- Captions MUST be translated to Urdu
- Embedded text in images: Handle via translated captions or image replacement

## Technical Term Contract

### Glossary Reference Format

When using a technical term from the glossary:

**Format 1 - Translation**:
```markdown
[Urdu Translation](<term-reference>) (English Term)
```

**Format 2 - Transliteration**:
```markdown
[Urdu Transliteration](<term-reference>) (English Term)
```

**Format 3 - Both**:
```markdown
[Urdu Translation](<term-reference>) ([Urdu Transliteration](<term-reference>)) (English Term)
```

### Required Glossary Consultation

- Before translating: Consult `translations/glossary/technical-terms.json`
- During translation: Use established translations/transliterations
- After translation: Update glossary if new terms encountered

## Validation Rules

### File Structure Validation

1. ✅ Every English file in `docs/` has corresponding Urdu file in `i18n/ur/...`
2. ✅ File names match exactly
3. ✅ Directory structure mirrors exactly
4. ✅ No orphaned Urdu files (all have English source)

### Content Validation

1. ✅ Frontmatter `id` matches English source
2. ✅ Frontmatter `sidebar_position` matches English source
3. ✅ Frontmatter `tags` array matches English source
4. ✅ All code blocks remain in English
5. ✅ All technical terms reference glossary
6. ✅ All internal links include `/ur/` prefix
7. ✅ Content renders correctly in RTL layout

### Quality Validation

1. ✅ Technical accuracy verified
2. ✅ Terminology consistency checked
3. ✅ Readability validated by native speaker
4. ✅ RTL formatting verified

## Breaking Changes

Any changes to this contract must:
1. Update all existing translation files to comply
2. Update translation workflow documentation
3. Update validation scripts/tools
4. Communicate changes to translation team

## Examples

### Example 1: Simple Page

**English** (`docs/modules/module-1/introduction.md`):
```markdown
---
id: introduction
title: Introduction to ROS 2
sidebar_position: 1
tags: [ros2, basics]
learning_objectives:
  - Understand ROS 2 fundamentals
---

# Introduction to ROS 2

ROS 2 is a robotics framework.
```

**Urdu** (`i18n/ur/docusaurus-plugin-content-docs/current/modules/module-1/introduction.md`):
```markdown
---
id: introduction
title: ROS 2 کا تعارف
sidebar_position: 1
tags: [ros2, basics]
learning_objectives:
  - ROS 2 کی بنیادی باتوں کو سمجھنا
---

# ROS 2 کا تعارف

ROS 2 ایک روبوٹکس فریم ورک ہے۔
```

### Example 2: Page with Code Block

**English**:
```markdown
## Example Code

```python
def hello():
    print("Hello World")
```
```

**Urdu**:
```markdown
## مثال کوڈ

```python
# یہ فنکشن سلام پیغام دکھاتا ہے
def hello():
    print("Hello World")
```
```

## Compliance

All translation files MUST comply with this contract. Non-compliance will result in:
- Build failures
- Broken navigation
- Incorrect RTL rendering
- Inconsistent user experience

