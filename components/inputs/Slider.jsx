import React from "react";

const SLIDER_CSS = `
.twc-slider { font-family: var(--font-sans); }
/* tone → accent set (default primary). Mirrors Button's --_accent model; Badge's tone vocabulary. */
.twc-slider { --_accent: var(--color-primary); --_accent-fg: var(--color-primary-fg); --_accent-subtle: var(--color-primary-subtle); --_accent-subtle-fg: var(--color-primary-subtle-fg); --_accent-border: var(--color-primary-border); }
.twc-slider[data-tone="success"] { --_accent: var(--color-success); --_accent-fg: var(--color-success-fg); --_accent-subtle: var(--color-success-subtle); --_accent-subtle-fg: var(--color-success-subtle-fg); --_accent-border: var(--color-success); }
.twc-slider[data-tone="warning"] { --_accent: var(--color-warning); --_accent-fg: var(--color-warning-fg); --_accent-subtle: var(--color-warning-subtle); --_accent-subtle-fg: var(--color-warning-subtle-fg); --_accent-border: var(--color-warning); }
.twc-slider[data-tone="danger"]  { --_accent: var(--color-danger); --_accent-fg: var(--color-danger-fg); --_accent-subtle: var(--color-danger-subtle); --_accent-subtle-fg: var(--color-danger-subtle-fg); --_accent-border: var(--color-danger); }
.twc-slider[data-tone="info"]    { --_accent: var(--color-info); --_accent-fg: var(--color-info-fg); --_accent-subtle: var(--color-info-subtle); --_accent-subtle-fg: var(--color-info-subtle-fg); --_accent-border: var(--color-info); }
.twc-slider[data-tone="neutral"] { --_accent: var(--color-text); --_accent-fg: var(--color-surface); --_accent-subtle: var(--color-surface-sunken); --_accent-subtle-fg: var(--color-text-muted); --_accent-border: var(--color-border-strong); }
.twc-slider__msgs { display: flex; flex-direction: column; gap: var(--space-1-5); margin-top: var(--space-2); }
.twc-field__hint { font-size: var(--text-xs); color: var(--color-text-muted); }
.twc-field__error { font-size: var(--text-xs); color: var(--color-danger-subtle-fg); font-weight: var(--font-medium); }
.twc-slider__head { display: flex; align-items: baseline; justify-content: space-between; margin-bottom: var(--space-2); }
.twc-slider__label { font-size: var(--text-sm); font-weight: var(--font-semibold); color: var(--color-text); }
.twc-slider__value { font-size: var(--text-sm); font-weight: var(--font-semibold); color: var(--_accent); font-variant-numeric: tabular-nums; }
.twc-slider__track {
  position: relative; height: 22px; display: flex; align-items: center; cursor: pointer; touch-action: none;
}
.twc-slider[data-disabled="true"] { opacity: 0.55; }
.twc-slider[data-disabled="true"] .twc-slider__track { cursor: not-allowed; }
.twc-slider__rail { position: absolute; left: 0; right: 0; height: 6px; border-radius: var(--radius-full); background: var(--color-surface-sunken); box-shadow: inset 0 0 0 1px var(--color-border); }
.twc-slider__fill { position: absolute; height: 6px; border-radius: var(--radius-full); background: var(--_accent); }
.twc-slider__thumb {
  position: absolute; width: 18px; height: 18px; border-radius: var(--radius-full);
  background: var(--color-surface); border: var(--border-thick) solid var(--_accent);
  box-shadow: var(--shadow-sm); transform: translateX(-50%); top: 50%; margin-top: -9px;
  transition: box-shadow var(--duration-fast) var(--ease-standard), transform var(--duration-fast) var(--ease-spring);
}
.twc-slider__thumb:focus-visible { outline: none; box-shadow: var(--ring); }
.twc-slider__thumb:active { transform: translateX(-50%) scale(1.15); }
.twc-slider__ticks { position: absolute; left: 0; right: 0; top: 50%; }
.twc-slider__tick { position: absolute; width: 3px; height: 3px; border-radius: var(--radius-full); background: var(--color-border-strong); transform: translate(-50%, -50%); }
.twc-slider__bubble {
  position: absolute; bottom: calc(100% + 8px); transform: translateX(-50%) scale(0.9); transform-origin: bottom center;
  background: var(--color-text); color: var(--color-surface); font-size: var(--text-xs); font-weight: var(--font-semibold);
  padding: 3px 8px; border-radius: var(--radius-md); white-space: nowrap; opacity: 0; pointer-events: none;
  transition: opacity var(--duration-fast) var(--ease-standard), transform var(--duration-fast) var(--ease-spring);
}
.twc-slider__track[data-show-bubble="true"] .twc-slider__bubble { opacity: 1; transform: translateX(-50%) scale(1); }
`;

