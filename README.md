# BlockNote Accessibility Diff Lab (starter kit)

**Purpose:** compare one pinned BlockNote Git revision against **the same revision plus a proposed patch**. In the live workflow, both sides run real editor code from independent Git worktrees. The viewer provides reproduction steps, manual observation fields and local Chromium forced-colours testing. A Playwright capture script records screenshots, axe-core findings, ARIA snapshots and one basic keyboard-editing scenario.

This starter kit is **not** a completed BlockNote regression suite or a WCAG conformance evaluator. The optional fixture/demo mode uses deliberately simplified HTML, not BlockNote. It contains a synthetic two-author document with a focus difference, author attribution, presence and a scripted local "concurrent editing" animation. Demo output is not editor evidence, and the animation is not a real collaborative session. The main live workflow uses BlockNote's existing Vite+ playground, not a reimplementation of the editor.

## Contents

- [Files](#files)
- [Requirements](#requirements)
- [What `prepare` creates](#what-prepare-creates)
- [Step 1: Preview the lab without cloning BlockNote](#step-1-preview-the-lab-without-cloning-blocknote)
- [Step 2: Prepare the actual BlockNote sources](#step-2-prepare-the-actual-blocknote-sources)
  - [Resetting or recovering a comparison](#resetting-or-recovering-a-comparison)
- [Step 3: Install dependencies once per worktree](#step-3-install-dependencies-once-per-worktree)
- [Step 4: Run both real editors](#step-4-run-both-real-editors)
- [Step 5: Real forced colours in Chromium](#step-5-real-forced-colours-in-chromium)
- [Step 6: Capture independent, repeatable evidence](#step-6-capture-independent-repeatable-evidence)
- [How to update the first comparison](#how-to-update-the-first-comparison)
- [Troubleshooting](#troubleshooting)
- [Command reference](#command-reference)
- [Known limits of the starter](#known-limits-of-the-starter)
- [Glossary](#glossary)
- [Upstream references](#upstream-references)
- [Licensing](#licensing)

## Files

- `compare.config.json`: one comparison, issue, site route, patch and step-by-step checks.
- `bin/diff-lab.mjs`: prepare, install, start, demo, doctor, capture, status and help commands.
- `lib/git.mjs`: shallow clone or existing checkout; before/after worktrees; patch application.
- `lib/server.mjs`: local comparison viewer, demo fixtures and developer API, without a separate web framework.
- `lib/browser.mjs`: optional Chromium-controlled frame-specific media emulation through CDP.
- `lib/capture.mjs`: screenshots, axe-core scans, ARIA snapshots and the keyboard scenario.
- `lib/demo-fixture.mjs`: synthetic two-author document used by demo mode, including the scripted collaboration animation.
- `site/`: comparison viewer and observation export. It is intended to be accessible, but it has not been independently audited and should itself be treated as a test target.
- `docs/IMPLEMENTATION_PROMPT.md`: phased instructions for expanding and validating the kit with another LLM.
- `tests/`: unit and browser tests. `tests/pages-contract.test.mjs` checks the issue catalog and observation-export contract; `tests/pages.e2e.mjs` checks every issue’s Before/After region, observation persistence, export and reset in Chromium. `tests/a11y/` holds the axe, Guidepup Virtual Screen Reader, real-keyboard and semantic before/after tests; raw evidence goes to `reports/a11y/<timestamp>/`.
- `docs/ATAG-2.0-A11YFIRST.md`: evidence map from the tests to ATAG 2.0 Part A/B and the A11yFirst authoring principles, with explicit gaps and scope boundaries.
- `docs/gaps/`: the A11yFirst and ATAG 2.0 Part B gap register. One Markdown file per gap, with current-main behavior, evidence, acceptance criteria, and an out-of-scope section.
- `docs/ATAG-ALIGNMENT-ISSUES.md`: standards, scope, and evidence alignment issues between the lab and ATAG 2.0 (WCAG version, component vs complete tool, Part A/B conflation, preview evidence, conformance limits).
- `docs/REVIEW-PROTOCOL.md`: branch + PR workflow, required checks, evidence rules and the review checklist. Direct pushes to `main` are not part of the process.
- `docs/reviews/2026-11-24-direct-main-baseline.md`: one-time post-hoc review index for the accessibility work that landed directly on `main` before the protocol.
- `docs/PLAYWRIGHT-MCP.md` and `mcp/playwright-mcp/`: Playwright MCP configuration for interactive inspection. The MCP path is not keyboard or screen-reader evidence; the test suite is.
- `issues/`: issue-specific investigations, reproductions, experimental patches and evidence, starting with #2854.
- `pages/` and `scripts/build-pages.mjs`: static before/after comparator for GitHub Pages, including the prebuilt `pages/before`, `pages/after`, `pages/after-inert` and `pages/after-activation` BlockNote bundles, evidence and patches. It does not need the Vite+ dev servers.
- `pages/issues.json`: the reported-issue catalog, validation steps, expected results and fix links used by the page.
- `pages/app/` and `scripts/build-static-bundles.sh`: the small Vite/React app used to build the static bundles. The Pages workflow only assembles committed bundles; rebuilding requires prepared BlockNote worktrees.
- `scripts/check-previews.mjs`: network smoke check that the external Playground routes still render and that the current-main/PR differences are still present. `.github/workflows/preview-smoke.yml` runs it manually or weekly; it is not part of the deploy gate.
- `docs/STATIC-COMPARATOR.md`: feature comparison with the FOSDEM comparator and the remaining gaps.
- `.github/workflows/pages.yml`: builds and deploys that static report on pushes to `main`.
- `reports/ISSUE-INVENTORY.md` and `reports/issue-inventory.json`: verified open/closed accessibility issue inventory and machine-readable data.
- Generated directories: `.lab/` (source, worktrees, state, local browser/toolchain) is ignored; timestamped `reports/<timestamp>/` capture output is ignored. The two inventory files above are tracked.

## Accessibility investigations

[`reports/ISSUE-INVENTORY.md`](reports/ISSUE-INVENTORY.md) records the current open and closed issues, which are upstream versus downstream, and the five strongest before/after candidates. The first verified comparison is **#2854** in [`issues/2854/`](issues/2854/): a side-menu Tab/focus defect, with a two-file experimental patch, before/after evidence across light, dark, forced-colours light/dark, reduced motion and 320px, and a documented limitation that keyboard-only discoverability is not yet solved. The viewer comparison now targets #2854 and adds real **Focus before editor** / **Focus after editor** buttons around each live pane plus a focus-status line. Both live panes start from a shared local two-paragraph fixture commit (`4611ae1`, based on upstream `9cb988f`); the standalone reproduction scripts keep using the stock empty minimal route.

No upstream BlockNote PR has been opened from this lab.

## A11yFirst and ATAG Part B gap register

[`docs/gaps/`](docs/gaps/) records the current-main gaps against the A11yFirst authoring model and every ATAG 2.0 Part B checkpoint. There is one Markdown file per gap with current behavior, evidence, acceptance criteria and an out-of-scope section. The register does **not** review upstream pull requests and does **not** perform real screen-reader or disabled-people testing; those are separate activities. Start with the [gap register index](docs/gaps/README.md).

## Public static evidence

**https://mgifford.github.io/blocknote-diff-lab/** is a static issue comparator for BlockNote, modeled on the [FOSDEM comparator](https://mgifford.github.io/FOSDEM-website/compare/). See [`docs/STATIC-COMPARATOR.md`](docs/STATIC-COMPARATOR.md) for the feature comparison. It catalogs nine reported issues with prefilled validation steps and expected results. Every issue has a visible Before/After region: local built editors for #2854, current-main vs PR preview for #2822/#2825/#2826, and an explicit no-patch After panel otherwise. External frames deep-link to a Playground example that already contains the affected block (Default Schema Showcase for media and lists, Advanced Tables for table headers) because the Playground root is an example chooser, not an editor. #2854 has two prebuilt BlockNote editors side by side, with three After variants (both fixes, inert-only, activation-only), editor-theme and frame-width controls, synced scrolling, URL state, real focus targets, a same-origin focus readout, per-variant patch diffs and provenance; the five issues without a bundled or upstream patch use an explicit no-patch After panel: four are labelled **Reproduction only**, and #2829 is labelled **Docs** because it is a downstream documentation change; #2822, #2825 and #2826 also link to their real PR preview playgrounds. Each check has an **Observed** field and each issue has observer notes; **Download observations (JSON)** exports every issue with recorded data together with the build SHA. It is generated by `.github/workflows/pages.yml` and can be rebuilt locally with `pnpm pages:build`.

GitHub Pages cannot run BlockNote’s Vite+ dev servers, the local viewer API or the Chromium CDP controller. The public page therefore uses **prebuilt static editors** and cannot perform CDP forced-colours emulation. Forced-colours testing, controlled Chromium and capture remain local.

## Requirements

- **Node >=22.19** and **Git** for the kit's scripts and tests.
- **pnpm 11.x** for the live workflow (worktree installs and the Vite+ launcher) and for the kit's Playwright/axe dependencies. Demo mode and the unit tests need only Node and Git.
- **Network access** for the first kit `pnpm install`, the Chromium download, and the BlockNote clone/worktree installation. Allow substantial disk space and time for the two upstream worktrees and their `node_modules`.
- **Chromium** installed through Playwright for the controlled forced-colours window, capture, and the a11y test suite.
- **Google Chrome** for `pnpm mcp:playwright`, which starts Playwright MCP with `--browser chrome`. The MCP and a11y test paths use the committed `_site` bundles and external previews; they do not need the BlockNote worktrees.
- Free ports `8100`, `5173`, `5174` and `8130` by default; `8130` is the a11y test server. The first three are configurable in `compare.config.json`.

For upstream BlockNote, read the Node version in its `.node-version` and the pnpm version in its root `package.json` **at the commit you are testing**. Those values change; do not copy version numbers from this README.

Use a local-only machine or private dev workspace. The viewer server and Vite+ servers bind to `127.0.0.1`. The viewer's developer API is unauthenticated and can launch a local Chromium process; do not expose port `8100` on a LAN or public interface. Ordinary browsers load preview frames from `127.0.0.1` on separate ports without requiring local DNS. The controlled Chromium window instead uses `before.localhost` and `after.localhost` so each iframe gets an isolated CDP target. That feature relies on Chromium and does not run on a static GitHub Pages deployment.

Reports contain screenshots and local absolute paths. Review a report before sharing it.

## What `prepare` creates

`prepare` creates or reuses:

- `.lab/source`: the shallow clone, when you do not pass `--repo`.
- `.lab/worktrees/before` and `.lab/worktrees/after`: the two pinned checkouts.
- `.lab/state.json`: full SHA, patch path, patch SHA-256 and worktree paths.
- `.lab/chromium-profile`: created later if you open the controlled browser.

The source checkout's branch and working tree are not modified. Git metadata is added under the source repository's `.git/worktrees`, and `--update` fetches objects and updates remote-tracking refs.

## Step 1: Preview the lab without cloning BlockNote

From this kit's root:

```sh
node --test tests/*.test.mjs
node bin/diff-lab.mjs demo
```

Open **http://localhost:8100/**. Both panes show a clearly labelled synthetic two-author document: an accessibility review with author-tinted edits, presence indicators, a comment and live notes. The Before fixture deliberately lacks a visible focus indicator and loses focus when the menu closes; the After fixture has a visible focus ring and returns focus to the menu button. That difference exists only so you can exercise the viewer controls. It is **not** a BlockNote fix.

Use **Simulate concurrent editing** in the viewer (or **Simulate collaborators** inside either fixture, for that pane) to run a scripted two-person edit. **Reset demo** reloads both fixtures. This is a local animation, not BlockNote, Yjs or a real multi-user session.

Try the 320px layout preset and the manual reproduction checklist. This does **not** demonstrate the real BlockNote before/after comparison.

Capture also works against these demo servers, but it detects the demo response header and labels the report and viewer output as demo-derived. Do not cite a demo capture as editor evidence.

## Step 2: Prepare the actual BlockNote sources

First edit `compare.config.json` with the title, issue, description and exact steps you intend to reproduce. `comparison.id` is also the localStorage/export key, so changing it starts a fresh set of observations.

If you already have a local BlockNote clone (recommended):

```sh
node bin/diff-lab.mjs prepare --repo /absolute/path/to/BlockNote
```

This pins the repository's **currently checked-out HEAD commit**. Commit or stash local changes first: uncommitted changes in the source checkout are **not** included. To explicitly fetch `origin/<branch>` and pin `FETCH_HEAD` without changing your checked-out branch:

```sh
node bin/diff-lab.mjs prepare --repo /absolute/path/to/BlockNote --update
```

`--update` does not alter your local branch, but it does fetch objects and update remote-tracking refs.

If you don't have a local clone:

```sh
node bin/diff-lab.mjs prepare
```

This clones only the configured branch at depth 1 with a blob filter and no working-tree checkout, then makes two Git worktrees from that one clone. It saves Git history, not necessarily the disk space used by `node_modules`. The clone may still be large because the playground needs a large working tree and many dependencies.

To apply a real patch during preparation, supply its path:

```sh
node bin/diff-lab.mjs prepare \
  --repo /absolute/path/to/BlockNote \
  --update \
  --patch /absolute/path/to/fix.patch
```

`--patch` overrides `comparison.patchFile` in `compare.config.json`; paths are resolved relative to this kit's root. The script checks the patch with `git apply --check`, applies it **only to After**, and writes `.lab/state.json` with the pinned full SHA and patch SHA-256. If no patch is given, the two trees are intentionally identical.

If the patch check fails, both worktrees may have been created but `.lab/state.json` is not written; `prepare` will refuse to continue on the next run. Follow [Resetting or recovering a comparison](#resetting-or-recovering-a-comparison).

You may instead modify files directly in `.lab/worktrees/after` during an experiment. The original checkout and Before are not modified. Capture records the tracked difference from the pinned SHA, so both uncommitted and committed changes in After are recorded; untracked files are listed by `git status` but are not included in the patch.

### Resetting or recovering a comparison

`prepare` deliberately refuses to replace an existing worktree with a different SHA or patch. This protects uncommitted work. To start over, from this kit's root, save any work you need first, then remove the two worktrees and the state file:

```sh
SOURCE=/absolute/path/you/passed/to/--repo   # or this-kit/.lab/source
git -C "$SOURCE" worktree remove "$PWD/.lab/worktrees/before"
git -C "$SOURCE" worktree remove "$PWD/.lab/worktrees/after"
rm -f "$PWD/.lab/state.json"
```

If a worktree contains work you want to keep, save it first (`git -C PATH diff --binary > saved.patch`). `git worktree remove` refuses to delete a dirty worktree; do not use `--force` until you have saved the work. If `.lab/state.json` does not exist (for example after a failed patch check), just remove the worktrees. Remove `.lab/chromium-profile` only after the controlled Chromium window is closed.

Never delete or reset the original source repository.

## Step 3: Install dependencies once per worktree

Pin Node/pnpm to the versions requested by the current BlockNote checkout, then install in the actual worktrees, one at a time:

```sh
node bin/diff-lab.mjs install --side before
node bin/diff-lab.mjs install --side after
```

`--side both` runs the two installs sequentially. The command uses `pnpm install --frozen-lockfile`. `pnpm` shares its global content-addressed store, but each worktree gets its own workspace links and generated outputs. Do **not** symlink one worktree's `node_modules` into the other, since that risks accidentally loading Before code on the After side.

For the initial `@blocknote/example-editor` route, a filtered install is much smaller and was sufficient for the live smoke test:

```sh
cd .lab/worktrees/after
pnpm install --frozen-lockfile --filter . --filter '@blocknote/example-editor...'
```

Run the same command in `.lab/worktrees/before`. The playground's generated example registry can still make Vite warn about unresolved dependencies for other examples; the configured minimal route loads. Use the unfiltered `install` command above if you need other example routes.

A separate installation of the kit's Playwright dependencies is needed for Chromium control and screenshot/axe captures:

```sh
pnpm install
pnpm exec playwright install chromium
```

`pnpm install` in this kit only installs the kit's dependencies; it does not clone or prepare BlockNote. Chromium is a separate download and is required for capture and for the controlled-browser feature.

Run the current upstream Node version for the BlockNote worktrees and the live servers; the kit's own tests run on its declared Node engine. Do not run the complete BlockNote Docker E2E suite on your host: upstream requires it inside Docker to avoid platform-dependent snapshot drift (see `AGENTS.md`).

## Step 4: Run both real editors

```sh
node bin/diff-lab.mjs start
```

Open **http://localhost:8100/**.

The kit starts upstream's Vite+ playground twice, one instance from each worktree, using the `ports.before` and `ports.after` values in `compare.config.json` (default `5173` and `5174`). The initial route is `comparison.path` (default `/basic/minimal?hideMenu`), a small existing upstream example. The launcher does not run `vp run -r build` and does not pre-build other examples; the dev server may still transform examples on demand. This launcher was smoke-tested against upstream `9cb988f` with Node 24.15.0 and pnpm 11.8.0 using the filtered install above. Changing root toolchain requirements may require launcher adjustments. If a port is already in use, the Vite+ server exits rather than choosing another port; change the config and restart.

Each iframe has an independent editor. Perform the step checklist separately in Before and After. Light and dark can be set through the controlled Chromium mode selector; normal operating-system preferences continue to work in an ordinary browser. Changing the viewport width scales the display to fit but preserves the iframe's actual CSS viewport size.

## Step 5: Real forced colours in Chromium

1. Install the kit's Playwright dependencies and Chromium as above.
2. With `node bin/diff-lab.mjs start` still running, open the viewer at **http://localhost:8100/** or **http://127.0.0.1:8100/**. Both loopback spellings are accepted for the browser-control API.
3. Select **Open controlled Chromium**.
4. In that new Chromium window, select **Forced colours: light** or **Forced colours: dark**, then **Apply browser mode**.
5. Verify that the status displays `forced colours on` for **both** preview frames. The status also reports OS dark and reduced motion observed in each frame.
6. If a CDP frame target is not isolated, the operation fails visibly. It never falls back to a CSS filter or global browser override.

The controlled window loads the viewer at `localhost` with `?controlled=1`; its iframes load `before.localhost` and `after.localhost`. Distinct hostnames plus `--site-per-process`/`--isolate-origins` give each frame its own CDP target, and `--host-resolver-rules` maps both names to `127.0.0.1`. The lab applies `Emulation.setEmulatedMedia` to each isolated frame; the viewer itself is unaffected.

The controls affect the controlled Chromium window, not the tab you opened outside it. The built-in `matchMedia` observations are displayed to distinguish an emulated condition from an unsupported request. For final validation, test native Windows contrast themes with real users or assistive technology where possible; CDP emulation is not a substitute.

## Step 6: Capture independent, repeatable evidence

Open a second terminal while both live Vite+ instances are running:

```sh
node bin/diff-lab.mjs capture
```

Capture only measures whatever is listening on the two editor ports. Use it against the live BlockNote worktrees for evidence. Demo captures are labelled and must not be cited as BlockNote evidence.

After installing the kit dependencies, capture generates:

- Before and After screenshots for `light`, `dark`, `forced-light`, `forced-dark` and `reflow-320`.
- A simple editing scenario executed separately on each side, with post-action text and focus metadata.
- axe-core WCAG-tagged scans and an ARIA snapshot for each run.
- A JSON report with requested and observed media preferences (including reduced motion), the pinned source SHA, the patch-file hash, the tracked difference from the pinned SHA, worktree status, demo detection and individual errors.

Every screenshot is taken with `prefers-reduced-motion: reduce` requested, so motion is stable; the report records that preference in `requested`. Results include `after-change.patch` with a SHA-256 when tracked changes exist. The diff is taken against the pinned source SHA, so it includes changes committed inside the After worktree as well as uncommitted tracked changes. Untracked files are listed by `git status` but not captured in that patch, so review them before publication.

Results are saved under `reports/<timestamp>/` with `report.json`, and a current summary at `reports/latest.json`. Reload the viewer to see the evidence summary, source provenance and screenshot links; the report JSON link opens the full record.

If capture cannot complete at all (for example Chromium is not installed or an editor server is down), it rewrites `reports/latest.json` with `failed: true` and the error, and the viewer displays the failure instead of stale evidence. Per-run navigation/interaction failures are recorded in `runs[]` and make the command exit non-zero. A missing axe or ARIA result is recorded in its run but does not by itself fail the command, so inspect the report rather than relying only on the exit status.

The starter's scenario exercises basic text editing only. **Toolbar focus restoration, slash menu, read-only semantics and keyboard-only navigation are still manual steps** until focused Playwright scenarios are developed. Screenshot comparisons alone do not validate rich-text editor behavior.

## How to update the first comparison

1. Change the description, issue link, reproduction steps and `comparison.path` in `compare.config.json`.
2. Keep a saved patch compatible with the pinned base, or set `comparison.patchFile` in the config.
3. Reset the existing snapshot (see [Resetting or recovering a comparison](#resetting-or-recovering-a-comparison)) before pinning a different commit.
4. Pin the new commit with `prepare`; use `--rev SHA` only for an object already available in the source repository. A fresh depth-1 clone usually does not contain arbitrary commits.
5. Follow the same keyboard steps in both editor previews.
6. Repeat under forced light, forced dark and at 320px.
7. Run capture and write a short evidence-backed issue comment.

If a patch was authored against another commit and cannot apply cleanly, fetch that commit deliberately and pin it; do not silently rebase the patch or compare different feature versions. If you commit the patch inside the After worktree, capture still records it because the diff base is the pinned SHA.

## Troubleshooting

- **Port already in use (`EADDRINUSE`)**: change `ports` in `compare.config.json`. The Vite+ launcher uses `--strictPort`, so it fails instead of silently moving.
- **`vp` not found or a dev server exits immediately**: install the worktree dependencies with `node bin/diff-lab.mjs install --side before/after`.
- **Chromium executable missing**: run `pnpm exec playwright install chromium` in the kit.
- **`prepare` refuses with "different snapshot"**: an existing comparison has a different SHA, patch or repository. Follow the reset procedure; do not delete worktrees blindly.
- **Patch will not apply**: verify the base commit with `git apply --check`. Pin the commit the patch was written against rather than rebasing silently.
- **Viewer shows old or unexpected evidence**: check the timestamp, `failed`, `demoFixtures` and `source.sha` in `reports/latest.json`.
- **Controlled browser button reports an origin error**: open the viewer through a loopback host (`localhost` or `127.0.0.1`); other origins are intentionally refused.
- **No editor appears in a pane**: confirm both editor ports respond and the viewer is not in demo mode unless intended.

## Command reference

| Command | Purpose |
| --- | --- |
| `pnpm doctor` | Node, Git, pnpm and `vp` versions; config id; state; worktree presence. |
| `pnpm demo` | Synthetic viewer fixtures; does not download BlockNote. |
| `node bin/diff-lab.mjs prepare [--repo PATH] [--patch FILE] [--update] [--rev SHA]` | Create or reuse the pinned worktrees. `pnpm lab:prepare` is the no-argument package-script alias. |
| `pnpm install:before`, `pnpm install:after` | Install upstream dependencies in one worktree. `install --side both` runs both. |
| `pnpm start` | Start both live playground servers and the viewer. |
| `pnpm capture` | Screenshots, axe, ARIA and the keyboard scenario. |
| `pnpm test` | Unit and catalog contract tests; no BlockNote download needed. |
| `pnpm test:pages` | Builds `_site` and runs the browser test for every issue’s Before/After region, observation persistence/export and Back/Forward navigation. |
| `pnpm check:previews` | Network smoke check of the external Playground routes and main/PR differences; not part of the deploy gate. |
| `pnpm test:a11y:local` | axe on the four #2854 bundles and comparator shell; real-keyboard #2854 focus/activation. No network. |
| `pnpm test:a11y:previews` | axe, Guidepup Virtual Screen Reader, semantic before/after checks and A11yFirst authoring probes against the external previews. |
| `pnpm test:a11y:a11yfirst` | A11yFirst authoring probes: H1→H3 guidance and generic link text. |
| `pnpm test:a11y` | All axe, Guidepup, keyboard, semantic and A11yFirst checks. |
| `pnpm mcp:playwright` | Start the Playwright MCP server over stdio for interactive inspection. |
| `node bin/diff-lab.mjs status` | State metadata plus `git status --short` for both worktrees. |
| `node bin/diff-lab.mjs help` | Command summary. |

## Known limits of the starter

- The Git orchestration, configuration validation and static-file helper are covered by synthetic-fixture unit tests. The demo path and the live minimal route have both been exercised. A live smoke run at upstream `9cb988f` with Node 24.15.0 and pnpm 11.8.0 loaded both `/basic/minimal?hideMenu` editors, started both Vite+ servers through the kit launcher, and produced 10 capture runs with the pinned SHA and a local, uncommitted After-only focus-outline patch. That run reported `aria-input-field-name` on the editor textbox on both sides — a starting observation, not a conformance result. The full workspace install, other example routes and other upstream commits remain unvalidated.
- Demo captures are labelled, but they are still synthetic; never cite them as editor evidence.
- The external PR previews are Vercel deployments outside this repository. `pnpm check:previews` (or the weekly **Preview route smoke check** workflow) detects route or semantic drift, but it is not part of the Pages deploy gate because it depends on network access and the upstream previews staying online.
- **axe and Guidepup are detectors, not conformance verdicts.** Guidepup Virtual Screen Reader is a simulator. Real screen-reader evaluation and testing with disabled people are **out of scope** for this lab, as is reviewing or approving upstream pull requests. The ATAG/A11yFirst map in [`docs/ATAG-2.0-A11YFIRST.md`](docs/ATAG-2.0-A11YFIRST.md) records what is tested, what is partial, and what is not met; the per-gap records are in [`docs/gaps/`](docs/gaps/).
- GitHub Pages serves a static #2854 before/after comparator built from prebuilt BlockNote bundles. It cannot run Vite+ dev servers or CDP forced-colours emulation; those remain local. More variants/pages and build-time automated-check summaries on Pages are future work.
- The upstream playground is a large workspace. Even a shallow Git clone does not make dependency installation small. A more minimal source-bound editor fixture is an appropriate second optimization if this baseline proves too expensive.
- Cross-origin iframe navigation and keyboard input are not mirrored. This is intentional for reliable test evidence.
- The demo's two-author history, presence and simultaneous editing are a local scripted animation. They do not use Yjs, WebSockets or multiple clients, and they are not a BlockNote collaboration implementation. Real BlockNote collaboration would require the upstream collaboration example and a provider.
- The viewer supports side by side only. Onion/difference modes, full accessibility-tree semantic diffs, production Lighthouse audits and comprehensive keyboard automation are future work, specified in the implementation prompt.
- Screenshot comparison does not control all sources of nondeterminism (fonts, timing, random block IDs, animations). The next phase needs a deterministic document fixture and masking policy.
- The viewer's own accessibility has not been independently audited. Step controls now carry step-specific accessible names and the evidence report is no longer an atomic live region, but a full audit is still needed.
- This lab makes no WCAG conformance claims. axe checks only part of accessibility, and Lighthouse scores vary by environment.

## Glossary

- **Pinned SHA**: the full Git commit both sides are built from.
- **Worktree**: a separate checkout that shares one Git object store; Before and After are separate worktrees.
- **Vite+ / `vp`**: BlockNote's dev/build CLI, invoked through pnpm.
- **CDP**: Chrome DevTools Protocol, used here for per-frame media emulation.
- **Forced colours**: an operating-system high-contrast mode. The lab emulates it through CDP, not with CSS filters.
- **Blob filter**: a partial clone that fetches file contents on demand.
- **`FETCH_HEAD`**: the commit recorded by `git fetch`; `--update` pins it.
- **Presence**: the demo's visual list of people and their current state in the document.
- **Yjs**: a CRDT library commonly used for collaborative editing. The demo simulation does not use it.

## Upstream references

- [BlockNote source](https://github.com/TypeCellOS/BlockNote)
- [BlockNote contributor instructions](https://github.com/TypeCellOS/BlockNote/blob/main/AGENTS.md)
- [Accessibility test suite issue #3208](https://github.com/TypeCellOS/BlockNote/issues/3208)
- [BlockNote minimal playground route](https://github.com/TypeCellOS/BlockNote/blob/main/playground/src/examples.gen.tsx)
- [Playwright emulation documentation](https://playwright.dev/docs/emulation)
- [axe-core](https://github.com/dequelabs/axe-core)
- [WCAG 2.2](https://www.w3.org/TR/WCAG22/)
- [Drupal Core Lab media emulation](https://github.com/mgifford/drupal-core-lab/blob/main/tools/compare/emulation.mjs)
- [FOSDEM comparison viewer](https://github.com/mgifford/FOSDEM-website/tree/main/tools/compare)

## Licensing

The standalone lab starter is MIT licensed. BlockNote source is **not bundled** with this starter kit. BlockNote's terms are separate and may change: check its current repository README and licence files. Upstream's README currently describes core packages as MPL-2.0 and `packages/xl-*` as GPL-3.0 or commercial. The kit's own dependencies have their own terms (for example, Playwright is Apache-2.0 and axe-core is MPL-2.0). If copying source from Drupal Core Lab or FOSDEM into this project, inspect its licences and third-party authorship first; the new MIT licence alone does not relicense previously published third-party code.
