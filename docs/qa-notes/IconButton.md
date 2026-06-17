# QA notes — IconButton

- **Group:** buttons
- **Status:** clean
- **Reviewed:** 2026-06-17

## Open issues
- [x] **[P2] No default `type="button"`** — The rendered `<button>` has no explicit `type`, so it defaults to `type="submit"`. An icon button placed in a `<form>` (e.g. a clear/close affordance in a search field) will submit the form on click. `type` is only present if the consumer passes it through `...rest`. _Fix:_ default `type="button"` (overridable via `...rest`), e.g. add `type="button"` on the element before `{...rest}`. `components/buttons/IconButton.jsx:71-81` — ✓ fixed 2026-06-17

## Verified OK
- `aria-label` is required in the type contract (`IconButton.d.ts:21`) and forwarded to the button (line 79), so the icon-only control is always labeled for AT. The icon node is `aria-hidden`-equivalent (decorative SVG inside a labeled button) — correct.
- `disabled` is applied directly to the native `<button>` (line 78), which removes it from the tab order and blocks click/keyboard activation natively — no anchor footgun here since there is no `as`/`href` prop.
- Style injection uses `useInsertionEffect` guarded by an id check (lines 63-69) — SSR-safe, injected once, shared id `twc-iconbtn-styles`.
- tone × variant axes mirror Button and are orthogonal/complete (solid/soft/outline/ghost × primary/danger); danger reuses its hover for the pressed state intentionally (lines 35-48).
- `:focus-visible` uses `box-shadow: var(--ring)` with `outline:none` (line 30); `:active` scale and all hover rules are gated `:not(:disabled)` (lines 31, 42-48).
- Square sizing is symmetric (`width` and `height` both `--_sz`, line 8-10) across xs/sm/md/lg; `round` swaps to `--radius-full` (line 25) for a true circle; svg sizing is relative (`1.25em`, line 33) so it scales with control size.
- Reduced motion is covered globally by `base.css` (transforms/transitions collapse under `prefers-reduced-motion: reduce`); IconButton has no continuous animation of its own.
- RTL-safe: no physical horizontal offsets — content is centered via flex, so `dir="rtl"` needs no special handling.
- Default `variant="ghost"` matches the `.d.ts` default and the documented toolbar/dense-UI use case (line 54; `IconButton.d.ts:12`).
