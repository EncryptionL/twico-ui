import * as React from "react";

/**
 * Advanced data table (Material UI Data Grid Premium style): sortable, filterable
 * (per-column operators + quick search), hideable (with a searchable column list),
 * and pinnable (left/right, sticky) columns, drag-to-reorder and drag-to-resize
 * columns, a column-management + filter toolbar (with opt-in density / aggregation /
 * pivot / CSV-export tools), an optional aggregation/summary footer, optional
 * checkbox selection with a batch-action toolbar, an actions column (per-row icon buttons + overflow menu),
 * page-number pagination with a configurable rows-per-page selector, a skeleton
 * loading state, and an optional server-side mode (sort/filter/paginate on the
 * backend — only the current page is loaded). Filter controls and the pager are
 * built from the Twico Select, Input, and Pagination components.
 *
 * @startingPoint section="Data display" subtitle="MUI-style sortable/filterable/pinnable data table" viewport="900x460"
 */
/** Op counts returned to `DatatableDiff.onClassified` (and shown in the toolbar summary). */
export interface DiffSummary {
  added: number;
  removed: number;
  modified: number;
  moved: number;
  unchanged: number;
}

/** Diff payload for `Datatable`'s `diff` mode (#239). */
export interface DatatableDiff<T = any> {
  /** "before" rows (version A). */
  from: T[];
  /** "after" rows (version B). The table's own `rows` is ignored when `diff` is set. */
  to: T[];
  /** Stable business key to pair A↔B. Falls back to the table's `rowKey`, then `row.id`. */
  rowKey?: (row: T) => React.Key;
  /** Hide unchanged rows (initial state of the built-in toggle). @default true */
  onlyChanged?: boolean;
  /** Render the "only changed" toggle in the toolbar. @default true */
  showToggle?: boolean;
  /** Render the +added ~modified −removed (+ ⇅ moved) summary badges in the toolbar. @default true */
  showSummary?: boolean;
  /** Classify same-value, re-positioned rows as "moved" (LIS-minimal). @default true */
  moveDetection?: boolean;
  /** Global equality override; falls back to a column's `compare`, then `===`, then a JSON compare. */
  compare?: (a: any, b: any, field: string) => boolean;
  /** Label for the only-changed toggle. @default "Only changed" */
  toggleLabel?: React.ReactNode;
  /** Called after classification with the op counts (e.g. to drive an external summary). */
  onClassified?: (summary: DiffSummary) => void;
}

