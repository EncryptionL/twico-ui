import React from "react";

function space(v) {
  if (v == null) return undefined;
  if (typeof v === "number") return `var(--space-${String(v).replace(".", "-")})`;
  return v;
}
function len(v) {
  return typeof v === "number" ? `${v}px` : v;
}

// Block javascript:/data:/vbscript: URLs (incl. whitespace/control-char obfuscation
// that browsers strip) from reaching a DOM href. Consumer hrefs are a trust boundary.
function safeHref(url) {
  if (url == null) return undefined;
  const s = String(url).replace(/[\x00-\x20]+/g, "").toLowerCase();
  return s.startsWith("javascript:") || s.startsWith("data:") || s.startsWith("vbscript:") ? undefined : url;
}

/**
 * CSS grid primitive. Pass `minChildWidth` for a responsive auto-fill grid, or
 * `columns` for a fixed column count.
 */
export function Grid({
  as: Tag = "div",
  columns,
  minChildWidth,
  gap = 4,
  align,
  justify,
  className = "",
  style,
  children,
  ...rest
}) {
  const templateColumns = minChildWidth
    ? `repeat(auto-fill, minmax(min(${len(minChildWidth)}, 100%), 1fr))`
    : `repeat(${columns || 1}, minmax(0, 1fr))`;
  if (Tag === "a" && rest.href != null) rest.href = safeHref(rest.href);
  return (
    <Tag
      className={`twc-grid ${className}`.trim()}
      style={{
        display: "grid",
        gridTemplateColumns: templateColumns,
        gap: space(gap),
        alignItems: align,
        justifyItems: justify,
        ...style,
      }}
      {...rest}
    >
      {children}
    </Tag>
  );
}
