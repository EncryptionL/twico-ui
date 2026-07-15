# QA notes — Datatable

- **Group:** data-display
- **Status:** clean
- **Reviewed:** 2026-06-17

## Open issues

- [x] **[P1] Sticky header z-index collision with pinned columns** — ✓ fixed 2026-06-17 (pinned header cells bumped to z-index 5, above pinned body cells/selected-row bg). The header is z-index: 3, pinned columns (left/right) are z-index: 4–5, but when a column is pinned and sticky, their stacking context may cause the header to visually hide behind the pinned cell if the row is selected (primary-subtle background extends under the header). _Fix:_ Ensure pinned column header cells have z-index: 5 and selected-row bg doesn't extend into the sticky zone, or add a subtle separator line. (Full Datatable RTL — pinned offsets, pivot borders, edge shadows, resizer — was implemented 2026-06-17 via logical properties; this z-index edge is the only remaining item.)

- [x] **[P2] Column resize handle position in RTL** — The resizer is positioned `right: 0`, which is correct for LTR but becomes `left: 0` in RTL, placing the handle on the wrong (leading) edge of the column. _Fix:_ Change `right: 0` to `inset-inline-end: 0` so it positions logically. `Datatable.jsx:107` — ✓ fixed 2026-06-17

## Enhancements

