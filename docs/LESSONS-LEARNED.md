# Lessons learned

What this lab taught us about testing an editor for ATAG/WCAG accessibility, and
what we would do differently next time. Last updated 2026-11-25.

## Claims and scope

- **A clean scanner is not an accessible editor.** axe found no WCAG A/AA
  violations in the comparator shell while the editor textbox still had no
  accessible name. Layer axe with DOM semantics, a virtual screen reader,
  keyboard traces and source inspection.
- **Part A and Part B are different questions.** Part A is the authoring UI;
  Part B is whether authors can produce accessible content. Conflating them
  produces both false passes and false gaps.
- **A component is not a host product.** A BlockNote result does not transfer to
  a Docs/CMS integration, and vice versa. Name the tested surface in every row.
- **No conformance claim.** The lab records evidence and gaps; it does not
  certify ATAG or WCAG, review upstream PRs, or replace testing with disabled
  people.

## Verification

- **Test rendered content.** The first comparator test only checked iframe
  height. Blank editors passed. Deep links plus route/content assertions found
  the real failures.
- **Isolate history tests.** A Back-navigation assertion shared the page's
  accumulated `pushState` history from earlier issue tests and flaked in CI.
  Running it in a fresh page fixed it. Same-document navigation does not fire a
  load event; wait for the hash before the rendered title.
- **Headless clipboard is not the OS clipboard.** Headless Chromium exposed only
  `text/plain`; a headed run exposed `text/html` with image alt and list
  structure. Capture the `copy` event for CI, and keep a headed manual probe for
  the OS path.
- **Assert the gap you measured.** Tests that assert absence of list wrappers or
  `scope` will fail when upstream fixes them. That is useful: the failure is the
  signal to update the gap record, not a reason to weaken the test.
- **Do not trust menu order or timing.** Prefer semantic assertions over exact
  option order, and give CI waits enough headroom without hiding a real failure.

## Evidence

- **Track commands, commits, dates and results.** Raw `reports/a11y/` output is
  gitignored. CI now uploads it as a 30-day artifact on pass or fail.
- **Inspect the model before designing a fixture.** The default schema has no
  content `lang` property and table content has `headerRows`/`headerCols` but no
  `scope`/`headers`. A language-tagged preservation test cannot exist until the
  model does. Record that as a model gap, not a missing test.
- **Read the definitions.** ATAG's template and pre-authored-content definitions
  turned an apparent B.2.4/B.2.5 gap into N/A for the tested surfaces. Validate
  the standard's terms before assigning a status.
- **Documentation is evidence too.** A Link Toolbar screenshot with `alt="image"`
  models the wrong pattern. Docs audits belong in the gap register.

## Process

- **Protect the default branch before the first commit.** The accessibility work
  landed directly on `main` before branch protection existed, requiring a
  post-hoc baseline review. The ruleset now requires a PR, the
  `page-comparison-tests` check, an up-to-date branch and no force pushes.
- **Keep PRs small and single-purpose.** A docs-only PR was once blocked by a
  flaky test; the fix belonged in its own PR, then the docs branch was rebased.
- **Stack when necessary and say so.** When a branch depends on an unmerged
  check fix, stack it and name the merge order in the PR body.
- **Respect the up-to-date rule.** After one stacked PR merges, rebase the next
  one; otherwise the required check is stale or the branch is behind.
- **Leave raw artifacts untracked.** Screenshots and probe output are not source.
  Do not commit them just because they are useful locally.

## What we would do differently

1. Configure branch protection and the required check before the first change.
2. Inspect the content model before promising preservation tests; build the
   fixture only if the property is representable.
3. Isolate navigation-history tests from the start.
4. Add CI evidence upload with the first a11y test, not after the evidence
   retention issue.
5. Record N/A only after checking the standard's definitions and the product's
   feature set.
6. Separate "not tested", "not representable" and "product gap" in the register;
   they have different owners and different next actions.

## Limits

- The lab exercises Chromium 148 with the Mantine UI, not Firefox, Safari,
  Windows, mobile, Ariakit or shadcn.
- Real screen readers and disabled participants were not tested; the Guidepup
  Virtual Screen Reader is a proxy.
- No ATAG/WCAG conformance claim is made.
- The remaining product gaps (content language, table relationships, list
  semantics, media alternatives, search) need upstream work.

## Related

- [Review protocol](REVIEW-PROTOCOL.md)
- [Support matrix](SUPPORT-MATRIX.md)
- [Evidence retention](EVIDENCE.md)
- [ATAG alignment issues](ATAG-ALIGNMENT-ISSUES.md)
- [Gap register](gaps/README.md)
