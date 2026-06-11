import React from "react";

const LEVEL_SIZE = { 1: "4xl", 2: "2xl", 3: "xl", 4: "lg", 5: "base", 6: "sm" };

/** Heading (h1–h6) with token typography. `level` sets the tag + default size. */
export function Heading({
  as,
  level = 2,
  size,
  align,
  className = "",
  style,
  children,
  ...rest
}) {
  const Tag = as || `h${level}`;
  const sz = size || LEVEL_SIZE[level] || "2xl";
  return (
    <Tag
      className={`twc-heading ${className}`.trim()}
      style={{
        margin: 0,
        fontFamily: "var(--font-sans)",
        fontWeight: "var(--font-bold)",
        color: "var(--color-text)",
        lineHeight: 1.2,
        letterSpacing: "-0.02em",
        fontSize: `var(--text-${sz})`,
        textAlign: align,
        ...style,
      }}
      {...rest}
    >
      {children}
    </Tag>
  );
}