- **[#229] Column `width: "auto"` + `minWidth`/`maxWidth`** — `DatatableColumn.width` is now `number | "auto"`.
  "auto" resolves to the header's intrinsic width (`AUTO_CHROME` 74px + ~8px/char label) so a short column
  fits without truncating or wasting the 160px default; `minWidth`/`maxWidth` clamp the result (incl. user
  resizes) via a centralized `widthOf`/`intrinsicWidth`/`clampWidth`. Resize handlers rebased off
  `intrinsicWidth(c)` so an `"auto"` column no longer computes `"auto" + delta` → `NaN`. Double-click still
  content-fits exactly (`autoFitColumn`). — added 2026-07-13
- **[#227] `wrappable` column flag** — gates the "Wrap text" ⋮-menu item (default true), matching the
  `groupable`/`pinnable`/`reorderable` per-column pattern; a column can now show only Sort + Hide. — added 2026-07-13
- **[#228] Move-menu bug** — `reorderable: false` (or any non-movable column) previously rendered the
  "Move left/right" items **disabled**; the guard now also requires `c.reorderable !== false` and
  `movableMidFields.length > 1`, so they're **omitted** entirely, consistent with Group/Pin/Hide. — fixed 2026-07-13
- **[#232] Async filter value options** — a column can supply `loadValueOptions(query) => Promise<…>` so
  the "is any of" filter picker loads a searchable, server-backed reference/master list instead of a static
  `valueOptions` (heavy) or the incomplete page-derived fallback. The module-level `AsyncFilterValue`
  drives a `MultiSelect` via the #208 async surface (`onInputChange` + `filter={false}` + `loading`),
  primes with `loadValueOptions("")`, debounces 250 ms, guards stale responses by request id, and merges
  in selected-but-unlisted values. Precedence over `valueOptions` for the filter picker; values stay raw. — added 2026-07-13
- **[#235] Externalized quick-search** — `searchable` (default true) gates the built-in toolbar search box;
  `quickFilter` + `onQuickFilterChange` make the quick-filter controlled (mirrors CardGrid). The value flows
  into client filtering and the `onServerChange` query, so a host can render its own search input.
  Uncontrolled unless `quickFilter` is set (internal `internalQuick` + `commitQuick`). — added 2026-07-14
- **[#236] `renderEditCell` escape hatch** — a column can render its own inline editor (searchable/creatable/
  async `Combobox`, `MasterCombobox`, …) via `renderEditCell({ value, row, field, commit, cancel })`.
  It makes the column editable (double-click) unless `editable:false`, takes precedence over the built-in
  select/text editor, and is wrapped in `.twc-dt__editor-wrap`; twico overlay dropdowns portal as `.twc-pop`,
  both exempt from the outside-click auto-cancel so a Combobox popover works inside the cell. Pairs with
  `loadValueOptions` (#232) to back both filter + editor from one master vocabulary. — added 2026-07-14
- **[#239] `diff` mode** — re-homes the diff feature (was standalone `DiffTable`) onto the Datatable engine.
  Implemented as a top-of-component transform: `columns`/`rows` are shadowed — `classifyDiff` (shared
  `components/_diff.js`) pairs `diff.from`↔`diff.to` + classifies; effective rows = classified rows (base
  `to ?? from`, only-changed filtered, carrying `__diffMeta`, keyed by business key); effective columns =
  user columns wrapped with a diff-aware `renderCell` + a prepended left-pinned "Change" op-badge column.
  The whole existing engine then renders it, so density/resize/pin/reorder/sort/filter/quick-search/
  grouping/export/virtualization/pagination are all inherited. Toolbar summary (`+N ~M −K ⇅`) + only-changed
  toggle injected; rows tinted via `data-op`. Modified cells are single-line/clipped (no `flex-wrap`
  blowup). `DatatableColumn.compare` added; `rows` made optional. `DiffTable` kept as a thin wrapper
  (API unchanged) delegating to `<Datatable diff={…} />`. — added 2026-07-14
- **[#247] Batch clause honors a custom control** — the batch editor derived each clause's control only from
  `valueOptions` (static array → `Select`, else text `Input`) and never consulted `renderEditCell`, so a
  column with a rich inline editor degraded to a bare text box in batch. New `DatatableColumn.renderBatchEditCell({
  value, field, commit })` takes precedence over `valueOptions`. Kept as a **separate** hook from
  `renderEditCell` (no `row`, no `cancel`; `commit` only *stages* the draft until Apply) — and deliberately
  **no** silent fallback to `renderEditCell`, which would hand `row: null` to #236 handlers that read `row`.
  — fixed 2026-07-15
- **[#246] `batchActions` get their trigger element** — a custom batch action received only
  `(keys, rows, clearSelection)`, so it could never anchor a popover to its own toolbar button (the built-in
  editor can, via `openBatchEditor(e.currentTarget)`) and was stuck opening a centered modal. `onClick` now
  gets a 4th arg `ctx: { anchorEl }` — that action's own button. Additive/non-breaking (appended arg; each
  action gets its own button). New exported type `DatatableBatchActionContext`. — fixed 2026-07-15
- **[#244] Batch editor: pick-then-edit + escape hatches** — the editor pre-rendered a row per editable
  column (unusable at ~90: scrolling a long list in a 320px popover) and couldn't be disabled or replaced.
  Now it opens **empty** with a searchable "Add a column…" `Select`; picking appends a row (name + value
  input + remove ✕), and Apply is disabled until ≥1 column is picked — matching the state's existing
  `fields: {}` ("choose what to change") intent. New `showBatchEdit` (default true) suppresses the built-in
  button so a host can ship its own `batchActions` entry without a duplicate "Edit"; new `batchEditFields`
  allow-lists the offered `field`s **without** touching `editable` (which would also kill inline editing).
  Note the selection toolbar — and thus the Edit button — only renders when `batchActions` is non-empty
  (pre-existing, unchanged). — fixed 2026-07-15
- **[#242] Diff pinned cells went transparent** — the #239 op-tint rule
  `.twc-dt__row[data-op] > .twc-dt__td` (specificity 0,3,0) composited over `transparent` and
  out-specified the base `.twc-dt__td { background: --color-surface }`, so **pinned** (sticky) cells in a
  diff row lost their opaque fill and the cells scrolling under them bled through. Fix: added
  `[data-op] > .twc-dt__td[data-pin]` rules (0,4,0) that composite the same tint over `--color-surface`
  (opaque, and visually identical to the non-pinned cells' effective color). Guarded by a source check in
  `tests/datatable-diff.test.jsx` (jsdom can't compute the injected-`<style>` cascade). Active/selected and
  pinned-row cells were already opaque (`--color-primary-subtle`), so unaffected. — fixed 2026-07-14

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

