import React from "react";

const TABS_CSS = `
.twc-tabs { font-family: var(--font-sans); }
.twc-tabs__list {
  position: relative; display: flex; gap: 2px;
  border-bottom: var(--border-thin) solid var(--color-border);
}
.twc-tabs[data-variant="pill"] .twc-tabs__list {
  gap: 4px; border-bottom: none; padding: 4px;
  background: var(--color-surface-sunken); border-radius: var(--radius-lg);
  display: inline-flex;
}
.twc-tab {
  position: relative; z-index: 1; display: inline-flex; align-items: center; gap: 7px;
  padding: var(--space-2-5) var(--space-4); border: none; background: transparent;
  font-family: inherit; font-size: var(--text-sm); font-weight: var(--font-semibold);
  color: var(--color-text-muted); cursor: pointer; white-space: nowrap;
  transition: color var(--duration-fast) var(--ease-standard);
}
.twc-tab:hover:not([data-active="true"]) { color: var(--color-text); }
.twc-tab[data-active="true"] { color: var(--color-primary); }
.twc-tabs[data-variant="pill"] .twc-tab { border-radius: var(--radius-md); }
.twc-tabs[data-variant="pill"] .twc-tab[data-active="true"] { color: var(--color-primary); }
.twc-tab:focus-visible { outline: none; box-shadow: var(--ring); border-radius: var(--radius-sm); }
.twc-tab svg { width: 16px; height: 16px; }
.twc-tab__count { font-size: 11px; padding: 1px 6px; border-radius: var(--radius-full); background: var(--color-surface-sunken); color: var(--color-text-muted); }
.twc-tab[data-active="true"] .twc-tab__count { background: var(--color-primary-subtle); color: var(--color-primary-subtle-fg); }
.twc-tabs__indicator {
  position: absolute; bottom: -1px; height: 2.5px; border-radius: var(--radius-full);
  background: var(--color-primary);
  transition: left var(--duration-base) var(--ease-spring), width var(--duration-base) var(--ease-spring);
}
.twc-tabs[data-variant="pill"] .twc-tabs__indicator {
  top: 4px; bottom: 4px; height: auto; background: var(--color-surface); box-shadow: var(--shadow-sm); border-radius: var(--radius-md);
}
.twc-tabs__panel { padding-top: var(--space-4); }
`;

export function Tabs({
  items,
  value,
  defaultValue,
  onChange,
  variant = "line",
  className = "",
  ...rest
}) {
  React.useInsertionEffect(() => {
    if (document.getElementById("twc-tabs-styles")) return;
    const el = document.createElement("style");
    el.id = "twc-tabs-styles";
    el.textContent = TABS_CSS;
    document.head.appendChild(el);
  }, []);

  const [internal, setInternal] = React.useState(defaultValue ?? items[0]?.value);
  const active = value ?? internal;
  const listRef = React.useRef(null);
  const [ind, setInd] = React.useState({ left: 0, width: 0 });
  const baseId = React.useId();
  const tabIdAt = (i) => `${baseId}-tab-${i}`;
  const panelId = `${baseId}-panel`;
  const activeIndex = items.findIndex((it) => it.value === active);

  const updateIndicator = React.useCallback(() => {
    const list = listRef.current;
    if (!list) return;
    const el = list.querySelector('[data-active="true"]');
    if (el) setInd({ left: el.offsetLeft, width: el.offsetWidth });
  }, []);

  React.useEffect(() => { updateIndicator(); }, [active, updateIndicator, items]);
  React.useEffect(() => {
    const r = () => updateIndicator();
    window.addEventListener("resize", r);
    return () => window.removeEventListener("resize", r);
  }, [updateIndicator]);

  function select(v) {
    if (value === undefined) setInternal(v);
    onChange?.(v);
  }

  const activeItem = items.find((i) => i.value === active);

  // WAI-ARIA tabs keyboard pattern: arrows/Home/End move selection + focus
  // between tabs (roving tabindex keeps only the active tab in the tab order).
  function onListKeyDown(e) {
    const keys = ["ArrowRight", "ArrowLeft", "ArrowDown", "ArrowUp", "Home", "End"];
    if (!keys.includes(e.key)) return;
    const n = items.length;
    if (!n) return;
    e.preventDefault();
    let i = activeIndex < 0 ? 0 : activeIndex;
    if (e.key === "Home") i = 0;
    else if (e.key === "End") i = n - 1;
    else { const dir = e.key === "ArrowRight" || e.key === "ArrowDown" ? 1 : -1; i = (i + dir + n) % n; }
    const it = items[i];
    if (!it) return;
    select(it.value);
    const btns = listRef.current?.querySelectorAll('[role="tab"]');
    if (btns && btns[i]) btns[i].focus();
  }

  return (
    <div className={`twc-tabs ${className}`} data-variant={variant} {...rest}>
      <div className="twc-tabs__list" ref={listRef} role="tablist" onKeyDown={onListKeyDown}>
        {items.map((it, i) => (
          <button
            key={it.value}
            id={tabIdAt(i)}
            className="twc-tab"
            role="tab"
            aria-selected={it.value === active}
            aria-controls={panelId}
            tabIndex={it.value === active ? 0 : -1}
            data-active={it.value === active || undefined}
            onClick={() => select(it.value)}
          >
            {it.icon}
            {it.label}
            {it.count != null ? <span className="twc-tab__count">{it.count}</span> : null}
          </button>
        ))}
        <span className="twc-tabs__indicator" style={{ left: ind.left, width: ind.width }} />
      </div>
      {activeItem && activeItem.content !== undefined ? (
        <div className="twc-tabs__panel" role="tabpanel" id={panelId} aria-labelledby={activeIndex >= 0 ? tabIdAt(activeIndex) : undefined} tabIndex={0} key={active}>{activeItem.content}</div>
      ) : null}
    </div>
  );
}