export interface DatatableProps<T = any> extends Omit<React.HTMLAttributes<HTMLDivElement>, "rows"> {
  /** Column definitions. */
  columns: DatatableColumn<T>[];
  /** Row objects. In server mode, only the current page's rows. Optional (and ignored) when `diff` is set. */
  rows?: T[];
  /** Turn the grid into a two-dataset **diff** (#239). When set, the table pairs `diff.from`↔`diff.to`
   *  on a business key, classifies each row added/removed/modified/moved/unchanged, and renders modified
   *  cells as `before → after` — all through this same engine, so density, resize, pin, reorder, sort,
   *  filter, quick-search, grouping, export, virtualization, and pagination apply. A leading "Change"
   *  op-badge column is prepended, and a summary + only-changed toggle appear in the toolbar. `rows`,
   *  `serverMode`, `editMode`, `onRowUpdate`, and `onRowsChange` are ignored in diff mode. */
  diff?: DatatableDiff<T>;
  /** Show shimmering skeleton rows instead of data. @default false */
  loading?: boolean;
  /** Returns a stable key per row. @default (r,i) => r.id ?? i */
  rowKey?: (row: T, index: number) => string | number;
  /** Render a leading checkbox-selection column. @default false */
  checkboxSelection?: boolean;
  /** Render a leading auto-numbered row column (1, 2, 3…). The number reflects each row's position in
   *  the current sorted/filtered order and continues across pages (page 2 starts where page 1 ended;
   *  in server mode it uses the current page × pageSize). Sits after the checkbox column, sticky-left.
   *  This prop is the initial state — when enabled, users can hide/show the column from the toolbar's
   *  **Columns** panel ("Row number"). @default false */
  rowNumbers?: boolean;
  /** Restrict the toolbar quick-search to these column `field`s (client mode); defaults to every
   *  visible column. Mirrors `runDatatableQuery`'s `options.searchFields`. */
  searchFields?: string[];
  /** Render the built-in toolbar quick-search box. Set `false` to externalize search — supply your
   *  own input wired to `quickFilter`/`onQuickFilterChange` (mirrors CardGrid). @default true */
  searchable?: boolean;
  /** Controlled quick-search string; pair with `onQuickFilterChange` to drive search from outside
   *  (the value still flows into client filtering and the `onServerChange` query). */
  quickFilter?: string;
  /** Fires with the new quick-search string as the user types (and when a host sets it). */
  onQuickFilterChange?: (value: string) => void;
  /** #330: how the filter clauses combine — `"and"` (all must match) or `"or"` (any). A single, set-wide
   *  connective (matching MUI DataGrid's `logicOperator`), surfaced as the per-row And/Or connector in the
   *  Filters panel and included as `filterLogic` in the `onServerChange` query. Pass this (with
   *  `onFilterLogicChange`) to control it; omit for uncontrolled (seeded by `defaultFilterLogic`). */
  filterLogic?: "and" | "or";
  /** #330: initial And/Or connective when `filterLogic` is uncontrolled. @default "and" */
  defaultFilterLogic?: "and" | "or";
  /** #330: fires with the new connective (`"and"` | `"or"`) when the user changes the per-row And/Or select. */
  onFilterLogicChange?: (logic: "and" | "or") => void;
  /** Custom node rendered in a **leading slot** of the toolbar row, before the built-in Columns/Filters
   *  cluster (#286) — for host controls like an "Add row" button or bulk actions. Mirrors `CardGrid`'s
   *  `toolbar` prop, so no internal-class/absolute-position hacks are needed. */
  toolbarActions?: React.ReactNode;
  /** Let the user drag-resize the **Filters** popover and its column/operator/value fields (#292), on top
   *  of the #289 auto-fit (a dragged width overrides the measured one; reset returns to it). Widths + panel
   *  size persist via `stateKey` and are keyboard-accessible. Set `false` to disable the handles/grip
   *  (fields still auto-fit). @default true */
  resizableFilters?: boolean;
  /** #304: extend the drag-resize grip to the other toolbar popovers too — Columns, Aggregation, Pivot,
   *  and Batch-edit — each with a corner grip + keyboard resize (Arrows, Home/End, Enter/double-click to
   *  reset). Independent of `resizableFilters` (which controls the Filters panel): each defaults `true` and
   *  can be turned off on its own. Each popover's size persists independently via `stateKey` (`popoverSizes`).
   *  Great for a wide grid whose Columns list is otherwise capped. Set `false` to opt a grid out. @default true */
  resizablePopovers?: boolean;
  /** Raise the drag cap for the filter panel's column/operator fields, in px (default col 360 / op 260) —
   *  the #289-deferred "optional prop to raise the cap". Only affects `resizableFilters`. */
  filterFieldMaxWidth?: number;
  /**
   * Actions shown in the toolbar when one or more rows are selected (requires
   * `checkboxSelection`). Each handler receives the selected keys, the resolved
   * selected row objects, and a `clearSelection()` callback.
   *
   * Server-mode caveat: the resolved `selectedRows` argument can only include rows
   * on the currently loaded page (the table never holds off-page rows). For
   * cross-page selections, use the complete `selectedKeys` array and re-fetch the
   * full row objects server-side rather than relying on `selectedRows`.
   */
  batchActions?: DatatableBatchAction<T>[];
  /** #322: fired when the checkbox row selection changes — `(keys, rows)`. The row-mode analogue of
   *  `onCellSelectionChange`, so a consumer can track the selection and drive a batch action's own
   *  `disabled`/`hidden` (which also accept predicates). */
  onRowSelectionChange?: (keys: Array<string | number>, rows: T[]) => void;
  /** Row height preset. With `showDensity`, the toolbar density button cycles it locally; changing this prop re-applies it. @default "comfortable" */
  density?: "compact" | "standard" | "comfortable";
  /**
   * Rows per page. 0 disables pagination. Uncontrolled by default (changing the prop
   * re-applies it and resets to the first page); becomes **controlled** when
   * `onPageSizeChange` is supplied. @default 10
   */
  pageSize?: number;
  /** Options shown in the rows-per-page selector. @default [5, 10, 25, 50] */
  pageSizeOptions?: number[];
  /** Controlled current page (0-based). When set, the table renders this page and reports changes via `onPageChange` instead of managing its own. */
  page?: number;
  /** Fires with the next 0-based page on user pagination (and when a page-size/query change resets to page 0). Required to control `page`. */
  onPageChange?: (page: number) => void;
  /** Fires with the next rows-per-page when the user picks one; supplying it makes `pageSize` controlled. */
  onPageSizeChange?: (pageSize: number) => void;
  /** Max height of the scroll area in px (header/footer stay fixed). @default 440 */
  height?: number;
  /**
   * Enable server-side data. When true, the table does NOT sort/filter/paginate
   * the `rows` you pass (they are treated as the already-fetched current page);
   * instead it calls `onServerChange` whenever the query changes so you can fetch
   * the right slice. Provide `rowCount` for correct page counts. @default false
   */
  serverMode?: boolean;
  /** Total row count on the server (required for pagination in server mode). */
  rowCount?: number;
  /** Server-mode callback fired (debounced) whenever the query changes. The query now
   *  includes `visibleColumns`/`hiddenColumns` so you can project only the shown columns. */
  onServerChange?: (state: DatatableQuery) => void;
  /** Fired when the built-in Columns menu shows/hides a column, with the currently visible
   *  column `field`s (in column order). Lets a server-mode grid drive column projection from
   *  the built-in menu instead of a duplicate control. Not fired on initial mount. */
  onColumnVisibilityChange?: (visible: string[]) => void;
  /** Show the Export toolbar button (split button: click = CSV, chevron = format menu). @default false */
  showExport?: boolean;
  /** Show the row-density toolbar button (cycles compact / standard / comfortable). The `density` prop
   *  still sets the row height even when this button is hidden. @default false */
  showDensity?: boolean;
  /** Show the Pivot toolbar button. Also shown automatically when `pivot` or `pivotMode` is set. @default false */
  showPivot?: boolean;
  /** Filename (without extension) for exports (CSV / Excel). @default "export" */
  exportFilename?: string;
  /** Server-mode precomputed aggregation. Per field, either a scalar/node (used as-is) or a per-function map
   *  `{ sum, avg, min, max, count }` so the footer honors whichever function the user picks in the panel. */
  aggregationValues?: Record<string, React.ReactNode | Partial<Record<"sum" | "avg" | "min" | "max" | "count", React.ReactNode>>> | null;
  /** Disable column reordering. When enabled (the default), columns can be reordered by dragging
   *  the header label, or via the header column menu's "Move left" / "Move right" items (a keyboard-
   *  accessible alternative; the move is announced through a visually-hidden live region). Both paths
   *  rearrange only the movable, unpinned columns and leave pinned/actions columns in place.
   *  @default false */
  disableColumnReorder?: boolean;
  /** Message rendered when there are no rows (filter-aware default: "No rows match your filters" when a filter/quick-search is active, else "No rows"). */
  emptyMessage?: React.ReactNode;
  /** Render a custom empty state inside the table body (e.g. the shipped `<EmptyState/>`). Overrides `emptyMessage`. */
  renderEmpty?: () => React.ReactNode;
  /** Disable column resizing. When enabled (the default off), drag a header's right edge to resize a
   *  column, or **double-click** that edge to auto-fit the column to its widest visible content
   *  (header + rendered cells), Excel-style. @default false */
  disableColumnResize?: boolean;
  /** #339: let end-users build their own combined columns at runtime. Adds a **"Combine columns…"** item to
   *  each column's ⋮ menu that opens an editor to fold other columns' data into that column (they show in its
   *  cell and their own columns hide); layout (inline/stacked) + labels are configurable, and "Uncombine"
   *  restores them. The result is the same as a declarative `column.combine` and persists via `stateKey`.
   *  @default false */
  columnCombining?: boolean;
  /** Make all columns editable by default (double-click a cell to edit; per-column `editable` overrides). @default false */
  editMode?: boolean;
  /** Called when a cell edit is committed: (updatedRow, originalRow, field). */
  onRowUpdate?: (updatedRow: T, originalRow: T, field: string) => void;
  /** Controlled-rows callback: receives the full next rows array after an edit (client mode). */
  onRowsChange?: (rows: T[]) => void;
  /** Fired when the built-in batch editor applies columns across selected rows:
   *  (changedRows, patch, selectedKeys). The selection-toolbar "Edit" button appears
   *  automatically when there are editable columns. Server-mode caveat: `changedRows`
   *  resolves only rows on the currently loaded page; for cross-page selections use the
   *  complete `selectedKeys` array and apply the `patch` server-side. */
  onBatchUpdate?: (changedRows: T[], patch: Record<string, any>, selectedKeys: Array<string | number>) => void;
  /** Render the built-in "Edit" button in the selection toolbar (the batch editor). Set `false` to
   *  suppress it and ship your own batch-edit action via `batchActions` — otherwise you'd get two
   *  "Edit" buttons. @default true */
  showBatchEdit?: boolean;
  /** Allow-list the column `field`s the built-in batch editor offers. Defaults to every editable
   *  column. Use it to trim a wide grid's editor **without** touching `editable` (which would also
   *  disable inline cell editing). */
  batchEditFields?: string[];
  /** Persist the full view state (filters, sort, quick-search, page, page size, column order / widths /
   *  visibility / pinning, density) to `localStorage` under this key, and restore it on mount (#259).
   *  SSR-safe: storage is never read during render — the server and first client render start from the
   *  defaults, then the saved state is applied in a mount effect (so hydration never mismatches). Unknown
   *  columns in a saved snapshot are ignored, so a later column change won't break restore. */
  stateKey?: string;
  /** Seed the view state on first mount (used only when `stateKey` has nothing stored yet). A partial
   *  `DatatableState` — omitted keys keep their defaults. */
  initialState?: Partial<DatatableState>;
  /** Fired whenever the view state changes, with the complete `DatatableState`. Use it to persist the
   *  state yourself (URL query, server, …) instead of — or in addition to — `stateKey`. Not fired on
   *  the initial mount for the default state; fires once after a `stateKey`/`initialState` restore. */
  onStateChange?: (state: DatatableState) => void;
  /** Show a "Go to" page jumper in the footer when there are more than 5 pages. @default true */
  showPageJumper?: boolean;
  /** Click-to-select mode: "row" highlights the clicked row, "cell" enables spreadsheet-like cell selection.
   *  In "cell" mode the grid supports keyboard navigation and **rectangular range selection** (#317):
   *  Shift+Click / Shift+Arrow extend a range from an anchor; selected cells expose `aria-selected` and the
   *  grid is `aria-multiselectable` with `aria-activedescendant` on the active cell. @default "none" */
  selectionMode?: "none" | "row" | "cell";
  /** Fired when a row is clicked in "row" selection mode: (row, key). */
  onRowClick?: (row: T, key: string | number) => void;
  /** #324: controlled highlighted row key for `selectionMode="row"`. When provided, the grid highlights THIS
   *  row (not its internal state) and reports clicks via `onRowClick` so you update the prop — the same
   *  controlled/uncontrolled split as `page`. Pass `null` to clear. Lets an external selection (a graph, a
   *  master/detail pane) drive the row highlight, with scroll-into-view. */
  activeRowId?: string | number | null;
  /** #324: scroll the controlled active row into view when `activeRowId` changes. @default true */
  scrollActiveRowIntoView?: boolean;
  /** Fired when a cell is clicked in "cell" selection mode: (value, row, field). */
  onCellClick?: (value: any, row: T, field: string) => void;
  /** Fired when the active cell changes: ({ key, field } | null). */
  onActiveCellChange?: (cell: { key: string | number; field: string } | null) => void;
  /** #317: fired when the rectangular cell selection changes ("cell" mode) — every cell inside the
   *  anchor→focus rectangle, in row-major order. Empty array when the selection clears. */
  onCellSelectionChange?: (cells: Array<{ key: string | number; field: string }>) => void;
  /** #318: enable spreadsheet clipboard on cells ("cell" mode): Ctrl/Cmd+C copies the active cell/range as
   *  TSV, Ctrl/Cmd+X cuts (copy then clear), Ctrl/Cmd+V pastes onto the target rectangle from the active
   *  cell. Paste is format-restricted by column `copyType` (incompatible cells are skipped) and commits
   *  through `onRowUpdate`/`onRowsChange` in one batched change; outcomes are announced via `aria-live`.
   *  Copy/cut/paste also show a brief **visible** in-grid confirmation toast + a flash on the affected cells
   *  (#320), so sighted users get feedback too. @default false */
  enableClipboard?: boolean;
  /** #320: fired on a clipboard copy/cut with the copied cells (row-major `{key,field}[]`) and `{ cut }`.
   *  Use it to surface your own toast / integrate an app notification system. */
  onCellsCopy?: (cells: Array<{ key: string | number; field: string }>, meta: { cut: boolean }) => void;
  /** #320: fired after a clipboard paste with the outcome — `written` cells committed, `skipped` cells
   *  rejected (read-only or incompatible `copyType`). */
  onCellsPaste?: (result: { written: number; skipped: number }) => void;
  /** Show the **Aggregation** toolbar button and start with the totals row on. From that panel the user
   *  toggles totals and picks columns + functions (a column's `aggregation` prop seeds the initial choice);
   *  changing the prop re-applies it. When false (the default) the Aggregation button is hidden. @default false */
  showAggregation?: boolean;
  /** Accessible label for the grid (role="grid"). A standard `aria-label` prop takes precedence. @default "Data table" */
  ariaLabel?: string;
  /** Row-grouping fields (collapsible groups with subtotals). Changing the prop re-applies it; users can also group via a column's ⋮ menu. @default [] */
  rowGrouping?: string[];
  /** Enable row pinning — adds "Pin to top/bottom" to each row's actions menu; pinned rows stay sticky above/below the scroll body. @default false */
  rowPinning?: boolean;
  /** Enable reorder of rows: the whole row is mouse-draggable, and a focusable drag handle supports
   *  keyboard reorder (Enter/Space grabs, ArrowUp/ArrowDown move, Enter/Space drops, Escape cancels;
   *  changes are announced via a visually-hidden live region). Persists via `onRowOrderChange`.
   *  Disabled while sorting or grouping. @default false */
  rowReorder?: boolean;
  /** Enable drag-to-resize row height (handle on the row's bottom edge). @default false */
  rowResize?: boolean;
  /** Called with the new array of row keys after a drag-reorder. In `serverMode` the drag order is
   *  an optimistic overlay: persist the keys, then hand back a new `rows` prop — the overlay clears on
   *  any `rows` change, so a rejected reorder reverts (reload the authoritative order) and a
   *  server-corrected order reflects, both without remounting. */
  onRowOrderChange?: (keys: Array<string | number>) => void;
  /** Initial pivot model (seeds the toolbar **Pivot** panel, which the user can edit live): aggregate `values` across `rows` (row groups) × `columns` (nested column groups). */
  pivot?: {
    rows: string[];
    columns?: string[];
    values: Array<{ field: string; agg?: "sum" | "avg" | "min" | "max" | "count"; label?: string; valueFormatter?: (v: any) => React.ReactNode }>;
  } | null;
  /** Start in pivot view. @default false */
  pivotMode?: boolean;
  /**
   * Opt into row virtualization (windowing): render only the rows near the viewport for large
   * datasets. Active only when pagination is effectively off (`pageSize={0}`) **and** row grouping
   * is **not** active; otherwise it is ignored and the table renders normally. Pair with a fixed
   * `height` so there is a scroll viewport to window against. **Rows may differ in height** — tall
   * `renderCell` content, `wrapText` columns, or a drag-resized row all work: each rendered row is
   * measured and cached by key, so the scrollbar and spacing stay accurate. Selection and inline
   * edit keep working because they key off the row id, not its rendered index. @default false
   */
  virtualized?: boolean;
  /** Extra rows rendered above and below the visible window (smoother fast scrolling) when `virtualized`. @default 8 */
  overscan?: number;
  /** Estimated row height in px, used only for rows not yet measured (they refine to their real height once scrolled into view). Defaults to the density preset (compact 36 / standard 44 / comfortable 56). Set this to your typical row height for the best first-paint estimate. */
  rowHeight?: number;
  /** #350 (first pass): expandable/collapsible rows. Return the detail panel to render below `row` when it is
   *  expanded, or `null`/`undefined` to make that row non-expandable (no chevron). Supplying this function
   *  enables a leading chevron column and a full-width detail `<tr>` under each expanded row. Not yet
   *  supported with `virtualized` (the detail row's height isn't measured by the windowing math). */
  renderRowDetail?: (row: T) => React.ReactNode;
  /** Controlled set of expanded row keys (values from `rowKey`). Omit for uncontrolled (internal) expansion. */
  expandedRowIds?: Array<string | number>;
  /** Fires with the next full array of expanded row keys whenever a row is expanded or collapsed.
   *  Shared by `renderRowDetail` (#350) and the row-tree (#359). */
  onExpandedRowsChange?: (ids: Array<string | number>) => void;
  /** #359 (server-mode lazy row-tree): draw the same leading chevron on a parent DATA row (independent of
   *  `renderRowDetail`). Expanding reveals CHILD data rows in the SAME columns rather than a detail panel.
   *  In **server mode** the grid does not fetch children — the expanded key set is folded into the
   *  `onServerChange` query (`expanded`), so the host returns the parent + its children inline (and sets
   *  `rowCount` to the flattened visible count; a collapsed parent counts as one row). Uses the shared
   *  `expandedRowIds`/`onExpandedRowsChange`. Tree rows need stable unique keys (via `rowKey`/`id`). Carries
   *  the #350 limits: not yet supported with `virtualized`, pivot, or `rowGrouping`, and no chevron on a
   *  pinned (sticky) row. */
  getRowCanExpand?: (row: T) => boolean;
  /** #359: 0-based nesting depth, used only for the tree indent on the first data cell (0 = top-level parent).
   *  In server mode supply it from the host-flattened rows; in client mode it's derived from the `getSubRows`
   *  splice when omitted. @default 0 */
  getRowDepth?: (row: T) => number;
  /** #359 (client mode): children for an expanded parent, spliced in as first-class rows (same columns)
   *  immediately after it. Ignored in `serverMode` (the host returns children inline). Children are rendered
   *  after pagination, so they don't consume the parent's page budget and aren't independently sorted/filtered. */
  getSubRows?: (row: T) => T[];
}

