// Shared diff engine (#205 DiffTable, #239 Datatable diff mode).
//
// Pairs two row sets on a business key and classifies each paired row
// added / removed / modified / moved / unchanged, with per-field change detection and
// LIS-minimal move detection. Pure — no React, no DOM — so both DiffTable and Datatable's
// `diff` mode share identical semantics.

export const DIFF_OPS = {
  added: { label: "Added", tone: "success" },
  removed: { label: "Removed", tone: "danger" },
  modified: { label: "Modified", tone: "warning" },
  moved: { label: "Moved", tone: "info" },
  unchanged: { label: "Unchanged", tone: "neutral" },
};

// Indices forming one longest strictly-increasing subsequence — minimal move detection:
// common rows NOT on the LIS (of their to-positions, walked in from-order) are "moved".
export function lisIndexSet(seq) {
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

const cellVal = (col, row) => (col.valueGetter ? col.valueGetter(row) : row == null ? undefined : row[col.field]);

/**
 * Classify `from` (A) vs `to` (B).
 * @param columns  columns with `field` (+ optional `valueGetter`/`compare`) — drives per-field change detection.
 * @param rowKey   (row) => key to pair A↔B (defaults to `row.id`).
 * @param opts     { moveDetection = true, compare } — `compare(a, b, field)` global equality override.
 * @returns { rows: Array<{ key, op, from, to, changed: Set<field> }>, counts }
 */
export function classifyDiff(from = [], to = [], columns = [], rowKey, opts = {}) {
  const { moveDetection = true, compare } = opts;
  const k = rowKey || ((r) => (r == null ? r : r.id));
  const valEq = (a, b, col) => {
    if (col.compare) return col.compare(a, b);
    if (compare) return compare(a, b, col.field);
    if (a === b) return true;
    if (a == null || b == null) return a === b;
    return JSON.stringify(a) === JSON.stringify(b);
  };

  const fromMap = new Map(), toMap = new Map();
  from.forEach((r, i) => fromMap.set(k(r), { row: r, i }));
  to.forEach((r, i) => toMap.set(k(r), { row: r, i }));

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
    for (const col of columns) if (col.field && !valEq(cellVal(col, a.row), cellVal(col, b.row), col)) changed.add(col.field);
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
}
