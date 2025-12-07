# Quickstart: Urdu Language Support Implementation

**Feature**: 014-urdu-i18n-support  
**Date**: 2025-12-06

## Prerequisites

- Node.js >=20.0
- Docusaurus 3.9.2
- Git repository access
- Access to Urdu translators (for content translation)

## Setup (5 minutes)

### 1. Update Docusaurus Configuration

Edit `docusaurus.config.ts`:

```typescript
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

### 2. Add Locale Dropdown to Navbar

In `docusaurus.config.ts`, add to `navbar.items`:

```typescript
navbar: {
  items: [
    // ... existing items
    {
      type: 'localeDropdown',
      position: 'right',
    },
  ],
},
```

### 3. Create Translation Directory Structure

```bash
mkdir -p i18n/ur/docusaurus-plugin-content-docs/current
```

### 4. Create Glossary Directory

```bash
mkdir -p translations/glossary
```

Create `translations/glossary/technical-terms.json`:

```json
{
  "version": "1.0.0",
  "terms": []
}
```

## Development Workflow

### Step 1: Translate a File

1. **Identify source file**: `docs/modules/module-1-ros2-nervous-system/introduction.md`

2. **Create Urdu file**: 
   ```bash
   cp docs/modules/module-1-ros2-nervous-system/introduction.md \
      i18n/ur/docusaurus-plugin-content-docs/current/modules/module-1-ros2-nervous-system/introduction.md
   ```

3. **Translate content**:
   - Translate frontmatter `title` and `learning_objectives`
   - Translate markdown content
   - Keep code blocks in English
   - Consult glossary for technical terms
   - Update glossary if new terms encountered

4. **Verify structure**: Ensure file matches [content structure contract](./contracts/content-structure.md)

### Step 2: Test Locally

```bash
# Start dev server with Urdu locale
npm run start -- --locale ur

# Or start with default locale and switch via UI
npm run start
```

Visit: `http://localhost:3000/ur/modules/module-1-ros2-nervous-system/introduction`

### Step 3: Review Translation

1. Check technical accuracy
2. Verify terminology consistency (consult glossary)
3. Test RTL layout rendering
4. Validate all links work correctly

### Step 4: Build and Deploy

```bash
# Build all locales
npm run build

# Or build specific locale
npm run build -- --locale ur
```

## Translation Workflow

### Per Chapter Process

1. **Translate all files in chapter** (one file at a time):
   - File 1: Translate → Update glossary
   - File 2: Translate → Update glossary
   - File 3: Translate → Update glossary
   - ...

2. **Review entire chapter**:
   - Technical accuracy check
   - Terminology consistency check
   - RTL layout verification
   - Cross-file link validation

3. **Approve chapter**:
   - Mark all files as reviewed
   - Update translation status

## Glossary Management

### Adding a New Term

Edit `translations/glossary/technical-terms.json`:

```json
{
  "version": "1.0.0",
  "terms": [
    {
      "term": "ROS 2",
      "urdu_translation": "روبوٹک آپریٹنگ سسٹم 2",
      "urdu_transliteration": "آر او ایس 2",
      "usage": "transliteration",
      "english_in_parentheses": true,
      "category": "robotics",
      "notes": "Use transliteration with English in parentheses"
    }
  ]
}
```

### Using Terms in Translation

When translating, consult glossary first:

```markdown
<!-- If term exists in glossary -->
[Urdu Transliteration](ROS 2) (ROS 2) is a framework.

<!-- If new term, add to glossary first -->
```

## Testing Checklist

- [ ] Language selector appears in navbar
- [ ] Switching to Urdu changes URL to `/ur/...`
- [ ] Content displays in RTL layout
- [ ] Code blocks remain in English
- [ ] Internal links work correctly
- [ ] Navigation sidebar displays in Urdu
- [ ] Footer content displays in Urdu (if translated)
- [ ] Page loads in <500ms additional time

## Common Issues

### Issue: RTL Layout Not Working

**Solution**: Verify `direction: 'rtl'` in `localeConfigs.ur` in `docusaurus.config.ts`

### Issue: Links Broken in Urdu Version

**Solution**: Ensure all internal links include `/ur/` prefix

### Issue: Code Blocks Not Rendering

**Solution**: Verify code blocks are not translated (syntax must remain in English)

### Issue: Glossary Terms Inconsistent

**Solution**: Consult `translations/glossary/technical-terms.json` before translating each file

## Next Steps

1. Complete Module 1 translations
2. Expand to other modules incrementally
3. Add Urdu translations for navbar/footer labels
4. Consider web fonts for better Urdu rendering consistency

## Resources

- [Docusaurus i18n Docs](https://docusaurus.io/docs/i18n/introduction)
- [Content Structure Contract](./contracts/content-structure.md)
- [Data Model](./data-model.md)
- [Research Findings](./research.md)

