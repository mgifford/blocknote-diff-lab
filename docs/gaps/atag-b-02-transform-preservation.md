# B-02: Transformations preserve accessibility (B.1.2.1–B.1.2.4)

- **Status:** Partial product gap — copy/export preserve list/alt; model lacks content `lang` and explicit table relationships; OS clipboard verified headed
- **Area:** BlockNote editor / current main, copy/paste and export
- **ATAG 2.0:** B.1.2.1 Restructuring/re-coding transformations; B.1.2.2 Copy-paste inside the tool; B.1.2.3 Optimizations preserve accessibility; B.1.2.4 Text alternatives preserved
- **WCAG 2.2:** The level the output must meet (A/AA, WCAG-dependent)
- **Evidence basis:** Automated HTML paste (`transformations.spec.mjs`), HTML export (`export.spec.mjs`), copy-event (`copy-paste.spec.mjs`) and language/table export probes on 2026-11-25, plus source inspection and the [headed clipboard probe](../CLIPBOARD-MANUAL.md); other exports still not assessed
- **Recorded:** 2026-11-25 against current main (`9cb988f`)

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
DOCX, ODT, email) in its examples. The lab tested an HTML paste into the minimal
editor and an HTML export from the export example.

| Pasted HTML | Current-main result |
| --- | --- |
| `<img alt="A small cat">` | **Preserved** — the image block keeps `alt="A small cat"` |
| `<p lang="fr">` | **Dropped** — no `lang` attribute in the editor |
| `<ul><li>…</li></ul>` | **Dropped** — items become paragraphs; no `ul`/`ol`/`li` |
| `<th id="h1" scope="col">`, `<td headers="h1">` | **Dropped** — the table remains, but the header has no `id`/`scope` and the data cell has no `headers` |
| HTML export of a keyboard-created list | **Preserved/created** — the editor DOM has no `ul`/`li`, but the exported HTML contains `<ul><li><p>…</p></li></ul>` |
| HTML export of an image with `alt` | **Preserved** — exported `<img … alt="A small cat">` |
| Copy of an image + list (B.1.2.2) | **Preserved in copied HTML** — `alt="A small cat"` and `<ul><li>One</li><li>Two</li></ul>`; the editor DOM still has no list wrappers |
| Copy of a table (B.1.2.2) | **Header cells kept; no explicit relationships** — copied HTML has `<th>` but no `scope`/`td[headers]`; the source table also lacks them |
| Headed OS clipboard (B.1.2.2) | **Pass for image + list** — Chromium 148 copied both `text/html` and `text/plain`; HTML keeps `alt` and `ul/li` |
| Content language (B.1.2.1/B.1.2.2) | **No model** — the default schema has no `lang` property; paste drops it and export cannot emit it |
| Table export (B.1.2.1) | **`th` preserved; no explicit relationships** — exported HTML has `<th>` but no `scope`/`td[headers]`; the model has no such relationships |

This verifies a **B.1.2.1** partial product gap: HTML paste drops list,
table-relationship and language semantics, while HTML export and copy emit list
structure and image alt. **B.1.2.2** is a partial pass for copying an image and
list: the copied HTML has alt and `ul/li`, even though the editor DOM has no list
wrappers. Table copy keeps `<th>` cells but does not add `scope`/`headers`
relationships; the source table lacks them, so this is an authoring gap
(AF-07/B-04), not a copy loss. A headed Chromium 148 run copied both
`text/html` and `text/plain`, preserving the image alt and list on the OS
clipboard. **B.1.2.4** is a partial pass for image alt in paste, copy and HTML
export.

The default schema has **no content-language property**, and table content has
`headerRows`/`headerCols` but no `scope`/`id`/`headers` relationships. A
language-tagged or explicitly-related table fixture therefore cannot be authored
in the default schema. This is a **model gap**, not a missing test. B.1.2.3
(optimizations) and the PDF/DOCX/ODT/email export paths remain untested.

## Evidence

- `tests/a11y/transformations.spec.mjs` — dispatches an HTML paste into the
  current-main minimal editor and records the resulting DOM.
- `tests/a11y/export.spec.mjs` — creates a bullet list, pastes an image, and
  pastes a language/table fragment into the HTML export example, then inspects
  the exported `<pre>`.
- `tests/a11y/copy-paste.spec.mjs` — captures the `copy` event’s `text/html`
  after selecting a seeded image + list, and after selecting the advanced table.
- [`scripts/check-clipboard-headed.mjs`](../scripts/check-clipboard-headed.mjs)
  and [the headed clipboard protocol](../CLIPBOARD-MANUAL.md) — reads the OS
  clipboard in headed Chromium.
- `packages/core/src/blocks/Table/block.ts` and
  `packages/core/src/schema/blocks/types.ts` — table content exposes
  `headerRows`/`headerCols`, not `scope`/`id`/`headers`.
- No `lang` prop exists in the block prop schemas; only the code block has a
  `language` prop.
- Raw evidence: `reports/a11y/<timestamp>/b02-html-paste.json`,
  `b02-html-export.json`, `b02-copy-image-list.json` and
  `b02-language-table-export.json`.
- Concrete source gaps: [AF-02](a11yfirst-02-image-alt-authoring.md),
  [AF-07](a11yfirst-07-table-structure.md), [AF-08](a11yfirst-08-list-structure.md).

## Still untested

- **B.1.2.2** language copy and explicit table relationships are **not testable**
  until the default schema represents them. The OS clipboard is verified headed,
  but not gated in CI; headless Chromium exposes only `text/plain`.
- **B.1.2.3** optimizations.
- Markdown, PDF, DOCX, ODT and email export.
- Table-relationship and language export from a document that contains them.
- Whether the author is warned/checked when a transformation drops information.

## Acceptance criteria

- [ ] Copy/paste of an image block preserves its text alternative.
- [ ] Copy/paste of a table preserves header scopes/ids/headers relationships.
- [ ] Content language can be authored and survives copy/export.
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
- [ATAG 2.0 alignment issues](../ATAG-ALIGNMENT-ISSUES.md)
- [ATAG 2.0 Recommendation](https://www.w3.org/TR/ATAG20/)
