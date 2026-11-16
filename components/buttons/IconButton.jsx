import React from "react";
import { useScopedStyles } from "../_styles.js";

const ICONBTN_CSS = `
.twc-iconbtn {
  --_sz: var(--control-h-md);
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: var(--_sz);
  height: var(--_sz);
  padding: 0;
  border: var(--border-thin) solid transparent;
  border-radius: var(--radius-md);
  cursor: pointer;
  color: var(--color-text-muted);
  background: transparent;
  overflow: hidden;
  transition: background-color var(--duration-fast) var(--ease-standard),
              color var(--duration-fast) var(--ease-standard),
              border-color var(--duration-fast) var(--ease-standard),
              box-shadow var(--duration-fast) var(--ease-standard),
              transform var(--duration-fast) var(--ease-spring);
}
.twc-iconbtn[data-round="true"] { border-radius: var(--radius-full); }
/* xs: ~26px square — composed from space tokens (no global control-h-xs token). */
.twc-iconbtn[data-size="xs"] { --_sz: calc(var(--space-6) + var(--space-0-5)); }
.twc-iconbtn[data-size="sm"] { --_sz: var(--control-h-sm); }
.twc-iconbtn[data-size="lg"] { --_sz: var(--control-h-lg); }
.twc-iconbtn:focus-visible { outline: none; box-shadow: var(--ring); }
.twc-iconbtn:active:not(:disabled) { transform: scale(var(--press-scale)); }
.twc-iconbtn:disabled { opacity: 0.5; cursor: not-allowed; }
/* #342: disabled state for the anchor form (as="a") — :disabled doesn't apply to <a>. */
.twc-iconbtn[aria-disabled="true"] { opacity: 0.5; cursor: not-allowed; pointer-events: none; }
.twc-iconbtn svg { width: 1.25em; height: 1.25em; }

/* tone supplies the accent set; variant decides how it's applied — mirrors Button. Default tone
   primary; danger reuses its (active-less) hover for the pressed state. */
.twc-iconbtn { --_accent: var(--color-primary); --_accent-hover: var(--color-primary-hover);
  --_accent-fg: var(--color-primary-fg); --_accent-subtle: var(--color-primary-subtle); --_accent-subtle-fg: var(--color-primary-subtle-fg); }
.twc-iconbtn[data-tone="danger"] { --_accent: var(--color-danger); --_accent-hover: var(--color-danger-hover);
  --_accent-fg: var(--color-danger-fg); --_accent-subtle: var(--color-danger-subtle); --_accent-subtle-fg: var(--color-danger-subtle-fg); }
/* #504: the full Tone scale, not just primary|danger. A standalone affirmative action - a row-level
   confirm sitting next to a danger sibling, reading as "yes / no" - could not be green, so the colour
   that carried the distinction came out the same blue as every neutral action on the page.
   success/warning/info now have real -hover/-active tokens (added in tokens/colors.css on the same
   step rule as primary and danger: light goes darker, dark goes lighter), so hover always moves AWAY
   from the ink and contrast only improves. neutral has no accent tokens anywhere and is mapped the way
   Badge already maps it - --color-text on --color-surface solid, --color-surface-sunken soft - with its
   hover mixed from currentColor, since there is no --color-text-hover to point at. */
.twc-iconbtn[data-tone="success"] { --_accent: var(--color-success); --_accent-hover: var(--color-success-hover);
  --_accent-fg: var(--color-success-fg); --_accent-subtle: var(--color-success-subtle); --_accent-subtle-fg: var(--color-success-subtle-fg); }
.twc-iconbtn[data-tone="warning"] { --_accent: var(--color-warning); --_accent-hover: var(--color-warning-hover);
  --_accent-fg: var(--color-warning-fg); --_accent-subtle: var(--color-warning-subtle); --_accent-subtle-fg: var(--color-warning-subtle-fg); }
.twc-iconbtn[data-tone="info"] { --_accent: var(--color-info); --_accent-hover: var(--color-info-hover);
  --_accent-fg: var(--color-info-fg); --_accent-subtle: var(--color-info-subtle); --_accent-subtle-fg: var(--color-info-subtle-fg); }
.twc-iconbtn[data-tone="neutral"] { --_accent: var(--color-text); --_accent-hover: color-mix(in srgb, var(--color-text) 88%, var(--color-surface));
  --_accent-fg: var(--color-surface); --_accent-subtle: var(--color-surface-sunken); --_accent-subtle-fg: var(--color-text-muted); }
.twc-iconbtn[data-variant="solid"] { background: var(--_accent); color: var(--_accent-fg); }
.twc-iconbtn[data-variant="solid"]:hover:not(:disabled) { background: var(--_accent-hover); box-shadow: var(--shadow-brand); }
.twc-iconbtn[data-variant="solid"]:active:not(:disabled) { filter: brightness(0.92); }
.twc-iconbtn[data-variant="soft"] { background: var(--_accent-subtle); color: var(--_accent-subtle-fg); }
.twc-iconbtn[data-variant="soft"]:hover:not(:disabled) { background: var(--_accent-subtle); filter: brightness(0.97); }
.dark .twc-iconbtn[data-variant="soft"]:hover:not(:disabled) { filter: brightness(1.25); }
.twc-iconbtn[data-variant="outline"] { border-color: var(--color-border-strong); color: var(--color-text); }
.twc-iconbtn[data-variant="outline"]:hover:not(:disabled) { border-color: var(--_accent); color: var(--_accent); background: var(--color-surface-sunken); }
.twc-iconbtn[data-variant="ghost"]:hover:not(:disabled) { background: var(--color-surface-sunken); color: var(--_accent); }
/* #405: toggle "on" state (aria-pressed) — a soft tone fill + tone border, works over any variant. */
.twc-iconbtn[aria-pressed="true"] { background: var(--_accent-subtle); color: var(--_accent-subtle-fg); border-color: var(--_accent); }
/* #411: pressed fill can carry any status Tone. */
/* #522: the missing member of the Tone scale. Without this, pressedTone="primary" selected
   NOTHING, so a pressed <Button tone="danger" pressedTone="primary"> kept resolving its accent
   trio from .twc-iconbtn[data-tone="danger"] (0,2,0) and painted red - and ToggleGroup, which
   passes an item's tone straight through as pressedTone (ToggleGroup.jsx:96), lost the
   per-item meaning colour from #411 for exactly this one tone. 1 class + 2 attributes =
   (0,3,0), which outranks the (0,2,0) data-tone blocks just as the four rules below it do. */
.twc-iconbtn[aria-pressed="true"][data-pressed-tone="primary"] { --_accent: var(--color-primary); --_accent-subtle: var(--color-primary-subtle); --_accent-subtle-fg: var(--color-primary-subtle-fg); }
.twc-iconbtn[aria-pressed="true"][data-pressed-tone="success"] { --_accent: var(--color-success); --_accent-subtle: var(--color-success-subtle); --_accent-subtle-fg: var(--color-success-subtle-fg); }
.twc-iconbtn[aria-pressed="true"][data-pressed-tone="warning"] { --_accent: var(--color-warning); --_accent-subtle: var(--color-warning-subtle); --_accent-subtle-fg: var(--color-warning-subtle-fg); }
.twc-iconbtn[aria-pressed="true"][data-pressed-tone="info"] { --_accent: var(--color-info); --_accent-subtle: var(--color-info-subtle); --_accent-subtle-fg: var(--color-info-subtle-fg); }
.twc-iconbtn[aria-pressed="true"][data-pressed-tone="danger"] { --_accent: var(--color-danger); --_accent-subtle: var(--color-danger-subtle); --_accent-subtle-fg: var(--color-danger-subtle-fg); }
/* #430: color-surface-sunken steps toward the page background in dark mode, so a neutral pressed fill was
   invisible on a surface panel. Fill with color-border (steps away from the background in both themes) + a
   stronger color-text-subtle edge so the outline also carries the "on" state. Mirrors Button. */
.twc-iconbtn[aria-pressed="true"][data-pressed-tone="neutral"] { --_accent: var(--color-text-subtle); --_accent-subtle: var(--color-border); --_accent-subtle-fg: var(--color-text); }
/* #418: keep the pressed look on hover (matching-specificity, after the variant hover rules). */
.twc-iconbtn[aria-pressed="true"]:hover:not(:disabled) { background: var(--_accent-subtle); color: var(--_accent-subtle-fg); border-color: var(--_accent); filter: brightness(0.97); }
.dark .twc-iconbtn[aria-pressed="true"]:hover:not(:disabled) { filter: brightness(1.25); }
`;

