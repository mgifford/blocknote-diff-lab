# B-09: Accessible features are active and prominent by default (B.4.1.1–B.4.1.4)

- **Status:** Product gap
- **Area:** BlockNote editor / current main
- **ATAG 2.0:** B.4.1.1 Features Active by Default; B.4.1.2 Option to Reactivate Features; B.4.1.3 Feature Deactivation Warning; B.4.1.4 Feature Prominence
- **WCAG 2.2:** Cross-cutting (1.1.1, 1.3.1, 2.4.4, 3.1.2)
- **Evidence basis:** Cross-cutting synthesis of the concrete gaps
- **Recorded:** 2026-11-24 against current main (`9cb988f`)

## Why this matters

A feature that is off by default, or buried, does not help the author who does
not know it exists. A11yFirst's model is that the accessible behavior is the
default behavior. ATAG B.4.1 makes that expectation explicit.

## What ATAG 2.0 requires

- **B.4.1.1** accessibility features are active by default.
- **B.4.1.2** if an author deactivates a feature, they can reactivate it.
- **B.4.1.3** deactivation that may cause inaccessible content produces a warning.
- **B.4.1.4** accessibility features are prominent.

## Current BlockNote behavior

The default path does not provide the accessible behavior: images have no
alternative, tables have no header relationships, and read-only lists have no
list wrappers. There is no accessibility feature to deactivate or reactivate;
the missing behavior is absence, not an off-by-default toggle. No prompt or
warning appears when the author creates the inaccessible content.

## Evidence

- [AF-02](a11yfirst-02-image-alt-authoring.md), [AF-07](a11yfirst-07-table-structure.md),
  [AF-08](a11yfirst-08-list-structure.md).
- [B-03](atag-b-03-accessible-content-possible.md) — the ATAG-level summary.
- `tests/a11y/` — before/after evidence for the concrete barriers.

## Acceptance criteria

- [ ] The accessible behavior is present on first use, without configuration.
- [ ] If an accessibility feature can be turned off, it can be turned back on.
- [ ] Turning off a feature that may cause inaccessible content warns the author.
- [ ] The accessible feature is at least as prominent as its inaccessible
      alternative.
- [ ] A regression test verifies the default (not just an opted-in) state.

## Suggested direction

Do not build a settings toggle for a feature that does not exist. First make the
default path accessible; if a toggle is later added, default it on and warn on
deactivation.

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
