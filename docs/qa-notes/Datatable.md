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
- **[#284] Persisted column order appended new columns at the end** — follow-up to #259. When a `stateKey`
  table's saved `columnOrder` was restored and the `columns` prop had since changed (a column added/replaced),
  the still-known columns kept their saved positions but new columns were **appended at the end** — so
  replacing a leading `value` column with two new ones pushed them behind the trailing audit columns. Fixed
  with a shared `mergeColOrder(saved, propFields)`: keep saved order for present columns, drop removed ones,
  and insert each added column at its **prop-relative** position (right after the nearest preceding prop
  column already placed, else before the nearest following one). Used in **both** `applyState` (restore) and
  the runtime columns-sync effect (previously `[...kept, ...added]`), so a changed set follows the code order
  in every path. Existing #259 "drops unknown columns" behavior is unchanged (no new columns → same result).
  2 tests in `tests/datatable-state.test.jsx` (restore + runtime add). — fixed 2026-07-24
- **[#286] Toolbar had no extension slot** — hosts had to hack an "Add row" button in by padding the internal
  `.twc-dt__toolbar` class and absolutely positioning over it. New `toolbarActions?: React.ReactNode` renders a
  custom node in a **leading slot** (`.twc-dt__toolbar-actions`, an inline-flex cluster) at the start of the
  toolbar row, before the Columns/Filters cluster — mirroring `CardGrid`'s `toolbar` prop. Omitted entirely
  when not passed. 2 tests in `tests/datatable-toolbar-actions.test.jsx` (leading placement + absence). — added 2026-07-28
- **[#289] Filter panel column/operator fields truncated labels (fixed 118px)** — `.twc-dt__f-col` /
  `.twc-dt__f-op` were hard-pinned to 118px, so real `headerName`s ("Article Number", …) and longer
  operators ellipsized before any interaction; consumers can't patch runtime-injected CSS. Now the fields
  **auto-fit the widest label**: a mount effect measures the widest *option* (via a reused canvas, using the
  live sm-trigger font) — not the selected value, so width is stable across selection and identical across
  rows — and writes `--twc-dt-fcol-w` / `--twc-dt-fop-w` on the panel. Clamped: col `118..210`, op
  `118..170`, where 210 is derived from the **live** panel width (`ResizeObserver` re-measures on the
  responsive `calc(100vw - 32px)` cap) so the value input keeps its 140px floor inside 580px; CSS
  `max-width` is the hard backstop and `.twc-dt__frow` gains `flex-wrap` as a safety net. Re-measures after
  `document.fonts.ready` (FOUT) and once a real trigger mounts. Guarded against NaN padding / missing canvas
  (jsdom). 2 tests in `tests/datatable-filter-width.test.jsx` (CSS source + measured widen). Supersedes the
  hover-only reveal from #269. — fixed 2026-07-29
- **[#292] Resizable Filters popover + fields** — manual-override follow-up to #289 (`resizableFilters`,
  default on; `filterFieldMaxWidth` raises the cap). Panel corner grip (2-axis) + per-field handles
  (col/op/val). Coexists with the #289 auto-fit via a **pure-CSS two-tier cascade** — `clamp(min,
  var(--…-usr, var(--…-fit, fallback)), --…-cap)`: the measurer writes only `-fit`, a drag writes only
  `-usr` (wins), reset removes `-usr` (auto-fit re-wins); neither reads the other, so no re-measure race and
  no JS "is-overridden" flag. Value field's first drag flips `flex:1`→fixed (`data-val-fixed`); its cap is
  read from **live `getBoundingClientRect` widths**, not React state (which is `undefined` on the first drag
  → would `NaN`). Height pin → `data-panel-sized` scrolls `.twc-dt__frows` (safe: filter Selects portal to
  `<body>`). Live drags write vars imperatively; commit on pointerup/keystroke → `onStateChange`/localStorage
  (persist effect deps extended with `fWidths`/`fPanelSize`). Persisted `filterPanelSize`/`filterFieldWidths`
  on `DatatableState`, viewport-re-clamped on restore. Keyboard: Arrow/Shift/Home/End + Enter/Space/Backspace
  reset; grip `aria-valuetext` announces both axes; "Reset sizes" header action. `fWidths`/`fPanelSize` state
  declared before the persist effect (deps evaluate at render → TDZ if declared later). 10 tests in
  `tests/datatable-filter-resize.test.jsx`. Non-breaking (injected styles hide the `-w`→`-fit` rename).
  — added 2026-07-29

- **[#296] serverMode rowReorder overlay never reset on a `rows` change** — a drop sets an **internal**
  `rowOrder` that server-mode display re-sorts `rows` by; it was never cleared, so once the user dragged, the
  table kept re-applying that stale order to every `rows` prop. A parent could neither **revert** a rejected
  reorder (reload authoritative order → no effect) nor **reflect** a server-corrected order, except by
  remounting (`key` bump → loses page/selection/scroll). _Fix:_ treat the drag order as an **optimistic
  overlay** — `useEffect(() => { if (serverMode) setRowOrder(null); }, [rows, serverMode])`, so the next
  `rows` reference the parent hands us clears it (reload reverts, no remount). **Client mode is deliberately
  excluded**: there the overlay is the source of truth and must survive unrelated `rows` updates (e.g. a cell
  edit), so it is not reset. A drag doesn't touch the `rows` prop, so the optimistic order still sticks until
  the parent reloads. 3 tests in `tests/datatable-roworder-reset.test.jsx` (server reset + client-mode
  persistence + source-guard). — fixed 2026-07-29

- **[#298] `stateKey` persistence clobbered under React Strict Mode + async columns** — dev-only (Next.js
  Strict Mode double-mounts): a user's filters/column order/visibility/pinning/sort/density/page were wiped
  on refresh; production was fine (no double-invoke). Two root causes, all the same shape — a ref set
  synchronously with no cleanup, so Strict Mode's setup → cleanup → setup fake-remount misreads setup B as
  a real change while the restored `setState` from setup A hasn't committed:
  1. **Write gate** (`stateReadyRef`) stayed `true` across the remount → setup B's persist effect serialized
     the DEFAULT state and wrote it over the saved snapshot. _Fix:_ the restore effect now
     `return () => { stateReadyRef.current = false; }` so the write re-gates until restore re-runs.
  2. **Prop-sync guards** (`densitySyncedRef`/`pageSizeSyncedRef`) were boolean "have I run once" flags →
     setup B ran their prop-changed branch (`setDensity(prop)` / `setInternalPage(0)`), clobbering the
     restored density/page. _Fix:_ compare the previous prop **value** instead (the Strict-Mode-safe pattern
     `rowGroupingKeyRef` already used) — an unchanged value on setup B is a no-op.
  3. **Async columns** — if `columns` was empty at mount (a catalogue that loads later), `applyState`
     filtered every saved field against an empty column set and dropped it, then the first settle persisted
     the emptied state (same permanent clobber, non-Strict-Mode trigger). _Fix:_ defer restore until
     `columns` exist, applied at most once via `stateRestoredRef` (a second effect keyed on `columns.length`),
     and keep the write gated (`stateReadyRef` false) until then. A later columns change can't re-apply the
     stale snapshot over live edits. 3 tests in `tests/datatable-state-strictmode.test.jsx` (source-guard +
     Strict Mode preserve + async-columns restore). — fixed 2026-07-29

- **[#302] Hidden-but-pinned column left a ghost pinned slot** — `pins.{left,right}` and the `hidden` Set are
  independent state; `stickyOf` accumulated the sticky offset over the RAW `pins` arrays, so a pinned column
  that was then hidden (no rendered cell) still reserved its width — a phantom sticky strip the scrolling body
  showed through — and the pin-edge shadow landed on the wrong column. _Fix:_ derive `visLeft`/`visRight`
  (visible pinned fields: `pins.side.filter(f => colByField[f] && !hidden.has(f))`) and drive ALL layout from
  them — offset accumulation, `isEdge` (`visLeft[last]`/`visRight[0]`), and the six lead checkbox/row-number
  `data-pin-edge` gates (`visLeft.length`). `pins` stays raw for persistence + membership, so un-hiding a
  column restores its pin position. 3 tests in `tests/datatable-hidden-pin-ghost.test.jsx`. — fixed 2026-07-31

- **[#303] Filter panel: explicit AND/OR + discoverable same-column condition** — the panel was a flat,
  implicitly-AND-ed list with no way to express OR and no obvious "add a second condition on this column".
  _Added:_ `filterLogic?: "and" | "or"` (default `"and"`, back-compat) on `DatatableQuery` + `DatatableState`,
  surfaced as an **AND/OR segmented toggle** in the panel head (shown with 2+ clauses). BOTH filter engines
  honor it — the client `processed` memo and the exported `runDatatableQuery` switch from sequential `.filter`
  (AND) to `.some` (OR), guarded so zero clauses never blanks the grid; parity is required so client and server
  modes agree. It threads through `serializeState`/`applyState`/`onServerChange` (+ all three dep arrays). A
  per-row **`+`** ("Add another condition on <col>") appends a same-field clause via the existing `addFilter`,
  making same-column AND discoverable (repeated same-field clauses already AND end-to-end). 12 tests in
  `tests/datatable-filter-logic.test.jsx` (engine AND/OR/empty-set/same-column, client parity, toggle, add,
  round-trip). — added 2026-07-31

- **[#304] `resizablePopovers` — resize the other toolbar panels too** — only the Filters panel was resizable
  (#292). `resizablePopovers` (default false) extends a corner grip + `role="slider"` keyboard resize (Arrows,
  Home/End, Enter/double-click to reset) to the **Columns, Aggregation, Pivot, and Batch-edit** panels, so a
  wide grid's Columns list (was capped at 268px × 230px) can be enlarged. Implemented as a generic engine:
  `popSizes` keyed by popover id, a `closest(".twc-dt__pop")`-based `startPopResize`/`onPopGripKey` (no per-panel
  ref), and a `.twc-dt__pop[data-pop-sized]` rule that overrides each panel's default/inline width and lets its
  inner scroll list flex to fill — **without** setting `position` (the panel keeps `position: fixed`; the
  absolute grip anchors to it — re-learning the #294 lesson). Sizes persist independently as
  `popoverSizes: Record<popoverId, {w,h}>` on `DatatableState` (the #292 Filters keep their richer panel-size +
  per-field-width resize, untouched, and independently gated by `resizableFilters` — see #314). Per-popover min clamps
  (Columns/Agg 240, Pivot/Batch-edit 260) + shared max `calc(100vw/100vh − 32px)`. 8 tests in
  `tests/datatable-resizable-popovers.test.jsx`. — added 2026-07-31

- **[#313] Default cell editor discarded a typed value on click-away** — the outside-click effect runs in the
  **capture** phase and called `setEditing(null)`, unmounting the editor *before* the input's `onBlur → commit`
  could fire, so only Enter committed; a click-away silently lost the edit (and `commitEdit` then early-returned
  on the now-null `editing`). _Fix:_ in that handler, a **default** editor (no `renderEditCell`) now
  `commitEdit()`s the pending `editing.value` (spreadsheet-like) instead of discarding; a `renderEditCell`
  column is still just dismissed (it owns its commit/cancel via the provided callbacks). Enter still commits,
  Escape still cancels. 3 tests in `tests/datatable-edit-clickaway.test.jsx`. — fixed 2026-07-31

- **[#314] `resizablePopovers` now defaults `true`** (DX follow-up to #304) — it shipped default-`false`, so
  every non-Filters popover was non-resizable unless each `<Datatable>` opted in (15+ call sites in the
  reporter's app). It now defaults `true`, matching `resizableFilters`, so Columns/Aggregation/Pivot/Batch-edit
  are drag-resizable everywhere by default; pass `resizablePopovers={false}` to opt a grid out. Additive
  (opt-out preserved), not breaking. Test flipped + opt-out test added in
  `tests/datatable-resizable-popovers.test.jsx`. — changed 2026-07-31

- **[#316] Second (bottom-left) popover resize grip** — the resizable popovers had one grip in the
  bottom-inline-end corner; a right-anchored panel (Columns/Agg/Pivot/Batch-edit sit near the grid's right
  edge) had no room to grow rightward. `startPopResize` is now parametrized by grip **side**: the new
  `data-side="start"` grip grows the panel leftward while **pinning the right edge** (drag/keyboard shift
  `pop.style.left` down by the width delta) and commits a `left` into `popSizes[id]` (persisted +
  viewport-clamped on restore) so the shift survives React re-render; `popStyle` emits that `left`. Both
  grips render per panel. — added 2026-08-03

- **[#317] Rectangular cell range selection + ARIA** — `selectionMode="cell"` had a single `activeCell` and
  no `aria-selected`. Added an `anchorCell` and a `cellRect` memo that resolves anchor+active `{key,field}`
  endpoints to live row/col indices (`keyIndex` / `ordered.findIndex`) so the rectangle **follows rows across
  sort/filter/paging** and collapses safely when an endpoint is filtered out (no NaN). Cells in the rectangle
  get `aria-selected` + `data-cell-selected`; the grid gets `aria-multiselectable` + `aria-activedescendant`
  (a `React.useId` prefixed cell id). Shift+Click / Shift+Arrow extend from the anchor; a plain click/Arrow
  starts a new single-cell selection (keyboard nav now moves the selection, spreadsheet-style). New
  `onCellSelectionChange(cells)` fires (deduped by signature) with the row-major `{key,field}[]`. — added 2026-08-03

- **[#318] Keyboard clipboard with format-restricted paste** — `enableClipboard` (default false, `"cell"`
  mode) adds **Ctrl/Cmd + C/X/V**: copy the active cell/range as **TSV**, cut (copy then clear), paste onto
  the target rectangle from the active cell. Paste is **format-restricted** — each column has an opaque
  `copyType` (default number-vs-text bucket by `type`); on an **in-app** paste a source cell only writes to a
  target when their `copyType` match, else it is **skipped** (never a silent wrong write). External pastes
  (no source metadata) rely on the per-column number coercion. Writes go through a **single batched**
  `onRowsChange` (+ `onRowUpdate` per changed cell) — mirroring `applyBatchEdit`, NOT per-cell `commitEdit`
  (which is editing-state-bound and would fire N changes). Outcomes announced via an `aria-live` region
  ("Copied 4 cells", "Pasted 3 cells, 1 skipped (incompatible column)"). `navigator.clipboard` is
  SSR/permission-guarded with an `execCommand` fallback. 8 tests in `tests/datatable-cell-selection.test.jsx`
  (+ #316/#317 coverage there and in `datatable-resizable-popovers.test.jsx`). — added 2026-08-03

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

