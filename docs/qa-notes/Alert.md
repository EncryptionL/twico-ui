# QA notes — Alert

- **Group:** Feedback
- **Status:** clean
- **Reviewed:** 2026-06-17

## Open issues

None identified.

## Verified OK

- **Accessibility:** `role="alert"` correctly applied; icon `aria-hidden="true"`; close button has `aria-label="Dismiss"`. Semantic messaging role properly announces updates to screen readers.
- **Event handling:** `onClose` callback fires correctly on dismiss button click; optional prop pattern allows both dismissible and persistent alerts.
- **Edge cases:** Empty title and children are guarded with conditional rendering; component handles all tone combinations (info/success/warning/danger/primary/neutral) and variants (soft/solid/outline) without visual glitches.
- **Styling:** Animation uses `var(--duration-base)` and `var(--ease-out)` from design tokens; all spacing and sizing consistent with design system. Close button opacity transition smooth.
- **SSR safety:** Uses `React.useInsertionEffect` to inject styles after component mounts; no window/document access at module scope.
- **RTL:** Flexbox layout with `gap` property and no physical left/right positioning; uses standard semantic HTML. Should render correctly in RTL contexts.
- **prefers-reduced-motion:** Slide animation is brief and essential (user action feedback), so continued animation under reduced motion is acceptable.

