import React from "react";

const RATING_CSS = `
.twc-rating { display: inline-flex; align-items: center; gap: 8px; font-family: var(--font-sans); }
.twc-rating__stars { display: inline-flex; gap: 2px; }
.twc-rating__btn { border: none; background: transparent; padding: 1px; cursor: pointer; color: var(--color-border-strong); line-height: 0;
  transition: transform var(--duration-fast) var(--ease-spring), color var(--duration-fast) var(--ease-standard); }
.twc-rating__btn:focus-visible { outline: none; box-shadow: var(--ring); border-radius: var(--radius-sm); }
.twc-rating[data-readonly="true"] .twc-rating__btn { cursor: default; }
.twc-rating:not([data-readonly="true"]) .twc-rating__btn:hover { transform: scale(1.18); }
.twc-rating__btn[data-on="true"] { color: var(--_c, var(--color-warning)); }
.twc-rating__btn svg { width: var(--_sz, 24px); height: var(--_sz, 24px); display: block; }
.twc-rating[data-size="sm"] { --_sz: 18px; }
.twc-rating[data-size="lg"] { --_sz: 32px; }
.twc-rating__value { font-size: var(--text-sm); font-weight: var(--font-semibold); color: var(--color-text-muted); font-variant-numeric: tabular-nums; }
`;

const StarPath = "M12 2l2.9 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14l-5-4.87 7.1-1.01L12 2z";

export function Rating({
  value,
  defaultValue = 0,
  count = 5,
  size = "md",
  color,
  readOnly = false,
  showValue = false,
  onChange,
  className = "",
  ...rest
}) {
  React.useEffect(() => {
    if (document.getElementById("twc-rating-styles")) return;
    const el = document.createElement("style");
    el.id = "twc-rating-styles";
    el.textContent = RATING_CSS;
    document.head.appendChild(el);
  }, []);

  const [internal, setInternal] = React.useState(defaultValue);
  const [hover, setHover] = React.useState(0);
  const val = value !== undefined ? value : internal;
  const shown = hover || val;

  const set = (v) => { if (readOnly) return; if (value === undefined) setInternal(v); onChange?.(v); };

  return (
    <div className={`twc-rating ${className}`} data-size={size} data-readonly={readOnly || undefined}
      style={color ? { "--_c": color } : undefined} role="radiogroup" aria-label="Rating" {...rest}>
      <span className="twc-rating__stars" onMouseLeave={() => setHover(0)}>
        {Array.from({ length: count }).map((_, i) => {
          const n = i + 1;
          return (
            <button key={n} type="button" className="twc-rating__btn" data-on={n <= shown || undefined}
              aria-label={`${n} star${n > 1 ? "s" : ""}`} aria-pressed={n <= val}
              disabled={readOnly} tabIndex={readOnly ? -1 : 0}
              onMouseEnter={() => !readOnly && setHover(n)} onClick={() => set(n === val ? 0 : n)}>
              <svg viewBox="0 0 24 24" fill="currentColor"><path d={StarPath} /></svg>
            </button>
          );
        })}
      </span>
      {showValue ? <span className="twc-rating__value">{val.toFixed(1)}</span> : null}
    </div>
  );
}
