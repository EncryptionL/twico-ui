import React from "react";

const TREE_CSS = `
.twc-tree { font-family: var(--font-sans); font-size: var(--text-sm); user-select: none; }
.twc-tree__group { list-style: none; margin: 0; padding: 0; }
.twc-tree__group--child { margin-left: 0; overflow: hidden; }
.twc-tree__row { display: flex; align-items: center; gap: 6px; width: 100%; border: none; background: none; font: inherit; cursor: pointer;
  color: var(--color-text); text-align: left; padding: 6px 8px; border-radius: var(--radius-md);
  transition: background-color var(--duration-fast) var(--ease-standard); }
.twc-tree__row:hover { background: var(--color-surface-sunken); }
.twc-tree__row:focus-visible { outline: none; box-shadow: var(--ring); }
.twc-tree__row[data-selected="true"] { background: var(--color-primary-subtle); color: var(--color-primary-subtle-fg); font-weight: var(--font-semibold); }
.twc-tree__caret { flex: none; width: 18px; height: 18px; display: grid; place-items: center; color: var(--color-text-subtle);
  transition: transform var(--duration-base) var(--ease-spring); }
.twc-tree__caret[data-open="true"] { transform: rotate(90deg); }
.twc-tree__caret[data-leaf="true"] { visibility: hidden; }
.twc-tree__caret svg { width: 14px; height: 14px; }
.twc-tree__ic { flex: none; display: inline-flex; color: var(--color-text-muted); }
.twc-tree__ic svg { width: 16px; height: 16px; }
.twc-tree__row[data-selected="true"] .twc-tree__ic { color: var(--color-primary); }
.twc-tree__label { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.twc-tree__badge { flex: none; font-size: 11px; color: var(--color-text-subtle); }
`;

function Node({ node, depth, expanded, selectedId, onToggle, onSelect }) {
  const hasChildren = Array.isArray(node.children) && node.children.length > 0;
  const open = expanded.has(node.id);
  return (
    <li>
      <button
        className="twc-tree__row"
        data-selected={selectedId === node.id || undefined}
        style={{ paddingLeft: 8 + depth * 18 }}
        aria-expanded={hasChildren ? open : undefined}
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
        <ul className="twc-tree__group twc-tree__group--child">
          {node.children.map((c) => (
            <Node key={c.id} node={c} depth={depth + 1} expanded={expanded} selectedId={selectedId} onToggle={onToggle} onSelect={onSelect} />
          ))}
        </ul>
      ) : null}
    </li>
  );
}

export function TreeView({
  data,
  defaultExpanded = [],
  selectedId: selectedProp,
  onSelect,
  className = "",
  ...rest
}) {
  React.useEffect(() => {
    if (document.getElementById("twc-tree-styles")) return;
    const el = document.createElement("style");
    el.id = "twc-tree-styles";
    el.textContent = TREE_CSS;
    document.head.appendChild(el);
  }, []);

  const [expanded, setExpanded] = React.useState(() => new Set(defaultExpanded));
  const [selInternal, setSelInternal] = React.useState(null);
  const selectedId = selectedProp !== undefined ? selectedProp : selInternal;

  const toggle = (id) => setExpanded((s) => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n; });
  const select = (node) => { if (selectedProp === undefined) setSelInternal(node.id); onSelect?.(node); };

  return (
    <div className={`twc-tree ${className}`} role="tree" {...rest}>
      <ul className="twc-tree__group">
        {data.map((n) => (
          <Node key={n.id} node={n} depth={0} expanded={expanded} selectedId={selectedId} onToggle={toggle} onSelect={select} />
        ))}
      </ul>
    </div>
  );
}
