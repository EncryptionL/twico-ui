# design-sync notes — twico-ui

Repo-specific gotchas for future re-syncs. Append a bullet whenever you learn something.

- **Don't confuse the two bundles.** The repo ships its *own* `_ds_bundle.js` / `_ds_manifest.json`
  / `SKILL.md` at the root — that's a **Claude Code skill** artifact (format 3, namespace
  `TwicoUiDesignSystem_<hash>`), generated for general AI design tooling. It is a **different format**
  from the claude.ai/design output. The converter writes to `./ds-bundle/` — never overwrite the
  repo's root files.

- **globalName = `TwicoUI`** (clean, matches the package). The repo's own bundle uses a hashed
  namespace; we deliberately pick the readable one for claude.ai/design.

- **Source shape = `package`.** No Storybook, no `*.stories.*`. Component list comes from the 63
  PascalCase value exports in `dist/index.d.ts` (62 components + `ToastViewport`).

- **`dist/` is committed and current** (v1.3.1, tsup output). Bundle it via `--entry ./dist/index.mjs`
  (the DS's own repo has no `node_modules/twico-ui`, so the package can't self-resolve).

- **Icons are NOT bundled.** `twico-ui/icons` re-exports the *entire* lucide-react set plus 31
  vendored brand icons. Bundling it would bloat the IIFE with ~1000 icons, and the `twico-ui/icons`
  subpath can't resolve in the DS's own repo anyway (no self-install). Components accept icons as JSX
  children, so previews render fine without them. Revisit only if a preview specifically needs a glyph.

- **Per-component usage docs are `<Name>.prompt.md` siblings** (non-standard suffix). The converter's
  doc lookup matches `<Name>.md`/`.mdx`, so `.prompt.md` may not auto-map — synthesized prompts
  (`.d.ts` + JSDoc + previews) are the fallback. `docsDir` is set to `components` so JSDoc/group
  enrichment finds the source `.jsx`.

- **Login:** `DesignSync(list_projects)` initially failed with *"refresh succeeded but design scopes
  not granted"* even after `/login`. The claude.ai token needs the design-system scope before project
  selection / upload can proceed.

- **CSS:** `styles/twico-ui.css` is the concatenated shippable stylesheet (tokens + base reset +
  `@font-face`). Fonts live at `styles/fonts/*.ttf`, referenced as `./fonts/...` — the scrape resolves
  them relative to the css entry. No `extraFonts` needed.

- **[FONT_MISSING] "Cascadia Code"** is non-blocking and expected: it's only a *fallback* family in the
  mono font stack (the real mono is JetBrains Mono, which ships). Accept system substitute.

- **Converter deps prune each other.** `npm i --no-save ts-morph` then `npm i --no-save playwright`
  prunes ts-morph (both are extraneous; the 2nd install drops the 1st). Install them in **one**
  command: `npm i --no-save ts-morph playwright@1.61.0`. esbuild survives (transitive of tsup).

- **Playwright:** chromium **1228** is already cached from the site's `@playwright/test@^1.61.0`.
  Install `playwright@1.61.0` at the repo root (matches that build) — no browser download needed.

## Hand-authored previews (verify loop)

