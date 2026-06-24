# Twico UI — examples

Real, runnable web apps built with the [`twico-ui`](https://www.npmjs.com/package/twico-ui)
component library. Each example is a **self-contained project** (its own `package.json`) that
installs `twico-ui` from npm and shows it used in a realistic application — not a component gallery.

| Example | Stack | What it shows |
| --- | --- | --- |
| [`nextjs-dashboard/`](./nextjs-dashboard) | Next.js 16 (App Router) · React 19 · TypeScript | A full admin dashboard using Twico UI across every area (layout, data display, inputs, overlays, feedback), with **authentication** (signed-cookie session) and **authorization** (role-based access control) enforced server-side. |

_More examples will live here over time (e.g. a marketing site, an e‑commerce storefront, a
settings/account app)._

## Running an example

Each example is independent — `cd` into it and use its own scripts:

```bash
cd examples/nextjs-dashboard
npm install
npm run dev
```

See each example's own `README.md` for demo credentials, structure, and notes.

> These projects are **not** part of the published `twico-ui` npm package (the tarball only ships
> `dist/` + `styles/` + `llms.txt`). They live in the repo for reference and are excluded from the
> library build, tests, and release.
