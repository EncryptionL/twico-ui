# Hooks

Twico UI ships a set of small, SSR-safe, fully-typed React hooks alongside the components —
the same primitives the components and the docs site are built on. They are exported from the
package root (`import { useMediaQuery } from "twico-ui"`).

## Where they live

- **Source:** [`hooks/index.js`](../hooks/index.js) (implementations) + [`hooks/index.d.ts`](../hooks/index.d.ts) (types).
- **Barrel:** re-exported from `src/index.ts` via `export * from "../hooks"`, so they land in the same
  `dist/` bundle as the components and inherit the `"use client"` banner.
- **Docs:** the user-facing reference page is `site/src/pages/Hooks.jsx` (`/docs/hooks`).

## The set

| Group | Hooks |
| --- | --- |
| State | `useDisclosure`, `useToggle`, `useControllableState`, `useLocalStorage`, `usePrevious` |
| Responsive & theme | `useMediaQuery`, `usePrefersReducedMotion`, `useColorScheme`, `useWindowSize` |
| Events & DOM | `useEventListener`, `useClickOutside`, `useKeyPress`, `useHover`, `useIntersectionObserver`, `useScrollLock` |
| Timing | `useDebouncedValue`, `useDebouncedCallback`, `useInterval`, `useTimeout` |
| Overlay | `useFocusTrap`, `usePortal` |
| Inputs | `useFilePicker` |
| Utilities | `useCopyToClipboard`, `useId`, `useMounted`, `useIsomorphicLayoutEffect` |

## Conventions

- **SSR-safe, no hydration mismatch:** every hook guards `window`/`document` access and returns
  sensible server defaults (`useWindowSize` → `0×0`). The rule is stronger than "guard `window`": a
  hook must return its server default on the server **and on the first client render**, because the
  lazy `useState` initializer runs during hydration too — reading the real value there is exactly what
  makes the server HTML and render #1 disagree. So `useMediaQuery(query, options?)` returns
  `defaultValue` (default `false`) in both, then syncs the real value in a layout effect before paint
  — the hydrated markup matches (React 19 no longer warns). `usePrefersReducedMotion` inherits this.
  **`useWindowSize`, `useLocalStorage` and `useColorScheme` did NOT follow it** until #466: they read
  the viewport / storage / `prefers-color-scheme` in their initializer, so SSR emitted one thing and
  hydration rendered another (`width < 768 ? <MobileNav/> : <DesktopNav/>` flipped, a stored dark theme
  rendered a light-theme toggle). All three now take the `useMediaQuery` shape, and all four accept
  `{ initializeWithValue: true }` for a client-only app that wants the eager read back. Note what
  `ColorSchemeScript` does and does not buy you: it keeps the `.dark` class on `<html>` from flashing,
  but it cannot align React's own state — that needed the hook change. Never touch the DOM at module
  scope, and never in a `useState` initializer either.
- **Idiomatic ref params:** the ref-taking hooks (`useHover`, `useClickOutside`,
  `useIntersectionObserver`, `useEventListener`) type their ref as `RefObject<T | null>`, so the
  standard `useRef<T>(null)` is assignable with no cast under React 19's `@types/react`.
- **`useControllableState` returns `[value, setValue, isControlled]`** — the third element reports
  whether a `value` prop is driving the state, and in development the hook warns once if a component
  flips between controlled and uncontrolled.
- **`useFocusTrap` / `usePortal` are the overlay primitives** shared by `Dialog`, `Drawer`, and
  `CommandPalette`. `useFocusTrap(ref, active?, { restoreFocus? })` moves focus into the region on
  activate, cycles `Tab`/`Shift+Tab` within it, and restores focus to the trigger on deactivate — it
  deliberately does **not** own `Escape` (closing is component-specific). `usePortal()` returns a stable
  `render(node)` that portals to `document.body` (null on the server). Their implementation lives in the
  internal helper `components/_overlay.js` — **not** `hooks/index.js` — so the overlay components can
  share them without importing the public hooks barrel (CLAUDE.md §5); `hooks/index.js` re-exports them
  as the public API. See [`docs/overlays.md`](./overlays.md).
- **`useFilePicker` (#406)** opens a native file picker from your own trigger while reusing FileUpload's
  validation. `useFilePicker({ accept, multiple, maxSize, maxFiles, onFiles, onReject })` returns
  `{ open, getInputProps }`: render `<input {...getInputProps()} />` (hidden) once, then call `open()` from any
  control. The accept/maxSize/maxFiles/dedupe logic is shared with `FileUpload` via the internal
  `components/_upload.js` (so the hook stays out of the public barrel'\''s way, mirroring `_overlay.js`).
- **Stable callbacks:** returned functions (`onOpen`, `copy`, `toggle`, …) are memoized so they are
  safe to pass to effects and memoized children.
- **The docs site dogfoods them:** the layout uses `useMediaQuery` + `useDisclosure`, the theme
  button uses `useColorScheme`, and the code blocks use `useCopyToClipboard` — there are **no
  bespoke hooks in `site/`**.

## `useToast` — the one component-coupled hook

`useToast` is **not** in `hooks/index.js` (that file holds the 25 generic, dependency-free hooks —
`useFocusTrap`/`usePortal` are re-exported into it from `components/_overlay.js`).
It lives in `components/feedback/ToastProvider.jsx` because it needs the `<ToastProvider>` context +
the `Toast`/`ToastViewport` components. Drop `<ToastProvider>` in once, then
`const { toast } = useToast()` anywhere beneath it: `toast.success("Saved")`,
`toast.error({ title, description })`, `dismiss(id)`, `clear()`. It throws if used outside a provider.
It surfaces on the docs site through the `ToastProvider` component entry, not the generated `HOOKS`
list (which is derived only from `hooks/index.js`).

## Adding a hook

1. Implement it in `hooks/index.js` (SSR-safe, memoized).
2. Add its signature to `hooks/index.d.ts`.
3. Add a row to the table on `site/src/pages/Hooks.jsx` and to the list in `README.md`.
4. Run `npm run gen:exports` so `site/src/data/exports.js` picks it up (CI guards drift).
5. `npm run build && npm run typecheck` — confirm it appears in `dist/index.mjs`/`dist/index.d.ts`
   and that `"use client"` is still line 1.
