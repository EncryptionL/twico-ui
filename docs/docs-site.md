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
├─ src/pages/        Home, Installation, Theming, ThemeBuilder, DarkMode, Accessibility, Hooks,
│                    Playground, ComponentsIndex, ComponentPage
├─ src/components/   Layout, Sidebar, CodeBlock, LiveExample, PropsTable, Search, ThemeToggle, ErrorBoundary, Logo
├─ src/data/
│   ├─ components.js  AUTO-GENERATED: per-component summary + props table + usage snippet
│   ├─ exports.js     GENERATED (gen-exports.mjs): every twico-ui export name (for snippet imports)
│   └─ site.js        nav groups, slugs, repo/npm links
├─ src/demos/<Name>Demo.jsx        one self-contained live demo per component (lazy-loaded)
├─ src/demos/<Name>Variations.jsx  default-exports [{ title, description?, code, render }] — the
│                                  live "Variations" section examples (lazy-loaded, error-boundaried)
└─ scripts/
    ├─ gen-docs.mjs            generates components.js + the demo files
    ├─ enrich-props.mjs        appends the inherited DOM props (onClick, id, style, …) each component
    │                          forwards via ...rest, derived from its .d.ts root element (--check guards drift)
    ├─ gen-exports.mjs         regenerates exports.js hooks list from hooks/index.js (--check guards drift)
    ├─ gen-variations-index.mjs  extracts every *Variations.jsx title into variations.js for search (--check guards drift)
    └─ render-check.mjs        headless route sweep — fails on any uncaught page error (the behavioral gate)
```

- **Theme builder** (`pages/ThemeBuilder.jsx`) is the flagship demo: live controls for brand
  color, radius, type scale, density (`data-density`) and direction (`dir`) re-theme a gallery via
  inline CSS custom properties, with a copy-pasteable `:root` override export. **Playground**
  (`pages/Playground.jsx`) gives a curated set live prop knobs + a reactive code snippet. Both are
  className-free (pure Twico UI + token styles).

- Routing uses `HashRouter` (bulletproof for GitHub Pages — no 404 on refresh).
- Each component page renders its **live demo** (in an `ErrorBoundary`, so a bad demo degrades to a
  fallback instead of breaking the page), a **code snippet**, a **Variations** section (several live
  examples loaded from `<Name>Variations.jsx`, each with its own preview + copyable code), and a
  **props table**. The "Variations" heading renders synchronously so the on-this-page TOC finds it.
- **"All props" example.** Every component's `<Name>Variations.jsx` ends with an entry titled
  **"All props"** that exercises every *component-specific* prop in one live example (preview +
  copyable JS/TS code) — the generic DOM passthrough (`id`/`style`/`className`/`...rest`) is left out.
  Stateful/overlay cases use a module-level component (hooks can't run in the `render()` thunk, which
  is called inside a `.map()`). The whole Variations suite is **type-clean**: each demo file
  type-checks against the real library types (`tsc --checkJs` with `twico-ui` aliased to `src/`,
  data consts annotated via `/** @type {import("twico-ui").XColumn[]} */`), so example props can't
  drift from the contract.
- **Preview framing.** The demo/variation preview box (`LiveExample.jsx`, also used by the Playground
  preview) centers small demos (`justify-content: safe center`) but must let a **wide** demo (a
  many-column Datatable, a Kanban board) shrink to the card and scroll **internally** — never an outer
  horizontal scrollbar and never clipped. The catch: flex items default to `min-width: auto`
  (= min-content), so a wide child refuses to shrink and spills out / forces an outer scrollbar.
  `previewFit.js` injects one scoped rule — `[data-twc-preview] > * { min-width: 0; max-width: 100% }`
  (a `data-` attribute, no class names) — applied to the preview row so each demo element shrinks to
  the card width and its own `overflow:auto` region (e.g. the Datatable's table scroller) takes over.
- The **props table** (`PropsTable.jsx`) renders union types as one wrapping chip per member and
  complex single types as wrapping monospace, so a long `type` can never force horizontal scroll or
  crush the description column. Each prop `description` in `components.js` is written as a single
  informative sentence (~12–22 words) — what the prop does plus its effect or when to use it. Beyond
  the component-specific props, the table also lists the common **inherited DOM props** each component
  forwards via `...rest` (e.g. `onClick`, `id`, `style`), appended by `enrich-props.mjs` from the
  component's `.d.ts` root element, then a final `...rest` catch-all row.
- Code is highlighted with `prism-react-renderer` (bundled, not a CDN).
- Each code block has a toolbar: a **JS / TS** toggle (shared, persisted via `useLocalStorage` —
  `CodeLang.jsx`) that switches highlighting (`jsx`↔`tsx`), setup file extensions (`.jsx`↔`.tsx`), the
  `import type { … }` line, and any block's `tsCode`; plus **Expand/Collapse** (collapsed shows the
  simple JSX, expanded the full form with imports). Expanded imports are built by `buildImports`
  (`CodeBlock.jsx`): it derives the **React import** when the body uses `React.*` (default import) or
  bare hooks (named import) and **merges every used Twico export** into the snippet's `twico-ui` import
  line, so the copied code is actually runnable — not just the components that happened to be listed.
  A **long**
  snippet (> 16 lines, e.g. the Datatable Usage) is additionally **height-clamped** to ~360px while
  collapsed, with a bottom fade + "Expand code" affordance — otherwise the collapsed view dumped the
  whole body and "Expand" only added the import lines, which read as doing nothing.
- **Search** (`Search.jsx`, header + Cmd/Ctrl+K) runs Twico's `CommandPalette` over every component
  (name + tagline + summary + group + **prop names**, so "fullWidth" finds Button), the docs pages,
  and every **live "Variations" example** (from `variations.js`; "autoplay" → Carousel: Autoplay,
  deep-linking to `?s=variation-<i>`). It is a docs-browsing aid, so it is **hidden on the marketing
  landing page** (`/`); the navbar there shows Docs / Components / Theme builder / Changelog / npm.
- **Anchor links** (`AnchorHeading.jsx`): hovering a component/section heading reveals a copy-link
  button. The deep link is `#/components/<slug>?s=<section>`; `ComponentPage` reads `?s` and scrolls
  to that anchor on load.
