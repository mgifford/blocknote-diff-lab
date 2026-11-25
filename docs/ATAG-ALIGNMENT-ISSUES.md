# ATAG 2.0 alignment issues

**Status:** living register, last reviewed 2026-11-24.
**Scope:** how this lab's evidence, scope, and wording align — or fail to align —
with [ATAG 2.0](https://www.w3.org/TR/ATAG20/). This is **not** a conformance
audit and not a substitute for the [gap register](gaps/README.md).

The lab measures a small set of BlockNote authoring surfaces and its own
comparator page. It does **not** evaluate a complete authoring tool, a released
product, real assistive technology, or upstream pull requests. Those boundaries
create alignment issues that need to be stated explicitly so the evidence is not
over-read.

## Alignment model

| Layer | ATAG 2.0 requirement | What this lab actually has | Alignment status |
| --- | --- | --- | --- |
| Standards | ATAG 2.0 defines accessible content against **WCAG 2.0** | Tests use WCAG 2.2 A/AA tags and cite WCAG 2.2 criteria | **Version mismatch** — WCAG 2.2 is a broader internal target, not an ATAG 2.0 requirement |
| Product scope | A complete authoring tool, including its UI, content technologies, and author roles | One BlockNote component plus example routes and a comparator page | **Scope mismatch** — BlockNote is a library, not the complete authoring tool |
| Editing UI | Part A applies to the authoring tool UI | Lab tests some editor controls; comparator UI is a separate app | **Partial coverage** — many Part A checkpoints are not assessed |
| Content production | Part B applies to content authors produce with the tool | Tests use example/pre-authored content and some authoring actions | **Indirect evidence** — example content is not author-created content |
| Evidence | Conformance needs a defined scope and all applicable success criteria | axe, Guidepup Virtual Screen Reader, Playwright keyboard, DOM probes | **Incomplete evidence** — detectors and a simulator, not AT |
| Stability | A conformance claim names a product version and technologies | Tests run on a pinned commit and live preview deployments | **Unstable target** — previews change; current-main is a moving target |
| Claims | ATAG allows defined levels and required claim components | No claim is made | **Properly limited** — but wording must not imply a level |

## Issue register

### ALIGN-01: BlockNote is a component library, not a complete authoring tool

- **Status:** Accepted boundary.
- **Issue:** ATAG 2.0 applies to an authoring tool as a whole, including the host
  application, author roles, included content technologies, menus, status bars,
  preferences, documentation, and help. This lab tests the BlockNote editor and
  example Playground, not a complete product.
- **Why it matters:** A pass or gap in the component does not establish ATAG
  conformance for a consumer such as a Docs product, and a consumer's fixes do
  not make the component conformant.
- **Current handling:** The ATAG map and gap register describe BlockNote
  surfaces, not a conformance claim. The downstream Docs product is treated as a
  separate scope.
- **Decision:** Keep the component/host boundary explicit in every ATAG record.
  A consumer that wants an ATAG claim must scope its own integration.

### ALIGN-02: ATAG 2.0 references WCAG 2.0, while the tests use WCAG 2.2

- **Status:** Open wording risk; mitigated in the evidence map.
- **Issue:** ATAG 2.0 defines "accessible content" against **WCAG 2.0** at a
  declared level. The lab scans with `wcag2a`, `wcag2aa`, `wcag21a`, `wcag21aa`,
  and `wcag22aa` tags and cites WCAG 2.2 criteria. WCAG 2.2 adds success criteria
  that are not ATAG 2.0 requirements, such as focus not obscured, dragging
  movements, target size, redundant entry, and accessible authentication.
- **Why it matters:** A WCAG 2.2 AA pass is not an ATAG 2.0 Part B pass, and an
  ATAG 2.0 claim must be assessed against the WCAG version the claim names (or a
  deliberately declared newer target).
- **Current handling:** The ATAG map now states the version difference. The gap
  records cite WCAG 2.2 as a product-quality target while their ATAG mapping
  cites the ATAG checkpoint.
- **Decision:** Do not call a WCAG 2.2 result "ATAG 2.0 AA." If a claim is ever
  prepared, declare the WCAG version and level explicitly.

### ALIGN-03: Automated and simulator evidence cannot establish ATAG conformance

- **Status:** Accepted boundary.
- **Issue:** axe-core, Guidepup Virtual Screen Reader, DOM probes, and Playwright
  keyboard traces are detector/simulator evidence. ATAG conformance requires
  human judgment and real assistive-technology use for several success criteria.
- **Why it matters:** A clean axe run or a virtual-reader transcript is not an
  ATAG verdict, and a failing detector does not by itself prove a WCAG failure.
  The project's own a11y-test guidance forbids promoting detector output to a
  conformance decision.
- **Current handling:** Every ATAG document states that real AT and testing with
  disabled people are out of scope. Axe blind spots are asserted explicitly.
- **Decision:** Keep detector results as candidate evidence. Never convert them
  into an ATAG level.

### ALIGN-04: Part A and Part B are conflated for image text alternatives

- **Status:** Partly mitigated; audit still needed.
- **Issue:** Part A **A.2.1.1** is about text alternatives for non-text content
  rendered in the editing view (the author can perceive/reach the alternative).
  Part B **B.2.1.1/B.2.3.1** are about the author being able to provide and edit
  an alternative. The #2822 image has `alt=""`, so the rendered editing view is
  presentational and the authoring control is missing. These are separate
  failures with separate evidence.
- **Why it matters:** A test that shows the image is silent (Part A) does not
  prove the author cannot add an alternative (Part B), and vice versa.
- **Current handling:** [AF-02](gaps/a11yfirst-02-image-alt-authoring.md) records
  the authoring gap; the ATAG map uses the image evidence for A.2.1.1 and links
  the Part B cluster to B-03/B-05. The two claims are not yet separately tested
  with distinct authoring actions.
- **Decision:** When a real authoring test exists, it must create an image,
  provide an alternative, and inspect both the editing view and the output. Until
  then, label the A.2.1.1 row "rendered content only."

### ALIGN-05: Example/pre-authored content is not author-created content

- **Status:** Open.
- **Issue:** The Default Schema and Advanced Tables examples are pre-authored by
  developers. ATAG Part B is about what an author can produce through the tool.
  Observing an example image/table/list proves the current example is
  inaccessible; it does not, by itself, prove an author cannot create an
  accessible one (except where the UI lacks the control).
- **Why it matters:** B.2.1.1 "accessible content possible" needs an authoring
  action, not only an inspection of a fixture. The lab's image/table/list records
  infer capability from missing UI/serialization; that inference must be named.
- **Current handling:** The gap records state the evidence basis and distinguish
  DOM/example evidence from an authoring test. The new A11yFirst probes do create
  headings and a link through the UI, which is stronger evidence for those gaps.
- **Decision:** For image, table, and list capability, add authoring actions
  (insert block → set property → inspect output) before treating B.2.1.1 as
  verified. Keep the current records as "example evidence."

### ALIGN-06: Upstream PR previews are not current-product evidence

- **Status:** Mitigated by labeling; test wording remains a risk.
- **Issue:** The preview tests compare current main with a pull-request preview
  deployment. ATAG evidence must describe a pinned, released product, not an
  unmerged proposal. The lab does not review or approve pull requests.
- **Why it matters:** An "after" assertion against a PR preview can look like an
  acceptance decision or a conformance claim about the PR. It is neither.
- **Current handling:** Gap records describe current main only; every file has an
  Out of scope section; the preview specs carry a "context only" comment; the
  ATAG map labels preview context.
- **Decision:** Keep the comparison as context. Never use it to close a gap. If
  the wording still implies a PR verdict, rename the test descriptions to
  "upstream preview context" rather than "after."

### ALIGN-07: "Partial" is an evidence status, not a conformance level

- **Status:** Mitigated.
- **Issue:** ATAG levels are A, AA, and AAA, with "Level A to meet WCAG A; Level
  AA to meet WCAG A and AA" conditions. "Partial" is not a conformance level.
  The ATAG map uses "Partial" and "Tested for this path" as evidence coverage.
- **Why it matters:** A table of partials can be mistaken for a partial ATAG
  claim, which does not exist in ATAG 2.0.
- **Current handling:** The map states "not a conformance claim" and now links
  this register. The gap register separates product, evidence, and principle
  gaps.
- **Decision:** Use "evidence coverage" language for Partial; reserve "Level A/AA"
  for a formal claim with all applicable success criteria satisfied.

### ALIGN-08: A11yFirst is a design model, not an ATAG profile

- **Status:** Mitigated; mapping remains interpretive.
- **Issue:** A11yFirst is a CKEditor authoring model. Its Heading, Paragraph
  Format, Character Style, toolbar organization, Help, and checker features do
  not map one-to-one to ATAG success criteria. For example, heading guidance maps
  indirectly to A.3.4.1 and B.2.2.2; toolbar organization is not a success
  criterion; "accessible by default" is a principle, not an SC.
- **Why it matters:** Treating an A11yFirst feature gap as an ATAG failure
  without a checkpoint mapping overstates the standards finding.
- **Current handling:** The gap register states the A11yFirst mapping and the
  ATAG cluster separately. AF-09 is a principle gap, not an SC failure.
- **Decision:** Keep A11yFirst as the design north star and ATAG as the
  conformance frame. Do not merge the two into a single score.

### ALIGN-09: Part A coverage is incomplete

- **Status:** Partly resolved — all Part A rows are now classified.
- **Issue:** The ATAG map covers a subset of Part A. The triage now classifies
  every remaining row, but two checkpoints remain **not assessed**: A.3.2.4
  (AAA auto-save) and A.3.6.3 (platform display/control settings). A.3.5.1 is a
  confirmed product gap (no in-editor text search); A.2.2.2 is a partial pass.
- **Why it matters:** ATAG Part A conformance requires all applicable SCs. A
  partial map cannot be read as "Part A done."
- **Current handling:** The Part A table below records the gap. The map does not
  claim a Part A level.
- **Decision:** Either assess the missing SCs or mark them "not assessed" in any
  summary. Do not call the UI "ATAG A" while this table has open rows.

### ALIGN-10: Not-applicable checkpoints need explicit rationale

- **Status:** Resolved for the tested surfaces.
- **Issue:** A.1.2.1/A.1.2.2 apply to non-web-based functionality; the tested
  BlockNote surfaces are web-based, so they are not applicable here. B.2.4.3/
  B.2.4.4 author-created templates are not a tested feature. A.3.7 previews are
  not a BlockNote editing-view feature in the tested surfaces.
- **Why it matters:** "Not tested" and "not applicable" are different. Marking
  an SC N/A without a rationale hides a coverage gap.
- **Current handling:** The Part A table below records N/A with a reason for
  A.1.2, A.2.2.1, A.3.2.1–3, A.3.6.1–2 and A.3.7; B-06 records the template N/A.
- **Decision:** Re-check each N/A rationale when a consumer integration adds the
  feature. A residual "not assessed" row (A.3.2.4, A.3.6.3) is not N/A.

### ALIGN-11: The comparator/lab UI is not assessed against ATAG

- **Status:** Accepted boundary.
- **Issue:** The comparator page has controls, checklists, notes, and a focus
  readout. It is a lab tool, not a content authoring tool. It is scanned with axe,
  but it is not evaluated against ATAG Part A as a product UI.
- **Why it matters:** The lab's own accessibility is a separate question from
  BlockNote's. A clean comparator scan does not support an ATAG claim for the
  editor, and the comparator's authoring-like controls are not Part B content.
- **Current handling:** The comparator scan is labeled as shell evidence. The
  ATAG records scope BlockNote, not the comparator.
- **Decision:** If the lab is published as a product, give it its own scope and
  evaluation. Do not fold it into BlockNote's ATAG status.

### ALIGN-12: Template and pre-authored-content definitions were provisional

- **Status:** Resolved for the tested surfaces.
- **Issue:** ATAG uses specific definitions for templates and pre-authored
  content. BlockNote's default schema and example documents may not meet those
  definitions, so treating the Default Schema Showcase as a template or
  pre-authored content option could produce a false gap.
- **Why it matters:** Applying B.2.4/B.2.5 to a feature that is not a template in
  ATAG's sense produces a false gap; missing a real template path produces a
  false pass.
- **Current handling:** [B-06](gaps/atag-b-06-templates-pre-authored.md) checked the
  ATAG definitions, searched `packages/core/src`, `packages/react/src` and the
  docs, and confirmed there is no template or pre-authored-content selection
  mechanism in the tested editor. `initialContent` is a host API, not an
  author-facing template picker. B.2.4/B.2.5 are **N/A in the tested surfaces**.
- **Decision:** A consumer integration that adds templates or pre-authored
  content must assess B.2.4/B.2.5 in its own scope. Do not treat the demo pages
  as author-facing pre-authored content.

### ALIGN-13: Accessibility support and technology scope are narrow

- **Status:** Open.
- **Issue:** Tests run in Chromium with the Mantine UI. ATAG/WCAG accessibility
  support depends on the technologies and user agents in scope. Ariakit, shadcn,
  Firefox, Safari, PDF, DOCX, ODT, and email outputs are not all exercised.
- **Why it matters:** A result in Chromium/Mantine cannot be generalized to all
  BlockNote integrations or output formats.
- **Current handling:** The README and issue files state the tested environment
  and unverified surfaces.
- **Decision:** Name the tested user agent and UI package in every ATAG row.
  Do not generalize a Chromium result to "BlockNote supports X."

### ALIGN-14: Raw evidence is local and ignored

- **Status:** Open lab-process issue.
- **Issue:** `reports/a11y/<timestamp>/` is under the ignored `reports/` tree.
  Gap records cite commands and local paths, but the raw JSON is not in the
  repository and may disappear. ATAG-style evidence needs retention and
  reproducibility.
- **Why it matters:** A reader cannot audit a claim from the docs alone, and a
  future run can overwrite the state. The evidence is not append-only in the
  repository.
- **Current handling:** The docs name the commands and the evidence directory;
  the tests are reproducible from the repo.
- **Decision:** Publish a small, tracked summary (or CI artifact) per evidence
  run, not the full trace. Record the command, commit, date, and result. Do not
  commit large screenshots or raw logs.

### ALIGN-15: A.3.4.1 was labeled Level A; it is Level AA

- **Status:** Resolved in the ATAG map.
- **Issue:** "Navigate By Structure" is an ATAG Level AA checkpoint. The first
  version of the map listed it as Level A.
- **Why it matters:** Level errors change what a claim would cover and can
  overstate a Level A result.
- **Current handling:** The map row now says **Level AA**. The Part A coverage
  table below uses the corrected level.
- **Decision:** Re-check levels from the ATAG Recommendation whenever a row is
  edited; do not copy a level from a summary.

### ALIGN-16: A content component result is not a host-product ATAG result

- **Status:** Accepted boundary.
- **Issue:** #2809 (read-only list semantics) and #2829 (Docs keyboard workflow)
  are observed through a downstream Docs product. The component library and the
  host product have different ATAG scopes, author roles, and content
  technologies.
- **Why it matters:** A fix or gap in one scope does not transfer automatically
  to the other.
- **Current handling:** The issue inventory marks downstream vs upstream; gap
  records identify the tested surface.
- **Decision:** Keep a per-surface scope note. A host-app ATAG claim needs its own
  evaluation.

## ATAG Part A coverage

This table is deliberately blunt. "Not assessed" is a coverage gap, not a pass.

| Checkpoint | Level | Lab status |
| --- | --- | --- |
| [A.1.1.1 Web-Based Accessible](https://www.w3.org/TR/ATAG20/#sc_a111) | A/AA/AAA (WCAG-dependent) | Partial — axe on four editor bundles and comparator shell; `aria-input-field-name` remains |
| [A.1.2.1 Accessibility Guidelines](https://www.w3.org/TR/ATAG20/#sc_a121) | A | N/A — tested surfaces are web-based |
| [A.1.2.2 Platform Accessibility Services](https://www.w3.org/TR/ATAG20/#sc_a122) | A | N/A — tested surfaces are web-based |
| [A.2.1.1 Text Alternatives for Rendered Non-Text Content](https://www.w3.org/TR/ATAG20/#sc_a211) | A | Partial — Guidepup #2822 rendered image; authoring view only |
| [A.2.1.2 Alternatives for Rendered Time-Based Media](https://www.w3.org/TR/ATAG20/#sc_a212) | A | **Product gap** — video/audio render with no `<track>` captions, audio description, or transcript; only a visible figure caption (`part-a.spec.mjs`) |
| [A.2.2.1 Editing-View Status Indicators](https://www.w3.org/TR/ATAG20/#sc_a221) | A | **N/A in tested surfaces** — no editing-view status indicators (spelling, tracked changes, hidden elements) were observed |
| [A.2.2.2 Access to Rendered Text Properties](https://www.w3.org/TR/ATAG20/#sc_a222) | AA | **Partial pass / not fully assessed** — structural formatting (bold, italic, headings) renders as semantic HTML; visual-only color/alignment properties are not programmatically exposed |
| [A.3.1.1 Keyboard Access (Minimum)](https://www.w3.org/TR/ATAG20/#sc_a311) | A | Partial — #2854 keyboard trace |
| [A.3.1.2 No Keyboard Traps](https://www.w3.org/TR/ATAG20/#sc_a312) | A | Tested for the #2854 path only |
| [A.3.1.3 Efficient Keyboard Access](https://www.w3.org/TR/ATAG20/#sc_a313) | AA | **Partial pass** — the slash menu is keyboard-operable and inserts a heading without a pointer; other efficient-access mechanisms are not assessed (`part-a.spec.mjs`) |
| [A.3.1.4 Keyboard Access (Enhanced)](https://www.w3.org/TR/ATAG20/#sc_a314) | AAA | Not assessed |
| [A.3.1.5 Customize Keyboard Access](https://www.w3.org/TR/ATAG20/#sc_a315) | AAA | Not assessed |
| [A.3.1.6 Present Keyboard Commands](https://www.w3.org/TR/ATAG20/#sc_a316) | AAA | Not assessed |
| [A.3.2.1 Auto-Save](https://www.w3.org/TR/ATAG20/#sc_a321) | A | **N/A/pass in tested surfaces** — no session time limit was observed, so auto-save is not required by the checkpoint; no auto-save was tested |
| [A.3.2.2 Timing Adjustable](https://www.w3.org/TR/ATAG20/#sc_a322) | A | **N/A/pass in tested surfaces** — no time limit was observed |
| [A.3.2.3 Static Input Components](https://www.w3.org/TR/ATAG20/#sc_a323) | A | **N/A/pass in tested surfaces** — no moving input components were observed |
| [A.3.2.4 Content Edits Saved (Extended)](https://www.w3.org/TR/ATAG20/#sc_a324) | AAA | **Not assessed (AAA)** — no auto-save setting observed |
| [A.3.3.1 Static View Option](https://www.w3.org/TR/ATAG20/#sc_a331) | A | **Pass** — video/audio have controls and no autoplay (`part-a.spec.mjs`) |
| [A.3.4.1 Navigate By Structure](https://www.w3.org/TR/ATAG20/#sc_a341) | **AA** | Partial — virtual-reader headings; header association not exposed |
| [A.3.4.2 Navigate by Programmatic Relationships](https://www.w3.org/TR/ATAG20/#sc_a342) | AAA | Not assessed |
| [A.3.5.1 Text Search](https://www.w3.org/TR/ATAG20/#sc_a351) | AA | **Product gap** — no in-editor text search was observed; the browser find is a user-agent feature, not the authoring tool search |
| [A.3.6.1 Independence of Display](https://www.w3.org/TR/ATAG20/#sc_a361) | A | **N/A in tested surfaces** — no display settings for the editing view were observed |
| [A.3.6.2 Save Settings](https://www.w3.org/TR/ATAG20/#sc_a362) | AA | **N/A in tested surfaces** — no display/control settings were observed |
| [A.3.6.3 Apply Platform Settings](https://www.w3.org/TR/ATAG20/#sc_a363) | AA | **Not assessed** — dark/light color-scheme support exists via Mantine, but the full platform display/control settings requirement was not tested |
| [A.3.7.1 Preview (Minimum)](https://www.w3.org/TR/ATAG20/#sc_a371) | A | N/A in the tested editor surfaces; no preview feature evaluated |
| [A.3.7.2 Preview (Enhanced)](https://www.w3.org/TR/ATAG20/#sc_a372) | AAA | N/A in the tested editor surfaces |
| [A.4.1.1 Content Changes Reversible](https://www.w3.org/TR/ATAG20/#sc_a411) | A | **Partial pass** — a text edit can be undone with the keyboard; block-level undo and settings changes are not assessed (`part-a.spec.mjs`) |
| [A.4.1.2 Settings Change Confirmation](https://www.w3.org/TR/ATAG20/#sc_a412) | A | Not assessed |
| [A.4.1.3 Content Changes Reversible (Enhanced)](https://www.w3.org/TR/ATAG20/#sc_a413) | AAA | Not assessed |
| [A.4.2.1 Describe Accessibility Features](https://www.w3.org/TR/ATAG20/#sc_a421) | A | Lab docs only — not BlockNote's authoring help |
| [A.4.2.2 Document All Features](https://www.w3.org/TR/ATAG20/#sc_a422) | AA | Lab docs only — not BlockNote's authoring help |

Part B coverage is in the [gap register](gaps/README.md#atag-20-part-b-coverage).

## What a real ATAG claim would require

At minimum:

1. A named authoring tool, version, and owner.
2. The author roles and content technologies included in scope.
3. A declared ATAG level, with the corresponding WCAG version and level for
   authored content.
4. All applicable success criteria satisfied at that level, with evidence
   retained and reproducible.
5. The host application, including any documentation, help, previews, and
   integration surfaces, included in the Part A scope.
6. Accessibility support for the declared browsers/AT/technologies.
7. A conformance claim with the components ATAG requires, not a blog post or a
   partial test table.

This lab meets none of those conditions as a complete claim. It provides
component evidence and a gap backlog.

## Current wording corrections

- Removed the implication that the lab satisfies ATAG A & B; the map now states
  it is an evidence map, not a claim.
- Added the ATAG 2.0 → WCAG 2.0 version distinction.
- Added the BlockNote component vs complete authoring tool boundary.
- Added "upstream previews are context only; no PR review."
- Marked real AT and testing with disabled people as out of scope.
- Corrected A.3.4.1 to **Level AA**.
- Added this alignment register to the ATAG map, README, and gap register.

## Related files

- [ATAG 2.0 and A11yFirst evidence map](ATAG-2.0-A11YFIRST.md)
- [A11yFirst and ATAG Part B gap register](gaps/README.md)
- [ATAG 2.0 Recommendation](https://www.w3.org/TR/ATAG20/)
- [ATAG 2.0 relationship to WCAG 2.0](https://www.w3.org/TR/ATAG20/#conf-rel-wcag)
- [A11y test suite](../tests/a11y/)
