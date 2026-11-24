# B-05: Alternative content can be edited, repaired, and reused (B.2.3.1–B.2.3.3)

- **Status:** Product gap — B.2.3.1 and B.2.3.2; AAA for B.2.3.3
- **Area:** BlockNote editor / current main, image and file blocks
- **ATAG 2.0:** B.2.3.1 Alternative Content is Editable (Level A to meet WCAG A); B.2.3.2 Automating Repair of Text Alternatives (Level A); B.2.3.3 Save for Reuse (Level AAA)
- **WCAG 2.2:** 1.1.1 Non-text Content
- **Evidence basis:** Automated (Guidepup, DOM) and manual inspection
- **Recorded:** 2026-11-24 against current main (`9cb988f`)

## Why this matters

An author who inherits a document with undescribed images needs to edit the
alternative, not just know that it is missing. Repairing one image and reusing
the description is the difference between a fix and a repetitive chore.

## What ATAG 2.0 requires

- **B.2.3.1** the alternative content for non-text content is editable.
- **B.2.3.2** when the tool can automatically generate a text alternative, the
  author can edit it.
- **B.2.3.3 (AAA)** alternatives can be saved for reuse.

## Current BlockNote behavior

Current main has no alt control observed, so the alternative is not editable
(B.2.3.1). There is no repair workflow or saved-alternative library observed
(B.2.3.2/B.2.3.3). An upstream preview shows a URL-derived fallback; that is
context only and is not evaluated here. A generated fallback would still need to
be editable to meet B.2.3.2.

## Evidence

- `tests/a11y/semantics.spec.mjs` — current-main image `alt=""`, not named.
- `tests/a11y/guidepup.spec.mjs` — image is not announced on current main.
- Manual inspection: no edit/reuse control for image alternatives.

## Acceptance criteria

- [ ] An existing image's text alternative can be edited.
- [ ] An automatically generated fallback is presented as a draft the author can
      edit, not as a final value.
- [ ] The author can mark an image decorative.
- [ ] The author can reuse a previously saved alternative (AAA stretch).
- [ ] A regression test edits an alternative, re-exports, and verifies the value.
- [ ] Repair is possible for an imported image, not only a newly inserted one.

## Suggested direction

Implement B.2.3.1 first; it is the prerequisite for any generated fallback to be
useful. Add reuse only after the basic edit/serialize path is reliable.

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
