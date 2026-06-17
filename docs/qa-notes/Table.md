# QA notes — Table

- **Group:** data-display
- **Status:** open (1 issue)
- **Reviewed:** 2026-06-17

## Open issues

- [ ] **[P2] Sticky header z-index stacking conflict** — When table has stickyHeader=true AND rows are selected (background: primary-subtle), the header stays at z-index: 1 but selected rows may paint *over* it visually if they scroll up. The header's inset shadow (box-shadow: inset 0 calc(-1 * var(--border-thin))...) doesn't always clip selected-row color. _Fix:_ Ensure selected row background is lighter or add a subtle outline to the header, or use z-index: 2 for header. `Table.jsx:28`

## Verified OK

- **Sorting (client-side):** Click a sortable header to toggle asc/desc. Sort indicator (SVG) rotates 180deg on desc. Numeric columns use number comparison; others use localeCompare.
- **Column alignment:** text-align: start/center/end applied via data-align attribute.
- **Hover rows:** Rows highlight with surface-sunken on hover (when hover=true).
- **Striped rows:** Alternating even rows use color-mix with 55% transparency (readable, not harsh).
- **Row selection highlight:** Selected rows (by key) get primary-subtle background.
- **Sticky header + maxHeight:** Header stays visible as body scrolls. maxHeight triggers overflow-y: auto on the wrapper.
- **Size variant:** sm reduces header/cell padding (space-2/3 vs space-3/4).
- **RTL:** No physical left/right; safe.
- **Accessibility:** Sortable headers are buttons with data-sortable. Semantic <table>.
