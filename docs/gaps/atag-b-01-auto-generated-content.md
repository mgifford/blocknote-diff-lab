# B-01: Automatically generated content is accessible (B.1.1.1, B.1.1.2)

- **Status:** Partial product gap — during-session derivations; post-session N/A
- **Area:** BlockNote editor / current main
- **ATAG 2.0:** B.1.1.1 Content Auto-Generation After Authoring Sessions (Level A to meet WCAG A); B.1.1.2 Content Auto-Generation During Authoring Sessions (Level A to meet WCAG A)
- **WCAG 2.2:** The level the generated content must meet (A/AA/AAA, WCAG-dependent)
- **Evidence basis:** Source inventory and current-main inspection on 2026-11-25; AI/auto-compose examples not assessed
- **Recorded:** 2026-11-25 against current main (`9cb988f`)

## Why this matters

If the tool generates content on its own — a placeholder, a derived caption, a
URL-derived name, a default table, or a post-session update — that content must
either be accessible or prompt/check the author. Otherwise the tool inserts
barriers faster than an author can remove them.

## What ATAG 2.0 requires

**B.1.1.1** applies to content generated after the authoring session: the tool
must not generate inaccessible content, or the author must be able to require
accessible output. **B.1.1.2** applies during the session: generated content must
be accessible, or the author must be prompted for missing accessibility
information, or automatic checking must run, or the author must be prompted to
check.

## Current BlockNote behavior

The table inventories the generation paths found in current main; the status
sections after it apply the B.1.1 decision to each path.

### Inventory of generation paths

| Path | When it runs | What is generated | Accessibility consequence |
| --- | --- | --- | --- |
| Default initial content | Editor creation with no `initialContent` | One empty paragraph | No authored content; **not an accessibility generation path** |
| Image text alternative | Rendering/exporting an image block | `alt = props.name \|\| ""` — the file name, or an empty (decorative) alternative | Derived alt is a **file name**, not a description; empty fallback is silent; no prompt or check |
| File link text | Rendering/exporting a file block | `name \|\| url` as the link text | Falls back to a **raw URL**; not meaningful link text; no prompt (see AF-03) |
| Table headers | Inserting a table | `headerRows`/`headerCols` remain undefined/0 unless the author or template sets them | No automatic headers; this is a default/property gap (B-04/B-09), not generated content |
| HTML/Markdown paste/import | Author paste/import | Re-coded blocks | Transformation family, recorded in [B-02](atag-b-02-transform-preservation.md), not B.1.1 |
| AI / Ghost Writer examples | Playground examples (not current-main editor default) | Model-generated text/blocks | **Not assessed**; a real B.1.1.2 path that needs a separate review |
| Collaboration updates | Remote author/agent edit | Content from another author | Authored content, not tool-generated; out of this record's scope |
| Export conversions | Export action | HTML/Markdown/PDF/DOCX/ODT/email | Transformation family, recorded in B-02 |

**B.1.1.1 (after the session):** no post-session generation path was identified in
the tested editor. Marked N/A for the tested surfaces, not for all BlockNote
integrations.

**B.1.1.2 (during the session):** the image and file renderers derive text
alternatives from the file name or URL. Those derivations are generated content;
they are not guaranteed to be meaningful, and there is no prompt or check. This
is a **partial product gap**. The AI/Ghost Writer examples are a separate,
unassessed generation path.

## Evidence

- `packages/core/src/blocks/Image/block.ts` — `image.alt = block.props.name || ""`
  in both the editor renderer and the external HTML renderer.
- `packages/core/src/blocks/File/block.ts` — `textContent = block.props.name || block.props.url`.
- `packages/core/src/editor/BlockNoteEditor.ts` — the default initial content is a
  single paragraph.
- `packages/core/src/schema/blocks/types.ts` — `headerRows`/`headerCols` are
  optional table content properties.
- `playground/src/examples.gen.tsx` — Ghost Writer / AI integration examples
  exist; no test in `tests/a11y/` covers them.
- The Default Schema Showcase is pre-authored content, recorded in
  [B-06](atag-b-06-templates-pre-authored.md), not auto-generation.

## Acceptance criteria

- [x] Every automatic content-generation path in the tested surfaces is
      inventoried (when it runs, what it inserts, who owns the output).
- [ ] The image alt derived from a file name is meaningful, or the author is
      prompted/checked when it is not.
- [ ] The file link text fallback is not a raw URL, or the author is prompted.
- [ ] AI/Ghost Writer generation either produces accessible content or prompts
      for missing accessibility information.
- [ ] Any post-session generation meets the declared WCAG level.
- [ ] Tests cover the generated output, not only the empty editor.

## Suggested direction

Do not build a checker for a feature that does not exist. First inventory the
actual generation paths in BlockNote (default blocks, derived names, imports,
collaboration updates). Then apply the B.1.1.1/2 decision to each path.

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
