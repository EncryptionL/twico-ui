import React from "react";

const STAT_CSS = `
.twc-stat { display: flex; flex-direction: column; gap: 6px; font-family: var(--font-sans);
  background: var(--color-surface); border: var(--border-thin) solid var(--color-border);
  border-radius: var(--radius-lg); padding: var(--space-5); }
.twc-stat[data-plain="true"] { background: transparent; border: none; padding: 0; }
.twc-stat__top { display: flex; align-items: center; justify-content: space-between; gap: var(--space-3); }
.twc-stat__label { font-size: var(--text-sm); font-weight: var(--font-semibold); color: var(--color-text-muted); }
.twc-stat__icon { flex: none; display: inline-grid; place-items: center; width: 38px; height: 38px; border-radius: var(--radius-md);
  background: var(--color-primary-subtle); color: var(--color-primary-subtle-fg); }
.twc-stat__icon svg { width: 20px; height: 20px; }
.twc-stat__value { font-size: var(--text-3xl); font-weight: var(--font-extrabold); letter-spacing: -0.02em; color: var(--color-text); line-height: 1.1; }
.twc-stat__foot { display: flex; align-items: center; gap: 8px; font-size: var(--text-sm); }
.twc-stat__delta { display: inline-flex; align-items: center; gap: 3px; font-weight: var(--font-bold); padding: 2px 7px; border-radius: var(--radius-full); }
.twc-stat__delta svg { width: 14px; height: 14px; }
.twc-stat__delta[data-dir="up"] { color: var(--color-success-subtle-fg); background: var(--color-success-subtle); }
.twc-stat__delta[data-dir="down"] { color: var(--color-danger-subtle-fg); background: var(--color-danger-subtle); }
.twc-stat__delta[data-dir="flat"] { color: var(--color-text-muted); background: var(--color-surface-sunken); }
.twc-stat__help { color: var(--color-text-subtle); }
`;

const Arrow = ({ dir }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
    {dir === "up" ? <path d="M7 17 17 7M9 7h8v8" /> : dir === "down" ? <path d="M7 7l10 10M17 9v8H9" /> : <path d="M5 12h14" />}
  </svg>
);

export function Stat({
  label,
  value,
  icon,
  delta,
  deltaDirection,
  helpText,
  plain = false,
  className = "",
  ...rest
}) {
  React.useEffect(() => {
    if (document.getElementById("twc-stat-styles")) return;
    const el = document.createElement("style");
    el.id = "twc-stat-styles";
    el.textContent = STAT_CSS;
    document.head.appendChild(el);
  }, []);

  const dir = deltaDirection || (typeof delta === "string" && delta.trim().startsWith("-") ? "down" : delta != null ? "up" : undefined);

  return (
    <div className={`twc-stat ${className}`} data-plain={plain || undefined} {...rest}>
      <div className="twc-stat__top">
        <span className="twc-stat__label">{label}</span>
        {icon ? <span className="twc-stat__icon" aria-hidden="true">{icon}</span> : null}
      </div>
      <div className="twc-stat__value">{value}</div>
      {(delta != null || helpText) ? (
        <div className="twc-stat__foot">
          {delta != null ? <span className="twc-stat__delta" data-dir={dir}><Arrow dir={dir} />{delta}</span> : null}
          {helpText ? <span className="twc-stat__help">{helpText}</span> : null}
        </div>
      ) : null}
    </div>
  );
}
