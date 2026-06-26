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
