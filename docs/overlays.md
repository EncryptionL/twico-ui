# Overlays — the shared modal pattern

`Dialog`, `Drawer`, `CommandPalette`, and `Sidebar` (in its off-canvas `overlay`
mode) are **modal overlays**: they portal to `document.body`, animate in *and* out,
lock body scroll, trap focus, and close on `Escape` / backdrop. This doc records the
pattern and the two hooks these components share.

## The pattern

All three follow the overlay conventions from [CLAUDE.md §5](../CLAUDE.md):

- **Portal to `document.body`** so the overlay escapes any ancestor with
  `transform` / `filter` / `backdrop-filter` (which would otherwise become the
  containing block for `position: fixed` — the docs-site navbar's `backdrop-filter`
  bit us here). Rendered client-only, so there is no hydration mismatch.
- **Mount only while open**, then stay mounted through a `var(--duration-exit)`
  exit animation driven by a `data-state="open" | "closed"` attribute, and unmount
  on a 170 ms timeout kept in lockstep with that token. `prefers-reduced-motion`
  collapses the animations to ~1 ms.
- **Lock body scroll** while open (restore the previous `overflow` on close).
- **Focus management:** move focus inside on open, cycle `Tab`/`Shift+Tab` within
  the panel, and restore focus to the trigger on close.
- **Dismissal:** `Escape` closes; a backdrop `onMouseDown` with an
  `e.target === e.currentTarget` guard closes (unless `closeOnBackdrop={false}`).

## The two extracted hooks (#177)

The focus-trap and portal logic was hand-rolled — and drifting — in all three
components. It now lives in **`components/_overlay.js`** and is exported publicly as
`useFocusTrap` / `usePortal`. `Sidebar`'s off-canvas mode (#138) reuses the same two
hooks rather than re-deriving the pattern.

### `useFocusTrap(ref, active = true, { restoreFocus = true } = {})`

- On **activate** (`active` becomes `true`): saves `document.activeElement`, then
  focuses the first focusable inside `ref.current` (or the container itself).
- While active: a document `keydown` listener cycles `Tab` / `Shift+Tab` within the
  region's *visible* focusables (`offsetParent !== null`).
- On **deactivate**: restores focus to the saved element unless `restoreFocus:false`.
- It does **not** own `Escape` — closing is component-specific, so each overlay keeps
  its own tiny Escape handler.

> **Gotcha — this is a passive effect, not a layout effect.** React restores focus to
> the *pre-commit* active element during the commit's layout phase. A focus-restore
> done in `useLayoutEffect` therefore gets clobbered (React re-focuses the old element
> *after* our restore). Running the restore in a passive `useEffect` — which fires
> after React's own restoration — makes it win. (Verified by `tests/useFocusTrap.test.jsx`.)

### `usePortal()`

Returns a stable `render(node)` callback that portals `node` to `document.body`, or
`null` on the server (no `document`). Centralizes the `createPortal` derivation the
three overlays each repeated.

### `useScrollLock(locked)` and `useInertBackground(ref, active)`

