# QA notes — Drawer

- **Group:** overlay
- **Reviewed:** 2026-06-17
- **Status:** open

## Open issues

- [ ] **[P2] `side` is physical, not logical, so RTL drawers do not mirror** — `side="right"`/`"left"` map to physical `right: 0`/`left: 0` plus a physical `border-left`/`border-right` and matching radii (`Drawer.jsx:13-14`). In an RTL document a `side="right"` drawer still slides from the visual right with its border on the left edge — i.e. it does not flip to the leading edge. This is arguably intentional (the prop names physical edges), but it is the one place in the family that is not RTL-aware. _Fix (optional):_ document that `side` is physical, or add an `inline-start`/`inline-end` option built on logical properties. `Drawer.jsx:13-14`

- [x] **[P2] Body scroll not locked while open** — Same as Dialog: the scrim is fixed and full-viewport but the page behind it still scrolls (wheel after pointer leaves the panel; iOS body scroll under the panel). _Fix:_ set `body { overflow: hidden }` on open and restore on unmount (SSR-guarded), or document as consumer responsibility. `Drawer.jsx:80-84` — ✓ fixed 2026-06-17

- [ ] **[P2] Initial focus lands on the panel container, not the first control** — On open focus moves to the panel node (`tabIndex={-1}`) rather than the first focusable. APG-acceptable, but a filter/details drawer would feel better focusing its first field or the close button. _Fix (optional):_ focus the first focusable, falling back to the panel. `Drawer.jsx:89-97`

## Verified OK

- Portals to `document.body`, escaping transformed / `backdrop-filter` ancestors as the fixed containing block (`Drawer.jsx:159-161`).
- Exit animation per side (slide-out) stays mounted 170 ms vs `--duration-exit: 150ms` — in lockstep (`Drawer.jsx:80-84`, `Drawer.jsx:21-32`).
- Focus trap + Escape identical to Dialog and correct: Shift+Tab at first, Tab at last, empty-list refocus, `offsetParent` hidden-filter (`Drawer.jsx:100-123`).
- Focus restore keyed on `open` only, immune to unstable `onClose` (`Drawer.jsx:89-97`).
- Backdrop dismissal: `onMouseDown` + `e.target === e.currentTarget` guard, gated by `closeOnBackdrop` (`Drawer.jsx:135`).
- a11y labelling identical to Dialog: `role="dialog"`/`aria-modal`; labelledby/aria-label fallback/describedby wired correctly (`Drawer.jsx:136`).
- Size resolution is sound: preset map `sm/md/lg`, `number → px`, other strings pass through; only the axis matching the side is applied (`width` for left/right via `--_w`, `height` for top/bottom via `--_h`) (`Drawer.jsx:48`, `Drawer.jsx:127-132`).
- `width`/`height` correctly ignored on the non-matching axis — a `width` on a `bottom` drawer is dropped, matching the `.d.ts` contract (`Drawer.jsx:130-132`).
- Consumer `style` merges after the size var, and `className` is appended, without clobbering internal data attributes (`Drawer.jsx:136`).
- `prefers-reduced-motion` collapses animations to 1 ms (`Drawer.jsx:42-44`).
- SSR-safe: `typeof document === "undefined"` → `null` (`Drawer.jsx:159`).
- Body uses logical `padding-inline`-neutral symmetric padding; only the `side` anchoring is physical (see open issue).
