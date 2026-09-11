# QA notes — Dialog

- **Group:** overlay
- **Reviewed:** 2026-06-17
- **Status:** clean

## Open issues

- [x] **[#371] `scrollBody` defaulted to `false`, scrolling the footer buttons off-screen** — with the old default, once content exceeded the viewport the title scrolled away at the top and the footer (Save/Cancel) at the bottom, so the user had to scroll to the end of the body to reach the button that acts on it — the worse of the two behaviours, and the one you got by writing the obvious thing (in one app: 44 of 78 call sites passed `scrollBody`, 34 didn't — an unprincipled split). Flipped the default to `scrollBody: true` (header/footer pinned, only the body scrolls — matching `Drawer`, which is unconditionally flex-column). A dialog whose content fits renders identically (the panel is `max-height`-capped, not fixed-height, so it still shrinks to content). `scrollBody={false}` still scrolls the whole panel as one block. Migration note: a non-portaled child that deliberately overflows the panel would now be clipped (rare — the overlay inputs all portal by default). `Dialog.jsx` — ✓ fixed 2026-09-11
- [x] **[#372] No divider between header / body / footer** — the three regions differed only by padding and font size, so with a scrolling body content slid up under the title and behind the buttons with no line marking the boundary (worst exactly where the component was already doing the right thing — the pinned header/footer of `scrollBody`). Added a `dividers` prop (default `true`): a `border-bottom` on the header and `border-top` on the footer via per-region `data-divider`, so the rule is auto-suppressed where the region is empty (no footer; a header with only a close button and no title/description). `dividers={false}` reads as one continuous surface. Uses `--color-divider` (matching Drawer's footer). Composes with #371 — dividers matter most when the body scrolls. `Dialog.jsx` — ✓ fixed 2026-09-11

- [x] **[P2] Body scroll not locked while open** — The dialog portals to `document.body` and renders a fixed full-viewport scrim, but nothing sets `overflow: hidden` on `<html>`/`<body>`. On most desktop browsers the page behind the scrim still scrolls with the wheel/trackpad once the pointer leaves the (possibly short) dialog, and on iOS Safari the body scrolls under the modal. This is a common modal expectation. _Fix:_ on open, save and set `document.body.style.overflow = "hidden"` (and restore on unmount), guarded for SSR; or document that scroll-lock is the consumer's responsibility. `Dialog.jsx:75-89` — ✓ fixed 2026-06-17

- [x] **[P2] Initial focus lands on the dialog container, not the first control** — On open, focus is moved to the panel node itself (`node?.focus()` with `tabIndex={-1}`), not to the first focusable element or a sensible default. For a confirmation dialog this means the first Tab is needed before any action is reachable, and screen-reader users start on the container. This is acceptable per APG (focusing the dialog is allowed), but focusing the first interactive element (or the close button) is friendlier. _Fix:_ on open, query the first focusable using the same selector as the focus trap and focus it, falling back to the panel node when none exists; focus-restore-on-close unchanged. `Dialog.jsx:103-116` — ✓ fixed 2026-06-17; corrected 2026-06-18 (the behavior gate caught focus still landing on the trigger — the effect now keys on `[open, mounted]` so it runs after the portaled panel mounts and dialogRef exists).

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
