# Remediation Edits: Top 3 Issues

**Feature**: 014-urdu-i18n-support  
**Date**: 2025-12-06  
**Issues**: D1 (Task Duplication), U1 (Sidebar i18n Uncertainty), A1 (Fallback Behavior Ambiguity)

## Issue D1: Task Duplication (HIGH)

### Problem
Tasks T007-T008 in User Story 1 duplicate Foundational phase tasks T004-T005.

### Solution
Remove T007-T008 from User Story 1. The Foundational phase already covers locale configuration.

### Concrete Edit for tasks.md

**Location**: Phase 3: User Story 1, lines 48-49

**Remove**:
```markdown
- [ ] T007 [US1] Update `docusaurus.config.ts` i18n.locales array to include 'ur' locale
- [ ] T008 [US1] Configure `docusaurus.config.ts` i18n.localeConfigs.ur with label 'اردو', direction 'rtl', htmlLang 'ur'
```

**Keep**:
```markdown
- [ ] T009 [US1] Add localeDropdown item to `docusaurus.config.ts` themeConfig.navbar.items array with position 'right'
- [ ] T010 [US1] Test language selector appears in navbar by running `npm run start`
- [ ] T011 [US1] Verify language switching works by selecting Urdu from dropdown and checking URL changes to `/ur/...`
- [ ] T012 [US1] Test language preference persistence by navigating between chapters in Urdu locale
```

**Note**: After removal, renumber remaining tasks T009-T012 to T007-T010.

---

## Issue U1: Sidebar i18n Uncertainty (HIGH)

### Problem
Tasks T054-T055 are conditional ("if sidebar/navbar configuration supports i18n") but it's unclear if Docusaurus supports this.

### Research Finding
Docusaurus **DOES support** sidebar and navbar i18n through translation files in `i18n/ur/docusaurus-theme-classic/` directory. Sidebar labels and navbar items can be translated.

### Solution
Remove conditional language and make tasks specific. Add task to create translation directory structure.

### Concrete Edits for tasks.md

**Location**: Phase 7: Polish & Cross-Cutting Concerns, lines 143-145

**Replace**:
```markdown
- [ ] T054 [P] Translate sidebar labels in `sidebars.ts` to Urdu (if sidebar configuration supports i18n)
- [ ] T055 [P] Translate navbar items to Urdu in `docusaurus.config.ts` themeConfig.navbar (if needed)
- [ ] T056 [P] Translate footer content to Urdu in `docusaurus.config.ts` themeConfig.footer (if needed)
```

**With**:
```markdown
- [ ] T054 [P] Create sidebar translation directory `i18n/ur/docusaurus-theme-classic/sidebar.json` for sidebar label translations
- [ ] T055 [P] Create navbar translation file `i18n/ur/docusaurus-theme-classic/navbar.json` and translate navbar item labels (e.g., "Textbook" → "کتاب")
- [ ] T056 [P] Create footer translation file `i18n/ur/docusaurus-theme-classic/footer.json` and translate footer content to Urdu
```

**Also update Phase 1 Setup** (after T003):

**Add**:
```markdown
- [ ] T004 [P] Create theme translation directory structure `i18n/ur/docusaurus-theme-classic/` for sidebar, navbar, and footer translations
```

**Note**: This requires renumbering all subsequent tasks. T004 becomes T005, T005 becomes T006, etc.

---

## Issue A1: Fallback Behavior Ambiguity (MEDIUM)

### Problem
Edge case question: "Should show English with a notice, or redirect to English version?" - decision not made. Task T053 mentions verifying fallback but doesn't specify expected behavior.

### Research Finding
Docusaurus i18n **automatically falls back** to the default locale (English) when a page doesn't exist in the selected locale. It does **NOT** show a notice or redirect - it silently displays the English version.

### Solution
Clarify fallback behavior in spec edge cases and update task T053 with specific expected behavior.

### Concrete Edit for spec.md

**Location**: Edge Cases section, line 88

**Replace**:
```markdown
- What happens when a chapter doesn't have a Urdu translation yet? (Should show English with a notice, or redirect to English version)
```

**With**:
```markdown
- What happens when a chapter doesn't have a Urdu translation yet? → **RESOLVED**: Docusaurus automatically falls back to default locale (English) and displays English content without notice or redirect. This is standard i18n behavior.
```

### Concrete Edit for tasks.md

**Location**: Phase 6: User Story 4, line 133

**Replace**:
```markdown
- [ ] T053 [US4] Verify fallback behavior when navigating to untranslated chapter (should show English with notice or redirect per FR-014)
```

**With**:
```markdown
- [ ] T053 [US4] Verify fallback behavior when navigating to untranslated chapter: Navigate to `/ur/modules/module-2-...` (untranslated), verify Docusaurus automatically displays English version without notice or redirect (standard i18n fallback behavior per FR-014)
```

---

## Summary of Changes

### tasks.md Changes:
1. **Remove** T007-T008 from User Story 1 (duplicates T004-T005)
2. **Renumber** T009-T012 → T007-T010 in User Story 1
3. **Add** T004 in Phase 1 for theme translation directory
4. **Renumber** all tasks after T003 (T004 becomes T005, etc.)
5. **Update** T054-T056 in Phase 7 to be specific about Docusaurus i18n translation files
6. **Update** T053 in Phase 6 with specific fallback behavior

### spec.md Changes:
1. **Update** Edge Cases section to resolve fallback behavior question

### Total Task Count Impact:
- **Removed**: 2 tasks (T007-T008)
- **Added**: 1 task (T004 for theme translation directory)
- **Net change**: -1 task (64 → 63 tasks)

---

## Implementation Notes

### For Docusaurus Sidebar/Navbar i18n:
Docusaurus requires translation files in this structure:
```
i18n/ur/docusaurus-theme-classic/
├── sidebar.json      # Sidebar label translations
├── navbar.json        # Navbar item translations
└── footer.json        # Footer content translations
```

Example `sidebar.json`:
```json
{
  "sidebar.textbookSidebar.category.modules": "ماڈیولز",
  "sidebar.textbookSidebar.category.module1": "ماڈیول 1: روبوٹک اعصابی نظام (ROS 2)"
}
```

### For Fallback Behavior:
Docusaurus i18n plugin automatically handles fallback:
- If `/ur/modules/module-2/...` doesn't exist, it serves `/modules/module-2/...` (English)
- No notice is shown
- No redirect occurs
- This is standard i18n behavior and acceptable per FR-014

---

## Approval Required

These edits will:
- ✅ Remove duplicate tasks
- ✅ Clarify sidebar/navbar i18n implementation
- ✅ Resolve fallback behavior ambiguity
- ✅ Improve task specificity and executability

**Ready to apply?** These changes will make the tasks more accurate and eliminate confusion during implementation.

