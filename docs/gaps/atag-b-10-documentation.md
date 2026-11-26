# B-10: Documentation promotes accessible authoring (B.4.2.1–B.4.2.4)

- **Status:** Product gap — documentation audit
- **Area:** BlockNote documentation and authoring help / current main
- **ATAG 2.0:** B.4.2.1 Model Practice; B.4.2.2 Feature Instructions; B.4.2.3 Tutorial; B.4.2.4 Instruction Index
- **WCAG 2.2:** The level the documented output claims (WCAG-dependent)
- **Evidence basis:** Targeted audit of 12 author-facing pages in upstream `docs/content` on 2026-11-25; see [the audit](../B10-DOCUMENTATION-AUDIT.md). Not a full documentation audit
- **Recorded:** 2026-11-25 against current main (`9cb988f`)

## Why this matters

Documentation teaches the pattern authors will copy. If the docs show an image
without an alternative or a table without headers, they model the barrier. If they
never explain the accessibility feature, the author may not discover it. ATAG
B.4.2 asks the tool to model and teach accessible authoring.

## What ATAG 2.0 requires

- **B.4.2.1** documentation models accessible authoring practices.
- **B.4.2.2** instructions explain how to use accessibility features.
- **B.4.2.3** (AAA) a tutorial is available.
- **B.4.2.4** (AAA) an instruction index is available.

## Current BlockNote behavior

BlockNote documentation exists and some pages model accessibility well. The PDF
page explains title/language, heading order and alt text; the math page explains
the LaTeX alt fallback. Other pages are partial or missing:

- The table page documents `headers: true`, `headerRows`, and `headerCols`, but
  not `scope`/`id`/`headers`, captions, or the reading impact.
- The Link Toolbar page uses `alt="image"` for a screenshot — a generic
  alternative that models the wrong pattern.
- The list, localization and HTML export pages do not explain list semantics,
  content `lang`, or which accessibility information export can lose.
- No dedicated accessible-authoring page, image-alt guidance, link-text
  guidance, content-language guidance, tutorial, or instruction index was found.

The lab's own README, ATAG map, and gap register are lab documentation, not
BlockNote's authoring help. See [the full audit](../B10-DOCUMENTATION-AUDIT.md).

## Evidence

- [B-10 documentation audit](../B10-DOCUMENTATION-AUDIT.md) — 12-page matrix and
  B.4.2 findings.
- `docs/content/docs/features/export/pdf.mdx` — strong model for title,
  language, heading order and alt text.
- `docs/content/docs/features/blocks/math.mdx` — explains the LaTeX alt fallback.
- `docs/content/docs/features/blocks/tables.mdx` — header configuration, no
  relationships or rationale.
- `docs/content/docs/features/blocks/list-types.mdx` — block shapes only.
- `docs/content/docs/react/components/hyperlink-toolbar.mdx` — screenshot
  `alt="image"`.
- `docs/content/docs/features/localization.mdx` — UI locale, not content `lang`.
- [AF-05](a11yfirst-05-author-help.md) records the absence of in-product help.
- [B-07](atag-b-07-checking-assistance.md) records the absence of an in-product
  checker that documentation would need to explain.

## Acceptance criteria

- [ ] Documentation examples show accessible images, tables, lists, and links.
- [ ] Each accessibility feature has instructions for use.
- [ ] The documentation explains the reading impact, not only the control.
- [ ] A tutorial or task-based example covers a realistic document.
- [ ] An instruction index makes the features discoverable.
- [ ] The documentation itself meets the applicable WCAG level.

## Suggested direction

Review the existing BlockNote docs against B.4.2 before writing new material.
Fix examples that model barriers. Link the in-product help (AF-05) and the
checker explanations (B-07) to the same source text so they do not drift.

This is a documentation review, not a PR review and not a conformance claim.

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
