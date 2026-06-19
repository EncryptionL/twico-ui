# `llms.txt` — the AI usage guide

`llms.txt` is a single, self-contained Markdown file that teaches an AI assistant how to **write
application code with the `twico-ui` npm package** — setup, conventions (theming, dark mode,
controlled/uncontrolled, overlays, toasts, icons), and an exact, per-component + per-hook API
reference with copy-paste examples.

> **Audience.** This is for an AI (or human) consuming the **published package**. It is distinct from
> [`SKILL.md`](../SKILL.md) + [`DESIGN-SYSTEM.md`](../DESIGN-SYSTEM.md) + `_ds_bundle.js` /
> `_ds_manifest.json`, which package the **design system** for AI tooling that generates static HTML
> design mockups (`window.TwicoUiDesignSystem_*`, Lucide-from-CDN). `llms.txt` is about real React code.

## It is generated — do not edit `llms.txt` by hand

`scripts/gen-llms.mjs` builds it from the project's own sources of truth so the API can never drift:

| Part | Source |
| --- | --- |
| Guidelines preamble (setup, theming, conventions) | `scripts/llms-preamble.md` (**hand-authored** — edit this) |
| Component reference (summary, props, snippet) | `site/src/data/components.js` (generated from each `.d.ts`) |
| Group order | `site/src/data/site.js` (`GROUP_ORDER`) |
| Hooks (description + signature) | `hooks/index.d.ts` |
| Version stamp | `package.json` |

The per-component **Props** lists deliberately omit the generic inherited DOM props that
`enrich-props.mjs` appends (`onClick`/`onFocus`/`id`/`style`/`…`/`...rest`) — they are matched by
their canonical descriptions and dropped, and the preamble states the `...rest` convention once.
Meaningful props that happen to be DOM-derived (`disabled`, `placeholder`, `onChange`, `href`, …)
are kept.

## Outputs

`gen-llms.mjs` writes **two identical copies**:

- `llms.txt` at the repo root — shipped in the npm tarball (it's in `package.json` `files`), so it
  lands at `node_modules/twico-ui/llms.txt`, and visible on GitHub.
- `site/public/llms.txt` — served by the docs site at `https://encryptionl.github.io/twico-ui/llms.txt`.

## Commands

```bash
npm run gen:llms          # regenerate both copies
npm run gen:llms:check    # exit 1 if either is stale (the CI guard)
```

`prepublishOnly` regenerates it before publish, and `ci.yml` runs `gen:llms:check` so a stale
`llms.txt` fails CI — same pattern as `build:css:check`, `verify:palette`, and the docs-site
`--check` guards.

## When you change the API

`llms.txt` derives from `site/src/data/components.js`, so the order of operations when you add or
change a component is:

1. Update the component (`.jsx` / `.d.ts` / `.prompt.md`) and `src/index.ts`.
2. Regenerate the component reference (`site/scripts/gen-docs.mjs`) + `node site/scripts/enrich-props.mjs`.
3. `npm run gen:llms` and commit the refreshed `llms.txt` (+ `site/public/llms.txt`).

To change the **guidelines** (install steps, conventions, examples) rather than the API, edit
`scripts/llms-preamble.md` and re-run `npm run gen:llms`.
