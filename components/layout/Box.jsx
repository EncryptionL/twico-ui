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
  const s = {
    padding: sp(p),
    paddingTop: sp(pt ?? py),
    paddingBottom: sp(pb ?? py),
    paddingLeft: sp(pl ?? px),
    paddingRight: sp(pr ?? px),
    margin: sp(m),
    marginTop: sp(mt ?? my),
    marginBottom: sp(mb ?? my),
    marginLeft: sp(ml ?? mx),
    marginRight: sp(mr ?? mx),
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
