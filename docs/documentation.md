# Documentation policy

**Every change to this project — even the smallest — must be documented in `/docs`.**

This is a hard rule (CLAUDE.md §4.1). Documentation is part of "done," not an afterthought.

## Where documentation lives

| Audience | Location | Examples |
| --- | --- | --- |
| **Contributors / maintainers** (how & why the project works) | **`/docs`** (this directory) | architecture, build, releases, security, decisions |
| **End users** (how to use the components) | the **docs website**, `site/` | component API, props, live examples, installation, theming |
| **At-a-glance** | root `README.md` | install, quick start, links |
| **Design language** | `DESIGN-SYSTEM.md` | tokens, voice, visual foundations |
| **Auto-generated** | `CHANGELOG.md` | release history (do not edit by hand) |

## What to document, and where

| You changed… | Update… |
| --- | --- |
| A component's props/behavior | its `.d.ts` + `.prompt.md`, the docs-site entry (`site/src/data/components.js` + `demos/`), and a note in the relevant `/docs` file |
| Added a component | the above + `docs/architecture.md` inventory if structure changed |
| Build / tooling | `docs/architecture.md` and/or `docs/development.md` |
| Release / versioning | `docs/releases.md` |
| Security / dependencies / a vulnerability fix | `docs/security.md` and `SECURITY.md` |
| The docs website | `docs/docs-site.md` and `site/README.md` |
| Anything not covered by an existing doc | **create a new `/docs/*.md`** and link it from `docs/README.md` |

## Rules

1. **Keep `docs/README.md` (the index) current** — every doc file is linked there.
2. **Prose explains *why*, not just *what*.** Capture the reasoning behind non-obvious decisions
   (e.g. why `"use client"` is added post-build, why fonts are self-hosted).
3. **No CDNs, no secrets** in docs. Use relative links between docs.
4. **Conventional Commit** docs-only changes as `docs:` (these do not cut a release).
5. If a change touches behavior, the docs change ships **in the same commit/PR** as the code.