/** String-column filter operators (Datatable server mode). */
export type DatatableStringOp = "contains" | "equals" | "startsWith" | "endsWith" | "isEmpty" | "isNotEmpty" | "isAnyOf";
/** Number-column filter operators. */
export type DatatableNumberOp = "=" | "!=" | ">" | ">=" | "<" | "<=" | "isAnyOf";
/** Any Datatable filter operator. */
export type DatatableFilterOp = DatatableStringOp | DatatableNumberOp;
/** A single active filter — the value shape is discriminated by `op`. */
export type DatatableFilter =
  | { field: string; op: "isAnyOf"; value: string[] }
  | { field: string; op: "isEmpty" | "isNotEmpty"; value?: undefined }
  | { field: string; op: Exclude<DatatableFilterOp, "isAnyOf" | "isEmpty" | "isNotEmpty">; value: string };

/** Query state reported by a server-mode Datatable. */
export interface DatatableQuery {
  /** Zero-based page index. */
  page: number;
  /** Current rows per page. */
  pageSize: number;
  /** Active sort, or null. */
  sort: { field: string; dir: "asc" | "desc" } | null;
  /**
   * Active column filters. String columns emit contains/equals/startsWith/endsWith/isAnyOf/isEmpty/isNotEmpty;
   * number columns emit =, !=, >, >=, <, <=. `value` is a `string[]` for `isAnyOf` and omitted for `isEmpty`/`isNotEmpty`.
   */
  filters: DatatableFilter[];
  /** #303: how the `filters` combine — `"and"` (all must match, default) or `"or"` (any match).
   *  Omitted is treated as `"and"` for back-compat; group your server-side WHERE accordingly. */
  filterLogic?: "and" | "or";
  /** Quick-search text. */
  quickFilter: string;
  /** `field`s of the columns currently shown (in column order) — the built-in Columns menu
   *  is the source of truth. Use it to fetch/project only the visible columns server-side.
   *  Always populated by the grid in `onServerChange`; optional so a hand-built query passed
   *  to `runDatatableQuery` (which ignores it) need not supply it. */
  visibleColumns?: string[];
  /** `field`s of the columns currently hidden via the Columns menu. Always populated in
   *  `onServerChange`; optional for the same reason as `visibleColumns`. */
  hiddenColumns?: string[];
  /** #359 (server-mode lazy row-tree): keys of the currently-expanded parent rows. Always populated in
   *  `onServerChange` when `getRowCanExpand` is used — the host fetches those parents' children and returns
   *  them inline (a collapsed parent is one row). Optional on a hand-built query. */
  expanded?: Array<string | number>;
}

