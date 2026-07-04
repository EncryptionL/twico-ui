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
