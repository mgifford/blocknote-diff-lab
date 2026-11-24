# AF-08: List semantics in reading output

- **Status:** Product gap — verified in read-only output
- **Area:** BlockNote editor / current main, read-only rendering
- **A11yFirst:** Structure first — semantic lists
- **ATAG 2.0:** B.2.1.1 Accessible Content Possible
- **WCAG 2.2:** 1.3.1 Info and Relationships
- **Evidence basis:** Automated (DOM, Guidepup Virtual Screen Reader)
- **Recorded:** 2026-11-24 against current main (`9cb988f`)

## Why this matters

When list items are rendered as generic paragraphs, a screen reader does not
announce "list, 4 items" or "list item 2 of 4". The user loses item count,
nesting, and the ability to navigate by list. In read-only or published output,
this is the structure the end user receives.

## What A11yFirst expects

Bullet, numbered, and check lists should be real lists in the output, with list
and listitem roles and correct nesting. The authoring tool should preserve the
semantics through reading mode and export.

## Current BlockNote behavior

In the current-main Read-only Editor example, the content contains bullet,
numbered, check, and toggle list items, but the DOM has **zero `ul`, `ol`, and
`li` elements** inside the editor. Virtual Screen Reader announces the item text
as paragraphs and does not announce list or listitem roles.

## Evidence

- `tests/a11y/semantics.spec.mjs` — `ul=0`, `ol=0`, `li=0`, `contenteditables=0`;
  the four "List Item" texts are present.
- `tests/a11y/guidepup.spec.mjs` — no `list`/`listitem` phrases; item text is
  spoken among `paragraph` phrases.
- Upstream issue: #2809.

## Acceptance criteria

- [ ] Read-only output uses list containers and list items with correct nesting.
- [ ] The list type (bullet, numbered, check) is conveyed, not only the text.
- [ ] Toggle list items expose their expanded/collapsed state and name.
- [ ] Export and reading mode produce the same list semantics.
- [ ] A regression test checks roles, nesting, and item count in read-only mode.
- [ ] Screen-reader navigation by list works; this lab records the simulator
      evidence only and does not claim real-AT confirmation.

## Suggested direction (upstream)

Render list blocks into semantic list containers (possibly via a read-only
renderer or plugin, as the upstream discussion suggests). Preserve the block
model; do not flatten it into paragraphs.

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
