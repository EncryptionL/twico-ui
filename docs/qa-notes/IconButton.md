# QA notes — IconButton

- **Group:** buttons
- **Status:** clean
- **Reviewed:** 2026-06-17

## Open issues
- [x] **[P2] No default `type="button"`** — The rendered `<button>` has no explicit `type`, so it defaults to `type="submit"`. An icon button placed in a `<form>` (e.g. a clear/close affordance in a search field) will submit the form on click. `type` is only present if the consumer passes it through `...rest`. _Fix:_ default `type="button"` (overridable via `...rest`), e.g. add `type="button"` on the element before `{...rest}`. `components/buttons/IconButton.jsx:71-81` — ✓ fixed 2026-06-17

## Enhancements
- **[#342] Icon links (`as="a"` + `href`/`target`/`rel`)** — IconButton can now render as an anchor, mirroring
  Button, so navigation (a GitHub/repo icon, external links) is a real link rather than a `<button>` + a
  programmatic `window.open`/`navigate` — middle-clickable, open-in-new-tab, announced as a link by AT. `href`
  is scheme-sanitized by a local `safeHref` (`javascript:`/`data:`/`vbscript:`, incl. control-char obfuscation,
  drop the href — the same trust-boundary treatment as Button/nav components). Element-appropriate attributes:
  `type="button"` + `disabled` only for `as="button"`; `href`/`target`/`rel` (via `...rest`) only for `as="a"`.
  A `disabled` anchor is inert — no `href`, `aria-disabled="true"`, `tabIndex={-1}`, and a
  `.twc-iconbtn[aria-disabled="true"]` rule (opacity + `pointer-events: none`) since `:disabled` doesn't match
  `<a>`. This fixed the twico-ui docs-site navbar's GitHub icon (was a button). Test in
  `tests/iconbutton-link.test.jsx`. — added 2026-08-06

## Verified OK
- `aria-label` is required in the type contract (`IconButton.d.ts:21`) and forwarded to the button (line 79), so the icon-only control is always labeled for AT. The icon node is `aria-hidden`-equivalent (decorative SVG inside a labeled button) — correct.
- `disabled` is applied to the native `<button>` (removing it from the tab order + blocking activation) for `as="button"`; for `as="a"` (#342) a disabled link is made inert via `aria-disabled`/`tabIndex=-1`/no-href + `pointer-events:none` — no anchor footgun.
- Style injection uses `useInsertionEffect` guarded by an id check (lines 63-69) — SSR-safe, injected once, shared id `twc-iconbtn-styles`.
- tone × variant axes mirror Button and are orthogonal/complete (solid/soft/outline/ghost × primary/danger); danger reuses its hover for the pressed state intentionally (lines 35-48).
- `:focus-visible` uses `box-shadow: var(--ring)` with `outline:none` (line 30); `:active` scale and all hover rules are gated `:not(:disabled)` (lines 31, 42-48).
- Square sizing is symmetric (`width` and `height` both `--_sz`, line 8-10) across xs/sm/md/lg; `round` swaps to `--radius-full` (line 25) for a true circle; svg sizing is relative (`1.25em`, line 33) so it scales with control size.
- Reduced motion is covered globally by `base.css` (transforms/transitions collapse under `prefers-reduced-motion: reduce`); IconButton has no continuous animation of its own.
- RTL-safe: no physical horizontal offsets — content is centered via flex, so `dir="rtl"` needs no special handling.
- Default `variant="ghost"` matches the `.d.ts` default and the documented toolbar/dense-UI use case (line 54; `IconButton.d.ts:12`).
