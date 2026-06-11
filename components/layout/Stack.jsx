import React from "react";

// Maps a numeric gap/space step to the spacing token; a string passes through.
function space(v) {
  if (v == null) return undefined;
  if (typeof v === "number") return `var(--space-${String(v).replace(".", "-")})`;
  return v;
}

// Block javascript:/data:/vbscript: URLs (incl. whitespace/control-char obfuscation
// that browsers strip) from reaching a DOM href. Consumer hrefs are a trust boundary.
function safeHref(url) {
  if (url == null) return undefined;
  const s = String(url).replace(/[\x00-\x20]+/g, "").toLowerCase();
  return s.startsWith("javascript:") || s.startsWith("data:") || s.startsWith("vbscript:") ? undefined : url;
}

/** Flex layout primitive — rows or columns with token-based gaps. */
export function Stack({
  as: Tag = "div",
  direction = "column",
  gap = 4,
  align,
  justify,
  wrap = false,
  inline = false,
  className = "",
  style,
  children,
  ...rest
}) {
  if (Tag === "a" && rest.href != null) rest.href = safeHref(rest.href);
  return (
    <Tag
      className={`twc-stack ${className}`.trim()}
      style={{
        display: inline ? "inline-flex" : "flex",
        flexDirection: direction,
        gap: space(gap),
        alignItems: align,
        justifyContent: justify,
        flexWrap: wrap ? "wrap" : undefined,
        minWidth: 0,
        ...style,
      }}
      {...rest}
    >
      {children}
    </Tag>
  );
}
