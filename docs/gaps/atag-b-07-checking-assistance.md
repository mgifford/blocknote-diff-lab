# B-07: Checking assistance (B.3.1.1–B.3.1.5)

- **Status:** Product gap — no in-product checker observed
- **Area:** BlockNote editor / current main
- **ATAG 2.0:** B.3.1.1 Checking Assistance; B.3.1.2 Help Authors Decide; B.3.1.3 Help Authors Locate; B.3.1.4 Status Report; B.3.1.5 Programmatic Association of Results
- **WCAG 2.2:** No single criterion; supports 1.1.1, 1.3.1, 2.4.4, 3.1.2
- **Evidence basis:** Manual inspection; external test runs only
- **Recorded:** 2026-11-24 against current main (`9cb988f`)

## Why this matters

An author cannot fix what they cannot see. Checking assistance must identify the
problem, help the author decide whether it is a real issue, locate the content,
and report status without relying on a separate audit tool.

## What ATAG 2.0 requires

- **B.3.1.1** the tool checks for accessibility problems, or the author is
  prompted to check.
- **B.3.1.2** the tool helps the author decide whether a reported issue is a
  problem.
- **B.3.1.3** the tool helps locate the affected content.
- **B.3.1.4** the tool reports the status of the check.
- **B.3.1.5** results are programmatically associated with the content.

## Current BlockNote behavior

No in-product checker or issue panel was observed in the tested surfaces. The
lab runs axe and Guidepup externally; those results do not appear in the editor
and are not associated with blocks. This is a product gap for B.3.1.1 and the
associated sub-criteria.

## Evidence

- `tests/a11y/axe.spec.mjs` — external axe run, not an editor feature.
- `tests/a11y/guidepup.spec.mjs` — external simulator run, not an editor feature.
- Manual inspection of the toolbar, side menu, and block controls.

## Acceptance criteria

- [ ] A check can be run from the editor.
- [ ] Results identify the affected block and are reachable by keyboard.
- [ ] Each result explains the problem and helps the author decide.
- [ ] The author can move from a result to the content and back.
- [ ] The panel reports whether the check completed, and any errors.
- [ ] Results are associated programmatically with the block they describe.
- [ ] The checker does not claim conformance.

## Suggested direction

Start with deterministic checks for the three verified barriers (image alt,
table headers, list wrappers) and build an accessible issue list. Keep the result
wording separate from rule ids. Do not label the lab's external axe run as a
BlockNote checker.

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
