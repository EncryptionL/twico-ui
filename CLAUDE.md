# CLAUDE.md — working guidelines for Twico UI

Guidance for any agent or contributor working in this repository. Read this first.

---

## 1. What this repository is

**Twico UI** is a **free, MIT-licensed React component library** — **64 components** (66 exported
component values: `Toast.jsx` also exports `ToastViewport`; `ToastProvider.jsx` also exports the
`useToast` hook) **+ 25 standalone hooks**, with dark mode, motion, accessibility, RTL support, a
density scale, and design tokens. Zero runtime dependencies (peers: `react`/`react-dom` ≥18; plus an
**optional** `lucide-react` peer used *only* by the `twico-ui/icons` re-export — the core pulls nothing).
`twico-ui/icons` re-exports the full Lucide set **and** adds 31 zero-dependency vendored brand icons
(`GithubIcon`, `VercelIcon`, …) that need no peer. `src/brand-icons.tsx` is **generated** — edit the
`LIST` in `scripts/fetch-brand-icons.mjs`, then `node scripts/fetch-brand-icons.mjs && node
scripts/gen-brand-icons.mjs`; never hand-edit it. See `docs/icons.md`.
This one repo holds three things:

1. **The npm package** — `src/index.ts` (barrel) → `components/**` + `hooks/` →
   built by `tsup` to `dist/`. This is what consumers `npm install twico-ui`.
2. **The design system** — `tokens/`, `styles/`, `guidelines/`, `ui_kits/`, and the
   `*.card.html` preview cards. Source of truth for the visual language. `DESIGN-SYSTEM.md`
   is the written guide; `SKILL.md` + `_ds_bundle.js` + `_ds_manifest.json` are generated
   artifacts that package the system for AI design tooling.
3. **The documentation website** — `site/` (Vite + React, `HashRouter`) deployed to GitHub
   Pages at `/twico-ui/`. It **dogfoods** the library (Vite alias `twico-ui` → `../src/index.ts`).

> The published npm tarball contains **only** `dist/` + `styles/` + `README.md` + `LICENSE`
> (see `files` in `package.json`). Everything else is repo-only.

---

## 2. Repository layout

| Path | What |
| --- | --- |
| `components/<group>/<Name>.jsx` | A component. 8 group dirs matching the docs-site taxonomy: `buttons`, `layout`, `typography`, `inputs`, `data-display`, `navigation`, `feedback`, `overlay`. Each component has a sibling `<Name>.d.ts` (props contract) and `<Name>.prompt.md` (usage); `*.card.html` previews live alongside (35 files — not 1:1 with components). |
| `hooks/index.js` + `hooks/index.d.ts` | The 25-hook API, re-exported via `export * from "../hooks"` in `src/index.ts`. `useFocusTrap`/`usePortal` are re-exported into it from the internal `components/_overlay.js`. See `docs/hooks.md`. |
| `src/index.ts` | Barrel re-exporting every component (value + types) + hooks. **Update it when you add/remove a component.** |
| `tokens/*.css`, `base.css`, `styles.css` | Design tokens (colors, fonts, typography, spacing, radius, motion) + reset. `styles.css` is the dev entry (`@import`s the rest). |
| `styles/twico-ui.css` | The concatenated, **shippable** stylesheet (`twico-ui/styles.css`). **Generated** by `scripts/build-css.mjs` from `tokens/*` + `base.css` — run `npm run build:css` after editing a token; CI's `build:css:check` fails on drift. |
| `assets/fonts/` (source), `styles/fonts/` (shipped copy) | Self-hosted OFL fonts (Plus Jakarta Sans, JetBrains Mono variable `.ttf`). Duplicated on purpose — keep both in sync. |
| `tsup.config.ts`, `tsconfig.json`, `scripts/add-use-client.mjs` | The build. |
| `site/` | The docs website (own `package.json`, `private: true`). Generators live in `site/scripts/` (`gen-docs.mjs`, …). |
| `examples/` | Runnable consumer apps that install `twico-ui` **from npm** (each own `package.json`, `private`). Repo-only — excluded from the tarball, the library build, and the root typecheck. See `docs/examples.md`. |
| `guidelines/` | 13 `*.card.html` foundation previews (colors, type, spacing, motion, iconography). |
| `ui_kits/` | 5 HTML preview kits (auth, dashboard, pricing, settings, showcase) — design validation only, never shipped. |
| `docs/` | **Developer/contributor documentation — see rule §4.1.** Index: `docs/README.md`. |
| `.github/workflows/` | `ci.yml`, `release.yml`, `deploy-docs.yml`, `codeql.yml` (+ `dependabot.yml`, targets `dev`). |

