import * as React from "react";

/** The classification of a paired row. */
export type DiffOp = "added" | "removed" | "modified" | "moved" | "unchanged";

/** A column definition for DiffTable. */
export interface DiffTableColumn<Row = any> {
  /** Row property this column reads (also its React key). */
  field: string;
  /** Header label; defaults to `field`. */
  headerName?: React.ReactNode;
  /** Custom value accessor; defaults to `row[field]`. */
  valueGetter?: (row: Row) => unknown;
  /** Format a value for display; defaults to `String(value)`. */
  valueFormatter?: (value: any) => React.ReactNode;
  /** Per-column equality override (return true when the two values are equal). */
  compare?: (a: any, b: any) => boolean;
}

/**
 * Row + field-level comparison of two datasets. Pairs rows from `from` and `to`
 * on `rowKey`, classifies each **added / removed / modified / moved**, and renders
 * modified rows as per-cell `before → after` (strikethrough old, accented new). Shows
 * an op badge per row, a `+N ~M -K` summary, and an "only changed" toggle.
 *
 * @startingPoint section="Data display" subtitle="Compare two datasets" viewport="900x420"
 */
export interface DiffTableProps<Row = any> extends Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
  /** The "before" rows (version A). */
  from?: Row[];
  /** The "after" rows (version B). */
  to?: Row[];
  /** Stable business key per row, used to pair A↔B. Defaults to `row.id`. */
  rowKey?: (row: Row) => React.Key;
  /** Columns to compare and render. */
  columns?: DiffTableColumn<Row>[];
  /** Hide unchanged rows (the toggle's initial state). @default true */
  onlyChanged?: boolean;
  /** Render the "only changed" toggle. @default true */
  showToggle?: boolean;
  /** Render the +added ~modified -removed summary badges. @default true */
  showSummary?: boolean;
  /** Classify same-value rows whose position changed as "moved" (minimal LIS-based set). @default true */
  moveDetection?: boolean;
  /** Global equality override for all fields (return true when equal). Falls back to `===` then JSON compare. */
  compare?: (a: any, b: any, field: string) => boolean;
  /** Shown when there are no rows to display. @default "No differences." */
  emptyState?: React.ReactNode;
  /** Label for the "only changed" toggle. @default "Only changed" */
  toggleLabel?: React.ReactNode;
  /** Optional heading above the table. */
  label?: React.ReactNode;
}

export function DiffTable<Row = any>(props: DiffTableProps<Row>): React.JSX.Element;
