import React from "react";
import { useScopedStyles } from "../_styles.js";
import { Tooltip } from "../overlay/Tooltip";

const SIDEBAR_CSS = `
/* Collapse/expand: the rail width eases (emphasis curve, --duration-slow), while text
   FADES rather than display:none-popping, and items keep their alignment so nothing
   jolts. Icons sit at space-3 + 11px (= 23px) from the edge, which is the centre of the
   68px collapsed rail, so no justify-content switch is needed. Fades are directional:
   instant on collapse (clear out, then slide), delayed on expand (slide open, then reveal). */
.twc-sidebar { display: flex; flex-direction: column; height: 100%; font-family: var(--font-sans);
  background: var(--color-surface); border-inline-end: var(--border-thin) solid var(--color-border);
  flex: 0 0 248px; min-width: 0; width: 248px; max-width: 248px;
  transition: flex-basis var(--duration-slow) var(--ease-emphasis), width var(--duration-slow) var(--ease-emphasis), max-width var(--duration-slow) var(--ease-emphasis); overflow: hidden; }
.twc-sidebar[data-collapsed="true"] { flex-basis: 68px; width: 68px; max-width: 68px; }
.twc-sidebar__head { display: flex; align-items: center; gap: var(--space-2-5); height: 60px; padding: 0 var(--space-4); flex: none; overflow: hidden;
  border-bottom: var(--border-thin) solid var(--color-divider); transition: padding var(--duration-slow) var(--ease-emphasis); }
.twc-sidebar__brand { display: inline-flex; align-items: center; gap: var(--space-2-5); font-weight: var(--font-extrabold); font-size: var(--text-lg); letter-spacing: -0.02em; color: var(--color-text); white-space: nowrap; overflow: hidden; min-width: 0;
  transition: font-size var(--duration-base) var(--ease-standard), gap var(--duration-base) var(--ease-standard); }
.twc-sidebar__nav { flex: 1 1 auto; min-height: 0; overflow-y: auto; overflow-x: hidden; padding: var(--space-3); display: flex; flex-direction: column; gap: 2px; }
.twc-sidebar__list { list-style: none; margin: 0; padding: 0; display: flex; flex-direction: column; gap: 2px; }
.twc-sidebar__section { font-size: 10px; font-weight: var(--font-bold); letter-spacing: var(--tracking-wider); text-transform: uppercase; color: var(--color-text-subtle); padding: var(--space-3) var(--space-3) var(--space-1); white-space: nowrap; overflow: hidden; max-height: 2.5rem; opacity: 1; visibility: visible;
  transition: max-height var(--duration-base) var(--ease-standard), padding var(--duration-base) var(--ease-standard), opacity var(--duration-fast) var(--ease-standard) var(--duration-fast), visibility 0s; }
.twc-sidebar[data-collapsed="true"] .twc-sidebar__section { max-height: 0; padding-top: 0; padding-bottom: 0; opacity: 0; visibility: hidden;
  transition: max-height var(--duration-base) var(--ease-standard), padding var(--duration-base) var(--ease-standard), opacity var(--duration-instant) var(--ease-standard), visibility 0s var(--duration-base); }
.twc-sidebar__item { display: flex; align-items: center; gap: var(--space-3); padding: 9px 11px; border-radius: var(--radius-md);
  font-size: var(--text-sm); font-weight: var(--font-semibold); color: var(--color-text-muted); text-decoration: none; cursor: pointer;
  border: none; background: none; font-family: inherit; width: 100%; min-width: 0; text-align: start; white-space: nowrap; overflow: hidden;
  transition: background-color var(--duration-fast) var(--ease-standard), color var(--duration-fast) var(--ease-standard); }
.twc-sidebar__item:hover { background: var(--color-surface-sunken); color: var(--color-text); }
.twc-sidebar__item[data-active="true"] { background: var(--color-primary-subtle); color: var(--color-primary-subtle-fg); }
.twc-sidebar__item:focus-visible { outline: none; box-shadow: var(--ring); }
.twc-sidebar__ic { flex: none; display: inline-flex; }
.twc-sidebar__ic svg { width: 19px; height: 19px; }
.twc-sidebar__ic--initial { width: 19px; justify-content: center; font-size: var(--text-sm); font-weight: var(--font-bold); text-transform: uppercase; line-height: 1; }
.twc-sidebar:not([data-collapsed="true"]) .twc-sidebar__ic--initial { display: none; }
.twc-sidebar__label { flex: 1 1 auto; min-width: 0; overflow: hidden; text-overflow: ellipsis; opacity: 1; visibility: visible;
  transition: opacity var(--duration-fast) var(--ease-standard) var(--duration-fast), visibility 0s; }
.twc-sidebar[data-collapsed="true"] .twc-sidebar__label { opacity: 0; visibility: hidden; transition: opacity var(--duration-instant) var(--ease-standard), visibility 0s var(--duration-instant); }
.twc-sidebar__badge { flex: none; font-size: 11px; font-weight: var(--font-bold); padding: 1px 7px; border-radius: var(--radius-full); background: var(--color-primary); color: var(--color-primary-fg); opacity: 1; visibility: visible;
  transition: opacity var(--duration-fast) var(--ease-standard) var(--duration-fast), visibility 0s; }
.twc-sidebar[data-collapsed="true"] .twc-sidebar__badge { opacity: 0; visibility: hidden; transition: opacity var(--duration-instant) var(--ease-standard), visibility 0s var(--duration-instant); }
/* Collapsed: centre the brand mark in the 68px rail (≈ the nav icon column) with no
   right padding, so a mark wider than the icons isn't clipped. flex-start (not
   justify-content) keeps it from jolting to centre while the rail is still wide. */
.twc-sidebar[data-collapsed="true"] .twc-sidebar__head { padding-inline: 18px 0; }
.twc-sidebar[data-collapsed="true"] .twc-sidebar__brand, .twc-sidebar[data-collapsed="true"] .twc-sidebar__foot-user { font-size: 0; gap: 0; }
.twc-sidebar[data-collapsed="true"] .twc-sidebar__foot-user { justify-content: center; }
.twc-sidebar__brand > :not(:first-child) { visibility: visible; transition: opacity var(--duration-fast) var(--ease-standard) var(--duration-fast), visibility 0s; }
.twc-sidebar[data-collapsed="true"] .twc-sidebar__brand > :not(:first-child) { opacity: 0; visibility: hidden; transition: opacity var(--duration-instant) var(--ease-standard), visibility 0s var(--duration-instant); }
.twc-sidebar[data-collapsed="true"] .twc-sidebar__foot-user > * > :not(:first-child) { display: none; }
.twc-sidebar__foot { flex: none; border-top: var(--border-thin) solid var(--color-divider); padding: var(--space-2); }
.twc-sidebar__foot-user { display: flex; align-items: center; padding: 6px 6px 8px; }
.twc-sidebar__collapse { display: flex; align-items: center; justify-content: center; gap: 8px; width: 100%; padding: 9px; border: none; background: none; cursor: pointer;
  color: var(--color-text-muted); border-radius: var(--radius-md); font-family: inherit; font-size: var(--text-xs); font-weight: var(--font-semibold);
  transition: background-color var(--duration-fast) var(--ease-standard), color var(--duration-fast) var(--ease-standard); }
.twc-sidebar__collapse:hover { background: var(--color-surface-sunken); color: var(--color-text); }
.twc-sidebar__collapse svg { width: 18px; height: 18px; flex: none; transition: transform var(--duration-base) var(--ease-spring); }
.twc-sidebar[data-collapsed="true"] .twc-sidebar__collapse svg { transform: rotate(180deg); }
.twc-sidebar[data-collapsed="true"] .twc-sidebar__foot { display: flex; flex-direction: column; align-items: center; padding: var(--space-2) 0; }
.twc-sidebar[data-collapsed="true"] .twc-sidebar__collapse { width: auto; padding: 11px; gap: 0; margin: 0; }
.twc-sidebar[data-collapsed="true"] .twc-sidebar__collapse span { display: none; }
`;

