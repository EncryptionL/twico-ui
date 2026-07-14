import React from "react";
import { Datatable } from "./Datatable.jsx";

// #239: DiffTable is now a thin wrapper over Datatable's `diff` mode, so a diff inherits the full
// engine (density, resize, pin, reorder, sort, filter, quick-search, grouping, export, virtualization,
// pagination, single-line/clipped before→after cells). The public API (#205) is unchanged.

// DiffTableColumn → DatatableColumn. DatatableColumn.headerName is a string, so a non-string
// ReactNode header falls back to the field name (documented reconciliation).
const toDatatableColumn = (c) => ({
  field: c.field,
  headerName: typeof c.headerName === "string" ? c.headerName : c.field,
  valueGetter: c.valueGetter,
  valueFormatter: c.valueFormatter,
  compare: c.compare,
});

export function DiffTable({
  from = [],
  to = [],
  rowKey,
  columns = [],
  onlyChanged = true,
  showToggle = true,
  showSummary = true,
  moveDetection = true,
  compare,
  emptyState = "No differences.",
  toggleLabel = "Only changed",
  label,
  id,
  className = "",
  ...rest
}) {
  const dtColumns = React.useMemo(() => columns.map(toDatatableColumn), [columns]);
  const diff = React.useMemo(
    () => ({ from, to, rowKey, onlyChanged, showToggle, showSummary, moveDetection, compare, toggleLabel }),
    [from, to, rowKey, onlyChanged, showToggle, showSummary, moveDetection, compare, toggleLabel],
  );

  const table = (
    <Datatable
      columns={dtColumns}
      diff={diff}
      emptyMessage={emptyState}
      {...(label ? {} : { id, className, ...rest })}
    />
  );

  if (!label) return table;
  return (
    <div id={id} className={className} {...rest} style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)", fontFamily: "var(--font-sans)" }}>
      <div style={{ fontSize: "var(--text-sm)", fontWeight: "var(--font-semibold)", color: "var(--color-text)" }}>{label}</div>
      {table}
    </div>
  );
}
