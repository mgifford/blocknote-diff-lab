# B-04: Accessibility properties and options (B.2.2.1, B.2.2.2)

- **Status:** Product gap — verified on current main
- **Area:** BlockNote editor / current main, block and inline controls
- **ATAG 2.0:** B.2.2.1 Accessible Option Prominence (Level A to meet WCAG A); B.2.2.2 Setting Accessibility Properties (Level A to meet WCAG A)
- **WCAG 2.2:** 1.1.1, 1.3.1 (depending on the property)
- **Evidence basis:** Manual inspection and automated tests
- **Recorded:** 2026-11-24 against current main (`9cb988f`)

## Why this matters

Even when a property exists in the data model, an author cannot use it if the UI
does not expose it. B.2.2.2 requires a way to set accessibility properties;
B.2.2.1 requires the accessible option to be at least as prominent as the
inaccessible one.

## What ATAG 2.0 requires

- **B.2.2.1** when authoring actions have the same outcome, the option that
  produces accessible content is at least as prominent as the one that does not.
- **B.2.2.2** if the author can set an accessibility property, the tool provides
  a way to do so.

## Current BlockNote behavior

- Image: no alt-text control observed in the image/file UI; the image renders
  with `alt=""`.
- Table: header rows/columns are settable through the documented table options
  (`headers: true`, `headerRows`, `headerCols`), but the table has no
  `scope`/`id`/`headers` relationship output and no observed caption/name
  control.
- Table options that affect readability (merges, colors, alignment) are present
  without equivalent prominence for header relationships.
- No accessibility-property panel was observed for the blocks tested.

This is a product gap for the tested surfaces. It is not a claim about every
BlockNote block or every consumer integration.

## Evidence

- [AF-02](a11yfirst-02-image-alt-authoring.md), [AF-07](a11yfirst-07-table-structure.md) —
  concrete behavior and tests.
- `docs/content/docs/features/blocks/tables.mdx` in the upstream source documents
  `headers: true`, `headerRows`, and `headerCols`; it does not document
  `scope`/`id`/`headers` output or a caption property.
- `tests/a11y/semantics.spec.mjs` — property absence/presence in the DOM.
- Manual inspection of the image and table controls.

## Acceptance criteria

- [ ] Image alt text is settable from the image controls.
- [ ] Table header rows/columns and caption/name are settable from the table UI.
- [ ] The accessible option is at least as prominent as the visual-only options.
- [ ] The property has a visible label, not only a tooltip or icon.
- [ ] The resulting structure is serialized (for example `scope`/`id`/`headers`).
- [ ] A keyboard-only author can reach and operate the controls.

## Suggested direction

Add the properties where authors already work (image controls, table controls),
not in a separate settings page. If a property is not supported, do not expose an
option that silently does nothing.

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
