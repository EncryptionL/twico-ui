# Icons — the `twico-ui/icons` export

Twico UI's components are **icon-agnostic**: anything that shows an icon takes it as a `ReactNode`
prop (`leftIcon`, `rightIcon`, `icon`, `header`, …), so a consumer can pass inline SVG or any icon
library. For convenience, the **`twico-ui/icons`** subpath re-exports the full
[Lucide](https://lucide.dev) set — the icon language the design system is built around — from one
blessed place, **plus a curated set of brand icons Lucide deliberately omits** (see
[Brand icons](#brand-icons) below).

```jsx
import { HomeIcon, SearchIcon, SettingsIcon, GithubIcon } from "twico-ui/icons";
import { Button } from "twico-ui";

<Button leftIcon={<HomeIcon size={16} />}>Home</Button>
<Button variant="outline" leftIcon={<GithubIcon size={16} />}>Star</Button>
```

> Lucide exports every icon under both its base name (`Home`) and an `Icon`-suffixed alias
> (`HomeIcon`). The brand icons and the docs site use the **`*Icon` suffix** for consistency.

## Brand icons

Lucide intentionally ships **no brand/logo marks**. So `twico-ui/icons` also exports a curated set
of the most-requested brand icons (currently **31**: `GithubIcon`, `GitlabIcon`, `VercelIcon`,
`FigmaIcon`, `XTwitterIcon`, `DiscordIcon`, `GoogleIcon`, `NpmIcon`, `NextjsIcon`, `NodejsIcon`,
`ReactjsIcon`, `TailwindIcon`, `TypeScriptIcon`, `DockerIcon`, social marks, …).

These are **zero-dependency inline SVG** built into twico-ui itself — they need **no peer
dependency** (unlike the Lucide icons). They mirror Lucide's component API: `size` (default `24`),
`color` (default `currentColor`, applied as the **fill** since brand marks are solid, not stroked),
a `title` for accessibility, and any other SVG prop; they `forwardRef` to the `<svg>`.

```jsx
import { GithubIcon, brandIcons, brandIconNames } from "twico-ui/icons";

<GithubIcon size={20} />;                 // one icon
brandIcons; // → [{ name: "GithubIcon", label: "GitHub", slug: "github", Icon }, …]  (build a picker)
brandIconNames; // → ["AppleBrandIcon", "BlueskyIcon", "DiscordIcon", …]
```

| Piece | What |
| --- | --- |
| `src/brand-icons.tsx` | **Generated.** The brand icon components + the `brandIcons` / `brandIconNames` exports. A `brand()` factory wraps each baked-in `<path>` in a `forwardRef` SVG with the Lucide-style props. |
| `scripts/fetch-brand-icons.mjs` | Fetches each brand's single `<path>` from [Simple Icons](https://simple-icons.org) (path data **CC0-1.0**) into `scripts/brand-icons.json`. Slugs removed from Simple Icons over trademark requests (e.g. `linkedin`, `slack`, `openai`) 404 and are skipped. |
| `scripts/gen-brand-icons.mjs` | Reads `scripts/brand-icons.json` → writes `src/brand-icons.tsx`. Path data is **baked inline** so the shipped icons are self-hosted — no runtime CDN (CLAUDE.md §4.2). |
| Naming | Every export is `*Icon`-suffixed and **verified to never collide** with a Lucide export (a collision would make `export *` ambiguous and silently drop the icon). Names that would clash use a brand-specific form: `XTwitterIcon` (Lucide's `XIcon` is the close glyph), `AppleBrandIcon` (Lucide's `AppleIcon` is the fruit). |

**Adding/refreshing a brand:** edit the `LIST` in `scripts/fetch-brand-icons.mjs`, then
`node scripts/fetch-brand-icons.mjs && node scripts/gen-brand-icons.mjs && npm run build`.

## It's an optional peer — the core stays zero-dependency

The **Lucide** half of `twico-ui/icons` is `export * from "lucide-react"` (see `src/icons.ts`); the
**brand** half is `export * from "./brand-icons"` (no dependency). `lucide-react` is declared as an
**optional `peerDependency`**, not a runtime dependency:

```jsonc
// package.json
"peerDependencies":     { "react": ">=18", "react-dom": ">=18", "lucide-react": ">=0.300.0" },
"peerDependenciesMeta": { "lucide-react": { "optional": true } }
```

So:

- `import { Button } from "twico-ui"` pulls **zero** dependencies — the headline promise is intact.
- Only `import { … } from "twico-ui/icons"` needs Lucide, and the consumer installs it themselves:
  `npm install lucide-react`. The `optional: true` flag means npm won't warn consumers who never
  touch the subpath.
- The consumer controls the Lucide version (the broad `>=0.300.0` peer range accepts current `0.x`
  **and** `1.x`), and re-exports auto-track whatever they installed — no maintenance here.

## Build wiring

| Piece | What |
| --- | --- |
| `src/icons.ts` | `export * from "lucide-react";` **+** `export * from "./brand-icons";` |
| `tsup.config.ts` | a third `entry` (`icons`), with `lucide-react` in `external` so Lucide is **re-exported, not bundled**; the brand icons (our own source) **are** bundled, so `dist/icons.mjs` is ~32 KB. |
| `scripts/add-use-client.mjs` | targets only `dist/index.*` — icons get **no** `"use client"`. Both Lucide and brand icons are plain SVG components with no hooks, so they render in React Server Components. |
| `package.json` `exports` | a `"./icons"` entry with per-condition `types` for ESM **and** CJS (mirrors `./colors`). |
| `check:exports` | `node16`/`bundler` resolve 🟢; the `node10` line is ignored (subpath `exports` are a Node 12.7+ feature — same as `./colors`). |

## Why re-export Lucide, but vendor the brands

**Lucide is re-exported** because it is ~1700 icons and grows: re-exporting keeps the set always
current, tree-shakeable (only imported icons are bundled), and zero-maintenance, while keeping
`lucide-react` out of the core install. Vendoring every Lucide SVG would bloat the source and
require re-syncing on each release; a hard dependency would break the zero-runtime-deps promise for
everyone. The optional-peer re-export gets the convenience without either cost.

**Brand icons are vendored** (baked in) for the opposite reason: there is no maintained
`lucide-react`-style package of brand logos to re-export (Lucide dropped them, and Simple Icons ships
raw SVG data, not React components). The set is small and slow-moving, so a curated, generated,
zero-dependency vendored set is the better trade — and it means brand icons work with **no** peer
dependency at all. The `*Icon` API is identical, so consumers can't tell which half an icon comes
from.

## Documentation surfaces

- **User-facing:** the docs site **Icons** page (`site/src/pages/Icons.jsx`, route `/docs/icons`) —
  install/usage, a live filterable gallery of the Lucide sample + every brand icon (click to copy
  the name), and the props table. Registered in `App.jsx`, `data/site.js` `GETTING_STARTED`, and
  `Search.jsx` `DOC_CMDS`.
- **This file** is the contributor record of how the subpath is wired and generated.
