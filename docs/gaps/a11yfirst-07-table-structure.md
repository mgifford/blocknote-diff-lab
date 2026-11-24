# AF-07: Table header and caption structure

- **Status:** Product gap — verified on current main
- **Area:** BlockNote editor / current main, table block
- **A11yFirst:** Structure first — tables with meaningful headers
- **ATAG 2.0:** B.2.1.1 Accessible Content Possible; B.2.2.2 Setting Accessibility Properties
- **WCAG 2.2:** 1.3.1 Info and Relationships
- **Evidence basis:** Automated (DOM semantics, axe) and live inspection
- **Recorded:** 2026-11-24 against current main (`9cb988f`)

## Why this matters

A screen reader needs to know which cells are headers and which data cells they
describe. Without `scope`, `id`, and `headers` relationships, a user navigating a
table hears values with no context, especially in merged or multi-level tables.

## What A11yFirst expects

Authors can designate header rows and columns, add a table caption or accessible
name, and receive guidance when a table has no headers. The result should
serialize as semantic table markup.

## Current BlockNote behavior

In the current-main Advanced Tables example, the table has three `th` elements
but **no `scope`, no `id`, and no `td[headers]`**. The table also has no observed
caption/accessible-name control. The example includes a merged 2×2 cell, so the
missing relationships affect a realistic complex table.

An upstream pull request preview shows `scope`/`id`/`headers`, but this record
describes current main and does not evaluate the PR.

## Evidence

- `tests/a11y/semantics.spec.mjs` — before: `th=3`, `thWithScope=0`, `thWithId=0`,
  `tdWithHeaders=0`; upstream preview context (not evaluated): 3/3/6.
- `tests/a11y/axe.spec.mjs` — standard axe rules do not distinguish the header
  relationships; the blind spot is asserted.
- Manual inspection: no table caption/name control observed.
- Upstream issues: #2825, #2826, #2853.

## Acceptance criteria

- [ ] An author can mark a header row and/or header column.
- [ ] Header cells receive stable ids and an appropriate `scope`.
- [ ] Data cells reference the applicable header(s) through `headers`.
- [ ] Merged cells expose all applicable headers.
- [ ] A table caption or accessible name can be authored and exported.
- [ ] A regression test validates a merged table, not only a simple one.
- [ ] The author receives guidance when a table has no headers.

## Suggested direction (upstream)

Add explicit header-row/column properties and serialize `scope`/`id`/`headers`
consistently, including merged cells. Add a caption/name property. Use the open
upstream table work as context only; do not treat the lab's preview comparison as
a PR review.

## Out of scope for this record

- Reviewing, approving, rejecting, or validating an upstream pull request.
  Mentions of upstream PRs are context only; this record describes current main.
- Real screen-reader evaluation (VoiceOver, NVDA, JAWS, Orca) or testing with
  disabled people. That is a separate activity outside this lab.
- Fixing BlockNote or claiming an upstream commitment.

## References

- [Gap register](README.md)
- [ATAG 2.0 and A11yFirst evidence map](../ATAG-2.0-A11YFIRST.md)
- [ATAG 2.0 Recommendation](https://www.w3.org/TR/ATAG20/)
- [A11yFirst demo](https://a11yfirst.gitlab.io/custom/a11yfirst.html)
- [A11yFirst CKEditor plugins](https://github.com/a11yfirst/ckeditor-plugins)
