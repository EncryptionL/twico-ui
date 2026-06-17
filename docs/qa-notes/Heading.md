# QA notes — Heading

- **Group:** typography
- **Status:** open
- **Reviewed:** 2026-06-17

## Open issues
- [ ] **[P2] RTL / alignment API** — `align` is forwarded verbatim to `textAlign`, and the docs-site Variations teach the *physical* values `"left"`/`"right"` (`HeadingVariations.jsx:50-52`). Under `dir="rtl"` a heading authored with `align="left"` stays visually left instead of mirroring, so consumers who follow the demo get LTR-locked alignment. The component itself is fine (it passes whatever is given), but the typed surface + docs steer users to non-logical values. _Fix:_ in the demo and the `.d.ts`/prompt, prefer the logical keywords `"start"`/`"end"` (e.g. `<Heading align="start">`), and add a one-line note that `align` accepts logical values for RTL safety. `components/typography/Heading.d.ts:11`, `site/src/demos/HeadingVariations.jsx:50`

## Verified OK
- `level` (1–6) maps to both the semantic tag (`h${level}`) and the default size via `LEVEL_SIZE`, and `as` cleanly overrides the rendered tag while `size` overrides the visual size — the "render an h1 at a small size" case works as documented (`Heading.jsx:24-25`, `HeadingVariations.jsx:42`).
- `LEVEL_SIZE` has a fallback (`|| "2xl"`) and `sz` defaults to `"2xl"` if `size` is falsy, so an out-of-range/invalid `level` cannot produce an undefined `--text-undefined` var (`Heading.jsx:25`).
- `href` sanitization is correctly gated on `Tag === "a"` so a heading rendered `as="a"` blocks `javascript:`/`data:`/`vbscript:` schemes before they hit the DOM; mutating the freshly-spread `rest` object (not shared props) is safe (`Heading.jsx:26`).
- SSR-safe: no `window`/`document` access at module or render scope; pure render. No injected `<style>` (styling is inline + token vars), so no hydration mismatch.
- No motion, no portal, no focus management — nothing for reduced-motion to affect.
- Inline `style` is spread last after the token defaults (`...style` at `Heading.jsx:39`), so consumer overrides win as expected; `align` being `undefined` simply omits `textAlign`.
