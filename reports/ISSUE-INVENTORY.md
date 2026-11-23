# BlockNote accessibility issue inventory

**Generated:** 2026-11-23  
**Upstream:** `TypeCellOS/BlockNote` at `9cb988ff94b60979bbbc62b0ded5cf62fdac88c8` (packages `0.57.0`)  
**Environment:** macOS arm64; Node 24.15.0; pnpm 11.8.0; Chromium 148.0.7778.96 via Playwright 1.60.0; filtered `@blocknote/example-editor` install; two Git worktrees under `.lab/worktrees/`, both at local fixture commit `4611ae1` based on upstream `9cb988f` (`?fixture2854` adds two paragraphs).

## Method and scope

- Rechecked every issue with `gh issue view` and the issue timeline API on 2026-11-23. All nine listed open issues are still open; the seven historical issues listed below are closed as completed.
- Inspected the current source, the generated playground registry, and existing Vitest browser / end-to-end tests.
- Reproduced #2854 against both worktrees with real keyboard input in Chromium. No other issue has been reproduced yet.
- The full monorepo was not installed and BlockNote's Docker-only browser suite was not run. A filtered playground install was used, as documented in the Diff Lab README.
- No screen-reader transcript has been produced yet. Automated and keyboard evidence must not be read as a conformance claim.

## Open issues

