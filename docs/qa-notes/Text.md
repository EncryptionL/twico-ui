# QA notes — Text

- **Group:** typography
- **Status:** open
- **Reviewed:** 2026-06-17

## Open issues
- [ ] **[P2] RTL / alignment API** — `align` is forwarded straight to `textAlign`, and the docs-site demo uses the physical value `align="center"` (fine) but the public guidance leaves the door open to `"left"`/`"right"`. Like Heading, an author who picks physical values gets LTR-locked alignment under `dir="rtl"`. Severity is low because the only demoed value is `"center"` (mirror-safe) (`Text.jsx:48`, `TextVariations.jsx:76`). _Fix:_ document in the `.d.ts`/prompt that `align` accepts the logical keywords `"start"`/`"end"` and prefer them in examples for RTL safety. `components/typography/Text.d.ts:13`

## Verified OK
- The `TONE` map covers every tone listed in the `.d.ts` union (`default/muted/subtle/primary/success/warning/danger/info/neutral`) with a `|| TONE.default` fallback, so an invalid/unknown tone degrades to the default color rather than producing `var(undefined)` (`Text.jsx:3-15`, `Text.jsx:46`).
- `warning`/`info` deliberately use the readable `-subtle-fg` (text-grade) tokens instead of the too-light base hue, and all referenced tokens exist in both light and dark blocks (`tokens/colors.css:143,156,200,211`) — so warning/info text keeps contrast and dark mode flips correctly (`Text.jsx:11-13`).
- `weight` is optional and only emits `font-weight` when truthy (`weight ? var(--font-${weight}) : undefined`), so the default `<p>` inherits the normal weight; documented suffixes `medium/semibold/bold` all map to real tokens (`Text.jsx:47`, `tokens/typography.css:28-30`).
- `size` defaults to `"base"` and every demoed value (`xs/sm/base/lg/xl`) resolves to a real `--text-*` token (`tokens/typography.css:14-18`); an arbitrary suffix is the consumer's responsibility but typed as `string`.
- `href` sanitization gated on `Tag === "a"`; the `as="span"` inline-emphasis pattern in the demo composes correctly (nested `Text as="span"`) (`Text.jsx:37`, `TextVariations.jsx:64-68`).
- SSR-safe: no `window`/`document`, no injected style, pure render; inline `...style` spread last so consumer overrides win. No motion/portal/focus surface.
