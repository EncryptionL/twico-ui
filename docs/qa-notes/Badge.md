# QA notes — Badge

- **Group:** data-display
- **Status:** clean
- **Reviewed:** 2026-06-17

## Open issues

(none)

## Verified OK

- **Tone × variant matrix:** 6 tones × 3 variants (soft/solid/outline) implemented via data attributes + CSS custom properties. All combinations present and render correctly.
- **Dot sizing:** 6px dot scales proportionally; uses currentColor so it inherits the badge's foreground color.
- **Size variants (sm/md/lg):** Font size, padding, and height all scale appropriately. sm uses 18px height (7px padding reduction), lg uses 26px.
- **Accessibility:** Semantic <span> with role defaults to text. No ARIA needed for visual indicators.
- **RTL:** No physical left/right CSS; safe for RTL.
