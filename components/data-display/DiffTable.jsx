import React from "react";
import { useScopedStyles } from "../_styles.js";
import { Badge } from "./Badge.jsx";
import { Checkbox } from "../inputs/Checkbox.jsx";

const DIFFTABLE_CSS = `
.twc-difft { font-family: var(--font-sans); display: flex; flex-direction: column; gap: var(--space-3); color: var(--color-text); }
.twc-difft__head { display: flex; flex-wrap: wrap; align-items: center; gap: var(--space-3); }
.twc-difft__label { font-size: var(--text-sm); font-weight: var(--font-semibold); }
.twc-difft__summary { display: inline-flex; flex-wrap: wrap; gap: var(--space-1-5); }
.twc-difft__toggle { margin-inline-start: auto; }
.twc-difft__scroll { overflow-x: auto; border: var(--border-thin) solid var(--color-border); border-radius: var(--radius-lg); }
.twc-difft__table { width: 100%; border-collapse: collapse; font-size: var(--text-sm); }
.twc-difft__table th, .twc-difft__table td { text-align: start; padding: var(--space-2) var(--space-3); border-bottom: var(--border-thin) solid var(--color-divider); vertical-align: top; }
.twc-difft__table thead th { position: sticky; top: 0; background: var(--color-surface-sunken); font-weight: var(--font-semibold); color: var(--color-text-muted); font-size: var(--text-xs); text-transform: uppercase; letter-spacing: 0.02em; white-space: nowrap; z-index: 1; }
.twc-difft__table tbody tr:last-child td { border-bottom: none; }
.twc-difft__table tbody tr[data-op="added"] { background: color-mix(in srgb, var(--color-success) 8%, transparent); }
.twc-difft__table tbody tr[data-op="removed"] { background: color-mix(in srgb, var(--color-danger) 8%, transparent); }
.twc-difft__table tbody tr[data-op="modified"] { background: color-mix(in srgb, var(--color-warning) 8%, transparent); }
.twc-difft__op { white-space: nowrap; }
.twc-difft__change { display: inline-flex; align-items: center; flex-wrap: wrap; gap: 2px; }
.twc-difft__old { text-decoration: line-through; color: var(--color-text-subtle); }
.twc-difft__new { color: var(--color-success-subtle-fg); font-weight: var(--font-medium); }
.twc-difft__arrow { margin-inline: 6px; color: var(--color-text-subtle); }
.twc-difft__empty { padding: var(--space-8) var(--space-4); text-align: center; color: var(--color-text-muted); }
[dir="rtl"] .twc-difft__arrow { transform: scaleX(-1); display: inline-block; }
`;

const OPS = {
  added: { label: "Added", tone: "success" },
  removed: { label: "Removed", tone: "danger" },
  modified: { label: "Modified", tone: "warning" },
  moved: { label: "Moved", tone: "info" },
  unchanged: { label: "Unchanged", tone: "neutral" },
};

// Indices forming one longest strictly-increasing subsequence — used for minimal move
// detection: common rows NOT on the LIS (of their to-positions, walked in from-order) moved.
function lisIndexSet(seq) {
  const n = seq.length;
  if (n === 0) return new Set();
  const dp = new Array(n).fill(1), prev = new Array(n).fill(-1);
  let best = 0;
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < i; j++) {
      if (seq[j] < seq[i] && dp[j] + 1 > dp[i]) { dp[i] = dp[j] + 1; prev[i] = j; }
    }
    if (dp[i] > dp[best]) best = i;
  }
  const set = new Set();
  for (let i = best; i !== -1; i = prev[i]) set.add(i);
  return set;
}

