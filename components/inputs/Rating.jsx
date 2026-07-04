import React from "react";
import { useScopedStyles } from "../_styles.js";
import { warnOnce } from "../_warn.js";

const RATING_CSS = `
.twc-rating { display: inline-flex; align-items: center; gap: 8px; font-family: var(--font-sans); }
.twc-rating__stars { display: inline-flex; gap: 2px; }
.twc-rating__btn { border: none; background: transparent; padding: 1px; cursor: pointer; line-height: 0;
  transition: transform var(--duration-fast) var(--ease-spring); }
.twc-rating__btn:focus-visible { outline: none; box-shadow: var(--ring); border-radius: var(--radius-sm); }
.twc-rating[data-readonly="true"] .twc-rating__btn { cursor: default; }
.twc-rating[data-disabled="true"] { opacity: 0.55; }
.twc-rating[data-disabled="true"] .twc-rating__btn { cursor: not-allowed; }
.twc-rating:not([data-readonly="true"]):not([data-disabled="true"]) .twc-rating__btn:hover { transform: scale(1.18); }
/* tone -> star color (default warning = gold). An explicit color prop (--_c) still wins. */
.twc-rating { --_accent: var(--color-warning); }
.twc-rating[data-tone="primary"] { --_accent: var(--color-primary); }
.twc-rating[data-tone="success"] { --_accent: var(--color-success); }
.twc-rating[data-tone="warning"] { --_accent: var(--color-warning); }
.twc-rating[data-tone="danger"]  { --_accent: var(--color-danger); }
.twc-rating[data-tone="info"]    { --_accent: var(--color-info); }
.twc-rating[data-tone="neutral"] { --_accent: var(--color-text); }
/* Per-star partial fill: an accent-colored star clipped to var(--twc-fill) over an empty star. */
.twc-rating__star { position: relative; display: inline-block; line-height: 0; }
.twc-rating__bg { color: var(--color-border-strong); }
.twc-rating__fg { position: absolute; inset-block: 0; inset-inline-start: 0; width: var(--twc-fill, 0%); overflow: hidden; color: var(--_c, var(--_accent)); }
.twc-rating svg { width: var(--_sz, 24px); height: var(--_sz, 24px); display: block; }
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
  tone = "warning",
  color,
  readOnly = false,
  disabled = false,
  showValue = false,
  clearable = true,
  format,
  name,
  onChange,
  className = "",
  style,
  ...rest
}) {
  const __twcStyles = useScopedStyles("twc-rating-styles", RATING_CSS);

  const [internal, setInternal] = React.useState(defaultValue);
  const [hover, setHover] = React.useState(0);
  const val = value !== undefined ? value : internal;
  const shown = hover || val;
  const interactive = !readOnly && !disabled;
  const btnRefs = React.useRef([]);
  const tabStar = Math.min(count, Math.max(1, Math.round(val) || 1));

  // #87: clean integer, one-decimal for fractional, or a consumer formatter.
  const fmt = (v) => (format ? format(v) : Number.isInteger(v) ? String(v) : v.toFixed(1));

  // #79: interactive click/keyboard selection is integer-only; a fractional value belongs in readOnly.
  if (process.env.NODE_ENV !== "production" && interactive && !Number.isInteger(val)) {
    warnOnce("Rating.fractional-interactive", "Rating: a fractional value only renders (partial-fill display) in readOnly mode — interactive selection is integer-only.");
  }

  const set = (v) => { if (!interactive) return; if (value === undefined) setInternal(v); onChange?.(v); };

  const onKeyDown = (e) => {
    if (!interactive) return;
    let next;
    if (e.key === "ArrowRight" || e.key === "ArrowUp") next = Math.min(count, val + 1);
    else if (e.key === "ArrowLeft" || e.key === "ArrowDown") next = Math.max(1, val - 1);
    else if (e.key === "Home") next = 1;
    else if (e.key === "End") next = count;
    else if (clearable && (e.key === "Delete" || e.key === "Backspace")) next = 0;
    else return;
    e.preventDefault();
    set(next);
    btnRefs.current[Math.max(0, next - 1)]?.focus();
  };

  // Shared star glyph with a clipped partial-fill overlay (fill 0..1).
  const star = (n) => {
    const fill = Math.max(0, Math.min(1, shown - (n - 1)));
    return (
      <span className="twc-rating__star" style={{ "--twc-fill": `${fill * 100}%` }}>
        <svg className="twc-rating__bg" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d={StarPath} /></svg>
        <span className="twc-rating__fg" aria-hidden="true"><svg viewBox="0 0 24 24" fill="currentColor"><path d={StarPath} /></svg></span>
      </span>
    );
  };

  // #78: read-only exposes a single static value via role="img", not a radiogroup of radios.
  if (readOnly) {
    return (
      <div
        className={`twc-rating ${className}`}
        data-size={size}
        data-tone={tone}
        data-readonly="true"
        style={color ? { "--_c": color, ...style } : style}
        role="img"
        aria-label={`${fmt(val)} out of ${count} stars`}
        {...rest}
      >
        {__twcStyles}
        {name ? <input type="hidden" name={name} value={val} disabled={disabled || undefined} /> : null}
        <span className="twc-rating__stars">
          {Array.from({ length: count }).map((_, i) => (
            <span key={i + 1} className="twc-rating__btn">{star(i + 1)}</span>
          ))}
        </span>
        {showValue ? <span className="twc-rating__value">{fmt(val)}</span> : null}
      </div>
    );
  }

  // Interactive (or disabled) radiogroup.
  return (
    <div className={`twc-rating ${className}`} data-size={size} data-tone={tone} data-disabled={disabled || undefined}
      style={color ? { "--_c": color, ...style } : style} role="radiogroup" aria-label="Rating" aria-disabled={disabled || undefined} {...rest}>
      {__twcStyles}
      {name ? <input type="hidden" name={name} value={val} disabled={disabled || undefined} /> : null}
      <span className="twc-rating__stars" onMouseLeave={() => setHover(0)} onKeyDown={onKeyDown}>
        {Array.from({ length: count }).map((_, i) => {
          const n = i + 1;
          return (
            <button key={n} ref={(el) => { btnRefs.current[i] = el; }} type="button" className="twc-rating__btn"
              role="radio" aria-label={`${n} star${n > 1 ? "s" : ""}`} aria-checked={n === val}
              disabled={disabled} tabIndex={interactive && n === tabStar ? 0 : -1}
              onMouseEnter={() => interactive && setHover(n)} onClick={() => set(n === val && clearable ? 0 : n)}>
              {star(n)}
            </button>
          );
        })}
      </span>
      {showValue ? <span className="twc-rating__value">{fmt(val)}</span> : null}
    </div>
  );
}
