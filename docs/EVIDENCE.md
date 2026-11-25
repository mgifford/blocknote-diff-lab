# Evidence retention

The lab separates **reproducible commands and tracked summaries** from **raw
evidence**. Raw evidence is not committed.

## Where raw evidence goes

- Local runs: `reports/a11y/<timestamp>/` (ignored by git).
- Playwright: `test-results/` (ignored by git).
- CI runs: uploaded as the `a11y-evidence-<run-id>` artifact for **30 days**,
  including failed runs.

The CI artifact contains the same `reports/a11y/` and `test-results/` trees that
a local run produces. It is a retention window, not an append-only archive.

## What is tracked

Gap records and alignment notes cite:

- the command that produced the evidence;
- the commit and date;
- the observed result;
- the test file, not a local absolute path.

They do **not** claim that a raw JSON file will remain available. If a claim
needs a permanent artifact, attach a small summary to the record or reproduce
the command.

## How to reproduce

```sh
pnpm install
pnpm exec playwright install chromium
pnpm test:a11y:local
pnpm test:a11y:previews
pnpm test:a11y:part-a
pnpm test:a11y:transformations
pnpm test:a11y:export
pnpm test:a11y:copy-paste
```

The preview commands need network access to the upstream Vercel previews; set
`SKIP_NETWORK=1` to skip them.

## Limits

- A local `reports/a11y/` directory can be overwritten by a later run.
- CI artifacts expire after 30 days and are tied to a workflow run.
- The lab does not commit large screenshots, traces, or raw logs.
- This retention policy is a lab-process choice, not an ATAG conformance claim.

## Related

- [Support matrix](SUPPORT-MATRIX.md)
- [ALIGN-14](ATAG-ALIGNMENT-ISSUES.md#align-14-raw-evidence-is-local-and-ignored)
- [Gap register](gaps/README.md)
