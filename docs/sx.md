# The `sx` style prop

Under the library's no-className policy, inline `style` is the only styling channel consumers have —
but inline style **cannot** express `:hover`/`:focus-visible`, `::placeholder`, or media/container/
supports queries. The `sx` prop (#53) fills that gap on the layout & typography primitives.

```tsx
<Box
  sx={{
    padding: 20,                                   // flat  → inline style
    color: "var(--color-text)",                    // use tokens for values
    "&:hover": { color: "var(--color-primary)" },  // nested selector → scoped stylesheet
    "&::placeholder": { color: "var(--color-text-subtle)" },
    "@media (min-width: 600px)": { display: "none" },
  }}
/>
```

**Phase 1 coverage:** `Box`, `Stack`, `Grid`, `Container` (layout), `Text`, `Heading` (typography),
and `Card`. `components/_sx.js` is the reusable substrate for threading `sx` through the rest of the
components in a later pass.

## How it works

`useSx(sx)` (in [`components/_sx.js`](../components/_sx.js), internal — **not** exported from the
public hooks barrel) splits the object into two channels:

| Key kind | Example | Where it goes |
| --- | --- | --- |
| Flat CSS property | `padding: 20` | Merged into the element's **inline `style`**, last — so it wins over the component's base style *and* a user-supplied `style` (matching MUI precedence). |
| Nested key (value is an object, or key starts with `&` / `:` / `@`) | `"&:hover": {...}`, `"@media …": {...}` | Compiled to CSS scoped under `[data-twc-sx="<uid>"]` and injected via `useScopedStyles`. |

The per-instance `uid` comes from `React.useId()`; the scoped `<style>` is only rendered when there
are nested rules, and `data-twc-sx` is only set then. Because injection goes through
`useScopedStyles`, the scoped stylesheet automatically:

- **is included in the SSR stream on React 19** (hoistable `<style precedence>`) — no FOUC;
- **inherits the CSP nonce** from `TwicoProvider` (#57);
- **updates in place** when `sx` changes (React 18 fallback path handles dynamic `sx`).

## Compiler rules (`compileSx`)

- **camelCase → kebab-case** (`marginTop` → `margin-top`); custom properties (`--x`) pass through.
- **Numbers get `px`** except an allowlist of unitless properties (`opacity`, `zIndex`, `fontWeight`,
  `lineHeight`, `flex`, `order`, `zoom`, the `grid*`/`*Opacity`/`stroke*` families, …) and `0`.
- **`&`** in a selector key is replaced by the scope; a key starting with `:` is appended to the
  scope (`":hover"` → `[data-twc-sx="…"]:hover`); any other selector nests as a descendant
  (`".child"` → `[data-twc-sx="…"] .child`).
- **`@`-rules** (`@media` / `@supports` / `@container`) wrap the re-scoped inner block.
- Recurses, so nested rules can themselves contain selectors and declarations.

## Precedence

`base style → user style → sx flat` (later wins). Nested `sx` rules live in a stylesheet at
specificity `[data-twc-sx]` + the selector suffix, so they beat the component's own class rules but
lose to any inline value — which is why **flat `sx` must be inline**, not in the stylesheet.

## Use tokens

Prefer design tokens for values so `sx` overrides stay theme-aware:
`color: "var(--color-primary)"`, `padding: "var(--space-4)"`, `borderRadius: "var(--radius-lg)"`.

## Verification

- Runtime + compiler unit tests: [`tests/sx.test.jsx`](../tests/sx.test.jsx) (flat-overrides-base,
  scoped `:hover`, `@media` wrapping, `data-twc-sx` gating, SSR markup includes the `<style>`).
- Type fixture: [`tests/types/sx-types.tsx`](../tests/types/sx-types.tsx). The `Sx` type is
  `React.CSSProperties` widened with a string-indexed nested signature; exported from the root.