- **Navigation feel:** in-page anchor jumps ease via a global `scroll-behavior: smooth` set on
  `<html>` from `main.jsx` (skipped under `prefers-reduced-motion`); route changes force
  `behavior: "instant"` so a new page lands at the top without a long animated scroll. Each component
  page ends with a **Prev/Next pager** (`ComponentPage.jsx`), and the right-hand "On this page" TOC is
  spaced off the article so it doesn't crowd the content.
- **"On this page" TOC** (`TableOfContents.jsx`, ≥1200 px) auto-builds from the `h2[id]`/`h3[id]`
  headings inside `#doc-article`, so it works uniformly on **every** doc page, not just component
  pages — Installation, Theming, Colors, Dark mode, Accessibility, Hooks, Theme builder, **Playground**,
  and the components index all list their sections. Only headings with an `id` are picked up, so
  example/demo headings (which have none) never leak in. The standard is: give each section heading an
  `id` via `AnchorHeading` (component pages) or `slugify(text)` (doc pages). `slugify` collapses any
  non-alphanumeric run to a hyphen so ids are always valid anchors (e.g. group "Buttons & actions" →
  `#buttons-actions`); component names are single words, so their route slugs are unaffected.
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

The **`snippet`** is the copy-paste "Usage" code shown on each component page. It should be a clean,
ready-to-run component — `const columns`/`const rows` literals plus an
`export default function Example() { return (<Component … />); }` with idiomatic JSX. A few snippets
that were originally machine-extracted came out as `React.createElement(...)` wrappers taking a
`props.users`-style argument; rewrite those by hand to plain JSX with inline sample data (the
Datatable snippet is the canonical example). Hand-editing a `snippet` is safe: the
`enrich-props.mjs --check` CI guard only re-derives `propsRows` (inherited DOM props) — it round-trips
the rest of the entry unchanged, so run `node scripts/enrich-props.mjs` once after editing to
re-canonicalize the file's formatting and the check stays green.

## Build, render-check, deploy

```bash
cd site
npm run build     # -> site/dist  (must succeed; it also compiles the library source)
```

- **Render-check (the verification bar):** serve `site/dist` (`npm run preview`) and drive it with a
  headless browser, visiting every component page to confirm each demo mounts without throwing
  (no error-boundary fallback, no console/page errors) and that overlays open on interaction.
  `node scripts/render-check.mjs` (override the URL with `ORIGIN=…`).
- **Interaction sweep (deeper gate):** `node scripts/interaction-sweep.mjs` visits every component
  route and *exercises* it — clicks up to 18 overlay/control triggers (Escape after each) and drives
  up to 10 inputs via the keyboard — asserting zero pageerrors/console errors throughout. Exits
  non-zero on any error (override the URL with `BASE=…`).
- **Behavioral assertions (deepest gate):** `node scripts/behavior-check.mjs` asserts each interactive
  component *does the right thing* — Switch/Checkbox toggle, Select/DatePicker open + commit + close,
  Dialog/Drawer open + trap focus + Escape, Menu/Popover/CommandPalette keyboard-nav, Slider/Rating/
  Pagination respond — 34 assertions across 18 components. (This is the gate that caught the
  Dialog/Drawer focus-on-open timing bug.)
- **CI enforcement:** `.github/workflows/interaction.yml` runs **all three** against a `vite preview`
  server on every push/PR to `dev`/`main` that touches the UI (and on manual dispatch), so the §8
  behavioral bar is automated, not just local. (`visual.yml` separately does Playwright pixel diffs.)
- **Visual regression** (`visual.yml`): Playwright pixel-diffs 7 high-traffic pages × 2 themes
  (14 snapshots, `tests/visual.spec.ts`) at 1320×900, `maxDiffPixelRatio: 0.02`, animations disabled.
  Baselines are **OS-sensitive** (font rasterization differs per OS) and the snapshot path has no
  platform suffix, so the **single committed set must be generated on the Linux runner**, not a dev
  machine. They live under `site/tests/__screenshots__/` (committed). **Seed or refresh them** via
  *Actions → Visual regression → Run workflow → mode=update* (or
  `gh workflow run "Visual regression" --ref dev -f mode=update`), download the `updated-baselines`
  artifact, and commit the PNGs. Without committed baselines every compare run fails — that is the
  bootstrap step, do it once. Thereafter every PR touching the UI runs `mode=compare` and uploads a
  diff-report artifact on mismatch.
- **Deploy:** `.github/workflows/deploy-docs.yml` builds `site/` and publishes to GitHub Pages on push
  to **`main`** only (the release branch) — or via manual dispatch. `enablement: true` lets the workflow
  turn Pages on; if blocked, enable it once under **Settings → Pages → Source = GitHub Actions**. Vite
  `base` is `/twico-ui/` to match the Pages path.
