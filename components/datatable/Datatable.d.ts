import * as React from "react";

/**
 * Advanced data table (Material UI Data Grid Premium style): sortable, filterable
 * (per-column operators + quick search), hideable (with a searchable column list),
 * and pinnable (left/right, sticky) columns, drag-to-reorder and drag-to-resize
 * columns, a column-management + filter toolbar, density control, CSV export,
 * an optional aggregation/summary footer, optional checkbox selection with a
 * batch-action toolbar, an actions column (per-row icon buttons + overflow menu),
 * page-number pagination with a configurable rows-per-page selector, a skeleton
 * loading state, and an optional server-side mode (sort/filter/paginate on the
 * backend — only the current page is loaded). Filter controls and the pager are
 * built from the Twico Select, Input, and Pagination components.
 *
 * @startingPoint section="Data display" subtitle="MUI-style sortable/filterable/pinnable data table" viewport="900x460"
 */
export interface DatatableProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "rows"> {
  /** Column definitions. */
  columns: DatatableColumn[];
  /** Row objects. In server mode, only the current page's rows. */
  rows: any[];
  /** Show shimmering skeleton rows instead of data. @default false */
  loading?: boolean;
  /** Returns a stable key per row. @default (r,i) => r.id ?? i */
  rowKey?: (row: any, index: number) => string | number;
  /** Render a leading checkbox-selection column. @default false */
  checkboxSelection?: boolean;
  /**
   * Actions shown in the toolbar when one or more rows are selected (requires
   * `checkboxSelection`). Each handler receives the selected keys, the resolved
   * selected row objects, and a `clearSelection()` callback.
   */
  batchActions?: DatatableBatchAction[];
  /** Row height preset. @default "standard" */
  density?: "compact" | "standard" | "comfortable";
  /** Initial rows per page. 0 disables pagination. @default 10 */
  pageSize?: number;
  /** Options shown in the rows-per-page selector. @default [5, 10, 25, 50] */
  pageSizeOptions?: number[];
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
  /** Show the Export toolbar button (split button: click = CSV, chevron = format menu). @default true */
  showExport?: boolean;
  /** Filename (without extension) for exports (CSV / Excel / TSV / JSON). @default "export" */
  exportFilename?: string;
  /** Server-mode precomputed aggregation. Per field, either a scalar/node (used as-is) or a per-function map
   *  `{ sum, avg, min, max, count }` so the footer honors whichever function the user picks in the panel. */
  aggregationValues?: Record<string, React.ReactNode | Partial<Record<"sum" | "avg" | "min" | "max" | "count", React.ReactNode>>> | null;
  /** Disable drag-to-reorder of columns. @default false */
  disableColumnReorder?: boolean;
  /** Disable drag-to-resize of columns. @default false */
  disableColumnResize?: boolean;
  /** Make all columns editable by default (double-click a cell to edit; per-column `editable` overrides). @default false */
  editMode?: boolean;
  /** Called when a cell edit is committed: (updatedRow, originalRow, field). */
  onRowUpdate?: (updatedRow: any, originalRow: any, field: string) => void;
  /** Controlled-rows callback: receives the full next rows array after an edit (client mode). */
  onRowsChange?: (rows: any[]) => void;
  /** Fired when the built-in batch editor applies columns across selected rows:
   *  (changedRows, patch, selectedKeys). The selection-toolbar "Edit" button appears
   *  automatically when there are editable columns. */
  onBatchUpdate?: (changedRows: any[], patch: Record<string, any>, selectedKeys: Array<string | number>) => void;
  /** Show a "Go to" page jumper in the footer when there are more than 5 pages. @default true */
  showPageJumper?: boolean;
  /** Click-to-select mode: "row" highlights the clicked row, "cell" highlights a single cell. @default "none" */
  selectionMode?: "none" | "row" | "cell";
  /** Fired when a row is clicked in "row" selection mode: (row, key). */
  onRowClick?: (row: any, key: string | number) => void;
  /** Fired when a cell is clicked in "cell" selection mode: (value, row, field). */
  onCellClick?: (value: any, row: any, field: string) => void;
  /** Fired when the active cell changes: ({ key, field } | null). */
  onActiveCellChange?: (cell: { key: string | number; field: string } | null) => void;
  /** Initial “show totals row” state. Aggregation is OFF by default and is configured at runtime from the toolbar **Aggregation** panel (pick columns + function); a column's `aggregation` prop just seeds the initial choice. @default false */
  showAggregation?: boolean;
  /** Accessible label for the grid (role="grid"). @default "Data table" */
  ariaLabel?: string;
  /** Initial row-grouping fields (collapsible groups with subtotals). Users can also group via a column's ⋮ menu. @default [] */
  rowGrouping?: string[];
  /** Enable row pinning — adds "Pin to top/bottom" to each row's actions menu; pinned rows stay sticky above/below the scroll body. @default false */
  rowPinning?: boolean;
  /** Enable drag-to-reorder of rows (whole row is draggable). Persists via `onRowOrderChange`. Disabled while sorting or grouping. @default false */
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
}

