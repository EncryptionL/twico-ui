import React from "react";
import { useScopedStyles } from "../_styles.js";
import { IconButton } from "../buttons/IconButton.jsx";
import { Tooltip } from "../overlay/Tooltip.jsx";

// #407: a zoomable/pannable image viewer on a fixed stage. Wheel + pinch zoom about the pointer (via a
// non-passive native wheel listener so the page/dialog behind doesn't scroll — the same pattern the charts
// use), drag to pan when zoomed (clamped to the stage), +/-/0 keys, double-click to toggle. Reuses the
// already-barrelled IconButton + Tooltip for the built-in controls (the AvatarMenu→Menu sibling-reuse pattern).
const IV_CSS = `
.twc-iv { position: relative; display: block; width: 100%; font-family: var(--font-sans); }
.twc-iv__stage { position: relative; overflow: hidden; width: 100%; height: 100%; min-height: 200px; touch-action: none;
  /* #414: styleable via --twc-iv-bg / --twc-iv-radius (or the radius prop) — current values as the fallback. */
  background: var(--twc-iv-bg, var(--color-surface-sunken)); border-radius: var(--twc-iv-radius, var(--radius-lg)); }
.twc-iv__stage:focus-visible { outline: none; box-shadow: var(--ring); }
.twc-iv__stage[data-zoomed="true"] { cursor: grab; }
.twc-iv__stage[data-dragging="true"] { cursor: grabbing; }
.twc-iv__img { display: block; width: 100%; height: 100%; transform-origin: center center; user-select: none; -webkit-user-drag: none;
  transition: transform var(--duration-fast) var(--ease-standard); }
.twc-iv__stage[data-dragging="true"] .twc-iv__img { transition: none; }
@media (prefers-reduced-motion: reduce) { .twc-iv__img { transition: none; } }
.twc-iv__controls { position: absolute; inset-block-end: var(--space-2); inset-inline-end: var(--space-2); display: flex; gap: var(--space-1);
  background: var(--color-surface); border: var(--border-thin) solid var(--color-border); border-radius: var(--radius-full); padding: 3px; box-shadow: var(--shadow-md); }
`;

