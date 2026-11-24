# AF-05: In-product author help

- **Status:** Product gap — no in-editor help surface observed
- **Area:** BlockNote editor / current main
- **A11yFirst:** A11yFirst Help — explanations of how to use the features and why they matter
- **ATAG 2.0:** B.4.2.2 Feature Instructions; B.4.2.3 Tutorial; A.4.2.1/A.4.2.2
- **WCAG 2.2:** 3.3.5 Help (AAA); 3.2.4 Consistent Identification
- **Evidence basis:** Manual inspection
- **Recorded:** 2026-11-24 against current main (`9cb988f`)

## Why this matters

Most authors are not accessibility specialists. If the editor does not explain
why a heading level, image description, table header, or list structure matters,
the accessible option looks like extra work. A11yFirst treats help as part of the
authoring interface, not a separate manual.

## What A11yFirst expects

A11yFirst Help provides in-context explanations of its features and the
accessibility reason behind each one, with keyboard shortcuts and links to
further guidance. The help is available while authoring, not only in external
documentation.

## Current BlockNote behavior

The playground surfaces tested in this lab provide block controls, a formatting
toolbar, and a side menu, but no in-editor accessibility help or "why this
matters" guidance. BlockNote documentation exists externally, but it is not
linked from the tested authoring controls. This record does not claim that the
external documentation is inadequate; it records the absence of in-product help
in the tested surfaces.

## Evidence

- Manual inspection of the editor toolbar, block menu, and link/image controls;
  no help entry point observed.
- No test in `tests/a11y/` covers help content.
- The lab's own docs are not BlockNote's authoring help and are not a substitute.

## Acceptance criteria

- [ ] Each accessibility-related authoring control has an in-context explanation.
- [ ] The explanation says what the feature does and why it matters to readers.
- [ ] Help is keyboard reachable, named, and dismissible.
- [ ] Help does not rely on hover alone.
- [ ] A help index or search is available for the authoring features.
- [ ] The help content is included in the authoring documentation.

## Suggested direction (upstream)

Add an "Accessibility help" entry point next to the existing block/format
controls, modeled on A11yFirst Help. Reuse the same explanations in external
documentation so the two do not drift.

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
