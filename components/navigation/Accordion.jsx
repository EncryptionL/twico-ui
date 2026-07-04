import React from "react";
import { useScopedStyles } from "../_styles.js";

const ACCORDION_CSS = `
.twc-accordion { display: flex; flex-direction: column; font-family: var(--font-sans);
  border: var(--border-thin) solid var(--color-border); border-radius: var(--radius-lg); overflow: hidden; background: var(--color-surface); }
.twc-accordion__item { border-bottom: var(--border-thin) solid var(--color-divider); }
.twc-accordion__item:last-child { border-bottom: none; }
.twc-accordion__trigger {
  display: flex; align-items: center; gap: var(--space-3); width: 100%;
  padding: var(--space-4); border: none; background: transparent; cursor: pointer;
  font-family: inherit; font-size: var(--text-sm); font-weight: var(--font-semibold);
  color: var(--color-text); text-align: start;
  transition: background-color var(--duration-fast) var(--ease-standard);
}
.twc-accordion__heading { margin: 0; font: inherit; }
.twc-accordion__trigger:hover:not(:disabled) { background: var(--color-surface-sunken); }
.twc-accordion__trigger:disabled { opacity: 0.45; cursor: not-allowed; }
.twc-accordion__trigger:focus-visible { outline: none; box-shadow: var(--ring); }
.twc-accordion__label { flex: 1; }
.twc-accordion__chevron { flex: none; color: var(--color-text-subtle); transition: transform var(--duration-base) var(--ease-spring); }
.twc-accordion__chevron svg { width: 18px; height: 18px; display: block; }
.twc-accordion__trigger[data-open="true"] .twc-accordion__chevron { transform: rotate(180deg); color: var(--color-primary); }
.twc-accordion__panel { display: grid; grid-template-rows: 0fr; visibility: hidden;
  transition: grid-template-rows var(--duration-base) var(--ease-standard), visibility 0s var(--duration-base); }
.twc-accordion__panel[data-open="true"] { grid-template-rows: 1fr; visibility: visible;
  transition: grid-template-rows var(--duration-base) var(--ease-standard), visibility 0s; }
.twc-accordion__panel-inner { overflow: hidden; }
.twc-accordion__content { padding: 0 var(--space-4) var(--space-4); font-size: var(--text-sm); color: var(--color-text-muted); line-height: var(--leading-normal); }
`;

export function Accordion({
  items,
  multiple = false,
  defaultOpen = [],
  open: openProp,
  onOpenChange,
  headingLevel = 3,
  className = "",
  onKeyDown: onKeyDownProp,
  ...rest
}) {
  const __twcStyles = useScopedStyles("twc-accordion-styles", ACCORDION_CSS);
  const rootRef = React.useRef(null);

  const [internal, setInternal] = React.useState(() => new Set(defaultOpen));
  const open = openProp !== undefined ? new Set(openProp) : internal;
  const baseId = React.useId();

  function toggle(val) {
    const item = items.find((x) => x.value === val);
    if (item?.disabled) return;
    const next = new Set(open);
    if (next.has(val)) next.delete(val);
    else { if (!multiple) next.clear(); next.add(val); }
    if (openProp === undefined) setInternal(next);
    onOpenChange?.([...next]);
  }

  // Roving focus between the header buttons (WAI-ARIA APG). Real DOM focus — the
  // headers are already tab-order <button>s.
  function handleKeyDown(e) {
    onKeyDownProp?.(e);
    if (!(e.target instanceof HTMLElement) || !e.target.classList.contains("twc-accordion__trigger")) return;
    const triggers = Array.from(rootRef.current.querySelectorAll(".twc-accordion__trigger")).filter((b) => !b.disabled);
    const i = triggers.indexOf(e.target);
    if (i < 0) return;
    const len = triggers.length;
    let next;
    switch (e.key) {
      case "ArrowDown": next = (i + 1) % len; break;
      case "ArrowUp": next = (i - 1 + len) % len; break;
      case "Home": next = 0; break;
      case "End": next = len - 1; break;
      default: return;
    }
    e.preventDefault();
    triggers[next].focus();
  }

  return (
    <div ref={rootRef} className={`twc-accordion ${className}`} onKeyDown={handleKeyDown} {...rest}>
      {__twcStyles}
      {items.map((it, i) => {
        const isOpen = open.has(it.value);
        const triggerId = `${baseId}-trigger-${i}`;
        const panelId = `${baseId}-panel-${i}`;
        const lvl = Math.min(6, Math.max(1, it.headingLevel ?? headingLevel));
        const Heading = `h${lvl}`;
        return (
          <div className="twc-accordion__item" key={it.value}>
            <Heading className="twc-accordion__heading">
              <button type="button" id={triggerId} className="twc-accordion__trigger" data-open={isOpen || undefined} disabled={it.disabled || undefined} aria-disabled={it.disabled || undefined} data-disabled={it.disabled || undefined} aria-expanded={isOpen} aria-controls={panelId} onClick={() => toggle(it.value)}>
                {it.icon}
                <span className="twc-accordion__label">{it.label}</span>
                <span className="twc-accordion__chevron" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                </span>
              </button>
            </Heading>
            <div className="twc-accordion__panel" id={panelId} role="region" aria-labelledby={triggerId} data-open={isOpen || undefined}>
              <div className="twc-accordion__panel-inner">
                <div className="twc-accordion__content">{it.content}</div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