const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
const IcoPlus = (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3M11 8v6M8 11h6"/></svg>);
const IcoMinus = (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3M8 11h6"/></svg>);
const IcoReset = (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9 9 0 0 0-6.3 2.6L3 8"/><path d="M3 3v5h5"/></svg>);

export const ImageViewer = /*#__PURE__*/ React.forwardRef(function ImageViewer({
  src,
  alt,
  minZoom = 1,
  maxZoom = 8,
  step = 0.25,
  zoom: zoomProp,
  defaultZoom = 1,
  onZoomChange,
  onStateChange,
  doubleClickZoom = 2,
  controls,
  fit = "contain",
  radius,
  className = "",
  style,
  ...rest
}, ref) {
  const __twcStyles = useScopedStyles("twc-imageviewer-styles", IV_CSS);
  const stageRef = React.useRef(null);
  const natRef = React.useRef({ w: 0, h: 0 }); // #414: natural image size, for content-box pan bounds

  const [internalZoom, setInternalZoom] = React.useState(clamp(defaultZoom, minZoom, maxZoom));
  const zoomControlled = zoomProp !== undefined;
  const zoom = clamp(zoomControlled ? zoomProp : internalZoom, minZoom, maxZoom);
  const [offset, setOffset] = React.useState({ x: 0, y: 0 });
  const [dragging, setDragging] = React.useState(false);

  const zoomRef = React.useRef(zoom); zoomRef.current = zoom;
  const offsetRef = React.useRef(offset); offsetRef.current = offset;

  const applyZoom = (next) => { const z = clamp(next, minZoom, maxZoom); if (!zoomControlled) setInternalZoom(z); onZoomChange?.(z); return z; };
  const reset = () => { applyZoom(minZoom); setOffset({ x: 0, y: 0 }); };

  // #414: the object-fit content box at 1× (so pan bounds match the actual rendered image, not the stage —
  // tighter for `contain`/`scale-down`, correct for a small image that isn't upscaled). Falls back to the stage
  // size before the image loads.
  const contentBox = (r) => {
    const nw = natRef.current.w, nh = natRef.current.h;
    if (!nw || !nh) return { cw: r.width, ch: r.height };
    const sx = r.width / nw, sy = r.height / nh;
    let sc;
    if (fit === "cover") sc = Math.max(sx, sy);
    else if (fit === "none") sc = 1;
    else if (fit === "scale-down") sc = Math.min(1, Math.min(sx, sy));
    else sc = Math.min(sx, sy); // contain
    return { cw: nw * sc, ch: nh * sc };
  };
  // Pan bounds: keep the (scaled) content from being dragged off the stage.
  const clampOffset = (off, s) => {
    const r = stageRef.current && stageRef.current.getBoundingClientRect();
    if (!r) return off;
    const { cw, ch } = contentBox(r);
    const maxX = Math.max(0, (cw * s - r.width) / 2);
    const maxY = Math.max(0, (ch * s - r.height) / 2);
    return { x: clamp(off.x, -maxX, maxX), y: clamp(off.y, -maxY, maxY) };
  };

  // Zoom about a client point so the content under the cursor stays put (anchored zoom).
  const zoomAt = (clientX, clientY, nextScale) => {
    const oldS = zoomRef.current;
    const s = clamp(nextScale, minZoom, maxZoom);
    const r = stageRef.current && stageRef.current.getBoundingClientRect();
    if (!r) { applyZoom(s); return; }
    const qx = clientX - (r.left + r.width / 2), qy = clientY - (r.top + r.height / 2);
    const ratio = oldS === 0 ? 1 : s / oldS;
    const off = { x: qx * (1 - ratio) + offsetRef.current.x * ratio, y: qy * (1 - ratio) + offsetRef.current.y * ratio };
    applyZoom(s);
    setOffset(s <= minZoom ? { x: 0, y: 0 } : clampOffset(off, s));
  };
  const zoomFromCenter = (next) => {
    const r = stageRef.current && stageRef.current.getBoundingClientRect();
    if (r) zoomAt(r.left + r.width / 2, r.top + r.height / 2, next);
    else if (applyZoom(next) <= minZoom) setOffset({ x: 0, y: 0 });
  };

  // Reset when the picture changes (skip the initial mount so onZoomChange isn't fired spuriously).
  const mountedRef = React.useRef(false);
  React.useEffect(() => { if (mountedRef.current) reset(); else mountedRef.current = true; /* eslint-disable-next-line */ }, [src]);

  // Non-passive wheel — React's onWheel is passive, so preventDefault there is ignored (the page would scroll).
  React.useEffect(() => {
    const stage = stageRef.current; if (!stage) return undefined;
    const onWheel = (e) => { if (!e.deltaY) return; /* ignore a pure-horizontal trackpad swipe (deltaY===0) */ e.preventDefault(); zoomAt(e.clientX, e.clientY, zoomRef.current * (e.deltaY < 0 ? 1 + step : 1 / (1 + step))); };
    stage.addEventListener("wheel", onWheel, { passive: false });
    return () => stage.removeEventListener("wheel", onWheel);
    // #414: `fit` too — the listener's zoomAt→clampOffset closes over the content box, which changes with fit.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, minZoom, maxZoom, fit]);

  // Pointer tracking: 1 pointer (when zoomed) pans; 2 pointers pinch-zoom about their midpoint.
  const pointers = React.useRef(new Map());
  const pinchRef = React.useRef(null);
  const panRef = React.useRef(null);
  const onPointerDown = (e) => {
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    e.currentTarget.setPointerCapture?.(e.pointerId);
    if (pointers.current.size === 2) {
      const [a, b] = [...pointers.current.values()];
      pinchRef.current = { dist: Math.hypot(a.x - b.x, a.y - b.y) || 1, startZoom: zoomRef.current };
      panRef.current = null; setDragging(false);
    } else if (pointers.current.size === 1 && zoomRef.current > minZoom) {
      panRef.current = { x: e.clientX, y: e.clientY, ox: offsetRef.current.x, oy: offsetRef.current.y };
      setDragging(true);
    }
  };
  const onPointerMove = (e) => {
    if (!pointers.current.has(e.pointerId)) return;
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pointers.current.size === 2 && pinchRef.current) {
      const [a, b] = [...pointers.current.values()];
      const dist = Math.hypot(a.x - b.x, a.y - b.y);
      zoomAt((a.x + b.x) / 2, (a.y + b.y) / 2, pinchRef.current.startZoom * (dist / pinchRef.current.dist));
    } else if (panRef.current) {
      setOffset(clampOffset({ x: panRef.current.ox + (e.clientX - panRef.current.x), y: panRef.current.oy + (e.clientY - panRef.current.y) }, zoomRef.current));
    }
  };
  const onPointerUp = (e) => {
    pointers.current.delete(e.pointerId);
    e.currentTarget.releasePointerCapture?.(e.pointerId);
    if (pointers.current.size < 2) pinchRef.current = null;
    if (pointers.current.size === 0) { panRef.current = null; setDragging(false); }
  };

  const onKeyDown = (e) => {
    if (e.key === "+" || e.key === "=") { e.preventDefault(); zoomFromCenter(zoomRef.current + step); }
    else if (e.key === "-" || e.key === "_") { e.preventDefault(); zoomFromCenter(zoomRef.current - step); }
    else if (e.key === "0") { e.preventDefault(); reset(); }
  };
  const onDoubleClick = (e) => {
    if (zoomRef.current > minZoom) reset();
    else zoomAt(e.clientX, e.clientY, doubleClickZoom);
  };

  const canZoomIn = zoom < maxZoom, canZoomOut = zoom > minZoom;
  const api = { zoom, zoomIn: () => zoomFromCenter(zoom + step), zoomOut: () => zoomFromCenter(zoom - step), reset, canZoomIn, canZoomOut };
  // #414: expose the same zoom API via a ref, so a host can drive controls from its own toolbar (controls={false}).
  React.useImperativeHandle(ref, () => api);
  // #414: reactive state for a host toolbar's disabled states (pairs with the imperative handle).
  const onStateChangeRef = React.useRef(onStateChange); onStateChangeRef.current = onStateChange;
  React.useEffect(() => { onStateChangeRef.current?.({ zoom, canZoomIn, canZoomOut }); }, [zoom, canZoomIn, canZoomOut]);
  // #414: re-clamp the pan offset when `fit` changes (the content box, hence the bounds, changes with it).
  React.useEffect(() => { setOffset((o) => clampOffset(o, zoomRef.current)); /* eslint-disable-next-line */ }, [fit]);
  const defaultControls = (
    <div className="twc-iv__controls">
      <Tooltip label="Zoom out" placement="top"><IconButton aria-label="Zoom out" variant="ghost" size="sm" disabled={!canZoomOut} onClick={api.zoomOut} icon={IcoMinus} /></Tooltip>
      <Tooltip label="Zoom in" placement="top"><IconButton aria-label="Zoom in" variant="ghost" size="sm" disabled={!canZoomIn} onClick={api.zoomIn} icon={IcoPlus} /></Tooltip>
      <Tooltip label="Reset" placement="top"><IconButton aria-label="Reset zoom" variant="ghost" size="sm" disabled={!canZoomOut} onClick={api.reset} icon={IcoReset} /></Tooltip>
    </div>
  );
  const controlsNode = controls === false ? null : typeof controls === "function" ? controls(api) : (controls != null ? controls : defaultControls);

  return (
    <div className={`twc-iv ${className}`.trim()} style={style} {...rest}>
      {__twcStyles}
      <div
        ref={stageRef}
        className="twc-iv__stage"
        style={radius ? { "--twc-iv-radius": `var(--radius-${radius})` } : undefined}
        tabIndex={0}
        role="group"
        aria-label={alt ? `${alt} — zoomable` : "Zoomable image"}
        data-dragging={dragging || undefined}
        data-zoomed={zoom > minZoom || undefined}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onDoubleClick={onDoubleClick}
        onKeyDown={onKeyDown}
      >
        <img
          src={src}
          alt={alt}
          className="twc-iv__img"
          draggable={false}
          onLoad={(e) => { natRef.current = { w: e.currentTarget.naturalWidth, h: e.currentTarget.naturalHeight }; setOffset((o) => clampOffset(o, zoomRef.current)); }}
          style={{ transform: `translate(${offset.x}px, ${offset.y}px) scale(${zoom})`, objectFit: fit }}
        />
      </div>
      {controlsNode}
    </div>
  );
});
// NOTE: intentionally NO `ImageViewer.displayName = …` — a top-level property assignment is a side effect that
// pins this component (and its IconButton + Tooltip imports, ~5 kB) into EVERY tree-shaken bundle, breaking the
// per-component size budgets (#414 regression). The named render function above already gives DevTools a name.
