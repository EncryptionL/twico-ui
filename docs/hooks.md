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
| Utilities | `useCopyToClipboard`, `useId`, `useMounted`, `useIsomorphicLayoutEffect` |

## Conventions

- **SSR-safe:** every hook guards `window`/`document` access and returns sensible server defaults
  (e.g. `useMediaQuery` → `false`, `useWindowSize` → `0×0`). Never touch the DOM at module scope.
- **Stable callbacks:** returned functions (`onOpen`, `copy`, `toggle`, …) are memoized so they are
  safe to pass to effects and memoized children.
- **The docs site dogfoods them:** the layout uses `useMediaQuery` + `useDisclosure`, the theme
  button uses `useColorScheme`, and the code blocks use `useCopyToClipboard` — there are **no
  bespoke hooks in `site/`**.

## Adding a hook

1. Implement it in `hooks/index.js` (SSR-safe, memoized).
2. Add its signature to `hooks/index.d.ts`.
3. Add a row to the table on `site/src/pages/Hooks.jsx` and to the list in `README.md`.
4. `npm run build && npm run typecheck` — confirm it appears in `dist/index.mjs`/`dist/index.d.ts`
   and that `"use client"` is still line 1.