const getVal = (col, row) => (col.valueGetter ? col.valueGetter(row) : row == null ? undefined : row[col.field]);
const fmtVal = (col, v) => (col.valueFormatter ? col.valueFormatter(v) : v == null ? "" : String(v));

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
  const styles = useScopedStyles("twc-difftable-styles", DIFFTABLE_CSS);
  const autoId = React.useId();
  const fieldId = id || autoId;
  const [only, setOnly] = React.useState(onlyChanged);

  const valEq = React.useCallback((a, b, col) => {
    if (col.compare) return col.compare(a, b);
    if (compare) return compare(a, b, col.field);
    if (a === b) return true;
    if (a == null || b == null) return a === b;
    return JSON.stringify(a) === JSON.stringify(b);
  }, [compare]);

  const diff = React.useMemo(() => {
    const k = rowKey || ((r) => (r == null ? r : r.id));
    const fromMap = new Map(), toMap = new Map();
    from.forEach((r, i) => fromMap.set(k(r), { row: r, i }));
    to.forEach((r, i) => toMap.set(k(r), { row: r, i }));

    // Minimal move set: LIS over the common rows' to-index, walked in from-order.
    const movedKeys = new Set();
    if (moveDetection) {
      const commonFrom = from.filter((r) => toMap.has(k(r)));
      const seq = commonFrom.map((r) => toMap.get(k(r)).i);
      const stable = lisIndexSet(seq);
      commonFrom.forEach((r, idx) => { if (!stable.has(idx)) movedKeys.add(k(r)); });
    }

    const classify = (key) => {
      const a = fromMap.get(key), b = toMap.get(key);
      if (a && !b) return { op: "removed", from: a.row, to: null, changed: new Set() };
      if (!a && b) return { op: "added", from: null, to: b.row, changed: new Set() };
      const changed = new Set();
      for (const col of columns) if (!valEq(getVal(col, a.row), getVal(col, b.row), col)) changed.add(col.field);
      if (changed.size) return { op: "modified", from: a.row, to: b.row, changed };
      if (movedKeys.has(key)) return { op: "moved", from: a.row, to: b.row, changed };
      return { op: "unchanged", from: a.row, to: b.row, changed };
    };

    // Display order: `to` order (added rows in place), then removed rows in `from` order.
    const rows = [];
    to.forEach((r) => rows.push({ key: k(r), ...classify(k(r)) }));
    from.forEach((r) => { const key = k(r); if (!toMap.has(key)) rows.push({ key, ...classify(key) }); });

    const counts = { added: 0, removed: 0, modified: 0, moved: 0, unchanged: 0 };
    rows.forEach((r) => { counts[r.op] += 1; });
    return { rows, counts };
  }, [from, to, columns, rowKey, moveDetection, valEq]);

  const visible = only ? diff.rows.filter((r) => r.op !== "unchanged") : diff.rows;

  const renderCell = (r, col) => {
    if (r.op === "removed") return <span className="twc-difft__old">{fmtVal(col, getVal(col, r.from))}</span>;
    if (r.op === "added") return <span className="twc-difft__new">{fmtVal(col, getVal(col, r.to))}</span>;
    if (r.op === "modified" && r.changed.has(col.field)) {
      return (
        <span className="twc-difft__change">
          <span className="twc-difft__old">{fmtVal(col, getVal(col, r.from))}</span>
          <span className="twc-difft__arrow" aria-hidden="true">→</span>
          <span className="twc-difft__new">{fmtVal(col, getVal(col, r.to))}</span>
        </span>
      );
    }
    return <span>{fmtVal(col, getVal(col, r.to ?? r.from))}</span>;
  };

  return (
    <div className={`twc-difft ${className}`} id={fieldId} {...rest}>
      {styles}
      {label || showSummary || showToggle ? (
        <div className="twc-difft__head">
          {label ? <div className="twc-difft__label">{label}</div> : null}
          {showSummary ? (
            <div className="twc-difft__summary">
              <Badge size="sm" variant="soft" tone="success">+{diff.counts.added} added</Badge>
              <Badge size="sm" variant="soft" tone="warning">~{diff.counts.modified} modified</Badge>
              <Badge size="sm" variant="soft" tone="danger">-{diff.counts.removed} removed</Badge>
              {diff.counts.moved ? <Badge size="sm" variant="soft" tone="info">⇅ {diff.counts.moved} moved</Badge> : null}
            </div>
          ) : null}
          {showToggle ? (
            <div className="twc-difft__toggle">
              <Checkbox label={toggleLabel} checked={only} onChange={(e) => setOnly(e.target.checked)} />
            </div>
          ) : null}
        </div>
      ) : null}

      <div className="twc-difft__scroll">
        <table className="twc-difft__table">
          <thead>
            <tr>
              <th scope="col">Change</th>
              {columns.map((c) => <th key={c.field} scope="col">{c.headerName || c.field}</th>)}
            </tr>
          </thead>
          <tbody>
            {visible.length === 0 ? (
              <tr><td className="twc-difft__empty" colSpan={columns.length + 1}>{emptyState}</td></tr>
            ) : (
              visible.map((r) => (
                <tr key={r.key} data-op={r.op}>
                  <td className="twc-difft__op"><Badge size="sm" variant="soft" tone={OPS[r.op].tone}>{OPS[r.op].label}</Badge></td>
                  {columns.map((c) => <td key={c.field}>{renderCell(r, c)}</td>)}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
