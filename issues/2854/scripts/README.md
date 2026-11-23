# #2854 reproduction scripts

These scripts run against the two local BlockNote worktrees at ports 5173 (Before) and 5174 (After). They use the Diff Lab's Playwright dependency and real keyboard events.

## Requirements

- Both playground servers running at `/basic/minimal?hideMenu` on 5173 and 5174.
- Kit dependencies installed (`pnpm install` in the Diff Lab).
- A Chromium build for Playwright. In this environment:

```sh
export PLAYWRIGHT_BROWSERS_PATH="$PWD/.lab/ms-playwright"
```

## Scripts

| Command | What it does |
| --- | --- |
| `node scripts/focus.mjs out.json` | Runs three Tab cycles on each side at 1280×840 light and writes a before/after focus log. |
| `node scripts/modes.mjs out.json` | Runs the Tab cycle on both sides under light, dark, forced-light, forced-dark and reduced motion; checks the observed `matchMedia` values. |
| `node scripts/activation.mjs 5173 out.json` | Focuses the live Add block button and tests Enter and Space on one side. |
| `node scripts/keyboard-route.mjs 5174 out.json` | With the menu shown, focuses `#after-editor`, presses Shift+Tab twice to reach the live Add block, then tests Enter. |
| `node scripts/reflow-320.mjs out.json` | Repeats the Tab cycle at 320×800 on both sides. |

The scripts insert `#before-editor` and `#after-editor` host buttons and type the two paragraphs, because `/basic/minimal` starts empty.

## Expected results

- Before: Tab focuses the cloned Add block button (no `__reactProps` key) and focus falls to `BODY` after ~250 ms. Enter/Space on the live button open no menu.
- After: Tab goes to `#after-editor` and stays there. Enter/Space open one suggestion menu.

These scripts are evidence tooling, not the upstream regression test. The proposed upstream test belongs under `tests/src/end-to-end/sidemenu/` and must run in BlockNote's Docker e2e environment.
