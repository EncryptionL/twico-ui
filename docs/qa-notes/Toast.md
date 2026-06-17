# QA notes — Toast

- **Group:** Feedback
- **Status:** open
- **Reviewed:** 2026-06-17

## Open issues

- [ ] **[P2] RTL slide animation** — The toast entry animation uses `animation: twico-slide-in-right`, which is a physical direction animation (`translateX(24px)`). In RTL layouts, toasts will slide in from the left (incorrect; should come from the right in RTL). _Fix:_ Create a logical variant of the animation that responds to document direction, or use `transform` directions relative to `inset-inline-end` positioning. `components/feedback/Toast.jsx:12` and `styles/twico-ui.css:467-470`

## Verified OK

- **Accessibility:** `role="status"` allows screen readers to announce toast updates. Icon has `aria-hidden="true"`. Close button has `aria-label="Dismiss"`.
- **Auto-dismiss behavior:** `duration` prop controls timeout (default 4500ms); pauses on `onMouseEnter` and `onFocus`, resumes on `onMouseLeave` and `onBlur`. Allows users to pause and read longer messages before dismissal.
- **Duration handling:** `onCloseRef` correctly captures the latest callback without resetting the timer on every render. `start()` and `stop()` functions prevent timer leaks on unmount or prop changes.
- **Tone aliasing:** `neutral` maps to `default` for consistency with Badge's tone vocabulary. Fallback icon selection handles unmapped tones gracefully.
- **Content:** Optional `title` and `children` both render with conditional logic; no layout shifts with either omitted.
- **ToastViewport positioning:** `position: fixed; bottom: 20px; inset-inline-end: 20px` is RTL-safe via logical property `inset-inline-end`. Stack grows upward as toasts are added.
- **Viewport limit:** `limit` slices toasts from the end (keeps most recent N), preventing unlimited growth.
- **Close button styling:** Opacity and hover state smooth transitions; semantic `type="button"`.
- **SSR safety:** Uses `useInsertionEffect` in both Toast and ToastViewport; no window/document at module scope.
- **prefers-reduced-motion:** Slide animation continues (transient notification feedback is essential).

