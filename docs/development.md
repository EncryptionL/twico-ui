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

### Running the tests on Windows: use an uppercase drive letter

```bash
cd /D/Github/twico-ui && npx vitest run     # 177 files, 1532 tests
```

From a Git Bash cwd with a **lowercase** drive letter (`/d/Github/twico-ui`), every suite fails
before a single test runs:

```
Error: Vitest failed to find the current suite.
 ❯ tests/setup.js:6:1   afterEach(() => cleanup());
```

Vitest reports its root as `D:/Github/twico-ui` regardless, so under a `d:/…` cwd it resolves its own
module twice and `setup.js`'s top-level `afterEach` registers against a different instance than the
runner's. `cd /D/…` and the same tree passes. Reproduced on vitest 5.0.5 and 5.1.0, Node 24.11 and
24.22; `rm -rf node_modules && npm ci`, the pool setting, the environment and the Node version all
make no difference, so it is easy to mistake for a broken install. CI runs on Ubuntu and has never
been affected — a red local suite with a green CI is this, not a platform bug worth chasing.

### Check a guard by its exit code, not by grepping its output

A pre-push sweep that pipes each command through a grep for the success markers is a filter that
cannot fail. `npm run check:exports` was "verified" locally with `| grep -E "🟢|🔴|❌"`, which
printed rows of 🟢 and omitted the `💀 Resolution failed` three lines above them — the new
`twico-ui/styles.min.css` export has no type declarations, so `attw` needs it listed in
`--exclude-entrypoints` beside `styles.css`. CI caught what the local run had reported as green.

Note also that `cmd | tail -n` makes the **pipeline's** status `tail`'s, so a following `&&` runs
whether or not `cmd` failed. The shape that works:

```bash
for c in "npm run build" "npm run typecheck" "npm run check:exports" "npm run build:css:check"          "npm run build:fonts:check" "npm run gen:llms:check" "npm run verify:palette"          "npm run check:ds-bundle" "npm run size" "npm pack --dry-run" "npm audit --omit=dev"; do
  out=$(eval "$c" 2>&1); code=$?
  [ $code -eq 0 ] && echo "PASS  $c" || { echo "FAIL($code)  $c"; echo "$out" | tail -6; }
done
```

The generators (`build:css:check`, `gen:llms:check`, `verify:palette`, `build:fonts:check`) each
print an explicit `✓ <claim>` only on success, so reading their output is safe. `attw`,
`size-limit` and `npm pack` print a table either way.

### Reseeding the visual baselines

The pixel-diff baselines are **OS-sensitive** and this is a Windows checkout, so they cannot be
regenerated locally. Dispatch `visual.yml` with `mode=update`, download the `updated-baselines`
artifact, and commit the PNGs under `site/tests/__screenshots__/` (the workflow header says the
same).

**Diff them before committing them.** A regenerated set routinely comes back with a handful of
differing bytes on pages nothing touched: after the three Datatable variations landed, four other
baselines changed by 14–66 pixels out of 7–8 million, `maxDelta` 1–3 of 255, all inside `y=17..46`
— the navbar's text band, i.e. antialiasing variance between runner instances. Committing the set
on trust would have buried a real change among them.

```bash
cd site && npm run diff:baselines -- ../path/to/updated-baselines
```

`site/scripts/diff-baselines.mjs` skips byte-identical files, then loads the rest into canvases and
reports the differing-pixel count, the max per-channel delta and the bounding box. A **dimension**
change is the honest signal that content moved (24,162 → 26,454 px tall, there — the three new
Datatable variations); a few dozen pixels at `maxDelta ≤ 3/255` inside `y=17..46` is the navbar
re-antialiasing and means nothing.

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

### Do not assert on serialized CSS in tests

A jsdom major bump changes how a `CSSStyleDeclaration` serializes, so a test that string-matches
`getAttribute("style")` or `style.transform` can fail while the component is unchanged. jsdom 31
(#516) broke two tests this way:

| assertion | jsdom 30 | jsdom 31 |
| --- | --- | --- |
| `style.transform` contains `translate(0px, 0px)` | `translate(0px, 0px) scale(1)` | `translate(0px) scale(1)` — a redundant zero second argument is dropped, per spec |
| `getAttribute("style")` matches `/left:\s*892px/` | `left: 892px; …` | `inset: auto auto 408px 892px` — the physical offset longhands collapse into the shorthand |

In both cases the fix was to assert what the test *means* rather than how it prints: read the
longhand back off the declaration (`el.style.left`, `el.style.getPropertyValue("--x")`) or parse the
value out (`imgOffset()` in `tests/image-viewer.test.jsx`). Both forms pass on jsdom 30 **and** 31,
so the assertion does not have to be retargeted at each bump.

## Dependency updates (Dependabot auto-merge)

Dependency bumps are hands-off. [`.github/dependabot.yml`](../.github/dependabot.yml) opens **weekly**
updates against **`dev`** for three ecosystems — root npm (build/release toolchain), `/site` npm, and
GitHub Actions — and **groups** each ecosystem's minor+patch bumps into a single PR (majors still come
individually, so a breaking major can't hold back the safe bumps). The package ships **zero runtime
dependencies**, so every bump is dev/CI/site tooling.

[`.github/workflows/dependabot-auto-merge.yml`](../.github/workflows/dependabot-auto-merge.yml) then
**squash-merges each Dependabot PR automatically once every check is green** (CI + CodeQL + Interaction).
It runs via `workflow_run` (which carries a write token — Dependabot's own `pull_request` token is
read-only) so it needs **no branch protection** and doesn't affect the direct-push-to-`dev` flow. A bump
that breaks any check is simply **left open** for a human — that's the only time you touch a Dependabot PR.

> `workflow_run` workflows only fire from the copy on the **default branch (`main`)**, so this workflow is
> active only once it has been merged to `main` (it rides along on the next `dev → main` release).

To change the policy: hold majors by adding a `dependabot/fetch-metadata` step and gating the merge on
`steps.meta.outputs.update-type != 'version-update:semver-major'`; or pause a specific dependency via an
`ignore` entry in `dependabot.yml`.

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
