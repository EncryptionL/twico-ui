# QA notes — Heading

- **Group:** typography
- **Status:** open
- **Reviewed:** 2026-06-17

## Open issues
- [ ] **[P2] RTL / alignment API** — `align` is forwarded verbatim to `textAlign`, and the docs-site Variations teach the *physical* values `"left"`/`"right"` (`HeadingVariations.jsx:50-52`). Under `dir="rtl"` a heading authored with `align="left"` stays visually left instead of mirroring, so consumers who follow the demo get LTR-locked alignment. The component itself is fine (it passes whatever is given), but the typed surface + docs steer users to non-logical values. _Fix:_ in the demo and the `.d.ts`/prompt, prefer the logical keywords `"start"`/`"end"` (e.g. `<Heading align="start">`), and add a one-line note that `align` accepts logical values for RTL safety. `components/typography/Heading.d.ts:11`, `site/src/demos/HeadingVariations.jsx:50`

- [x] **[#473] `align` had no doc comment and the demo taught `left`/`right`** - the only props in the Heading/Text interfaces without JSDoc, so nothing pointed consumers at the logical keywords, while HeadingVariations demonstrated the physical ones by example: copy that snippet into an app that later adds `dir="rtl"` and the headings stay pinned left while the body text mirrors. Both props now carry a one-line JSDoc preferring `start`/`end`, and the demo was switched to `start`/`center`/`end` (site generators re-run). The component itself was always correct - it forwards whatever it is given. `Heading.d.ts:21` - fixed 2026-10-07

## Verified OK
- `level` (1–6) maps to both the semantic tag (`h${level}`) and the default size via `LEVEL_SIZE`, and `as` cleanly overrides the rendered tag while `size` overrides the visual size — the "render an h1 at a small size" case works as documented (`Heading.jsx:24-25`, `HeadingVariations.jsx:42`).
- `LEVEL_SIZE` has a fallback (`|| "2xl"`) and `sz` defaults to `"2xl"` if `size` is falsy, so an out-of-range/invalid `level` cannot produce an undefined `--text-undefined` var (`Heading.jsx:25`).
- `href` sanitization is correctly gated on `Tag === "a"` so a heading rendered `as="a"` blocks `javascript:`/`data:`/`vbscript:` schemes before they hit the DOM; mutating the freshly-spread `rest` object (not shared props) is safe (`Heading.jsx:26`).
- SSR-safe: no `window`/`document` access at module or render scope; pure render.
- Since #543 it renders one scoped stylesheet (`.twc-heading { margin: 0 }`, id `twc-heading-styles`); the rest of the styling is still inline + token vars. Still no hydration mismatch, for a different reason: React 19 hoists that `<style>` to `<head>` **in the SSR stream**, and React 18 renders nothing server-side and injects it imperatively — so the two sides agree either way. See the section below.
- No motion, no portal, no focus management — nothing for reduced-motion to affect.
- Inline `style` is spread last after the token defaults (`...style` at `Heading.jsx:39`), so consumer overrides win as expected; `align` being `undefined` simply omits `textAlign`.


---

## #543 — the margin reset moved out of the inline style object

`Heading` reset its UA margins with four **inline** declarations (`marginTop/Right/Bottom/Left: 0`).
An inline declaration beats every stylesheet rule whatever its specificity, so that reset could not
be overridden by **anything** — not a consumer's CSS, not a `className`, and not the library itself.

The library is what was being blocked. `FieldRow`'s fragment-cell lane (#531) is a
`margin-block-end` on the cell's lane-less child, so a `Heading` between two inputs in a range row sat
one lane (24px) below its siblings' control boxes on the wrapping path, with its computed
`margin-block-end` reading `0px` instead of the `calc()` the rule asked for. Measured at 520px,
760px and at the default floor: 24px each time, and 0px after.

It is now `.twc-heading { margin: 0; }` in a scoped stylesheet (`twc-heading-styles`):

- **`Pre` already did it this way**, so this is the in-house pattern, not a new one — and §5 says
  each component renders its own scoped CSS.
- `base.css` already carries `p { margin: 0 }` and `h1, h2, … { margin: 0 }`, so the inline copies
  were redundant for anyone importing `twico-ui/styles.css` — i.e. everyone, since without it there
  are no design tokens either. Keeping a scoped rule rather than relying on that keeps the component
  self-contained.
- At `(0,1,0)` it still wins a tie against the element reset and still loses to any rule that
  *means* to move it. **A consumer's own CSS now works where it previously could not.**

**What else is still inline, accurately.** The first version of this note claimed the remaining
declarations "carry prop values" and that "only the constant moved". That is wrong, and wrong in the
direction that matters: it describes the defect class as closed when it is not.

| | prop-derived (a stylesheet cannot express these) | **constant, and still inline** |
| --- | --- | --- |
| `Text` | `font-size` (`size`), `color` (`tone`), `font-weight` (`weight`), `text-align` (`align`), the `truncate`/`lineClamp` block | `font-family: var(--font-sans)`, `line-height: 1.6` |
| `Heading` | `font-size` (`level`/`size`/`display`), `text-align` (`align`), the `truncate`/`lineClamp` block | `font-family: var(--font-sans)`, `font-weight: var(--font-bold)`, `color: var(--color-text)`, `line-height: 1.2`, `letter-spacing: -0.02em` |

`Heading` has **no `tone`, `color` or `weight` prop** — the original list was `Text`'s pasted onto it.

Those seven constants are **exactly as un-overridable by any stylesheet as the margin was**, which is
the defect class #543 is named after. #543 fixed the one case where the library was vetoing *itself*
(FieldRow's lane); it did not fix the class. So `.twc-heading { font-weight: 500 }` in a consumer's CSS
still does nothing, and this note previously implied otherwise. Tracked separately rather than
widened here, because moving a *visual* constant changes what third-party CSS can do to every
`Heading` on a page — a public-API decision, not a cleanup.

`...style` is still spread after the base declarations, so the `style` prop escape hatch is
unchanged (asserted).

**The `<style>` does not land inside the element.** `<style>` is metadata content and `<h1>…<h6>`
accepts only phrasing content, so an always-on style child would be invalid HTML. On React 19
`useScopedStyles` returns a hoistable `<style href precedence>` that React lifts to `<head>`,
including in the SSR stream; on React 18 it returns `null` and injects imperatively. Either way the
element carries no style child, and the rule reaches `<head>` **once** across every instance
(deduped by id) — both asserted in
[`tests/issue-543-typography-margin-reset.test.jsx`](../../tests/issue-543-typography-margin-reset.test.jsx).

Validated by reverting one inline `marginBottom: 0`: all three wrap cases return to 24px, and the
band path stays at 0px — which is also the proof that the band path never depended on the margin.

**One measurable shape change.** On React 19 the hoistable `<style>` is a rendered child, so an
`as={SomeComponent}` that introspects its children sees one more entry:
`React.Children.toArray(children).length` goes 1 → 2 for `<Heading as={Spy}>c</Heading></`, and
`React.Children.count` 2 → 3. `React.Children.only` threw before and still throws, so that path is
unchanged, and no component in this library renders `Heading`, so the exposure is consumer-side and
only for `as={Component}` *plus* children introspection. Measured on react 19.2.7.

## #547 — the class is closed, at (0,1,0)

#543 moved the **margin** reset out of the inline style object. #547 moved the rest: all seven
constants across `Text` and `Heading` now live in each component's own scoped stylesheet, and the
style attribute carries **only prop-derived declarations**.

| | before #547 | after |
| --- | --- | --- |
| `Text` inline | `color`, `font-family`, `font-size`, `line-height` | `color` (`tone`), `font-size` (`size`) |
| `Heading` inline | `color`, `font-family`, `font-size`, `font-weight`, `letter-spacing`, `line-height` | `font-size` (`level`/`size`/`display`) |

Every remaining inline declaration demonstrably follows a prop — asserted, not asserted-about.
`...style` is still spread last, so the `style` prop escape hatch is unchanged.

**Values did not change.** Measured, not claimed: 29 typography shapes — the default, every
polymorphic `as`, every prop that sat beside a moved constant, nested `Text`, the `style`-prop
override, and both inside a consumer wrapper class — rendered from the published 1.52.0 bundle and
from this one and compared computed-style for computed-style across 17 properties plus box size.
**0 differing.**

### Why (0,1,0) and not a doubled class

A four-position judge panel ranked `(0,1,0)` first, and the deciding evidence was a measurement
rather than specificity arithmetic. At equal specificity the later rule wins, and **React puts a
hoisted sheet in a different place depending on how the app renders** — `head.firstChild` for a
full-document render or a client render, the start of `<body>` for a fragment `renderToString`. So
the lowest consumer specificity that overrides *deterministically*, in both arrangements:

| library bracket | consumer (0,0,1) | (0,1,0) | (0,1,1) | (0,2,0) | (0,2,1) |
| --- | --- | --- | --- | --- | --- |
| **(0,1,0)** `.twc-heading` | never | **depends on render mode** | **always** | always | always |
| (0,2,0) `.twc-heading.twc-heading` | never | never | never | depends | **always** |

`(0,2,0)` would mean a consumer cannot override with ordinary CSS at all — `.prose p` *never* wins —
which trades "unoverridable by anything" for "unoverridable by anything reasonable" and recreates
the #543 defect one specificity step up. `(0,1,0)` lets the normal form work deterministically.

Both brackets keep criterion 1: FieldRow's fragment-cell lane at `(0,3,0)` wins either way
(measured, `margin-bottom: 24px`).

### Three things the panel changed about the shape

- **`font-family` is deleted, not relocated.** `base.css` sets it on `body`, so it reaches every
  `as` tag by **inheritance** — and an inherited value loses to *any* matching rule, where a class
  rule at `(0,1,0)` blocks one. Measured: with the class rule a consumer's
  `.content { font-family: Georgia }` is **blocked**; with it deleted, Georgia wins. With no
  stylesheet loaded at all both are identical (`Times New Roman`), because an undefined `var()` is
  invalid at computed-value time and `font-family` inherits regardless — so deletion costs nothing
  even for a consumer who skips `twico-ui/styles.css`. All three judges named this as the best idea
  in the panel, and it is the one place where *deleting* beats any bracket.
- **Heading's `font-weight`, `color`, `line-height` and `letter-spacing` cannot be deleted**, even
  though `base.css` sets them: it sets them on `h1..h6` **by tag**, and `Heading` is a class. A
  `<Heading as="div">` or `as="p"` would lose them and render as body text. `as=` is the constraint,
  and the library's own site ships `<Heading as=…>`.
- **The `sx` promise is load-bearing on render order.** `docs/sx.md` promises nested `sx` rules beat
  the component's own class rules. They are *also* `(0,1,0)` — `sx` scopes nested blocks to
  `[data-twc-sx="uid"]`, and an attribute selector is class-grade — so the winner is source order
  inside the shared `twc-ui` precedence group. The components render `{__twcStyles}` **before**
  `{styleNode}`, which is what makes the promise true: measured, base-then-sx gives `line-height: 48px`
  (sx wins) and sx-then-base gives `25.6px` (sx loses). A test pins that order, validated by swapping
  the two nodes and watching it fail. Before #547 this did not arise for these properties, because an
  inline declaration beat both sheets.

### The honest caveat, corrected

#547 originally stated that at `(0,1,0)` a consumer rule "now wins on source order". That is **only
true for one of the two render modes** — the probe shows the library winning in a fragment render,
because the sheet lands in `<body>`, after everything in `<head>`. So the `(0,1,0)` band is
**render-mode dependent**, and that is a property of React's style hoisting shared by all of this
library's scoped sheets, not something this component can fix. `@tailwindcss/typography` v0.5 wraps
its generated element selectors in `:where()`, so *all* of its rules land in exactly that band.

If a tie needs to be settled deterministically, the consumer should out-specify rather than rely on
order: `(0,1,1)` is enough.

### Why not @layer

A layered rule loses to **any** unlayered author rule at any specificity and in any order, which
would be maximally overridable and fully deterministic — the architecturally right answer. It is not
available here: the library's own `base.css` is **unlayered**, so layering the component sheet hands
`its tracking` back to it. Measured on a default `<h2>`: unlayered keeps the component's `-0.02em`
(`-0.48px`), `@layer` loses it to `base.css`'s `-0.015em` (`-0.36px`) — criterion 4 broken. Layering
the whole shipped stylesheet is a real proposal, but it is a stylesheet-architecture change, not a
typography fix.

## #549 — the leading/tracking literals became role tokens

While moving the constants it turned out two of them were **magic numbers that matched no step of
the scale**:

| | component | `base.css` applies to the element | token | |
| --- | --- | --- | --- | --- |
| `Text` line-height | `1.6` | `var(--leading-normal)` = 1.5 | between `normal` 1.5 and `relaxed` 1.65 | ✗ |
| `Heading` letter-spacing | `-0.02em` | `var(--tracking-tight)` = -0.015em | between `tight` -0.015em and `tighter` -0.03em | ✗ |
| `Heading` line-height | `1.2` | `var(--leading-tight)` = 1.2 | exactly `tight` | ✓ untokenised |

So a `Text` and a bare `<p>` rendered at different leading, and a `Heading` and a bare `<h2>` at
different tracking — measured `-0.48px` against `base.css`'s `-0.36px` on a default `<h2>` — for no
stated reason, and a theme remapping `--leading-normal` or `--tracking-tight` silently failed to move
either component.

Fixed as **role tokens**, not by snapping to a step: `--leading-body: 1.6` and
`--tracking-heading: -0.02em` in `tokens/typography.css`, beside the `--text-h1`-style role tokens
already there. `Heading`'s `1.2` now reads `var(--leading-tight)`, which is value-identical.

- **No pixels moved** — the same 29-shape computed-style comparison, 0 differing.
- **They are now themable**, which is the point: remapping `--leading-body` to `2` moves `Text`'s
  line-height 25.6px → 32px, and `--tracking-heading` moves `Heading`'s tracking. Measured. Before,
  neither was reachable from a theme at all.
- **Every reference carries a fallback** — `var(--leading-body, 1.6)`. Without one, a consumer who
  does not load `twico-ui/styles.css` gets an undefined `var()`, which is invalid at computed-value
  time, and `line-height` would collapse to `normal`. Measured: 25.6px with no stylesheet at all.

What this deliberately does **not** settle is whether the roles *should* differ from the element
defaults — whether body copy ought to be 1.6 or 1.5. That is a type-scale decision, and it is now a
one-line change in the token file instead of a hunt through two components.
