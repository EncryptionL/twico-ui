import * as React from "react";

/** Sort state: the sorted column field (null = unsorted) and direction. */
export interface TableSort {
  /** Column field being sorted, or null for no sort. */
  field: string | null;
  /** Sort direction. */
  dir: "asc" | "desc";
}

/**
 * Data table with sticky-styled header, hover/striped rows, client-side
 * sorting, custom cell renderers, and row selection highlight. Sorting is
 * controlled via `sort` + `onSortChange`, or uncontrolled via `defaultSort`.
 * A truly pinned header (`stickyHeader`) keeps thead visible while the body
 * scrolls — pair it with `maxHeight` to give the table its own scroll area.
 * Uses the same vocabulary as `Datatable` (`rows`, `field`, `headerName`,
 * `renderCell`) so columns/data move between the two without renaming.
 *
 * @startingPoint section="Data display" subtitle="Sortable data table" viewport="700x320"
 */
export interface TableProps<T = any> extends React.HTMLAttributes<HTMLDivElement> {
  columns: TableColumn<T>[];
  /** Row objects. */
  rows?: T[];
  /** Row hover highlight. @default true */
  hover?: boolean;
  /** Zebra striping. @default false */
  striped?: boolean;
  /** @default "md" */
  size?: "sm" | "md";
  /** Enable click-to-sort headers. @default false */
  sortable?: boolean;
  /** Controlled sort state — pair with `onSortChange` (null = unsorted). */
  sort?: TableSort | null;
  /** Initial sort when uncontrolled. @default { field: null, dir: "asc" } */
  defaultSort?: TableSort;
  /** Fired when a sortable header is clicked with the next sort state: (sort). */
  onSortChange?: (sort: TableSort) => void;
  /** Returns a stable key per row. */
  rowKey?: (row: T, index: number) => string | number;
  /** Keys of rows to highlight as selected. */
  selectedKeys?: Array<string | number>;
  /** Pin the header to the top while the body scrolls (use with `maxHeight` or a scroll container). @default false */
  stickyHeader?: boolean;
  /** Cap the table height and give it its own vertical scroll area (CSS length or number of px). */
  maxHeight?: number | string;
}

export interface TableColumn<T = any> {
  /** Object key in each row + sort key. */
  field: string;
  /** Header label. */
  headerName?: React.ReactNode;
  /** Cell alignment. @default "left" */
  align?: "left" | "center" | "right";
  /** Fixed column width (CSS value). */
  width?: string;
  /** Disable sorting for this column when the table is sortable. */
  sortable?: boolean;
  /** Custom cell renderer: (value, row, index). */
  renderCell?: (value: any, row: T, index: number) => React.ReactNode;
}

export function Table<T = any>(props: TableProps<T>): React.JSX.Element;
