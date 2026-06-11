# Twico UI

A **free**, modern, themeable **React** component library — 53 components with **dark mode**, motion, and accessibility built in. No runtime CSS framework required: components are styled with CSS custom properties (design tokens), so they theme by overriding variables and work great alongside Tailwind or plain CSS.

```bash
npm install twico-ui
```

> Requires **React 18+** (`react` and `react-dom` are peer dependencies).

📖 **Documentation, live examples & API reference:** **https://encryptionl.github.io/twico-ui/**

## Framework setup

Twico UI works in any React 18+ app. Every component ships with a `"use client"` boundary, so it drops straight into **Next.js App Router** Server Components without extra wrapping.

### React (Vite / CRA)

Import the stylesheet once at your entry, then use components anywhere:

```jsx
// main.jsx
import "twico-ui/styles.css";
```

```jsx
// App.jsx
import { Button, Datatable } from "twico-ui";
```

### Next.js — App Router (`app/`)

Import the CSS once in the root layout. Components can be used directly in Server **or** Client Components (they self-mark as client):

```tsx
// app/layout.tsx
import "twico-ui/styles.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
```

```tsx
// app/page.tsx  (a Server Component — no "use client" needed)
import { Stat, Button } from "twico-ui";

export default function Page() {
  return (
    <main>
      <Stat label="Revenue" value="$48,200" delta="+12.5%" />
      <Button>Get started</Button>
    </main>
  );
}
```

For dark mode in the App Router, toggle the class on `<html>` from a Client Component (e.g. a theme button) or set it server-side via the `className` on `<html>`.

### Next.js — Pages Router (`pages/`)

Import the CSS once in the custom `_app`:

```tsx
// pages/_app.tsx
import "twico-ui/styles.css";
import type { AppProps } from "next/app";

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
```

### SSR / hydration notes

- Components are **SSR-safe** — nothing touches `window`/`document` during render; all browser access is inside effects and event handlers.
- The global stylesheet (`twico-ui/styles.css`) provides the design tokens, base reset, and self-hosted fonts at first paint. Each component also injects its own scoped CSS on mount, so styles settle immediately after hydration.
- Overlays (Menu, Popover, Select, CommandPalette, Drawer, Dialog) render through React **portals** to `document.body` only while open, so they never run on the server.

## Quick start

Import the stylesheet **once** at your app root, then use any component:

```jsx
import "twico-ui/styles.css";
import { Button, Datatable, Input, Switch } from "twico-ui";

export default function App() {
  return (
    <div style={{ padding: 24 }}>
      <Input label="Email" placeholder="you@example.com" />
      <Button>Save changes</Button>

      <Datatable
        rows={[
          { id: 1, name: "Jane Cooper", role: "Admin", mrr: 480 },
          { id: 2, name: "Wade Warren", role: "Editor", mrr: 48 },
        ]}
        rowKey={(r) => r.id}
        columns={[
          { field: "name", headerName: "Member", width: 200 },
          { field: "role", headerName: "Role", valueOptions: ["Admin", "Editor"] },
          { field: "mrr", headerName: "MRR", type: "number", valueFormatter: (v) => `$${v}` },
        ]}
      />
    </div>
  );
}
```

## Dark mode

Dark tokens live on the document root. Add `class="dark"` (or `data-theme="dark"`) to `<html>`:

```js
document.documentElement.classList.toggle("dark");
```

Everything — including portaled menus, popovers, and the command palette — re-themes together.

## Theming

All visuals derive from CSS custom properties. Override them in your own CSS to rebrand without touching components:

```css
:root {
  --color-primary: #7c3aed;        /* brand color */
  --radius-md: 10px;               /* corner radius */
  --font-sans: "Inter", sans-serif;/* typeface */
}
```

See `styles/twico-ui.css` for the full token set (colors, typography, spacing, radius, motion). The bundled stylesheet also self-hosts the default fonts (Plus Jakarta Sans + JetBrains Mono, OFL) under `twico-ui/styles/fonts/`.

## Components

**Buttons & actions:** Button, IconButton
**Inputs:** Input, Textarea, Currency, CurrencyField, Select, MultiSelect, Combobox, Checkbox, Radio, Switch, Slider, Rating, FileUpload, DatePicker, DateRangePicker, ColorPicker
**Data display:** Card, Avatar, AvatarMenu, Badge, Tag, Stat, List, Timeline, Chart, Table, Pagination, Datatable, Kanban
**Navigation:** Tabs, Accordion, Breadcrumb, Stepper, Navbar, Sidebar, TreeView
**Overlay:** Tooltip, Popover, Menu, Dialog, Drawer, CommandPalette
**Feedback:** Alert, Spinner, Progress, Skeleton, Toast (+ ToastViewport), EmptyState, Divider, Carousel

Every component ships full TypeScript types (e.g. `import type { DatatableProps } from "twico-ui"`).

## Building & publishing (maintainers)

This repo is both the Twico UI **design system** and the source of the npm package. The published package contains only the built output (`dist/` + `styles/`).

```bash
npm install          # install build tooling (tsup, typescript)
npm run build        # bundle src/index.ts -> dist (ESM + CJS + .d.ts)
npm publish          # prepublishOnly runs the build automatically
```

- `src/index.ts` is an auto-generated barrel that re-exports every component from `components/`.
- `tsup` bundles the JSX to `dist/index.mjs` / `dist/index.cjs` and rolls the hand-written `.d.ts` props contracts into `dist/index.d.ts`.
- A post-build step (`scripts/add-use-client.mjs`) prepends the `"use client"` directive to the bundles (a tsup `banner` is stripped by esbuild), so the package imports cleanly into Next.js App Router Server Components.
- `react` / `react-dom` stay external (peer deps).

See [`DESIGN-SYSTEM.md`](./DESIGN-SYSTEM.md) for the full design guide (tokens, voice, visual foundations, iconography).

### Branching & releases

Twico UI follows **[semantic versioning](https://semver.org/)** (`MAJOR.MINOR.PATCH`):

- **`dev`** — the integration branch. All day-to-day work happens here or on `feat/*` / `fix/*` branches that merge into it. Every push and PR runs **CI** (`.github/workflows/ci.yml`): type-check, build, and an assertion that the `"use client"` banner survived bundling.
- **`main`** — the release branch. It is the **only** branch wired to publish (`.github/workflows/publish.yml`). Merging `dev → main` triggers a release.

To cut a release:

1. On `dev`, bump the version in `package.json` per semver (`patch` = fixes, `minor` = new components/props, `major` = breaking changes).
2. Open a PR from `dev` into `main` and merge it.
3. The publish workflow builds, publishes to npm with provenance, and tags the commit `vX.Y.Z`. It is **idempotent** — if `package.json`'s version is already on npm, the publish step is skipped, so an accidental merge without a version bump never errors.

> Publishing requires an `NPM_TOKEN` repository secret (an npm automation token with publish rights).

## License

MIT © Twico UI. Free for any use — personal or commercial.
