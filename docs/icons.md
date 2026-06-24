# Icons — the `twico-ui/icons` export

Twico UI's components are **icon-agnostic**: anything that shows an icon takes it as a `ReactNode`
prop (`leftIcon`, `rightIcon`, `icon`, `header`, …), so a consumer can pass inline SVG or any icon
library. For convenience, the **`twico-ui/icons`** subpath re-exports the full
[Lucide](https://lucide.dev) set — the icon language the design system is built around — from one
blessed place.

```jsx
import { Home, Search, Settings } from "twico-ui/icons";
import { Button } from "twico-ui";

<Button leftIcon={<Home size={16} />}>Home</Button>
```

## It's an optional peer — the core stays zero-dependency

`twico-ui/icons` is literally `export * from "lucide-react"` (see `src/icons.ts`). `lucide-react` is
declared as an **optional `peerDependency`**, not a runtime dependency:

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
| `src/icons.ts` | `export * from "lucide-react";` |
| `tsup.config.ts` | a third `entry` (`icons`), and `lucide-react` added to `external` so it is **re-exported, not bundled** (`dist/icons.mjs` is ~100 bytes). |
| `scripts/add-use-client.mjs` | targets only `dist/index.*` — icons get **no** `"use client"`. Lucide icons are plain SVG components with no hooks, so they render in React Server Components. |
| `package.json` `exports` | a `"./icons"` entry with per-condition `types` for ESM **and** CJS (mirrors `./colors`). |
| `check:exports` | `node16`/`bundler` resolve 🟢; the `node10` line is ignored (subpath `exports` are a Node 12.7+ feature — same as `./colors`). |

## Why re-export instead of vendoring

Re-exporting keeps the icon set always current (Lucide is ~1700 icons and grows), tree-shakeable
(only imported icons are bundled), and zero-maintenance, while keeping `lucide-react` out of the
core install. Vendoring every Lucide SVG would bloat the source and require re-syncing on each Lucide
release; a hard dependency would break the zero-runtime-deps promise for everyone. The optional-peer
re-export gets the convenience without either cost.
