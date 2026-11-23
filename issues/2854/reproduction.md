# #2854 reproduction

## Environment

- Upstream: `9cb988ff94b60979bbbc62b0ded5cf62fdac88c8` (0.57.0).
- Worktrees: `.lab/worktrees/before` (pristine) and `.lab/worktrees/after` (same SHA plus the experimental #2854 patch).
- Node 24.15.0, pnpm 11.8.0, Playwright 1.60.0, Chromium 148.0.7778.96.
- Default Mantine editor at `/basic/minimal?hideMenu`; 1280×840 unless stated.
- Real keyboard events through Playwright; no synthetic event mirroring between editors.

## Fixture

The minimal example starts empty. The script types two paragraphs and inserts host-page controls before and after the editor container:

```html
<button id="before-editor">Before editor</button>
<div class="bn-container">…</div>
<button id="after-editor">After editor</button>
```

This matches the issue reporter's host page and makes the intended “next control” observable. A future Diff Lab fixture route should pass the two paragraphs as `initialContent` and render the same host controls.

## Steps

1. Load the editor and type `First paragraph`, Enter, `Second paragraph`.
2. Move the pointer onto the first paragraph and click it to place the caret.
3. Wait for `.bn-side-menu` to be visible.
4. Verify the side menu is **live** (its Add block button has a `__reactProps$…` key) and that `document.activeElement` is `.bn-editor`.
5. Press `Tab`.
6. Read `document.activeElement` immediately, then after 450 ms.
7. Separately, focus the live Add block button and press `Enter` or `Space`; check whether a suggestion menu opens.
8. Separately, with the menu shown and focus on `#after-editor`, press Shift+Tab twice to reach the live Add block, then Enter.

## Observed results

### Tab with the side menu showing

| Condition | Before: immediate | Before: after 450 ms | After: immediate | After: after 450 ms |
| --- | --- | --- | --- | --- |
| Light | cloned “Add block” button, no React props | `BODY` | `#after-editor` | `#after-editor` |
| Dark | cloned “Add block” button | `BODY` | `#after-editor` | `#after-editor` |
| Forced colours, light | cloned “Add block” button | `BODY` | `#after-editor` | `#after-editor` |
| Forced colours, dark | cloned “Add block” button | `BODY` | `#after-editor` | `#after-editor` |
| Reduced motion | cloned “Add block” button | `BODY` | `#after-editor` | `#after-editor` |
| 320×800 reflow | cloned “Add block” button | `BODY` | `#after-editor` | `#after-editor` |

- Before: 3/3 repeated runs at 1280 light produced the clone followed by `BODY`.
- After: 3/3 repeated runs produced `#after-editor` immediately and after 450 ms.
- Forced colours were verified with `matchMedia('(forced-colors: active)').matches` in each run; reduced motion was verified with `matchMedia('(prefers-reduced-motion: reduce)').matches`.
- Baseline without the side menu: Tab from the editor reaches `#after-editor` in both Before and After.

### Add block activation

| Action | Before | After |
| --- | --- | --- |
| Enter on live Add block | No suggestion menu; focus stays on the button | 1 suggestion menu; focus moves into it |
| Space on live Add block | No suggestion menu | 1 suggestion menu |

### Keyboard route with the menu shown

With the pointer resting on the block and focus on `#after-editor`, two Shift+Tabs reach the live Add block button in both versions:

| Action | Before | After |
| --- | --- | --- |
| Enter on live Add block after two Shift+Tabs | No suggestion menu | Suggestion menu opens |

This is a pointer-assisted route. It does not establish keyboard-only discoverability; the side menu is not reachable without a pointer in this fixture.

## Reproduce with the scripts

Start both playground servers (the scripts expect ports 5173 and 5174):

```sh
cd .lab/worktrees/before/playground
pnpm exec vp dev --host 127.0.0.1 --port 5173 --strictPort

cd .lab/worktrees/after/playground
pnpm exec vp dev --host 127.0.0.1 --port 5174 --strictPort
```

Then, from the Diff Lab root:

```sh
export PLAYWRIGHT_BROWSERS_PATH="$PWD/.lab/ms-playwright"

node issues/2854/scripts/focus.mjs /tmp/focus.json
node issues/2854/scripts/modes.mjs /tmp/modes.json
node issues/2854/scripts/activation.mjs 5173 /tmp/activation-before.json
node issues/2854/scripts/activation.mjs 5174 /tmp/activation-after.json
node issues/2854/scripts/keyboard-route.mjs 5173 /tmp/route-before.json
node issues/2854/scripts/keyboard-route.mjs 5174 /tmp/route-after.json
node issues/2854/scripts/reflow-320.mjs /tmp/reflow.json
```

The scripts use `@playwright/test` and real `page.keyboard` input. `focus.mjs` and `modes.mjs` test both ports; the others take the port and output file.

## Evidence files

- `evidence/before/focus.json`, `evidence/after/focus.json`
- `evidence/before/modes.json`, `evidence/after/modes.json`
- `evidence/before/activation.json`, `evidence/after/activation.json`
- `evidence/before/keyboard-route.json`, `evidence/after/keyboard-route.json`
- `evidence/before/reflow-320.json`, `evidence/after/reflow-320.json`
- `evidence/before/menu-light.png`
- `evidence/{before,after}/forced-light-menu.png`
- `evidence/{before,after}/forced-light-after-tab.png`
- `evidence/{before,after}/forced-dark-after-tab.png`

The open-menu forced-dark screenshots were excluded: computed styles were white on black, but headless Chromium rendered the editor text and icons black on black while the portal was open. The focus measurements in `modes.json` are unaffected and still record `forcedColors: true`. This rendering anomaly needs a separate investigation; it is not used to judge the #2854 fix.

## Note on test stability

An earlier cross-mode pass produced inconsistent results because the side menu was not always in its live state when Tab was pressed. The retained scripts wait for the live menu, verify `__reactProps` on the Add block button, explicitly focus `.bn-editor`, and only then press Tab. Runs where that precondition was false are not used as evidence.