---

## 3. Core commands

```bash
# Library
npm install
npm run build          # tsup -> dist/ (ESM + CJS + .d.ts + .d.cts), then prepends "use client"
npm run typecheck      # tsc --noEmit
npm run check:exports  # are-the-types-wrong: JS + TS resolve across ESM/CJS
npm test               # vitest (unit tests in tests/); test:run for CI
npm run build:css      # regenerate styles/twico-ui.css from tokens (build:css:check guards drift)
npm run verify:palette # assert palette.html's baked hexes match tokens/colors.css (CI guard)
npm run gen:llms       # regenerate llms.txt AI guide (gen:llms:check guards drift); docs/ai-guide.md
npm run gen:ds-bundle  # regenerate the preview-only root _ds_bundle.js from dist/ (run after component changes); docs/design-sync.md
npm run check:ds-bundle # guard (CI-blocking): root _ds_bundle.js not stale vs its declared component inputs
npm run size           # size-limit budget check
npm pack --dry-run     # preview the published tarball

# Docs site
cd site && npm install
npm run dev          # http://localhost:5173/twico-ui/
npm run build        # -> site/dist
npm run gen:exports  # regenerate src/data/exports.js hooks list from hooks/index.js
npm run render-check # headless route sweep (needs a running preview)
npm run test:visual  # Playwright pixel diffs (baselines seeded via visual.yml)
node scripts/gen-docs.mjs <workflow-output.json>   # regenerate component reference + demos
```

---

## 4. STANDING RULES — these are not optional

### 4.1 Document everything, in `/docs`
**Every change — even the smallest — must be reflected in the `/docs` directory.** Add a
component, change a prop, tweak the build, add a workflow, fix a bug → update or add the
relevant file under `docs/`. If a suitable doc doesn't exist, create one. Keep `docs/README.md`
(the index) current. User-facing API docs live on the **docs site** (`site/`); `docs/` is the
**developer/contributor** record of how and why the project works. See `docs/documentation.md`.

### 4.2 No CDNs — self-host everything
**Never reference a third-party CDN** for fonts, icons, scripts, styles, or any asset in
shipped code (`components/`, `src/`, `styles/`, `tokens/`, `base.css`) or the docs site
(`site/`). CDNs cause `403`/blocked-asset failures for consumers behind firewalls or strict
CSPs. Fonts are self-hosted `.ttf`; icons are **inline SVG**. CI fails the build if a CDN
reference appears in shipped source (`ci.yml` → "Guard - no CDN references"). The only
exception is the `*.card.html` / `ui_kits/*.html` **preview** files, which are never shipped
and never part of the docs site.

