# Datatable — advanced features

Developer notes for the larger, opt-in capabilities of `components/data-display/Datatable.jsx`.
Everything here is **additive**: with the relevant prop off, the table renders exactly as before.

## Server mode + `runDatatableQuery`

With `serverMode`, the grid does **not** sort/filter/paginate the `rows` you pass (they're the
already-fetched current page). It calls `onServerChange(query)` — `{ page, pageSize, sort, filters,
quickFilter }` (the `DatatableQuery` type) — whenever the query changes, debounced; you fetch the
matching slice and feed back `rows` + `rowCount` (+ optional `aggregationValues`, `loading`).

To make a backend (or a fake one, or a test) return **exactly** what client mode would, the package
exports **`runDatatableQuery(rows, query, { columns })`** — it applies the same quick-search, filter
operators (`testFilter`), sort, and paging the grid uses internally, and returns `{ rows, total,
filtered }` (`filtered` is the full pre-paging set, e.g. for computing aggregation totals). This is
the one piece of server-side glue that would otherwise force consumers to re-implement the grid's
operator semantics by hand, so it lives **in the library**, not in the docs — the docs just call it.
The exported function reuses the component's own `testFilter`, so the two can never drift.

**Every write works in server mode too.** `editable` columns, the batch editor, `checkboxSelection`
batch actions, and a per-row `actions` column are all independent of `serverMode`. The grid never
mutates your `rows`; it only reports intent — `onRowUpdate(updatedRow, …)`,
`onBatchUpdate(changedRows, patch, selectedKeys)`, a `batchActions` handler `(keys, rows, clear)`, and
an actions column's `getActions(row)` `onClick`. In server mode you handle each by writing to your
backend and re-fetching the current page (re-run the last `onServerChange` query). The docs-site
"Server-side data" variation demonstrates the full set against a simulated 300-row `DB`: inline edit,
batch-update a column across the selection, batch-delete the selection, **and** single-row delete from
the row's ⋮ menu — each mutates `DB` and re-issues the last query. The one caveat: a batch op only
affects rows the grid currently has (the loaded page), since `changedRows`/selected rows are resolved
from the current `rows`; selection does not span pages in server mode.

## Row virtualization (windowing)

Opt in with `virtualized` to render only the rows near the viewport for large client datasets.

```jsx
<Datatable columns={cols} rows={bigRows} pageSize={0} height={520} virtualized />
```

How it works:

- **Gate.** Windowing is active only when `virtualized` is true, **pagination is effectively off**
  (`pageSize={0}`), row grouping is **not** active, and the table is not in `loading`/skeleton state.
  If any of those don't hold (e.g. you keep pagination, or group rows), it silently renders normally.
  Row grouping and virtualization are mutually exclusive by design — group/subtotal rows interleave
  with leaf rows and don't fit the flat windowed list (this is structural, not a row-height limit).
