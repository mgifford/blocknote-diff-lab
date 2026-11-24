# B-06: Templates and pre-authored content (B.2.4.1–B.2.4.4, B.2.5.1–B.2.5.2)

- **Status:** Product/evidence gap for pre-authored content; templates not
  applicable in the tested surfaces
- **Area:** BlockNote editor / current main, default schema and example content
- **ATAG 2.0:** B.2.4.1 Accessible Template Options; B.2.4.2 Identify Template Accessibility; B.2.4.3 Author-Created Templates; B.2.4.4 Accessible Template Options (Enhanced); B.2.5.1 Accessible Pre-Authored Content Options; B.2.5.2 Identify Pre-Authored Content Accessibility
- **WCAG 2.2:** The level the template/pre-authored content claims (WCAG-dependent)
- **Evidence basis:** Manual inspection; automated evidence in AF-02/AF-07/AF-08
- **Recorded:** 2026-11-24 against current main (`9cb988f`)

## Why this matters

Authors trust what the tool puts in front of them. A default document or example
that contains an undescribed image or a headerless table teaches the wrong
pattern and seeds inaccessible content. Templates and pre-authored content should
be accessible and should say what they are.

## What ATAG 2.0 requires

- **B.2.4.1** accessible template options are available.
- **B.2.4.2** templates are identified as accessible or not.
- **B.2.4.3** author-created templates preserve accessibility.
- **B.2.4.4** (AAA) enhanced template options.
- **B.2.5.1** accessible pre-authored content options are available.
- **B.2.5.2** pre-authored content is identified as accessible or not.

## Current BlockNote behavior

No template library or author-created template feature was observed in the tested
playground surfaces, so B.2.4.3/B.2.4.4 are **not applicable** there. The Default
Schema Showcase is pre-authored content: it contains an image with `alt=""`, a
table with no header relationships, and no accessibility label. It therefore
demonstrates inaccessible pre-authored content rather than an accessible option.
This is a product gap for B.2.5.1/B.2.5.2 and an evidence gap for any template
path outside the tested surfaces.

## Evidence

- [AF-02](a11yfirst-02-image-alt-authoring.md) — showcase image `alt=""`.
- [AF-07](a11yfirst-07-table-structure.md) — showcase/advanced table has no
  `scope`/`headers`.
- [AF-08](a11yfirst-08-list-structure.md) — read-only list wrappers absent.
- Manual inspection: no template picker or accessibility label.

## Acceptance criteria

- [ ] Any template or pre-authored content offered by the tool is accessible or
      explicitly labelled as not accessibility-checked.
- [ ] The label is visible before insertion and available to assistive technology.
- [ ] Default/example content demonstrates accessible image, table, and list
      patterns.
- [ ] Author-created templates preserve the accessibility properties.
- [ ] If templates are not a product feature, the documentation says so rather
      than implying an accessible-template capability.

## Suggested direction

Do not add a template picker just to satisfy a checklist. First fix the defaults
and example content, then label any pre-authored content with its accessibility
status if it is offered to authors.

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
