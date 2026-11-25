## Summary

<!-- What changed, and why? Keep this to the user-facing or reviewer-facing outcome. -->

## Scope

- [ ] Comparator / static page
- [ ] A11y tests (`tests/a11y/`)
- [ ] Gap register / ATAG docs
- [ ] CI / tooling
- [ ] Other:

## Evidence

Commands run and the result, not only "tests pass":

```sh
pnpm test
pnpm test:pages
pnpm test:a11y:local
# if external previews were exercised:
pnpm test:a11y:previews
pnpm check:previews
```

- Test result:
- Raw evidence path or CI run:
- Screenshots, if visual:

## Review focus

<!-- Where should the reviewer look first? Name the risky or judgment-heavy part. -->

## Checklist

- [ ] The change is on a branch; no direct push to `main`.
- [ ] The diff contains only this change.
- [ ] Tests and docs are updated together.
- [ ] The ATAG/PR boundaries are preserved: no PR approval and no real-AT claim.
- [ ] External preview evidence is labelled as context, not current-product evidence.
- [ ] Generated reports or large artifacts are not committed.
- [ ] A reviewer has enough information to reproduce the result.

## Out of scope

- [ ] Upstream PR review or approval
- [ ] Real screen-reader / disabled-people testing
- [ ] A conformance claim
