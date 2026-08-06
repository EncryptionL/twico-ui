Advanced data table (Material UI Data Grid Premium style). Columns are sortable,
filterable (per-column operators + a quick search), hideable (with a searchable
column list), pinnable (left/right, sticky), **drag-to-reorder**, and **drag-to-resize**.
Includes a column/filter toolbar, density control, **export** (CSV/Excel), an optional
**aggregation/summary footer**, optional checkbox selection with a **batch-action
toolbar**, an **actions column** (per-row icon buttons + overflow menu), page-number
**pagination** with a rows-per-page selector, and a skeleton loading state. The filter
dropdowns, value field, and pager are composed from the Twico `Select`, `Input`, and
`Pagination` components, so they match the rest of the system.

```jsx
import { Datatable } from "./Datatable";

<Datatable
  loading={isLoading}
  checkboxSelection
  rowNumbers
  pageSize={10}
  rowKey={(r) => r.id}
  columns={[
    { field: "name", headerName: "Name", width: 200 },
    { field: "email", headerName: "Email", width: 220 },
    { field: "role", headerName: "Role", width: 130 },
    { field: "status", headerName: "Status", width: 130,
      renderCell: (v) => <Badge tone={v === "Active" ? "success" : "neutral"} dot>{v}</Badge> },
    { field: "mrr", headerName: "MRR", type: "number", width: 110,
      valueFormatter: (v) => `$${v}` },
  ]}
  rows={users}
/>
```

**Interactions**
- **`rowNumbers`** adds a sticky-left auto-numbered gutter (1, 2, 3…) that follows the current
  sort/filter order and continues across pages (server mode uses page × pageSize); it sits after the
  checkbox column. The prop is the initial state — users can hide/show it from the **Columns** panel
  or the `#` header's ⋮ menu ("Hide column").
