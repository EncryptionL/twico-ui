# Documentation website (`site/`)

A **Vite + React** single-page app that documents the library and **dogfoods it** — the docs are
built with the very components they describe. Deployed to **GitHub Pages**:
https://encryptionl.github.io/twico-ui/

## How it dogfoods the library

`site/vite.config.js` aliases the bare specifier `twico-ui` → `../src/index.ts`, so every
`import { Button } from "twico-ui"` in the site resolves to the library **source**. The docs always
reflect the latest code, and the example `import` statements match exactly what consumers write. The
shippable stylesheet (`../styles/twico-ui.css`) is imported once in `site/src/main.jsx`; fonts are
bundled by Vite from `styles/fonts/` (**no CDN**).

## Structure

```
site/
├─ src/pages/        Home, Installation, Theming, DarkMode, Accessibility, ComponentsIndex, ComponentPage
├─ src/components/   Layout, Sidebar, CodeBlock, LiveExample, PropsTable, ThemeToggle, ErrorBoundary, Logo
├─ src/data/
│   ├─ components.js  AUTO-GENERATED: per-component summary + props table + usage snippet
│   └─ site.js        nav groups, slugs, repo/npm links
├─ src/demos/<Name>Demo.jsx        one self-contained live demo per component (lazy-loaded)
├─ src/demos/<Name>Variations.jsx  default-exports [{ title, description?, code, render }] — the
│                                  live "Variations" section examples (lazy-loaded, error-boundaried)
└─ scripts/gen-docs.mjs            generates components.js + the demo files
```

- Routing uses `HashRouter` (bulletproof for GitHub Pages — no 404 on refresh).
- Each component page renders its **live demo** (in an `ErrorBoundary`, so a bad demo degrades to a
  fallback instead of breaking the page), a **code snippet**, a **Variations** section (several live
  examples loaded from `<Name>Variations.jsx`, each with its own preview + copyable code), and a
  **props table**. The "Variations" heading renders synchronously so the on-this-page TOC finds it.
- The **props table** (`PropsTable.jsx`) renders union types as one wrapping chip per member and
  complex single types as wrapping monospace, so a long `type` can never force horizontal scroll or
  crush the description column. Each prop `description` in `components.js` is written as a single
  informative sentence (~12–22 words) — what the prop does plus its effect or when to use it.
- Code is highlighted with `prism-react-renderer` (bundled, not a CDN).
- Each code block has a toolbar: a **JS / TS** toggle (shared, persisted via `useLocalStorage` —
  `CodeLang.jsx`) that switches highlighting (`jsx`↔`tsx`), setup file extensions (`.jsx`↔`.tsx`), the
  `import type { … }` line, and any block's `tsCode`; plus **Expand/Collapse** (collapsed shows the
  simple JSX, expanded the full form with imports — derived from the twico-ui exports used).
- **Search** (`Search.jsx`, header + Cmd/Ctrl+K) runs Twico's `CommandPalette` over every component
  (name + tagline + summary + group) and the docs pages.
- **Anchor links** (`AnchorHeading.jsx`): hovering a component/section heading reveals a copy-link
  button. The deep link is `#/components/<slug>?s=<section>`; `ComponentPage` reads `?s` and scrolls
  to that anchor on load.
- **Navigation feel:** in-page anchor jumps ease via a global `scroll-behavior: smooth` set on
  `<html>` from `main.jsx` (skipped under `prefers-reduced-motion`); route changes force
  `behavior: "instant"` so a new page lands at the top without a long animated scroll. Each component
  page ends with a **Prev/Next pager** (`ComponentPage.jsx`), and the right-hand "On this page" TOC is
  spaced off the article so it doesn't crowd the content.
- Dark mode toggles the `.dark` class on `<html>` and persists to `localStorage`.

## Regenerating the component reference

`site/src/data/components.js` and `site/src/demos/*Demo.jsx` are generated from each component's
`.d.ts` + `.prompt.md` + `.jsx`. To regenerate from a workflow output JSON:

```bash
cd site
node scripts/gen-docs.mjs <path-to-extraction-output.json>
```

When adding a component by hand, add its `site/src/demos/<Name>Demo.jsx` and a `components.js` entry
(name, slug, group, summary, importName, propsRows, snippet).

## Build, render-check, deploy

```bash
cd site
npm run build     # -> site/dist  (must succeed; it also compiles the library source)
```

- **Render-check (the verification bar):** serve `site/dist` (`npm run preview`) and drive it with a
  headless browser, visiting every component page to confirm each demo mounts without throwing
  (no error-boundary fallback, no console/page errors) and that overlays open on interaction.
- **Deploy:** `.github/workflows/deploy-docs.yml` builds `site/` and publishes to GitHub Pages on push
  to **`main`** only (the release branch) — or via manual dispatch. `enablement: true` lets the workflow
  turn Pages on; if blocked, enable it once under **Settings → Pages → Source = GitHub Actions**. Vite
  `base` is `/twico-ui/` to match the Pages path.
