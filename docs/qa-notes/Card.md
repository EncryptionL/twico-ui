# QA notes — Card

- **Group:** data-display
- **Status:** clean
- **Reviewed:** 2026-06-17

## Open issues

(none)

## Verified OK

- **Variant rendering:** elevated (shadow), outline (border), soft (sunken bg) all render correctly. Elevated shows hover: box-shadow boost + border-color tint.
- **Interactive hover-lift:** translateY(-3px) + shadow-lg on interactive cards; translateY reverses on active press (scale: 0.9).
- **Padding options:** none/md/lg correctly apply var(--space-*). padding="none" allows content to manage its own spacing.
- **Full height:** data-full="true" sets height: 100% to fill grid/flex cells.
- **Header layout:** title + subtitle flex column with 2px gap; subtitle uses text-muted color.
- **Footer:** flex row with space-2 gap, appears only when footer prop exists.
- **Accessibility:** Semantic <div>, no ARIA needed for presentational container.
- **RTL:** No physical positioning; safe.
