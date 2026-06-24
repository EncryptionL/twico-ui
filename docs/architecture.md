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

- Imports only `react` (and `react-dom` for portals, plus the one shared internal helper
  `components/_styles.js`). **No other runtime dependencies.** The only other internal imports are
  composite components reusing siblings (`AvatarMenu` → `Menu`, `Datatable` →
  `Select`/`Input`/`MultiSelect`/`Pagination`, `CurrencyField` → `Select`).
- **Renders** its own scoped CSS via the shared `useScopedStyles(id, css)` helper
  (`components/_styles.js`): React 19 returns a hoistable `<style href={id} precedence="twc-ui">`
  (deduped by id, hoisted to `<head>`, **present in the SSR output — no FOUC**); React 18 falls back
  to the old client-only `useInsertionEffect` injection. The CSS string is a **constant** — never
  built from props. See [ssr-styles.md](./ssr-styles.md).
- Styles everything through **CSS custom properties** (`--color-*`, `--radius-*`, `--space-*`,
  `--shadow-*`, `--ease-*`, `--font-*`). This is what makes the system themeable and dark-mode aware.
- Icons are **inline SVG**. Fonts are self-hosted. **No CDNs** (see [security.md](./security.md)).
- SSR-safe: no `window`/`document` at module or render scope.

**Foundational primitives.** Beyond UI components, the library ships **layout** (`Stack`, `Grid`,
`Container` — in `components/layout/`) and **typography** (`Heading`, `Text` — in
`components/typography/`) primitives: pure, token-styled wrappers for building layouts and text
without hand-rolled CSS. The documentation site is itself built from them (dogfooding).

The barrel `src/index.ts` re-exports the value and the types for every component. It must be kept
in sync when components are added or removed.

**Overlays** (`Dialog`, `Drawer`, `Menu`, `Select`, `Popover`, `CommandPalette`) all follow one
pattern:

- **Portal to `document.body`** via `react-dom`'s `createPortal`, only while rendered. This is not
  optional polish — a `position: fixed` overlay rendered inline is positioned relative to the nearest
  ancestor that establishes a containing block, and `transform`, `filter`, `backdrop-filter`,
  `will-change`, `perspective`, or `contain` on any ancestor create one. The docs-site navbar uses
  `backdrop-filter` (frosted glass), so an inline overlay would size/hit-test against the ~64px navbar
  instead of the viewport (backdrop clicks miss; positioning breaks). Portaling to `<body>` escapes it.
- **Smooth open *and* close.** Each tracks a `mounted`/`render` flag so it stays in the tree through
  its exit animation, driven by a `data-state="open" | "closed"` attribute (CSS `@keyframes` per
  state), then unmounts on a short timeout (~120–200ms matching the animation). `prefers-reduced-motion`
  collapses the animation. `Tooltip` is the exception — it stays mounted and toggles a CSS
  `transition`, so it eases both ways for free.
- **Backdrop close** uses `onMouseDown` with an `e.target === e.currentTarget` guard so only clicks on
  the overlay itself (not bubbled from the panel) dismiss it.

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

### Package entry & resolution (JS + TS, ESM + CJS)

With `dts: true` + dual `format`, `tsup` emits `dist/index.d.cts` alongside `dist/index.d.ts`. The
`exports` map uses **per-condition `types`** so both module systems resolve the right declarations:

```jsonc
"exports": { ".": {
  "import":  { "types": "./dist/index.d.ts",  "default": "./dist/index.mjs" },
  "require": { "types": "./dist/index.d.cts", "default": "./dist/index.cjs" }
}}
```

So the package works identically from JavaScript (ESM **or** CommonJS) and TypeScript.
`npm run check:exports` (are-the-types-wrong) guards every resolution mode — `node10`,
`node16` CJS/ESM, and `bundler` — and runs in CI (the `styles.css` asset entry is excluded since
it carries no types).

## Styling / theming

- `styles.css` (dev entry) `@import`s `tokens/*` + `base.css`.
- `styles/twico-ui.css` is the **shippable** concatenation that consumers import as
  `twico-ui/styles.css`; its `@font-face` rules point to `./fonts/*.ttf` (self-hosted).
- **Dark mode** = `.dark` class on `<html>`; every `--color-*` token flips. Portaled overlays
  re-theme too because they read the same tokens.
- **Reduced motion.** `base.css` has the standard blanket `@media (prefers-reduced-motion: reduce)`
  reset (`animation-duration: 0.01ms !important; animation-iteration-count: 1 !important; …` on `*`).
  **Loading spinners are exempt** (`.twc-spinner`, `.twc-btn__spinner` re-assert their infinite spin)
  — they're functional status indicators, and a frozen spinner reads as a stuck/broken UI. Everything
  else (fades, slides, ripples) still collapses. Edit the rule in `base.css` and regenerate with
  `npm run build:css` (the `build:css:check` CI guard fails on drift).

## Docs site (dogfooding)

`site/` aliases `twico-ui` → `../src/index.ts` (Vite config), so the documentation renders the
real components from source. See [docs-site.md](./docs-site.md).
