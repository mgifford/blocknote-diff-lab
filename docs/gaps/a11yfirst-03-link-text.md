# AF-03: Meaningful link-text guidance

- **Status:** Evidence gap (likely product gap)
- **Area:** BlockNote editor / current main, link toolbar
- **A11yFirst:** Meaningful link text
- **ATAG 2.0:** B.2.2.2 Setting Accessibility Properties
- **WCAG 2.2:** 2.4.4 Link Purpose (In Context); 2.4.9 Link Purpose (Link Only)
- **Evidence basis:** Manual observation; no dedicated test
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

The formatted-link toolbar accepts a URL and link text. This lab did not find a
prompt, check, or warning for generic text such as "click here", "read more", or
a bare URL. A dedicated link-text test has not been written, so this remains an
evidence gap rather than a confirmed failure.

## Evidence

- Manual inspection of the link toolbar; no link-text guidance observed.
- No test in `tests/a11y/` currently exercises link text.
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
- [ATAG 2.0 Recommendation](https://www.w3.org/TR/ATAG20/)
- [A11yFirst demo](https://a11yfirst.gitlab.io/custom/a11yfirst.html)
- [A11yFirst CKEditor plugins](https://github.com/a11yfirst/ckeditor-plugins)
