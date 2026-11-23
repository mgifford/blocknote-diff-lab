# Proposed upstream regression test for #2854

Place `sideMenuKeyboardFocus.test.tsx` in `tests/src/end-to-end/sidemenu/` in a BlockNote checkout that includes the experimental patch.

## What it covers

- Tab from the first paragraph with the side menu showing reaches the host `after-editor` button and stays there after the closing transition.
- Enter and Space on the live Add block button open the suggestion menu.

## Important

- Run this in BlockNote's Docker e2e environment, per `AGENTS.md`; do not run the browser suite natively.
- The test depends on the two-file patch in `../patch/2854.patch`.
- It is a proposal, not an executed upstream test. The runnable lab scripts in `../scripts/` are what were used for the evidence in this repository.
- The test does not cover forced colours, reduced motion or screen readers; those are covered by the lab scripts and remain manual/screen-reader work upstream.
