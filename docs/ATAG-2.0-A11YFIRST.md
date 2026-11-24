# ATAG 2.0 and A11yFirst evidence map

This document maps the lab's automated checks to **ATAG 2.0 Part A** (the authoring
UI is accessible to authors) and **Part B** (the authoring tool supports the
production of accessible content). It also records how the checks relate to the
A11yFirst model.

> **This is an evidence map, not a conformance claim.** ATAG 2.0 conformance
> requires a defined authoring-tool scope, all applicable success criteria, and
> human/AT verification. The lab tests a small set of BlockNote authoring
> surfaces and the comparison page. It does not claim ATAG A or AA conformance.
>
> **Scope boundary:** this lab records current-main evidence and gaps. It does
> **not** review, approve, reject, or otherwise evaluate an upstream pull
> request, and it does **not** perform real screen-reader or testing-with-disabled-
> people evaluation. Upstream PR previews are context only; real AT is a separate
> activity outside this lab.
>
> The per-gap records are in the **[gap register](gaps/README.md)**.

## North star

- [A11yFirst for CKEditor demo](https://a11yfirst.gitlab.io/custom/a11yfirst.html)
- [A11yFirst organisation](https://github.com/a11yfirst)
- [A11yFirst CKEditor plugins](https://github.com/a11yfirst/ckeditor-plugins)
- [CKEditor 5 A11yFirst plugin work](https://github.com/mgifford/A11yFirst-CKEditor5-Plugin)
- [CKEditor 5 A11yFirst integration](https://github.com/mgifford/CKEditor5-A11yFirst)
- [ATAG 2.0 Recommendation](https://www.w3.org/TR/ATAG20/)

A11yFirst's operating principle is that the authoring environment should support
accessibility **by default**, during authoring, rather than relying on a later
repair sweep. Its visible features include heading-level guidance, structured
block formats, image text alternatives, meaningful link text, author help, and an
accessibility checker.

BlockNote does not yet provide an A11yFirst-style authoring assistant. The tests
below record where current main fails by default. Where an upstream PR preview
shows a different result, it is context only; this lab does not evaluate the PR.

## Test layers

| Command | What it runs | Network |
| --- | --- | --- |
| `pnpm test:a11y:local` | axe on the four local #2854 bundles, comparator shell, and real-keyboard #2854 focus/activation tests | No |
| `pnpm test:a11y:previews` | axe and Guidepup Virtual Screen Reader against current main and upstream preview context; semantic DOM checks | Yes |
| `pnpm test:a11y:axe` | axe tests only | Mixed |
| `pnpm test:a11y:guidepup` | Virtual Screen Reader tests only | Yes |
| `pnpm test:a11y:keyboard` | #2854 keyboard focus and activation | No |
| `pnpm test:a11y:semantics` | alt text, table headers, list wrappers | Yes |
| `pnpm test:a11y` | Everything | Mixed |

Every run writes raw JSON evidence under `reports/a11y/<timestamp>/`. The tests
use Playwright real keyboard events, axe-core, and Guidepup
`@guidepup/virtual-screen-reader`. They are automated evidence only; real AT and
testing with disabled people are out of scope for this lab.

## ATAG 2.0 Part A — authoring UI accessibility

| Checkpoint | Level | Lab evidence | Status |
| --- | --- | --- | --- |
| [A.1.1.1 Web-Based Accessible (WCAG)](https://www.w3.org/TR/ATAG20/#sc_a111) | A | `axe.spec.mjs` scans the comparator shell and all four #2854 bundles. The shell has no WCAG A/AA violations; every editor bundle exposes the known `aria-input-field-name` finding on `.tiptap` | **Partial** — the editor textbox still lacks an accessible name |
| [A.2.1.1 Text Alternatives for Rendered Non-Text Content](https://www.w3.org/TR/ATAG20/#sc_a211) | A | `guidepup.spec.mjs` shows the current-main #2822 image is not announced. The upstream preview context announces `image, 332x322.jpg`, but it is not evaluated here | **Gap** — the current-main authoring UI has no alt control |
| [A.3.1.1 Keyboard Access (Minimum)](https://www.w3.org/TR/ATAG20/#sc_a311) | A | `keyboard-2854.spec.mjs`: before the fix, Tab reaches a dead closing Add block clone; the inert variant moves focus to the next real control. Activation variant makes Enter open the suggestion menu | **Partial** — the side menu is still pointer-hover-dependent |
| [A.3.1.2 No Keyboard Traps](https://www.w3.org/TR/ATAG20/#sc_a312) | A | The same keyboard trace shows Tab leaving the editor and reaching the parent focus control in the inert variant | **Tested for this path** |
| [A.3.4.1 Navigate By Structure](https://www.w3.org/TR/ATAG20/#sc_a341) | A | Virtual Screen Reader traversal announces headings, tables, rows, and cells in the Default Schema example | **Partial** — table header association is not exposed by the virtual reader; real AT is out of scope here |
| [A.4.2.1 Describe Accessibility Features](https://www.w3.org/TR/ATAG20/#sc_a421) | A | This document and the README describe the comparison, scripts, and known limits | **Lab documentation only** |
| [A.4.2.2 Document All Features](https://www.w3.org/TR/ATAG20/#sc_a422) | AA | README, `docs/STATIC-COMPARATOR.md`, issue files, and this map | **Lab documentation only** |

## ATAG 2.0 Part B — support for accessible content

Part B is recorded as a gap backlog, not as an evaluation of any upstream PR.
Every success criterion is mapped in the [gap register coverage table](gaps/README.md#atag-20-part-b-coverage).

| Checkpoint cluster | Level | Gap record | Current-main status |
| --- | --- | --- | --- |
| B.1.1.1–B.1.1.2 auto-generated content | A (WCAG-dependent) | [B-01](gaps/atag-b-01-auto-generated-content.md) | Evidence gap |
| B.1.2.1–B.1.2.4 transformations/copy-paste | A (WCAG-dependent) | [B-02](gaps/atag-b-02-transform-preservation.md) | Evidence gap |
| B.2.1.1 accessible content possible | A (WCAG-dependent) | [B-03](gaps/atag-b-03-accessible-content-possible.md) | **Product gap** — image alt, table headers, list wrappers |
| B.2.2.1–B.2.2.2 accessible options/properties | A (WCAG-dependent) | [B-04](gaps/atag-b-04-accessibility-properties.md) | **Product gap** |
| B.2.3.1–B.2.3.3 alternative content editable/repaired/reused | A / AAA | [B-05](gaps/atag-b-05-alternative-content.md) | **Product gap**, AAA for reuse |
| B.2.4.1–B.2.5.2 templates/pre-authored content | A / AA / AAA | [B-06](gaps/atag-b-06-templates-pre-authored.md) | **Product/evidence gap**; templates N/A in tested surfaces |
| B.3.1.1–B.3.1.5 checking assistance | A / AA | [B-07](gaps/atag-b-07-checking-assistance.md) | **Product gap** — no in-product checker |
| B.3.2.1 repair assistance | A (WCAG-dependent) | [B-08](gaps/atag-b-08-repair-assistance.md) | **Product gap** |
| B.4.1.1–B.4.1.4 features by default | A / AA | [B-09](gaps/atag-b-09-features-by-default.md) | **Product gap** |
| B.4.2.1–B.4.2.4 documentation | A / AAA | [B-10](gaps/atag-b-10-documentation.md) | Evidence gap |

Concrete current-main occurrences are recorded in
[AF-02](gaps/a11yfirst-02-image-alt-authoring.md) (image alt),
[AF-07](gaps/a11yfirst-07-table-structure.md) (table headers), and
[AF-08](gaps/a11yfirst-08-list-structure.md) (lists).

## A11yFirst principle mapping

| A11yFirst principle | What the lab records | Gap record |
| --- | --- | --- |
| **Heading guidance** | No outline/level validation observed; not yet tested for skipped levels | [AF-01](gaps/a11yfirst-01-heading-guidance.md) |
| **Text alternatives for images** | Current-main image is `alt=""` and silent to the virtual reader | [AF-02](gaps/a11yfirst-02-image-alt-authoring.md) |
| **Meaningful link text** | No guidance/check observed; not yet tested | [AF-03](gaps/a11yfirst-03-link-text.md) |
| **Language of passages** | No language marking; upstream report #2823, not reproduced here | [AF-04](gaps/a11yfirst-04-language-of-parts.md) |
| **Author help** | No in-editor help surface observed | [AF-05](gaps/a11yfirst-05-author-help.md) |
| **Built-in accessibility checking** | No in-product checker observed; lab checks are external | [AF-06](gaps/a11yfirst-06-in-product-checking.md) |
| **Table structure** | No `scope`/`id`/`headers`; no caption control observed | [AF-07](gaps/a11yfirst-07-table-structure.md) |
| **List structure** | Read-only output has no `ul`/`ol`/`li` | [AF-08](gaps/a11yfirst-08-list-structure.md) |
| **Accessible by default** | The default path produces the barriers above | [AF-09](gaps/a11yfirst-09-accessible-by-default.md) |

## What axe can and cannot prove here

The axe tests are deliberate about detector limits:

- **#2822:** axe does **not** fire `image-alt` for the before state, because the
  editor renders `alt=""` and the image is treated as presentational. The test
  asserts that blind spot and relies on Guidepup for the spoken difference.
- **#2825/#2826:** axe does **not** distinguish the header relationships with
  its standard rules. The test records the failure and relies on DOM assertions
  (`th[scope]`, `th[id]`, `td[headers]`). Real AT is out of scope here.
- **#2809:** axe does **not** flag the absence of list wrappers when the markup
  contains no lists. The test asserts the absence and relies on Guidepup to show
  that the items are spoken as paragraphs.

Axe is therefore a regression guard for the editor UI and an evidence source, not
a substitute for the semantic assertions or screen-reader testing.

## Out of scope

The following are outside this lab's scope. They are not deferred work items for
this repository; they are separate activities for the product team or an
independent evaluation:

- **Real screen-reader evaluation** (VoiceOver, NVDA, JAWS, Orca) and testing with
  disabled people. Guidepup Virtual Screen Reader is a simulator, not a
  substitute. The tables above therefore say "virtual reader" where that is what
  was measured.
- **Upstream PR review.** This lab does not approve, reject, or validate a pull
  request. PR previews are used only as upstream context for a before/after
  comparison; the gap records describe current main.
- **Fixing BlockNote or committing upstream work.** The gap records propose
  directions, not accepted changes.
- **ATAG conformance certification.** This map is evidence, not a claim.

## Related files

- [`tests/a11y/axe.spec.mjs`](../tests/a11y/axe.spec.mjs)
- [`tests/a11y/guidepup.spec.mjs`](../tests/a11y/guidepup.spec.mjs)
- [`tests/a11y/keyboard-2854.spec.mjs`](../tests/a11y/keyboard-2854.spec.mjs)
- [`tests/a11y/semantics.spec.mjs`](../tests/a11y/semantics.spec.mjs)
- [`docs/gaps/README.md`](gaps/README.md) — the gap register
- [`docs/STATIC-COMPARATOR.md`](STATIC-COMPARATOR.md)
- [`reports/ISSUE-INVENTORY.md`](../reports/ISSUE-INVENTORY.md)
