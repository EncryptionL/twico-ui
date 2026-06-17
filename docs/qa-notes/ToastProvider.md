# QA notes — ToastProvider

- **Group:** Feedback
- **Status:** clean
- **Reviewed:** 2026-06-17

## Open issues

None identified.

## Verified OK

- **Context safety:** `useToast()` throws a clear error if called outside a provider, preventing silent failures and helping developers catch mistakes early.
- **Imperative API:** `toast()` function accepts a full options object or a string (shorthand for title). Returns a toast ID for manual dismissal. Tone helpers (`.success`, `.warning`, `.danger`, `.error`, `.info`, `.show`) are properly attached to the function object.
- **Tone helpers:** Signature `(title, options?) => id` allows flexible usage: `toast.success("Saved")` or `toast.success({ title: "...", description: "..." })`. `.error` is correctly aliased to `.danger` for consistency.
- **Auto-dismiss:** `duration` prop on provider sets global default; individual toasts can override via options. `duration: 0 | Infinity` keeps a toast open indefinitely.
- **Viewport limit:** `limit` prop caps visible toasts; `slice(-limit)` keeps the most recent N, removing oldest when threshold is exceeded.
- **Content fallback:** Toast body checks for `description` first, falls back to `children` property, supporting both declarative and imperative patterns.
- **ID management:** `idRef` increments per push operation, ensuring unique IDs; no race conditions or collisions.
- **Memoization:** `api` and `value` objects properly memoized to prevent unnecessary re-renders of consuming components and memo'd child lists.
- **Provider render:** Single `<ToastViewport>` rendered once at provider level (no duplication); all toasts flow through it via the list state.
- **Toast dismissal:** `dismiss(id)` filters the toast list correctly; `clear()` wipes all toasts at once.
- **SSR safety:** No window/document at module scope (context and hooks are safe); `ToastViewport` (rendered by provider) uses `useInsertionEffect` for styles.

