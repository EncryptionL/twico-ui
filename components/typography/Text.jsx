import React from "react";

const TONE = {
  default: "--color-text",
  muted: "--color-text-muted",
  subtle: "--color-text-subtle",
  primary: "--color-primary",
  danger: "--color-danger",
};

/** Body text with token sizes and semantic color tones. Renders <p> by default. */
export function Text({
  as: Tag = "p",
  size = "base",
  tone = "default",
  weight,
  align,
  className = "",
  style,
  children,
  ...rest
}) {
  return (
    <Tag
      className={`twc-text ${className}`.trim()}
      style={{
        margin: 0,
        fontFamily: "var(--font-sans)",
        lineHeight: 1.6,
        fontSize: `var(--text-${size})`,
        color: `var(${TONE[tone] || TONE.default})`,
        fontWeight: weight ? `var(--font-${weight})` : undefined,
        textAlign: align,
        ...style,
      }}
      {...rest}
    >
      {children}
    </Tag>
  );
}
