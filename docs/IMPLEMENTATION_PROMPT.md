# Implementation prompt: BlockNote Accessibility Diff Lab

You are improving an existing MIT-licensed starter kit for an **independent BlockNote before/after accessibility comparison laboratory**. Work in this starter kit, not in the official BlockNote repository unless applying a controlled experimental patch to an isolated Git worktree.

Read `README.md`, `compare.config.json`, and the code first. Inspect current BlockNote upstream files and `AGENTS.md` before changing commands. Do not assume current upstream code matches your training data.

## Objective and non-negotiable contract

- Show an **unmodified pinned Git revision** of BlockNote alongside **the same revision with one user-selected patch applied**.
- Provide transparent metadata, including upstream SHA, patch SHA-256, test URL, scenario, browser state, screen width and limitations.
- Show a concrete **Steps to reproduce** checklist with separate Before and After observations.
- Allow manual exploration of both real editable BlockNote instances using keyboard, pointer and assistive technology.
- Support light, dark, forced-colours light and forced-colours dark through actual browser emulation, not a CSS filter. Confirm what `matchMedia` observes in both frames.
- Capture reproducible Playwright screenshots and accessibility evidence for before and after under the same conditions.
- Preserve MIT licensing of lab-authored code. Keep BlockNote's MPL-2.0 and GPL-3.0 XL packages under their own terms. Never silently relicense upstream files.
- Make results honest: a lack of changes must not be shown as a fix, and a score increase is not WCAG conformance.

## Phase 0: Validate before modifying

1. Run `node --test tests/*.test.mjs`.
2. Run `node bin/diff-lab.mjs demo`, open the viewer and verify synthetic fixtures are clearly labeled as synthetic.
3. Inspect `TypeCellOS/BlockNote` current `AGENTS.md`, `package.json`, `playground/package.json`, `playground/vite.config.ts`, `playground/src/examples.gen.tsx`, `tests` and `packages/{core,react,mantine}`.
4. Verify actual Vite+ CLI switches for dev host, port and strict port against the pinned upstream revision. Adjust the launcher only if the upstream CLI requires it.
5. Record the capabilities already present and any incompatibilities. Never claim execution of the full BlockNote stack unless installed and run.

## Phase 1: First real upstream checkout

1. Prefer `node bin/diff-lab.mjs prepare --repo /existing/BlockNote` to reuse an existing checkout. If absent, use one shallow, single-branch, blob-filtered clone, and two Git worktrees. Do not clone the repository twice.
2. Pin the real commit SHA once. The same SHA must be present on Before and After.
3. Accept `--patch /path/to/change.patch`. Validate with `git apply --check` and apply only to After. Never touch the user's working branch or uncommitted changes.
4. Make preparation idempotent and non-destructive, including on errors. Record patch hash and after-worktree `git diff` hash. Explicitly refuse to overwrite an existing divergent comparison.
5. If updating a clone, fetch deliberately with `--update` and prepare a fresh isolated comparison. Do not update a running comparison silently.

**Acceptance:** A minimal patch against a temporary Git repository changes After only. Two editors load when BlockNote is installed. Both report the same source SHA, with a patch hash on After.

## Phase 2: Reduce runtime costs while keeping real BlockNote

1. Start from upstream `playground/` with the single `/basic/minimal?hideMenu` example as the initial route. It is already a real editor.
2. Reuse `pnpm`'s content-addressed package store across two installs. Never share a mutable `node_modules` directory between worktrees.
3. Measure cold installation time, warm start, disk consumption and peak memory. Add an option to run one Vite+ server at a time for low-resource systems, with honest UI that live side-by-side is unavailable in this mode.
4. If the upstream playground is too heavy, add an opt-in minimal editor fixture built against the *local source packages* (not silently against published npm packages). Validate that aliases point to the pinned worktree.
5. Avoid building AI, PDF/Docx, collaboration or all example variants unless required by the actual patch.

**Acceptance:** Both editors can be edited independently and reproduce the same initial fixture before applying a fix. Original source remains unchanged.

## Phase 3: UI and reproduction steps

