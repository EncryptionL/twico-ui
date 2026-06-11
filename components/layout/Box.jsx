import React from "react";

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

/** Generic, token-styled element — the building block for non-flex layout. */
export function Box({
  as: Tag = "div",
  p, px, py, pt, pr, pb, pl,
  m, mx, my, mt, mr, mb, ml,
  bg,
  border = false,
  radius,
  shadow,
  className = "",
  style,
  children,
  ...rest
}) {
  // Resolve longhands from most-specific to least (pt > py > p). We never emit
  // the `padding`/`margin` shorthand alongside undefined longhands — React would
  // clear the shorthand and zero the value (e.g. p={4} would apply no padding).
  const s = {
    paddingTop: sp(pt ?? py ?? p),
    paddingRight: sp(pr ?? px ?? p),
    paddingBottom: sp(pb ?? py ?? p),
    paddingLeft: sp(pl ?? px ?? p),
    marginTop: sp(mt ?? my ?? m),
    marginRight: sp(mr ?? mx ?? m),
    marginBottom: sp(mb ?? my ?? m),
    marginLeft: sp(ml ?? mx ?? m),
    background: bg ? `var(${BG[bg] || bg})` : undefined,
    border: border ? "var(--border-thin, 1px) solid var(--color-border)" : undefined,
    borderRadius: radius ? `var(--radius-${radius})` : undefined,
    boxShadow: shadow ? `var(--shadow-${shadow})` : undefined,
    ...style,
  };
  return (
    <Tag className={`twc-box ${className}`.trim()} style={s} {...rest}>
      {children}
    </Tag>
  );
}
