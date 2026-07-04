import React from "react";

const LEVEL_SIZE = { 1: "4xl", 2: "2xl", 3: "xl", 4: "lg", 5: "base", 6: "sm" };

// Block javascript:/data:/vbscript: URLs (incl. whitespace/control-char obfuscation
// that browsers strip) from reaching a DOM href. Consumer hrefs are a trust boundary.
function safeHref(url) {
  if (url == null) return undefined;
  const s = String(url).replace(/[\x00-\x20]+/g, "").toLowerCase();
  return s.startsWith("javascript:") || s.startsWith("data:") || s.startsWith("vbscript:") ? undefined : url;
}

/** Heading (h1–h6) with token typography. `level` sets the tag + default size. */
export function Heading({
  as,
  level = 2,
  size,
  display = false,
  align,
  truncate,
  lineClamp,
  className = "",
  style,
  children,
  ...rest
}) {
  const Tag = as || `h${level}`;
  const sz = size || (display ? "display" : LEVEL_SIZE[level]) || "2xl";
  if (Tag === "a" && rest.href != null) rest.href = safeHref(rest.href);
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
        ...(lineClamp != null
          ? { display: "-webkit-box", WebkitBoxOrient: "vertical", WebkitLineClamp: lineClamp, overflow: "hidden" }
          : truncate
            ? { overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", minWidth: 0 }
            : null),
        ...style,
      }}
      {...rest}
    >
      {children}
    </Tag>
  );
}