export function Slider({
  label,
  hint,
  error,
  value,
  defaultValue = 0,
  min: minProp = 0,
  max: maxProp = 100,
  step: stepProp = 1,
  tone = "primary",
  disabled = false,
  showValue = true,
  showTicks = false,
  formatValue,
  onChange,
  id,
  className = "",
  ...rest
}) {
  // Guard against invalid range/step props so the component never produces NaN/Infinity.
  const min = Number.isFinite(minProp) ? minProp : 0;
  const max = Number.isFinite(maxProp) && maxProp > min ? maxProp : min + 1;
  const step = Number.isFinite(stepProp) && stepProp > 0 ? stepProp : 1;
  React.useInsertionEffect(() => {
    if (document.getElementById("twc-slider-styles")) return;
    const el = document.createElement("style");
    el.id = "twc-slider-styles";
    el.textContent = SLIDER_CSS;
    document.head.appendChild(el);
  }, []);

  const autoId = React.useId();
  const fieldId = id || autoId;
  const [internal, setInternal] = React.useState(defaultValue);
  const val = value !== undefined ? value : internal;
  const trackRef = React.useRef(null);
  const [dragging, setDragging] = React.useState(false);

  const pct = ((val - min) / (max - min)) * 100;
  const fmt = (v) => (formatValue ? formatValue(v) : v);
  const clampSnap = (raw) => {
    const stepped = Math.round((raw - min) / step) * step + min;
    return Math.min(max, Math.max(min, Math.round(stepped * 1e6) / 1e6));
  };
  const setVal = (v) => { if (value === undefined) setInternal(v); onChange?.(v); };

  const fromClientX = (clientX) => {
    const node = trackRef.current;
    if (!node) return val; // ref gone (e.g. a stray event after unmount) — never crash
    const r = node.getBoundingClientRect();
    const ratio = Math.min(1, Math.max(0, (clientX - r.left) / r.width));
    return clampSnap(min + ratio * (max - min));
  };

  // Detach any in-flight drag listeners if the component unmounts mid-drag, so we
  // neither leak window listeners nor fire setState/getBoundingClientRect after unmount.
  const dragCleanupRef = React.useRef(null);
  React.useEffect(() => () => dragCleanupRef.current?.(), []);

  function onPointerDown(e) {
    if (disabled) return;
    e.preventDefault();
    setDragging(true);
    setVal(fromClientX(e.clientX));
    const move = (ev) => setVal(fromClientX(ev.clientX));
    const detach = () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
      dragCleanupRef.current = null;
    };
    const up = () => { setDragging(false); detach(); };
    dragCleanupRef.current = detach;
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
  }
  function onKeyDown(e) {
    if (disabled) return;
    let next = val;
    if (e.key === "ArrowRight" || e.key === "ArrowUp") next = clampSnap(val + step);
    else if (e.key === "ArrowLeft" || e.key === "ArrowDown") next = clampSnap(val - step);
    else if (e.key === "Home") next = min;
    else if (e.key === "End") next = max;
    else return;
    e.preventDefault();
    setVal(next);
  }

  const ticks = showTicks ? Math.floor((max - min) / step) + 1 : 0;
  const labelId = label ? `${fieldId}-label` : undefined;
  const descId = `${fieldId}-desc`;
  const invalid = Boolean(error);
  const display = fmt(val);
  // Human-readable value for assistive tech, only when a custom format is in play.
  const valueText = formatValue && (typeof display === "string" || typeof display === "number") ? String(display) : undefined;

  return (
    <div className={`twc-slider ${className}`} data-tone={tone} data-disabled={disabled || undefined} {...rest}>
      {(label || showValue) ? (
        <div className="twc-slider__head">
          {label ? <label className="twc-slider__label" id={labelId}>{label}</label> : <span />}
          {showValue ? <span className="twc-slider__value">{display}</span> : null}
        </div>
      ) : null}
      <div className="twc-slider__track" ref={trackRef} data-show-bubble={dragging || undefined} onPointerDown={onPointerDown}>
        <div className="twc-slider__rail" />
        <div className="twc-slider__fill" style={{ width: `${pct}%` }} />
        {showTicks ? (
          <div className="twc-slider__ticks">
            {Array.from({ length: ticks }).map((_, i) => (
              <span key={i} className="twc-slider__tick" style={{ left: `${ticks > 1 ? (i / (ticks - 1)) * 100 : 0}%` }} />
            ))}
          </div>
        ) : null}
        <div
          id={fieldId}
          className="twc-slider__thumb"
          style={{ left: `${pct}%` }}
          role="slider"
          tabIndex={disabled ? -1 : 0}
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={val}
          aria-valuetext={valueText}
          aria-labelledby={labelId}
          aria-label={labelId ? undefined : "Slider"}
          aria-describedby={error || hint ? descId : undefined}
          aria-invalid={invalid || undefined}
          aria-disabled={disabled || undefined}
          onKeyDown={onKeyDown}
        >
          <span className="twc-slider__bubble">{display}</span>
        </div>
      </div>
      {error || hint ? (
        <div className="twc-slider__msgs">
          {error ? <span id={descId} className="twc-field__error">{error}</span> : <span id={descId} className="twc-field__hint">{hint}</span>}
        </div>
      ) : null}
    </div>
  );
}
