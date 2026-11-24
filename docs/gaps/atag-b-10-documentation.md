# B-10: Documentation promotes accessible authoring (B.4.2.1–B.4.2.4)

- **Status:** Product gap — targeted docs review
- **Area:** BlockNote documentation and authoring help / current main
- **ATAG 2.0:** B.4.2.1 Model Practice; B.4.2.2 Feature Instructions; B.4.2.3 Tutorial; B.4.2.4 Instruction Index
- **WCAG 2.2:** The level the documented output claims (WCAG-dependent)
- **Evidence basis:** Targeted search of upstream `docs/content` on 2026-11-24; not a full manual documentation audit
- **Recorded:** 2026-11-24 against current main (`9cb988f`)

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

BlockNote documentation exists. A targeted search of `docs/content` found
accessibility mentions only in PDF/typst export, legal pages, and the Ariakit
getting-started page; `alt text`/`alternative text` appears only in the math,
email, and PDF pages. The table page documents `headers: true`, `headerRows`, and
`headerCols`, but not the `scope`/`id`/`headers` relationships, captions, or the
reason authors should use headers. No dedicated accessible-authoring guide,
image-alt guidance, link-text guidance, or language guidance was found. The lab's
own README, ATAG map, and gap register are lab documentation, not BlockNote's
authoring help. This is a targeted review finding, not a full documentation
audit.

## Evidence

- `grep -ril "accessib" docs/content --include="*.mdx"` — only export/legal/
  Ariakit pages.
- `grep -ril "alt text\|alternative text\|alt attribute" docs/content --include="*.mdx"`
  — math, email, and PDF pages only.
- `docs/content/docs/features/blocks/tables.mdx` — documents `headers: true` and
  the header props, but not the relationships or the authoring rationale.
- `docs/content/docs/features/blocks/list-types.mdx` — no accessibility terms
  found.
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
