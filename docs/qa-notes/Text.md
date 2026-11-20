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

**Everything else stays inline on purpose.** Those declarations carry **prop values** — `size`,
`tone`/`color`, `weight`, `align`, `truncate`/`lineClamp` — and a value derived from a prop is not
something a shared stylesheet can express. Only the constant moved. `...style` is still spread
after them, so the `style` prop escape hatch is unchanged (asserted).

**The `<style>` does not land inside the element.** `<style>` is metadata content and `<p>`
accepts only phrasing content, so an always-on style child would be invalid HTML. On React 19
`useScopedStyles` returns a hoistable `<style href precedence>` that React lifts to `<head>`,
including in the SSR stream; on React 18 it returns `null` and injects imperatively. Either way the
element carries no style child, and the rule reaches `<head>` **once** across every instance
(deduped by id) — both asserted in
[`tests/issue-543-typography-margin-reset.test.jsx`](../../tests/issue-543-typography-margin-reset.test.jsx).

Validated by reverting one inline `marginBottom: 0`: all three wrap cases return to 24px, and the
band path stays at 0px — which is also the proof that the band path never depended on the margin.