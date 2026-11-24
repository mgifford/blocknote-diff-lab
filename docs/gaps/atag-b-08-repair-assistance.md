# B-08: Repair assistance (B.3.2.1)

- **Status:** Product gap — no repair workflow observed
- **Area:** BlockNote editor / current main
- **ATAG 2.0:** B.3.2.1 Repair Assistance (Level A to meet WCAG A)
- **WCAG 2.2:** 1.1.1, 1.3.1, 2.4.4, 3.1.2 (depending on the repair)
- **Evidence basis:** Manual inspection; relevant gaps in AF-02/AF-07/AF-08
- **Recorded:** 2026-11-24 against current main (`9cb988f`)

## Why this matters

Identifying a problem is not the same as fixing it. Repair assistance should take
the author to the right control with the right context, and should not silently
insert a low-quality value such as a filename as if it were a description.

## What ATAG 2.0 requires

If checking identifies an accessibility problem, the tool provides assistance in
repairing it, or the author is prompted to repair it. The repair should be
possible with the same authoring interface.

## Current BlockNote behavior

There is no observed in-product checker, so there is no repair workflow attached
to results. The image and table gaps also mean the controls needed for repair do
not exist on current main. An upstream preview's URL-derived image fallback is
context only and is not evaluated here; a filename is not a substitute for a
description.

## Evidence

- [AF-02](a11yfirst-02-image-alt-authoring.md) — no alt control to repair.
- [AF-07](a11yfirst-07-table-structure.md) — no header property to repair.
- [AF-08](a11yfirst-08-list-structure.md) — no read-only list fix.
- [B-07](atag-b-07-checking-assistance.md) — no checker results to launch repair.

## Acceptance criteria

- [ ] A result can take the author to the affected block and control.
- [ ] The author can repair the issue without leaving the editor.
- [ ] Generated fallbacks are editable drafts, never presented as final descriptions.
- [ ] The result updates after repair.
- [ ] The repair itself is reversible.
- [ ] A regression test repairs a missing alt and a headerless table.

## Suggested direction

Implement repair only for issues the tool can actually check. The first useful
pair is "missing image alternative" → image alt control, and "table has no
headers" → header row/column property. Do not add a repair button that only
dismisses the issue.

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
