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
export interface DatatableProps<T = any> extends Omit<React.HTMLAttributes<HTMLDivElement>, "rows"> {
  /** Column definitions. */
  columns: DatatableColumn<T>[];
  /** Row objects. In server mode, only the current page's rows. */
  rows: T[];
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
  /** Server-mode callback fired (debounced) whenever the query changes. */
  onServerChange?: (state: DatatableQuery) => void;
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
  /** Show a "Go to" page jumper in the footer when there are more than 5 pages. @default true */
  showPageJumper?: boolean;
  /** Click-to-select mode: "row" highlights the clicked row, "cell" highlights a single cell. @default "none" */
  selectionMode?: "none" | "row" | "cell";
  /** Fired when a row is clicked in "row" selection mode: (row, key). */
  onRowClick?: (row: T, key: string | number) => void;
  /** Fired when a cell is clicked in "cell" selection mode: (value, row, field). */
  onCellClick?: (value: any, row: T, field: string) => void;
  /** Fired when the active cell changes: ({ key, field } | null). */
  onActiveCellChange?: (cell: { key: string | number; field: string } | null) => void;
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
  /** Called with the new array of row keys after a drag-reorder. */
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
  /** Quick-search text. */
  quickFilter: string;
}

export interface DatatableColumn<T = any> {
  /** Row object key (also the sort/filter key). */
  field: string;
  /** Header label. @default field ("Actions" for actions columns) */
  headerName?: string;
  /** Data type. "actions" renders per-row action buttons via getActions. @default "string" */
  type?: "string" | "number" | "actions";
  /** Column width in px. @default 160 (120 for actions) */
  width?: number;
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
  /** Hide the column header ⋮ menu. @default false */
  disableColumnMenu?: boolean;
  /** Start with this column's cell text wrapped onto multiple lines (the row grows down) instead of
   *  clipped to one line. Users can also toggle it live from the column ⋮ menu ("Wrap text"). @default false */
  wrapText?: boolean;
  /** Distinct values for the "is any of" multi-value filter (recommended in server mode). */
  valueOptions?: Array<string | { value: string; label: string }>;
  /** Format the raw value to a string/number for display. */
  valueFormatter?: (value: any, row: T) => React.ReactNode;
  /** Fully custom cell renderer (badges, avatars, etc.). */
  renderCell?: (value: any, row: T) => React.ReactNode;
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

/** A batch action shown in the selection toolbar. */
export interface DatatableBatchAction<T = any> {
  /** Button label. */
  label: string;
  /** Leading icon node. */
  icon?: React.ReactNode;
  /** Handler: (selectedKeys, selectedRows, clearSelection). */
  onClick?: (keys: Array<string | number>, rows: T[], clearSelection: () => void) => void;
  /** Render in danger color. */
  danger?: boolean;
  disabled?: boolean;
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