### 4.3 Conventional Commits + automated SemVer
Releases are **fully automated** by semantic-release (`.releaserc.json`, branch `main`).
**Never bump the version manually.** Write [Conventional Commits](https://www.conventionalcommits.org/):
`fix:` → patch, `feat:` → minor, `feat!:`/`BREAKING CHANGE:` → major, `docs:`/`chore:`/`ci:`/
`refactor:`/`test:` → no release. See `docs/releases.md`.

### 4.4 Branch flow
Work on **`dev`** (or `feat/*` / `fix/*` → `dev`). **`main` is release-only** — merging
`dev → main` triggers the npm release **and** the docs deploy. Do not push directly to `main`.

### 4.5 Security standards
- Treat any consumer-supplied `href`/URL as untrusted: sanitize schemes (`javascript:`/`data:`/
  `vbscript:`) before they reach the DOM (see `safeHref` in the nav components).
- No `dangerouslySetInnerHTML`, `eval`, `new Function`, or string-arg `setTimeout`.
- SSR-safe: never touch `window`/`document` at module or render scope — only in effects/handlers.
- `npm audit --omit=dev` must stay **0 vulnerabilities** (the consumer-facing surface).
- Least-privilege `GITHUB_TOKEN` permissions in every workflow.
- See `docs/security.md` and `SECURITY.md`.

---

## 5. Architecture notes

- **Components are self-contained.** Each imports only `react` (and `react-dom` for portals, plus
  the shared internal helpers `components/_styles.js`, `components/_warn.js`, and — for the modal
  overlays — `components/_overlay.js`); the only other exceptions are composite
  components that reuse siblings (`AvatarMenu` → `Menu`, `Datatable` →
  `Select`/`Input`/`MultiSelect`/`Pagination`, `CurrencyField` → `Select`, `Sidebar` → `Tooltip`
  for collapsed-item labels). Components never import the public `hooks/` barrel — shared hook logic
  lives in an internal `_*.js` helper that `hooks/index.js` re-exports (e.g. `useFocusTrap`/`usePortal`
  from `_overlay.js`; see `docs/overlays.md`). Each **renders** its own
  scoped CSS via `useScopedStyles(id, css)` (`_styles.js`): on **React 19** it returns a hoistable
  `<style href={id} precedence="twc-ui">` that React dedupes by id, hoists to `<head>`, and
  **includes in the SSR stream — no FOUC**; on **React 18** it falls back to the old client-only
  `useInsertionEffect` injection (no regression). The `<style>` is rendered as a child of the
  component's root; some related components share one id (the input family shares `twc-field-styles`).
  Everything is styled through CSS custom properties (`--color-*`, `--radius-*`, `--ease-*`, …).
  Class names use a `twc-` BEM-ish prefix; **variants/states are `data-*` attributes**, not
  class toggles. No CSS-in-JS libs, no npm deps.
- **Theming** is pure token override; **dark mode** is the `.dark` class (or
  `[data-theme="dark"]`) on `<html>` — only semantic aliases flip, primitives stay static.
  `useColorScheme` handles toggle + persistence (`twico-theme`) + cross-instance sync and
  suppresses CSS transitions during the flip so the page re-themes in one frame.
- **`"use client"`** is prepended to both built bundles by `scripts/add-use-client.mjs` after
  tsup (a tsup `banner` is stripped by esbuild) and the sourcemaps are shifted one line. This is
  what makes the package importable into Next.js App Router Server Components. CI asserts it
  survived bundling on line 1 of `dist/index.mjs` **and** `dist/index.cjs`.
- **Overlays follow one pattern** (Dialog, Drawer, Menu, Popover, CommandPalette always portal
  to `document.body`; Select portals when its `portal` prop is set): render only while open
  (SSR-safe), animate **out as well as in** via a `data-state="open" | "closed"` attribute —
  the component stays mounted through a `var(--duration-exit)` animation, then unmounts on a
  170 ms timeout kept in lockstep with that token. `prefers-reduced-motion` collapses the
  animations. Tooltip is the exception: it **does** portal to `document.body` with fixed positioning
  measured from the trigger (so it's never clipped by an overflow ancestor — e.g. a collapsed
  Sidebar's icon labels), but it stays mounted and eases both ways with a plain CSS transition rather
  than a `data-state` unmount. It does **not** auto-flip placement, so pick `placement` to suit the
  trigger's position (a top-edge trigger needs `placement="bottom"`). Backdrop dismissal uses `onMouseDown` + an `e.target === e.currentTarget`
  guard. Portaling matters: any ancestor with `transform`/`filter`/`backdrop-filter` becomes the
  containing block for `position: fixed` (the docs-site navbar's `backdrop-filter` bit us here).
- **RTL + density.** Component CSS uses **logical properties** (`padding-inline`, `inset-inline-*`,
  `text-align: start`, …) so `dir="rtl"` on any ancestor mirrors the UI; nav chevrons add a scoped
  `[dir="rtl"] … { transform: scaleX(-1) }`. `data-density="compact" | "comfortable"` on any
  ancestor retunes every control inside by remapping `--control-h-*` (base.css) — no per-component
  code. Both are demoed live on the docs-site **Theme builder** page.
- **Hooks** (25 standalone in `hooks/index.js`; plus the component-coupled `useToast`, exported
  from `components/feedback/ToastProvider.jsx`) are all SSR-safe (guarded `window`/`document`,
  sensible server defaults) and memoize returned callbacks. Per-condition `types` in the `exports`
  map gives correct resolution for ESM **and** CJS TypeScript consumers (`npm run check:exports`).

## 6. Adding or changing a component

1. Create `components/<group>/<Name>.jsx` (named `export function <Name>`), self-contained.
2. Add `components/<group>/<Name>.d.ts` (props interface) and `<Name>.prompt.md`.
3. Re-export it (value + types) from `src/index.ts`.
4. `npm run build && npm run typecheck` — both must pass; `"use client"` must remain line 1.
5. Update the docs site: a `components.js` entry (props rows: one informative sentence per prop,
   ~12–22 words), a `site/src/demos/<Name>Demo.jsx`, a `<Name>Variations.jsx`, and the manual
   sync points below.
6. `npm run gen:llms` — regenerate the AI guide (`llms.txt`) from the refreshed `components.js`
   (CI's `gen:llms:check` fails on drift). See `docs/ai-guide.md`.
7. `npm run gen:ds-bundle` — regenerate the preview-only root `_ds_bundle.js` from `dist/` (CI's
   blocking `check:ds-bundle` fails if a component changed without it). See `docs/design-sync.md`.
8. **Update `/docs`** (rule §4.1) and commit with a Conventional Commit.

## 7. Docs site conventions (`site/`)

- **className-free.** Site code uses only Twico components + inline `style` objects built from
  design tokens. No CSS files, no class names, no UI frameworks — the site is proof the library
  needs none.
- `site/src/data/components.js` (the component reference: summaries, props rows, snippets,
  taglines) is generated by `site/scripts/gen-docs.mjs` and **re-running it overwrites manual
  edits** — keep deliberate hand edits in mind before regenerating.
- Demos (`<Name>Demo.jsx`) and Variations (`<Name>Variations.jsx`, default-exporting
  `[{ title, description?, code, render }]`) are lazy-loaded via `import.meta.glob` and
  error-boundaried.
- Code blocks: per-block **JS/TS toggle** (persisted), **Expand/Collapse** (imports derived from
  `site/src/data/exports.js`), copy button. **Search** (Ctrl/Cmd+K) runs the library's own
  CommandPalette. Headings get copyable deep links (`#/components/<slug>?s=<section>`).
- **Manual sync points** (no automation — update these when the public API changes):
  `site/src/data/exports.js` (component + hook names), `Search.jsx` `DOC_CMDS` (doc pages),
  `site/src/data/site.js` `GROUP_ORDER` (nav grouping).
- **Versioned docs.** A navbar **version selector** lets readers view older releases. The live site
  is the latest; each released minor is rebuilt from its git tag into a frozen snapshot at
  `/twico-ui/v<minor>/` by `deploy-docs.yml`. **When cutting a new minor**, add an entry to
  `site/public/versions.json` (newest first, after `Latest`) **and** a `"<minor>=<tag>"` pair to
  `DOC_SNAPSHOTS` in `deploy-docs.yml`. See `docs/docs-site.md` → "Versioned docs".
- Route changes scroll instantly to top; in-page anchors scroll smoothly (reduced-motion-safe).
  The "On this page" TOC only renders ≥1200 px viewports.

## 8. Verification expectations

Before pushing: `npm run build` + `npm run typecheck` clean, `npm run check:exports` is green
(JS + TS resolution across ESM/CJS — `are-the-types-wrong`), `npm pack --dry-run` shows only the
intended files, `npm audit --omit=dev` is 0, and the docs site builds (`cd site && npm run build`).
For UI behavior, the established bar is a **headless render-check**: serve `site/dist` with
`vite preview`, drive every route with Playwright, and require zero `pageerror`s — plus targeted
interaction tests (open/close overlays, toasts, etc.) for whatever you touched. See
`docs/docs-site.md`.
