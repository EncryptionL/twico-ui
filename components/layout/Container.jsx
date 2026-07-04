import React from "react";

const SIZES = { sm: 640, md: 768, lg: 1024, xl: 1280, full: "100%" };

// Block javascript:/data:/vbscript: URLs (incl. whitespace/control-char obfuscation
// that browsers strip) from reaching a DOM href. Consumer hrefs are a trust boundary.
function safeHref(url) {
  if (url == null) return undefined;
  const s = String(url).replace(/[\x00-\x20]+/g, "").toLowerCase();
  return s.startsWith("javascript:") || s.startsWith("data:") || s.startsWith("vbscript:") ? undefined : url;
}

/** Centered, max-width content wrapper with responsive horizontal padding. */
export const Container = React.forwardRef(function Container({
  as: Tag = "div",
  size = "lg",
  padded = true,
  className = "",
  style,
  children,
  ...rest
}, ref) {
  const max = SIZES[size] ?? size;
  if (Tag === "a" && rest.href != null) rest.href = safeHref(rest.href);
  return (
    <Tag
      ref={ref}
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
});
Container.displayName = "Container";
