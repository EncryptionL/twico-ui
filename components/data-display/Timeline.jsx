import React from "react";

const TIMELINE_CSS = `
.twc-timeline { display: flex; flex-direction: column; font-family: var(--font-sans); margin: 0; padding: 0; list-style: none; }
.twc-timeline__item { position: relative; display: flex; gap: var(--space-4); padding-bottom: var(--space-6); }
.twc-timeline__item:last-child { padding-bottom: 0; }
.twc-timeline__rail { position: relative; flex: none; width: 32px; display: flex; justify-content: center; }
.twc-timeline__dot { z-index: 1; flex: none; width: 32px; height: 32px; border-radius: var(--radius-full); display: grid; place-items: center;
  background: var(--color-surface); border: var(--border-medium) solid var(--color-border-strong); color: var(--color-text-subtle); box-shadow: 0 0 0 4px var(--color-surface); }
.twc-timeline__dot svg { width: 15px; height: 15px; }
.twc-timeline__item[data-tone="primary"] .twc-timeline__dot { background: var(--color-primary); border-color: var(--color-primary); color: var(--color-primary-fg); }
.twc-timeline__item[data-tone="info"] .twc-timeline__dot { background: var(--color-info); border-color: var(--color-info); color: var(--color-info-fg); }
.twc-timeline__item[data-tone="success"] .twc-timeline__dot { background: var(--color-success); border-color: var(--color-success); color: var(--color-success-fg); }
.twc-timeline__item[data-tone="danger"] .twc-timeline__dot { background: var(--color-danger); border-color: var(--color-danger); color: var(--color-danger-fg); }
.twc-timeline__item[data-tone="warning"] .twc-timeline__dot { background: var(--color-warning); border-color: var(--color-warning); color: var(--color-warning-fg); }
/* Extend the rail through the item's bottom padding (--space-6) and slightly into
   the next dot so the line actually connects the dots instead of stopping short. */
.twc-timeline__line { position: absolute; top: 32px; bottom: calc(-1 * var(--space-6) - 8px); left: 50%; width: 2px; transform: translateX(-50%); background: var(--color-border); border-radius: var(--radius-full); }
.twc-timeline__item:last-child .twc-timeline__line { display: none; }
.twc-timeline__body { flex: 1; min-width: 0; padding-top: 5px; }
.twc-timeline__head { display: flex; align-items: baseline; justify-content: space-between; gap: var(--space-3); }
.twc-timeline__title { font-size: var(--text-sm); font-weight: var(--font-bold); color: var(--color-text); }
.twc-timeline__time { font-size: var(--text-xs); color: var(--color-text-subtle); white-space: nowrap; }
.twc-timeline__desc { font-size: var(--text-sm); color: var(--color-text-muted); margin-top: 2px; line-height: var(--leading-snug); }
`;

export function Timeline({ items, className = "", ...rest }) {
  React.useInsertionEffect(() => {
    if (document.getElementById("twc-timeline-styles")) return;
    const el = document.createElement("style");
    el.id = "twc-timeline-styles";
    el.textContent = TIMELINE_CSS;
    document.head.appendChild(el);
  }, []);

  return (
    <ul className={`twc-timeline ${className}`} {...rest}>
      {items.map((it, i) => (
        <li className="twc-timeline__item" key={i} data-tone={it.tone || undefined}>
          <div className="twc-timeline__rail">
            <span className="twc-timeline__dot" aria-hidden="true">{it.icon || null}</span>
            <span className="twc-timeline__line" />
          </div>
          <div className="twc-timeline__body">
            <div className="twc-timeline__head">
              <span className="twc-timeline__title">{it.title}</span>
              {it.time ? <span className="twc-timeline__time">{it.time}</span> : null}
            </div>
            {it.description ? <div className="twc-timeline__desc">{it.description}</div> : null}
          </div>
        </li>
      ))}
    </ul>
  );
}
