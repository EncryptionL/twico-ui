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
  deduplicates it by `href`, hoists it to `<head>`, and **includes it in the server-rendered HTML**,
  so the styles are present on first paint — no FOUC. The component renders the returned node as a
  child of its root (placement is irrelevant — React hoists it).
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

## CSP nonce — #57

Under a strict `style-src 'nonce-…'` policy (no `unsafe-inline`), wrap your app in `<TwicoProvider nonce={n}>`.
Every `useScopedStyles` reads that nonce from context and stamps it on the injected `<style>` (both the React 19
hoisted element and the React 18 imperative one), so the injected styles are allowed by the CSP.
