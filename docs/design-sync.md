# Design sync — publishing Twico UI to claude.ai/design

How the repo is converted into a [claude.ai/design](https://claude.ai/design) **design-system
project** so the Claude design agent can build real UIs with Twico UI components.

This is **repo-only tooling** — none of it ships in the npm tarball, the library build, or the docs
site. It is driven by the `design-sync` skill (a Claude Code skill); this doc records the
twico-ui-specific setup so a re-sync is reproducible.

> **Don't confuse the two bundles.** The repo already ships its own root `_ds_bundle.js` /
> `_ds_manifest.json` / `SKILL.md` — that's the **Claude Code skill** artifact (format 3, namespace
> `TwicoUiDesignSystem_<hash>`) for general AI design tooling. The design-sync output is a
> **different format** consumed by claude.ai/design, built into `./ds-bundle/` (gitignored). The two
> never overlap.

---

## The root skill bundle (`_ds_bundle.js`) and its drift guard

The committed root `_ds_bundle.js` (+ `_ds_manifest.json` + `SKILL.md`) is the **`twico-ui-design`
Claude Code skill** artifact — a `format:3` IIFE that assigns every export to
`window.TwicoUiDesignSystem_<hash>`. It is **generated out-of-band by that skill's packaging** and
committed manually; there is **no in-repo generator** for it (unlike `build:css` / `gen:llms`).

Because nothing rebuilds it automatically, it **drifts** whenever `components/**` change without a
manual skill re-run — e.g. consumers loading the bundle miss new props/behaviour shipped in a release.

**Drift guard.** `npm run check:ds-bundle` (`scripts/check-ds-bundle.mjs`) reads the bundle's own
`@ds-bundle` header (its declared input files) and fails if any of them changed in git **after** the
bundle's last commit. It is a *staleness* check, not a content-equivalence check (the skill's
converter and source-hash algorithm are external/opaque, so we can't reproduce the bundle locally).

- **CI** runs it in a dedicated `Design-system bundle drift` job, currently **warn-only**
  (`--warn` → a `::warning::` annotation, non-blocking) because a stale bundle can only be fixed by
  re-running the skill. Once the bundle is regenerated, flip the CI step to the blocking
  `npm run check:ds-bundle`.
- **To clear drift:** regenerate the bundle via the `twico-ui-design` skill packaging, then commit the
  refreshed `_ds_bundle.js` + `_ds_manifest.json` in the same commit as the component change (so the
  guard sees them move together).

---

## What gets produced

The converter turns the built `dist/` (run `npm run build` first if stale — `dist/` is gitignored)
into a bundle the claude.ai/design app consumes:

- `_ds_bundle.js` — one IIFE assigning every export to `window.TwicoUI.*` (the design agent imports this).
- `styles.css` — `@import`s the tokens, component CSS, and self-hosted fonts.
- Per component, `components/<group>/<Name>/`: a `<Name>.d.ts` (the API contract), a `<Name>.prompt.md`
  (usage), and a `<Name>.html` preview card.

Coverage: **63 component values** (62 components + `ToastViewport`) + the hooks, grouped by the
8-directory taxonomy.

---

## Committed inputs (the reproducible part)

| Path | What |
| --- | --- |
| `.design-sync/config.json` | The converter config — see below. (Older runs used `design-sync.config.json` at the repo root; it has been moved here.) |
| `.design-sync/NOTES.md` | Repo-specific gotchas + a **Re-sync risks** watch-list a re-sync should read first. |
| `.design-sync/conventions.md` | The README header inlined into the design agent's prompt (wired via `readmeHeader`): no-provider setup, the props+tokens styling idiom, where the truth lives, and one build snippet. |
| `.design-sync/previews/<Name>.tsx` | One preview per **authored** component (61 files) — all hand-authored, markerless, kept across re-syncs. `ToastProvider`/`ToastViewport` have **no** preview file (deliberate floor cards — pure toast infra). |

### `.design-sync/config.json`

