# Examples (`examples/`)

Runnable, real-world apps that consume the **published `twico-ui` npm package** — proof the library
works in a real stack, and a learning resource for users. Index: [`examples/README.md`](../examples/README.md).

## How examples relate to the library

Each example is a **self-contained project** (its own `package.json`, `package-lock.json`,
`node_modules`, `private: true`) that does `import { Button } from "twico-ui"` against the **npm
release** — not the local source (unlike `site/`, which aliases to `src/`). So an example reflects
exactly what a consumer gets, and is pinned to a `twico-ui` version.

**Examples are repo-only and cannot break the library:**

| Concern | Why examples are excluded |
| --- | --- |
| npm tarball | `package.json` `files` is an allowlist (`dist` + `styles` + `llms.txt` + `README` + `LICENSE`). `examples/` never ships. |
| Library build | `tsup` builds from `src/index.ts`; it never reaches `examples/`. |
| Root typecheck | `tsconfig.json` `include` is `["src", "components/**/*.d.ts"]`. |
| CDN guard | `ci.yml` greps only `components src styles tokens base.css`. |
| `size` / `check:exports` | Operate on `dist/`. |

`ci.yml` has no path filter, so it still **runs** on a push that touches `examples/` — but every step
targets the library, so an example can't fail CI. Each example is verified **on its own** with its
own `npm run build` / `npm run typecheck`.

## Current examples

- **[`nextjs-dashboard/`](../examples/nextjs-dashboard)** — Next.js 16 (App Router) + React 19 +
  TypeScript admin dashboard. Uses Twico UI across every area (layout, data display, inputs,
  overlays, feedback, theming) and implements **authentication** (signed-cookie JWT session via
  `jose` + an Edge proxy) and **authorization** (RBAC: `Role` → `Permission` via `can()`, enforced
  in the Edge proxy + per-page `requirePermission` + UI gating). Three demo roles (admin/manager/member).
  See its [README](../examples/nextjs-dashboard/README.md).

## Adding an example

1. Create `examples/<name>/` with its own `package.json` (`"private": true`) and install
   `twico-ui` from npm (plus the framework deps). Add a local `.gitignore` (`node_modules`, build output).
2. Build the app against the real API — the [`llms.txt`](./ai-guide.md) AI guide and the
   [docs site](https://encryptionl.github.io/twico-ui/) are the references.
3. **Verify it builds on its own** (`npm install && npm run build`) before committing.
4. Add a row to [`examples/README.md`](../examples/README.md) and the list above. Commit with a
   release-neutral type (`docs(examples): …` or `chore(examples): …`).
