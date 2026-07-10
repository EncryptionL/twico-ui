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

**Which components accept `sx`** (#221): the primitives that render a **single styleable root
element** — `Box`, `Stack`, `Grid`, `Container` (layout), `Text`, `Heading` (typography), and `Card`.
That set is the exported **`WithSx`** type (`{ sx?: Sx }`), so the boundary is discoverable in
TypeScript, not just prose. Multi-element composites (Input, Select, Combobox, MultiSelect, Dialog, …)
intentionally **omit** `sx`: they render wrapper + label + control + hint (or backdrop + panel), so a
single `sx` target would be ambiguous — styling them cleanly needs an explicit per-slot API (out of
scope). `components/_sx.js` (`useSx`) is the element-agnostic substrate, so extending the set to
another **single-root** component is mechanical (thread `useSx` like `Text` does, and `extends WithSx`).

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
- **follows the CSP-nonce behavior** of `useScopedStyles` (#57/#189: the nonce is stamped on the
  React 18 injection; React 19 precedence styles omit it — see [ssr-styles.md](./ssr-styles.md));
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

## Box-model shorthand normalization (#188)

Flat `sx` box-model **shorthands** are expanded to their physical/logical **leaf longhands** before
they reach the inline `style`. The primitives already emit longhands (`paddingTop`, `marginLeft`, …)
for their own `p`/`m`/`px`/… props, so a shorthand *and* its longhands on the same node made React
warn on rerender (*"Removing a style property during rerender (padding) when a conflicting property is
set (paddingBottom)…"*). Expanding up front keeps the terse API and emits only leaves, so the warning
can't fire. Nested `sx` (the scoped-`<style>` channel) is emitted as CSS text and is **not** normalized
— it is never reconciled as inline style, so it can't trip the warning.

| Shorthand | Expands to |
| --- | --- |
| `padding` / `margin` / `inset` | `…Top/Right/Bottom/Left` (`inset` → `top/right/bottom/left`), by the CSS 1–4-value rule: `"a"`→all, `"a b"`→[block, inline], `"a b c"`→[top, inline, bottom], `"a b c d"`→[T,R,B,L] |
| `paddingBlock` / `paddingInline` / `marginBlock` / `marginInline` | logical `…Start/…End` (1 value → both, 2 → `[start, end]`) |

- **Numbers stay numeric** (`padding: 20` → `paddingTop: 20`, …) so React still appends `px`.
- **`calc()`/`var()`/`clamp()` are safe** — the value splitter ignores whitespace inside parentheses,
  so `padding: "calc(1rem - 2px) 0"` splits into two tokens, not four.
- **Source order wins** — a longhand written *after* a shorthand overrides it (`{ padding: 8,
  paddingTop: 30 }` → top is `30px`); one written *before* is overwritten. Matches CSS cascade.
- Only the box-model shorthands above are touched; every other property passes through unchanged.
- **Invariant.** For the fix to hold, no box *shorthand* may survive on the node from the **base**
  style either — otherwise it would collide with an sx-expanded longhand. Box/Stack/Grid already
  base-style with longhands; Container's `marginInline`/`paddingInline` and Text/Heading's `margin: 0`
  were converted to their longhands so the node only ever carries leaf longhands.
- **Caveat: the raw `style` prop is not normalized.** `sx` only normalizes its own channel. If you
  *also* pass a box shorthand via the raw `style` prop (`style={{ padding: "1rem" }}`) alongside an
  `sx` box value for the same box, that shorthand can still collide with the expanded longhands on
  rerender — normalizing a consumer's explicit `style` would be overreach. Prefer `sx` (or longhands)
  for box spacing you set via `style`.

## Precedence

`base style → user style → sx flat` (later wins). Nested `sx` rules live in a stylesheet at
specificity `[data-twc-sx]` + the selector suffix, so they beat the component's own class rules but
lose to any inline value — which is why **flat `sx` must be inline**, not in the stylesheet.

## Use tokens

Prefer design tokens for values so `sx` overrides stay theme-aware:
`color: "var(--color-primary)"`, `padding: "var(--space-4)"`, `borderRadius: "var(--radius-lg)"`.

## Verification

- Runtime + compiler unit tests: [`tests/sx.test.jsx`](../tests/sx.test.jsx) (flat-overrides-base,
  scoped `:hover`, `@media` wrapping, `data-twc-sx` gating, SSR markup includes the `<style>`,
  box-model shorthand → longhand normalization).
- Type fixture: [`tests/types/sx-types.tsx`](../tests/types/sx-types.tsx). The `Sx` type is
  `React.CSSProperties` widened with a string-indexed nested signature; exported from the root.