1. Preserve a first-class `compare.config.json` with title, issue URL, expected behavior, reproduction steps, patch file and route.
2. Add per-step status `not reviewed`, `passes`, `fails`, and `needs manual validation`, without equating a filled checkbox with passing.
3. Preserve observations across reload, export a stand-alone Markdown and JSON evidence report and link to upstream issue/PR.
4. Keep separate targets for actual iframe viewport dimensions and their display scaling. Provide 320, 390, 768, 1280px and custom dimensions. Do not introduce false responsive test results by shrinking the iframe's layout viewport.
5. Add an optional side-by-side versus onion visual comparison, provided cross-origin iframe limitations are respected. Never claim full pixel diffs from cross-origin frames without screenshot access.
6. Never synthetically mirror keyboard events and claim real keyboard behavior; run Playwright keyboard scenarios independently.

**Acceptance:** A contributor can follow and record each step on each side, then download evidence with pinned revision and condition metadata.

## Phase 4: Forced-colours and user preferences

1. Reuse the proven pattern in `mgifford/drupal-core-lab/tools/compare/emulation.mjs` and `media-preferences.mjs`, adapting it to an independent MIT tool. Preserve relevant attribution and third-party rights.
2. Use isolated origins, e.g. `before.localhost` and `after.localhost`, to obtain CDP sessions for *each iframe*; never apply media emulation to the entire viewer as fallback.
3. Support normal, light, dark, forced light, forced dark, reduced motion, and more contrast when Chromium confirms it is supported.
4. Show `matchMedia` values observed in both frames, whether the browser is controlled, and clear diagnostics for unsupported modes.
5. After navigation, recreate the CDP session where needed and reapply the user-selected condition to both frames.
6. Confirm on Windows with actual high-contrast themes when possible. Browser forced-colours emulation is useful evidence but not equivalent to native AT/user testing.

**Acceptance:** The Chromium viewer remains in its own normal theme while each editor reports `forced-colors: active` for both forced modes. No false indication when emulation fails.

## Phase 5: Automated evidence

1. Add Playwright interaction scripts with real keyboard behavior, focused element capture and the resulting document contents. Provide scenarios for toolbar, slash menu, Escape focus restoration, tables and read-only mode as focused milestones.
2. Capture a visual/ARIA snapshot per side and condition, with animations stabilized and known nondeterministic content masked or documented.
3. Run axe-core against relevant editor states, including open menus. Classify violations, incomplete checks and skipped checks without implying full conformance.
4. Add Lighthouse as an optional page-load audit for accessibility, best practices and performance. Report scores and individual audit regressions. Avoid attributing changes solely to a patch when normal Lighthouse variance or environmental differences are plausible.
5. Ensure a fixed initial document fixture with stable block IDs or normalized IDs, so comparisons do not report random ID churn as a change.
6. Add report navigation and a machine-readable result schema. Identify what is automated and what a person must check.

**Acceptance:** After one command, capture evidence covers both sides at light, dark, forced light, forced dark and 320px; failures are explicit and never silently dropped.

## Phase 6: GitHub Pages, after local functionality is proven

1. GitHub Pages can host static compiled before/after editor bundles and reports. It cannot start `vp dev` processes or control local Chromium directly.
2. Build two reproducible production bundles from pinned before and after source. Configure the Vite public base separately for both subpaths, with direct deep links resolving on refresh.
3. Public Pages shows the two real compiled editors, reproduction guidance, screenshots and provenance; actual forced-colours interactivity depends on user's native OS setting and browser. Show CI-generated forced-colours evidence beside them.
4. Use GitHub Actions caching with pinned lockfiles, explicit SHA and patch hash, and artifact retention. Fail visibly if either preview or audit artifact is absent.
5. Add clear descriptions for license differences: lab MIT, upstream core/react/mantine MPL-2.0, XL packages GPL-3.0.

**Acceptance:** A published page includes a permanent link for one BlockNote issue, an interactive before and after, and a validated forced-colours evidence pair. No local or privileged process is required to view the public site.

## Completion requirements

- Run existing unit tests, a real BlockNote smoke test, Playwright capture and a keyboard manual test.
- Document exact executed commands and measurable results.
- Note changes, omissions and reasons; provide `before/after` screenshots and logs where relevant.
- Do not state that tests pass if dependencies or network access prevent execution.
- Submit work in small logical commits or PRs only when explicitly requested; do not rewrite upstream code unrelated to the selected issue.

## References

- https://github.com/TypeCellOS/BlockNote
- https://github.com/TypeCellOS/BlockNote/blob/main/AGENTS.md
- https://github.com/TypeCellOS/BlockNote/issues/3208
- https://github.com/mgifford/drupal-core-lab/tree/main/tools/compare
- https://github.com/mgifford/FOSDEM-website/tree/main/tools/compare
- https://playwright.dev/docs/emulation
