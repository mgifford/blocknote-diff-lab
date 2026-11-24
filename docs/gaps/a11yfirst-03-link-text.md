# AF-03: Meaningful link-text guidance

- **Status:** Product gap — verified on current main
- **Area:** BlockNote editor / current main, link toolbar
- **A11yFirst:** Meaningful link text
- **ATAG 2.0:** B.2.2.2 Setting Accessibility Properties
- **WCAG 2.2:** 2.4.4 Link Purpose (In Context); 2.4.9 Link Purpose (Link Only)
- **Evidence basis:** Automated authoring probe (`tests/a11y/a11yfirst.spec.mjs`) and manual observation
- **Recorded:** 2026-11-24 against current main (`9cb988f`)

## Why this matters

"Click here" or a raw URL tells a screen-reader user nothing about the
destination when links are read out of context. A list of links is a common
navigation path, so the link text must carry the purpose.

## What A11yFirst expects

A11yFirst's link work prompts for meaningful link text and warns about generic
or URL-only text. The author should be able to choose a destination and a
descriptive name without knowing the HTML behind it.

## Current BlockNote behavior

The formatted-link toolbar exposes an **Edit URL** field and an OK action; no
separate link-text field, prompt, check, or warning for generic text was
observed. The lab typed "click here", selected it, created a link to
`https://example.com`, and the editor accepted the generic link text with no
warning. This is a verified product gap.

## Evidence

- `tests/a11y/a11yfirst.spec.mjs` — creates a "click here" link to
  `https://example.com` and asserts that the link is accepted while no
  alert/status text mentions link, text, descriptive, or purpose.
- Manual inspection of the link toolbar; the only visible field is `Edit URL`.
- No issue in the current catalog covers link text.

## Acceptance criteria

- [ ] The link workflow asks for or suggests a purpose-bearing link name.
- [ ] Generic and URL-only text produces a plain-language warning.
- [ ] The warning can be acted on without leaving the link workflow.
- [ ] The link text remains visible and is not replaced by an aria-label.
- [ ] A regression test creates a link from a bare URL and checks the warning.

## Suggested direction (upstream)

Add a lightweight link-text check to the link toolbar and a help example. Link
the guidance to the destination, not to a generic instruction. Use A11yFirst's
link plugin as the reference model.

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
- [A11yFirst demo](https://a11yfirst.gitlab.io/custom/a11yfirst.html)
- [A11yFirst CKEditor plugins](https://github.com/a11yfirst/ckeditor-plugins)
