# ATAG 2.0 and A11yFirst evidence map

This document maps the lab's automated checks to **ATAG 2.0 Part A** (the authoring
UI is accessible to authors) and **Part B** (the authoring tool supports the
production of accessible content). It also records how the checks relate to the
A11yFirst model.

> **This is an evidence map, not a conformance claim.** ATAG 2.0 conformance
> requires a defined authoring-tool scope, all applicable success criteria, and
> human/AT verification. The lab tests a small set of BlockNote authoring
> surfaces and the comparison page. It does not claim ATAG A or AA conformance.

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
below show where it fails by default and where the open PRs improve it.

## Test layers

| Command | What it runs | Network |
| --- | --- | --- |
| `pnpm test:a11y:local` | axe on the four local #2854 bundles, comparator shell, and real-keyboard #2854 focus/activation tests | No |
| `pnpm test:a11y:previews` | axe and Guidepup Virtual Screen Reader against current-main and PR previews; semantic DOM checks | Yes |
| `pnpm test:a11y:axe` | axe tests only | Mixed |
| `pnpm test:a11y:guidepup` | Virtual Screen Reader tests only | Yes |
| `pnpm test:a11y:keyboard` | #2854 keyboard focus and activation | No |
| `pnpm test:a11y:semantics` | alt text, table headers, list wrappers | Yes |
| `pnpm test:a11y` | Everything | Mixed |

Every run writes raw JSON evidence under `reports/a11y/<timestamp>/`. The tests
use Playwright real keyboard events, axe-core, and Guidepup
`@guidepup/virtual-screen-reader`; none of them replaces a real screen reader or
testing with disabled people.

## ATAG 2.0 Part A — authoring UI accessibility

