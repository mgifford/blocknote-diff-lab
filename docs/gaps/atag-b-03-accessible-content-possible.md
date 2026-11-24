# B-03: Accessible content is possible (B.2.1.1)

- **Status:** Product gap — verified on current main
- **Area:** BlockNote editor / current main
- **ATAG 2.0:** B.2.1.1 Accessible Content Possible (Level A to meet WCAG A)
- **WCAG 2.2:** 1.1.1 Non-text Content; 1.3.1 Info and Relationships
- **Evidence basis:** Automated (DOM, axe, Guidepup) and live inspection
- **Recorded:** 2026-11-24 against current main (`9cb988f`)

## Why this matters

B.2.1.1 is the minimum Part B requirement: the authoring tool must not prevent an
author from producing content that meets WCAG. If the UI has no way to provide an
image description or table header relationships, the author cannot meet WCAG 1.1.1
or 1.3.1 in those blocks, no matter how skilled they are.

## What ATAG 2.0 requires

The authoring tool does not place restrictions on what the author can specify,
or those restrictions do not prevent WCAG success criteria from being met.

## Current BlockNote behavior

Three verified occurrences on current main:

| Block | Current-main behavior | Evidence |
| --- | --- | --- |
| Image/file | Image renders with `alt=""`; no alt control observed | [AF-02](a11yfirst-02-image-alt-authoring.md) |
| Table | Header row/column can be enabled (`headers: true`), but `th` has no `scope`/`id`, `td` has no `headers`, and no caption control was observed | [AF-07](a11yfirst-07-table-structure.md) |
| Read-only lists | No `ul`/`ol`/`li`; items spoken as paragraphs | [AF-08](a11yfirst-08-list-structure.md) |

The separate records carry the commands and raw evidence. This record is the
ATAG-level summary; it does not duplicate the per-block detail.

## Evidence

- `tests/a11y/semantics.spec.mjs` — DOM counts on current main and in the upstream preview context (context only, not evaluated).
- `tests/a11y/guidepup.spec.mjs` — image silence and paragraph-only list output.
- `tests/a11y/axe.spec.mjs` — axe blind spots for the same cases.
- [`docs/ATAG-2.0-A11YFIRST.md`](../ATAG-2.0-A11YFIRST.md) — Part B evidence table.

## Acceptance criteria

- [ ] An author can supply an image text alternative through the editor UI.
- [ ] An author can designate table header rows/columns and a caption/name.
- [ ] Read-only/exported lists expose list and listitem structure.
- [ ] The author can meet WCAG 1.1.1 and 1.3.1 for these blocks without editing
      the document model or hand-writing HTML.
- [ ] Regression tests exercise the authoring UI, not only a fixture with
      hand-edited markup.

## Suggested direction

Treat B.2.1.1 as the umbrella for the three concrete records. The upstream PR
previews show possible directions, but this lab does not evaluate those PRs and
does not treat a preview as a merged capability.

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