- Click a header to cycle sort (asc → desc → none); the **⋮** menu has sort, filter, group, move, pin left/right, **wrap text** (multi-line cells instead of clipping — also seedable per column via `wrapText`), and hide.
- **Drag a column header** to reorder (middle, non-pinned columns), **or drag rows in the Columns panel** to reorder any column; **drag the right edge** of a header to resize it, or **double-click** that edge to auto-fit the column to its content (Excel-style).
- **Inline editing** — set `editable: true` on a column (or `editMode` on the grid for all columns) and **double-click a cell** to edit. Enter or blur commits, Esc cancels. Columns with `valueOptions` edit via a searchable dropdown; number/currency columns get a number input.
- **Combined columns (#338)** — set `combine: ["firstName", "lastName"]` (shorthand) or `combine: { fields, layout, separator, labels }` on a column to show several other columns' values in one cell. Twico auto-derives the value (so sort, filter, quick-search, grouping, aggregation, and export all operate on the combined text) and the render, reusing each source column's `valueFormatter`. `layout: "inline"` (default) joins with `separator` (default `" · "`); `layout: "stack"` puts each on its own line and auto-wraps the row; `labels` prefixes each value with its source column's header. Display-only (never inline-editable).
- **Batch edit** — with `checkboxSelection`, selecting rows shows an **Edit** button in the selection toolbar (when editable columns exist). It opens a panel to set one or more columns at once and **Apply** them to every selected row; fires `onBatchUpdate(changedRows, patch, selectedKeys)` plus `onRowsChange`.s` (or `editType: "select"`) edit via a dropdown; number columns get a number input. On commit the grid calls `onRowUpdate(updatedRow, originalRow, field)`; pass `onRowsChange` to also receive the full next rows array (client mode).
- **Export** is a split button: clicking it downloads the current view as **CSV** by default; the chevron opens a format menu (**CSV**, **Excel `.xlsx`**). Exports all filtered+sorted rows client-side (the loaded page in server mode). Customize a column's exported value with `exportValue`.
- **Columns** toolbar button → a searchable, **drag-to-reorder** panel of visibility toggles, each row also with **pin left / pin right** controls (so you can pin any column without scrolling its header into view). **Filters** opens empty — add rows manually with **Add filter**
  (string: contains/equals/is any of/starts/ends/empty; number: =, ≠, >, ≥, <, ≤) built from `Select` + `Input`.
- **And / Or connector** (MUI DataGrid-style, #330): each filter row after the first shows an inline **And ▾ / Or ▾**
  select — row 1 reads *Where*, the second row hosts the editable connector, and the rest echo it. It's a single,
  set-wide connective (like MUI's `logicOperator`), so `"premium" OR "eco"` on one column matches **either**.
  Control it with `filterLogic` (`"and"` | `"or"`) + `onFilterLogicChange` (or seed the uncontrolled default with
  `defaultFilterLogic`); it's included as `filterLogic` in the `onServerChange` query so server mode can group its WHERE.
- **Density** cycles row height. The search box quick-filters across visible columns; a trailing **✕** clears it once you type (the Columns-panel find box and each per-column filter **value** input clear the same way).
- **`toolbarActions`** injects a custom node into a **leading slot** of the toolbar (before Columns/Filters) —
  e.g. an "Add row" button or bulk actions — mirroring `CardGrid`'s `toolbar` prop, so no internal-class hacks:
  `<Datatable toolbarActions={<Button size="sm" leftIcon={<PlusIcon/>}>Add row</Button>} … />`.
- **Resizable Filters** (`resizableFilters`, default `true`) — drag the Filters popover (bottom-inline-end grip)
  and its connector/column/operator/value fields (per-field handles) wider/narrower; layered over the auto-fit (a
  drag overrides the measured width, reset returns to it). The And/Or connector is a resizable field like the
  others — it auto-fits its label so it never truncates and can still be widened manually (#330). Keyboard-accessible (Arrow/Shift/Home/End, Enter=reset),
  persists via `stateKey`, and a "Reset sizes" header action clears it. `filterFieldMaxWidth` raises the field cap.
- **Empty state** — `emptyMessage` (filter-aware by default) or `renderEmpty` customizes the zero-row body; a
  column can opt out of reorder with `reorderable: false`; row actions use the twico `Tooltip` (not native `title`).
- Footer shows the showing-range/total, a rows-per-page `Select` (options via `pageSizeOptions`), page-number `Pagination`, and a **"Go to" page jumper** (when >5 pages; toggle with `showPageJumper`). Pinned columns stay frozen.

**Server-side mode** — for large datasets, don't load everything at once:

```jsx
<Datatable
  serverMode
  rows={page.rows}            // current page only
  rowCount={page.total}       // total on the server
  loading={fetching}
  pageSize={25}
  pageSizeOptions={[25, 50, 100]}
  columns={columns}
  onServerChange={({ page, pageSize, sort, filters, quickFilter, visibleColumns }) => {
    fetchFromApi({ page, pageSize, sort, filters, quickFilter, columns: visibleColumns });  // fetch + setState
  }}
/>
```

In server mode the table never sorts/filters/paginates locally — it just renders the rows you give it and
calls `onServerChange` (debounced) whenever the query changes, so your backend does the work.

The query also carries `visibleColumns`/`hiddenColumns` (field ids; the built-in **Columns** menu is the
source of truth), so a wide table can **project only the shown columns** server-side. For a change-only
signal use `onColumnVisibilityChange={(visible) => …}` — it fires with the visible column `field`s whenever
the menu toggles a column (not on mount), so you can drive projection off the built-in menu without adding a
duplicate column picker.

**Controlled pagination** — drive the page (and page size) from your own state / external controls. Pass
`page` (0-based) with `onPageChange`; supply `onPageSizeChange` to also control `pageSize`. Both follow the
hand-rolled controlled/uncontrolled rule (the callback always fires; internal state only moves when the prop
is uncontrolled). Changing an **uncontrolled** `pageSize` prop now re-applies and resets to page 0.

```jsx
const [page, setPage] = React.useState(0);
const [size, setSize] = React.useState(25);
<Datatable
  columns={columns}
  rows={rows}
  page={page}
  pageSize={size}
  onPageChange={setPage}          // required to control `page`
  onPageSizeChange={setSize}      // supplying this makes `pageSize` controlled
/>
// pairs naturally with serverMode: fetch on onServerChange, drive page from your URL / store.
```

**View-state persistence** — remember how the user set up the grid across reloads. Give a `stateKey` and the
full view state (filters, sort, quick-search, page, page size, column order / widths / visibility / pinning,
density) is saved to `localStorage` and restored on mount:

```jsx
<Datatable stateKey="users-grid" columns={columns} rows={rows} />
```

`initialState` (a `Partial<DatatableState>`) seeds the state the first time — used only when `stateKey` has
nothing stored yet. `onStateChange(state)` reports the complete `DatatableState` on every change, so you can
persist it yourself instead (URL query, a server preferences record, …):

```jsx
<Datatable
  stateKey="users-grid"
  initialState={{ density: "compact", sort: { field: "name", dir: "asc" } }}
  onStateChange={(s) => saveToServer(s)}
  columns={columns}
  rows={rows}
/>
```

It's **SSR-safe** — storage is read in a mount effect, never during render, so the server and first client
render match (no hydration mismatch). A saved snapshot **survives a schema change**: unknown columns are
dropped and missing keys fall back to defaults, and the pruned state is written back. `stateKey` restores the
*uncontrolled* parts of the view only — a `page`/`pageSize`/`quickFilter` you already control from props still
wins (persist those yourself).

**Actions column** — add a `type: "actions"` column with `getActions(row)`:

```jsx
{ field: "actions", headerName: "", type: "actions", width: 116, getActions: (row) => [
  { icon: <PencilIcon />, label: "Edit", onClick: (r) => edit(r) },
  { icon: <MailIcon />,   label: "Email", onClick: (r) => email(r) },
  { icon: <CopyIcon />,   label: "Duplicate", showInMenu: true, onClick: (r) => dup(r) },
  { icon: <TrashIcon />,  label: "Delete", showInMenu: true, danger: true, onClick: (r) => del(r) },
] }
```

Inline items render as icon buttons; `showInMenu` items collapse into a ⋮ overflow menu. Actions columns
are non-sortable/filterable by default. Their header shows a **pin-only ⋮ menu** so the user can pin/unpin
the column left or right; set `pinnable: false` to make it static (no menu), or `pinned: "right"` to start pinned.

**Batch actions** — with `checkboxSelection`, pass `batchActions`; when rows are selected the toolbar swaps
to a selection bar:

```jsx
<Datatable
  checkboxSelection
  batchActions={[
    { icon: <MailIcon />,  label: "Email",  onClick: (keys, rows, clear) => emailMany(rows) },
    { icon: <DownloadIcon />, label: "Export", onClick: (keys, rows) => exportCsv(rows) },
    { icon: <TrashIcon />, label: "Delete", danger: true, onClick: (keys, rows, clear) => { delMany(keys); clear(); } },
  ]}
  columns={columns}
  rows={rows}
/>
```

Each batch handler receives `(selectedKeys, selectedRows, clearSelection, ctx)`. **Server-mode caveat:**
`selectedRows` (and `onBatchUpdate`'s `changedRows`) resolve only the rows on the currently loaded page,
since the table never holds off-page rows. For cross-page selections, use the complete `selectedKeys`
array and re-fetch the full rows (or apply the patch) server-side rather than relying on the resolved rows.

`ctx.anchorEl` is that action's own toolbar button (#246) — anchor a popover to it instead of opening a
centered modal, so a custom action matches the built-in batch editor and the Filters panel:

```jsx
batchActions={[{ label: "Edit", onClick: (keys, _rows, clear, { anchorEl }) => openPanel(anchorEl, keys, clear) }]}
```

**Batch editor** — when any column is `editable`, the selection toolbar also gets a built-in **Edit** button
(suppress it with `showBatchEdit={false}`; allow-list its columns with `batchEditFields`). It opens empty with
a searchable "Add a column…" picker; each picked column gets a clause row. A clause's control comes from
`column.renderBatchEditCell({ value, field, commit })` if present (#247 — for an async/creatable master-backed
control), else `valueOptions` (a searchable Select), else a typed input. `commit` only *stages* the draft —
**Apply** writes it across the selection via `onBatchUpdate`. It's separate from `renderEditCell` (the inline
editor) because a clause has no `row`/`cancel`; declare both when a column needs a rich control in each.

**Click-to-select** — separate from checkbox multi-select. `selectionMode="row"` highlights the row you click
(fires `onRowClick(row, key)`); `selectionMode="cell"` highlights a single cell with a ring (fires
`onCellClick(value, row, field)`). Both fire `onActiveCellChange`. Clicks on buttons/inputs/links/checkboxes
are ignored, so the actions column, inline editing, and the checkbox column keep working.

```jsx
<Datatable selectionMode="cell" onCellClick={(value, row, field) => inspect(field, value)} … />
```

**Cell range selection + clipboard** — in `selectionMode="cell"`, **Shift+Click** / **Shift+Arrow** extend a
rectangular range from an anchor (a plain click/Arrow starts a new single-cell selection); selected cells expose
`aria-selected`/`data-cell-selected`, the grid is `aria-multiselectable` with `aria-activedescendant`, and
`onCellSelectionChange(cells)` reports the `{key,field}[]`. Set `enableClipboard` for spreadsheet **Ctrl/Cmd +
C/X/V** (copy/cut/paste as TSV). Paste is **format-restricted**: give columns a `copyType` token (e.g.
`"part-name"`, `"measurement"`, `"master:suppliers"`; defaults to a number-vs-text bucket) and an in-app paste
only writes a cell when the source and target `copyType` match — incompatible cells are skipped, never mis-written.
Paste commits through `onRowUpdate`/`onRowsChange` (one batched change) and announces outcomes via `aria-live`
**and** a brief visible in-grid toast + a flash on the affected cells (#320). Wire `onCellsCopy(cells, {cut})` /
`onCellsPaste({written, skipped})` to surface your own toast instead.

**Accessibility** — renders as an ARIA `grid` (`role="grid"` + `aria-rowcount`/`aria-colcount`/`ariaLabel`),
headers expose `aria-sort`, rows expose `aria-selected`/`aria-rowindex`, cells are `gridcell`s. Full keyboard
nav: a roving tabindex moves a focus ring with Arrow keys, Home/End (Ctrl+Home/End for first/last cell),
Enter/Space activates a cell (edit / select / header sort). Checkboxes and sortable headers are keyboard-operable.

**Row grouping** — set `rowGrouping={["plan"]}` (or group interactively via a column's ⋮ menu → "Group by
this column"). Rows collapse under group headers showing the value, a count, and per-group subtotals (from the
same `aggregation` config). A "Grouped by" chip bar lets users remove or clear groupings. Groups the current
page; disable pagination (`pageSize={0}`) to group all client-side rows. Set `groupable: false` on a column to opt out.

**Row pinning** — set `rowPinning` and each row's actions overflow (⋮) menu gains "Pin to top" / "Pin to bottom". If you don't supply an `actions` column, the grid adds a minimal trailing one so the ⋮ menu exists.
Pinned rows stay sticky above/below the scrolling body (top pins sit just under the header). Pinning is disabled
while row grouping is active.

**Row reordering & resizing** — `rowReorder` makes each row draggable to reorder (drop indicator shows the
target; the new key order is reported via `onRowOrderChange`; disabled while a sort or grouping is active).
`rowResize` adds a drag handle on each row's bottom edge to change its height.

**Pivoting** — OFF by default. Users open the toolbar **Pivot** panel to toggle pivot mode and build the model
live: pick **Rows** and **Columns** fields (MultiSelect) and add **Values** with a per-value aggregation. A `pivot`
prop seeds the initial model. The result is a cross-tab (Material UI Data Grid style): `rows` become row-group
headers (left, with a record count), `columns` become **multi-level nested** column-group headers (one stacked
header row per column field, e.g. Year ▸ Month), and each `values` entry renders as a value sub-column showing
the field name with its **aggregation function** beneath it (`MRR`/`avg`). Every intersection is aggregated, with
a per-row Total group, a grand-total row, and per-value formatting. Empty intersections show an em-dash.

```jsx
<Datatable
  rows={data}
  columns={columns}
  pivot={{
    rows: ["role"],
    columns: ["plan"],
    values: [
      { field: "mrr", agg: "sum", label: "MRR", valueFormatter: (v) => `$${v}` },
      { field: "seats", agg: "sum", label: "Seats" },
    ],
  }}
/>
```

Column fields: `field`, `headerName`, `type` ("string"|"number"|"actions"), `filterType` ("string"|"number"),
`width`, `sortable`, `filterable`, `hideable`, `pinnable`, `pinned` ("left"|"right"), `groupable`, `resizable`,
`aggregation`, `aggregationFormatter`, `valueOptions`, `valueFormatter`, `valueGetter`, `combine`, `renderCell`, `exportValue`, `getActions`.

**`filterType`** decouples a column's *filter* operators from its edit `type` (#270). A value+unit
measurement must edit as `type: "string"` (a `type: "number"` column coerces its commit with `Number()`,
which wipes a custom value), yet can present **numeric** filter operators via `filterType: "number"` — pair
it with a `valueGetter` returning the numeric value so the comparison is numeric. Sorting still uses `type`.

**Aggregation / summary footer** — OFF by default. Users open the toolbar **Aggregation** panel to toggle the
totals row and choose, per column, which aggregation to apply (numeric: Sum/Avg/Min/Max/Count; others: Count).
A column's `aggregation` prop seeds the initial choice; `showAggregation` seeds the initial toggle.

```jsx
columns={[
  { field: "name", headerName: "Name", aggregation: "count" },        // "Count 240"
  { field: "seats", headerName: "Seats", type: "number", aggregation: "sum" },
  { field: "mrr", headerName: "MRR", type: "number", aggregation: "sum", valueFormatter: (v) => `$${v}` },
]}
```

Presets: `sum` · `avg` · `min` · `max` · `count`, or a function `(values, rows) => node`. The footer aggregates
all filtered rows (client mode). In **server mode** pass `aggregationValues` — either a scalar per field, or a
per-function map so the chosen function is honored: `aggregationValues={{ mrr: { sum: "$48,200", avg: "$201", min: "$0", max: "$480", count: 240 } }}`.

**Multi-value filters** — string/number columns get an **"is any of"** operator that filters on several values
at once (no need for one filter row per value). Give a column `valueOptions` to populate the multi-select
(recommended in server mode, where the client only holds one page); otherwise distinct values are derived from
the loaded rows. The operator emits `value` as a `string[]`, surfaced in `onServerChange` filters.

**Filter connective (AND/OR)** — the Filters panel is implicitly AND by default; with 2+ clauses a small
**AND/OR toggle** appears in the panel head to combine them (`filterLogic: "and" | "or"`, part of
`DatatableQuery`/`DatatableState`; emitted in `onServerChange`, persisted via `stateKey`). A per-row **`+`**
adds another condition on the same column — repeated same-field clauses AND together. Group your server-side
`WHERE` by the emitted `filterLogic`.

**Resizable popovers** — both `resizableFilters` and `resizablePopovers` default to **true**: the Filters,
Columns, Aggregation, Pivot, and Batch-edit panels all get a corner grip + keyboard resize (handy for a wide
grid's Columns list). Each popover's size persists independently via `stateKey` (`popoverSizes`). Set
`resizablePopovers={false}` to opt a grid out (Filters can be disabled separately with `resizableFilters={false}`).
