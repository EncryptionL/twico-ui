# QA notes — Progress

- **Group:** Feedback
- **Status:** resolved
- **Reviewed:** 2026-06-17

## Resolved issues

- [x] **[P2] RTL animation** — The indeterminate progress animation used physical `left` and `right` keyframe properties, which did not respond to `dir="rtl"`. _Fixed:_ `Progress.jsx` now injects its own component-scoped `twc-progress-indeterminate` keyframe using logical properties (`inset-inline-start` / `inset-inline-end`), so the bar follows document direction. `components/feedback/Progress.jsx`

## Verified OK

- **Accessibility:** `role="progressbar"` on the inner track; `aria-valuenow` (when determinate), `aria-valuemin="0"`, `aria-valuemax="100"` correctly set. Screen readers can announce progress percentage.
- **Value clamping:** Percentage calculation uses `Math.min(100, Math.max(0, ...))` to safely clamp between 0–100; handles edge inputs (negative, >max, max=0).
- **Controlled behavior:** Determinate mode uses `value` and `max` props; indeterminate mode ignores value and animates continuously. No uncontrolled state leakage.
- **Label display:** `showLabel` correctly hides when `indeterminate=true` (you can't show a percentage for an indeterminate bar); label rounds percentage to integer.
- **Styling:** Tone colors applied via CSS variables; size variants (sm/md/lg) scale both height and border-width proportionally. Smooth width transition on determinate update.
- **SSR safety:** Uses `useInsertionEffect`; no window/document at module scope.
- **prefers-reduced-motion:** Animation continues to spin (indeterminate conveys ongoing work and should not freeze).
- **Wrapper contract:** `className` and `...rest` applied to outer `.twc-progress-wrap` container; `role` and `aria-*` attributes live on the inner `.twc-progress` track (correct semantic nesting).