Added to `_overlay.js` in the a11y pass (#115/#116). `useScrollLock` is the one
**refcounted** body scroll-lock — nested/out-of-order overlay opens don't clobber each
other's saved `overflow`, and it compensates for the scrollbar gutter on the 0→1
transition so the page doesn't shift. It's re-exported publicly as `useScrollLock`
(moved out of `hooks/index.js`; the public API and its `.d.ts` are unchanged).
`useInertBackground(ref, active)` marks every sibling of the overlay's portal subtree
`inert` + `aria-hidden` while active, so a screen-reader virtual cursor / mobile swipe
can't reach the page behind a `Dialog`/`Drawer`. `Popover` also now reuses `useFocusTrap`
(with `restoreFocus:false`, since it owns a conditional restore) and is `aria-modal`.

## Why `components/_overlay.js` and not `hooks/index.js`

CLAUDE.md §5 says components import only `react` / `react-dom`, the shared internal
helpers (`_styles.js`, `_warn.js`, and now `_overlay.js`), and composite siblings —
**never** the public `hooks/` barrel. So the implementations live in the internal
`components/_overlay.js`, the overlays `import { useFocusTrap, usePortal } from
"../_overlay.js"`, and `hooks/index.js` re-exports them as the public API (mirroring
how it already re-exports `warnOnce`'s neighbours). This keeps the components
self-contained while still shipping the hooks publicly. `_overlay.js` itself imports
only `react` + `react-dom`, so there is no circular dependency with the hooks barrel.

The site's `gen:exports` scans `hooks/index.js` for `export function|const use…`, so
the re-export is written as `export const useFocusTrap = …` (not `export … from`) to
stay discoverable.

## The dismissable-layer stack (#389)

Before this, `Dialog`/`Drawer` called `onClose()` on **every** document `Escape` and closed on any backdrop
`mousedown`, with no idea what was open on top. So pressing `Escape` to dismiss a nested `Menu`, `Select`,
`Popover`, `Tooltip` or a second `Dialog` **also** closed the parent — throwing away, e.g., unsaved changes.

`components/_overlay.js` now exports a lightweight `useLayer(active)` primitive: every open overlay registers
while `active`, and the returned `isTop()` reports whether it is the topmost open layer (highest of a
module-level sequence set; cleanup runs after commit, so within one `Escape`/pointer event the just-closed child
is still registered and its parent correctly yields). Wiring:

- **Dialog / Drawer / CommandPalette** — their document `Escape` handler bails on `e.defaultPrevented` (a child
  React `onKeyDown` ran first) **or** `!isTop()`, and the backdrop `mousedown` is gated on `isTop()`.
- **Popover / Menu** — outside-pointer dismissal gates on `isTop()`; `Popover` also `preventDefault`s `Escape`
  so an enclosing Dialog stands down (`Menu` already `preventDefault`s it in its React handler).
- **Tooltip** — a shown (non-`anchored`) tooltip joins the stack and consumes `Escape` when topmost (a
  focus-shown tooltip is dismissed before the dialog behind it).
- **Select / Combobox / MultiSelect** — `preventDefault` on `Escape` **only while the list is open**, so the
  enclosing Dialog's `defaultPrevented` guard sees it.

Tested in `tests/overlay-layer-stack.test.jsx` (nested Dialog Escape hits only the inner; an open Select inside
a Dialog closes the Select, not the Dialog; a lone Dialog still closes — no regression).

## Disabled triggers (#398)

A native `disabled` control swallows the pointer events a `Tooltip` opens from, so a disabled button's "why it's
disabled" tooltip often never showed. `Tooltip` CSS now sets `pointer-events: none` on a disabled/`aria-disabled`
child of `.twc-tooltip-wrap` (hover reaches the wrap) with a `not-allowed` cursor. `Button`/`IconButton` gained
`focusableWhenDisabled`, which renders `aria-disabled` instead of native `disabled` so the trigger stays
focusable (tooltip reachable by keyboard) while click + `Enter`/`Space` stay blocked.

## Tests

- `tests/useFocusTrap.test.jsx` — focus-in, restore (and `restoreFocus:false`), and
  `Tab`/`Shift+Tab` wrapping (jsdom reports `offsetParent` as `null`, so the wrap test
  fakes it).
- `tests/usePortal.test.jsx` — portals to `<body>`, stable callback identity.
- `tests/overlays.test.jsx` — each overlay still portals, moves focus inside, closes
  on `Escape`/backdrop, and (CommandPalette) keeps Arrow/Enter navigation.
- `tests/Sidebar.test.jsx` — `overlay` mode renders a labelled `role="dialog"`, moves
  focus inside, and fires `onOpenChange(false)` on `Escape`/backdrop; `tests/AppShell.test.jsx`
  covers the shell forwarding overlay props to the sidebar (#138).