| Field | Value | Why |
| --- | --- | --- |
| `pkg` / `globalName` | `twico-ui` / `TwicoUI` | The package and the `window.*` global the bundle assigns to. |
| `projectId` | `19289174-…be94` | The claude.ai/design project this repo syncs to ("Twico UI"). Pins the re-sync target + verification anchor. |
| `shape` | `package` | No Storybook; the component list comes from the PascalCase value exports in `dist/index.d.ts`. |
| `entry` | `./dist/index.mjs` | The built ESM entry the converter bundles (the repo has no self-installed `node_modules/twico-ui`). |
| `srcDir` | `components` | **Critical** — the default source-root probe picks `src/` (which holds only `index.ts`/`icons.ts`), so every component would miss group/JSDoc enrichment and collapse into one `general` group. Pointing at `components/` recovers the real groups. |
| `cssEntry` | `styles/twico-ui.css` | The concatenated shippable stylesheet (tokens + base reset + `@font-face`); fonts resolve from `styles/fonts/`. |
| `readmeHeader` | `.design-sync/conventions.md` | Prepended to the generated README the design agent reads. |
| `overrides` | 8 overlay/wide components | `cardMode` for cards that overflow the grid: `Navbar`→`column`; `Sidebar`/`CommandPalette`/`Dialog`/`Drawer`/`Menu`/`Popover`/`Tooltip`→`single` (with `primaryStory`). |
| `docsMap` | 62 entries → `<Name>.prompt.md` | The curated per-component usage docs use the non-standard `.prompt.md` suffix, which the converter's auto-matcher (`<Name>.md`/`.mdx`) misses — so each is wired explicitly. |
| `guidelinesGlob` | `DESIGN-SYSTEM.md` + 4 `docs/*.md` | Design guidelines copied into the bundle's `guidelines/`. |

**Icons are intentionally not bundled.** `twico-ui/icons` re-exports the entire Lucide set + 31
vendored brand icons; bundling it would bloat the IIFE and the subpath can't self-resolve in this
repo (no `node_modules/twico-ui`). Components take icons as JSX children, so previews render fine
without them — hand-authored previews use text glyphs where an icon would go (e.g. `IconButton`).

---

## Running a re-sync

The converter is staged into `.ds-sync/` and the `ds-bundle/` output are **gitignored** (staged fresh
each run). The skill drives this; the manual equivalent:

```bash
# 1. Stage the converter from the design-sync skill dir into .ds-sync/ (isolated lockfile)
mkdir -p .ds-sync && cp -r "<skill-base-dir>"/package-*.mjs "<skill-base-dir>"/resync.mjs \
  "<skill-base-dir>"/lib "<skill-base-dir>"/storybook .ds-sync/
echo '{"name":"ds-sync-deps","private":true}' > .ds-sync/package.json

# 2. Install converter deps into .ds-sync/ (its own package.json → no pruning)
(cd .ds-sync && npm i esbuild ts-morph @types/react playwright@1.61.0)  # chromium 1228 reused from the site's cache

# 3. Build the bundle from the repo's built dist/ (run `npm run build` first if dist/ is stale)
node .ds-sync/package-build.mjs --config .design-sync/config.json --node-modules ./node_modules \
  --entry ./dist/index.mjs --out ./ds-bundle

# 4. Validate + headless render-check every preview
node .ds-sync/package-validate.mjs ./ds-bundle
```

`package-validate.mjs` exits 0 when all 63 previews render. It writes screenshots to
`ds-bundle/_screenshots/` and per-component status to `ds-bundle/.render-check.json`; review the
contact sheets before uploading. On an anchored re-sync, run the one-shot driver instead —
`node .ds-sync/resync.mjs --config .design-sync/config.json --node-modules ./node_modules --entry ./dist/index.mjs --out ./ds-bundle --remote <fetched _ds_sync.json>` — which chains build → diff → validate → capture and only re-verifies changed/added components.

### Authoring previews

The `.d.ts` variant-grid generator injects a placeholder `<div>` as `children` for every component
that declares `children` — which **crashes void-element inputs** (`<input>` can't take children) and
shows generic placeholder text elsewhere. The fix is a hand-authored, markerless
`.design-sync/previews/<Name>.tsx`, ported from the maintainer's own `site/src/demos/<Name>Demo.jsx`.
All **61** authored previews are now hand-authored (real props, no placeholders); `ToastProvider` and
`ToastViewport` ship the typographic floor card (no preview file). The render check is **63/63** clean.
See `.design-sync/NOTES.md` for the per-component gotchas (data shapes, `open` props on overlays, the
known `FONT_MISSING "Cascadia Code"` accept, and the **Re-sync risks** watch-list).

---

## Uploading

Upload is done by the skill via the `DesignSync` tool (`finalize_plan` → `write_files` from
`./ds-bundle/`, ending with `_ds_sync.json`). It requires the **design-system scope** on the claude.ai
login (granted automatically on the first `DesignSync` call once the account has claude.ai/design
access). The bundle build/validate is fully local and does not need the login; only the final upload
does. The repo's project is **"Twico UI"** (`projectId` in the config); it now carries the
`_ds_sync.json` anchor, so future syncs are **incremental** — only changed components re-verify.
