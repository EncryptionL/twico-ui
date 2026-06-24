import React from "react";
import { useScopedStyles } from "../_styles.js";

const BREADCRUMB_CSS = `
.twc-breadcrumb { display: flex; align-items: center; flex-wrap: wrap; gap: 2px; font-family: var(--font-sans); font-size: var(--text-sm); }
.twc-breadcrumb__item { display: inline-flex; align-items: center; gap: 6px; color: var(--color-text-muted); text-decoration: none; padding: 3px 7px; border-radius: var(--radius-sm); transition: color var(--duration-fast) var(--ease-standard), background-color var(--duration-fast) var(--ease-standard); }
.twc-breadcrumb__item:hover:not([aria-current]) { color: var(--color-text); background: var(--color-surface-sunken); }
.twc-breadcrumb__item[aria-current="page"] { color: var(--color-text); font-weight: var(--font-semibold); cursor: default; }
.twc-breadcrumb__item svg { width: 15px; height: 15px; flex: none; }
.twc-breadcrumb__sep { display: inline-flex; align-items: center; color: var(--color-text-subtle); pointer-events: none; }
.twc-breadcrumb__sep svg { width: 15px; height: 15px; }
[dir="rtl"] .twc-breadcrumb__sep svg { transform: scaleX(-1); }
.twc-breadcrumb__ellipsis { border: none; background: transparent; cursor: pointer; color: var(--color-text-subtle); padding: 3px 7px; border-radius: var(--radius-sm); font: inherit; }
.twc-breadcrumb__ellipsis:hover { background: var(--color-surface-sunken); color: var(--color-text); }
`;

// Block javascript:/data:/vbscript: URLs (incl. whitespace/control-char obfuscation
// that browsers strip) from reaching a DOM href. Consumer hrefs are a trust boundary.
function safeHref(url) {
  if (url == null) return undefined;
  const s = String(url).replace(/[\x00-\x20]+/g, "").toLowerCase();
  return s.startsWith("javascript:") || s.startsWith("data:") || s.startsWith("vbscript:") ? undefined : url;
}

const ChevronSep = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
);

export function Breadcrumb({
  items,
  separator,
  maxItems = 0,
  className = "",
  ...rest
}) {
  const __twcStyles = useScopedStyles("twc-breadcrumb-styles", BREADCRUMB_CSS);

  const [expanded, setExpanded] = React.useState(false);
  const sep = separator || <ChevronSep />;

  let display = items;
  let collapsed = false;
  if (maxItems > 0 && items.length > maxItems && !expanded) {
    // keep first 1 + last (maxItems - 1)
    const head = items.slice(0, 1);
    const keepTail = Math.max(1, maxItems - 1);
    const tail = items.slice(items.length - keepTail);
    display = [...head, { ellipsis: true }, ...tail];
    collapsed = true;
  }

  return (
    <nav className={`twc-breadcrumb ${className}`} aria-label="Breadcrumb" {...rest}>
      {__twcStyles}
      {display.map((it, i) => {
        const last = i === display.length - 1;
        return (
          <React.Fragment key={i}>
            {it.ellipsis ? (
              <button className="twc-breadcrumb__ellipsis" aria-label="Show more" onClick={() => setExpanded(true)}>…</button>
            ) : last ? (
              <span
                className="twc-breadcrumb__item"
                aria-current="page"
                onClick={it.onClick}
              >
                {it.icon ? <span aria-hidden="true" style={{ display: "inline-flex" }}>{it.icon}</span> : null}
                {it.label}
              </span>
            ) : (
              <a
                className="twc-breadcrumb__item"
                href={safeHref(it.href) || "#"}
                onClick={it.onClick}
              >
                {it.icon ? <span aria-hidden="true" style={{ display: "inline-flex" }}>{it.icon}</span> : null}
                {it.label}
              </a>
            )}
            {!last ? <span className="twc-breadcrumb__sep" aria-hidden="true">{sep}</span> : null}
          </React.Fragment>
        );
      })}
    </nav>
  );
}
