import React from "react";

const TABLE_CSS = `
.twc-table-wrap { width: 100%; overflow-x: auto; border-radius: var(--radius-lg); border: var(--border-thin) solid var(--color-border); background: var(--color-surface); }
.twc-table { width: 100%; border-collapse: collapse; font-family: var(--font-sans); font-size: var(--text-sm); color: var(--color-text); }
.twc-table thead th {
  text-align: start; font-weight: var(--font-semibold); color: var(--color-text-muted);
  font-size: var(--text-xs); letter-spacing: var(--tracking-wide); text-transform: uppercase;
  padding: var(--space-3) var(--space-4); background: var(--color-surface-sunken);
  border-bottom: var(--border-thin) solid var(--color-border); white-space: nowrap;
}
.twc-table th[data-align="right"], .twc-table td[data-align="right"] { text-align: end; }
.twc-table th[data-align="center"], .twc-table td[data-align="center"] { text-align: center; }
.twc-table th[data-sortable="true"] { cursor: pointer; user-select: none; }
.twc-table th[data-sortable="true"]:hover { color: var(--color-text); }
.twc-table__sort { display: inline-flex; align-items: center; gap: 5px; }
.twc-table__sort svg { width: 13px; height: 13px; opacity: 0.5; transition: opacity var(--duration-fast), transform var(--duration-fast); }
.twc-table th[data-active="true"] .twc-table__sort svg { opacity: 1; color: var(--color-primary); }
.twc-table th[data-dir="desc"] .twc-table__sort svg { transform: rotate(180deg); }
.twc-table tbody td { padding: var(--space-3) var(--space-4); border-bottom: var(--border-thin) solid var(--color-divider); }
.twc-table tbody tr:last-child td { border-bottom: none; }
.twc-table[data-hover="true"] tbody tr { transition: background-color var(--duration-fast) var(--ease-standard); }
.twc-table[data-hover="true"] tbody tr:hover { background: var(--color-surface-sunken); }
.twc-table[data-striped="true"] tbody tr:nth-child(even) { background: color-mix(in srgb, var(--color-surface-sunken) 55%, transparent); }
.twc-table tbody tr[data-selected="true"] { background: var(--color-primary-subtle); }
.twc-table[data-size="sm"] thead th { padding: var(--space-2) var(--space-3); }
.twc-table[data-size="sm"] tbody td { padding: var(--space-2) var(--space-3); }
.twc-table[data-size="lg"] thead th { padding: var(--space-4) var(--space-5); }
.twc-table[data-size="lg"] tbody td { padding: var(--space-4) var(--space-5); font-size: var(--text-base); }
.twc-table[data-sticky="true"] thead th { position: sticky; top: 0; z-index: 2; background: var(--color-surface); box-shadow: inset 0 calc(-1 * var(--border-thin)) 0 0 var(--color-border); }
`;

export function Table({
  columns,
  rows: rowsProp,
  hover = true,
  striped = false,
  size = "md",
  sortable = false,
  sort: sortProp,
  defaultSort,
  onSortChange,
  rowKey,
  selectedKeys,
  stickyHeader = false,
  maxHeight,
  className = "",
  ...rest
}) {
  React.useInsertionEffect(() => {
    if (document.getElementById("twc-table-styles")) return;
    const el = document.createElement("style");
    el.id = "twc-table-styles";
    el.textContent = TABLE_CSS;
    document.head.appendChild(el);
  }, []);

  // Normalize each column to the canonical Datatable vocabulary (field / headerName / renderCell);
  // `header`/`render` are local shorthands for the render below.
  const cols = React.useMemo(
    () => (columns || []).map((c) => ({ ...c, header: c.headerName, render: c.renderCell })),
    [columns]
  );
  const dataRows = rowsProp || [];

  const [internalSort, setInternalSort] = React.useState(defaultSort || { field: null, dir: "asc" });
  const sort = (sortProp !== undefined ? sortProp : internalSort) || { field: null, dir: "asc" };

  const rows = React.useMemo(() => {
    if (!sortable || !sort.field) return dataRows;
    const col = cols.find((c) => c.field === sort.field);
    if (!col) return dataRows;
    const sorted = [...dataRows].sort((a, b) => {
      const av = a[sort.field], bv = b[sort.field];
      if (av == null) return 1; if (bv == null) return -1;
      if (typeof av === "number" && typeof bv === "number") return av - bv;
      return String(av).localeCompare(String(bv));
    });
    return sort.dir === "desc" ? sorted.reverse() : sorted;
  }, [dataRows, cols, sort, sortable]);

  function toggleSort(field) {
    const next = sort.field === field ? { field, dir: sort.dir === "asc" ? "desc" : "asc" } : { field, dir: "asc" };
    if (sortProp === undefined) setInternalSort(next);
    onSortChange?.(next);
  }

  const keyFn = rowKey || ((_, i) => i);
  const selected = new Set(selectedKeys || []);

  const wrapStyle = maxHeight !== undefined ? { ...rest.style, maxHeight, overflowY: "auto" } : rest.style;

  return (
    <div className={`twc-table-wrap ${className}`} {...rest} style={wrapStyle}>
      <table className="twc-table" data-hover={hover || undefined} data-striped={striped || undefined} data-size={size} data-sticky={stickyHeader || undefined}>
        <thead>
          <tr>
            {cols.map((c) => {
              const active = sort.field === c.field;
              const canSort = sortable && c.sortable !== false;
              return (
                <th key={c.field} data-align={c.align} data-sortable={canSort || undefined} data-active={active || undefined} data-dir={active ? sort.dir : undefined}
                    style={c.width ? { width: c.width } : undefined}
                    onClick={canSort ? () => toggleSort(c.field) : undefined}>
                  {canSort ? (
                    <span className="twc-table__sort">{c.header}
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m18 15-6-6-6 6"/></svg>
                    </span>
                  ) : c.header}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => {
            const k = keyFn(row, i);
            return (
              <tr key={k} data-selected={selected.has(k) || undefined}>
                {cols.map((c) => (
                  <td key={c.field} data-align={c.align}>
                    {c.render ? c.render(row[c.field], row, i) : row[c.field]}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
