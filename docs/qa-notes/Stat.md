# QA notes — Stat

- **Group:** data-display
- **Status:** clean
- **Reviewed:** 2026-06-17

## Open issues

(none)

## Verified OK

- **Delta direction inference:** Correctly infers direction from a leading "-" in delta string, or explicit deltaDirection prop overrides it. Flat is the third case.
- **Icon tinting:** Icon sits in a primary-subtle background tile (38×38px, border-radius-md), centered. Icon color is primary-subtle-fg.
- **Delta arrows:** Three directions (up, down, flat) each render the correct SVG path. Colors: success-subtle for up, danger-subtle for down, surface-sunken for flat.
- **Help text:** Muted color, appears only when helpText exists; delta + help sit in same flex row.
- **Plain mode:** Removes border, background, padding—allows stat to integrate into a parent container without chrome.
- **Font hierarchy:** Label (sm, muted), value (3xl, extrabold, -0.02em tracking), delta (sm, bold with background).
- **Accessibility:** Simple div-based structure, no ARIA needed. label + value + delta are all text.
