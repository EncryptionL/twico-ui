# Colors — the `twico-ui/colors` export and the Color docs page

Twico UI's color system has **two faces**, and this doc records both plus how they stay in sync.

> **Material UI parity.** This was built to mirror MUI's
> [Color page](https://mui.com/material-ui/customization/color/) — hue cards + shade rows + hex,
> introduced by an `import { red } from '@mui/material/colors'` snippet. Twico's faithful analog is
> the `/docs/colors` page **plus a real `twico-ui/colors` export** so the snippet actually works.
> See the standing "cross-reference Material UI" guidance when building further pages/components.

## 1. The two faces of color

| | Primitive scales | Semantic aliases |
| --- | --- | --- |
| **What** | Raw hue ramps: `indigo`, `slate`, `emerald`, `amber`, `rose`, `sky` | Intent tokens: `--color-primary`, `--color-success`, surfaces, text, borders |
| **Where** | `tokens/colors.css` (`--indigo-500: …`) **and** `src/colors.ts` (JS) | `tokens/colors.css` (`--color-*`) |
| **Dark mode** | Static — never flip | Flip under `.dark` / `[data-theme="dark"]` |
| **Use for** | Charts, canvas, inline maths, JS theme objects | App theming — the default choice |

## 2. The `twico-ui/colors` JS export

A new package **subpath export** ships the primitive scales as plain objects:

```js
import { indigo, slate, emerald, amber, rose, sky } from "twico-ui/colors";
indigo[500];        // "#6366f1"
import colors, { brand } from "twico-ui/colors";
brand === indigo;   // true  (mirrors the CSS --brand-* → --indigo-* aliasing)
colors.rose[600];   // "#e11d48"
```

- **Source:** `src/colors.ts` (hand-authored, `as const` for literal types).
- **Build:** a second `tsup` entry (`tsup.config.ts` → `entry: { index, colors }`) emits
  `dist/colors.{mjs,cjs,d.ts,d.cts}`. `scripts/add-use-client.mjs` deliberately **does not** touch
  it — it's pure data, so no `"use client"` directive (importable from RSC freely).
- **package.json:** an `"./colors"` entry in `exports` with per-condition `types` for ESM **and**
  CJS. It ships automatically (the `files` array already includes `dist`).
- **`check:exports`:** now runs with `--profile node16`. Subpath `exports` are a Node 12.7+ feature,
  so legacy **node10** classic resolution can't resolve `twico-ui/colors` (it's EOL, and shipping
  root shim files would break the dist-only tarball). node16 ESM/CJS + bundler all resolve 🟢.

## 3. Drift guards

There are **two** hand-maintained copies of the token values, each with its own guard:

### 3a. `src/colors.ts` ↔ `tokens/colors.css` (primitives)
`src/colors.ts` (JS) and `tokens/colors.css` (CSS) are two hand-maintained copies of the same
values — same situation as the concatenated stylesheet, which `build:css:check` guards.
**`tests/colors.test.js`** parses every `--<hue>-<shade>: #hex;` primitive out of `tokens/colors.css`
and asserts it equals the JS object — in both directions (no JS shade missing from CSS, none extra).
Edit one, you must edit the other or the test (and CI) fails.

### 3b. `palette.html` ↔ `tokens/colors.css` (resolved primitives + semantic light/dark)
The standalone `palette.html` preview is **self-contained**: it hard-codes the *resolved* value of
every primitive step **and** every `--color-*` semantic alias (light *and* dark) so it renders
without loading the stylesheet — which means it silently drifts whenever a token changes.
**`scripts/verify-palette.mjs`** (`npm run verify:palette`, guarded in `ci.yml`) re-resolves every
token in `tokens/colors.css` — following the full `var()` chain for both `:root` and `.dark` — and
compares it against the values baked into `palette.html` (140 values: 6 primitive scales + the
semantic aliases × light/dark). It is read-only and fails CI on any mismatch; it mirrors the
`build:css:check` pattern. (It strips CSS comments before parsing, because the colors.css header
comment mentions `.dark`, which would otherwise hijack the dark-block match.)

## 4. The Color docs page (`site/src/pages/Colors.jsx`)

Route `/docs/colors`, listed in the sidebar via `GETTING_STARTED` (`site/src/data/site.js`) and in
search via `DOC_CMDS` (`site/src/components/Search.jsx`). It **dogfoods** the export
(`import { indigo } from "twico-ui/colors"`), enabled by a Vite alias
(`twico-ui/colors` → `../src/colors.ts`, listed **before** the bare `twico-ui` alias so the specific
match wins). Sections mirror MUI's page:

1. **Color palette** — the import snippet, then a card per hue (the `500` shade as a hero header,
   then every shade as a click-to-copy row; foreground auto-picked by luminance for contrast).
2. **Semantic tokens** — live `var(--color-*)` swatches (re-theme with the page) for intent +
   surfaces/text, with a CSS usage snippet.
3. **Accessibility** — WCAG 2.2 SC 1.4.3 (4.5:1 / 3:1) note, like MUI's.

The page is **className-free** per the site convention (only Twico components + inline token styles);
swatches are `<button>`s with `aria-label`s and copy uses the library's `useCopyToClipboard` hook.

## 5. When you change a color

1. Edit **both** `tokens/colors.css` and `src/colors.ts` (if it's a primitive).
2. `npm run build:css` (regenerate the shipped stylesheet) and `npm test` (the §3a drift guard).
3. `npm run build && npm run check:exports` — the `colors` entry must stay 🟢.
4. The Color docs page (`site/`) re-renders automatically from the tokens/export — no edits needed.
   **`palette.html` does NOT** — it hard-codes resolved values, so update its `PRIMITIVES` /
   `SEMANTIC` data to the new resolved value(s) and run `npm run verify:palette` (the §3b guard).
5. If you touch a **semantic tone foreground** (`--color-*-fg`), the focus ring (`--color-ring`), or a
   solid fill, re-run `npm test` — `tests/tokens-a11y.test.js` (§6) fails if a solid tone or the ring
   drops below its contrast floor.

## 6. Accessibility of the tokens

`tests/tokens-a11y.test.js` resolves the tokens and asserts WCAG 2.x contrast, so the palette can't
silently regress below the a11y floors:

- **Solid tone foregrounds** clear 3:1 (the SC 1.4.11 UI floor), and `warning`/`info` clear 4.5:1.
  Solid `warning`/`info` use **dark ink** (`--amber-950` / `--sky-950`) on the amber/sky fill rather
  than white — white on a mid-value fill only reached ~2.15:1 / ~2.77:1. The fills are unchanged, so
  the chips still read as "warning"/"info".
- **The focus ring** (`--color-ring`) is a **solid** brand color (`--brand-500` light, `--brand-400`
  dark) so the 3px `box-shadow` ring clears SC 1.4.11 / 2.4.11 (3:1) against the surface — a
  translucent indigo alpha-composited to only ~1.8:1 on light.
- **Forced colors** — because Windows High Contrast strips author box-shadows (and with them the ring),
  `base.css` adds `@media (forced-colors: active) { :focus-visible { outline: 2px solid CanvasText } }`
  so a real, system-repainted outline always shows.