// #342: block javascript:/data:/vbscript: URLs (incl. whitespace/control-char obfuscation browsers strip)
// from reaching a DOM href. Consumer hrefs are a trust boundary. Mirrors Button/nav components.
function safeHref(url) {
  if (url == null) return undefined;
  const s = String(url).replace(/[\x00-\x20]+/g, "").toLowerCase();
  return s.startsWith("javascript:") || s.startsWith("data:") || s.startsWith("vbscript:") ? undefined : url;
}

export const IconButton = /*#__PURE__*/ React.forwardRef(function IconButton({
  children,
  icon,
  variant = "ghost",
  tone = "primary",
  size = "md",
  round = false,
  disabled = false,
  focusableWhenDisabled = false,
  pressed,
  pressedTone,
  as = "button",
  href,
  className = "",
  "aria-label": ariaLabel,
  onClick,
  ...rest
}, ref) {
  const __twcStyles = useScopedStyles("twc-iconbtn-styles", ICONBTN_CSS);
  // #342: render as an anchor for an icon LINK (GitHub icon, external nav, …) — navigation should be a real
  // link, not a button. `target`/`rel` flow through `...rest`. An inert (disabled) anchor drops its href.
  const Tag = as;
  const inert = Tag === "a" && disabled;
  // #398: keep a disabled icon button focusable (aria-disabled, not native disabled) so a wrapping Tooltip's
  // reason is keyboard-reachable; block click + keyboard activation. The [aria-disabled] CSS already styles it.
  const softDisabled = disabled && focusableWhenDisabled && Tag === "button";

  return (
    <Tag
      ref={ref}
      className={`twc-iconbtn ${className}`}
      data-variant={variant}
      data-tone={tone}
      data-size={size}
      data-round={round || undefined}
      disabled={Tag === "button" ? disabled && !softDisabled : undefined}
      type={Tag === "button" ? "button" : undefined}
      href={Tag === "a" && !inert ? safeHref(href) : undefined}
      aria-disabled={inert || softDisabled || undefined}
      aria-pressed={pressed}
      /* #509: default to `tone`, which is what the prop has always been documented to do. It held for
         five of six: every other tone's pressed rule sets the same accent trio as its unpressed one,
         so the default was invisible. neutral is the exception and the reason this matters - #430
         deliberately gives it a DIFFERENT pressed fill (--color-border / --color-text-subtle, which
         step away from the page in dark mode) - so with the attribute absent a pressed neutral button
         fell through to its unpressed --color-text border: 17.85:1 against the surface, roughly three
         times its neighbours, reading as the loudest button in the row when it means "not yet".
         Only emitted for an actual toggle, so a plain button gains no attribute. */
      data-pressed-tone={pressedTone ?? (pressed !== undefined ? tone : undefined)}
      tabIndex={inert ? -1 : undefined}
      aria-label={ariaLabel}
      onClick={softDisabled ? (e) => e.preventDefault() : onClick}
      {...rest}
    >
      {__twcStyles}
      {icon || children}
    </Tag>
  );
});
