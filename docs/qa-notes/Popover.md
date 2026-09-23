# QA notes — Popover

- **Group:** overlay
- **Reviewed:** 2026-09-23
- **Status:** clean

## Open issues

- [x] **[#420] aria-describedby landed on the wrapper, not the trigger** — Popover forwards an incoming aria-describedby to the cloned trigger. `Popover.jsx` — ✓ 2026-09-23

- [x] **[#389] Escape/outside-click over a Popover-in-Dialog closed both** — Popover joins the dismissable-layer stack (gates outside-pointer + preventDefaults Escape when topmost). `Popover.jsx` — ✓ fixed 2026-09-22

- [x] **[#373] No `max-height`/overflow, so a tall panel rendered off-screen with its footer unreachable** — `.twc-popover` set no height cap and no overflow, so a panel taller than the room below its trigger rendered past the viewport edge; because it is `position: fixed`, page scrolling couldn't bring it back and there was no scrollbar to recover the footer (`Menu` and the Datatable popups already clamp — which made this look like an oversight). `place()` now sets a `maxHeight` from the `spaceBelow`/`spaceAbove` it already measures for the flip decision (or `vh − 2·M` for left/right, floored at 120), applied to `.twc-popover__inner` with `overflow-y: auto`. The clamp + scroll live on the INNER, not the panel, because the panel must keep `overflow: visible` so the absolutely-positioned arrow (`top`/`left: -6`) isn't clipped. `Tooltip` was checked and deliberately left as-is — a hover-dismissed bubble shouldn't grow a scrollbar (it is `max-width` + wrap, meant for short text). `Popover.jsx` — ✓ fixed 2026-09-11

- [x] **[P2] `left`/`right` placement is never clamped or flipped to the viewport** — For vertical placements the left coordinate is clamped to `[M, vw - w - M]` (`Popover.jsx:85`), but the `left`/`right` branch computes `left = onRight ? r.right + gap : r.left - w - gap` with no clamp and no flip (`Popover.jsx:91-96`). A `placement="left"` popover on a trigger near the left edge renders with a negative `left` (panel pushed off-screen / horizontally scrolling the document); a `placement="right"` popover near the right edge overflows past `vw`. Unlike top/bottom, it never flips to the opposite side when space runs out. _Fix:_ if the chosen horizontal side overflows, flip to the other side (mirror the top/bottom flip logic) and/or clamp into the viewport, recomputing the arrow offset. `Popover.jsx:90-96` — ✓ fixed 2026-06-17

- [x] **[P2] Vertical centering for `left`/`right` assumes a short panel** — `top = Math.max(M, Math.min(tp - 40, vh - 80))` (`Popover.jsx:94`) hard-codes a ~80 px tall panel: it centers by subtracting 40 and bounds the bottom at `vh - 80`. A taller popover (e.g. the 320 px "About this metric" variation used with side placement) is not vertically centered on the trigger and can overflow the bottom of the viewport, and the arrow (`arrow.top = tp - top - 5.5`) can point outside the panel. _Fix:_ measure the panel height (as `place()` already can via `popRef`) and center with the real height, clamping against it. `Popover.jsx:93-95` — ✓ fixed 2026-06-17

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
