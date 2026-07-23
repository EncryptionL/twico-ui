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
- **[#253] Truncated cell/header text gets a `title`** — body cells and header labels ellipsize with no
  native tooltip, so a clipped value (`44.00 CM x 69.00 CM x 1…`) couldn't be read without widening the
  column or opening an editor. The body cell now sets `title` to the **displayed** text — `valueFormatter`
  output when present, else the raw value — but only for a plain **string/number** (a `renderCell` node,
  an actions column, or a mid-edit cell get none, since a stringified title there is meaningless). The
  displayed value is computed once (`display`) and reused by the default renderers so `valueFormatter`
  isn't called twice. Header labels set `title` to `headerName` when it's a string. (The prior code had a
  raw-`val` title that also skipped `valueFormatter` columns and all editable cells.) — fixed 2026-07-16
- **[#252] Footer range overshoot on the last server-mode page** — `Showing X–Y of Z` derived `end` from
  `paged.length`, which during a page change is briefly the **previous** page's full `sizeVal` while
  `start` had already jumped to the last page → `end` overshot the total (`Showing 6,026–6,050 of 6,042`)
  until the fetch resolved. Clamped `end` (and `start`, for an over-far controlled `page`) to `totalRows`
  via `Math.min`. No effect on any non-boundary page. — fixed 2026-07-16
- **[#249] Built-in batch editor stands alone** — the selection toolbar (and thus the Edit button) rendered
  only when `batchActions` was non-empty, so `showBatchEdit` was silently inert on its own: a host whose
  actions are permission-gated to `[]` (update-but-not-delete role) lost batch edit entirely and had to
  invent a dummy action to summon the toolbar. Gate is now `(batchActions.length || hasBatchEditor)` where
  `hasBatchEditor = showBatchEdit && batchEditableCols.length > 0` — the toolbar is the unit (its `{n}
  selected` count + clear button are useful with the editor alone). Identical for existing hosts with
  non-empty `batchActions`; `showBatchEdit={false}` + `batchActions={[]}` still yields no toolbar.
  Documented in datatable.md, replacing the note that called the coupling "pre-existing, unchanged".
  — fixed 2026-07-15
- **[#250] Batch editor survives its own dropdowns** — the batch editor's outside-click handler exempted only
  `.twc-dt__pop` / `.twc-dt__batch`, not twico's **portaled** overlays (`.twc-pop`, rendered to `document.body`
  — a subtree disjoint from the inline popover). An option's `mousedown` bubbles (its `preventDefault` doesn't
  stop propagation), so it dismissed the editor before the option's `onClick` could fire: picking a value in a
  `renderBatchEditCell` combobox staged nothing, and since the built-in **"Add a column…"** `Select` is itself
  portaled, *the editor couldn't be used at all* — the first click closed it. The inline cell editor already
  guarded `.twc-pop` (which is why `renderEditCell` worked and `renderBatchEditCell` didn't); the batch handler
  was the lone outlier. Added the same guard. A regression test must fire a real **`mousedown`** against a real
  **portaled** control — the existing suite used `fireEvent.click` on an inline fixture, so it could not fail on
  this. — fixed 2026-07-15
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
- **[#259] View-state persistence** — `stateKey` (localStorage), `initialState` (seed), and
  `onStateChange` persist/restore the full view state (`DatatableState`: filters, sort, quickFilter, page,
  pageSize, columnOrder/Widths/Visibility/Pinning, density). SSR-safe: storage is read in a **mount effect**,
  never during render, so hydration matches. Two cooperating effects — persist is declared *before* restore so
  its mount run bails (`stateReadyRef` false) instead of overwriting the saved snapshot with defaults; restore
  uses raw setters so it doesn't reset the restored page. The density + `pageSize` prop-sync effects now
  **skip their mount run** (each state already inits to its prop, so the mount run was a redundant reset that
  also clobbered restore) via `…SyncedRef`; the `#45` pageSize-reset behavior is unchanged. `applyState`
  sanitizes against current columns (drops unknown fields, appends new columns, self-heals storage); corrupt
  JSON is caught. Controlled `page`/`pageSize`/`quickFilter` are left alone. 5 tests in
  `tests/datatable-state.test.jsx`. — added 2026-07-17
- **[#261] Reorder grip clipped the selection checkbox** — with **both** `checkboxSelection` and
  `rowReorder`, the drag grip and the checkbox share the one leading pinned cell. That cell is `width: 44`
  with `padding: 0 12px` and `overflow: hidden`, so its 20px content area fit the 20px checkbox alone but
  clipped it once the 14px grip + 4px gap were prepended (38px). Fix: a single `CHK_W` constant
  (`checkboxSelection ? (rowReorder ? 68 : 44) : 0`) now drives the leading column width at **every** site
  (header select-all `th`, body `td`, skeleton, empty-state) **and** `numLeft`/`leadW` (so pinned-column
  offsets and the row-number column shift with it and stay aligned). Keyed on the static `rowReorder` prop,
  not `canReorderRows`, so the width — and the offsets derived from it — don't jump when sorting/grouping
  hides the grip. 3 tests in `tests/datatable-reorder-checkbox.test.jsx`. — fixed 2026-07-23
- **[#263] Grab cursor covered the whole reorderable row** — `.twc-dt__row[data-reorderable] { cursor: grab }`
  put the `grab` affordance over every cell, so a normal hover read as draggable. Removed that rule; the
  `grab` cursor now lives only on `.twc-dt__row-handle` (the grip), with `cursor: grabbing` added on the
  handle's `:active` / `[data-grabbed="true"]` states. The row stays `draggable` (mouse drag from anywhere
  still works) — only the misleading cursor is scoped away. Guarded at the source (jsdom can't compute the
  injected-`<style>` cursor cascade) in `tests/datatable-reorder-cursor.test.jsx`. Follow-up to #261. — fixed 2026-07-23
- **[#265] Truncated cell/header used native `title` → now the twico `Tooltip`** — follow-up to #253.
  Instead of a per-cell `title` (or a Tooltip per cell, which would break the td's ellipsis and be
  expensive), the grid keeps the full value in `data-ovtext` (set only on plain-text cells + string
  headers, same gating as #253) and drives **one** shared Tooltip via pointer/focus **delegation** on
  the `.twc-dt__scroll` container. On hover/focus of a `[data-ovtext]` element it measures
  `scrollWidth > clientWidth` and, only when actually clipped, shows the tip after the same ~120ms
  delay. To reuse the real Tooltip (styling/positioning/flip/timing) with a single instance, `Tooltip`
  gained a backward-compatible **anchored mode** (`anchor` element + controlled `open`) that renders
  only the portaled bubble. Escape dismisses (WCAG 1.4.13). 4 tests in
  `tests/datatable-overflow-tooltip.test.jsx`; the #253 test now asserts `data-ovtext`. — fixed 2026-07-23
- **[#267] Grab cursor covered the whole column header** — the column analog of #263.
  `.twc-dt__th-label[draggable="true"] { cursor: grab }` put the affordance over the entire header, so
  hovering to read/sort/open the ⋮ menu read as draggable. Removed that rule (the label keeps its
  `cursor: pointer` for sort); the `grab` cursor now lives on the header grip (`.twc-dt__grip`), with
  `cursor: grabbing` on `:active` / `.twc-dt__th[data-dragging]`. The header stays `draggable` (mouse
  drag from anywhere still reorders the column) — only the cursor is scoped away. Source-guarded (jsdom
  can't compute the injected-`<style>` cursor cascade) in `tests/datatable-reorder-cursor.test.jsx`. — fixed 2026-07-23
- **[#269] Filter-builder column dropdown clipped long option labels** — the field `Select` (and every
  `Select`) now sets a native `title` equal to a string option's label, so a name clipped by the option's
  ellipsis is still discoverable on hover. Native `title` (not the #265 Tooltip) because options live in a
  portaled, virtualized listbox where a Tooltip per option is impractical. A custom-node label gets none.
  Test in `tests/Select.test.jsx`. — fixed 2026-07-23
- **[#270] `filterType` — filter operators decoupled from edit `type`** — a value+unit measurement must
  edit as `type: "string"` (a number column coerces its commit with `Number()`, wiping the pair), but can
  now present numeric filter operators via `filterType: "number"`. A module-level `filterTypeOf(col)`
  (`col.filterType ?? type`) drives the filter operator set (`opsFor`), the filter value input type, and
  `testFilter`'s comparison type — in the builder, the client filter, **and** `runDatatableQuery` (so
  server-mode parity holds). Sort still uses the edit `type`. Numeric comparison uses the column's
  `valueGetter`, so a measurement column returns its numeric value for filtering. 3 tests in
  `tests/datatable-filter-type.test.jsx`. — added 2026-07-23
- **[#271] Grab cursor covered the whole columns-panel row** — the columns show/hide panel analog of
  #263/#267. `.twc-dt__col-row[draggable]` set `cursor: grab` over the whole row (name + visibility
  toggle). Removed it (the row keeps its `cursor: pointer` toggle); the `grab` cursor now lives on the
  `.twc-dt__col-grip`, with `cursor: grabbing` on `:active` / `[data-dragging]`. The row stays a drag
  source. Source-guarded in `tests/datatable-reorder-cursor.test.jsx`. — fixed 2026-07-23
- **[#273] Esc didn't cancel a cell edit for custom `renderEditCell` editors** — the built-in text
  editor (via `onEditKey`) and built-in Select editor already handled Escape, but the custom-editor
  wrapper had no keydown, so Esc did nothing for a `renderEditCell` control (which only gets
  `commit`/`cancel`, not a keydown). The `.twc-dt__editor-wrap` around `renderEditCell` now handles
  **Escape → `cancelEdit()`** (mirroring the built-in Select editor), so it works for every custom
  editor without each wiring a handler. A custom control that wants Escape for itself (e.g. to close its
  own open dropdown) stops propagation first. `onGridKeyDown` already bailed while editing, so no
  interference. 3 tests in `tests/datatable-edit-escape.test.jsx` (built-in + custom + stopPropagation
  contract). — fixed 2026-07-23

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

