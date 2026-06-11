import React from "react";

const TOOLTIP_CSS = `
.twc-tooltip-wrap { position: relative; display: inline-flex; }
.twc-tooltip {
  position: absolute; z-index: var(--z-tooltip); pointer-events: none;
  padding: 6px 10px; border-radius: var(--radius-md);
  background: var(--color-text); color: var(--color-surface);
  font-family: var(--font-sans); font-size: var(--text-xs); font-weight: var(--font-medium);
  line-height: 1.3; white-space: nowrap; box-shadow: var(--shadow-md);
  opacity: 0; transform: scale(0.9); transition: opacity var(--duration-fast) var(--ease-out), transform var(--duration-fast) var(--ease-spring);
}
.twc-tooltip[data-show="true"] { opacity: 1; transform: scale(1); }
.twc-tooltip[data-place="top"]    { bottom: calc(100% + 8px); left: 50%; transform-origin: bottom center; translate: -50% 0; }
.twc-tooltip[data-place="bottom"] { top: calc(100% + 8px); left: 50%; transform-origin: top center; translate: -50% 0; }
.twc-tooltip[data-place="left"]   { right: calc(100% + 8px); top: 50%; transform-origin: right center; translate: 0 -50%; }
.twc-tooltip[data-place="right"]  { left: calc(100% + 8px); top: 50%; transform-origin: left center; translate: 0 -50%; }
.twc-tooltip[data-show="true"][data-place="top"], .twc-tooltip[data-show="true"][data-place="bottom"] { transform: scale(1); }
.twc-tooltip__arrow { position: absolute; width: 7px; height: 7px; background: var(--color-text); transform: rotate(45deg); }
.twc-tooltip[data-place="top"] .twc-tooltip__arrow    { bottom: -3px; left: 50%; margin-left: -3.5px; }
.twc-tooltip[data-place="bottom"] .twc-tooltip__arrow { top: -3px; left: 50%; margin-left: -3.5px; }
.twc-tooltip[data-place="left"] .twc-tooltip__arrow   { right: -3px; top: 50%; margin-top: -3.5px; }
.twc-tooltip[data-place="right"] .twc-tooltip__arrow  { left: -3px; top: 50%; margin-top: -3.5px; }
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
  const timer = React.useRef(null);
  const open = () => { clearTimeout(timer.current); timer.current = setTimeout(() => setShow(true), delay); };
  const close = () => { clearTimeout(timer.current); setShow(false); };

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
      className={`twc-tooltip-wrap ${className}`}
      onMouseEnter={open} onMouseLeave={close} onFocus={open} onBlur={close}
      {...rest}
    >
      {trigger}
      <span
        id={id}
        className="twc-tooltip"
        data-place={placement}
        data-show={show || undefined}
        role="tooltip"
        aria-hidden={show ? undefined : "true"}
      >
        {label}
        <span className="twc-tooltip__arrow" aria-hidden="true" />
      </span>
    </span>
  );
}
