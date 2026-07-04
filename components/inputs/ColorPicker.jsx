import React from "react";
import { useScopedStyles } from "../_styles.js";
import { useFocusTrap } from "../_overlay.js";
import { createPortal } from "react-dom";

const FIELD_CSS = `
.twc-field { display: flex; flex-direction: column; gap: var(--space-1-5); font-family: var(--font-sans); }
.twc-field__label { font-size: var(--text-sm); font-weight: var(--font-semibold); color: var(--color-text); display: flex; gap: 4px; align-items: center; }
.twc-field__req { color: var(--color-danger); }
.twc-field__hint { font-size: var(--text-xs); color: var(--color-text-muted); }
.twc-field__error { font-size: var(--text-xs); color: var(--color-danger-subtle-fg); font-weight: var(--font-medium); }
`;

const COLORPICKER_CSS = `
.twc-cp { position: relative; font-family: var(--font-sans); display: flex; flex-direction: column; gap: var(--space-1-5); }
.twc-cp__label { font-size: var(--text-sm); font-weight: var(--font-semibold); color: var(--color-text); }
.twc-cp__trigger { display: flex; align-items: center; gap: var(--space-2-5); height: var(--control-h-md); padding: 0 var(--space-2) 0 var(--space-2);
  background: var(--color-surface); border: var(--border-thin) solid var(--color-border); border-radius: var(--radius-md); cursor: pointer;
  transition: border-color var(--duration-fast) var(--ease-standard), box-shadow var(--duration-fast) var(--ease-standard); }
.twc-cp__trigger:hover:not([data-open="true"]):not([data-disabled="true"]) { border-color: var(--color-border-strong); }
.twc-cp__trigger[data-open="true"] { border-color: var(--color-primary); box-shadow: var(--ring); }
.twc-cp__trigger[data-invalid="true"] { border-color: var(--color-danger); }
.twc-cp__trigger[data-invalid="true"][data-open="true"] { box-shadow: 0 0 0 var(--ring-width) color-mix(in srgb, var(--color-danger) 28%, transparent); }
.twc-cp__trigger[data-disabled="true"] { background: var(--color-surface-sunken); opacity: 0.7; cursor: not-allowed; }
.twc-cp__swatch { flex: none; width: 26px; height: 26px; border-radius: var(--radius-sm); box-shadow: inset 0 0 0 1px rgb(0 0 0 / 0.12); }
.twc-cp__value { flex: 1; font-family: var(--font-mono); font-size: var(--text-sm); color: var(--color-text); text-transform: uppercase; }
.twc-cp__chev { flex: none; color: var(--color-text-subtle); display: inline-flex; }
.twc-cp__chev svg { width: 16px; height: 16px; }
.twc-cp__pop { position: fixed; z-index: var(--z-popover); width: 240px;
  background: var(--color-surface-raised); border: var(--border-thin) solid var(--color-border); border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg); padding: var(--space-3); animation: twico-scale-in var(--duration-fast) var(--ease-spring); transform-origin: top; }
.twc-cp__area { position: relative; width: 100%; height: 140px; border-radius: var(--radius-md); cursor: crosshair; overflow: hidden; touch-action: none; }
.twc-cp__area:focus-visible, .twc-cp__hue:focus-visible { outline: none; box-shadow: var(--ring); }
.twc-cp__area-sat { position: absolute; inset: 0; background: linear-gradient(to right, #fff, hsl(var(--_h,0), 100%, 50%)); }
.twc-cp__area-val { position: absolute; inset: 0; background: linear-gradient(to top, #000, transparent); }
.twc-cp__area-knob { position: absolute; width: 14px; height: 14px; border-radius: var(--radius-full); border: 2px solid #fff; box-shadow: 0 0 0 1px rgb(0 0 0 / 0.3); transform: translate(-50%, -50%); pointer-events: none; }
.twc-cp__hue { position: relative; height: 12px; margin-top: var(--space-3); border-radius: var(--radius-full); cursor: pointer; touch-action: none;
  background: linear-gradient(to right, #f00 0%, #ff0 17%, #0f0 33%, #0ff 50%, #00f 67%, #f0f 83%, #f00 100%); }
.twc-cp__hue-knob { position: absolute; top: 50%; width: 16px; height: 16px; border-radius: var(--radius-full); background: #fff; box-shadow: var(--shadow-sm), inset 0 0 0 1px rgb(0 0 0 / 0.2); transform: translate(-50%, -50%); pointer-events: none; }
.twc-cp__alpha { position: relative; height: 12px; margin-top: var(--space-2); border-radius: var(--radius-full); cursor: pointer; touch-action: none;
  background-image: linear-gradient(to right, transparent, var(--_solid, #000)), conic-gradient(#c8c8c8 0 25%, #fff 0 50%, #c8c8c8 0 75%, #fff 0);
  background-size: 100% 100%, 10px 10px; }
.twc-cp__alpha:focus-visible { outline: none; box-shadow: var(--ring); }
.twc-cp__foot { display: flex; align-items: center; gap: var(--space-2); margin-top: var(--space-3); }
.twc-cp__hex { flex: 1; min-width: 0; height: 32px; padding: 0 8px; font-family: var(--font-mono); font-size: var(--text-xs); text-transform: uppercase;
  color: var(--color-text); background: var(--color-surface); border: var(--border-thin) solid var(--color-border); border-radius: var(--radius-sm); outline: none; }
/* tone → focus/open accent (default primary; reproduces current look). */
.twc-cp__hex { --_accent: var(--color-primary); --_ring: var(--ring); }
.twc-cp__hex[data-tone="success"] { --_accent: var(--color-success); --_ring: 0 0 0 var(--ring-width) color-mix(in srgb, var(--color-success) 32%, transparent); }
.twc-cp__hex[data-tone="warning"] { --_accent: var(--color-warning); --_ring: 0 0 0 var(--ring-width) color-mix(in srgb, var(--color-warning) 32%, transparent); }
.twc-cp__hex[data-tone="danger"]  { --_accent: var(--color-danger);  --_ring: 0 0 0 var(--ring-width) color-mix(in srgb, var(--color-danger) 32%, transparent); }
.twc-cp__hex[data-tone="info"]    { --_accent: var(--color-info);    --_ring: 0 0 0 var(--ring-width) color-mix(in srgb, var(--color-info) 32%, transparent); }
.twc-cp__hex[data-tone="neutral"] { --_accent: var(--color-border-strong); --_ring: 0 0 0 var(--ring-width) color-mix(in srgb, var(--color-text) 14%, transparent); }
.twc-cp__hex:focus { border-color: var(--_accent); box-shadow: var(--_ring); }
.twc-cp__hex[data-invalid="true"] { border-color: var(--color-danger); }
.twc-cp__presets { display: flex; flex-wrap: wrap; gap: 5px; margin-top: var(--space-3); }
.twc-cp__preset { width: 22px; height: 22px; border-radius: var(--radius-sm); border: none; cursor: pointer; box-shadow: inset 0 0 0 1px rgb(0 0 0 / 0.12); padding: 0;
  transition: transform var(--duration-fast) var(--ease-spring); }
.twc-cp__preset:hover { transform: scale(1.15); }
.twc-cp__preset[data-active="true"] { box-shadow: 0 0 0 2px var(--color-surface-raised), 0 0 0 4px var(--color-primary); }
`;

