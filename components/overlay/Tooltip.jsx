import React from "react";
import { createPortal } from "react-dom";

const TOOLTIP_CSS = `
.twc-tooltip-wrap { display: inline-flex; }
.twc-tooltip {
  position: fixed; z-index: var(--z-tooltip); pointer-events: none;
  padding: 6px 10px; border-radius: var(--radius-md);
  background: var(--color-text); color: var(--color-surface);
  font-family: var(--font-sans); font-size: var(--text-xs); font-weight: var(--font-medium);
  line-height: 1.3; white-space: nowrap; box-shadow: var(--shadow-md);
  opacity: 0; transform: scale(0.9); transition: opacity var(--duration-fast) var(--ease-out), transform var(--duration-fast) var(--ease-spring);
}
.twc-tooltip[data-show="true"] { opacity: 1; transform: scale(1); }
.twc-tooltip[data-place="top"]    { transform-origin: bottom center; translate: -50% 0; }
.twc-tooltip[data-place="bottom"] { transform-origin: top center; translate: -50% 0; }
.twc-tooltip[data-place="left"]   { transform-origin: right center; translate: 0 -50%; }
.twc-tooltip[data-place="right"]  { transform-origin: left center; translate: 0 -50%; }
.twc-tooltip[data-show="true"][data-place="top"], .twc-tooltip[data-show="true"][data-place="bottom"] { transform: scale(1); }
.twc-tooltip__arrow { position: absolute; width: 7px; height: 7px; background: var(--color-text); transform: rotate(45deg); }
.twc-tooltip[data-place="top"] .twc-tooltip__arrow    { bottom: -3px; left: 50%; margin-left: -3.5px; }
.twc-tooltip[data-place="bottom"] .twc-tooltip__arrow { top: -3px; left: 50%; margin-left: -3.5px; }
.twc-tooltip[data-place="left"] .twc-tooltip__arrow   { right: -3px; top: 50%; margin-top: -3.5px; }
.twc-tooltip[data-place="right"] .twc-tooltip__arrow  { left: -3px; top: 50%; margin-top: -3.5px; }
@media (prefers-reduced-motion: reduce) { .twc-tooltip { transition: opacity var(--duration-fast) linear; transform: none; } }
`;

export function Tooltip({
  children,
  label,
  placement = "top",
  delay = 120,
  className = "",
  ...rest
}) {
  React.useInsertionEffect(() => {
    if (document.getElementById("twc-tooltip-styles")) return;
    const el = document.createElement("style");
    el.id = "twc-tooltip-styles";
    el.textContent = TOOLTIP_CSS;
    document.head.appendChild(el);
  }, []);

  const id = React.useId();
  const [show, setShow] = React.useState(false);
  const [coords, setCoords] = React.useState(null);
  const timer = React.useRef(null);
  const wrapRef = React.useRef(null);
  const tipRef = React.useRef(null);
  const open = () => { clearTimeout(timer.current); timer.current = setTimeout(() => setShow(true), delay); };
  const close = () => { clearTimeout(timer.current); setShow(false); };
  // Clear any pending open-delay timer if the component unmounts before it fires.
  React.useEffect(() => () => clearTimeout(timer.current), []);

  // Portaled to <body> with fixed positioning so it is never clipped by an overflow/
  // scroll ancestor. Coords are measured from the trigger; CSS data-place supplies the
  // centering translate + arrow, so only the anchor edges are set here. The centered
  // axis is clamped to the viewport (minus a small margin) so long labels near an edge
  // don't overflow off-screen.
  const place = React.useCallback(() => {
    const el = wrapRef.current; if (!el) return;
    const r = el.getBoundingClientRect();
    const cx = Math.round(r.left + r.width / 2), cy = Math.round(r.top + r.height / 2);
    const vw = window.innerWidth, vh = window.innerHeight, gap = 8, margin = 8;
    const tip = tipRef.current;
    const tw = tip ? tip.offsetWidth : 0, th = tip ? tip.offsetHeight : 0;
    // For top/bottom the box is centered on `left` (translate -50%), so clamp its
    // center so [center - tw/2, center + tw/2] stays within the viewport margins.
    const clampX = (c) => tw ? Math.round(Math.min(Math.max(c, margin + tw / 2), vw - margin - tw / 2)) : c;
    // For left/right the box is centered on `top` (translate -50%); clamp vertically.
    const clampY = (c) => th ? Math.round(Math.min(Math.max(c, margin + th / 2), vh - margin - th / 2)) : c;
    const base = { left: "auto", right: "auto", top: "auto", bottom: "auto" };
    if (placement === "bottom") setCoords({ ...base, left: clampX(cx), top: Math.round(r.bottom + gap) });
    else if (placement === "left") setCoords({ ...base, top: clampY(cy), right: Math.round(vw - r.left + gap) });
    else if (placement === "right") setCoords({ ...base, top: clampY(cy), left: Math.round(r.right + gap) });
    else setCoords({ ...base, left: clampX(cx), bottom: Math.round(vh - r.top + gap) }); // top (default)
  }, [placement]);
  // Measure once on mount (client-only, so SSR renders no portal — no hydration diff)
  // and keep the closed tooltip positioned so the first open animates in smoothly.
  React.useEffect(() => { place(); }, [place]);
  React.useEffect(() => {
    if (!show) return undefined;
    place();
    const onMove = () => place();
    window.addEventListener("scroll", onMove, true);
    window.addEventListener("resize", onMove);
    return () => { window.removeEventListener("scroll", onMove, true); window.removeEventListener("resize", onMove); };
  }, [show, place]);

  // WCAG 1.4.13: Escape dismisses the tooltip; listener attached only while shown.
  React.useEffect(() => {
    if (!show) return;
    const onKeyDown = (e) => {
      if (e.key === "Escape") { clearTimeout(timer.current); setShow(false); }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [show]);

  // Associate the trigger with the tooltip text for assistive technology.
  const describedBy = show ? id : undefined;
  const trigger =
    React.isValidElement(children) && children.type !== React.Fragment ? (
      React.cloneElement(children, {
        "aria-describedby":
          [children.props["aria-describedby"], describedBy].filter(Boolean).join(" ") || undefined,
      })
    ) : (
      <span aria-describedby={describedBy}>{children}</span>
    );

  return (
    <span
      ref={wrapRef}
      className={`twc-tooltip-wrap ${className}`}
      onMouseEnter={open} onMouseLeave={close} onFocus={open} onBlur={close}
      {...rest}
    >
      {trigger}
      {coords ? createPortal(
        <span
          ref={tipRef}
          id={id}
          className="twc-tooltip"
          data-place={placement}
          data-show={show || undefined}
          role="tooltip"
          aria-hidden={show ? undefined : "true"}
          style={{ position: "fixed", left: coords.left, right: coords.right, top: coords.top, bottom: coords.bottom }}
        >
          {label}
          <span className="twc-tooltip__arrow" aria-hidden="true" />
        </span>, document.body) : null}
    </span>
  );
}
