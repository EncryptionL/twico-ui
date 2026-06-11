import React from "react";

const COLORPICKER_CSS = `
.twc-cp { position: relative; font-family: var(--font-sans); display: flex; flex-direction: column; gap: var(--space-1-5); }
.twc-cp__label { font-size: var(--text-sm); font-weight: var(--font-semibold); color: var(--color-text); }
.twc-cp__trigger { display: flex; align-items: center; gap: var(--space-2-5); height: var(--control-h-md); padding: 0 var(--space-2) 0 var(--space-2);
  background: var(--color-surface); border: var(--border-thin) solid var(--color-border); border-radius: var(--radius-md); cursor: pointer;
  transition: border-color var(--duration-fast) var(--ease-standard), box-shadow var(--duration-fast) var(--ease-standard); }
.twc-cp__trigger:hover:not([data-open="true"]) { border-color: var(--color-border-strong); }
.twc-cp__trigger[data-open="true"] { border-color: var(--color-primary); box-shadow: var(--ring); }
.twc-cp__swatch { flex: none; width: 26px; height: 26px; border-radius: var(--radius-sm); box-shadow: inset 0 0 0 1px rgb(0 0 0 / 0.12); }
.twc-cp__value { flex: 1; font-family: var(--font-mono); font-size: var(--text-sm); color: var(--color-text); text-transform: uppercase; }
.twc-cp__chev { flex: none; color: var(--color-text-subtle); display: inline-flex; }
.twc-cp__chev svg { width: 16px; height: 16px; }
.twc-cp__pop { position: absolute; z-index: var(--z-popover); top: calc(100% + 6px); left: 0; width: 240px;
  background: var(--color-surface-raised); border: var(--border-thin) solid var(--color-border); border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg); padding: var(--space-3); animation: twico-scale-in var(--duration-fast) var(--ease-spring); transform-origin: top; }
.twc-cp__area { position: relative; width: 100%; height: 140px; border-radius: var(--radius-md); cursor: crosshair; overflow: hidden; touch-action: none; }
.twc-cp__area-sat { position: absolute; inset: 0; background: linear-gradient(to right, #fff, hsl(var(--_h,0), 100%, 50%)); }
.twc-cp__area-val { position: absolute; inset: 0; background: linear-gradient(to top, #000, transparent); }
.twc-cp__area-knob { position: absolute; width: 14px; height: 14px; border-radius: var(--radius-full); border: 2px solid #fff; box-shadow: 0 0 0 1px rgb(0 0 0 / 0.3); transform: translate(-50%, -50%); pointer-events: none; }
.twc-cp__hue { position: relative; height: 12px; margin-top: var(--space-3); border-radius: var(--radius-full); cursor: pointer; touch-action: none;
  background: linear-gradient(to right, #f00 0%, #ff0 17%, #0f0 33%, #0ff 50%, #00f 67%, #f0f 83%, #f00 100%); }
.twc-cp__hue-knob { position: absolute; top: 50%; width: 16px; height: 16px; border-radius: var(--radius-full); background: #fff; box-shadow: var(--shadow-sm), inset 0 0 0 1px rgb(0 0 0 / 0.2); transform: translate(-50%, -50%); pointer-events: none; }
.twc-cp__foot { display: flex; align-items: center; gap: var(--space-2); margin-top: var(--space-3); }
.twc-cp__hex { flex: 1; min-width: 0; height: 32px; padding: 0 8px; font-family: var(--font-mono); font-size: var(--text-xs); text-transform: uppercase;
  color: var(--color-text); background: var(--color-surface); border: var(--border-thin) solid var(--color-border); border-radius: var(--radius-sm); outline: none; }
.twc-cp__hex:focus { border-color: var(--color-primary); box-shadow: var(--ring); }
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
function hexToHsv(hex) {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex || ""); if (!m) return null;
  const int = parseInt(m[1], 16); const r = (int >> 16) / 255, g = ((int >> 8) & 255) / 255, b = (int & 255) / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b), d = max - min;
  let h = 0;
  if (d) { if (max === r) h = ((g - b) / d) % 6; else if (max === g) h = (b - r) / d + 2; else h = (r - g) / d + 4; h *= 60; if (h < 0) h += 360; }
  return { h, s: max ? (d / max) * 100 : 0, v: max * 100 };
}

const DEFAULT_PRESETS = ["#6366F1","#0EA5E9","#14B8A6","#22C55E","#F59E0B","#F43F5E","#8B5CF6","#0F172A"];

export function ColorPicker({
  label,
  value,
  defaultValue = "#6366F1",
  presets = DEFAULT_PRESETS,
  onChange,
  className = "",
  ...rest
}) {
  React.useEffect(() => {
    if (document.getElementById("twc-colorpicker-styles")) return;
    const el = document.createElement("style");
    el.id = "twc-colorpicker-styles";
    el.textContent = COLORPICKER_CSS;
    document.head.appendChild(el);
  }, []);

  const [internal, setInternal] = React.useState(defaultValue);
  const hex = (value !== undefined ? value : internal) || "#000000";
  const [open, setOpen] = React.useState(false);
  const [hsv, setHsv] = React.useState(() => hexToHsv(hex) || { h: 239, s: 60, v: 94 });
  const wrapRef = React.useRef(null);
  const areaRef = React.useRef(null);
  const hueRef = React.useRef(null);

  // sync external hex -> hsv when it changes and is valid
  React.useEffect(() => { const v = hexToHsv(hex); if (v && hsvToHex(v.h, v.s, v.v).toLowerCase() !== hsvToHex(hsv.h, hsv.s, hsv.v).toLowerCase()) setHsv(v); }, [hex]);

  React.useEffect(() => {
    if (!open) return;
    const onDown = (e) => { if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false); };
    const onKey = (e) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("mousedown", onDown); document.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("mousedown", onDown); document.removeEventListener("keydown", onKey); };
  }, [open]);

  const commit = (next) => { const h = hsvToHex(next.h, next.s, next.v); setHsv(next); if (value === undefined) setInternal(h); onChange?.(h); };

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

  return (
    <div className={`twc-cp ${className}`} ref={wrapRef} {...rest}>
      {label ? <span className="twc-cp__label">{label}</span> : null}
      <div className="twc-cp__trigger" data-open={open || undefined} role="button" tabIndex={0}
        onClick={() => setOpen((o) => !o)} onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setOpen((o) => !o); } }}>
        <span className="twc-cp__swatch" style={{ background: hex }} />
        <span className="twc-cp__value">{hex}</span>
        <span className="twc-cp__chev" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg></span>
      </div>

      {open ? (
        <div className="twc-cp__pop" role="dialog" aria-label="Color picker">
          <div className="twc-cp__area" ref={areaRef} style={{ "--_h": hsv.h }} onPointerDown={startDrag(dragArea)}>
            <div className="twc-cp__area-sat" />
            <div className="twc-cp__area-val" />
            <span className="twc-cp__area-knob" style={{ left: `${hsv.s}%`, top: `${100 - hsv.v}%`, background: hex }} />
          </div>
          <div className="twc-cp__hue" ref={hueRef} onPointerDown={startDrag(dragHue)}>
            <span className="twc-cp__hue-knob" style={{ left: `${(hsv.h / 360) * 100}%` }} />
          </div>
          <div className="twc-cp__foot">
            <span className="twc-cp__swatch" style={{ background: hex }} />
            <input className="twc-cp__hex" value={hex} maxLength={7}
              onChange={(e) => { let v = e.target.value; if (!v.startsWith("#")) v = "#" + v; if (value === undefined) setInternal(v); onChange?.(v); const p = hexToHsv(v); if (p) setHsv(p); }} />
          </div>
          {presets && presets.length ? (
            <div className="twc-cp__presets">
              {presets.map((p) => (
                <button key={p} type="button" className="twc-cp__preset" data-active={p.toLowerCase() === hex.toLowerCase() || undefined}
                  style={{ background: p }} aria-label={p} onClick={() => { if (value === undefined) setInternal(p); onChange?.(p); const h = hexToHsv(p); if (h) setHsv(h); }} />
              ))}
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
