# B-02: Transformations preserve accessibility (B.1.2.1–B.1.2.4)

- **Status:** Evidence gap — high priority
- **Area:** BlockNote editor / current main, copy/paste and export
- **ATAG 2.0:** B.1.2.1 Restructuring/re-coding transformations; B.1.2.2 Copy-paste inside the tool; B.1.2.3 Optimizations preserve accessibility; B.1.2.4 Text alternatives preserved
- **WCAG 2.2:** The level the output must meet (A/AA, WCAG-dependent)
- **Evidence basis:** Not assessed
- **Recorded:** 2026-11-24 against current main (`9cb988f`)

## Why this matters

Authors move content constantly: copy/paste inside the editor, import from HTML
or Markdown, export to HTML/Markdown/PDF/DOCX, and duplicate blocks. If a
transformation drops an image description, table header relationship, list
wrapper, or language tag, the content becomes less accessible without the author
noticing.

## What ATAG 2.0 requires

- **B.1.2.1** restructuring/re-coding transformations preserve accessibility
  information, or warn/check after the transformation.
- **B.1.2.2** copy/paste inside the tool preserves accessibility information when
  source and destination use the same technology.
- **B.1.2.3** optimizations preserve accessibility information.
- **B.1.2.4** text alternatives for non-text content are preserved.

## Current BlockNote behavior

The playground exposes copy/paste and several export paths (HTML, Markdown, PDF,
DOCX, ODT, email) in its examples. This lab has **not tested** whether those
paths preserve alt text, table `scope`/`headers`, list wrappers, or language. On
current main the source content already lacks some of that information, so a
preservation test cannot be meaningful until the authoring gap is fixed. This is
an evidence gap and a product risk, not a confirmed transformation failure.

## Evidence

- The export/interoperability examples exist in the upstream playground; see
  `docs/STATIC-COMPARATOR.md`.
- No test in `tests/a11y/` exercises copy/paste or export.
- Concrete source gaps: [AF-02](a11yfirst-02-image-alt-authoring.md),
  [AF-07](a11yfirst-07-table-structure.md), [AF-08](a11yfirst-08-list-structure.md).

## Acceptance criteria

- [ ] Copy/paste of an image block preserves its text alternative.
- [ ] Copy/paste of a table preserves header scopes/ids/headers relationships.
- [ ] Copy/paste of a list preserves list type and nesting.
- [ ] HTML export preserves alt text, table headers, list wrappers, and language.
- [ ] PDF/DOCX/ODT export preserves or explicitly warns about each of those.
- [ ] If information cannot be preserved, the author is warned or checked before
      publishing.
- [ ] Regression tests cover at least image, table, list, and language.

## Suggested direction

Add round-trip tests before adding more export formats. Fix the source model
first, then assert the same semantics in copy/paste and each export. Do not rely
on visual similarity as evidence of preservation.

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
