import React from "react";

const TABS_CSS = `
.twc-tabs { font-family: var(--font-sans); }
/* tone → accent set (default primary). Mirrors Button's --_accent model; Badge's tone vocabulary. */
.twc-tabs { --_accent: var(--color-primary); --_accent-fg: var(--color-primary-fg); --_accent-subtle: var(--color-primary-subtle); --_accent-subtle-fg: var(--color-primary-subtle-fg); --_accent-border: var(--color-primary-border); }
.twc-tabs[data-tone="success"] { --_accent: var(--color-success); --_accent-fg: var(--color-success-fg); --_accent-subtle: var(--color-success-subtle); --_accent-subtle-fg: var(--color-success-subtle-fg); --_accent-border: var(--color-success); }
.twc-tabs[data-tone="warning"] { --_accent: var(--color-warning); --_accent-fg: var(--color-warning-fg); --_accent-subtle: var(--color-warning-subtle); --_accent-subtle-fg: var(--color-warning-subtle-fg); --_accent-border: var(--color-warning); }
.twc-tabs[data-tone="danger"]  { --_accent: var(--color-danger); --_accent-fg: var(--color-danger-fg); --_accent-subtle: var(--color-danger-subtle); --_accent-subtle-fg: var(--color-danger-subtle-fg); --_accent-border: var(--color-danger); }
.twc-tabs[data-tone="info"]    { --_accent: var(--color-info); --_accent-fg: var(--color-info-fg); --_accent-subtle: var(--color-info-subtle); --_accent-subtle-fg: var(--color-info-subtle-fg); --_accent-border: var(--color-info); }
.twc-tabs[data-tone="neutral"] { --_accent: var(--color-text); --_accent-fg: var(--color-surface); --_accent-subtle: var(--color-surface-sunken); --_accent-subtle-fg: var(--color-text-muted); --_accent-border: var(--color-border-strong); }
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
.twc-tab[data-active="true"] { color: var(--_accent); }
.twc-tabs[data-variant="pill"] .twc-tab { border-radius: var(--radius-md); }
.twc-tabs[data-variant="pill"] .twc-tab[data-active="true"] { color: var(--_accent); }
.twc-tab:focus-visible { outline: none; box-shadow: var(--ring); border-radius: var(--radius-sm); }
.twc-tab svg { width: 16px; height: 16px; }
.twc-tab__count { font-size: 11px; padding: 1px 6px; border-radius: var(--radius-full); background: var(--color-surface-sunken); color: var(--color-text-muted); }
.twc-tab[data-active="true"] .twc-tab__count { background: var(--_accent-subtle); color: var(--_accent-subtle-fg); }
.twc-tabs__indicator {
  position: absolute; bottom: -1px; height: 2.5px; border-radius: var(--radius-full);
  background: var(--_accent);
  transition: left var(--duration-base) var(--ease-spring), width var(--duration-base) var(--ease-spring);
}
.twc-tabs[data-variant="pill"] .twc-tabs__indicator {
  top: 4px; bottom: 4px; height: auto; background: var(--color-surface); box-shadow: var(--shadow-sm); border-radius: var(--radius-md);
}
.twc-tabs__panel { padding-top: var(--space-4); }

/* Vertical orientation */
.twc-tabs[data-orientation="vertical"] { display: flex; gap: var(--space-4); align-items: flex-start; }
.twc-tabs[data-orientation="vertical"] .twc-tabs__list {
  flex-direction: column; gap: 2px;
  border-bottom: none; border-inline-end: var(--border-thin) solid var(--color-border);
}
.twc-tabs[data-orientation="vertical"] .twc-tab { justify-content: flex-start; }
.twc-tabs[data-orientation="vertical"][data-variant="pill"] .twc-tabs__list {
  display: inline-flex; flex-direction: column; border-inline-end: none;
}
.twc-tabs[data-orientation="vertical"] .twc-tabs__indicator {
  bottom: auto; inset-inline-start: auto; inset-inline-end: -1px; width: 2.5px; height: auto;
  transition: top var(--duration-base) var(--ease-spring), height var(--duration-base) var(--ease-spring);
}
.twc-tabs[data-orientation="vertical"][data-variant="pill"] .twc-tabs__indicator {
  top: auto; inset-inline-end: 4px; inset-inline-start: 4px; width: auto;
}
.twc-tabs[data-orientation="vertical"] .twc-tabs__panel { padding-top: 0; flex: 1; min-width: 0; }
`;

