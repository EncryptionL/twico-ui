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
  style,
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
      {...(label ? {} : { id, className, style, ...rest })}
    />
  );

  if (!label) return table;
  // #555 - the last of #551's 59 redundant font-family declarations. base.css supplies --font-sans on
  // body and it inherits here, so this re-declared it; and being INLINE it beat a container font a
  // consumer sets on an ancestor, which is exactly the override #551 exists to let through. It also
  // applied on this branch only, so a labelled DiffTable and a bare one answered differently. The
  // label's own div below sets fontSize/fontWeight/color from tokens and no font-family - this
  // wrapper now reads what every other component reads. Do not add it back.
  //
  // `style` is destructured out of `...rest` and merged LAST rather than left in the spread: written
  // after {...rest}, the component's own style object replaced a consumer's `style` prop outright
  // instead of composing with it, so this branch silently dropped it. Same defect class as the
  // font-family above - a declaration the component writes beating one the consumer asked for -
  // in the same expression, which is why it is fixed here rather than filed.
  return (
    <div id={id} className={className} {...rest}
      style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)", ...style }}>
      <div style={{ fontSize: "var(--text-sm)", fontWeight: "var(--font-semibold)", color: "var(--color-text)" }}>{label}</div>
      {table}
    </div>
  );
}
