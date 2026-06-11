import * as React from "react";

/** Sort state: the sorted column key (null = unsorted) and direction. */
export interface TableSort {
  /** Column key being sorted, or null for no sort. */
  key: string | null;
  /** Sort direction. */
  dir: "asc" | "desc";
}

/**
 * Data table with sticky-styled header, hover/striped rows, client-side
 * sorting, custom cell renderers, and row selection highlight. Sorting is
 * controlled via `sort` + `onSortChange`, or uncontrolled via `defaultSort`.
 *
 * @startingPoint section="Data display" subtitle="Sortable data table" viewport="700x320"
 */
export interface TableProps<T = any> extends React.HTMLAttributes<HTMLDivElement> {
  columns: TableColumn<T>[];
  data: T[];
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
  /** Initial sort when uncontrolled. @default { key: null, dir: "asc" } */
  defaultSort?: TableSort;
  /** Fired when a sortable header is clicked with the next sort state: (sort). */
  onSortChange?: (sort: TableSort) => void;
  /** Returns a stable key per row. */
  rowKey?: (row: T, index: number) => string | number;
  /** Keys of rows to highlight as selected. */
  selectedKeys?: Array<string | number>;
}

export interface TableColumn<T = any> {
  /** Object key in each row + sort key. */
  key: string;
  /** Header label. */
  header: React.ReactNode;
  /** Cell alignment. @default "left" */
  align?: "left" | "center" | "right";
  /** Fixed column width (CSS value). */
  width?: string;
  /** Disable sorting for this column when the table is sortable. */
  sortable?: boolean;
  /** Custom cell renderer. */
  render?: (value: any, row: T, index: number) => React.ReactNode;
}

export function Table<T = any>(props: TableProps<T>): React.JSX.Element;