export function Sidebar({
  brand,
  items,
  footer,
  collapsed: collapsedProp,
  defaultCollapsed = false,
  collapsible = true,
  onCollapsedChange,
  navLabel = "Main",
  className = "",
  ...rest
}) {
  const __twcStyles = useScopedStyles("twc-sidebar-styles", SIDEBAR_CSS);
  const navId = React.useId();

  const [internal, setInternal] = React.useState(defaultCollapsed);
  const collapsed = collapsedProp !== undefined ? collapsedProp : internal;
  const toggle = () => { const next = !collapsed; if (collapsedProp === undefined) setInternal(next); onCollapsedChange?.(next); };

  // Block javascript:/data:/vbscript: URLs from reaching a DOM href (trust boundary).
  const safeHref = (url) => {
    if (url == null) return undefined;
    const s = String(url).replace(/[\x00-\x20]+/g, "").toLowerCase();
    return s.startsWith("javascript:") || s.startsWith("data:") || s.startsWith("vbscript:") ? undefined : url;
  };

  const renderItem = (it, i) => {
    const href = safeHref(it.href);
    const labelStr = typeof it.label === "string" ? it.label : undefined;
    const inner = (
      <>
        {it.icon ? (
          <span className="twc-sidebar__ic" aria-hidden="true">{it.icon}</span>
        ) : labelStr != null ? (
          <span className="twc-sidebar__ic twc-sidebar__ic--initial" aria-hidden="true">{labelStr.charAt(0)}</span>
        ) : null}
        <span className="twc-sidebar__label">{it.label}</span>
        {it.badge != null ? <span className="twc-sidebar__badge">{it.badge}</span> : null}
      </>
    );
    const common = {
      className: "twc-sidebar__item",
      "data-active": it.active || undefined,
      "aria-current": it.active ? "page" : undefined,
      onClick: it.onClick,
      "aria-label": collapsed && labelStr != null ? labelStr : undefined,
    };
    const node = href != null ? (
      <a href={href} {...common}>{inner}</a>
    ) : (
      <button type="button" {...common}>{inner}</button>
    );
    // Collapsed: the text label is hidden, so surface it as a Tooltip on the icon
    // (it portals to <body>, so the rail's overflow can't clip it).
    return collapsed && labelStr != null ? (
      <Tooltip label={labelStr} placement="right" style={{ display: "block" }}>{node}</Tooltip>
    ) : (
      node
    );
  };

  // Group items into lists — a { section } starts a new list labeled by its heading.
  const groups = [];
  let group = { sid: null, section: null, entries: [] };
  let secN = 0;
  for (let i = 0; i < items.length; i++) {
    const it = items[i];
    if (it.section) {
      if (group.entries.length || group.section != null) groups.push(group);
      secN += 1;
      group = { sid: `${navId}-sec-${secN}`, section: it.section, entries: [] };
    } else {
      group.entries.push({ it, i });
    }
  }
  if (group.entries.length || group.section != null) groups.push(group);

  return (
    <aside className={`twc-sidebar ${className}`} data-collapsed={collapsed || undefined} {...rest}>
      {__twcStyles}
      {brand ? <div className="twc-sidebar__head"><span className="twc-sidebar__brand">{brand}</span></div> : null}
      <nav id={navId} className="twc-sidebar__nav" aria-label={navLabel}>
        {groups.map((g, gi) => (
          <React.Fragment key={gi}>
            {g.section != null ? <div className="twc-sidebar__section" id={g.sid}>{g.section}</div> : null}
            <ul className="twc-sidebar__list" {...(g.section != null ? { "aria-labelledby": g.sid } : {})}>
              {g.entries.map(({ it, i }) => (
                <li key={i}>{renderItem(it, i)}</li>
              ))}
            </ul>
          </React.Fragment>
        ))}
      </nav>
      {(footer || collapsible) ? (
        <div className="twc-sidebar__foot">
          {footer ? <div className="twc-sidebar__foot-user">{footer}</div> : null}
          {collapsible ? (
            <button type="button" className="twc-sidebar__collapse" onClick={toggle} aria-expanded={!collapsed} aria-controls={navId} aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
              <span>Collapse</span>
            </button>
          ) : null}
        </div>
      ) : null}
    </aside>
  );
}
