# #2854 results

## Status

| State | Value |
| --- | --- |
| Current upstream status | OPEN at `9cb988f` (0.57.0) |
| Reproduction | Confirmed defect |
| Fix proposed | Yes, two minimal changes |
| Experimental patch implemented | Yes, in `.lab/worktrees/after` only |
| Automated keyboard tests | Pass (lab scripts) |
| Forced-colours tests | Pass (focus behaviour unchanged) |
| Human confirmation | Pending |
| Ready for upstream review | No — keyboard-route design still needs maintainer input |

## Before and after

### Tab with the side menu showing

| Condition | Before | After |
| --- | --- | --- |
| Light, 1280×840 | Cloned Add block button → `BODY` | `#after-editor`, stays |
| Dark, 1280×840 | Cloned Add block button → `BODY` | `#after-editor`, stays |
| Forced colours light | Cloned Add block button → `BODY` | `#after-editor`, stays |
| Forced colours dark | Cloned Add block button → `BODY` | `#after-editor`, stays |
| Reduced motion | Cloned Add block button → `BODY` | `#after-editor`, stays |
| Reflow 320×800 | Cloned Add block button → `BODY` | `#after-editor`, stays |

- Repeated light runs: Before 3/3 clone → `BODY`; After 3/3 `#after-editor` immediately and after 450 ms.
- The clone has no `__reactProps$…` key, confirming it is a clone rather than the live control.
- No console errors in the before or after runs.
- Baseline with no side menu: both versions Tab from the editor to `#after-editor`.

### Add block activation

| Action | Before | After |
| --- | --- | --- |
| Enter on the live Add block button | 0 suggestion menus; focus stays on the button | 1 suggestion menu; focus moves into it |
| Space on the live Add block button | 0 suggestion menus | 1 suggestion menu |

### Pointer-assisted keyboard route

With the menu shown and focus on `#after-editor`, two Shift+Tabs reach the live Add block button in both versions. Before the patch, Enter does nothing; after the patch, the suggestion menu opens. This route still requires a pointer to reveal the side menu.

## Evidence

- `evidence/before/focus.json` — 3 runs, dead clone and `BODY`.
- `evidence/after/focus.json` — 3 runs, next control.
- `evidence/{before,after}/modes.json` — five media modes.
- `evidence/{before,after}/activation.json` — Enter and Space.
- `evidence/{before,after}/keyboard-route.json` — Shift+Tab route.
- `evidence/{before,after}/reflow-320.json` — 320px reflow.
- `evidence/before/menu-light.png` — side menu shown.
- `evidence/{before,after}/forced-light-menu.png` — forced-colours light with the menu shown.
- `evidence/{before,after}/forced-light-after-tab.png` — focus after Tab under forced-colours light.
- `evidence/{before,after}/forced-dark-after-tab.png` — focus after Tab under forced-colours dark.

Open-menu forced-dark screenshots were excluded: computed styles were white on black, but headless Chromium rendered the editor text and icons black on black while the portal was open. The `forcedColors: true` observations and focus targets in `modes.json` remain valid. The rendering anomaly needs a separate investigation and is not attributed to this patch.

## Tests performed

- Proposed upstream regression test: `upstream-test/sideMenuKeyboardFocus.test.tsx` (not executed; upstream requires Docker e2e).

- `node --check` on the lab scripts.
- Targeted `vp lint` on the two patched files: 0 warnings, 0 errors.
- Real-keyboard Playwright runs in Chromium 148 (Playwright 1.60.0, Chromium revision 1223).
- `matchMedia` checks for forced colours and reduced motion in every media mode.
- No full upstream test suite was run. The proposed upstream end-to-end test is documented but not executed, because upstream requires its browser suite to run in Docker.

**Automated scanning note:** axe-core and Lighthouse are not treated as evidence for this defect. A button that receives focus and then disappears is a focus-order/activation problem; the meaningful checks are the active element, its React props, its accessible name and the subsequent focus target. A screen-reader session is still pending.

## Lab integration status

The Diff Lab comparison now targets #2854 (`compare.config.json` → `side-menu-keyboard-focus`) and loads a shared two-paragraph fixture from local commit `4611ae1` (based on upstream `9cb988f`). Each live pane has a **Focus before editor** button before the iframe and a **Focus after editor** button after it, plus a focus-status line:

- **Before:** after Tab from the hovered editor, the top-level active element remains the Before iframe; the status reads “Keyboard focus: still inside the Before editor preview; the adjacent focus target has not received focus.” The adjacent control does not receive focus.
- **After:** Tab moves to `#after-next` (Focus after editor); the status reads “Keyboard focus: Focus after editor (After).”
- Clicking either focus button directly updates the status and shows a visible focus ring.
- No console errors; the existing 4-step reproduction checklist now describes the #2854 focus and activation checks.

Evidence: `evidence/viewer-fixture.json` and `evidence/viewer-fixture.png`.

The fixture is opt-in via `?fixture2854`, so the standalone reproduction scripts still use the stock empty route and type their own content. The fixture commit and its patch are recorded in `fixture.json` and `fixture.patch`; the After diff remains only the two-file #2854 patch.

## Patch

`patch/2854.patch` changes:

1. `packages/react/src/components/Popovers/GenericPopover.tsx` — mark the closing snapshot wrapper `inert` and remove the attribute on cleanup.
2. `packages/react/src/components/SideMenu/DefaultButtons/AddBlockButton.tsx` — move `onClick` from the icon to the shared side-menu button.

`git apply --check` against the pristine Before worktree at the same SHA succeeds.

## Limitations

- This is a **partial** fix. It stops focus loss and fixes activation, but the side menu still requires a pointer to appear. The issue's full keyboard-only goal is unresolved.
- Only Mantine was exercised. Ariakit and shadcn share `GenericPopover` and `AddBlockButton`, but their rendered buttons/menus were not tested.
- Only Chromium was tested; Firefox and Safari are unverified.
- No human screen-reader session was performed. The focus target after Tab is a host-page button, not the editor; screen-reader announcement of that move still needs a person.
- The `inert` attribute requires a modern browser. No fallback/polyfill was added.
- An open-menu forced-dark screenshot rendered black text/icons on black despite computed white styles; it is excluded from visual evidence and needs a separate forced-colours rendering investigation.
- The patch changes a generic popover closing path, not just the side menu. It should be reviewed for any popover that expects to remain interactive while closing. No such case was found, but the upstream test suite was not run.

## Recommendation

1. Propose the two minimal changes upstream with a regression test for the dead focus stop and button activation.
2. Ask maintainers to decide the keyboard-only route separately (Shift+F10, an escape-entered block-highlight mode, or an explicit focus move) because the Tab/indentation trade-off is a product decision.
3. If maintainers prefer the downstream-style `tabIndex={-1}` approach, keep the activation fix and replace the `inert` change accordingly.
4. Do not claim #2854 is fully fixed until a keyboard-only user can discover and operate the controls without a pointer.

## Provenance

- Upstream SHA: `9cb988ff94b60979bbbc62b0ded5cf62fdac88c8`.
- Shared fixture commit: `4611ae1b9347bad09f243f9b264d8754ffc660e5` (two-paragraph opt-in seed).
- After worktree: fixture commit plus the two-file experimental patch.
- Date: 2026-11-23.
- Browser: Chromium 148.0.7778.96; OS macOS arm64.
- No upstream PR was opened and no upstream repository was pushed.