| Checkpoint | Level | Lab evidence | Status |
| --- | --- | --- | --- |
| [A.1.1.1 Web-Based Accessible (WCAG)](https://www.w3.org/TR/ATAG20/#sc_a111) | A | `axe.spec.mjs` scans the comparator shell and all four #2854 bundles. The shell has no WCAG A/AA violations; every editor bundle exposes the known `aria-input-field-name` finding on `.tiptap` | **Partial** — the editor textbox still lacks an accessible name |
| [A.2.1.1 Text Alternatives for Rendered Non-Text Content](https://www.w3.org/TR/ATAG20/#sc_a211) | A | `guidepup.spec.mjs` shows the #2822 before image is not announced; the PR preview announces `image, 332x322.jpg` | **Partial** — the PR supplies a fallback; the authoring UI still needs an alt control |
| [A.3.1.1 Keyboard Access (Minimum)](https://www.w3.org/TR/ATAG20/#sc_a311) | A | `keyboard-2854.spec.mjs`: before the fix, Tab reaches a dead closing Add block clone; the inert variant moves focus to the next real control. Activation variant makes Enter open the suggestion menu | **Partial** — the side menu is still pointer-hover-dependent |
| [A.3.1.2 No Keyboard Traps](https://www.w3.org/TR/ATAG20/#sc_a312) | A | The same keyboard trace shows Tab leaving the editor and reaching the parent focus control in the inert variant | **Tested for this path** |
| [A.3.4.1 Navigate By Structure](https://www.w3.org/TR/ATAG20/#sc_a341) | A | Virtual Screen Reader traversal announces headings, tables, rows, and cells in the Default Schema example | **Partial** — table header association is not exposed by the virtual reader; real AT is required |
| [A.4.2.1 Describe Accessibility Features](https://www.w3.org/TR/ATAG20/#sc_a421) | A | This document and the README describe the comparison, scripts, and known limits | **Lab documentation only** |
| [A.4.2.2 Document All Features](https://www.w3.org/TR/ATAG20/#sc_a422) | AA | README, `docs/STATIC-COMPARATOR.md`, issue files, and this map | **Lab documentation only** |

## ATAG 2.0 Part B — support for accessible content

| Checkpoint | Level | Lab evidence | Status |
| --- | --- | --- | --- |
| [B.2.1.1 Accessible Content Possible (WCAG)](https://www.w3.org/TR/ATAG20/#sc_b211) | A | `semantics.spec.mjs`: #2822 before has only `alt=""`; #2825/#2826 before has no `th[scope]`, `th[id]`, or `td[headers]`; after the PR previews all are present | **Partial** — PRs #3337 and #3215 are open, not merged |
| [B.2.2.2 Setting Accessibility Properties (WCAG)](https://www.w3.org/TR/ATAG20/#sc_b222) | A | PR #3337 supplies the image alt fallback; PR #3215 serialises table header relationships | **Partial** — depends on the open PRs |
| [B.2.3.1 Alternative Content is Editable (WCAG)](https://www.w3.org/TR/ATAG20/#sc_b231) | A | The #2822 PR preview image has a fallback name; the current main image does not | **Partial** — fallback is not the same as an editable authoring field |
| [B.1.2.4 Text Alternatives Preserved](https://www.w3.org/TR/ATAG20/#sc_b124) | A | Not yet tested through copy/paste or export | **Not tested** |
| [B.3.1.1 Checking Assistance (WCAG)](https://www.w3.org/TR/ATAG20/#sc_b311) | A | BlockNote has no in-product accessibility checker; the lab's axe/Guidepup runs are external | **Not met by BlockNote** |
| [B.3.2.1 Repair Assistance (WCAG)](https://www.w3.org/TR/ATAG20/#sc_b321) | A | The PR's alt fallback derives a name from the URL; it does not guide a repair | **Partial / not verified** |
| [B.4.1.1 Features Active by Default](https://www.w3.org/TR/ATAG20/#sc_b411) | A | No authoring feature is enabled by default that prevents the tested barriers | **Not met** |
| [B.4.2.1 Model Practice (WCAG)](https://www.w3.org/TR/ATAG20/#sc_b421) | A | The docs model names, structure, and known limits, but BlockNote's own authoring UI is unchanged | **Lab documentation only** |

## A11yFirst principle mapping

| A11yFirst principle | What the lab tests | Outcome |
| --- | --- | --- |
| **Structure first** — headings, lists, tables | `semantics.spec.mjs` (table headers), `guidepup.spec.mjs` (heading/table traversal), #2809 list wrappers | Tables are repaired by PR #3215; read-only lists still lack `ul`/`ol`/`li` |
| **Text alternatives for images** | `guidepup.spec.mjs` and `semantics.spec.mjs` for #2822 | Current main is silent; PR #3337 adds a fallback name |
| **Meaningful link text** | Not covered by the current catalog | **Gap** |
| **Language of passages** | #2823 remains reproduction-only | **Gap** |
| **Accessible by default** | #2822/#2825/#2826 before/after | Only after the open PRs; not true on current main |
| **Author guidance and help** | A11yFirst's Help model; BlockNote has no equivalent in these surfaces | **Gap** |
| **Built-in accessibility checking** | The lab checks externally with axe and Guidepup; BlockNote does not check in-product | **Gap** |

## What axe can and cannot prove here

The axe tests are deliberate about detector limits:

- **#2822:** axe does **not** fire `image-alt` for the before state, because the
  editor renders `alt=""` and the image is treated as presentational. The test
  asserts that blind spot and relies on Guidepup for the spoken difference.
- **#2825/#2826:** axe does **not** distinguish the header relationships with
  its standard rules. The test records the failure and relies on DOM assertions
  (`th[scope]`, `th[id]`, `td[headers]`) and real AT for the announcement.
- **#2809:** axe does **not** flag the absence of list wrappers when the markup
  contains no lists. The test asserts the absence and relies on Guidepup to show
  that the items are spoken as paragraphs.

Axe is therefore a regression guard for the editor UI and an evidence source, not
a substitute for the semantic assertions or screen-reader testing.

## Real AT is still required

Guidepup Virtual Screen Reader is a simulator. It does **not** replace VoiceOver,
NVDA, JAWS, or testing with disabled people. For the real-AT tier:

```sh
npx @guidepup/setup install        # one-time screen reader setup
npx @guidepup/setup verify
```

Then run the relevant preview/editor in Safari or Chrome and record:

1. image announcement on #2822 before/after;
2. table header announcement on #2825/#2826 before/after, including the merged
   cell;
3. list/paragraph announcement on #2809;
4. Tab sequence and Add block activation on #2854.

Record the AT version, browser, OS, and date in the observation export. This is
manual evidence, not a conformance claim.

## Related files

- [`tests/a11y/axe.spec.mjs`](../tests/a11y/axe.spec.mjs)
- [`tests/a11y/guidepup.spec.mjs`](../tests/a11y/guidepup.spec.mjs)
- [`tests/a11y/keyboard-2854.spec.mjs`](../tests/a11y/keyboard-2854.spec.mjs)
- [`tests/a11y/semantics.spec.mjs`](../tests/a11y/semantics.spec.mjs)
- [`docs/STATIC-COMPARATOR.md`](STATIC-COMPARATOR.md)
- [`reports/ISSUE-INVENTORY.md`](../reports/ISSUE-INVENTORY.md)