/** Query state reported by a server-mode Datatable. */
export interface DatatableQuery {
  /** Zero-based page index. */
  page: number;
  /** Current rows per page. */
  pageSize: number;
  /** Active sort, or null. */
  sort: { field: string; dir: "asc" | "desc" } | null;
  /** Active column filters. */
  filters: Array<{ field: string; op: string; value: string }>;
  /** Quick-search text. */
  quickFilter: string;
}

export interface DatatableColumn {
  /** Row object key (also the sort/filter key). */
  field: string;
  /** Header label. @default field */
  headerName?: string;
  /** Data type. "actions" renders per-row action buttons via getActions. @default "string" */
  type?: "string" | "number" | "actions";
  /** Column width in px. @default 160 (110 for actions) */
  width?: number;
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
  /** Summary-footer aggregation: a preset, or a function over the column's values. */
  aggregation?: "sum" | "avg" | "min" | "max" | "count" | ((values: any[], rows: any[]) => React.ReactNode);
  /** Format an aggregation result for the footer (falls back to valueFormatter). */
  aggregationFormatter?: (value: any) => React.ReactNode;
  /** Map a row to its exported CSV value (defaults to the raw field value). */
  exportValue?: (value: any, row: any) => string | number;
  /** Make this column's cells editable (double-click to edit). Overrides the grid `editMode`. */
  editable?: boolean;
  /** Editor type. "select" (or any column with `valueOptions`) renders a dropdown; else a text/number input by column type. */
  editType?: "text" | "number" | "select";
  /** Hide the column header ⋮ menu. @default true for actions columns, else false */
  disableColumnMenu?: boolean;
  /** Distinct values for the "is any of" multi-value filter (recommended in server mode). */
  valueOptions?: Array<string | { value: string; label: string }>;
  /** Format the raw value to a string/number for display. */
  valueFormatter?: (value: any, row: any) => React.ReactNode;
  /** Fully custom cell renderer (badges, avatars, etc.). */
  renderCell?: (value: any, row: any) => React.ReactNode;
  /** For type:"actions" — returns the row's action items. */
  getActions?: (row: any) => DatatableRowAction[];
}

/** A per-row action in an actions column. */
export interface DatatableRowAction {
  /** Icon node (rendered as an icon button, or leading icon in the overflow menu). */
  icon?: React.ReactNode;
  /** Accessible label / tooltip / menu text. */
  label: string;
  /** Click handler, receives the row. */
  onClick?: (row: any) => void;
  /** Place in the ⋮ overflow menu instead of inline. @default false */
  showInMenu?: boolean;
  /** Render in danger color. */
  danger?: boolean;
  disabled?: boolean;
}

/** A batch action shown in the selection toolbar. */
export interface DatatableBatchAction {
  /** Button label. */
  label: string;
  /** Leading icon node. */
  icon?: React.ReactNode;
  /** Handler: (selectedKeys, selectedRows, clearSelection). */
  onClick?: (keys: Array<string | number>, rows: any[], clearSelection: () => void) => void;
  /** Render in danger color. */
  danger?: boolean;
  disabled?: boolean;
}

export function Datatable(props: DatatableProps): React.JSX.Element;