/**
 * The complete, serializable view state of a `Datatable` (#259) — everything the user can adjust
 * from the toolbar and column headers. Persisted by `stateKey`, seeded by `initialState`, and
 * reported by `onStateChange`. Every field is optional in `initialState`/a stored snapshot: unknown
 * columns are dropped and missing keys fall back to the table's defaults, so a snapshot survives a
 * schema change. `columnVisibility` lists only hidden columns (`{ field: false }`; absent = visible);
 * `columnPinning` lists only pinned columns (`{ field: "left" | "right" }`).
 */
export interface DatatableState {
  /** Active per-column filters (without the internal row id). */
  filters: DatatableFilter[];
  /** #303: filter connective for the whole set — `"and"` (default) or `"or"`. Absent = `"and"`. */
  filterLogic?: "and" | "or";
  /** Active sort, or null. */
  sort: { field: string; dir: "asc" | "desc" } | null;
  /** Quick-search text. */
  quickFilter: string;
  /** Zero-based current page. */
  page: number;
  /** Rows per page. */
  pageSize: number;
  /** Column `field`s in their current left-to-right order. */
  columnOrder: string[];
  /** User-resized column widths in px, keyed by `field`. */
  columnWidths: Record<string, number>;
  /** Hidden columns, keyed by `field` (`false` = hidden; a visible column is simply absent). */
  columnVisibility: Record<string, boolean>;
  /** Pinned columns, keyed by `field`. */
  columnPinning: Record<string, "left" | "right">;
  /** Row-density preset. */
  density: "compact" | "standard" | "comfortable";
  /** #292: user-resized Filters popover size (px). Absent until the user drags the panel grip. */
  filterPanelSize?: { w?: number; h?: number };
  /** #292: user-resized Filters field widths (px, panel-global — not per data column). Absent until dragged.
   *  `logic` is the #330 And/Or connector field. */
  filterFieldWidths?: { col?: number; op?: number; val?: number; logic?: number };
  /** #304: user-resized sizes of the other toolbar popovers (Columns/Aggregation/Pivot/Batch-edit),
   *  keyed by popover id → `{ w, h }` in px. Absent until a popover is dragged with `resizablePopovers`. */
  popoverSizes?: Record<string, { w?: number; h?: number }>;
  /** #339: runtime user-defined combined columns (from `columnCombining`), keyed by target field →
   *  `{ fields:[target, ...sources], layout, separator, labels }`. Absent until the user combines columns. */
  columnCombine?: Record<string, { fields: string[]; layout?: "inline" | "stack"; separator?: string; labels?: boolean }>;
  /** #341: user-resized width (px) of the batch-editor's column-name field. Absent until the user drags it. */
  batchNameWidth?: number;
}

