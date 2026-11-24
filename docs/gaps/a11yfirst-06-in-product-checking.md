# AF-06: Built-in accessibility checking

- **Status:** Product gap — no in-product checker observed
- **Area:** BlockNote editor / current main
- **A11yFirst:** Built-in accessibility checker
- **ATAG 2.0:** B.3.1.1 Checking Assistance; B.3.1.4 Status Report; B.3.1.5 Programmatic Association of Results
- **WCAG 2.2:** No single criterion; supports 1.1.1, 1.3.1, 2.4.4, 3.1.2
- **Evidence basis:** Manual inspection; external axe/Guidepup results
- **Recorded:** 2026-11-24 against current main (`9cb988f`)

## Why this matters

A11yFirst's premise is to prevent accessibility problems during authoring and
still provide a checker for what remains. Without a checker, an author has no way
to know that an image lacks a description, a table lacks headers, or a list lost
its structure until a separate audit finds it.

## What A11yFirst expects

The A11yFirst editor keeps CKEditor's Accessibility Checker and expects it to
find fewer issues because the authoring features prevent them. A checker should
identify the issue, explain it, and point to the affected content.

## Current BlockNote behavior

No accessibility checker, audit command, or issue panel was observed in the
tested BlockNote surfaces. The lab's axe and Guidepup runs are **external
checks**; they do not give the author an in-product result. This is a product
gap, not a claim that external checking is useless.

## Evidence

- Manual inspection of the editor toolbar, side menu, and block controls; no
  checker entry point observed.
- `tests/a11y/axe.spec.mjs` runs axe externally; it is not an editor feature.
- `tests/a11y/guidepup.spec.mjs` runs a simulator externally; it is not an editor
  feature.
- The comparator's own observations/checklists are lab tooling, not BlockNote UI.

## Acceptance criteria

- [ ] The editor can check the current document for the supported issue classes.
- [ ] Results identify the affected block and explain the problem in plain language.
- [ ] Results are reachable by keyboard and associated with the content.
- [ ] The author can dismiss or defer a result without losing it silently.
- [ ] The checker does not claim conformance or replace human review.
- [ ] A regression test runs the checker on a document with a missing alt and a
      headerless table and asserts both results.

## Suggested direction (upstream)

Start with a narrow, deterministic check set (image alt, table header presence,
empty headings, list wrappers) and an issue panel. Keep the result wording
separate from the rule id, and make the panel an accessible list with actions.

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
