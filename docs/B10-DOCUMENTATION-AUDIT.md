# B-10 documentation audit

Targeted audit of BlockNote's author-facing documentation against ATAG
B.4.2.1–B.4.2.4. Last reviewed 2026-11-25 against current main.

This is **not** a full documentation audit and **not** a conformance claim. It
covers the pages most likely to model or teach an authoring decision.

## What was reviewed

| Page | What it models | Accessibility guidance |
| --- | --- | --- |
| `features/export/pdf.mdx` | Tagged PDF/UA export; title, `lang`, heading order, alt text from caption/filename | **Strong** — explains the reading impact, not only the option |
| `features/blocks/math.mdx` | Math alt text in email/PDF export | **Good** — explains the LaTeX alt fallback |
| `features/blocks/tables.mdx` | `headers: true`, `headerRows`, `headerCols`, cell colors | **Partial** — no `scope`/`id`/`headers`, caption, or authoring rationale |
| `react/components/image-toolbar.mdx` | File Panel, upload, `resolveFileUrl`; screenshot has meaningful alt | **Partial** — no authoring guidance for a meaningful image alternative |
| `react/components/hyperlink-toolbar.mdx` | Link Toolbar customization; screenshot uses `alt="image"` | **Gap** — generic screenshot alt and no link-text guidance |
| `features/blocks/list-types.mdx` | Bullet/numbered/check/toggle block types | **Gap** — no list semantics or reading-impact guidance |
| `features/localization.mdx` | UI dictionary/locales | **Gap** — UI language only; no content `lang` guidance |
| `features/export/html.mdx` | Lossy/full HTML export | **Gap** — warns about loss generally, not which accessibility information is lost |
| `features/collaboration/comments.mdx` | Comment keyboard submission | **Partial** — keyboard behavior only; no screen-reader or focus guidance |
| `react/components/suggestion-menus.mdx` | Menu items, badges, keyboard shortcut text | **Partial** — shortcut display, not keyboard interaction guidance |
| `getting-started/ariakit.mdx` | Ariakit UI package with an accessibility focus | **Partial** — package choice, not authoring guidance |
| `getting-started/index.mdx` | Setup and mobile compatibility | **Partial** — mobile viewport, not authoring accessibility |

## B.4.2 findings

### B.4.2.1 Model practice

- The PDF and math pages model accessibility well: language, heading order and
  alt text are explained with their reading impact.
- The Link Toolbar page uses `alt="image"` for a screenshot. That is a generic
  alternative and models the wrong pattern; the screenshot's purpose is the
  toolbar, not "an image".
- The table page shows header configuration as a developer option, not as a
  reason to use headers and not as `scope`/`headers` relationships.
- The list page is entirely block-shape reference; it does not model semantic
  lists or explain why list structure matters.
- No page models a meaningful image alternative, a descriptive link, or a
  content-language declaration.

### B.4.2.2 Feature instructions

Present in part:

- PDF export: title/language, headings, alt text.
- Math export: alt fallback.

Missing:

- How to write a meaningful image alternative.
- How to make link text meaningful.
- How to create and verify table header relationships.
- How to use list structure for navigation.
- How to mark content language (as opposed to UI locale).

### B.4.2.3 Tutorial

No task-based accessible-authoring tutorial was found.

### B.4.2.4 Instruction index

No instruction index or accessible-authoring landing page was found.

## What would improve the result

1. Fix the Link Toolbar screenshot alt text and audit other screenshot alts.
2. Add an accessible-authoring page that links image alt, table headers, lists,
   links and content language.
3. Add the reading impact to the table and list pages, not only the block shape.
4. Explain which accessibility information HTML export can lose.
5. Add a short task-based tutorial and an index that points to it.

## Limits

- This audit read 12 pages; it did not read every page in `docs/content/docs`.
- It evaluates documentation content, not whether the documented feature works.
- It does not review or approve upstream PRs and makes no upstream commitment.

## References

- [B-10 gap record](gaps/atag-b-10-documentation.md)
- [AF-05 author help](gaps/a11yfirst-05-author-help.md)
- [ATAG B.4.2.1–B.4.2.4](https://www.w3.org/TR/ATAG20/#sc_b421)