- **Variable row heights are supported.** Rows do **not** have to be uniform — tall `renderCell`
  content, `wrapText` columns, and drag-resized rows all work. After each render a `useLayoutEffect`
  measures every windowed row (`tr[data-vrow]`, by `offsetHeight`) and caches its height in a `Map`
  keyed by the row's **stable key** (`keyOf`). A `Float64Array` prefix-sum of those heights
  (`offsets[i]` = the y of row *i*'s top) gives exact cumulative offsets; it is rebuilt only when the
  row set or a measurement changes, never on scroll.
- **Estimated row height** (`rowHeight`, default the density preset `compact 36 / standard 44 /
  comfortable 56`) is now only the placeholder for rows **not yet measured** — they refine to their
  real height the first time they scroll into view. It no longer has to match the rendered height for
  the scrollbar to be correct; a good estimate just reduces first-paint jitter.
- **The window** is computed from the scroll container's `scrollTop` (tracked via `onScroll`) and the
  measured viewport height (a `ResizeObserver` on the `.twc-dt__scroll` element), then **binary-searched
  against `offsets`** (O(log n) per scroll) for the rows intersecting `[scrollTop, scrollTop + vh]`.
  Rows `[start - overscan, end + overscan]` of the **middle** (non-pinned) rows render; a top spacer
  `<tr>` of `height = offsets[start]` and a bottom spacer of `totalHeight - offsets[end]` keep the
  scrollbar exact.
- **Pinned rows** (`rowPinning`) always render in their sticky bands — only the scrollable middle band
  is windowed. The sticky header cooperates because it lives outside the windowed `<tbody>` rows.
- **Selection & inline edit keep working** because they key off the row **id** (`rowKey`), not the
  rendered index — a windowed-out row that's selected stays selected when it scrolls back in.

Props: `virtualized` (`false`), `overscan` (`8`), `rowHeight` (density default).

Known trade-off: roving-tabindex grid keyboard nav (`ArrowUp`/`Down` between cells) can only reach the
rows currently in the window; this is the standard virtualization compromise.

## Keyboard row reorder

`rowReorder` already made the whole row mouse-draggable. It now also renders a **focusable drag handle**
(grip icon, in the checkbox cell, or before the first cell when there's no checkbox column) for a
fully keyboard-driven reorder, mirroring the Kanban grab pattern:

- **Enter / Space** on the handle *grabs* the row (visually marked, `aria-pressed`).
- **ArrowUp / ArrowDown** move the grabbed row among the other rows.
- **Enter / Space** *drops* it, committing through the same `setRowOrder` / `onRowOrderChange` path as
  drag-drop. **Escape** cancels. Focus is restored to the moved row's handle.
- Every step is announced through a visually-hidden `role="status" aria-live="polite"` region
  (`.twc-dt__sr`).

Like drag reorder, it's disabled while sorting or grouping (`canReorderRows`).

## Keyboard column reorder

Columns have long been reorderable by dragging the header label (HTML5 drag, gated on
`!disableColumnReorder` and only for unpinned, non-`actions` columns). The header **column menu**
(the `⋮` button → `.twc-dt__pop` `role="menu"`) now also exposes a keyboard-accessible path with two
items:

- **Move left** / **Move right** — shift the column one slot earlier/later among the *movable middle*
  columns (the visible, unpinned, non-`actions` band — the exact set the drag path rearranges).
- They go through the same internal `order` state (`setOrder`) the drag handler mutates via the shared
  `moveCol(field, dir)` helper. Column order is internal-only — there is **no** `onColumnOrderChange`
  prop to reuse (unlike rows' `onRowOrderChange`), so nothing else needs wiring.
- The items only render when reordering is enabled and the column is in the movable band (same gate as
  the draggable header). **Move left** is `disabled` on the first movable column and **Move right** on
  the last, so a column can never move into a pinned band. Disabled items are skipped by the menu's
  roving focus (`[role="menuitem"]:not([disabled])`).
- Choosing an item closes the menu (like every other column-menu action) and announces
  `"Moved <column> left/right."` through the same visually-hidden `.twc-dt__sr` live region used by row
  reorder.

No new public prop: this reuses `disableColumnReorder` and the existing reorder state.

## ARIA menu semantics for the floating menus

The three `.twc-dt__pop` menus — **column-header menu**, **row-actions overflow menu**, and the
**export-format menu** — are now proper ARIA menus:

- Container has `role="menu"`; each `.twc-dt__mi` item has `role="menuitem"`.
- On open, focus moves to the first item; on close (item chosen, Escape, or Tab), focus returns to the
  trigger.
- **ArrowUp / ArrowDown** rove between items (wrapping), **Home / End** jump to first/last,
  **Escape** closes.
- Each trigger (column ⋮ button, row "More actions", export chevron) advertises `aria-haspopup="menu"`
  and reflects `aria-expanded`.

These are presentation/a11y-only changes — click behavior and the existing outside-click/Escape
dismissal are unchanged.

### Mutual exclusion between overlays

The grid has several independent floating overlays — the **column-header menu**, the **row-actions
overflow menu**, the **filters panel**, and the **export-format menu**. Opening any one now
**dismisses every other**: each trigger's `onClick` clears the sibling overlay state *and* calls its
`close*()` floating-dismiss helper before opening itself. Previously, opening the column menu while a
row menu was open (or vice-versa) left the first one stranded on screen, because each overlay only
closed itself on its own outside-click. Now there is at most **one** `.twc-dt__pop` /
`.twc-dt__filters` open at any time.

### Floating popovers track the trigger on scroll

Every grid popover (`.twc-dt__pop`, the filter/agg/pivot panels, the batch editor) is
`position: fixed`, positioned by the internal **`useFloating`** hook from the trigger's
`getBoundingClientRect()`. It originally computed that **once at open**, so scrolling the page left the
fixed popover frozen at its open-time viewport coordinates while the trigger scrolled away — the
popover visibly detached and floated in the wrong place. `useFloating` now keeps a ref to the trigger
and, while open, listens to `scroll` (with `capture: true`, so scrolling *any* ancestor — the page,
the grid's own `__scroll`, a modal — counts) and `resize`, **re-placing** the popover so it tracks the
trigger; if the trigger scrolls fully out of the viewport it **closes** instead. This matches the
pattern the shared overlay components (Menu, Popover, Select/MultiSelect/Combobox, AvatarMenu) already
used — the Datatable hook was the lone exception. Relatedly, the batch editor closes itself if the
selection empties while it is open (no more "Edit 0 selected rows").

### Column auto-fit (double-click the resize handle)

The header resize handle (`.twc-dt__resizer`) still drags to resize, and now **double-clicking** it
(or focusing it and pressing **Enter/Space**) auto-fits the column to its content, Excel-style.
`autoFitColumn(field, thEl)` measures the **widest content** among the header and the currently
**rendered** body cells of that column: each cell's content is cloned into an off-screen,
`white-space: nowrap`, unconstrained `<div>` and its `scrollWidth` is read, so it works for plain text,
numbers, and `renderCell` output (badges, avatars) alike — and because it measures the *natural* width
(not the clipped `scrollWidth` of the live cell) it can **shrink** an over-wide column as well as grow a
truncated one. The result is `clamp(72, content + cell padding + 6, 640)` written into the same
`widths` state the drag path uses. Only rendered rows are measured (the current page / virtualization
window), which is the standard grid trade-off. Gated by the same `disableColumnResize` / per-column
`resizable` flags as drag resize.

### Wrap text (column ⋮ menu)

A **Wrap text** toggle in each non-actions column's header menu makes that column's cells flow onto
multiple lines (the row grows **down**) instead of clipping to one line with an ellipsis. State lives
in a `wrapped` Set of fields (seeded from a column's `wrapText` prop, toggled live from the menu); a
wrapped column's `<td>` gets `data-wrap="true"`, which the CSS turns into
`white-space: normal; word-break: break-word; overflow-wrap: anywhere; vertical-align: top` with a bit
of block padding. The cell keeps its `height: var(--_rowh)` — but `height` on a table cell is a
**minimum**, so single-line cells are unchanged while taller content grows the row. The menu item
reads "Wrap text" / "Unwrap text" and is gated to `c.type !== "actions"`. Wrapping makes rows
variable-height, which **now works with `virtualized`** too — windowing measures and caches each
row's real height (see "Row virtualization"). (Row grouping is still mutually exclusive with
virtualization, but for a structural reason, not row height.)

### Pinning from the Columns panel

Columns can be pinned two ways: from a column header's **⋮ menu** ("Pin to left/right"), and — added
because the header menu is only reachable when that column is **scrolled into view** — from the
**Columns** toolbar panel. In a narrow layout the grid shows only a few columns at a time, so a column
scrolled off to the right has no on-screen ⋮ button and *felt* unpinnable; the panel lists **every**
column regardless of scroll, and each non-`actions` row now carries **pin-left** / **pin-right** icon
buttons (`.twc-dt__col-pin`, `data-on` = active) beside its visibility switch. Both paths call the same
`setPin(field, side)`, so state stays consistent. The buttons `stopPropagation` so a click pins rather
than toggling the row's visibility, and the wrapper is `draggable={false}` so it doesn't start a column
drag-reorder.

**Pinned + editable cells must stay sticky.** A pinned cell relies on `position: sticky` to line up
with its (also sticky) header. The editable-cell rule `.twc-dt__td[data-editable="true"]` sets
`position: relative` at **equal specificity** but **later** in the stylesheet, so for a column that is
both `editable` and pinned the body cells lost `sticky` and drifted out of alignment (the header pinned
correctly, the data column underneath did not — e.g. the "Status" header ending up over a different
column's values). Fixed with a higher-specificity re-assert:
`.twc-dt__td[data-pin][data-editable="true"] { position: sticky; }` (sticky still anchors the
absolutely-positioned edit hint). Any future per-cell rule that touches `position` must keep pinned
cells `sticky`.

### Filter row layout

`.twc-dt__filters` is **580px** wide (was 460). The field (`.twc-dt__f-col`) and operator
(`.twc-dt__f-op`) selectors are fixed at **118px** each, leaving the **value** control
(`.twc-dt__f-val`, `flex: 1; min-width: 140px`) the rest — ~274px — so the `is any of` MultiSelect
shows full option labels instead of truncating to `Ava Cr…`. The two `openPanel(…, "left", 580)` call
sites (the Filters toolbar button and the column-menu **Filter** item) match the panel width.

### Toolbar tooltip stacking and clipping

The toolbar buttons show their label as a CSS `::after` tooltip that hangs **below** the bar
(`top: calc(100% + 8px)`), overlapping the table area. Two separate things conspired to hide it, so
the fix has two parts:

1. **Stacking** — `.twc-dt__toolbar` carries `position: relative; z-index: 10`. The toolbar and the
   scroll viewport (`.twc-dt__scroll`, which holds the sticky header at `z-index: 3`) are flex
   **siblings** inside `.twc-dt`; without a stacking context on the toolbar the later-in-DOM scroll
   painted *over* the tooltip. The `z-index: 10` lifts the whole toolbar subtree (tooltip included)
   above the scroll. The `.twc-dt__pop` overlays are unaffected — they sit at `var(--z-popover)`
   (~1000), far above 10.
2. **Clipping** — even on top, a **centered** tooltip (`left: 50%; translateX(-50%)`) on the
   left-most button (Columns) extended past `.twc-dt`'s left border and got cut by its
   `overflow: hidden` (the label read *"…or hide columns"*). Tooltips are now **edge-anchored** so
   they grow *inward*: tool buttons use `inset-inline-start: 0` (extend toward the table), and the
   end-aligned export split-button uses `inset-inline-end: 0` (extend back toward the table). Logical
   properties keep this correct under RTL. Neither tooltip crosses the clipped border now.

## Excel export — real `.xlsx` (OOXML), no dependency

`Export → Excel` produces a genuine **`.xlsx`** (Office Open XML SpreadsheetML), not the old
HTML-table-saved-as-`.xls` trick (which made Excel show a *"format and extension don't match"*
warning). It is built **without any library**, preserving the package's zero-runtime-deps rule:

- **`xlsxPackage(sheetXml)`** wraps a worksheet in the fixed OPC parts: `[Content_Types].xml`,
  `_rels/.rels`, `xl/workbook.xml`, `xl/_rels/workbook.xml.rels`, a minimal `xl/styles.xml`, and
  `xl/worksheets/sheet1.xml`.
- **`zipStore(files)`** packs them into a ZIP using **stored** entries (method 0, no compression) —
  so there's no deflate dependency — with a table-based **`crc32`** for each entry, correct
  local-header / central-directory / EOCD records, and accumulated offsets.
- **Cells**: finite numbers (`Number.isFinite`) become numeric cells (`<c><v>…</v></c>`) so Excel
  treats them as numbers; everything else is an inline string (`t="inlineStr"`,
  `<t xml:space="preserve">`). Column refs come from **`colLetter`** (`0→A … 26→AA`).
- **Safety carried over from CSV**: the formula-injection **defang** (cells starting with `= + - @`
  get a leading apostrophe; numbers are exempt — CWE-1236) still applies, plus XML escaping of
  `& < >` and stripping of XML-1.0-illegal control chars so the package never opens corrupt.
- The download uses MIME
  `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet` and extension `.xlsx`.

Exported scope is unchanged: all filtered+sorted rows in client mode, the loaded page in server
mode; per-column `exportValue` still overrides the cell value.

## Batch edit — update a column across selected rows

When **any column is `editable`** and `checkboxSelection` is on, selecting one or more rows adds a
built-in **Edit** button to the selection toolbar (next to your `batchActions`). It opens a small
popover listing the editable columns; pick one or more, set a new value, and **Apply** writes it
across every selected row at once. The grid fires **`onBatchUpdate(changedRows, patch, selectedKeys)`**
— `patch` is the `{ field: value }` you chose, `changedRows` are the selected rows with that patch
applied — so you persist it the same way you handle `onRowUpdate` for a single inline edit. This is a
separate path from per-row `getActions` (inline action buttons + a `showInMenu` overflow menu) and
from `batchActions` (your own toolbar buttons over the selection); a grid can use all three at once.

### Docs-site demo parity

The component page's **Usage** block renders `site/src/demos/<Name>Demo.jsx` but shows the `snippet`
from `site/src/data/components.js` as its code. For most components those line up, but the Datatable
demo is a kitchen sink — so its `snippet` is hand-maintained to **mirror the demo column-for-column**
(name/email/role/department/status/country/seats/mrr/salary/startDate/actions) and feature-for-feature
(checkbox selection, `batchActions`, an `actions` column with `getActions`, `editable` columns +
`onRowUpdate`/`onBatchUpdate`, aggregation, row pinning). Keep them in sync when either changes —
otherwise the shown code stops matching the rendered table (a real bug report we got). The
"Actions column, batch actions & batch edit" variation demonstrates the same selection features in
isolation with copy-pasteable code.