The `.d.ts` variant-grid generator injects a dashed placeholder `<div>` as `children` for every
component declaring `children`. That **crashes void-element inputs** ("input is a void element… must
neither have children") and looks like a placeholder elsewhere. Fixes live in
`.design-sync/previews/<Name>.tsx` (marker line deleted so re-sync keeps them). 32 components were
hand-authored — all icon-free (icons aren't bundled). Key gotchas for re-syncs:

- **Form inputs** (Checkbox/Radio/Switch) forward native `checked`/`defaultChecked`/`name` via `...rest`.
- **Combobox/MultiSelect** need `options` ({value,label}); **Currency** needs `currency`+`defaultValue`;
  **CurrencyField** uses `defaultCurrency`+`defaultValue`.
- **Datatable** columns are MUI-style: `{ field, headerName, width, type, valueFormatter }` (NOT
  `header`/`align`). Missing `field` caused the `toLowerCase` crash.
- **Overlays** force the panel visible with `open` (Dialog/Drawer require `open`; Popover accepts it).
  **Tooltip** has no `open` prop — static preview shows only the trigger.
- **IconButton** uses text glyphs (`+ ⚙ ✕ 🗑`) for `icon` since lucide isn't in the bundle.
- **Left as placeholder (acceptable):** AppShell (full-page layout), ToastProvider / ToastViewport
  (infra — need interaction to show a toast).

## 2026-06-29 — full high-fidelity re-author pass

- **Project was ALREADY fully synced** to claude.ai/design project "Twico UI"
  (id `19289174-478d-42dc-b671-faf93b70be94`) despite the earlier login-failure note above —
  a later session completed an upload. The local config never recorded `projectId`; now pinned.
  The remote had **no `_ds_sync.json` anchor** → this run re-verifies everything (atomic path,
  non-empty target). After this run uploads the anchor, future syncs are incremental.
- **Only 32 of 63 previews were genuinely authored** (markerless). The other **31 carried the
  `// @ds-preview generated …` marker** and were stub placeholders: generic `items`
  (`{id,key,value,label,…}` all = "1", labels "Item 1/2/3") + a dashed `data-ds-placeholder` `<div>`
  as children. These render "cleanly" (root non-empty) so the mechanical render check passed, but
  grade `needs-work` on the absolute rubric. Re-authored all 31 this pass.
- **Porting recipe (validated on Input/Tabs/Menu):** the repo has `site/src/demos/<Name>Demo.jsx`
  + `<Name>Variations.jsx` for every component (except ToastViewport). Port these — they're the
  maintainer's canonical compositions. Transform: drop `import React`/default-function wrapper →
  markerless named-export arrow fns importing from `'twico-ui'`; keep real data; prefer
  `defaultValue` over controlled `value` (no live onChange in a static card). 2–6 exports each.
- **Icons:** demos are mostly icon-free; the `*Variations.jsx` files define **inline SVG** icon
  components (not lucide) — those are safe to reuse. Never import `lucide-react`/`twico-ui/icons`
  (not in the bundle). Use inline SVG or text glyphs.
- **Overlays force-open in-card:** Menu/Popover → `defaultOpen` (or `open`); Dialog/Drawer require
  `open`. They portal → need `cfg.overrides.<Name> = {"cardMode":"single","primaryStory":"<export>"}`.
  Validate flagged GRID_OVERFLOW for: CommandPalette, Dialog, Drawer, Menu, Popover, Tooltip
  (→ single), ToastProvider (→ column), ToastViewport (→ single). Batch all into config before the
  final rebuild.
- **ToastViewport / ToastProvider → floor cards** (deleted their preview .tsx): pure infra, nothing
  renders statically. The toast VISUAL is covered by the authored Toast card. AppShell re-authored
  as a compact static shell.

### Known render warns (triaged — not new on re-sync)
- `[FONT_MISSING] "Cascadia Code"` — accept. Fallback-only family in the mono stack; the real mono
  (JetBrains Mono) ships. Recorded as accepted-substitute. Non-blocking.
- `[GRID_OVERFLOW]` for Navbar/Sidebar/CommandPalette/Dialog/Drawer/Menu/Popover/Tooltip — RESOLVED
  via `cfg.overrides` (Navbar→column; the rest→single with primaryStory). Single/column cards can't
  re-flag by construction, so this should not recur.

### States that can't render statically (skipped, by design)
- **AvatarMenu**: the public API exposes NO `open`/`defaultOpen` (unlike Menu), so the dropdown can't
  be forced open in a static card. Preview shows the trigger variants (avatar + name + email + chevron,
  presence, sizes) — the honest ceiling. The menu visual itself is covered by the Menu card.
- **Tooltip**: no `open` prop (CSS-transition tooltip on hover) → preview shows the trigger only.

## Re-sync risks (watch-list for the next run)
- **Project is now anchored.** `_ds_sync.json` was uploaded this run, so future syncs are
  INCREMENTAL — only changed/added components re-verify (run `resync.mjs --remote <fetched sidecar>`).
- **Owned previews are pinned to twico-ui@1.3.2's API.** All 61 authored `.design-sync/previews/*.tsx`
  use real props. On a DS version bump, re-grade — if a component's prop/array shape changed
  (Tabs/Menu/Select items, Datatable/Table columns), re-port from `site/src/demos/<Name>Demo.jsx`
  (the maintainer keeps those current; they are the canonical repair source).
- **Avatar / AvatarMenu cells use remote `https://i.pravatar.cc` images.** If the network is blocked
  at capture time they fall back to initials (still clean) — not a hard dependency, but the image
  variant won't show. Swap to a self-hosted/data-URI avatar if that matters.
- **`cfg.overrides` primaryStory names** (Navbar/Sidebar/CommandPalette/Dialog/Drawer/Menu/Popover/
  Tooltip) reference export names in those previews. If a re-author renames an export, update the
  matching `primaryStory`.
- **AvatarMenu/Tooltip** show trigger only (no `open` prop). If the API later adds one, author the
  open state and drop the skip note above.
- **Build assumptions:** `dist/` committed & current (v1.3.2, tsup) — re-run `cfg.buildCmd`
  (`npm run build`) only if the DS source changed. Converter deps live in gitignored `.ds-sync/`
  (esbuild, ts-morph, @types/react, playwright@1.61.0); chromium **1228** reused from the site's
  Playwright cache (LOCALAPPDATA/ms-playwright). On a fresh clone, re-stage `.ds-sync/` + reinstall.
