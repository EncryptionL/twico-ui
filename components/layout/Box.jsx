import React from "react";
import { useSx } from "../_sx.js";

function sp(v) {
  if (v == null) return undefined;
  return typeof v === "number" ? `var(--space-${String(v).replace(".", "-")})` : v;
}

const BG = {
  surface: "--color-surface",
  "surface-raised": "--color-surface-raised",
  "surface-sunken": "--color-surface-sunken",
  bg: "--color-bg",
};

// Token name -> var(token); bare custom property ("--x") -> var(--x); anything else
// is treated as a plain CSS background value and used as-is.
function bgValue(bg) {
  if (!bg) return undefined;
  if (BG[bg]) return `var(${BG[bg]})`;
  return String(bg).startsWith("--") ? `var(${bg})` : bg;
}

// Block javascript:/data:/vbscript: URLs (incl. whitespace/control-char obfuscation
// that browsers strip) from reaching a DOM href. Consumer hrefs are a trust boundary.
function safeHref(url) {
  if (url == null) return undefined;
  const s = String(url).replace(/[\x00-\x20]+/g, "").toLowerCase();
  return s.startsWith("javascript:") || s.startsWith("data:") || s.startsWith("vbscript:") ? undefined : url;
}

/** Generic, token-styled element — the building block for non-flex layout. */
export const Box = React.forwardRef(function Box({
  as: Tag = "div",
  p, px, py, pt, pr, pb, pl,
  m, mx, my, mt, mr, mb, ml,
  bg,
  border = false,
  radius,
  shadow,
  sx,
  className = "",
  style,
  children,
  ...rest
}, ref) {
  const { flatStyle, styleNode, sxAttr } = useSx(sx);
  // Resolve longhands from most-specific to least (pt > py > p). We never emit
  // the `padding`/`margin` shorthand alongside undefined longhands — React would
  // clear the shorthand and zero the value (e.g. p={4} would apply no padding).
  // Merge order: base -> user `style` -> `sx` flat declarations (sx wins, per MUI).
  const s = {
    paddingTop: sp(pt ?? py ?? p),
    paddingRight: sp(pr ?? px ?? p),
    paddingBottom: sp(pb ?? py ?? p),
    paddingLeft: sp(pl ?? px ?? p),
    marginTop: sp(mt ?? my ?? m),
    marginRight: sp(mr ?? mx ?? m),
    marginBottom: sp(mb ?? my ?? m),
    marginLeft: sp(ml ?? mx ?? m),
    background: bgValue(bg),
    border: border ? "var(--border-thin, 1px) solid var(--color-border)" : undefined,
    borderRadius: radius ? `var(--radius-${radius})` : undefined,
    boxShadow: shadow ? `var(--shadow-${shadow})` : undefined,
    ...style,
    ...flatStyle,
  };
  if (Tag === "a" && rest.href != null) rest.href = safeHref(rest.href);
  return (
    <Tag ref={ref} className={`twc-box ${className}`.trim()} style={s} data-twc-sx={sxAttr} {...rest}>
      {styleNode}
      {children}
    </Tag>
  );
});
Box.displayName = "Box";
