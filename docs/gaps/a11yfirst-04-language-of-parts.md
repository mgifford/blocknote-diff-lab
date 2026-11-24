# AF-04: Language of passages

- **Status:** Product gap — reported upstream, not reproduced in this lab
- **Area:** BlockNote editor / current main, inline content and export
- **A11yFirst:** Structure first — language of parts
- **ATAG 2.0:** B.2.1.1 Accessible Content Possible; B.2.2.2 Setting Accessibility Properties
- **WCAG 2.2:** 3.1.2 Language of Parts
- **Evidence basis:** Upstream report (#2823) and issue inventory; no local reproduction
- **Recorded:** 2026-11-24 against current main (`9cb988f`)

## Why this matters

A screen reader pronounces a passage using the document language. When a
paragraph or phrase is in another language and no language is declared, the
pronunciation is wrong and may be unintelligible. This is a frequent problem in
bilingual and quoted content.

## What A11yFirst expects

An author should be able to declare the language of a block or an inline
passage, with a visible indication of what has been marked. The declaration must
survive export as a `lang` attribute (with a valid language tag).

## Current BlockNote behavior

The issue inventory records #2823 as open: there is no way to declare a
language for a passage, and no `lang` output is emitted. This lab has not
reproduced the issue; the evidence basis is the upstream report and source
inspection in the inventory, not a local test.

## Evidence

- [`reports/ISSUE-INVENTORY.md`](../../reports/ISSUE-INVENTORY.md) — #2823,
  "Bilingual documents: unable to declare language on foreign language passages".
- `pages/issues.json` — #2823 is **Reproduction only**; no patch is bundled.
- No test in `tests/a11y/` covers language of parts.

## Acceptance criteria

- [ ] An author can mark a block or inline passage with a valid language tag.
- [ ] The editor shows which content is marked, visually and programmatically.
- [ ] The language survives HTML export as `lang` on the correct element.
- [ ] The picker uses human-readable language names while storing valid tags.
- [ ] A regression test marks a French passage and checks `lang="fr"` in export.

## Suggested direction (upstream)

Decide whether language is an inline mark or a block property, then implement one
path end to end (model, UI, serialization). Keep the report's design question
open; do not bolt a `lang` attribute onto an unrelated wrapper.

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
