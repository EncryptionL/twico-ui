# QA notes — Datatable

- **Group:** data-display
- **Status:** open (2 issues)
- **Reviewed:** 2026-06-17

## Open issues

- [ ] **[P1] Sticky header z-index collision with pinned columns** — The header is z-index: 3, pinned columns (left/right) are z-index: 4–5, but when a column is pinned and sticky, their stacking context may cause the header to visually hide behind the pinned cell if the row is selected (primary-subtle background extends under the header). _Fix:_ Ensure pinned column header cells have z-index: 5 and selected-row bg doesn't extend into the sticky zone, or add a subtle separator line. Full Datatable RTL (pinned/pivot/resizer) is accepted as a known limitation.

- [ ] **[P2] Column resize handle position in RTL** — The resizer is positioned `right: 0`, which is correct for LTR but becomes `left: 0` in RTL, placing the handle on the wrong (leading) edge of the column. _Fix:_ Change `right: 0` to `inset-inline-end: 0` so it positions logically. `Datatable.jsx:107`

## Verified OK

- **Toolbar:** Collapse to icon-only when compact (data-compact="true"), search flex-shrinks intelligently.
- **Sticky header (z-index: 3):** Stays above scroll area; inset box-shadow separator visible.
- **Sticky footer (aggregation):** Bottom-sticky, z-index: 3; tfoot visible during scroll.
- **Column menu (⋮):** Hidden by default, visible on hover. sort/filter dots show filter state.
- **Sort indicator:** Rotate 180deg on desc; opacity transitions show/hide on header hover.
- **CSV export:** Split-button (export main + dropdown for format). Tooltip via data-tip attribute.
- **Pagination:** Footer pagination respects pageSize selector (5/10/25/50 default). Go-to jumper hidden when <= 5 pages.
- **Checkbox selection:** Column 1 if checkboxSelection=true. Entire-column header checkbox selects all visible rows.
- **Row numbers:** Starts at 1 per page, sticky-left after checkbox column. Updates on sort/filter.
- **Density modes (compact/standard/comfortable):** Row height adjusted (36/44/56px); toolbar compacts when space narrow.
- **Edit mode:** Double-click cell to inline-edit. Respects per-column editType (text/number/select).
- **Server mode:** Doesn't sort/filter internally; fires onServerChange with query state.
- **Virtualization:** Enabled when pageSize=0 + virtualized=true + no grouping. Rows measured & cached by key.
- **Keyboard a11y:** Grid role, column menu accessible via keyboard, edit mode Enter/Escape, selection via Shift+Click or Ctrl+Click.

