# QA notes — Avatar

- **Group:** data-display
- **Status:** clean
- **Reviewed:** 2026-06-17

## Open issues

(none)

- [x] **[#455 review] the status dot's fill is a standalone graphic and was not covered by the new tone taxonomy** - nothing sits on top of it and its 2px ring is the surface colour, so the fill alone carries online/busy/away and SC 1.4.11's 3:1 applies; `away` on the plain warning tone was 2.15:1 in light. All three now use the `--color-*-graphic` aliases. (Badge solid, Timeline dots and the Stepper indicator keep the plain tones: their fills carry `--color-*-fg` content, so they are backgrounds rather than standalone graphics.) `Avatar.jsx:27` - fixed 2026-10-07

## Verified OK

- **Image fallback & error handling:** SafeSrc blocks javascript:/vbscript: URLs correctly. Image error handler gracefully falls back to initials.
- **Whitespace name guard:** initials() function trims input and returns "?" for empty names.
- **Accessibility:** Proper role="img" + aria-label (falls back to "avatar" when name absent). Status dot is visual-only (appropriate since it's metadata).
- **Ring/square styling:** CSS uses logical properties (inset-inline-end), RTL-compatible.
- **Sizes (xs–xl):** Scale correctly from 24px to 72px with proportional font sizing.
- **Status indicators:** All four tones (online/busy/away/offline) render at correct inset-inline-end + bottom corner, scaled by 28% of avatar size.
- **SSR safe:** Only calls document in useInsertionEffect, safe for server rendering.
