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

**Everything else stays inline on purpose.** Those declarations carry **prop values** — `size`,
`tone`/`color`, `weight`, `align`, `truncate`/`lineClamp` — and a value derived from a prop is not
something a shared stylesheet can express. Only the constant moved. `...style` is still spread
after them, so the `style` prop escape hatch is unchanged (asserted).

**The `<style>` does not land inside the element.** `<style>` is metadata content and `<h1>…<h6>`
accepts only phrasing content, so an always-on style child would be invalid HTML. On React 19
`useScopedStyles` returns a hoistable `<style href precedence>` that React lifts to `<head>`,
including in the SSR stream; on React 18 it returns `null` and injects imperatively. Either way the
element carries no style child, and the rule reaches `<head>` **once** across every instance
(deduped by id) — both asserted in
[`tests/issue-543-typography-margin-reset.test.jsx`](../../tests/issue-543-typography-margin-reset.test.jsx).

Validated by reverting one inline `marginBottom: 0`: all three wrap cases return to 24px, and the
band path stays at 0px — which is also the proof that the band path never depended on the margin.