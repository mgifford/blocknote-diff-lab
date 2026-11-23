# Accessibility investigations

- **Inventory:** [`reports/ISSUE-INVENTORY.md`](../reports/ISSUE-INVENTORY.md) and [`reports/issue-inventory.json`](../reports/issue-inventory.json)
- **First verified issue:** [`2854`](2854/ISSUE.md)

## Status vocabulary

Each issue records its state explicitly: not investigated, unable to reproduce, confirmed defect, fix proposed, experimental patch implemented, automated tests passed, human confirmation pending, ready for upstream review, or already fixed upstream.

## Layout

```
issues/
  <number>/
    ISSUE.md          problem, users, status, WCAG relevance, upstream context
    reproduction.md   exact steps, environment, observed results
    fixture.json      starting document and host-page fixture
    scenario.json     machine-readable steps, selectors and assertions
    hypothesis.md     root cause, alternatives, chosen prototype
    RESULTS.md        before/after evidence, tests, limitations, recommendation
    patch/            experimental upstream patch (not an upstream PR)
    scripts/          runnable Playwright reproduction scripts
    evidence/
      before/
      after/
```

## Current findings

- **#2854** is a confirmed upstream defect. The closing side-menu snapshot is focusable, so Tab lands on a dead Add block clone and focus falls to `body`; the live Add block also lacks button-level activation. The experimental patch makes closing snapshots inert and moves activation to the button. It fixes focus loss and activation but not keyboard-only discoverability; maintainer input is still needed for the full route.
- **#2822** and **#2825/#2826** have open upstream PRs. Validate those PRs rather than duplicating the work.
- **#2829** is downstream documentation. **#2809** is a shared rendering issue observed through Docs reading mode.
- The seven closed issues listed in the inventory are regression candidates, not items to re-fix.

No upstream PR has been opened and no BlockNote repository has been pushed to.