/* ---- color math ---- */
function hsvToRgb(h, s, v) {
  s /= 100; v /= 100;
  const c = v * s, x = c * (1 - Math.abs(((h / 60) % 2) - 1)), m = v - c;
  let r = 0, g = 0, b = 0;
  if (h < 60) [r, g, b] = [c, x, 0]; else if (h < 120) [r, g, b] = [x, c, 0];
  else if (h < 180) [r, g, b] = [0, c, x]; else if (h < 240) [r, g, b] = [0, x, c];
  else if (h < 300) [r, g, b] = [x, 0, c]; else [r, g, b] = [c, 0, x];
  return [Math.round((r + m) * 255), Math.round((g + m) * 255), Math.round((b + m) * 255)];
}
function rgbToHex(r, g, b) { return "#" + [r, g, b].map((n) => n.toString(16).padStart(2, "0")).join(""); }
function hsvToHex(h, s, v) { return rgbToHex(...hsvToRgb(h, s, v)); }
// #106: 8-digit #RRGGBBAA from HSV + alpha (0..1).
function hsvaToHex8(h, s, v, a) {
  return rgbToHex(...hsvToRgb(h, s, v)) + Math.round(Math.min(1, Math.max(0, a)) * 255).toString(16).padStart(2, "0");
}
// #106: accept #RGB (expanded), #RRGGBB, and #RRGGBBAA — returns { h, s, v, a }.
function hexToHsv(hex) {
  let str = String(hex || "").replace(/^#/, "");
  if (/^[0-9a-f]{3}$/i.test(str)) str = str.split("").map((c) => c + c).join(""); // #RGB → #RRGGBB
  const m = /^([0-9a-f]{6})([0-9a-f]{2})?$/i.exec(str); if (!m) return null;
  const int = parseInt(m[1], 16); const r = (int >> 16) / 255, g = ((int >> 8) & 255) / 255, b = (int & 255) / 255;
  const a = m[2] != null ? parseInt(m[2], 16) / 255 : 1;
  const max = Math.max(r, g, b), min = Math.min(r, g, b), d = max - min;
  let h = 0;
  if (d) { if (max === r) h = ((g - b) / d) % 6; else if (max === g) h = (b - r) / d + 2; else h = (r - g) / d + 4; h *= 60; if (h < 0) h += 360; }
  return { h, s: max ? (d / max) * 100 : 0, v: max * 100, a };
}

const DEFAULT_PRESETS = ["#6366F1","#0EA5E9","#14B8A6","#22C55E","#F59E0B","#F43F5E","#8B5CF6","#0F172A"];

export function ColorPicker({
  label,
  hint,
  error,
  required = false,
  value,
  defaultValue = "#6366F1",
  presets = DEFAULT_PRESETS,
  disabled = false,
  alpha = false,
  tone = "primary",
  onChange,
  className = "",
  ...rest
}) {
  const __twcStyles0 = useScopedStyles("twc-field-styles", FIELD_CSS);
  const __twcStyles1 = useScopedStyles("twc-colorpicker-styles", COLORPICKER_CSS);

  const [internal, setInternal] = React.useState(defaultValue);
  const hex = (value !== undefined ? value : internal) || "#000000";
  // #106/#107: accept #RGB and #RRGGBB always, plus #RRGGBBAA when alpha is on.
  const hexRe = alpha ? /^#([0-9a-f]{3}|[0-9a-f]{6}|[0-9a-f]{8})$/i : /^#([0-9a-f]{3}|[0-9a-f]{6})$/i;
  // Track the last syntactically valid hex so an invalid entry can be reverted on blur.
  const lastValidRef = React.useRef(hex);
  if (hexRe.test(hex)) lastValidRef.current = hex;
  const [open, setOpen] = React.useState(false);
  const [hsv, setHsv] = React.useState(() => hexToHsv(hex) || { h: 239, s: 60, v: 94, a: 1 });
  const [coords, setCoords] = React.useState(null);
  const wrapRef = React.useRef(null);
  const triggerRef = React.useRef(null);
  const popRef = React.useRef(null);
  const areaRef = React.useRef(null);
  const hueRef = React.useRef(null);
  const alphaRef = React.useRef(null);

  // Pin the popover with fixed positioning, portaled to <body>, so it escapes any
  // clipping/scrolling ancestor (cards, panels, dialogs). Flips up when low on room.
  const POP_W = 240;
  const place = React.useCallback(() => {
    const el = triggerRef.current; if (!el) return;
    const r = el.getBoundingClientRect();
    const vh = window.innerHeight;
    const below = vh - r.bottom;
    const flip = below < 340 && r.top > below;
    let left = Math.min(r.left, window.innerWidth - POP_W - 8);
    left = Math.max(8, left);
    setCoords({ left, top: flip ? undefined : Math.round(r.bottom + 6), bottom: flip ? Math.round(vh - r.top + 6) : undefined });
  }, []);
  React.useEffect(() => {
    if (!open) return undefined;
    place();
    const onMove = () => place();
    window.addEventListener("scroll", onMove, true);
    window.addEventListener("resize", onMove);
    return () => { window.removeEventListener("scroll", onMove, true); window.removeEventListener("resize", onMove); };
  }, [open, place]);
  const labelId = React.useId();
  const descId = `${labelId}-desc`;
  const invalid = Boolean(error);

  // close the popover if the picker becomes disabled while open
  React.useEffect(() => { if (disabled) setOpen(false); }, [disabled]);

  // sync external hex -> hsv when it changes and is valid
  React.useEffect(() => { const v = hexToHsv(hex); if (v && hsvToHex(v.h, v.s, v.v).toLowerCase() !== hsvToHex(hsv.h, hsv.s, hsv.v).toLowerCase()) setHsv(v); }, [hex]);

  React.useEffect(() => {
    if (!open) return;
    const onDown = (e) => {
      if (wrapRef.current && wrapRef.current.contains(e.target)) return;
      if (popRef.current && popRef.current.contains(e.target)) return;
      setOpen(false);
    };
    const onKey = (e) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("mousedown", onDown); document.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("mousedown", onDown); document.removeEventListener("keydown", onKey); };
  }, [open]);

  // #108: trap Tab within the popover, land focus on the saturation/value area, and
  // restore focus to the trigger on close (it portals to <body>).
  useFocusTrap(popRef, open && !!coords, { initialFocus: areaRef });

  const commit = (next) => {
    const out = alpha ? hsvaToHex8(next.h, next.s, next.v, next.a ?? 1) : hsvToHex(next.h, next.s, next.v);
    setHsv(next); if (value === undefined) setInternal(out); onChange?.(out);
  };

  const dragArea = (e) => {
    const r = areaRef.current.getBoundingClientRect();
    const s = Math.min(1, Math.max(0, (e.clientX - r.left) / r.width)) * 100;
    const v = (1 - Math.min(1, Math.max(0, (e.clientY - r.top) / r.height))) * 100;
    commit({ ...hsv, s, v });
  };
  const dragHue = (e) => {
    const r = hueRef.current.getBoundingClientRect();
    const h = Math.min(1, Math.max(0, (e.clientX - r.left) / r.width)) * 360;
    commit({ ...hsv, h });
  };
  const startDrag = (handler) => (e) => {
    e.preventDefault(); handler(e);
    const move = (ev) => handler(ev);
    const up = () => { window.removeEventListener("pointermove", move); window.removeEventListener("pointerup", up); };
    window.addEventListener("pointermove", move); window.addEventListener("pointerup", up);
  };

  const onAreaKeyDown = (e) => {
    let { s, v } = hsv;
    if (e.key === "ArrowRight") s = Math.min(100, s + 1);
    else if (e.key === "ArrowLeft") s = Math.max(0, s - 1);
    else if (e.key === "ArrowUp") v = Math.min(100, v + 1);
    else if (e.key === "ArrowDown") v = Math.max(0, v - 1);
    else return;
    e.preventDefault();
    commit({ ...hsv, s, v });
  };
  const onHueKeyDown = (e) => {
    let h = hsv.h;
    if (e.key === "ArrowRight" || e.key === "ArrowUp") h = Math.min(360, h + 1);
    else if (e.key === "ArrowLeft" || e.key === "ArrowDown") h = Math.max(0, h - 1);
    else if (e.key === "Home") h = 0;
    else if (e.key === "End") h = 360;
    else return;
    e.preventDefault();
    commit({ ...hsv, h });
  };
  // #106: alpha slider drag + keyboard (0..1).
  const dragAlpha = (e) => {
    const r = alphaRef.current.getBoundingClientRect();
    const a = Math.min(1, Math.max(0, (e.clientX - r.left) / r.width));
    commit({ ...hsv, a });
  };
  const onAlphaKeyDown = (e) => {
    let a = hsv.a ?? 1;
    if (e.key === "ArrowRight" || e.key === "ArrowUp") a = Math.min(1, a + 0.01);
    else if (e.key === "ArrowLeft" || e.key === "ArrowDown") a = Math.max(0, a - 0.01);
    else if (e.key === "Home") a = 0;
    else if (e.key === "End") a = 1;
    else return;
    e.preventDefault();
    commit({ ...hsv, a: Math.round(a * 100) / 100 });
  };

  return (
    <div className={`twc-cp twc-field ${className}`} ref={wrapRef} {...rest}>
      {__twcStyles0}
      {__twcStyles1}
      {label ? (
        <span className="twc-field__label" id={labelId}>
          {label}{required ? <span className="twc-field__req">*</span> : null}
        </span>
      ) : null}
      <div ref={triggerRef} className="twc-cp__trigger" data-open={open || undefined} data-disabled={disabled || undefined} data-invalid={invalid || undefined} role="button" tabIndex={disabled ? -1 : 0}
        aria-haspopup="dialog" aria-expanded={open} aria-disabled={disabled || undefined} aria-labelledby={label ? labelId : undefined}
        aria-invalid={invalid || undefined} aria-describedby={error || hint ? descId : undefined}
        onClick={() => !disabled && setOpen((o) => !o)} onKeyDown={(e) => { if (!disabled && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); setOpen((o) => !o); } }}>
        <span className="twc-cp__swatch" style={{ background: hex }} />
        <span className="twc-cp__value">{hex}</span>
        <span className="twc-cp__chev" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg></span>
      </div>

      {open && coords ? createPortal(
        <div className="twc-cp__pop" ref={popRef} role="dialog" aria-modal="true" aria-label="Color picker"
          style={{ position: "fixed", left: coords.left, right: "auto", top: coords.top, bottom: coords.bottom, zIndex: "var(--z-tooltip)" }}>
          <div className="twc-cp__area" ref={areaRef} style={{ "--_h": hsv.h }} onPointerDown={startDrag(dragArea)}
            role="slider" tabIndex={0} aria-label="Saturation and brightness"
            aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(hsv.s)}
            aria-valuetext={`Saturation ${Math.round(hsv.s)}%, Brightness ${Math.round(hsv.v)}%`}
            onKeyDown={onAreaKeyDown}>
            <div className="twc-cp__area-sat" />
            <div className="twc-cp__area-val" />
            <span className="twc-cp__area-knob" style={{ left: `${hsv.s}%`, top: `${100 - hsv.v}%`, background: hex }} />
          </div>
          <div className="twc-cp__hue" ref={hueRef} onPointerDown={startDrag(dragHue)}
            role="slider" tabIndex={0} aria-label="Hue"
            aria-valuemin={0} aria-valuemax={360} aria-valuenow={Math.round(hsv.h)}
            onKeyDown={onHueKeyDown}>
            <span className="twc-cp__hue-knob" style={{ left: `${(hsv.h / 360) * 100}%` }} />
          </div>
          {alpha ? (
            <div className="twc-cp__alpha" ref={alphaRef} onPointerDown={startDrag(dragAlpha)}
              role="slider" tabIndex={0} aria-label="Alpha"
              aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round((hsv.a ?? 1) * 100)}
              onKeyDown={onAlphaKeyDown}
              style={{ "--_solid": hsvToHex(hsv.h, hsv.s, hsv.v) }}>
              <span className="twc-cp__hue-knob" style={{ left: `${(hsv.a ?? 1) * 100}%` }} />
            </div>
          ) : null}
          <div className="twc-cp__foot">
            <span className="twc-cp__swatch" style={{ background: hex }} />
            <input className="twc-cp__hex" data-tone={tone} value={hex} maxLength={alpha ? 9 : 7} aria-label="Hex color"
              aria-invalid={!hexRe.test(hex) || undefined} data-invalid={!hexRe.test(hex) || undefined}
              onChange={(e) => { let v = e.target.value; if (!v.startsWith("#")) v = "#" + v; if (value === undefined) setInternal(v); onChange?.(v); const p = hexToHsv(v); if (p) setHsv(p); }}
              onBlur={() => { if (hexRe.test(hex)) return; const revert = lastValidRef.current; if (revert === hex) return; if (value === undefined) setInternal(revert); onChange?.(revert); const p = hexToHsv(revert); if (p) setHsv(p); }} />
          </div>
          {presets && presets.length ? (
            <div className="twc-cp__presets">
              {presets.map((p) => (
                <button key={p} type="button" className="twc-cp__preset" data-active={p.toLowerCase() === hex.toLowerCase() || undefined}
                  style={{ background: p }} aria-label={p} onClick={() => { if (value === undefined) setInternal(p); onChange?.(p); const h = hexToHsv(p); if (h) setHsv(h); }} />
              ))}
            </div>
          ) : null}
        </div>, document.body
      ) : null}
      {error ? <span id={descId} className="twc-field__error">{error}</span> : hint ? <span id={descId} className="twc-field__hint">{hint}</span> : null}
    </div>
  );
}
