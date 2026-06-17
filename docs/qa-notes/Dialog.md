# QA notes — Dialog

- **Group:** overlay
- **Reviewed:** 2026-06-17
- **Status:** open

## Open issues

- [x] **[P2] Body scroll not locked while open** — The dialog portals to `document.body` and renders a fixed full-viewport scrim, but nothing sets `overflow: hidden` on `<html>`/`<body>`. On most desktop browsers the page behind the scrim still scrolls with the wheel/trackpad once the pointer leaves the (possibly short) dialog, and on iOS Safari the body scrolls under the modal. This is a common modal expectation. _Fix:_ on open, save and set `document.body.style.overflow = "hidden"` (and restore on unmount), guarded for SSR; or document that scroll-lock is the consumer's responsibility. `Dialog.jsx:75-89` — ✓ fixed 2026-06-17

- [ ] **[P2] Initial focus lands on the dialog container, not the first control** — On open, focus is moved to the panel node itself (`node?.focus()` with `tabIndex={-1}`), not to the first focusable element or a sensible default. For a confirmation dialog this means the first Tab is needed before any action is reachable, and screen-reader users start on the container. This is acceptable per APG (focusing the dialog is allowed), but focusing the first interactive element (or the close button) is friendlier. _Fix (optional):_ prefer focusing the first focusable from the same query used by the trap, falling back to the panel. `Dialog.jsx:94-102`

## Verified OK

- Portals to `document.body`, so a transformed / `backdrop-filter` ancestor cannot become the fixed scrim's containing block (`Dialog.jsx:158-160`).
- Exit animation: stays mounted for 170 ms (`Dialog.jsx:87`) vs `--duration-exit: 150ms` — in lockstep, so the close animation completes before unmount.
- Focus restore is keyed on `open` only (`Dialog.jsx:94-102`), so an unstable `onClose` identity can't clobber the saved trigger; restores to `prevFocused` on close.
- Focus trap handles Shift+Tab at the first element, Tab at the last, and the empty-focusables case by refocusing the panel; filters `offsetParent !== null` to skip hidden controls (`Dialog.jsx:105-128`).
- Escape `preventDefault()` + `onClose?.()`; listener attached only while open and removed on cleanup (`Dialog.jsx:116-127`).
- Backdrop dismissal uses `onMouseDown` + `e.target === e.currentTarget` guard, so a drag that starts inside the panel and releases on the scrim does not close it; gated by `closeOnBackdrop` (`Dialog.jsx:134`).
- a11y labelling: `role="dialog"`, `aria-modal="true"`; `aria-labelledby` when `title` is present, `aria-label="Dialog"` fallback when absent; `aria-describedby` only when `description` exists (`Dialog.jsx:135`).
- Close button only rendered when `onClose` is supplied; header region rendered when any of title/description/onClose present (`Dialog.jsx:136-148`).
- `prefers-reduced-motion` collapses both overlay and panel animations to 1 ms (`Dialog.jsx:24-26`).
- SSR-safe: `typeof document === "undefined"` short-circuits to `null`; portal output is client-only so no hydration mismatch (`Dialog.jsx:158`).
- `data-size="full"` correctly accounts for the overlay's `--space-4` padding on each side via `100vw - var(--space-8)` (`Dialog.jsx:30-36`).
- `scrollBody` flex layout keeps header/footer fixed and scrolls only the body (`Dialog.jsx:38-41`).
- Logical-property-neutral: centered grid layout and symmetric padding mean no RTL physical-property hazards.
