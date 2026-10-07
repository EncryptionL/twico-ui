# QA notes — Table

- **Group:** data-display
- **Status:** clean
- **Reviewed:** 2026-06-17

## Open issues

- [x] **[P2] Sticky header z-index stacking conflict** — ✓ fixed 2026-06-17 (header bumped to z-index: 2 so a selected row's tint can't paint over it). When table has stickyHeader=true AND rows are selected (background: primary-subtle), the header stays at z-index: 1 but selected rows may paint *over* it visually if they scroll up. The header's inset shadow (box-shadow: inset 0 calc(-1 * var(--border-thin))...) doesn't always clip selected-row color. _Fix:_ Ensure selected row background is lighter or add a subtle outline to the header, or use z-index: 2 for header. `Table.jsx:28`

- [x] **[#462 review 2] the empty-state message fails once its row is hovered** - the empty state is a real `<tr>`/`<td>` inside `<tbody>`, `hover` defaults to **true**, and the hover rule sets a sunken background without setting a colour, so "No data" sat at 4.34:1 under the pointer. Now text-muted. `Table.jsx:34` - fixed 2026-10-07

- [x] **[#462 review 2 - refuted, recorded so it is not re-fixed]** a reviewer flagged `.twc-dt__diff-arrow` and `.twc-dt__combine-sep` as missed quiet-text sites. Both are `aria-hidden="true"` decorative glyphs, so they owe 3:1 rather than 4.5:1 and `--color-text-subtle` at 4.34:1 clears it. No change. (An earlier round had classified them correctly; this one did not.) - fixed 2026-10-07

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
