# #2854 — Side menu “Add block” (+) not usable with keyboard

- **Issue:** https://github.com/TypeCellOS/BlockNote/issues/2854
- **State:** OPEN as of 2026-11-23
- **Priority:** P1
- **Classification:** verified upstream defect
- **Reproduction confidence:** verified in this checkout
- **Related:** #3208 (a11y roadmap), #2829 (table keyboard docs, depends on this)
- **Upstream source:** `9cb988ff94b60979bbbc62b0ded5cf62fdac88c8` (`@blocknote/*` 0.57.0)

## Problem

The side menu beside a block contains the **Add block** (+) and **Open block menu** (six-dot) controls. With the default editor, a keyboard user can encounter a broken focus path:

1. Hover a paragraph so the side menu appears.
2. Click in the paragraph to place the caret. Leave the pointer over the block.
3. Press Tab.
4. Focus lands on a **cloned, non-interactive copy** of the Add block button. Pressing Enter or Space does nothing.
5. About 250 ms later, the copy is removed and focus falls to `document.body`. The next Tab starts from the page, not from the intended next control.

Separately, even when the **live** Add block button is reached by pointer or by a keyboard route with the menu still visible, Enter and Space do nothing because the click handler is attached to the icon, not the button.

## Affected users

- Keyboard-only users who Tab out of the editor.
- Screen-reader users who need a predictable next focus target and an operable Add block control.
- Switch and voice-control users who activate controls by accessible name rather than pointer coordinates.
- Users who hover/click with a pointer and then continue with the keyboard — the failure also occurs after a pointer selection.

## What is expected

- Tab from the editor while the side menu is showing should not focus a non-interactive closing copy.
- Focus should move to the next real control, or deliberately into a live side-menu control if that is the chosen interaction model.
- The live Add block button should open the suggestion menu on Enter and Space.
- Focus must not fall to `document.body` when a transition ends.

## WCAG 2.2 relevance

- **2.1.1 Keyboard** — the controls are not operable from the keyboard.
- **2.4.3 Focus Order** — focus moves to a disappearing copy and then to the document body.
- **2.4.7 Focus Visible** — the focused copy is a fading, non-functional element.
- **4.1.2 Name, Role, Value** — the live button has a name but its activation does not match its role.

These are indicators for investigation, not a conformance determination.

## Current upstream activity

- Maintainer discussion on 2026-06-17 considered Tab/indentation trade-offs and suggested alternatives such as Shift+F10 or an `Escape`-entered block-highlight mode.
- On 2026-10-30, a detailed reproduction identified the closing-popover clone as the narrower cause. It also documented the icon-level `onClick` and suggested three possible fixes.
- No upstream fix PR was open at the time of this inventory. PR #3337 and #3215 address unrelated image/table issues.

## Source components

- `packages/core/src/extensions/SideMenu/SideMenu.ts` — hides the menu on any keydown while the editor is focused.
- `packages/react/src/components/SideMenu/SideMenuController.tsx` — passes no block id while closing, so the popover renders no children.
- `packages/react/src/components/Popovers/BlockPopover.tsx` / `GenericPopover.tsx` — clone the last rendered DOM for the closing transition; the copy is not inert.
- `packages/react/src/components/SideMenu/DefaultButtons/AddBlockButton.tsx` — `onClick` is on `AiOutlinePlus`, not on `Components.SideMenu.Button`.
- `packages/{mantine,ariakit,shadcn}/src/sideMenu/SideMenuButton.tsx` — forward `onClick` and the accessible name to the real button.

## Evidence

- `evidence/before/focus.json` — 3/3 runs: Tab → cloned Add block → body.
- `evidence/before/modes.json` — light, dark, forced-light, forced-dark and reduced motion all show the same failure.
- `evidence/before/activation.json` — Enter and Space on the live Add block open no menu.
- `evidence/before/keyboard-route.json` — after a pointer reveal and two Shift+Tabs, the live Add block is focused but Enter does nothing.
- `evidence/before/reflow-320.json` — the same focus loss occurs at 320×800.
- `evidence/after/` — equivalent evidence after the experimental patch.
- `issues/2854/reproduction.md` — exact steps and commands.

## Downstream notes

The Drupal BlockNote module works around this by setting `tabindex="-1"` on its custom side-menu buttons and providing alternate routes (slash menu / block menu). That is a downstream mitigation, not a fix for the default UI.

## Status

- Confirmed defect.
- Experimental patch implemented in the After worktree only.
- Lab keyboard tests pass.
- Human screen-reader confirmation pending.
- Not ready for upstream submission: the maintainers still need to decide on the full keyboard route; the patch deliberately does not force every side-menu control into the global Tab sequence.
