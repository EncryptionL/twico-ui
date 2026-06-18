import React from "react";

const TREE_CSS = `
.twc-tree { font-family: var(--font-sans); font-size: var(--text-sm); user-select: none; }
.twc-tree__group { list-style: none; margin: 0; padding: 0; }
.twc-tree__group--child { margin-inline-start: 0; overflow: hidden; }
.twc-tree__row { display: flex; align-items: center; gap: 6px; width: 100%; border: none; background: none; font: inherit; cursor: pointer;
  color: var(--color-text); text-align: start; padding: 6px 8px; border-radius: var(--radius-md);
  transition: background-color var(--duration-fast) var(--ease-standard); }
.twc-tree__row:hover { background: var(--color-surface-sunken); }
.twc-tree__row:focus-visible { outline: none; box-shadow: var(--ring); }
.twc-tree__row[data-selected="true"] { background: var(--color-primary-subtle); color: var(--color-primary-subtle-fg); font-weight: var(--font-semibold); }
.twc-tree__caret { flex: none; width: 18px; height: 18px; display: grid; place-items: center; color: var(--color-text-subtle);
  transition: transform var(--duration-base) var(--ease-spring); }
.twc-tree__caret[data-open="true"] { transform: rotate(90deg); }
[dir="rtl"] .twc-tree__caret { transform: scaleX(-1); }
[dir="rtl"] .twc-tree__caret[data-open="true"] { transform: scaleX(-1) rotate(90deg); }
.twc-tree__caret[data-leaf="true"] { visibility: hidden; }
.twc-tree__caret svg { width: 14px; height: 14px; }
.twc-tree__ic { flex: none; display: inline-flex; color: var(--color-text-muted); }
.twc-tree__ic svg { width: 16px; height: 16px; }
.twc-tree__row[data-selected="true"] .twc-tree__ic { color: var(--color-primary); }
.twc-tree__label { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.twc-tree__badge { flex: none; font-size: 11px; color: var(--color-text-subtle); }
`;

function Node({ node, depth, expanded, selectedId, tabbableId, rowRefs, onToggle, onSelect, onRowFocus }) {
  const hasChildren = Array.isArray(node.children) && node.children.length > 0;
  const open = expanded.has(node.id);
  return (
    <li role="none">
      <button
        type="button"
        className="twc-tree__row"
        role="treeitem"
        aria-level={depth + 1}
        aria-selected={selectedId === node.id}
        data-selected={selectedId === node.id || undefined}
        data-tree-id={node.id}
        tabIndex={node.id === tabbableId ? 0 : -1}
        ref={(el) => { if (el) rowRefs.current.set(node.id, el); else rowRefs.current.delete(node.id); }}
        style={{ paddingInlineStart: 8 + depth * 18 }}
        aria-expanded={hasChildren ? open : undefined}
        onFocus={() => onRowFocus(node.id)}
        onClick={() => { if (hasChildren) onToggle(node.id); onSelect?.(node); }}
      >
        <span className="twc-tree__caret" data-open={open || undefined} data-leaf={!hasChildren || undefined} aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
        </span>
        {node.icon ? <span className="twc-tree__ic" aria-hidden="true">{node.icon}</span> : null}
        <span className="twc-tree__label">{node.label}</span>
        {node.badge != null ? <span className="twc-tree__badge">{node.badge}</span> : null}
      </button>
      {hasChildren && open ? (
        <ul className="twc-tree__group twc-tree__group--child" role="group">
          {node.children.map((c) => (
            <Node key={c.id} node={c} depth={depth + 1} expanded={expanded} selectedId={selectedId} tabbableId={tabbableId}
                  rowRefs={rowRefs} onToggle={onToggle} onSelect={onSelect} onRowFocus={onRowFocus} />
          ))}
        </ul>
      ) : null}
    </li>
  );
}

export function TreeView({
  items = [],
  defaultExpanded = [],
  expanded: expandedProp,
  onExpandedChange,
  selectedId: selectedProp,
  defaultSelectedId = null,
  onSelect,
  className = "",
  ...rest
}) {
  const nodes = items;
  React.useInsertionEffect(() => {
    if (document.getElementById("twc-tree-styles")) return;
    const el = document.createElement("style");
    el.id = "twc-tree-styles";
    el.textContent = TREE_CSS;
    document.head.appendChild(el);
  }, []);

  const [expInternal, setExpInternal] = React.useState(() => new Set(defaultExpanded));
  const expanded = expandedProp !== undefined ? new Set(expandedProp) : expInternal;
  const [selInternal, setSelInternal] = React.useState(defaultSelectedId);
  const selectedId = selectedProp !== undefined ? selectedProp : selInternal;
  const [focusId, setFocusId] = React.useState(null);
  const rowRefs = React.useRef(new Map());

  const toggle = (id) => {
    const n = new Set(expanded);
    n.has(id) ? n.delete(id) : n.add(id);
    if (expandedProp === undefined) setExpInternal(n);
    onExpandedChange?.([...n]);
  };
  // onSelect is id-first (the id you usually need), with the full node as a second arg.
  const select = (node) => { if (selectedProp === undefined) setSelInternal(node.id); onSelect?.(node.id, node); };

  // Visible rows in render order + parent/children lookups, for roving-tabindex keyboard nav.
  const visible = [];
  const parentOf = new Map();
  const hasKids = new Map();
  const walk = (nodes, parentId) => {
    for (const n of nodes) {
      visible.push(n.id);
      parentOf.set(n.id, parentId);
      const kids = Array.isArray(n.children) && n.children.length > 0;
      hasKids.set(n.id, kids);
      if (kids && expanded.has(n.id)) walk(n.children, n.id);
    }
  };
  walk(nodes, null);

  // One Tab stop: the last-focused row, else the selected row, else the first row.
  const tabbableId = visible.includes(focusId) ? focusId : visible.includes(selectedId) ? selectedId : visible[0];

  const focusRow = (id) => { setFocusId(id); rowRefs.current.get(id)?.focus(); };

  // WAI-ARIA tree pattern: ArrowUp/Down move, ArrowRight expands/descends, ArrowLeft collapses/ascends, Home/End jump.
  const onKeyDown = (e) => {
    const row = e.target.closest?.("[data-tree-id]");
    if (!row) return;
    const id = row.getAttribute("data-tree-id");
    const i = visible.indexOf(id);
    if (i === -1) return;
    const open = expanded.has(id);
    let next = null;
    if (e.key === "ArrowDown") next = visible[i + 1];
    else if (e.key === "ArrowUp") next = visible[i - 1];
    else if (e.key === "Home") next = visible[0];
    else if (e.key === "End") next = visible[visible.length - 1];
    else if (e.key === "ArrowRight") {
      if (hasKids.get(id) && !open) { e.preventDefault(); toggle(id); return; }
      if (hasKids.get(id) && open) next = visible[i + 1];
    } else if (e.key === "ArrowLeft") {
      if (hasKids.get(id) && open) { e.preventDefault(); toggle(id); return; }
      next = parentOf.get(id);
    } else return;
    e.preventDefault();
    if (next != null) focusRow(next);
  };

  return (
    <div className={`twc-tree ${className}`} role="tree" onKeyDown={onKeyDown} {...rest}>
      <ul className="twc-tree__group" role="none">
        {nodes.map((n) => (
          <Node key={n.id} node={n} depth={0} expanded={expanded} selectedId={selectedId} tabbableId={tabbableId}
                rowRefs={rowRefs} onToggle={toggle} onSelect={select} onRowFocus={setFocusId} />
        ))}
      </ul>
    </div>
  );
}
