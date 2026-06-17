# QA notes — Spinner

- **Group:** Feedback
- **Status:** clean
- **Reviewed:** 2026-06-17

## Open issues

None identified.

## Verified OK

- **Accessibility:** `role="status"` with `aria-label` (default "Loading") properly announces the spinner to screen readers. Aria-label is customizable for context-specific descriptions (e.g., "Loading results").
- **Color aliasing:** `color` prop takes precedence over deprecated `tone`; logic `color ?? tone` ensures backwards compatibility while preferring the new name.
- **Default inheritance:** When `color="current"` (the default), no `data-tone` attribute is set, allowing the spinner to inherit `currentColor` from its parent. This makes it visible inside buttons and themed elements without additional styling.
- **Tone colors:** Named tones (primary, success, warning, danger, info, neutral, white) map to design token colors via CSS custom properties; all render with correct contrast and vibrancy.
- **Size scaling:** Four sizes (sm/md/lg/xl) scale both diameter (`--_sz`) and border-width (`--_bw`) proportionally, maintaining visual balance at all scales.
- **Button integration:** Spinner inherits button text color and font size, making it a drop-in icon replacement for loading states.
- **SSR safety:** Uses `useInsertionEffect`; no window/document at module scope.
- **prefers-reduced-motion:** Spin animation continues (loading indicator conveys ongoing work and should animate).
- **Styling:** Circular border design with transparent background; border-top-color highlights the track; smooth 0.65s rotation animation.

