# Accessibility support and test scope

Last reviewed: 2026-11-25. This page records what the lab actually exercises and
what a result must not be generalized to.

## Tested stack

| Layer | Tested | Not tested |
| --- | --- | --- |
| Browser engine | Chromium 148.0.7778.96 through Playwright 1.60.0 | Firefox, Safari/WebKit, Edge |
| OS / runner | macOS arm64 (local); Ubuntu 24.04 (GitHub Actions) | Windows, iOS, Android |
| Editor UI | BlockNote upstream previews with the Mantine UI | Ariakit, shadcn, custom consumer shells |
| Assistive technology | Guidepup Virtual Screen Reader only | VoiceOver, NVDA, JAWS, Orca, real disabled participants |
| Output formats | HTML (paste, copy event, HTML export) | PDF/UA, DOCX, ODT, Markdown, email |
| Input | Keyboard and pointer basics; axe; virtual screen reader | Switch input, speech recognition, touch gestures |
| Themes | Light/dark capture checks; forced-colors spot checks | Full high-contrast and platform-setting matrix |

## Surfaces

- The static comparator in `_site` (GitHub Pages).
- The four #2854 bundles: base, inert, activation, read-only.
- The current-main BlockNote preview for #2822, #2825, #2826, #2809 and #977.
- The HTML export and minimal-editor examples.

## How to read a result

- A Chromium/Mantine result is **not** a claim that every BlockNote integration
  or output format supports the same behavior.
- ATAG rows name the tested surface and the evidence command.
- Real assistive-technology testing and testing with disabled people are outside
  this lab's scope. The Virtual Screen Reader is a proxy, not a substitute.
- This lab makes no ATAG conformance claim. See
  [ATAG alignment issues](ATAG-ALIGNMENT-ISSUES.md) and
  [the evidence map](ATAG-2.0-A11YFIRST.md).

## Related scope decisions

- [ALIGN-13](ATAG-ALIGNMENT-ISSUES.md#align-13-accessibility-support-and-technology-scope-are-narrow)
  — this support matrix.
- [ALIGN-16](ATAG-ALIGNMENT-ISSUES.md#align-16-a-content-component-result-is-not-a-host-product-atag-result)
  — component vs host-product scope.
- [Evidence retention](EVIDENCE.md) — what is kept and for how long.
