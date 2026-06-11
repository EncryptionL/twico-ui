# CLAUDE.md — working guidelines for Twico UI

Guidance for any agent or contributor working in this repository. Read this first.

---

## 1. What this repository is

**Twico UI** is a **free, MIT-licensed React component library** (58 components, dark mode,
motion, accessibility, design tokens). This one repo holds three things:

1. **The npm package** — `src/index.ts` (barrel) → `components/**` (the React components) →
   built by `tsup` to `dist/`. This is what consumers `npm install twico-ui`.
2. **The design system** — `tokens/`, `styles/`, `guidelines/`, `ui_kits/`, and the
   `*.card.html` preview cards. Source of truth for the visual language.
3. **The documentation website** — `site/` (Vite + React) deployed to GitHub Pages. It
   **dogfoods** the library (imports it from source via an alias).

> The published npm tarball contains **only** `dist/` + `styles/` + `README.md` + `LICENSE`
> (see `files` in `package.json`). Everything else is repo-only.

---

## 2. Repository layout

| Path | What |
| --- | --- |
| `components/<group>/<Name>.jsx` | A component. Each has a sibling `<Name>.d.ts` (props contract), `<Name>.prompt.md` (usage), and the group has one `*.card.html` preview. |
| `src/index.ts` | Auto-generated barrel re-exporting every component + its types. **Update it when you add/remove a component.** |
| `tokens/*.css`, `base.css`, `styles.css` | Design tokens + reset. `styles/twico-ui.css` is the concatenated, shippable stylesheet (`twico-ui/styles.css`). |
| `assets/fonts/`, `styles/fonts/` | Self-hosted OFL fonts (Plus Jakarta Sans, JetBrains Mono). |
| `tsup.config.ts`, `tsconfig.json`, `scripts/add-use-client.mjs` | The build. |
| `site/` | The docs website (own `package.json`). |
| `docs/` | **Developer/contributor documentation — see rule §4.** |
| `.github/workflows/` | `ci.yml`, `release.yml`, `deploy-docs.yml`, `codeql.yml`. |
| `DESIGN-SYSTEM.md` | The full design guide (tokens, voice, visual foundations). |

---

## 3. Core commands

```bash
# Library
npm install
npm run build        # tsup -> dist/ (ESM + CJS + .d.ts), then prepends "use client"
npm run typecheck    # tsc --noEmit
npm pack --dry-run   # preview the published tarball

# Docs site
cd site && npm install
npm run dev          # http://localhost:5173/twico-ui/
npm run build        # -> site/dist
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
Releases are **fully automated** by semantic-release. **Never bump the version manually.**
Write [Conventional Commits](https://www.conventionalcommits.org/):
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

- **Components are self-contained.** Each imports only `react` (and `react-dom` for portals),
  injects its own scoped CSS once via a `<style>` tag keyed by id, and styles everything through
  CSS custom properties (`--color-*`, `--radius-*`, `--ease-*`, …). No CSS-in-JS libs, no npm deps.
- **Theming** is pure token override; **dark mode** is the `.dark` class on `<html>`.
- **`"use client"`** is prepended to the built bundles by `scripts/add-use-client.mjs` after
  tsup (a tsup `banner` is stripped by esbuild). This is what makes the package importable into
  Next.js App Router Server Components. CI asserts it survived bundling.
- **Overlays** (Menu, Select, Popover, Dialog, Drawer, CommandPalette) portal to `document.body`
  only while open (SSR-safe).

## 6. Adding or changing a component

1. Create `components/<group>/<Name>.jsx` (named `export function <Name>`), self-contained.
2. Add `components/<group>/<Name>.d.ts` (props interface) and `<Name>.prompt.md`.
3. Re-export it (value + types) from `src/index.ts`.
4. `npm run build && npm run typecheck` — both must pass; `"use client"` must remain line 1.
5. Update the docs site reference (`site/src/data/components.js` + a `site/src/demos/<Name>Demo.jsx`).
6. **Update `/docs`** (rule §4.1) and commit with a Conventional Commit.

## 7. Verification expectations

Before pushing: `npm run build` + `npm run typecheck` clean, `npm pack --dry-run` shows only the
intended files, `npm audit --omit=dev` is 0, and the docs site builds (`cd site && npm run build`).
For UI behavior, a headless render-check of the docs demos is the established bar (see
`docs/docs-site.md`).
