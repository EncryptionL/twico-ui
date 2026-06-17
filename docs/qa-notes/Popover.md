# QA notes — Popover

- **Group:** overlay
- **Reviewed:** 2026-06-17
- **Status:** open

## Open issues

- [ ] **[P2] `left`/`right` placement is never clamped or flipped to the viewport** — For vertical placements the left coordinate is clamped to `[M, vw - w - M]` (`Popover.jsx:85`), but the `left`/`right` branch computes `left = onRight ? r.right + gap : r.left - w - gap` with no clamp and no flip (`Popover.jsx:91-96`). A `placement="left"` popover on a trigger near the left edge renders with a negative `left` (panel pushed off-screen / horizontally scrolling the document); a `placement="right"` popover near the right edge overflows past `vw`. Unlike top/bottom, it never flips to the opposite side when space runs out. _Fix:_ if the chosen horizontal side overflows, flip to the other side (mirror the top/bottom flip logic) and/or clamp into the viewport, recomputing the arrow offset. `Popover.jsx:90-96`

- [ ] **[P2] Vertical centering for `left`/`right` assumes a short panel** — `top = Math.max(M, Math.min(tp - 40, vh - 80))` (`Popover.jsx:94`) hard-codes a ~80 px tall panel: it centers by subtracting 40 and bounds the bottom at `vh - 80`. A taller popover (e.g. the 320 px "About this metric" variation used with side placement) is not vertically centered on the trigger and can overflow the bottom of the viewport, and the arrow (`arrow.top = tp - top - 5.5`) can point outside the panel. _Fix:_ measure the panel height (as `place()` already can via `popRef`) and center with the real height, clamping against it. `Popover.jsx:93-95`

## Verified OK

- Portals to `document.body`; fixed positioning anchored to the trigger rect escapes transformed / `backdrop-filter` / overflow ancestors (`Popover.jsx:72-77`, `Popover.jsx:187`).
- Top/bottom auto-flip + horizontal clamp with 8 px margin; arrow offset recomputed and clamped to stay within the panel (`Popover.jsx:80-88`).
- Reposition on scroll (capture) + resize while open; listeners cleaned up (`Popover.jsx:109-118`).
- Controlled/uncontrolled handled correctly via the ref-based `setOpen` with redundant-callback short-circuit; `onOpenChange` fires on trigger click, Esc, and outside click (`Popover.jsx:55-68`).
- Focus is moved into the panel after it mounts and is positioned (`preventScroll: true`), and restored to the opener on close *only if focus is still inside the panel* — so an outside click that moves focus elsewhere doesn't yank it back (`Popover.jsx:130-150`).
- Outside `mousedown` (guarded against wrap + panel subtrees) and Escape both close; listeners scoped to the open state (`Popover.jsx:99-119`).
- a11y: trigger gets `aria-haspopup="dialog"`, `aria-expanded`, `aria-controls` (only while open); panel is `role="dialog"` with `aria-labelledby` wired to the title id when `title` is present (`Popover.jsx:153-175`). Non-modal disclosure semantics (no focus trap) are appropriate here.
- Non-element trigger fallback is a focusable `role="button"` span with Enter/Space activation (`Popover.jsx:176-182`).
- Exit animation stays mounted 170 ms vs `--duration-exit: 150ms` — in lockstep (`Popover.jsx:121-126`, `Popover.jsx:15`).
- `prefers-reduced-motion` collapses the scale animation to 1 ms (`Popover.jsx:17`).
- Arrow is `aria-hidden` and purely decorative (`Popover.jsx:156`).
- SSR-safe: DOM access only in effects; portal resolution guards `typeof window` (`Popover.jsx:70`).
