import React from "react";
import { useScopedStyles } from "../_styles.js";
import { Button } from "./Button.jsx";

// #405: a set of toggle buttons (aria-pressed) — a tool/mode switch, a segmented control, a formatting bar.
// It composes Button (reusing its variant/tone CSS, so it adds almost no bytes) and, per WAI-ARIA, is a
// GROUP of toggle buttons — NOT a radiogroup: arrow keys (opt-in) move focus only; Space/Enter/click toggle.
const TOGGLEGROUP_CSS = `
.twc-togglegroup { display: inline-flex; gap: var(--space-1); }
.twc-togglegroup[data-orientation="vertical"] { flex-direction: column; align-items: stretch; }
`;

export function ToggleGroup({
  items = [],
  type = "single",
  value,
  defaultValue,
  onValueChange,
  size = "md",
  tone = "primary",
  variant = "outline",
  roving = false,
  orientation = "horizontal",
  disabled = false,
  className = "",
  "aria-label": ariaLabel,
  ...rest
}) {
  const __twcStyles = useScopedStyles("twc-togglegroup-styles", TOGGLEGROUP_CSS);
  const groupRef = React.useRef(null);
  const multiple = type === "multiple";
  // #405 (review): the roving tab stop FOLLOWS focus (WAI-ARIA), so tabbing out and back returns to the
  // last-focused toggle — not always the selected/first one.
  const [focusedIdx, setFocusedIdx] = React.useState(null);

  // Hand-rolled controlled/uncontrolled (no hooks-barrel import), passing the VALUE not the event.
  const [internal, setInternal] = React.useState(defaultValue !== undefined ? defaultValue : (multiple ? [] : null));
  const current = value !== undefined ? value : internal;
  const isSelected = (v) => (multiple ? (Array.isArray(current) && current.includes(v)) : current === v);
  const commit = (next) => { if (value === undefined) setInternal(next); onValueChange?.(next); };
  const toggle = (v) => {
    if (multiple) {
      const cur = Array.isArray(current) ? current : [];
      commit(cur.includes(v) ? cur.filter((x) => x !== v) : [...cur, v]);
    } else {
      commit(current === v ? null : v); // clicking the active value deselects (MUI exclusive ToggleButtonGroup)
    }
  };

  // Roving arrow-key focus (opt-in). Arrows MOVE focus only; activation stays on Space/Enter/click.
  const firstFocusIndex = () => {
    const sel = items.findIndex((it) => !it.disabled && isSelected(it.value));
    return sel >= 0 ? sel : items.findIndex((it) => !it.disabled);
  };
  function onKeyDown(e) {
    const vertical = orientation === "vertical";
    const prevKey = vertical ? "ArrowUp" : "ArrowLeft";
    const nextKey = vertical ? "ArrowDown" : "ArrowRight";
    if (![prevKey, nextKey, "Home", "End"].includes(e.key)) return;
    const n = items.length;
    if (!n || items.every((it) => it.disabled) || disabled) return;
    e.preventDefault();
    const btns = groupRef.current ? groupRef.current.querySelectorAll("button") : null;
    const activeIdx = btns ? Array.from(btns).findIndex((b) => b === document.activeElement) : -1;
    let i = activeIdx < 0 ? firstFocusIndex() : activeIdx;
    if (e.key === "Home") i = items.findIndex((it) => !it.disabled);
    else if (e.key === "End") { for (let k = n - 1; k >= 0; k--) { if (!items[k].disabled) { i = k; break; } } }
    else { const dir = e.key === nextKey ? 1 : -1; let guard = 0; do { i = (i + dir + n) % n; } while (items[i] && items[i].disabled && ++guard <= n); }
    if (btns && items[i] && !items[i].disabled && btns[i]) { btns[i].focus(); setFocusedIdx(i); }
  }

  // The roving anchor: the last-focused enabled index, else the selected/first-enabled one.
  const rovingIdx = roving
    ? (focusedIdx != null && items[focusedIdx] && !items[focusedIdx].disabled ? focusedIdx : firstFocusIndex())
    : -1;
  return (
    <div
      ref={groupRef}
      className={`twc-togglegroup ${className}`.trim()}
      role="group"
      aria-label={ariaLabel}
      data-orientation={orientation === "vertical" ? "vertical" : undefined}
      aria-orientation={roving && orientation === "vertical" ? "vertical" : undefined}
      onKeyDown={roving ? onKeyDown : undefined}
      {...rest}
    >
      {__twcStyles}
      {items.map((it, i) => (
        <Button
          key={it.value}
          variant={variant}
          tone={tone}
          size={size}
          disabled={disabled || it.disabled}
          pressed={isSelected(it.value)}
          leftIcon={it.icon}
          aria-label={it["aria-label"]}
          tabIndex={roving ? (i === rovingIdx ? 0 : -1) : undefined}
          onFocus={roving ? () => setFocusedIdx(i) : undefined}
          onClick={() => toggle(it.value)}
        >
          {it.label}
        </Button>
      ))}
    </div>
  );
}
