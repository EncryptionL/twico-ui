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
| [development.md](./development.md) | Local setup, commands, adding or changing a component, conventions. |
| [releases.md](./releases.md) | Automated semantic-versioning, Conventional Commits, `dev → main` flow, version sync, npm publishing. |
| [security.md](./security.md) | Security standards: URL sanitization, the no-CDN rule, dependency auditing, CodeQL, Dependabot. |
| [docs-site.md](./docs-site.md) | How the documentation website works, regenerating it, deploying to GitHub Pages, the render-check. |
| [documentation.md](./documentation.md) | The "document everything in `/docs`" policy — what, where, when. |

## At a glance

- **Package:** `twico-ui` — 53 React components, zero runtime dependencies, MIT.
- **Build:** `tsup` (`src/index.ts` → `dist/` ESM+CJS+`.d.ts`) + a `"use client"` post-build step.
- **Releases:** automated by semantic-release on every push to `main`.
- **Docs site:** Vite + React, dogfoods the library, deployed to GitHub Pages.
- **Security:** 0 consumer-facing vulnerabilities, no CDNs, CodeQL + Dependabot, least-privilege CI.
