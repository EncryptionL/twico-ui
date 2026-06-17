# QA notes — Avatar

- **Group:** data-display
- **Status:** clean
- **Reviewed:** 2026-06-17

## Open issues

(none)

## Verified OK

- **Image fallback & error handling:** SafeSrc blocks javascript:/vbscript: URLs correctly. Image error handler gracefully falls back to initials.
- **Whitespace name guard:** initials() function trims input and returns "?" for empty names.
- **Accessibility:** Proper role="img" + aria-label (falls back to "avatar" when name absent). Status dot is visual-only (appropriate since it's metadata).
- **Ring/square styling:** CSS uses logical properties (inset-inline-end), RTL-compatible.
- **Sizes (xs–xl):** Scale correctly from 24px to 72px with proportional font sizing.
- **Status indicators:** All four tones (online/busy/away/offline) render at correct inset-inline-end + bottom corner, scaled by 28% of avatar size.
- **SSR safe:** Only calls document in useInsertionEffect, safe for server rendering.
