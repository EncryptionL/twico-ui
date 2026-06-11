import React from "react";

const LIST_CSS = `
.twc-list { display: flex; flex-direction: column; font-family: var(--font-sans); margin: 0; padding: 0; list-style: none;
  background: var(--color-surface); border: var(--border-thin) solid var(--color-border); border-radius: var(--radius-lg); overflow: hidden; }
.twc-list[data-plain="true"] { background: transparent; border: none; border-radius: 0; }
.twc-list__item { display: flex; align-items: center; gap: var(--space-3); padding: var(--space-3) var(--space-4);
  border-bottom: var(--border-thin) solid var(--color-divider); text-align: left; }
.twc-list__item:last-child { border-bottom: none; }
.twc-list[data-plain="true"] .twc-list__item { padding-left: 0; padding-right: 0; }
.twc-list__item[data-interactive="true"] { cursor: pointer; background: transparent; border-left: none; border-right: none; border-top: none; width: 100%; font: inherit; color: inherit;
  transition: background-color var(--duration-fast) var(--ease-standard); }
.twc-list__item[data-interactive="true"]:hover { background: var(--color-surface-sunken); }
.twc-list__item[data-interactive="true"]:focus-visible { outline: none; box-shadow: var(--ring); }
.twc-list__item[data-active="true"] { background: var(--color-primary-subtle); }
.twc-list__lead { flex: none; display: inline-flex; align-items: center; color: var(--color-text-muted); }
.twc-list__lead svg { width: 18px; height: 18px; }
.twc-list__main { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 1px; }
.twc-list__title { font-size: var(--text-sm); font-weight: var(--font-semibold); color: var(--color-text); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.twc-list__desc { font-size: var(--text-xs); color: var(--color-text-muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.twc-list__trail { flex: none; display: inline-flex; align-items: center; gap: var(--space-2); color: var(--color-text-subtle); font-size: var(--text-sm); }
`;

export function List({ items, plain = false, className = "", ...rest }) {
  React.useEffect(() => {
    if (document.getElementById("twc-list-styles")) return;
    const el = document.createElement("style");
    el.id = "twc-list-styles";
    el.textContent = LIST_CSS;
    document.head.appendChild(el);
  }, []);

  return (
    <ul className={`twc-list ${className}`} data-plain={plain || undefined} {...rest}>
      {items.map((it, i) => {
        const interactive = Boolean(it.onClick || it.href);
        const Tag = it.href ? "a" : interactive ? "button" : "div";
        const content = (
          <>
            {it.leading ? <span className="twc-list__lead" aria-hidden="true">{it.leading}</span> : null}
            <span className="twc-list__main">
              <span className="twc-list__title">{it.title}</span>
              {it.description ? <span className="twc-list__desc">{it.description}</span> : null}
            </span>
            {it.trailing ? <span className="twc-list__trail">{it.trailing}</span> : null}
          </>
        );
        return (
          <li key={i} style={{ display: "contents" }}>
            <Tag
              className="twc-list__item"
              data-interactive={interactive || undefined}
              data-active={it.active || undefined}
              href={it.href}
              type={Tag === "button" ? "button" : undefined}
              onClick={it.onClick}
            >
              {content}
            </Tag>
          </li>
        );
      })}
    </ul>
  );
}
