import React from "react";
import { useScopedStyles } from "../_styles.js";

const LIST_CSS = `
.twc-list { display: flex; flex-direction: column; font-family: var(--font-sans); margin: 0; padding: 0; list-style: none;
  background: var(--color-surface); border: var(--border-thin) solid var(--color-border); border-radius: var(--radius-lg); overflow: hidden; }
.twc-list[data-plain="true"] { background: transparent; border: none; border-radius: 0; }
.twc-list__item { display: flex; align-items: center; gap: var(--space-3); padding: var(--space-3) var(--space-4);
  border-bottom: var(--border-thin) solid var(--color-divider); text-align: start; }
.twc-list__item:last-child { border-bottom: none; }
.twc-list[data-plain="true"] .twc-list__item { padding-inline-start: 0; padding-inline-end: 0; }
.twc-list__item[data-interactive="true"] { cursor: pointer; background: transparent; border-inline-start: none; border-inline-end: none; border-top: none; width: 100%; font: inherit; color: inherit;
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
.twc-list__empty { padding: 30px 12px; text-align: center; color: var(--color-text-subtle); font-size: var(--text-sm); }
`;

export function List({ items, plain = false, emptyMessage, className = "", ...rest }) {
  const __twcStyles = useScopedStyles("twc-list-styles", LIST_CSS);

  // Block javascript:/data:/vbscript: URLs from reaching a DOM href (trust boundary).
  const safeHref = (url) => {
    if (url == null) return undefined;
    const s = String(url).replace(/[\x00-\x20]+/g, "").toLowerCase();
    return s.startsWith("javascript:") || s.startsWith("data:") || s.startsWith("vbscript:") ? undefined : url;
  };

  return (
    // role="list" before {...rest} so a consumer can still override it (e.g. role="menu");
    // list-style:none + display:contents on the <li> drop the implicit list/listitem roles
    // in some engines, so we set them explicitly (#123).
    <ul className={`twc-list ${className}`} role="list" data-plain={plain || undefined} {...rest}>
      {__twcStyles}
      {items.length === 0 ? (
        <li role="presentation" style={{ display: "contents" }}>
          <div className="twc-list__empty">{emptyMessage ?? "Nothing here yet"}</div>
        </li>
      ) : items.map((it, i) => {
        const href = safeHref(it.href);
        const interactive = Boolean(it.onClick || href);
        const Tag = href ? "a" : interactive ? "button" : "div";
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
          <li key={i} role="listitem" style={{ display: "contents" }}>
            <Tag
              className="twc-list__item"
              data-interactive={interactive || undefined}
              data-active={it.active || undefined}
              aria-current={it.active ? "page" : undefined}
              href={href}
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
