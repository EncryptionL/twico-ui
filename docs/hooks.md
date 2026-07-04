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
| Utilities | `useCopyToClipboard`, `useId`, `useMounted`, `useIsomorphicLayoutEffect` |

## Conventions

- **SSR-safe, no hydration mismatch:** every hook guards `window`/`document` access and returns
  sensible server defaults (`useWindowSize` → `0×0`). `useMediaQuery(query, options?)` returns
  `defaultValue` (default `false`) on the server **and the first client render**, then syncs the real
  value in a layout effect before paint — so the hydrated markup matches (React 19 no longer warns).
  A client-only app can opt into an eager read with `{ initializeWithValue: true }`.
  `usePrefersReducedMotion` inherits this. Never touch the DOM at module scope.
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
