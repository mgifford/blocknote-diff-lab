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
- three #2854 variants (both fixes, inert-only, activation-only) and one page (the minimal-editor fixture), with selectors;
- editor theme Light/Dark/Follow OS (reloads both frames), half/phone/tablet widths and synced scrolling;
- URL hash state (`issue`, `variant`, `page`, optional `theme`);
- prefilled validation checklists with local progress; each issue states what to do and what should change;
- every issue has a Before/After region: local built editors for #2854, side-by-side current-main vs PR Playground previews for #2822/#2825/#2826, and an explicit “no fix yet” After panel for unfixed issues;
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
| Same-origin scroll/theme sync | Yes | No | #2854 only; PR previews are cross-origin |
| Variant selector | 6 variants | No | 3 #2854 variants |
| Page selector | 10 pages | No | 1 page |
| Theme controls | Site theme + dark-OS CSS simulation | No | Editor Light/Dark/Follow OS |
| Frame widths | Half/phone/tablet | No | Half/phone/tablet |
| URL state | variant/page/os | No | variant/page/theme |
| Issue cards | 6 | No | 9 |
| Build-time automated checks | Yes | No | Observed table + evidence JSON; no build-time check table |
| Diff/patch section | Built-site diff | No | Source patch for #2854; PR files/patch for PR issues |
| Focus controls/readout | Test each frame separately | No | Yes, with real host targets and same-origin inspection |
| Forced-colours emulation | No (static) | No | No (local lab only) |
| Works without Vite+/CDP | Yes | Yes | Yes |

## Remaining differences

1. **Local bundles only for #2854.** #2822, #2825 and #2826 use external current-main and PR Playground previews, so they are side by side but cross-origin; focus readout and keyboard mirroring are unavailable. The previews are deep-linked to the example that contains the affected block, not the Playground index. Unfixed issues show current behavior against an explicit no-fix After panel rather than a fabricated patch. Bundling the PR heads locally would mean building their heads and resolving their divergent bases.
2. **No build-time automated-check table.** FOSDEM generates checks into `results.json`; our page links the lab evidence and shows an observed table. Browser tests now enforce the presence of each issue’s comparison region, but they do not re-run the issue-specific keyboard checks.
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
pnpm test        # catalog contract tests plus the existing unit tests
pnpm test:pages  # builds _site, serves it, and checks every issue's Before/After region in Chromium
```

`tests/pages-contract.test.mjs` enforces the data contract (nine issues, steps/checks, PR before/after/patch URLs and a real Playground example route for every external frame). `tests/pages.e2e.mjs` checks that every issue shows exactly one comparison region, that #2854 has visible local frames and a patch, that PR issues have visible current/PR frames and a patch, that external frames are not pointed at the Playground index, that unfixed issues show an explicit no-fix After panel, and that hash and issue-card navigation work. The Pages deployment depends on both test commands; `.github/workflows/pages-tests.yml` also runs them on pull requests.

## Preview route regression

The first build linked external frames to the Playground root. That route renders the example chooser, so both frames were blank; the browser test only measured iframe height and still passed. Preview URLs must name a Playground example that contains the affected block (`/basic/default-blocks`, `/ui-components/advanced-tables`, `/basic/read-only-editor`). The contract test now rejects a `/` pathname and the e2e checks that the rendered frames are not pointed at the index.

## Accessibility caveats

The outer comparator page was scanned with axe-core 4.13.0 under WCAG 2.0/2.1/2.2 A/AA rules with no violations, and the phone layout was checked at 390px. BlockNote's editor textbox still exposes the separate `aria-input-field-name` finding on both sides. This is not a conformance claim and does not replace testing the frames with a keyboard and assistive technology; Tab and Enter are deliberately not mirrored between frames.
