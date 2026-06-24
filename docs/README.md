# Twico UI — developer documentation

This directory is the **developer/contributor record** for the project: how it's built, released,
secured, and documented. (End-user API docs with live examples live on the **docs website**,
`site/` → https://encryptionl.github.io/twico-ui/.)

> **Policy:** every change to this project — even the smallest — must be reflected here.
> See [documentation.md](./documentation.md).

## Index

| Doc | What it covers |
| --- | --- |
| [architecture.md](./architecture.md) | Repo structure, the three parts (package / design system / docs site), build pipeline, component model. |
| [ssr-styles.md](./ssr-styles.md) | The `useScopedStyles` helper — how components render scoped CSS into the SSR output (no FOUC) on React 19, with a React 18 fallback. |
| [development.md](./development.md) | Local setup, commands, adding or changing a component, conventions. |
| [releases.md](./releases.md) | Automated semantic-versioning, Conventional Commits, `dev → main` flow, version sync, npm publishing. |
| [security.md](./security.md) | Security standards: URL sanitization, the no-CDN rule, dependency auditing, CodeQL, Dependabot. |
| [docs-site.md](./docs-site.md) | How the documentation website works, regenerating it, deploying to GitHub Pages, the render-check. |
| [hooks.md](./hooks.md) | The exported React hooks API — where it lives, the full set, conventions, how to add one. |
| [colors.md](./colors.md) | The `twico-ui/colors` JS export, the primitive↔semantic split, the drift guards (`tests/colors.test.js` + `verify:palette`), and the MUI-style Color docs page. |
| [tone-variant-system.md](./tone-variant-system.md) | The library-wide `tone` × `variant` model: the `--_accent` pattern, which components have which axis, and how to extend it. |
| [prop-conventions.md](./prop-conventions.md) | The standard prop vocabulary (size/tone/variant/value/onChange/items/overlay/label/…) every component follows. |
| [datatable.md](./datatable.md) | Datatable advanced features — opt-in row virtualization, keyboard row reorder, and ARIA menu semantics. |
| [ai-guide.md](./ai-guide.md) | `llms.txt` — the generated AI usage guide for consumers; how it's built from the component/hook API, where it ships, and the drift guard. |
| [examples.md](./examples.md) | The `examples/` apps (e.g. the Next.js auth + RBAC dashboard) — how they consume the npm package and why they're isolated from the library build/tarball. |
| [documentation.md](./documentation.md) | The "document everything in `/docs`" policy — what, where, when. |
| [design-suggestions.md](./design-suggestions.md) | Reviewed-but-not-yet-implemented proposals (component API, visual, site, infra) to pick up later. |
| [qa-notes/](./qa-notes/) | Per-component QA review notes plus the pre-publish audit ([publish-audit.md](./qa-notes/publish-audit.md)) and the copy-paste example-snippet audit ([examples-audit.md](./qa-notes/examples-audit.md)). |

## At a glance

- **Package:** `twico-ui` — 61 React components + a 24-hook API (incl. useToast), zero runtime dependencies, MIT.
- **Build:** `tsup` (`src/index.ts` → `dist/` ESM+CJS+`.d.ts`) + a `"use client"` post-build step.
- **Releases:** automated by semantic-release on every push to `main`.
- **Docs site:** Vite + React, dogfoods the library, deployed to GitHub Pages.
- **Security:** 0 consumer-facing vulnerabilities, no CDNs, CodeQL + Dependabot, least-privilege CI.