export interface DatatableColumn<T = any> {
  /** Row object key (also the default sort/filter/search/group/export key). */
  field: string;
  /** Derive the column's value from the whole row (nested/computed) — drives sort, filter,
   *  quick-search, grouping, aggregation, the default cell render, and export. Falls back to
   *  `row[field]` when omitted. Inline edits still write to the raw `field`. */
  valueGetter?: (row: T) => unknown;
  /** #338: merge several other columns' values into this one column — a convenience layer over
   *  `valueGetter`. Give the source `fields` (or the shorthand `combine: ["a", "b"]`); Twico auto-derives
   *  the combined value — so sort, filter, quick-search, grouping, aggregation, and export all operate on
   *  it — and the cell render. `layout: "inline"` (default) joins the values with `separator` (default
   *  `" · "`) on one line; `"stack"` puts each on its own line and auto-wraps the row. `labels` prefixes
   *  each value with its source column's header. Note the split: the derived **value** used for
   *  sort/filter/quick-search/grouping/aggregation/export is the raw source values joined by `separator`
   *  (label-prefixed when `labels`), while the **cell render** additionally applies each source column's
   *  `valueFormatter`. The combined value is synthetic, so the column is display-only (never inline-editable).
   *  Supplying your own `valueGetter` and/or `renderCell` overrides the derived one(s) independently —
   *  override `valueGetter` alone and the cell shows that value (not the source-join). */
  combine?: string[] | { fields: string[]; layout?: "inline" | "stack"; separator?: string; labels?: boolean };
  /** Header label. @default field ("Actions" for actions columns) */
  headerName?: string;
  /** Data type. "actions" renders per-row action buttons via getActions. @default "string" */
  type?: "string" | "number" | "actions";
  /** Filter operators + value comparison for this column, **decoupled from the edit `type`** (#270).
   *  A `"number"` column edits by coercing its commit with `Number()`, which would wipe a custom value
   *  (e.g. a value+unit measurement edited via `renderEditCell`) — so such a column must edit as
   *  `type: "string"`, yet may still want **numeric** filter operators (`=` `≠` `>` `≥` `<` `≤`).
   *  Set `filterType: "number"` to offer them (provide a `valueGetter` returning the numeric value so
   *  the comparison is numeric). Falls back to `type`. Sorting still uses `type`. @default type */
  filterType?: "string" | "number";
  /** Column width: a px number, or `"auto"` to size to the header's intrinsic width (chrome + label) so a short column fits without truncating or wasting the 160px default. @default 160 (120 for actions) */
  width?: number | "auto";
  /** Lower bound (px) for the resolved width, incl. `"auto"` and user resizes. */
  minWidth?: number;
  /** Upper bound (px) for the resolved width; `minWidth` wins if they conflict. */
  maxWidth?: number;
  /** Cell alignment; currently affects the actions column's button justification. @default "right" for number/actions columns, else "left" */
  align?: "left" | "right";
  /** Allow sorting this column. @default true */
  sortable?: boolean;
  /** Allow filtering this column. @default true */
  filterable?: boolean;
  /** Allow hiding this column. @default true */
  hideable?: boolean;
  /** Allow pinning this column. @default true */
  pinnable?: boolean;
  /** Allow grouping rows by this column (via the ⋮ menu). @default true for non-number, non-actions columns */
  groupable?: boolean;
  /** Pin this column on first render. */
  pinned?: "left" | "right";
  /** Allow drag-to-resize of this column. @default true */
  resizable?: boolean;
  /** Allow drag / menu / keyboard reorder of this column (independent of the table-wide `disableColumnReorder`). @default true */
  reorderable?: boolean;
  /** Offer the "Wrap text" / "Unwrap text" item in the ⋮ menu. Set `false` for a fixed single-token column (e.g. an ordinal) whose menu should show only Sort + Hide. @default true */
  wrappable?: boolean;
  /** Summary-footer aggregation: a preset, or a function over the column's values. */
  aggregation?: "sum" | "avg" | "min" | "max" | "count" | ((values: any[], rows: T[]) => React.ReactNode);
  /** Format an aggregation result for the footer (falls back to valueFormatter). */
  aggregationFormatter?: (value: any) => React.ReactNode;
  /** Map a row to its exported CSV value (defaults to the raw field value). */
  exportValue?: (value: any, row: T) => string | number;
  /** Make this column's cells editable (double-click to edit). Overrides the grid `editMode`. */
  editable?: boolean;
  /** Editor type. "select" (or any column with `valueOptions`) renders a dropdown; else a text/number input by column type. */
  editType?: "text" | "number" | "select";
  /** Full escape hatch for the inline cell editor — render your own control (a searchable / creatable /
   *  async `Combobox`, a `MasterCombobox`, …) for a value backed by a large, extensible vocabulary.
   *  Providing it makes the column editable (unless `editable: false`) and takes precedence over the
   *  built-in select/text editor. Call `commit(nextValue)` to save (fires `onRowUpdate`/`onRowsChange`)
   *  or `cancel()` to discard. Twico overlay dropdowns (portaled as `.twc-pop`) are exempt from the
   *  cell's outside-click auto-cancel, so a Combobox popover works inside the cell. **Escape cancels**
   *  the edit automatically (the wrapper calls `cancel()`), so you needn't wire a keydown — stop
   *  propagation on Escape only if your control needs it (e.g. to close its own open dropdown). */
  renderEditCell?: (args: { value: any; row: T; field: string; commit: (nextValue: any) => void; cancel: () => void }) => React.ReactNode;
  /** Custom control for this column's clause in the **batch** editor (#247) — the counterpart of
   *  `renderEditCell` for the "Edit N selected rows" popover. Use it when the value is backed by a large,
   *  async, creatable vocabulary that `valueOptions` (a static array) can't express; without it such a
   *  column degrades to a plain text input in batch even though it has a rich inline editor.
   *  Takes precedence over `valueOptions`. It is a **separate** hook from `renderEditCell` because a batch
   *  clause has no single `row` and no `cancel`, and its `commit(nextValue)` only **stages** the draft —
   *  nothing is written until the user hits **Apply** (which then fires `onBatchUpdate`). */
  renderBatchEditCell?: (args: { value: any; field: string; commit: (nextValue: any) => void }) => React.ReactNode;
  /** Hide the column header ⋮ menu. @default false */
  disableColumnMenu?: boolean;
  /** Start with this column's cell text wrapped onto multiple lines (the row grows down) instead of
   *  clipped to one line. Users can also toggle it live from the column ⋮ menu ("Wrap text"). @default false */
  wrapText?: boolean;
  /** Distinct values for the "is any of" multi-value filter (recommended in server mode). */
  valueOptions?: Array<string | { value: string; label: string }>;
  /** Async loader for the "is any of" filter's options — searchable/lazy server-backed values (for a
   *  large reference/master list). Called with the type-ahead query (debounced; `""` primes the list)
   *  and takes precedence over `valueOptions` for the filter picker, which then loads server-side
   *  (no local filtering) with a loading state. */
  loadValueOptions?: (query: string) => Promise<Array<string | { value: string; label: string }>>;
  /** Format the raw value to a string/number for display. */
  valueFormatter?: (value: any, row: T) => React.ReactNode;
  /** #318: opaque copy/paste compatibility token for the cell clipboard (`enableClipboard`). On an in-app
   *  paste, a source cell is written to a target only when the two columns' `copyType` match — so e.g. a
   *  "part-name" value never lands in a "measurement" column. Falls back to a number-vs-text bucket derived
   *  from `type` when omitted. Examples: "text", "number", "part-name", "master:suppliers". */
  copyType?: string;
  /** Fully custom cell renderer (badges, avatars, etc.). */
  renderCell?: (value: any, row: T) => React.ReactNode;
  /** #345: per-cell class hook — return a class name applied to the whole cell (`.twc-dt__td`, pinned cells
   *  included), not just its content. Use for value/row-based tinting (e.g. a "changed" cell) via your own
   *  stylesheet, without coupling to the internal class name. Because it participates in the CSS cascade, a
   *  `cellClassName` tint co-exists with the built-in hover/selection/diff backgrounds (a plain class may even
   *  lose to them by specificity — use a more specific selector, or `cellStyle`, to always win). Prefer this
   *  over `cellStyle` when those state cues must stay visible on a tinted cell. Called `(value, row)` to match
   *  `renderCell`/`valueFormatter`. */
  cellClassName?: (value: any, row: T) => string | undefined;
  /** #345: per-cell inline-style hook — return a style object applied to the whole cell (`.twc-dt__td`,
   *  pinned cells included). The simplest way to tint an entire cell from the value/row with no stylesheet.
   *  Pin positioning **and** stickiness are always preserved (don't set `position`/`inset-*`). Two caveats,
   *  because an inline style wins over every built-in background: (1) on a **pinned** column the background
   *  must be **opaque** — a translucent value lets the cells scrolling underneath the sticky cell bleed
   *  through; composite over the surface, e.g. `color-mix(in srgb, var(--color-danger) 14%, var(--color-surface))`
   *  rather than `…, transparent`. (2) it also overrides the hover / range-selection / edit-mode / diff
   *  backgrounds on that cell — use `cellClassName` instead if those cues must remain visible. Called
   *  `(value, row)` to match `renderCell`/`valueFormatter`. */
  cellStyle?: (value: any, row: T) => React.CSSProperties | undefined;
  /** Diff-mode (#239) per-column equality override — return true when the two values are equal.
   *  Precedence: column.compare → diff.compare → valueGetter/=== → JSON compare. */
  compare?: (a: any, b: any) => boolean;
  /** For type:"actions" — returns the row's action items. */
  getActions?: (row: T) => DatatableRowAction<T>[];
}

