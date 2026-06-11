import React from "react";

const SIZES = { sm: 640, md: 768, lg: 1024, xl: 1280, full: "100%" };

/** Centered, max-width content wrapper with responsive horizontal padding. */
export function Container({
  as: Tag = "div",
  size = "lg",
  padded = true,
  className = "",
  style,
  children,
  ...rest
}) {
  const max = SIZES[size] ?? size;
  return (
    <Tag
      className={`twc-container ${className}`.trim()}
      style={{
        width: "100%",
        maxWidth: typeof max === "number" ? `${max}px` : max,
        marginInline: "auto",
        paddingInline: padded ? "var(--space-5)" : undefined,
        ...style,
      }}
      {...rest}
    >
      {children}
    </Tag>
  );
}
