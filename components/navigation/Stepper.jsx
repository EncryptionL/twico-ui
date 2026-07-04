import React from "react";
import { useScopedStyles } from "../_styles.js";

const STEPPER_CSS = `
.twc-stepper { display: flex; font-family: var(--font-sans); }
/* tone → accent set (default primary). Mirrors Button's --_accent model; Badge's tone vocabulary. */
.twc-stepper { --_accent: var(--color-primary); --_accent-fg: var(--color-primary-fg); --_accent-subtle: var(--color-primary-subtle); --_accent-subtle-fg: var(--color-primary-subtle-fg); --_accent-border: var(--color-primary-border); }
.twc-stepper[data-tone="success"] { --_accent: var(--color-success); --_accent-fg: var(--color-success-fg); --_accent-subtle: var(--color-success-subtle); --_accent-subtle-fg: var(--color-success-subtle-fg); --_accent-border: var(--color-success); }
.twc-stepper[data-tone="warning"] { --_accent: var(--color-warning); --_accent-fg: var(--color-warning-fg); --_accent-subtle: var(--color-warning-subtle); --_accent-subtle-fg: var(--color-warning-subtle-fg); --_accent-border: var(--color-warning); }
.twc-stepper[data-tone="danger"]  { --_accent: var(--color-danger); --_accent-fg: var(--color-danger-fg); --_accent-subtle: var(--color-danger-subtle); --_accent-subtle-fg: var(--color-danger-subtle-fg); --_accent-border: var(--color-danger); }
.twc-stepper[data-tone="info"]    { --_accent: var(--color-info); --_accent-fg: var(--color-info-fg); --_accent-subtle: var(--color-info-subtle); --_accent-subtle-fg: var(--color-info-subtle-fg); --_accent-border: var(--color-info); }
.twc-stepper[data-tone="neutral"] { --_accent: var(--color-text); --_accent-fg: var(--color-surface); --_accent-subtle: var(--color-surface-sunken); --_accent-subtle-fg: var(--color-text-muted); --_accent-border: var(--color-border-strong); }
.twc-stepper[data-orientation="horizontal"] { flex-direction: row; align-items: flex-start; }
.twc-stepper[data-orientation="vertical"] { flex-direction: column; gap: 4px; }
.twc-step { display: flex; flex: 1; min-width: 0; }
.twc-stepper[data-orientation="horizontal"] .twc-step { flex-direction: column; align-items: center; text-align: center; position: relative; }
.twc-stepper[data-orientation="vertical"] .twc-step { flex-direction: row; align-items: flex-start; gap: var(--space-3); flex: none; }
.twc-step__indicator {
  position: relative; z-index: 1; flex: none; width: 32px; height: 32px; border-radius: var(--radius-full);
  display: grid; place-items: center; font-size: var(--text-sm); font-weight: var(--font-bold);
  background: var(--color-surface); color: var(--color-text-subtle);
  border: var(--border-medium) solid var(--color-border-strong);
  transition: background-color var(--duration-base) var(--ease-standard), border-color var(--duration-base) var(--ease-standard), color var(--duration-base) var(--ease-standard), transform var(--duration-base) var(--ease-spring);
}
.twc-step__indicator svg { width: 17px; height: 17px; }
.twc-step[data-state="active"] .twc-step__indicator { border-color: var(--_accent); color: var(--_accent); box-shadow: 0 0 0 4px var(--_accent-subtle); }
.twc-step[data-state="complete"] .twc-step__indicator { background: var(--_accent); border-color: var(--_accent); color: var(--_accent-fg); }
.twc-step[data-state="error"] .twc-step__indicator { background: var(--color-danger); border-color: var(--color-danger); color: var(--color-danger-fg); }
.twc-step[data-clickable="true"] { cursor: pointer; }
.twc-step[data-clickable="true"]:hover .twc-step__indicator { transform: scale(1.06); }
.twc-step__body { display: flex; flex-direction: column; gap: 1px; }
.twc-stepper[data-orientation="horizontal"] .twc-step__body { margin-top: 8px; padding: 0 6px; }
.twc-step__title { font-size: var(--text-sm); font-weight: var(--font-semibold); color: var(--color-text); }
.twc-step[data-state="upcoming"] .twc-step__title { color: var(--color-text-muted); }
.twc-step__desc { font-size: var(--text-xs); color: var(--color-text-subtle); }
.twc-step__connector { background: var(--color-border); transition: background-color var(--duration-base) var(--ease-standard); }
.twc-stepper[data-orientation="horizontal"] .twc-step__connector { position: absolute; top: 16px; height: 2px; inset-inline-start: calc(50% + 22px); inset-inline-end: calc(-50% + 22px); }
.twc-stepper[data-orientation="vertical"] .twc-step__connector { width: 2px; flex: 1; min-height: 22px; margin: 4px 0; align-self: stretch; margin-inline-start: 15px; }
.twc-stepper[data-orientation="vertical"] .twc-step__col { display: flex; flex-direction: column; align-items: center; }
.twc-step[data-state="complete"] .twc-step__connector, .twc-step[data-state="active"] .twc-step__connector { background: var(--_accent); }
.twc-stepper[data-orientation="vertical"] .twc-step__vbody { padding-bottom: var(--space-2); }
.twc-step__sr { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; border: 0; }
`;

const CheckIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
);
const BangIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M12 8v5M12 17h.01"/></svg>
);

export function Stepper({
  steps,
  active: activeProp,
  defaultActive = 0,
  orientation = "horizontal",
  tone = "primary",
  onStepClick,
  clickable = false,
  className = "",
  ...rest
}) {
  const __twcStyles = useScopedStyles("twc-stepper-styles", STEPPER_CSS);

  // Controlled when `active` is passed; uncontrolled (internal state seeded by
  // `defaultActive`) otherwise. A clicked step advances the internal index in
  // uncontrolled mode, and onStepClick always fires.
  const [activeInternal, setActiveInternal] = React.useState(defaultActive);
  const active = activeProp !== undefined ? activeProp : activeInternal;
  const handleStep = (i) => { if (activeProp === undefined) setActiveInternal(i); onStepClick?.(i); };

  const stateOf = (i, step) => {
    if (step.error) return "error";
    if (i < active) return "complete";
    if (i === active) return "active";
    return "upcoming";
  };

  return (
    <div className={`twc-stepper ${className}`} data-orientation={orientation} data-tone={tone} role="group" aria-label="Progress" {...rest}>
      {__twcStyles}
      {steps.map((step, i) => {
        const state = stateOf(i, step);
        const last = i === steps.length - 1;
        const srText = `Step ${i + 1} of ${steps.length}${state === "complete" ? ", completed" : state === "error" ? ", error" : state === "active" ? ", current" : ", upcoming"}. `;
        const isClickable = clickable && i <= active;
        const interactive = isClickable
          ? {
              role: "button",
              tabIndex: 0,
              onClick: () => handleStep(i),
              onKeyDown: (e) => {
                if (e.key === "Enter" || e.key === " ") { e.preventDefault(); handleStep(i); }
              },
            }
          : null;
        const indicator = (
          <span className="twc-step__indicator" aria-hidden="true">
            {state === "complete" ? <CheckIcon /> : state === "error" ? <BangIcon /> : (step.icon || i + 1)}
          </span>
        );
        if (orientation === "vertical") {
          return (
            <div key={i} className="twc-step" data-state={state} data-clickable={isClickable || undefined}
                 aria-current={state === "active" ? "step" : undefined} aria-invalid={state === "error" ? "true" : undefined} {...interactive}>
              <span className="twc-step__sr">{srText}</span>
              <div className="twc-step__col">
                {indicator}
                {!last ? <span className="twc-step__connector" /> : null}
              </div>
              <div className="twc-step__body twc-step__vbody">
                <span className="twc-step__title">{step.title}</span>
                {step.description ? <span className="twc-step__desc">{step.description}</span> : null}
              </div>
            </div>
          );
        }
        return (
          <div key={i} className="twc-step" data-state={state} data-clickable={isClickable || undefined}
               aria-current={state === "active" ? "step" : undefined} aria-invalid={state === "error" ? "true" : undefined} {...interactive}>
            <span className="twc-step__sr">{srText}</span>
            {indicator}
            {!last ? <span className="twc-step__connector" /> : null}
            <div className="twc-step__body">
              <span className="twc-step__title">{step.title}</span>
              {step.description ? <span className="twc-step__desc">{step.description}</span> : null}
            </div>
          </div>
        );
      })}
    </div>
  );
}