/** A per-row action in an actions column. */
export interface DatatableRowAction<T = any> {
  /** Icon node (rendered as an icon button, or leading icon in the overflow menu). */
  icon?: React.ReactNode;
  /** Accessible label / tooltip / menu text. */
  label: string;
  /** Click handler, receives the row. */
  onClick?: (row: T) => void;
  /** Place in the ⋮ overflow menu instead of inline. @default false */
  showInMenu?: boolean;
  /** Render in danger color. */
  danger?: boolean;
  disabled?: boolean;
}

/** Extra context handed to a batch action's `onClick`. */
export interface DatatableBatchActionContext {
  /** The selection-toolbar button that was clicked. Anchor a popover/panel to it — the same thing the
   *  built-in batch editor does with its own button. */
  anchorEl: HTMLElement;
}

/** A batch action shown in the selection toolbar. */
export interface DatatableBatchAction<T = any> {
  /** Button label. */
  label: string;
  /** Leading icon node. */
  icon?: React.ReactNode;
  /** Handler: (selectedKeys, selectedRows, clearSelection, ctx).
   *  `ctx.anchorEl` is the toolbar button that was clicked, so a custom action can anchor a popover to it
   *  rather than being limited to a centered modal — matching the built-in batch editor and Filters panel. */
  onClick?: (
    keys: Array<string | number>,
    rows: T[],
    clearSelection: () => void,
    ctx: DatatableBatchActionContext,
  ) => void;
  /** Render in danger color. */
  danger?: boolean;
  /** #322: disable the action — a static boolean, or a predicate evaluated against the current selection so
   *  an action that only applies to a subset of the selected rows can grey out when it doesn't apply. */
  disabled?: boolean | ((keys: Array<string | number>, rows: T[]) => boolean);
  /** #322: hide the action entirely when the predicate returns true (e.g. `(_, rows) => rows.every(r => r.isGroup)`
   *  drops "Mark as new thread" when only group rows are selected). A static `true` always hides it. */
  hidden?: boolean | ((keys: Array<string | number>, rows: T[]) => boolean);
}

export function Datatable<T = any>(props: DatatableProps<T>): React.JSX.Element;

/**
 * Apply a `DatatableQuery` (the object a `serverMode` grid passes to
 * `onServerChange`) to a plain array of rows — quick search, per-column filters,
 * sort, and paging — with the same operator semantics the grid uses in client
 * mode. Use it to back a `serverMode` Datatable from any data source (or a fake
 * backend in tests) and get identical results. Pass `columns` so number columns
 * sort/compare numerically and quick-search scans the intended fields.
 *
 * @returns `rows` (the current page), `total` (filtered count, for `rowCount`),
 *  and `filtered` (the full filtered+sorted set before paging — handy for
 *  computing server-side aggregation totals).
 */
export function runDatatableQuery<T = any>(
  rows: T[],
  query: DatatableQuery,
  options?: { columns?: DatatableColumn<T>[]; searchFields?: string[] }
): { rows: T[]; total: number; filtered: T[] };
