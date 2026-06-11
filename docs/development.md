# Development

## Prerequisites

- Node.js **18+** (CI uses 20).
- npm (lockfiles are committed; use `npm ci` for reproducible installs).

## Setup & commands

```bash
# Library (repo root)
npm install
npm run build        # tsup -> dist/ (ESM + CJS + .d.ts) + "use client" prepend
npm run typecheck    # tsc --noEmit
npm pack --dry-run   # preview exactly what gets published
npm audit --omit=dev # must report 0 (consumer-facing surface)

# Docs website
cd site
npm install
npm run dev          # http://localhost:5173/twico-ui/
npm run build        # -> site/dist
npm run preview      # serve the production build locally
```

## Branch flow

- **`dev`** — integration branch. Do day-to-day work here, or on `feat/*` / `fix/*` branches that
  merge into `dev`. Every push/PR runs CI (`.github/workflows/ci.yml`).
- **`main`** — release branch. Merging `dev → main` triggers the npm release **and** the docs
  deploy. **Never push directly to `main`.**

## Commits

Use [Conventional Commits](https://www.conventionalcommits.org/) — the version and changelog are
derived from them (see [releases.md](./releases.md)):

```
feat: add Calendar component         # minor
fix: clamp datatable menu to viewport # patch
feat!: rename Datatable column props  # major (breaking)
docs: …  chore: …  ci: …  refactor: … # no release
```

## Adding or changing a component

1. **Create the component**: `components/<group>/<Name>.jsx` with a named `export function <Name>`.
   Keep it self-contained (import only `react`; inline-SVG icons; constant scoped CSS via a keyed
   `<style>`; style through CSS custom properties). **No CDNs, no extra npm deps.**
2. **Contract + usage**: add `components/<group>/<Name>.d.ts` (props interface) and
   `<Name>.prompt.md`. Optionally a `*.card.html` preview in the group.
3. **Export it**: add the value and the type re-exports to `src/index.ts`.
4. **Verify**: `npm run build` and `npm run typecheck` must pass; line 1 of both `dist/index.mjs`
   and `dist/index.cjs` must be `"use client"`; `npm pack --dry-run` must show only intended files.
5. **Docs site**: add `site/src/demos/<Name>Demo.jsx` (a small self-contained live demo) and an
   entry in `site/src/data/components.js` (or regenerate — see [docs-site.md](./docs-site.md)).
6. **Document it** under `docs/` (policy §[documentation.md](./documentation.md)) and commit.

## Security checklist for any change

- Consumer-supplied URLs (`href`, `src`) sanitized before reaching the DOM (`safeHref` pattern).
- No `dangerouslySetInnerHTML` / `eval` / `new Function` / string-arg timers.
- No `window`/`document` at module or render scope.
- No CDN references in shipped source (CI guard enforces this).
- `npm audit --omit=dev` stays at 0.

See [security.md](./security.md).
