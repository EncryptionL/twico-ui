# QA notes — Button

- **Group:** buttons
- **Status:** clean
- **Reviewed:** 2026-06-17

## Open issues
- [x] **[P1] as="a" disabled/loading does not block navigation** — When `as="a"`, `disabled={Tag === "button" ? disabled || loading : undefined}` deliberately drops `disabled` (anchors have no such attribute), and `handleClick` returns early on `disabled || loading` but only suppresses the ripple + the `onClick` callback. The native anchor still navigates on click *and* on Enter, so a "disabled" or "loading" link button is fully clickable/keyboard-activatable and follows its `href`. It is also still in the tab order and exposes no disabled state to AT. _Fix:_ in the `as="a"` branch, when `disabled || loading` add `aria-disabled="true"`, `tabIndex={-1}`, `role="link"` is implicit so set `style`/data to `pointer-events: none`, and call `e.preventDefault()` at the top of `handleClick` (before the early `return`) so keyboard/click activation can't navigate. `components/buttons/Button.jsx:132-143,153-154` — ✓ fixed 2026-06-17
- [x] **[P2] No default `type="button"`** — A `<button>` with no `type` defaults to `type="submit"`. Placed inside a `<form>` (very common for a Cancel/secondary action), clicking it submits the form unexpectedly. `type` is only set if the consumer passes it via `...rest`. _Fix:_ default `type="button"` when `Tag === "button"` (allow `...rest` to override), e.g. spread `{...(Tag === "button" ? { type: "button" } : null)}` before `{...rest}`. `components/buttons/Button.jsx:146-157` — ✓ fixed 2026-06-17
- [x] **[P2] Ripple origin wrong on keyboard activation** — `handleClick` computes the ripple center from `e.clientX/e.clientY` (`components/buttons/Button.jsx:138-139`). On Enter/Space activation those are `0`, so `0 - rect.left - size/2` places the ripple far off the top-left corner instead of centered, producing a stray off-button flash. _Fix:_ detect keyboard activation (`e.detail === 0` or `e.clientX === 0 && e.clientY === 0`) and center the ripple at `rect.width/2 - size/2`, `rect.height/2 - size/2`. `components/buttons/Button.jsx:134-140` — ✓ fixed 2026-06-17

## Verified OK
- Scheme sanitization via `safeHref` strips `javascript:`/`data:`/`vbscript:` (incl. control-char/whitespace obfuscation) before it reaches the anchor `href` (lines 96-100, 154).
- `aria-busy` is set while `loading`, and the label/icons are hidden via `visibility:hidden` on `.twc-btn__content` (kept off `color` deliberately, per the inline comment) so the centered spinner reads cleanly across all variants (lines 36-40, 155, 164).
- Reduced motion is handled globally in `base.css` (`@media (prefers-reduced-motion: reduce)`): the ripple/press-transform collapse to ~0.01ms while `.twc-btn__spinner` is deliberately kept rotating as a functional status indicator (`base.css:93-112`).
- SSR-safe: style injection uses `useInsertionEffect`; ripple state starts `[]` and `Date.now()`/`getBoundingClientRect` only run in the click handler — no `window`/`document` at render scope.
- `overflow:hidden` (line 25) correctly clips the round ripple to the button's rounded box; ripple cleanup timeout (600ms, line 141) matches `--duration-slow` animation lifetime.
- RTL-safe: uses logical `padding-inline` for horizontal padding (line 14); `leftIcon`/`rightIcon` placement mirrors with `dir="rtl"` since order follows source/flex direction.
- tone × variant axes are orthogonal and complete (solid/soft/outline/ghost × primary/danger); danger reusing its hover for `:active` is intentional (lines 55-57).
- `:focus-visible` ring via `box-shadow: var(--ring)` with `outline:none` is correct (line 33); disabled buttons drop to `opacity:0.5` + `cursor:not-allowed` and the `:active` transform is gated `:not(:disabled)`.
