# SSR styles — `useScopedStyles`

Every Twico UI component ships its own scoped CSS as a constant string and injects it once, keyed by
a stable id (e.g. `twc-card-styles`). The mechanism lives in one place: **`components/_styles.js`**,
the `useScopedStyles(id, css)` helper.

## The problem it solves (FOUC)

The original mechanism injected CSS client-side via `React.useInsertionEffect`, which **does not run
during server rendering**. So in an SSR framework (Next.js App Router, etc.) the server HTML carried
the component markup but **none of the component styles** — a flash of unstyled content (FOUC) until
React hydrated and the effect ran. Verified: a production SSR render of a page contained zero
`twc-*-styles` `<style>` tags.

## The mechanism

`useScopedStyles(id, css)` is version-aware:

- **React 19+** — returns a hoistable `<style href={id} precedence="twc-ui">{css}</style>`. React
  deduplicates it by `href`, hoists it **out of the component**, and **includes it in the
  server-rendered HTML**, so the styles are present on first paint — no FOUC. The component renders
  the returned node as a child of its root (placement is irrelevant — React hoists it).

  **Where it lands depends on the render tree.** With `<html>/<head>` in the tree — the Next.js App
  Router case, and `renderToPipeableStream` including across a late Suspense boundary — it goes into
  `<head>`, at `head.firstChild`, *ahead of* the app's own `<link rel="stylesheet">` tags. For a
  **fragment** render (`renderToString(<App/>)` into a `<div id="root">`) there is no `<head>` in the
  output, so React emits it as the **first node of the output string** and it stays in `<body>` after
  `hydrateRoot` — hydration is clean either way, and the rule works from `<body>`, but
  `root.firstElementChild` is then the `<style>`. Measured on React 19.2.7.

  **Where it lands decides ties, so a tie is render-mode dependent.** At equal specificity the later
  rule wins. A consumer rule in `<head>` therefore *beats* a sheet hoisted to `head.firstChild`
  (full-document/client render) and *loses* to the same sheet emitted into `<body>` (fragment
  render). Measured both ways with a Tailwind-Typography-shaped `(0,1,0)` selector against
  `.twc-text`:

  | library bracket | sheet in `<head>` first | sheet at the start of `<body>` |
  | --- | --- | --- |
  | `(0,1,0)` | consumer wins | **library wins** |
  | `(0,2,0)` | library wins | library wins |

  This affects **every** scoped sheet in the library equally — it is React's hoisting, not a property
  of any one component — and it is why the #547 typography decision landed on `(0,1,0)` with the
  caveat documented rather than on a doubled class: a consumer who needs a tie settled should
  out-specify by one step (`(0,1,1)` is enough) rather than rely on order. See
  `docs/qa-notes/Text.md` for the full table.
- **React 18** — falls back to the original client-only `useInsertionEffect` injection (deduped by
  element id) and returns `null`. No SSR styles, but **no regression** for React 18 consumers.

```jsx
import { useScopedStyles } from "../_styles.js";

export function Card({ children }) {
  const styles = useScopedStyles("twc-card-styles", CARD_CSS);
  return <div className="twc-card">{styles}{children}</div>;
}
```

## Conventions

- One `useScopedStyles` call per stylesheet id. A few components inject two (e.g. `DatePicker`
  renders `twc-field-styles` **and** `twc-datepicker-styles`); call it twice and render both nodes.
- Overlays (Dialog, Drawer, Menu, Popover, CommandPalette) render the style inside the panel they
  return when open — they aren't SSR-visible when closed, so that's fine.
- The CSS string stays a **constant** (never built from props). Shared ids (the input family's
  `twc-field-styles`) dedupe naturally via React 19's `href` dedup.
- **Critical invariant — a shared id must carry byte-identical CSS everywhere it's used.** React 19
  dedupes hoisted `<style>` by `href` and keeps the **first** content it sees; later renders of the
  same id with **different** content are silently ignored. So if two components share an id but pass
  different CSS, whichever mounts first wins and the other's rules vanish. **#234:** `Input` had stuffed
  its whole `.twc-input` box (border/background/focus) into the shared `twc-field-styles`, whose sibling
  content (DatePicker, …) is the shorter `.twc-field*`-only set — so when a sibling mounted first, the
  input rendered borderless/invisible. Fix: component-specific rules live under a **component-unique** id
  (Input's box moved to `twc-input-extra-styles`); the shared id carries only the identical `.twc-field*`
  rules. Guarded by [`tests/scoped-style-id-dedup.test.js`](../tests/scoped-style-id-dedup.test.js), which
  fails if any id maps to more than one CSS body.
- It is the **one** shared internal import a component may have beyond `react`/`react-dom`.

## Verifying

A server render must contain the `<style>`:

```js
import { renderToString } from "react-dom/server";
import { Card } from "twico-ui";
renderToString(<Card>hi</Card>).includes("<style"); // true on React 19
```

The library's unit tests run on React 19, and the docs-site render-check/interaction gates exercise
every component, so a broken conversion fails CI.

> Introduced in **twico-ui 1.0.1** (converted all 54 style-injecting components from client-only
> `useInsertionEffect` to `useScopedStyles`). The per-component QA notes under `qa-notes/` predate
> this and still describe the old `useInsertionEffect` pattern.

## React 18 vs 19 (SSR FOUC) — #58

Zero-FOUC SSR requires **React 19**: `useScopedStyles` returns a hoistable `<style href precedence="twc-ui">`
that React 19 streams into the server HTML. On the supported **React 18** peer there is no `<style>` hoisting
API, so `useScopedStyles` falls back to a client-only `useInsertionEffect` injection — the SSR markup ships
without the component CSS and it's applied on hydration (a brief FOUC). React-18 SSR (or strict-CSP) users who
need zero-FOUC should either run React 19 or preload the shipped `twico-ui/styles.css` (which already contains
every component's rules concatenated). A per-component static sheet + a `sideEffects`-safe subpath is a
possible future enhancement.

## CSP nonce — #57, #189

Under a strict `style-src 'nonce-…'` policy (no `unsafe-inline`), wrap your app in `<TwicoProvider nonce={n}>`.
`useScopedStyles` reads that nonce from context and stamps it on the **React 18** imperative `<style>`
injection, where the browser honors it.

**React 19 precedence styles do NOT carry the nonce (#189).** React 19 hoists/dedupes `<style precedence>`
tags and *strips* any `nonce` unless the identical value is also supplied as a server **render option** —
which third-party precedence styles cannot arrange in the Next.js App Router. Stamping one there only produced
a console warning per tag (*"React encountered a style tag with `precedence` … and `nonce` …"*) without ever
CSP-allowing the style, so `useScopedStyles` no longer sets it on the hoisted element.

Practical guidance for **React 19 + a nonce-based CSP**: a `nonce` on `style-src` makes the browser ignore
`unsafe-inline`, yet most apps still have inline `style=""` attributes a nonce can't cover — so keep `style-src`
permissive (`'unsafe-inline'`), which already allows twico's hoisted styles. Passing `nonce` to `TwicoProvider`
is then unnecessary, and on React 19 it has no effect on the precedence styles regardless. The nonce still
applies on the React 18 injection path.
