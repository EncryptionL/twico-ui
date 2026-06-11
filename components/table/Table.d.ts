import * as React from "react";

/**
 * Data table with sticky-styled header, hover/striped rows, client-side
 * sorting, custom cell renderers, and row selection highlight.
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
