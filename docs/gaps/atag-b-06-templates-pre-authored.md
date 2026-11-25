# B-06: Templates and pre-authored content (B.2.4.1–B.2.4.4, B.2.5.1–B.2.5.2)

- **Status:** N/A in the tested surfaces; consumer integrations must assess their own template/pre-authored content
- **Area:** BlockNote editor / current main, default schema and example content
- **ATAG 2.0:** B.2.4.1 Accessible Template Options; B.2.4.2 Identify Template Accessibility; B.2.4.3 Author-Created Templates; B.2.4.4 Accessible Template Options (Enhanced); B.2.5.1 Accessible Pre-Authored Content Options; B.2.5.2 Identify Pre-Authored Content Accessibility
- **WCAG 2.2:** The level the template/pre-authored content claims (WCAG-dependent)
- **Evidence basis:** ATAG definitions, source and documentation search, and manual inspection on 2026-11-25
- **Recorded:** 2026-11-25 against current main (`9cb988f`)

## Why this matters

Authors trust what the tool puts in front of them. A default document or example
that contains an undescribed image or a headerless table teaches the wrong
pattern and seeds inaccessible content. Templates and pre-authored content should
be accessible and should say what they are.

## What ATAG 2.0 requires

ATAG defines a **template** as "content patterns that are filled in by authors
or the authoring tool to produce web content for end users", selected through a
**template selection mechanism**. **Pre-authored content** is content supplied by
the tool as a starting point, selected through a **pre-authored content selection
mechanism**.

- **B.2.4.1** accessible template options are available.
- **B.2.4.2** templates are identified as accessible or not.
- **B.2.4.3** author-created templates preserve accessibility.
- **B.2.4.4** (AAA) enhanced template options.
- **B.2.5.1** accessible pre-authored content options are available.
- **B.2.5.2** pre-authored content is identified as accessible or not.

## Current BlockNote behavior

No template selection mechanism, template library, or author-created template
feature was observed in the tested editor. `initialContent` is a host-application
API for setting starting blocks; it is not an author-facing template or
pre-authored-content selection mechanism. The playground examples and the Default
Schema Showcase are developer demos, not pre-authored content offered to authors
through the editor.

B.2.4 and B.2.5 are therefore **not applicable in the tested surfaces**. This is
a scope statement, not a claim that a consumer integration cannot expose
templates. A host product that adds templates or pre-authored content must assess
those checkpoints in its own authoring-tool scope.

The accessibility of the demo content (image alt, table headers, list wrappers)
is still recorded in AF-02/AF-07/AF-08. Those are real content findings, but they
do not make the demo a B.2.4/B.2.5 template option.

## Evidence

- ATAG 2.0 definitions for **template**, **template selection mechanism**,
  **pre-authored content**, and **pre-authored content selection mechanism**.
- `packages/core/src` and `packages/react/src`: no template selection feature in
  the source search.
- `docs/content/docs`: `initialContent` is documented as an editor option, not a
  template/pre-authored content picker.
- Manual inspection: no template picker, template library, or accessibility label
  in the tested editor.
- Demo-content findings: [AF-02](a11yfirst-02-image-alt-authoring.md),
  [AF-07](a11yfirst-07-table-structure.md),
  [AF-08](a11yfirst-08-list-structure.md).

## Acceptance criteria

- [x] The ATAG template and pre-authored-content definitions are checked against
      the tested surfaces.
- [x] The N/A rationale is recorded, including the `initialContent` distinction.
- [ ] If a consumer integration adds templates or pre-authored content, it
      assesses B.2.4/B.2.5 in its own scope.
- [ ] Any author-facing template/pre-authored content is accessible or labelled.
- [ ] The accessibility properties survive author-created templates.
- [ ] Documentation does not imply a template capability the editor does not have.

## Suggested direction

Do not add a template picker just to satisfy a checklist. If a host product adds
templates or pre-authored content, assess it in that product's scope and label
the accessibility status before insertion.

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
