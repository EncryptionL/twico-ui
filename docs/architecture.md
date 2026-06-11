# Architecture

## Three things in one repo

1. **The npm package** (`twico-ui`) — the shipped library.
2. **The design system** — tokens, styles, guidelines, UI kits, and `*.card.html` preview cards.
3. **The documentation website** (`site/`) — a Vite + React app deployed to GitHub Pages.

Only `dist/` + `styles/` + `README.md` + `LICENSE` are published to npm (`files` in `package.json`).

## Directory map

```
twico-ui/
├─ components/<group>/<Name>.jsx     # the components (React, self-contained)
│                     <Name>.d.ts    # hand-written props contract (shipped types)
│                     <Name>.prompt.md
│                     <group>.card.html   # design-system preview (NOT shipped)
├─ src/index.ts                      # barrel: re-exports every component + types
├─ tokens/*.css, base.css, styles.css
├─ styles/twico-ui.css               # concatenated shippable stylesheet (twico-ui/styles.css)
├─ styles/fonts/, assets/fonts/      # self-hosted OFL fonts
├─ tsup.config.ts, tsconfig.json
├─ scripts/add-use-client.mjs        # post-build "use client" prepend
├─ guidelines/, ui_kits/             # design-system specimens + screens (NOT shipped)
├─ site/                             # docs website (own package.json)
├─ docs/                             # this developer documentation
└─ .github/workflows/                # ci, release, deploy-docs, codeql
```

## Component model

Each component is a self-contained React function:

- Imports only `react` (and `react-dom` for portals). **No other runtime dependencies.**
- Injects its own scoped CSS once, via a `<style>` element keyed by a unique id, inside a
  `useEffect`. The CSS string is a **constant** — never built from props.
- Styles everything through **CSS custom properties** (`--color-*`, `--radius-*`, `--space-*`,
  `--shadow-*`, `--ease-*`, `--font-*`). This is what makes the system themeable and dark-mode aware.
- Icons are **inline SVG**. Fonts are self-hosted. **No CDNs** (see [security.md](./security.md)).
- SSR-safe: no `window`/`document` at module or render scope.

The barrel `src/index.ts` re-exports the value and the types for every component. It must be kept
in sync when components are added or removed.

## Build pipeline

`npm run build` runs `tsup`:

1. **JS** — esbuild bundles `src/index.ts`, resolving each `../components/<dir>/<Name>` to its
   `.jsx`, emitting `dist/index.mjs` (ESM) and `dist/index.cjs` (CJS). `react`/`react-dom`/
   `react/jsx-runtime` stay external (peer deps).
2. **Types** — `rollup-plugin-dts` (via `dts: true`) resolves the same specifiers to the sibling
   `.d.ts` files and rolls them into `dist/index.d.ts`.
3. **`onSuccess`** runs `scripts/add-use-client.mjs`, which **prepends `"use client";`** to both JS
   bundles (a tsup `banner` is stripped by esbuild) and shifts the sourcemaps by one line. This is
   what lets the package import into a Next.js App Router Server Component. CI asserts line 1 of each
   bundle is `"use client"`.

## Styling / theming

- `styles.css` (dev entry) `@import`s `tokens/*` + `base.css`.
- `styles/twico-ui.css` is the **shippable** concatenation that consumers import as
  `twico-ui/styles.css`; its `@font-face` rules point to `./fonts/*.ttf` (self-hosted).
- **Dark mode** = `.dark` class on `<html>`; every `--color-*` token flips. Portaled overlays
  re-theme too because they read the same tokens.

## Docs site (dogfooding)

`site/` aliases `twico-ui` → `../src/index.ts` (Vite config), so the documentation renders the
real components from source. See [docs-site.md](./docs-site.md).