export function Tabs({
  items,
  value,
  defaultValue,
  onChange,
  variant = "line",
  tone = "primary",
  orientation = "horizontal",
  className = "",
  ...rest
}) {
  const vertical = orientation === "vertical";
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
  const [ind, setInd] = React.useState({ left: 0, width: 0, top: 0, height: 0 });
  const baseId = React.useId();
  const tabIdAt = (i) => `${baseId}-tab-${i}`;
  const panelId = `${baseId}-panel`;
  const activeIndex = items.findIndex((it) => it.value === active);

  const updateIndicator = React.useCallback(() => {
    const list = listRef.current;
    if (!list) return;
    const el = list.querySelector('[data-active="true"]');
    if (el) setInd({ left: el.offsetLeft, width: el.offsetWidth, top: el.offsetTop, height: el.offsetHeight });
  }, []);

  React.useEffect(() => { updateIndicator(); }, [active, updateIndicator, items, orientation]);
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
  const panelRendered = activeItem != null && activeItem.content !== undefined;

  // WAI-ARIA tabs keyboard pattern: arrows/Home/End move selection + focus
  // between tabs (roving tabindex keeps only the active tab in the tab order).
  function onListKeyDown(e) {
    // In each orientation only the matching arrow axis navigates; Home/End
    // jump to the ends regardless. Keeps the orthogonal arrows free for the page.
    const prevKey = vertical ? "ArrowUp" : "ArrowLeft";
    const nextKey = vertical ? "ArrowDown" : "ArrowRight";
    const keys = [prevKey, nextKey, "Home", "End"];
    if (!keys.includes(e.key)) return;
    const n = items.length;
    if (!n) return;
    e.preventDefault();
    let i = activeIndex < 0 ? 0 : activeIndex;
    if (e.key === "Home") i = 0;
    else if (e.key === "End") i = n - 1;
    else { const dir = e.key === nextKey ? 1 : -1; i = (i + dir + n) % n; }
    const it = items[i];
    if (!it) return;
    select(it.value);
    const btns = listRef.current?.querySelectorAll('[role="tab"]');
    if (btns && btns[i]) btns[i].focus();
  }

  return (
    <div className={`twc-tabs ${className}`} data-variant={variant} data-tone={tone} data-orientation={orientation} {...rest}>
      <div className="twc-tabs__list" ref={listRef} role="tablist" aria-orientation={orientation} onKeyDown={onListKeyDown}>
        {items.map((it, i) => (
          <button
            type="button"
            key={it.value}
            id={tabIdAt(i)}
            className="twc-tab"
            role="tab"
            aria-selected={it.value === active}
            aria-controls={it.value === active && panelRendered ? panelId : undefined}
            tabIndex={it.value === active ? 0 : -1}
            data-active={it.value === active || undefined}
            onClick={() => select(it.value)}
          >
            {it.icon}
            {it.label}
            {it.count != null ? <span className="twc-tab__count">{it.count}</span> : null}
          </button>
        ))}
        <span
          className="twc-tabs__indicator"
          style={vertical ? { top: ind.top, height: ind.height } : { left: ind.left, width: ind.width }}
        />
      </div>
      {panelRendered ? (
        <div className="twc-tabs__panel" role="tabpanel" id={panelId} aria-labelledby={activeIndex >= 0 ? tabIdAt(activeIndex) : undefined} tabIndex={0} key={active}>{activeItem.content}</div>
      ) : null}
    </div>
  );
}
