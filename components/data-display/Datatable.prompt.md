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
- **Batch edit** — with `checkboxSelection`, selecting rows shows an **Edit** button in the selection toolbar (when editable columns exist). It opens a panel to set one or more columns at once and **Apply** them to every selected row; fires `onBatchUpdate(changedRows, patch, selectedKeys)` plus `onRowsChange`.s` (or `editType: "select"`) edit via a dropdown; number columns get a number input. On commit the grid calls `onRowUpdate(updatedRow, originalRow, field)`; pass `onRowsChange` to also receive the full next rows array (client mode).
- **Export** is a split button: clicking it downloads the current view as **CSV** by default; the chevron opens a format menu (**CSV**, **Excel `.xlsx`**). Exports all filtered+sorted rows client-side (the loaded page in server mode). Customize a column's exported value with `exportValue`.
- **Columns** toolbar button → a searchable, **drag-to-reorder** panel of visibility toggles, each row also with **pin left / pin right** controls (so you can pin any column without scrolling its header into view). **Filters** opens empty — add rows manually with **Add filter**
  (string: contains/equals/is any of/starts/ends/empty; number: =, ≠, >, ≥, <, ≤) built from `Select` + `Input`.
- **Density** cycles row height. The search box quick-filters across visible columns.
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
  onServerChange={({ page, pageSize, sort, filters, quickFilter }) => {
    fetchFromApi({ page, pageSize, sort, filters, quickFilter });  // you fetch + setState
  }}
/>
```

In server mode the table never sorts/filters/paginates locally — it just renders the rows you give it and
calls `onServerChange` (debounced) whenever the query changes, so your backend does the work.

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

Each batch handler receives `(selectedKeys, selectedRows, clearSelection)`. **Server-mode caveat:**
`selectedRows` (and `onBatchUpdate`'s `changedRows`) resolve only the rows on the currently loaded page,
since the table never holds off-page rows. For cross-page selections, use the complete `selectedKeys`
array and re-fetch the full rows (or apply the patch) server-side rather than relying on the resolved rows.

**Click-to-select** — separate from checkbox multi-select. `selectionMode="row"` highlights the row you click
(fires `onRowClick(row, key)`); `selectionMode="cell"` highlights a single cell with a ring (fires
`onCellClick(value, row, field)`). Both fire `onActiveCellChange`. Clicks on buttons/inputs/links/checkboxes
are ignored, so the actions column, inline editing, and the checkbox column keep working.

```jsx
<Datatable selectionMode="cell" onCellClick={(value, row, field) => inspect(field, value)} … />
```

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

Column fields: `field`, `headerName`, `type` ("string"|"number"|"actions"), `width`, `sortable`, `filterable`,
`hideable`, `pinnable`, `pinned` ("left"|"right"), `groupable`, `resizable`, `aggregation`, `aggregationFormatter`,
`valueOptions`, `valueFormatter`, `renderCell`, `exportValue`, `getActions`.

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
