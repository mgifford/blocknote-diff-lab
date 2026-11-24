# Static comparator: FOSDEM model vs BlockNote #2854

Reference: <https://mgifford.github.io/FOSDEM-website/compare/#variant=contrast-links&page=>
Current BlockNote page: <https://mgifford.github.io/blocknote-diff-lab/>

## What the FOSDEM page does

The FOSDEM page is a static comparator, not a report. It publishes built before/after copies of the site and puts them in two same-origin iframes. Its controls and data include:

- six variants, ten pages, and a variant/page selector;
- built-site diff text and build-time automated checks per variant;
- site theme buttons and a CSS-only dark-OS simulation;
- half/phone/tablet frame widths and synchronized scrolling;
- URL hash state for variant, page and OS simulation;
- change cards with descriptions, file counts and pull-request links;
- a keyboard note: Tab and Enter are not mirrored, so test each frame.

This works on GitHub Pages because both sides are prebuilt static sites under `before/` and `after/`.

## Earlier BlockNote page

The first deployment was a static **evidence report**: screenshots, a results table, the patch and limitations. It had no editor iframes, controls, URL state or built-site diff. That was the gap: the lab's live viewer was still a local Vite+/CDP server, so only its report was published.

## Current BlockNote page

The page now follows the FOSDEM architecture and adds an issue catalog:

- a catalog of **nine reported issues**, each with prefilled validation steps, expected results, fix status and upstream links;
- for #2854, two prebuilt BlockNote editors in same-origin iframes (`pages/before`, `pages/after`);
- three #2854 variants (both fixes, inert-only, activation-only), with selectors; there is no page selector because the lab bundles one fixture;
- editor theme Light/Dark/Follow OS (reloads both frames), half/phone/tablet widths and synced scrolling;
- URL hash state (`issue`, `variant`, optional `theme`); legacy `page=` links still load and are normalised away;
- browser Back/Forward traverses issue selections; variant and theme changes replace the current history entry instead of adding one;
- prefilled validation checklists with local progress, a per-check **Observed** field and per-issue observer notes; **Download observations (JSON)** exports every issue with recorded data and stamps the file with the build SHA;
- every issue has a Before/After region: local built editors for #2854, side-by-side current-main vs PR Playground previews for #2822/#2825/#2826, and an explicit no-patch After panel for issues with no bundled or upstream patch; four of those are labelled **Reproduction only**, and #2829 is labelled **Docs** because its fix is a downstream documentation change;
- external frames deep-link to a Playground example that contains the affected block: `basic/default-blocks` (image, file, table, video, audio, lists) and `ui-components/advanced-tables` (header cells and merge controls), plus `basic/read-only-editor` for #2809. The Playground root is an example chooser with no editor body, so linking to it produces two blank frames;
- real **Focus before/after editor** controls around the #2854 iframes and a same-origin focus readout that can name the dead closing copy;
- a visible patch section: local source patch for #2854, upstream PR files/patch link and file counts for PR issues;
- problem, prefilled validation checklist, observed results, evidence links, patch diff and provenance.

### Feature comparison

| Capability | FOSDEM model | Earlier BlockNote page | Current BlockNote page |
| --- | --- | --- | --- |
| Static before/after iframes | Yes, built sites | No | Yes: local #2854 + PR Playgrounds |
| Issue catalog | Six changes | No | Nine reported issues |
| Prefilled validation steps | Per variant | No | Per issue, with checkboxes |
| Per-check observations + export | No | Notes + JSON export | Observed field per check, issue notes, build-stamped JSON export |
| Same-origin scroll/theme sync | Yes | No | #2854 only; PR previews are cross-origin |
| Variant selector | 6 variants | No | 3 #2854 variants |
| Page selector | 10 pages | No | None (single fixture) |
| Theme controls | Site theme + dark-OS CSS simulation | No | Editor Light/Dark/Follow OS |
| Frame widths | Half/phone/tablet | No | Half/phone/tablet |
| URL state | variant/page/os | No | issue/variant/theme |
| Issue cards | 6 | No | 9 |
| Build-time automated checks | Yes | No | Observed table + evidence JSON; no build-time check table |
| Diff/patch section | Built-site diff | No | Source patch for #2854; PR files/patch for PR issues |
| Focus controls/readout | Test each frame separately | No | Yes, with real host targets and same-origin inspection |
| Forced-colours emulation | No (static) | No | No (local lab only) |
| Works without Vite+/CDP | Yes | Yes | Yes |

## Remaining differences

