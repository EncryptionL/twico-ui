import React from "react";

const STEPPER_CSS = `
.twc-stepper { display: flex; font-family: var(--font-sans); }
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
.twc-step[data-state="active"] .twc-step__indicator { border-color: var(--color-primary); color: var(--color-primary); box-shadow: 0 0 0 4px var(--color-primary-subtle); }
.twc-step[data-state="complete"] .twc-step__indicator { background: var(--color-primary); border-color: var(--color-primary); color: var(--color-primary-fg); }
.twc-step[data-state="error"] .twc-step__indicator { background: var(--color-danger); border-color: var(--color-danger); color: var(--color-danger-fg); }
.twc-step[data-clickable="true"] { cursor: pointer; }
.twc-step[data-clickable="true"]:hover .twc-step__indicator { transform: scale(1.06); }
.twc-step__body { display: flex; flex-direction: column; gap: 1px; }
.twc-stepper[data-orientation="horizontal"] .twc-step__body { margin-top: 8px; padding: 0 6px; }
.twc-step__title { font-size: var(--text-sm); font-weight: var(--font-semibold); color: var(--color-text); }
.twc-step[data-state="upcoming"] .twc-step__title { color: var(--color-text-muted); }
.twc-step__desc { font-size: var(--text-xs); color: var(--color-text-subtle); }
.twc-step__connector { background: var(--color-border); transition: background-color var(--duration-base) var(--ease-standard); }
.twc-stepper[data-orientation="horizontal"] .twc-step__connector { position: absolute; top: 16px; height: 2px; left: calc(50% + 22px); right: calc(-50% + 22px); }
.twc-stepper[data-orientation="vertical"] .twc-step__connector { width: 2px; flex: 1; min-height: 22px; margin: 4px 0; align-self: stretch; margin-left: 15px; }
.twc-stepper[data-orientation="vertical"] .twc-step__col { display: flex; flex-direction: column; align-items: center; }
.twc-step[data-state="complete"] .twc-step__connector, .twc-step[data-state="active"] .twc-step__connector { background: var(--color-primary); }
.twc-stepper[data-orientation="vertical"] .twc-step__vbody { padding-bottom: var(--space-2); }
`;

const CheckIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
);
const BangIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M12 8v5M12 17h.01"/></svg>
);

export function Stepper({
  steps,
  active = 0,
  orientation = "horizontal",
  onStepClick,
  clickable = false,
  className = "",
  ...rest
}) {
  React.useEffect(() => {
    if (document.getElementById("twc-stepper-styles")) return;
    const el = document.createElement("style");
    el.id = "twc-stepper-styles";
    el.textContent = STEPPER_CSS;
    document.head.appendChild(el);
  }, []);

  const stateOf = (i, step) => {
    if (step.error) return "error";
    if (i < active) return "complete";
    if (i === active) return "active";
    return "upcoming";
  };

  return (
    <div className={`twc-stepper ${className}`} data-orientation={orientation} {...rest}>
      {steps.map((step, i) => {
        const state = stateOf(i, step);
        const last = i === steps.length - 1;
        const isClickable = clickable && i <= active;
        const indicator = (
          <span className="twc-step__indicator" aria-hidden="true">
            {state === "complete" ? <CheckIcon /> : state === "error" ? <BangIcon /> : (step.icon || i + 1)}
          </span>
        );
        if (orientation === "vertical") {
          return (
            <div key={i} className="twc-step" data-state={state} data-clickable={isClickable || undefined}
                 onClick={isClickable ? () => onStepClick?.(i) : undefined}>
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
               onClick={isClickable ? () => onStepClick?.(i) : undefined}>
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
