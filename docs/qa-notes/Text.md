# QA notes — Text

- **Group:** typography
- **Status:** open
- **Reviewed:** 2026-06-17

## Open issues
- [ ] **[P2] RTL / alignment API** — `align` is forwarded straight to `textAlign`, and the docs-site demo uses the physical value `align="center"` (fine) but the public guidance leaves the door open to `"left"`/`"right"`. Like Heading, an author who picks physical values gets LTR-locked alignment under `dir="rtl"`. Severity is low because the only demoed value is `"center"` (mirror-safe) (`Text.jsx:48`, `TextVariations.jsx:76`). _Fix:_ document in the `.d.ts`/prompt that `align` accepts the logical keywords `"start"`/`"end"` and prefer them in examples for RTL safety. `components/typography/Text.d.ts:13`

- [x] **[#473] `align` had no doc comment** - it was one of the only two props in the Heading/Text
  interfaces without JSDoc, so nothing pointed consumers at the logical `start`/`end` keywords in a
  library that is otherwise logical-property based. Now documented. The demo half of the older note
  in this file is stale: `TextVariations.jsx` already uses `align="start"`; it was HeadingVariations
  that still taught `left`/`right`, and that is fixed too. `Text.d.ts:15` - fixed 2026-10-07

## Verified OK
- The `TONE` map covers every tone listed in the `.d.ts` union (`default/muted/subtle/primary/success/warning/danger/info/neutral`) with a `|| TONE.default` fallback, so an invalid/unknown tone degrades to the default color rather than producing `var(undefined)` (`Text.jsx:3-15`, `Text.jsx:46`).
- `warning`/`info` deliberately use the readable `-subtle-fg` (text-grade) tokens instead of the too-light base hue, and all referenced tokens exist in both light and dark blocks (`tokens/colors.css:143,156,200,211`) — so warning/info text keeps contrast and dark mode flips correctly (`Text.jsx:11-13`).
- `weight` is optional and only emits `font-weight` when truthy (`weight ? var(--font-${weight}) : undefined`), so the default `<p>` inherits the normal weight; documented suffixes `medium/semibold/bold` all map to real tokens (`Text.jsx:47`, `tokens/typography.css:28-30`).
- `size` defaults to `"base"` and every demoed value (`xs/sm/base/lg/xl`) resolves to a real `--text-*` token (`tokens/typography.css:14-18`); an arbitrary suffix is the consumer's responsibility but typed as `string`.
- `href` sanitization gated on `Tag === "a"`; the `as="span"` inline-emphasis pattern in the demo composes correctly (nested `Text as="span"`) (`Text.jsx:37`, `TextVariations.jsx:64-68`).
- SSR-safe: no `window`/`document`, pure render; inline `...style` spread last so consumer overrides win. No motion/portal/focus surface.
- Since #543 it **does** render one scoped stylesheet (`.twc-text { margin: 0 }`, id `twc-text-styles`) — see the section below for why, and why it cannot cause a hydration mismatch: React 19 hoists it to `<head>` in the SSR stream, React 18 renders nothing and injects it imperatively.


---

## #543 — the margin reset moved out of the inline style object

`Text` reset its UA margins with four **inline** declarations (`marginTop/Right/Bottom/Left: 0`).
An inline declaration beats every stylesheet rule whatever its specificity, so that reset could not
be overridden by **anything** — not a consumer's CSS, not a `className`, and not the library itself.

The library is what was being blocked. `FieldRow`'s fragment-cell lane (#531) is a
`margin-block-end` on the cell's lane-less child, so a `Text` between two inputs in a range row sat
one lane (24px) below its siblings' control boxes on the wrapping path, with its computed
`margin-block-end` reading `0px` instead of the `calc()` the rule asked for. Measured at 520px,
760px and at the default floor: 24px each time, and 0px after.

It is now `.twc-text { margin: 0; }` in a scoped stylesheet (`twc-text-styles`):

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
(FieldRow's lane); it did not fix the class. So `.twc-text { font-weight: 500 }` in a consumer's CSS
still does nothing for `line-height` or `font-family`, and this note previously implied otherwise. Tracked separately rather than
widened here, because moving a *visual* constant changes what third-party CSS can do to every
`Text` on a page — a public-API decision, not a cleanup.

`...style` is still spread after the base declarations, so the `style` prop escape hatch is
unchanged (asserted).

**The `<style>` does not land inside the element.** `<style>` is metadata content and `<p>`
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
`React.Children.toArray(children).length` goes 1 → 2 for `<Text as={Spy}>c</Text></`, and
`React.Children.count` 2 → 3. `React.Children.only` threw before and still throws, so that path is
unchanged, and no component in this library renders `Text`, so the exposure is consumer-side and
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
| **(0,1,0)** `.twc-text` | never | **depends on render mode** | **always** | always | always |
| (0,2,0) `.twc-text.twc-text` | never | never | never | depends | **always** |

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
`its leading` back to it. Measured on a default `<h2>`: unlayered keeps the component's `-0.02em`
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
