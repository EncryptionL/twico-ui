# QA notes — Toast

- **Group:** Feedback
- **Status:** resolved
- **Reviewed:** 2026-06-17

## Resolved issues

- [x] **[P2] RTL slide animation** — The toast entry animation used the physical-direction `twico-slide-in-right` keyframe (`translateX(24px)`), so RTL toasts slid in from the wrong side. _Fixed:_ `Toast.jsx` now injects its own `twc-toast-slide-in` keyframe (LTR behaviour identical to before) plus a `[dir="rtl"] .twc-toast` override using `twc-toast-slide-in-rtl` (`translateX(-24px)`), so RTL toasts enter from the inline-end edge. `components/feedback/Toast.jsx`

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

