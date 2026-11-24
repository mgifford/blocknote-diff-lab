# A11yFirst and ATAG 2.0 Part B gap register

This register records the **current-main** gaps against the A11yFirst model and
ATAG 2.0 Part B. Each gap has its own Markdown file with evidence, affected
users, acceptance criteria, and a suggested upstream direction.

- [A11yFirst gaps](#a11yfirst-gaps)
- [ATAG 2.0 Part B coverage](#atag-20-part-b-coverage)
- [Status vocabulary](#status-vocabulary)
- [Out of scope](#out-of-scope)
- [How to update a gap](#how-to-update-a-gap)

## A11yFirst gaps

A11yFirst's principle is that the authoring environment should support
accessibility **by default** — structure, text alternatives, meaningful links,
language, author help, and checking should be part of authoring rather than a
later repair pass.

| ID | Gap | Status | ATAG B link | Evidence |
| --- | --- | --- | --- | --- |
| [AF-01](a11yfirst-01-heading-guidance.md) | Heading-level guidance and outline validation | Evidence gap | B.2.2.2 | Not assessed; no guidance observed |
| [AF-02](a11yfirst-02-image-alt-authoring.md) | Image text-alternative authoring | **Product gap** | B.2.1.1, B.2.2.2, B.2.3.1 | axe, Guidepup, semantics |
| [AF-03](a11yfirst-03-link-text.md) | Meaningful link-text guidance | Evidence gap | B.2.2.2 | Not assessed |
| [AF-04](a11yfirst-04-language-of-parts.md) | Language of passages | **Product gap** | B.2.1.1, B.2.2.2 | Upstream report #2823; not reproduced here |
| [AF-05](a11yfirst-05-author-help.md) | In-product author help | **Product gap** | B.4.2.2, B.4.2.3 | No help surface observed |
| [AF-06](a11yfirst-06-in-product-checking.md) | Built-in accessibility checking | **Product gap** | B.3.1.1 | No checker observed; lab checks are external |
| [AF-07](a11yfirst-07-table-structure.md) | Table header/caption structure | **Product gap** | B.2.1.1, B.2.2.2 | semantics, axe |
| [AF-08](a11yfirst-08-list-structure.md) | List semantics in reading output | **Product gap** | B.2.1.1 | Guidepup, semantics |
| [AF-09](a11yfirst-09-accessible-by-default.md) | Accessible-by-default authoring path | **Principle gap** | B.4.1.1 | Cross-cutting |

A11yFirst's **Paragraph Format**, **Character Style**, and **toolbar
organisation** were compared but are not filed as accessibility gaps: no
confirmed barrier was observed in this lab's tested surfaces. They remain a
design comparison for a future review.

## ATAG 2.0 Part B coverage

Every Part B success criterion is assigned to a gap record or marked not
applicable. The gap files assess **current main**, not upstream pull requests.

| Checkpoint | Level | Status | Gap record |
| --- | --- | --- | --- |
| B.1.1.1 Content auto-generation after authoring | A (WCAG-dependent) | Evidence gap | [B-01](atag-b-01-auto-generated-content.md) |
| B.1.1.2 Content auto-generation during authoring | A (WCAG-dependent) | Evidence gap | [B-01](atag-b-01-auto-generated-content.md) |
| B.1.2.1 Restructuring/re-coding transformations | A (WCAG-dependent) | Evidence gap | [B-02](atag-b-02-transform-preservation.md) |
| B.1.2.2 Copy-paste inside the authoring tool | A (WCAG-dependent) | Evidence gap | [B-02](atag-b-02-transform-preservation.md) |
| B.1.2.3 Optimizations preserve accessibility | A | Evidence gap | [B-02](atag-b-02-transform-preservation.md) |
| B.1.2.4 Text alternatives preserved | A | Evidence gap | [B-02](atag-b-02-transform-preservation.md) |
| B.2.1.1 Accessible content possible | A (WCAG-dependent) | **Product gap** | [B-03](atag-b-03-accessible-content-possible.md) |
| B.2.2.1 Accessible option prominence | A (WCAG-dependent) | **Product gap** | [B-04](atag-b-04-accessibility-properties.md) |
| B.2.2.2 Setting accessibility properties | A (WCAG-dependent) | **Product gap** | [B-04](atag-b-04-accessibility-properties.md) |
| B.2.3.1 Alternative content is editable | A (WCAG-dependent) | **Product gap** | [B-05](atag-b-05-alternative-content.md) |
| B.2.3.2 Automating repair of text alternatives | A | **Product gap** | [B-05](atag-b-05-alternative-content.md) |
| B.2.3.3 Save for reuse | AAA | **Product gap (AAA)** | [B-05](atag-b-05-alternative-content.md) |
| B.2.4.1 Accessible template options | A (WCAG-dependent) | **Product/evidence gap** | [B-06](atag-b-06-templates-pre-authored.md) |
| B.2.4.2 Identify template accessibility | AA | **Product/evidence gap** | [B-06](atag-b-06-templates-pre-authored.md) |
| B.2.4.3 Author-created templates | AA | Not applicable in tested surfaces | [B-06](atag-b-06-templates-pre-authored.md) |
| B.2.4.4 Accessible template options (enhanced) | AAA | Not applicable in tested surfaces | [B-06](atag-b-06-templates-pre-authored.md) |
| B.2.5.1 Accessible pre-authored content options | AA | **Product/evidence gap** | [B-06](atag-b-06-templates-pre-authored.md) |
| B.2.5.2 Identify pre-authored content accessibility | AA | **Product/evidence gap** | [B-06](atag-b-06-templates-pre-authored.md) |
| B.3.1.1 Checking assistance | A (WCAG-dependent) | **Product gap** | [B-07](atag-b-07-checking-assistance.md) |
| B.3.1.2 Help authors decide | A | **Product gap** | [B-07](atag-b-07-checking-assistance.md) |
| B.3.1.3 Help authors locate | A | **Product gap** | [B-07](atag-b-07-checking-assistance.md) |
| B.3.1.4 Status report | AA | **Product gap** | [B-07](atag-b-07-checking-assistance.md) |
| B.3.1.5 Programmatic association of results | AA | **Product gap** | [B-07](atag-b-07-checking-assistance.md) |
| B.3.2.1 Repair assistance | A (WCAG-dependent) | **Product gap** | [B-08](atag-b-08-repair-assistance.md) |
| B.4.1.1 Features active by default | A | **Product gap** | [B-09](atag-b-09-features-by-default.md) |
| B.4.1.2 Option to reactivate features | A | **Product gap** | [B-09](atag-b-09-features-by-default.md) |
| B.4.1.3 Feature deactivation warning | AA | **Product gap** | [B-09](atag-b-09-features-by-default.md) |
| B.4.1.4 Feature prominence | AA | **Product gap** | [B-09](atag-b-09-features-by-default.md) |
| B.4.2.1 Model practice | A (WCAG-dependent) | Evidence gap | [B-10](atag-b-10-documentation.md) |
| B.4.2.2 Feature instructions | A | Evidence gap | [B-10](atag-b-10-documentation.md) |
| B.4.2.3 Tutorial | AAA | Evidence gap | [B-10](atag-b-10-documentation.md) |
| B.4.2.4 Instruction index | AAA | Evidence gap | [B-10](atag-b-10-documentation.md) |

## Status vocabulary

| Status | Meaning |
| --- | --- |
| **Product gap** | Confirmed behavior on current main; evidence is linked |
| **Evidence gap** | Not assessed; the lab has no reproducing test or observation yet. This is a coverage gap, not a claim that the product fails |
| **Principle gap** | Cross-cutting design gap that is explained by more specific records |
| **AAA** | A Level AAA checkpoint. It is aspirational under an AA target; record it separately from AA work |
| **Not applicable** | The feature or authoring path does not exist in the tested surfaces. Record the rationale; do not invent a failure |

## Out of scope

This register does **not**:

- review, approve, reject, or validate an upstream pull request. Mentions of
  upstream PRs are context only. The records describe current main.
- perform real screen-reader evaluation (VoiceOver, NVDA, JAWS, Orca) or testing
  with disabled people. That is a separate activity outside this lab.
- claim ATAG 2.0 Part B conformance, assign upstream work, or promise a fix.
- assess the comparator's own UI except where a test explicitly says so.

## How to update a gap

1. Reproduce or re-check on the pinned current-main revision.
2. Update the **Current behavior** and **Evidence** sections with commands,
   selectors, and raw result paths (for example
   `reports/a11y/<timestamp>/...json`).
3. Change the status only when the evidence basis changes. A passing preview or
   an upstream draft does not close a current-main gap.
4. Keep the **Acceptance criteria** user-facing and testable.
5. Leave PR review and real-AT confirmation out of the record.

## Related files

- [ATAG 2.0 and A11yFirst evidence map](../ATAG-2.0-A11YFIRST.md)
- [A11y test suite](../../tests/a11y/)
- [Issue inventory](../../reports/ISSUE-INVENTORY.md)
- [ATAG 2.0 Recommendation](https://www.w3.org/TR/ATAG20/)
- [A11yFirst demo](https://a11yfirst.gitlab.io/custom/a11yfirst.html)