| Issue | Title | State | Priority | Classification | Reproduction confidence | Main component(s) | Upstream activity | Recommended next action |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| [#2854](https://github.com/TypeCellOS/BlockNote/issues/2854) | Side menu "Add block" (+) not usable with keyboard | OPEN | P1 | **Verified defect** | **Verified** 3/3 runs; light, dark, forced-light, forced-dark, reduced motion; 320px | `packages/core/src/extensions/SideMenu/`, `packages/react/src/components/SideMenu/`, `packages/react/src/components/Popovers/GenericPopover.tsx` | Maintainer discussion 2026-06-17; detailed reproduction 2026-10-30; no fix PR | Seeded viewer comparison integrated; upstream regression test proposed; maintainer decision on full keyboard route |
| [#977](https://github.com/TypeCellOS/BlockNote/issues/977) | Tab does not work when highlighting multiple items | OPEN | P3 | Reported; partly intentional | Not reproduced | `KeyboardShortcutsExtension`, multi-block selection, block nesting | Maintainer: toolbar focus is intentional, but checklist/video override the built-in Tab handling | Build the caret / text selection / multi-block / list / exit state matrix |
| [#2822](https://github.com/TypeCellOS/BlockNote/issues/2822) | Missing alternative text field for images | OPEN | P1 | Fix in review | High report; PR #3337 open | `packages/core/src/blocks/File/`, image toolbar, serialization | PR #3337 open; reporter tested the alt field and reported remaining concerns | Validate PR #3337, then add import/export and keyboard regression tests |
| [#2825](https://github.com/TypeCellOS/BlockNote/issues/2825) | Table headers are not associated with data cells | OPEN | P1 | Fix in review | High report; PR #3215 open; axe does not flag it | `packages/core/src/blocks/Table/`, table decorations/export | PR #3215 open; maintainer asks for concrete screen-reader callouts | Validate scopes/headers with a screen reader and add export tests |
| [#2809](https://github.com/TypeCellOS/BlockNote/issues/2809) | Structure document lists correctly in reading mode | OPEN | P1 | Reported; shared upstream rendering plus downstream Docs | Medium; needs read-only verification | `packages/core/src/blocks/ListItem/`, block-group rendering, Docs reading mode | Maintainer notes that `ul`/`ol` wrappers would need a plugin; `role="list"` needs a wrapper too | Verify upstream read-only output, then prototype a wrapper in the consuming app or a plugin |
| [#2826](https://github.com/TypeCellOS/BlockNote/issues/2826) | Merged table cells do not expose clear header relationships | OPEN | P2 | Fix in review | Medium; PR #3215 | Table spans, decorations, export | Covered by PR #3215 | Validate merged rows/columns and multiple applicable headers |
| [#2823](https://github.com/TypeCellOS/BlockNote/issues/2823) | Bilingual documents: no language on foreign-language passages | OPEN | P2 | Feature / design | Not implemented | Inline content schema, marks, HTML export | No comments or PR | Decide block-level vs inline language metadata; design import/export |
| [#2853](https://github.com/TypeCellOS/BlockNote/issues/2853) | Improve table and videos accessibility | OPEN | P2 | Feature / design | Low | Table props/UI, video block | No comments or PR | Split table caption from video controls; design each separately |
| [#2829](https://github.com/TypeCellOS/BlockNote/issues/2829) | Keyboard workflow for deleting a table is not explained | OPEN | P2 | **Downstream documentation** | High for the Docs page; runtime workflow still to verify | External Docs content, not this repository | Maintainer says it first needs #2854 | Document the keyboard workflow after #2854 is resolved |

**Reported versions:** #2854 explicitly reports 0.56.0 and 0.57.0 and was reproduced on 0.57.0. #977 dates from 2024 and does not state a version. The remaining open issues do not include an affected version in their bodies. #2822's reporter tested PR #3337; #2825/#2826 are covered by open PR #3215. Treat version claims as reported unless a reproduction is listed.

**WCAG 2.2 mapping (indicative):** #2854 — 2.1.1, 2.4.3, 2.4.7, 4.1.2; #977 — 2.1.1, 2.4.3; #2822 — 1.1.1; #2825/#2826 — 1.3.1; #2809 — 1.3.1; #2823 — 3.1.2; #2853 — 1.3.1, 1.1.1, 2.1.1; #2829 — 3.3.2. These are investigation targets, not conformance findings.

## Closed historical issues

The fixes below are useful regression candidates. “Likely PR” means the PR was merged on the same day the issue closed; confirm the exact commit before treating it as the sole fix.

| Issue | Title | Closed | Fix evidence | Regression value |
| --- | --- | --- | --- | --- |
| [#2813](https://github.com/TypeCellOS/BlockNote/issues/2813) | Focus not moved when image edit panel opens | 2026-11-20 | Likely PR #3220 (merged 2026-11-20) | High: focus-management regression |
| [#2811](https://github.com/TypeCellOS/BlockNote/issues/2811) | Collapsible list: unlabeled accessible button, decorative image | 2026-10-09 | Fixed in a release; reporter confirmed with NVDA on 2026-10-22. Exact commit not isolated; PR #3133 remains open as a follow-up | High: accessible name/state regression |
| [#2812](https://github.com/TypeCellOS/BlockNote/issues/2812) | Docs editor: tab indentation not announced | 2026-11-20 | Likely PR #3290 (merged 2026-11-20) | High: live announcement regression |
| [#2824](https://github.com/TypeCellOS/BlockNote/issues/2824) | Comment thread actions: hover-only controls, unlabeled buttons | 2026-11-20 | Likely PR #3221 (merged 2026-11-20) | High: keyboard access to comment actions |
| [#2827](https://github.com/TypeCellOS/BlockNote/issues/2827) | Some table colors do not meet contrast requirements | 2026-11-04 | Likely PR #3206 (merged 2026-11-04) | Medium: forced-colours/contrast regression |
| [#2852](https://github.com/TypeCellOS/BlockNote/issues/2852) | Improve color palette accessibility | 2026-11-04 | Likely PR #3206 (merged 2026-11-04) | Medium: contrast regression |
| [#2855](https://github.com/TypeCellOS/BlockNote/issues/2855) | Placeholder and side menu icon contrast | 2026-11-20 | Likely PR #3338 (merged 2026-11-20) | Medium: contrast regression in normal and forced colours |

## Classification summary

- **Verified defect:** #2854.
- **Reported but not reproduced:** #977, #2809, #2823, #2853.
- **Fix in review upstream:** #2822 (PR #3337), #2825 and #2826 (PR #3215). Do not duplicate these fixes; validate the existing PRs instead.
- **Downstream / documentation:** #2829 (Docs content). #2809 is a shared rendering problem, but it is observed through the Docs reading mode and needs both upstream and downstream decisions.
- **Fixed / historical:** #2811, #2812, #2813, #2824, #2827, #2852, #2855. These need regression coverage, not re-fixing.

## Five strongest before/after candidates

1. **#2854 — side-menu keyboard focus.** Verified; small source surface; clear user impact; patch already prototyped. This is the first comparison.
2. **#977 — Tab with multi-block selections.** Keyboard-centric and core, but the intended behaviour depends on selection and `tabBehavior`. Needs a state matrix before a patch is credible.
3. **#2822 — image alternative text.** High user impact and a concrete authoring workflow, but PR #3337 already exists. Use the Diff Lab to validate the PR rather than duplicating it.
4. **#2825 — table header relationships.** Semantic HTML issue with an existing PR (#3215). Best used to verify screen-reader impact and export preservation, since axe does not flag it.
5. **#2809 — list semantics in reading mode.** High impact, but architectural: list siblings need a wrapper plugin or a deliberate `role="list"` structure. Good candidate for a design prototype, not a one-line patch.

**Recommended first three investigations:** #2854 (verified and prototyped), #977 (keyboard state matrix), #2822 (validate the existing PR and add regression coverage). #2825/#2826 should follow as PR validation; #2809 needs a design decision before implementation.

## Likely source locations

| Issue | Packages/files |
| --- | --- |
| #2854 | `packages/core/src/extensions/SideMenu/SideMenu.ts`, `packages/react/src/components/SideMenu/SideMenuController.tsx`, `.../DefaultButtons/AddBlockButton.tsx`, `.../DefaultButtons/DragHandleButton.tsx`, `packages/react/src/components/Popovers/{BlockPopover,GenericPopover}.tsx`, `packages/{mantine,ariakit,shadcn}/src/sideMenu/SideMenuButton.tsx` |
| #977 | `packages/core/src/extensions/tiptap-extensions/KeyboardShortcuts/KeyboardShortcutsExtension.ts`, `MultipleNodeSelection`, block nesting commands |
| #2822 | `packages/core/src/blocks/File/block.ts`, `packages/core/src/blocks/File/helpers/`, `packages/react/src/blocks/{File,Image}/`, image/file toolbar components, HTML import/export |
| #2825, #2826 | `packages/core/src/blocks/Table/block.ts`, `TableExtension.ts`, table export/decorations, `packages/react/src/components/TableHandles/` |
| #2809 | `packages/core/src/blocks/ListItem/{BulletListItem,NumberedListItem,CheckListItem,ToggleListItem}`, block-group/read-only rendering, consuming Docs view |
| #2823 | inline content schema/marks, HTML import/export, formatting or block controls |
| #2853 | table props/UI and video block; no caption property exists today |
| #2829 | external Docs content; not in this repository |

## Downstream versus upstream

- **#2829** is a documentation defect in the audited Docs product. Do not change BlockNote runtime code for it.
- **#2809** appears in Docs reading mode, but the editor's list blocks intentionally render `<p>` without list wrappers. The semantic gap is shared; the practical fix may need a reading-mode renderer or plugin.
- **#2822** is observed in Docs, but the missing property is in BlockNote's file/image block and toolbar. PR #3337 addresses the upstream authoring surface.
- **#2854** is upstream. The Drupal BlockNote module works around it by setting `tabindex="-1"` on its custom menu and providing alternate keyboard routes; that workaround is not a fix for the default UI.

## #2854 reproduction plan

**Fixture:** default Mantine editor, route `/basic/minimal?hideMenu`, two paragraphs (`First paragraph`, `Second paragraph`), plus focusable host buttons before and after `.bn-container`. The minimal example starts empty, so the scripts type the blocks; a future fixture route should pass them as `initialContent`.

**Minimal steps:**

1. Hover the first paragraph so `.bn-side-menu` appears; click to place the caret in that block.
2. Confirm the menu is live (the Add block button has React props) and the editor is focused.
3. Press `Tab`.
4. Record `document.activeElement` immediately and after 450 ms.
5. Separately, focus the live Add block button and press `Enter` or `Space`; check for a suggestion menu.

**Observed before:** Tab focuses a cloned Add block button with no React handlers; Enter/Space do nothing; the clone is removed after the closing transition and focus falls to `document.body`. This reproduces in all tested media modes and at 320px.

**Observed after the prototype:** Tab moves to the host button after the editor and stays there; the closing copy is inert. Enter/Space on the live Add block opens the suggestion menu. A real keyboard route from the host button after the editor (Shift+Tab twice with the menu shown) reaches the live Add block and activates it only after the patch.

**Root cause:** the core side-menu keydown listener hides the menu on Tab; `SideMenuController` drops its children while closing; `GenericPopover` clones the last rendered DOM for the closing transition without `inert`; the browser's Tab default focuses the cloned button, which then unmounts. Separately, `AddBlockButton` attaches `onClick` to the icon rather than the button.

**Candidate fixes:**

| Option | Impact | Risk / cost |
| --- | --- | --- |
| A. Mark closing `GenericPopover` snapshots `inert`; move Add block `onClick` to the button | Fixes dead tab stops and keyboard activation; applies to all popovers | Small, generic; does not create a keyboard-only route to the side menu |
| B. Set `tabIndex={-1}` on side-menu buttons | Tab passes over the live menu and its copy; host apps provide another route | Removes Tab access; relies on downstream routes; does not fix activation |
| C. Ignore Tab in the hide listener or move focus explicitly into the live menu | Could make the live menu reachable by Tab | Conflicts with Tab indentation and needs a maintainer design decision |

The prototype follows option A. It is a partial fix: it prevents focus loss and makes the controls activate correctly when reached, but it does **not** make the side menu discoverable by keyboard alone. The full issue still needs a decision on a non-conflicting keyboard route.

## Proposed tests for #2854

- **Before/after lab scripts:** `issues/2854/scripts/focus.mjs`, `modes.mjs`, `activation.mjs`, `keyboard-route.mjs`, `reflow-320.mjs`. They use real keyboard input and assert `document.activeElement`, not mirrored events.
- **Upstream regression test:** add an end-to-end test under `tests/src/end-to-end/sidemenu/` that renders an editor with host buttons before/after, shows the menu with a pointer, focuses the editor, presses Tab, and asserts the next focus target; separately assert Enter/Space on the live Add block opens the suggestion menu. Run it in the upstream Docker e2e environment, not natively.
- **Conditions:** light, dark, forced-colours light, forced-colours dark, reduced motion, 320×800 reflow, and keyboard-only. Forced colours must be applied to the editor document and verified with `matchMedia('(forced-colors: active)')`; the viewer must not be the emulation target.
- **UI implementations:** Mantine first, then Ariakit and shadcn. `GenericPopover` and `AddBlockButton` are shared, so the fix should apply across all three, but the actual rendered button/menu must be checked.
- **Screen reader:** after the focus fix, verify that Tab does not announce a phantom Add block control and that the live Add block has a name and opens the menu. No screen-reader transcript exists yet.

## Resource-conscious execution plan

- Reuse the existing two worktrees at `9cb988f`; do not clone again.
- Use the local Node 24.15.0/pnpm 11.8.0 toolchain and the filtered playground install already completed.
- Run only targeted Playwright scripts against the two dev servers (`5173`, `5174`); do not build the monorepo and do not run the Docker e2e suite.
- Reuse the shared pnpm store and the installed Chromium 1223. The filtered install selected 20 of 128 workspace projects.
- Current footprint: `.lab` 3.9 GB (two worktrees ~1.5 GB each, Chromium 534 MB, toolchain 251 MB), the shared pnpm store at `.pnpm-store` 1.2 GB, and 20 MB of kit dependencies; 15 GB free on the volume at the time of writing. The first filtered install was the expensive step because of slow registry downloads; the second reused the store. Warm dev servers were ready in roughly 2–6 seconds.
- Evidence runs: 6 focus runs, 10 media-mode runs, 4 activation runs, 2 keyboard-route runs and 2 reflow runs. Bounded to one browser and small documents.

## Assumptions and unverified items

- The reported failures were against `0.57.0`; this checkout is `0.57.0`, so the comparison is against the same package version.
- Only Chromium 148 was exercised. Firefox and Safari focus behaviour and `inert` support are unverified.
- Only the default Mantine UI was exercised. Ariakit and shadcn use the same shared components but were not clicked through.
- `inert` is assumed to be supported by the target browsers; no polyfill was added. The test fixture does not exercise an older browser.
- The side-menu keyboard route still requires a pointer to reveal the menu. A fully keyboard-only route remains a design decision.
- The upstream Docker e2e suite was not run. The proposed upstream regression test is not yet executed.
- No human screen-reader session was performed; automated DOM/focus evidence is not a substitute.
- The fix was not proposed upstream and no upstream PR was opened.

## Evidence

- Issue inventory JSON: `reports/issue-inventory.json`
- #2854 issue file: `issues/2854/ISSUE.md`
- Reproduction: `issues/2854/reproduction.md`
- Root-cause analysis and alternatives: `issues/2854/hypothesis.md`
- Results and limitations: `issues/2854/RESULTS.md`
- Experimental patch: `issues/2854/patch/2854.patch`
- Before/after evidence: `issues/2854/evidence/{before,after}/`
