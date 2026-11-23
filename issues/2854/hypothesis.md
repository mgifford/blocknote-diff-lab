# #2854 hypothesis and prototype rationale

## Root-cause chain

1. **The side menu hides on any keydown while the editor is focused.**
   [`SideMenu.ts`](https://github.com/TypeCellOS/BlockNote/blob/9cb988ff94b60979bbbc62b0ded5cf62fdac88c8/packages/core/src/extensions/SideMenu/SideMenu.ts) registers a capture-phase `keydown` listener on the editor root and calls `hideMenu()` when `store.state.show` and `editor.isFocused()`. Tab is a keydown like any other.

2. **Closing removes the live menu children.**
   [`SideMenuController.tsx`](https://github.com/TypeCellOS/BlockNote/blob/9cb988ff94b60979bbbc62b0ded5cf62fdac88c8/packages/react/src/components/SideMenu/SideMenuController.tsx) passes `blockId={show ? block?.id : undefined}`. When `show` becomes false, `BlockPopover` receives no children.

3. **The closing popover renders a snapshot.**
   [`GenericPopover.tsx`](https://github.com/TypeCellOS/BlockNote/blob/9cb988ff94b60979bbbc62b0ded5cf62fdac88c8/packages/react/src/components/Popovers/GenericPopover.tsx) stores the last live DOM while the popover is open and, when `status === "close"`, appends that snapshot as clones to a plain wrapper. The snapshot exists only to animate the close.

4. **The cloned buttons are tabbable.**
   The wrapper has no `inert` and no `aria-hidden`; cloned `<button>` elements remain in the browser's sequential focus order. React does not attach handlers or props to the clones. The browser's Tab default runs after the keydown handler, finds the cloned Add block button next in DOM order, and focuses it.

5. **The clone is removed after the transition, taking focus with it.**
   The default closing transition is 250 ms. When the clone unmounts, the focused element disappears and `document.activeElement` becomes `document.body`.

6. **The live Add block button has no button-level activation.**
   [`AddBlockButton.tsx`](https://github.com/TypeCellOS/BlockNote/blob/9cb988ff94b60979bbbc62b0ded5cf62fdac88c8/packages/react/src/components/SideMenu/DefaultButtons/AddBlockButton.tsx) attaches `onClick` to the `AiOutlinePlus` icon. Pointer clicks on the icon work, but keyboard activation fires `click` on the `<button>`, which has no handler. Enter and Space therefore do nothing.

This also affects other popovers that use `GenericPopover`'s snapshot (for example the formatting toolbar's closing copy), though this issue is scoped to the side-menu sequence.

## Candidate fixes

### A. Make closing snapshots inert and move activation to the button (chosen)

- Set `inert` on the `GenericPopover` wrapper for the duration of the closing snapshot.
- Pass `onClick` to `Components.SideMenu.Button` and remove it from the icon.

**Advantages:** small; generic; keeps the live menu's tab order unchanged; prevents any closing popover snapshot from becoming a focus target; restores native button activation for Add block.

**Limits:** does not create a keyboard-only route to the side menu. The core keydown listener still hides the menu on Tab, so a keyboard user without a pointer still cannot reveal it. The full issue needs a separate interaction-design decision.

**Risk:** `inert` also removes the snapshot from the accessibility tree and disables pointer events. That is appropriate for a visual-only closing copy, but the transition must be checked visually. Browser support is modern (Chromium, Firefox, Safari); no polyfill is included.

### B. Set `tabIndex={-1}` on the side-menu buttons

- Tab passes over both the live menu and the cloned copy.
- Host applications provide an alternate keyboard route.

**Advantages:** simple; no dependence on `inert`; matches the Drupal module's workaround.

**Limits:** removes the menu from the Tab sequence entirely; downstream apps must provide the route; does not fix activation. It trades one accessibility gap for another unless a route is guaranteed.

### C. Handle Tab explicitly or do not hide the menu on Tab

- Skip the hide for Tab, or call `preventDefault()` and move focus into the live menu.
- Potentially combine with showing the menu on caret/selection.

**Advantages:** could make the live menu reachable by Tab.

**Limits:** conflicts with Tab indentation; the maintainer has already raised this trade-off. It needs a coherent model for caret, selection, block focus and leaving the editor. No minimal patch can settle it.

## Chosen prototype

The experimental patch implements A:

1. `GenericPopover.tsx` sets `inert` on the wrapper before appending the closing snapshot and removes it on cleanup.
2. `AddBlockButton.tsx` passes `onClick` to the shared `SideMenu.Button`; the icon keeps its `data-test` attribute.

The patch is limited to two files in `packages/react`, uses no new dependency, and does not alter the side menu's visibility model.

## What this proves

- The closing-copy focus trap is caused by the snapshot being focusable, not by Tab being fundamentally impossible to handle.
- The live Add block control is operable via Enter/Space once activation is on the button.
- Focus no longer falls to `document.body` in any tested media mode or at 320px.

## What this does not prove

- That a keyboard-only user can discover the side menu. The menu still requires a pointer in this fixture.
- That `inert` behaves identically in Firefox and Safari.
- That the change is acceptable to upstream maintainers. The issue's keyboard interaction model is still undecided.
- That the screen-reader experience is correct. No human/Guidepup transcript exists.

## Suggested upstream regression test

Add an end-to-end test under `tests/src/end-to-end/sidemenu/`:

1. Render an editor with two paragraphs and focusable buttons before and after the editor.
2. Hover/click the first paragraph so the side menu is live.
3. Verify the Add block button has React props and the editor has focus.
4. Press Tab.
5. Assert the active element is the post-editor button, immediately and after the closing transition.
6. Separately focus the live Add block and assert Enter/Space opens the suggestion menu.
7. Run in the upstream Docker e2e environment. Do not run the suite natively.

The lab scripts in `issues/2854/scripts/` are the runnable version of this sequence for the current two-worktree setup.
