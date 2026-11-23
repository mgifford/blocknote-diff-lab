# #2854 experimental patch

This is an **experimental** patch, not an upstream submission.

- Base: `TypeCellOS/BlockNote@9cb988ff94b60979bbbc62b0ded5cf62fdac88c8` (0.57.0).
- Scope: two files in `packages/react`.
- License: upstream BlockNote source remains MPL-2.0. This patch does not relicense it.
- `git apply --check` against the pristine Before worktree at the same SHA succeeds.
- Lab tests passed in Chromium 148 across light, dark, forced-light, forced-dark, reduced motion and 320×800.

## Changes

1. `packages/react/src/components/Popovers/GenericPopover.tsx`
   - Marks the closing snapshot wrapper `inert` before appending the clones, and removes the attribute on cleanup. The snapshot is a visual-only transition and must not become a tab stop.

2. `packages/react/src/components/SideMenu/DefaultButtons/AddBlockButton.tsx`
   - Moves `onClick` from the `AiOutlinePlus` icon to the shared side-menu button, so Enter and Space activate it.

## Apply

From a clean checkout at the pinned SHA:

```sh
git apply --check /path/to/issues/2854/patch/2854.patch
git apply /path/to/issues/2854/patch/2854.patch
```

## Limits

- This patch does not make the side menu discoverable by keyboard alone. The menu still requires a pointer to appear.
- The full interaction model needs maintainer input.
- Only Mantine and Chromium were exercised.
- No upstream PR was opened.
