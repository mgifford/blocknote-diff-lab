# AF-02: Image text-alternative authoring

- **Status:** Product gap — verified on current main
- **Area:** BlockNote editor / current main, image and file blocks
- **A11yFirst:** Alternative text for images
- **ATAG 2.0:** B.2.1.1 Accessible Content Possible; B.2.2.2 Setting Accessibility Properties; B.2.3.1 Alternative Content is Editable
- **WCAG 2.2:** 1.1.1 Non-text Content
- **Evidence basis:** Automated (axe, Virtual Screen Reader), DOM inspection, live MCP inspection
- **Recorded:** 2026-11-24 against current main (`9cb988f`)

## Why this matters

An image without a text alternative is announced as nothing useful, or skipped,
by screen readers. The author is the only person who knows the image's purpose;
if the editor does not ask for a description, the published document will not
have one.

## What A11yFirst expects

The authoring workflow asks for an image's text alternative, explains when an
empty alternative is appropriate (decorative images), and keeps the alternative
with the image through editing and export. A11yFirst lists image text
alternatives as a core authoring feature.

## Current BlockNote behavior

On the current-main Default Schema Showcase, the editor renders the image with
`alt=""`. No alt-text field or repair prompt was observed in the image/file
controls during this lab's inspection. The image is treated as presentational by
axe and is not announced by Virtual Screen Reader; only the visible caption is
spoken.

An upstream pull request preview shows a URL-derived fallback, but this record
describes current main and does not evaluate that PR.

## Evidence

- `tests/a11y/semantics.spec.mjs` — before: one image, `alt=""`, not named.
- `tests/a11y/guidepup.spec.mjs` — current main: no `image, …` announcement;
  upstream preview context (not evaluated): `image, 332x322.jpg`.
- `tests/a11y/axe.spec.mjs` — axe does **not** fire `image-alt` for `alt=""`;
  the blind spot is asserted explicitly.
- Playwright MCP, current-main preview:
  `[...document.querySelectorAll('.bn-editor img')]` → `[{ alt: "", named: false }]`.
- Upstream issue: <https://github.com/TypeCellOS/BlockNote/issues/2822>.

## Acceptance criteria

- [ ] Selecting an image exposes a clear, labeled text-alternative control.
- [ ] The control explains the difference between meaningful and decorative
      images in plain language.
- [ ] The alternative is persisted in the document model and serialized output.
- [ ] A missing alternative is identifiable before publishing, not only after.
- [ ] A regression test sets an alternative, exports the document, and confirms
      the alternative survives.
- [ ] The author can deliberately mark an image decorative.

## Suggested direction (upstream)

Add alt text to the image/file block properties and expose it in the image
controls. Use the URL fallback only as a safety net, never as a substitute for an
author-provided description. Coordinate with the open upstream image work as
context; do not treat this lab's preview tests as a PR review.

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
- [A11yFirst demo](https://a11yfirst.gitlab.io/custom/a11yfirst.html)
- [A11yFirst CKEditor plugins](https://github.com/a11yfirst/ckeditor-plugins)
