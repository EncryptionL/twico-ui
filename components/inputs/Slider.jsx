import React from "react";
import { useScopedStyles } from "../_styles.js";

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
.twc-slider { --_track-h: 22px; --_thumb: 18px; --_rail: 6px; }
.twc-slider[data-size="sm"] { --_track-h: 18px; --_thumb: 14px; --_rail: 4px; }
.twc-slider[data-size="lg"] { --_track-h: 28px; --_thumb: 22px; --_rail: 8px; }
.twc-slider__head { display: flex; align-items: baseline; justify-content: space-between; margin-bottom: var(--space-2); }
.twc-slider__label { font-size: var(--text-sm); font-weight: var(--font-semibold); color: var(--color-text); }
.twc-slider__value { font-size: var(--text-sm); font-weight: var(--font-semibold); color: var(--_accent); font-variant-numeric: tabular-nums; }
.twc-slider__track {
  position: relative; height: var(--_track-h); display: flex; align-items: center; cursor: pointer; touch-action: none;
}
.twc-slider[data-disabled="true"] { opacity: 0.55; }
.twc-slider[data-disabled="true"] .twc-slider__track { cursor: not-allowed; }
.twc-slider__rail { position: absolute; left: 0; right: 0; height: var(--_rail); border-radius: var(--radius-full); background: var(--color-surface-sunken); box-shadow: inset 0 0 0 1px var(--color-border); }
.twc-slider__fill { position: absolute; height: var(--_rail); border-radius: var(--radius-full); background: var(--_accent); }
.twc-slider__thumb {
  position: absolute; width: var(--_thumb); height: var(--_thumb); border-radius: var(--radius-full);
  background: var(--color-surface); border: var(--border-thick) solid var(--_accent);
  box-shadow: var(--shadow-sm); transform: translateX(-50%); top: 50%; margin-top: calc(var(--_thumb) / -2);
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
  pageStep: pageStepProp,
  precision,
  tone = "primary",
  disabled = false,
  size = "md",
  range = false,
  showValue = true,
  showTicks = false,
  formatValue,
  getAriaValueText,
  name,
  onChange,
  id,
  className = "",
  ...rest
}) {
  // Guard against invalid range/step props so the component never produces NaN/Infinity.
  const min = Number.isFinite(minProp) ? minProp : 0;
  const max = Number.isFinite(maxProp) && maxProp > min ? maxProp : min + 1;
  const step = Number.isFinite(stepProp) && stepProp > 0 ? stepProp : 1;
  const pageStep = Number.isFinite(pageStepProp) && pageStepProp > 0 ? pageStepProp : Math.max(step, (max - min) / 10);
  // #84: decimals for the default display + aria value, derived from step unless overridden.
  const stepDecimals = (() => { const s = String(step); const i = s.indexOf("."); return i === -1 ? 0 : s.length - i - 1; })();
  const decimals = Number.isInteger(precision) && precision >= 0 ? precision : stepDecimals;
  const clampSnap = (raw) => {
    const stepped = Math.round((raw - min) / step) * step + min;
    return Math.min(max, Math.max(min, Math.round(stepped * 1e6) / 1e6));
  };
  const __twcStyles = useScopedStyles("twc-slider-styles", SLIDER_CSS);

  const autoId = React.useId();
  const fieldId = id || autoId;
  // #86: range mode is opt-in via `range` or a tuple value/defaultValue.
  const isRange = range || Array.isArray(value) || Array.isArray(defaultValue);
  const [internal, setInternal] = React.useState(() => {
    if (isRange) {
      const dv = Array.isArray(defaultValue) ? defaultValue : [min, max];
      return [clampSnap(dv[0]), clampSnap(dv[1])];
    }
    return clampSnap(Number.isFinite(defaultValue) ? defaultValue : min);
  });
  const rawVal = value !== undefined ? value : internal;
  // #75: clamp the rendered value(s) into [min, max] so the thumb/aria never go off-track.
  const clampedVals = (isRange ? [Number(rawVal[0]), Number(rawVal[1])] : [Number(rawVal)])
    .map((v) => Math.min(max, Math.max(min, Number.isFinite(v) ? v : min)));
  const indices = isRange ? [0, 1] : [0];
  const trackRef = React.useRef(null);
  const [dragging, setDragging] = React.useState(false);

  const fmt = (v) => (formatValue ? formatValue(v) : v.toFixed(decimals));
  // #81/#84: prefer getAriaValueText; else a string/number formatValue; else the decimal string.
  const valueTextFor = (v) => {
    if (getAriaValueText) return getAriaValueText(v);
    if (formatValue) { const d = formatValue(v); return typeof d === "string" || typeof d === "number" ? String(d) : undefined; }
    return decimals > 0 ? v.toFixed(decimals) : undefined;
  };

  const commit = (nextVals) => {
    const out = isRange ? nextVals : nextVals[0];
    if (value === undefined) setInternal(out);
    onChange?.(out);
  };
  // Update one thumb, cross-clamping so lo <= hi in range mode.
  const setThumb = (i, raw) => {
    const next = clampedVals.slice();
    next[i] = clampSnap(raw);
    if (isRange) {
      if (i === 0) next[0] = Math.min(next[0], next[1]);
      else next[1] = Math.max(next[1], next[0]);
    }
    commit(next);
  };

  const fromClientX = (clientX) => {
    const node = trackRef.current;
    if (!node) return clampedVals[0];
    const r = node.getBoundingClientRect();
    const ratio = Math.min(1, Math.max(0, (clientX - r.left) / r.width));
    return clampSnap(min + ratio * (max - min));
  };

  const dragCleanupRef = React.useRef(null);
  React.useEffect(() => () => dragCleanupRef.current?.(), []);

  function onPointerDown(e) {
    if (disabled) return;
    e.preventDefault();
    const posVal = fromClientX(e.clientX);
    // In range mode, drag the thumb nearest the press point for its whole lifetime.
    const idx = isRange ? (Math.abs(posVal - clampedVals[0]) <= Math.abs(posVal - clampedVals[1]) ? 0 : 1) : 0;
    setDragging(true);
    setThumb(idx, posVal);
    const move = (ev) => setThumb(idx, fromClientX(ev.clientX));
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

  function onThumbKeyDown(e, i) {
    if (disabled) return;
    const cur = clampedVals[i];
    let next;
    if (e.key === "ArrowRight" || e.key === "ArrowUp") next = cur + step;
    else if (e.key === "ArrowLeft" || e.key === "ArrowDown") next = cur - step;
    else if (e.key === "PageUp") next = cur + pageStep;      // #80
    else if (e.key === "PageDown") next = cur - pageStep;    // #80
    else if (e.key === "Home") next = min;
    else if (e.key === "End") next = max;
    else return;
    e.preventDefault();
    setThumb(i, next);
  }

  const ticks = showTicks ? Math.floor((max - min) / step) + 1 : 0;
  const labelId = label ? `${fieldId}-label` : undefined;
  const descId = `${fieldId}-desc`;
  const invalid = Boolean(error);
  const headValue = isRange ? `${fmt(clampedVals[0])} – ${fmt(clampedVals[1])}` : fmt(clampedVals[0]);
  const fillLo = ((Math.min(...clampedVals) - min) / (max - min)) * 100;
  const fillHi = ((Math.max(...clampedVals) - min) / (max - min)) * 100;
  const fillStyle = isRange ? { left: `${fillLo}%`, width: `${fillHi - fillLo}%` } : { width: `${fillHi}%` };

  return (
    <div className={`twc-slider ${className}`} data-tone={tone} data-size={size} data-disabled={disabled || undefined} {...rest}>
      {__twcStyles}
      {/* #82: hidden input(s) so the value participates in native form submission. */}
      {name ? clampedVals.map((v, i) => (
        <input key={i} type="hidden" name={name} value={v} disabled={disabled || undefined} />
      )) : null}
      {(label || showValue) ? (
        <div className="twc-slider__head">
          {label ? <label className="twc-slider__label" id={labelId}>{label}</label> : <span />}
          {showValue ? <span className="twc-slider__value">{headValue}</span> : null}
        </div>
      ) : null}
      <div className="twc-slider__track" ref={trackRef} data-show-bubble={dragging || undefined} onPointerDown={onPointerDown}>
        <div className="twc-slider__rail" />
        <div className="twc-slider__fill" style={fillStyle} />
        {showTicks ? (
          <div className="twc-slider__ticks">
            {Array.from({ length: ticks }).map((_, i) => (
              <span key={i} className="twc-slider__tick" style={{ left: `${ticks > 1 ? (i / (ticks - 1)) * 100 : 0}%` }} />
            ))}
          </div>
        ) : null}
        {indices.map((i) => {
          const tv = clampedVals[i];
          const p = ((tv - min) / (max - min)) * 100;
          const tMin = isRange && i === 1 ? clampedVals[0] : min;
          const tMax = isRange && i === 0 ? clampedVals[1] : max;
          const thumbLabel = isRange ? (i === 0 ? "Minimum" : "Maximum") : (labelId ? undefined : "Slider");
          return (
            <div
              key={i}
              id={i === 0 ? fieldId : undefined}
              className="twc-slider__thumb"
              style={{ left: `${p}%` }}
              role="slider"
              tabIndex={disabled ? -1 : 0}
              aria-valuemin={tMin}
              aria-valuemax={tMax}
              aria-valuenow={tv}
              aria-valuetext={valueTextFor(tv)}
              aria-labelledby={isRange ? undefined : labelId}
              aria-label={thumbLabel}
              aria-describedby={error || hint ? descId : undefined}
              aria-invalid={invalid || undefined}
              aria-disabled={disabled || undefined}
              onKeyDown={(e) => onThumbKeyDown(e, i)}
            >
              <span className="twc-slider__bubble">{fmt(tv)}</span>
            </div>
          );
        })}
      </div>
      {error || hint ? (
        <div className="twc-slider__msgs">
          {error ? <span id={descId} className="twc-field__error">{error}</span> : <span id={descId} className="twc-field__hint">{hint}</span>}
        </div>
      ) : null}
    </div>
  );
}