1. **Local bundles only for #2854.** #2822, #2825 and #2826 use external current-main and PR Playground previews, so they are side by side but cross-origin; focus readout and keyboard mirroring are unavailable. The previews are deep-linked to the example that contains the affected block, not the Playground index. Issues without a bundled or upstream patch show current behavior against an explicit no-patch After panel rather than a fabricated patch; four are labelled **Reproduction only**, and #2829 is labelled **Docs**. Bundling the PR heads locally would mean building their heads and resolving their divergent bases.
2. **No build-time automated-check table.** FOSDEM generates checks into `results.json`; our page links the lab evidence and shows an observed table. Manual observations are now exportable, but browser tests do not re-run the issue-specific keyboard checks.
3. **No dark-OS CSS simulation.** The theme buttons force the Mantine theme; they are not the same as FOSDEM's rewrite of the `prefers-color-scheme` media query. Follow OS uses the actual OS preference.
4. **No forced-colours or CDP media emulation.** Pages cannot run the controlled Chromium layer. Use the local lab for forced-colours light/dark, reduced motion and capture.
5. **No built-site HTML/CSS/JS diff.** #2854 shows its source patch; PR issues link to the upstream files/patch. Generated asset names differ between bundles, as expected.
6. **Prebuilt artifacts.** The #2854 bundles are committed under `pages/before`, `pages/after`, `pages/after-inert` and `pages/after-activation`. The Pages workflow assembles the static site but does not rebuild BlockNote.

## Rebuilding the bundles

The static app source is in `pages/app`. It expects a prepared BlockNote worktree with dependencies installed and, for After, the #2854 patch applied:

```sh
scripts/build-static-bundles.sh .lab/worktrees/before .lab/worktrees/after
pnpm pages:build
```

The first command builds `pages/before`, `pages/after` (both fixes), `pages/after-inert` and `pages/after-activation` from a clean After worktree, then restores it. The second assembles `_site` from the bundles, evidence, patches, the issue catalog (`pages/issues.json`) and template. The Pages workflow runs only the second step.

## Tests

```sh
pnpm test               # catalog contract tests plus the existing unit tests
pnpm test:pages         # builds _site, serves it, and checks every issue's Before/After region in Chromium
pnpm test:a11y:local    # axe + real-keyboard #2854 checks; no network
pnpm test:a11y:previews # axe + Guidepup Virtual Screen Reader + semantic checks on the previews
pnpm test:a11y          # all of the above
pnpm check:previews     # network check of the external Playground routes (not part of the deploy gate)
```

`tests/pages-contract.test.mjs` enforces the data contract (nine issues, steps/checks, PR before/after/patch URLs and a real Playground example route for every external frame, plus the observation-export, build-provenance and no-dead-page-control markup). `tests/pages.e2e.mjs` checks that every issue shows exactly one comparison region, that #2854 has visible local frames and a patch, that PR issues have visible current/PR frames and a patch, that external frames are not pointed at the Playground index, that unfixed issues show an explicit no-patch panel and a **Reproduction only** card, that observations persist across a reload and export with the build SHA, that reset clears them, that the legacy `page=` parameter is normalised away, that Back/Forward traverses issue selections, and that hash and issue-card navigation work. The Pages deployment depends on both test commands; `.github/workflows/pages-tests.yml` also runs them on pull requests.

`tests/a11y/` adds the ATAG/A11yFirst evidence layer: axe scans of the editor UI and comparator shell, Guidepup Virtual Screen Reader announcements for #2822 and #2809, real-keyboard #2854 focus/activation traces, and DOM semantic before/after checks for image alt text and table headers. The mapping is in [`ATAG-2.0-A11YFIRST.md`](ATAG-2.0-A11YFIRST.md), and the per-gap records are in [`docs/gaps/`](gaps/). These are detector and simulator results, not conformance claims.

## Preview route regression

The first build linked external frames to the Playground root. That route renders the example chooser, so both frames were blank; the browser test only measured iframe height and still passed. Preview URLs must name a Playground example that contains the affected block (`/basic/default-blocks`, `/ui-components/advanced-tables`, `/basic/read-only-editor`). The contract test now rejects a `/` pathname and the e2e checks that the rendered frames are not pointed at the index.

The external deployments can still drift independently of this repository. `scripts/check-previews.mjs` loads every external frame, waits for `.bn-editor`, and verifies the expected main/PR state: image alt fallback for #2822, `th[scope]`/`td[headers]` for #2825/#2826, read-only list output for #2809, and table/video presence for #2853/#2829. It is intentionally **not** part of the deploy gate because it depends on Vercel. Run it with `pnpm check:previews` or from the **Preview route smoke check** workflow (manual or weekly).

## Accessibility caveats

The outer comparator page was scanned with axe-core 4.13.0 under WCAG 2.0/2.1/2.2 A/AA rules with no violations, and the phone layout was checked at 390px. BlockNote's editor textbox still exposes the separate `aria-input-field-name` finding on both sides. This is not a conformance claim and does not replace testing the frames with a keyboard and assistive technology; Tab and Enter are deliberately not mirrored between frames. Guidepup Virtual Screen Reader is a simulator; real screen-reader evaluation is out of scope for this lab.
