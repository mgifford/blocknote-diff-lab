# AF-01: Heading-level guidance and outline validation

- **Status:** Product gap — verified on current main
- **Area:** BlockNote editor / current main
- **A11yFirst:** Heading — helps authors choose proper heading levels so the document outline is meaningful
- **ATAG 2.0:** A.3.4.1 Navigate By Structure; B.2.2.2 Setting Accessibility Properties
- **WCAG 2.2:** 1.3.1 Info and Relationships; 2.4.6 Headings and Labels
- **Evidence basis:** Automated authoring probe (`tests/a11y/a11yfirst.spec.mjs`) and manual observation
- **Recorded:** 2026-11-24 against current main (`9cb988f`)

## Why this matters

Authors who skip heading levels or use headings only for visual size create an
outline that screen-reader heading navigation cannot follow. A11yFirst treats
heading level as a structural decision and guides it during authoring.

## What A11yFirst expects

The A11yFirst Heading feature helps an author select a heading level that fits
the document, rather than offering an unstructured "large text" choice. The
authoring environment should make the outline visible or warn when the chosen
level jumps (for example H1 directly to H3).

## Current BlockNote behavior

BlockNote exposes heading blocks and a block-type selector. In the tested
Default Schema example, the document contains a level-1 "Heading" and a level-1
"Toggle Heading". The lab then created an H1 followed immediately by an H3. The
editor accepted both headings and produced `<h1>`/`<h3>` elements; no alert,
status message, level validation, or skipped-level warning appeared. There is no
visible outline. This is now a verified product gap, not only an evidence gap.

## Evidence

- `tests/a11y/a11yfirst.spec.mjs` — creates H1 then H3 and asserts that an H3
  exists while no alert/status text mentions heading, level, skip, or outline.
- `tests/a11y/guidepup.spec.mjs` records Virtual Screen Reader heading phrases
  during the editor traversal; it does not assert heading sequence.
- Manual inspection of the block type selector found no outline or level
  validation.

## Acceptance criteria

- [ ] An author can see the current document outline, including heading levels.
- [ ] Choosing a level that skips a level produces an in-context warning or
      guidance, not silent acceptance.
- [ ] The warning/guidance explains the reading impact in plain language.
- [ ] A regression test creates H1 → H3 and verifies the warning.
- [ ] The behavior is documented in the authoring help.

## Suggested direction (upstream)

Implement outline awareness in the block-type control or a heading plugin, using
the A11yFirst Heading plugin as a reference. Keep the author in control: warn,
do not silently rewrite the level.

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
- [A11yFirst demo](https://a11yfirst.gitlab.io/custom/a11yfirst.html)
- [A11yFirst CKEditor plugins](https://github.com/a11yfirst/ckeditor-plugins)
