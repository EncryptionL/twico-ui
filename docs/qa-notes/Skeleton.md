# QA notes — Skeleton

- **Group:** Feedback
- **Status:** clean
- **Reviewed:** 2026-06-17

## Open issues

None identified.

## Verified OK

- **Variants:** Three shapes work as expected—`text` (default, single line at 0.9em height), `circle` (1:1 aspect-ratio, full radius), and `rect` (block with --radius-md).
- **Multi-line text:** `lines > 1` creates a group wrapper with multiple skeleton spans; last line is 70% width to simulate paragraph break. Array.from() with key index ensures stable keys (acceptable for static list). Group container properly inherits height/style from parent props.
- **Sizing:** `width` and `height` accept CSS strings or numbers; applied via inline style on single variant or per-line for text groups.
- **Shimmer animation:** Gradient overlay translates from left (-100%) to right (100%) to create shimmer effect. Uses `inset: 0` to fill the element; animation smooth and not jittery.
- **SSR safety:** Uses `useInsertionEffect` to inject styles after hydration; no window/document at module scope.
- **prefers-reduced-motion:** Animation continues (shimmer signals loading state and should not freeze under reduced motion).
- **Accessibility:** Component is a loading placeholder with no interactive role needed. Shimmer `::after` has no accessible name, which is correct (purely decorative animation).
- **RTL:** Flexbox and transform-based shimmer should work in RTL; no physical left/right positioning.

