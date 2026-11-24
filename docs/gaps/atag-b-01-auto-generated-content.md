# B-01: Automatically generated content is accessible (B.1.1.1, B.1.1.2)

- **Status:** Evidence gap
- **Area:** BlockNote editor / current main
- **ATAG 2.0:** B.1.1.1 Content Auto-Generation After Authoring Sessions (Level A to meet WCAG A); B.1.1.2 Content Auto-Generation During Authoring Sessions (Level A to meet WCAG A)
- **WCAG 2.2:** The level the generated content must meet (A/AA/AAA, WCAG-dependent)
- **Evidence basis:** Not assessed
- **Recorded:** 2026-11-24 against current main (`9cb988f`)

## Why this matters

If the tool generates content on its own — a placeholder, a derived caption, a
URL-derived name, a default table, or a post-session update — that content must
either be accessible or prompt/check the author. Otherwise the tool inserts
barriers faster than an author can remove them.

## What ATAG 2.0 requires

**B.1.1.1** applies to content generated after the authoring session: the tool
must not generate inaccessible content, or the author must be able to require
accessible output. **B.1.1.2** applies during the session: generated content must
be accessible, or the author must be prompted for missing accessibility
information, or automatic checking must run, or the author must be prompted to
check.

## Current BlockNote behavior

This lab did not identify a post-session auto-generation path in the tested
current-main surfaces. The editor does insert default/pre-authored block content
(the Default Schema Showcase) and may derive an image fallback in an upstream
preview, but that preview is context only and is not evaluated here. Because no
specific auto-generation feature was tested, this is a **coverage gap**, not a
claim that BlockNote violates B.1.1.

## Evidence

- No test in `tests/a11y/` exercises generated content after a session.
- The Default Schema Showcase is treated as pre-authored content in
  [B-06](atag-b-06-templates-pre-authored.md), not as auto-generation.
- `pages/issues.json` records no issue about generated content.

## Acceptance criteria

- [ ] Every automatic content-generation path is inventoried (when it runs, what
      it inserts, and who owns the output).
- [ ] Each path either generates accessible content or prompts the author for the
      required accessibility information.
- [ ] If automatic generation runs after the session, the output still meets the
      declared WCAG level.
- [ ] A test covers the generated output rather than the empty editor.
- [ ] The behavior is documented for authors.

## Suggested direction

Do not build a checker for a feature that does not exist. First inventory the
actual generation paths in BlockNote (default blocks, derived names, imports,
collaboration updates). Then apply the B.1.1.1/2 decision to each path.

## Out of scope for this record

- Reviewing, approving, rejecting, or validating an upstream pull request.
  Mentions of upstream PRs are context only; this record describes current main.
- Real screen-reader evaluation (VoiceOver, NVDA, JAWS, Orca) or testing with
  disabled people. That is a separate activity outside this lab.
- Fixing BlockNote or claiming an upstream commitment.

## References

- [Gap register](README.md)
- [ATAG 2.0 and A11yFirst evidence map](../ATAG-2.0-A11YFIRST.md)
- [ATAG 2.0 alignment issues](../ATAG-ALIGNMENT-ISSUES.md)
- [ATAG 2.0 Recommendation](https://www.w3.org/TR/ATAG20/)
