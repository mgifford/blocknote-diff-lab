# Direct-main baseline review — 2026-11-24 accessibility work

This is a one-time oversight record for work that landed **directly on `main`**
before the branch + PR protocol existed. It is not an approval of the changes;
it is an index so the human owner can review them after the fact.

- **Range:** `ff06dd8..f866040`
- **Compare:** <https://github.com/mgifford/blocknote-diff-lab/compare/ff06dd8...f866040>
- **Live build at the end of the range:** `f8660403d1de7eb3b592524ad50d90c5d1cb7177`
- **Review protocol that applies from now on:** [`docs/REVIEW-PROTOCOL.md`](../REVIEW-PROTOCOL.md)

## Commits

| Commit | Subject | Review focus |
| --- | --- | --- |
| [`37f9c47`](https://github.com/mgifford/blocknote-diff-lab/commit/37f9c47) | Deep-link external previews and fix no-fix comparison frames | The core fix for blank iframes; preview URL contract |
| [`6788a27`](https://github.com/mgifford/blocknote-diff-lab/commit/6788a27) | Add observation export and reproduction-only labels | New export JSON, localStorage, labels |
| [`b55ef05`](https://github.com/mgifford/blocknote-diff-lab/commit/b55ef05) | Clarify reproduction-only and docs labels | Copy only |
| [`e243e27`](https://github.com/mgifford/blocknote-diff-lab/commit/e243e27) | Add preview drift check and issue history navigation | `scripts/check-previews.mjs`, push/pop history, dead `page` removal |
| [`73715fb`](https://github.com/mgifford/blocknote-diff-lab/commit/73715fb) | Add axe, Guidepup, and ATAG/A11yFirst accessibility tests | New `tests/a11y/`, MCP config, CI steps |
| [`ed36e08`](https://github.com/mgifford/blocknote-diff-lab/commit/ed36e08) | Add A11yFirst and ATAG Part B gap register | 19 gap records, index, contract test |
| [`1089c3d`](https://github.com/mgifford/blocknote-diff-lab/commit/1089c3d) | Close A11yFirst heading and link evidence gaps | Heading/link probes, status changes |
| [`fea0c0b`](https://github.com/mgifford/blocknote-diff-lab/commit/fea0c0b) | Document ATAG alignment issues and correct Part A levels | Alignment register, A.3.4.1 level correction |
| [`f866040`](https://github.com/mgifford/blocknote-diff-lab/commit/f866040) | Fix same-document history test | Test-only fix for a CI timeout |

## What was verified

- `pnpm test`: **22/22** unit and contract tests.
- `pnpm test:pages`: all nine issues, observations/export, hash/card/Back.
- `pnpm test:a11y:local`: 4 local tests (axe and #2854 keyboard).
- `pnpm test:a11y:previews`: 11 preview tests, including axe, Guidepup and the
  A11yFirst probes.
- CI green at the final commit: Pages tests and deploy.
- Live Pages build served `f866040`.

## What was not done

- No human code review before merge.
- No real screen-reader or disabled-people testing (out of scope).
- No upstream PR review or approval (out of scope).
- No ATAG conformance claim; see
  [`docs/ATAG-ALIGNMENT-ISSUES.md`](../ATAG-ALIGNMENT-ISSUES.md).

## Review suggestions

1. Read the compare link, not only this table.
2. Check the two new test suites for over-broad assertions:
   `tests/a11y/a11yfirst.spec.mjs` currently encodes the **absence** of heading
   and link guidance and will fail when upstream adds guidance; that is intended
   as a signal to update the gap record, but review whether you want that
   failure in CI.
3. Check that the ATAG alignment and gap records do not overstate what the tests
   prove. The boundaries are documented, but the wording is the main risk.
4. Confirm that `mcp/playwright-mcp/` and `.mcp.json` are appropriate to keep in
   the repository; the DSH bundle is a local profile install, not part of the
   Pages build.

## Follow-up PRs

The next changes should be separate PRs:

1. `test/atag-b02-transformations` — copy/paste and export preservation tests for
   B-02.
2. `test/atag-part-a-coverage` — the not-assessed Part A checkpoints that can be
   tested without real AT.
3. `docs/atag-b01-auto-generation` — inventory the automatic generation paths
   before assigning B-01 a status.
4. A process PR to merge the branch protection/ruleset once this review protocol
   is merged.

No further work should be pushed directly to `main`.
