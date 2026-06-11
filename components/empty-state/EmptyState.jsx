import React from "react";

const EMPTY_CSS = `
.twc-empty { display: flex; flex-direction: column; align-items: center; text-align: center; gap: var(--space-3);
  padding: var(--space-10) var(--space-6); font-family: var(--font-sans); }
.twc-empty__icon { display: inline-grid; place-items: center; width: 64px; height: 64px; border-radius: var(--radius-2xl);
  background: var(--color-surface-sunken); color: var(--color-text-subtle); margin-bottom: var(--space-1); }
.twc-empty__icon svg { width: 30px; height: 30px; }
.twc-empty__title { font-size: var(--text-lg); font-weight: var(--font-bold); color: var(--color-text); }
.twc-empty__desc { font-size: var(--text-sm); color: var(--color-text-muted); max-width: 380px; line-height: var(--leading-normal); }
.twc-empty__actions { display: flex; gap: var(--space-2); margin-top: var(--space-2); }
.twc-empty[data-bordered="true"] { border: var(--border-medium) dashed var(--color-border); border-radius: var(--radius-xl); }
`;

export function EmptyState({
  icon,
  title,
  description,
  actions,
  bordered = false,
  className = "",
  ...rest
}) {
  React.useInsertionEffect(() => {
    if (document.getElementById("twc-empty-styles")) return;
    const el = document.createElement("style");
    el.id = "twc-empty-styles";
    el.textContent = EMPTY_CSS;
    document.head.appendChild(el);
  }, []);

  return (
    <div className={`twc-empty ${className}`} data-bordered={bordered || undefined} {...rest}>
      {icon ? <span className="twc-empty__icon" aria-hidden="true">{icon}</span> : null}
      {title ? <div className="twc-empty__title">{title}</div> : null}
      {description ? <div className="twc-empty__desc">{description}</div> : null}
      {actions ? <div className="twc-empty__actions">{actions}</div> : null}
    </div>
  );
}
