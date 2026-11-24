# AF-09: Accessible-by-default authoring path

- **Status:** Principle gap — cross-cutting
- **Area:** BlockNote editor / current main
- **A11yFirst:** Accessible by default — prevent problems during authoring
- **ATAG 2.0:** B.4.1.1 Features Active by Default
- **WCAG 2.2:** Cross-cutting (1.1.1, 1.3.1, 2.4.4, 3.1.2)
- **Evidence basis:** Cross-cutting synthesis of the concrete gap records
- **Recorded:** 2026-11-24 against current main (`9cb988f`)

## Why this matters

A11yFirst's central claim is that accessibility should happen during authoring,
not in a later repair pass. If the default editing path produces an image with no
description, a table with no header relationships, and lists without list
semantics, then accessibility depends on the author already knowing the rules.
The end user pays for that assumption.

## What A11yFirst expects

The authoring environment should make the accessible choice the default or the
guided choice: semantic blocks, text-alternative prompts, header properties,
meaningful links, language marking, and checking. The author should not need to
be an accessibility specialist to produce accessible content.

## Current BlockNote behavior

The tested current-main surfaces fail the default path in three concrete ways:

1. Images render with `alt=""` and no alt control (AF-02).
2. Tables have no `scope`/`id`/`headers` and no observed caption control (AF-07).
3. Read-only lists have no list containers (AF-08).

There is no in-product checker or help to catch these (AF-05, AF-06). A pasted or
imported image, table, or list inherits the same gaps unless the author knows to
repair them.

## Evidence

- [AF-02](a11yfirst-02-image-alt-authoring.md), [AF-07](a11yfirst-07-table-structure.md),
  [AF-08](a11yfirst-08-list-structure.md) — concrete verified behavior.
- `tests/a11y/` — axe, Guidepup, and semantic before/after evidence.
- [`reports/ISSUE-INVENTORY.md`](../../reports/ISSUE-INVENTORY.md) — upstream issues
  #2822, #2825, #2826, #2809.

## Acceptance criteria

- [ ] The default image insertion path asks for a text alternative or a
      decorative choice.
- [ ] The default table insertion path asks for header rows/columns and a caption.
- [ ] List blocks retain list semantics in read-only and export output.
- [ ] The author receives a warning or check when an accessible property is
      missing.
- [ ] A first-time author can produce an accessible image, table, and list
      without external documentation.
- [ ] A regression suite covers the default path, not only a repaired document.

## Suggested direction (upstream)

Treat this as the product-level goal behind the individual records. Prioritize
the smallest set of defaults/prompts that prevents the three verified barriers,
then add checking and help. Do not call the editor "accessible by default" while
the default path still produces the barriers above.

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
