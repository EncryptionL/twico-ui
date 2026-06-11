import React from "react";

const BREADCRUMB_CSS = `
.twc-breadcrumb { display: flex; align-items: center; flex-wrap: wrap; gap: 2px; font-family: var(--font-sans); font-size: var(--text-sm); }
.twc-breadcrumb__item { display: inline-flex; align-items: center; gap: 6px; color: var(--color-text-muted); text-decoration: none; padding: 3px 7px; border-radius: var(--radius-sm); transition: color var(--duration-fast) var(--ease-standard), background-color var(--duration-fast) var(--ease-standard); }
.twc-breadcrumb__item:hover:not([aria-current]) { color: var(--color-text); background: var(--color-surface-sunken); }
.twc-breadcrumb__item[aria-current="page"] { color: var(--color-text); font-weight: var(--font-semibold); cursor: default; }
.twc-breadcrumb__item svg { width: 15px; height: 15px; flex: none; }
.twc-breadcrumb__sep { display: inline-flex; align-items: center; color: var(--color-text-subtle); pointer-events: none; }
.twc-breadcrumb__sep svg { width: 15px; height: 15px; }
.twc-breadcrumb__ellipsis { border: none; background: transparent; cursor: pointer; color: var(--color-text-subtle); padding: 3px 7px; border-radius: var(--radius-sm); font: inherit; }
.twc-breadcrumb__ellipsis:hover { background: var(--color-surface-sunken); color: var(--color-text); }
`;

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
  React.useEffect(() => {
    if (document.getElementById("twc-breadcrumb-styles")) return;
    const el = document.createElement("style");
    el.id = "twc-breadcrumb-styles";
    el.textContent = BREADCRUMB_CSS;
    document.head.appendChild(el);
  }, []);

  const [expanded, setExpanded] = React.useState(false);
  const sep = separator || <ChevronSep />;

  let display = items;
  let collapsed = false;
  if (maxItems > 0 && items.length > maxItems && !expanded) {
    // keep first 1 + last (maxItems - 1)
    const head = items.slice(0, 1);
    const tail = items.slice(items.length - (maxItems - 1));
    display = [...head, { ellipsis: true }, ...tail];
    collapsed = true;
  }

  return (
    <nav className={`twc-breadcrumb ${className}`} aria-label="Breadcrumb" {...rest}>
      {display.map((it, i) => {
        const last = i === display.length - 1;
        return (
          <React.Fragment key={i}>
            {it.ellipsis ? (
              <button className="twc-breadcrumb__ellipsis" aria-label="Show more" onClick={() => setExpanded(true)}>…</button>
            ) : (
              <a
                className="twc-breadcrumb__item"
                href={last ? undefined : (it.href || "#")}
                aria-current={last ? "page" : undefined}
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
