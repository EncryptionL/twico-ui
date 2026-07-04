import React from "react";
import { useSx } from "../_sx.js";

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
export const Stack = React.forwardRef(function Stack({
  as: Tag = "div",
  direction = "column",
  gap = 4,
  align,
  justify,
  wrap = false,
  inline = false,
  p, px, py, pt, pr, pb, pl,
  divider,
  sx,
  className = "",
  style,
  children,
  ...rest
}, ref) {
  const { flatStyle, styleNode, sxAttr } = useSx(sx);
  if (Tag === "a" && rest.href != null) rest.href = safeHref(rest.href);
  // Interleave `divider` between children (never before the first or after the last).
  const kids = divider != null
    ? React.Children.toArray(children).flatMap((child, i, arr) =>
        i < arr.length - 1 ? [child, <React.Fragment key={`twc-stack-div-${i}`}>{divider}</React.Fragment>] : [child])
    : children;
  return (
    <Tag
      ref={ref}
      className={`twc-stack ${className}`.trim()}
      data-twc-sx={sxAttr}
      style={{
        display: inline ? "inline-flex" : "flex",
        flexDirection: direction,
        gap: space(gap),
        alignItems: align,
        justifyContent: justify,
        flexWrap: wrap ? "wrap" : undefined,
        paddingTop: space(pt ?? py ?? p),
        paddingRight: space(pr ?? px ?? p),
        paddingBottom: space(pb ?? py ?? p),
        paddingLeft: space(pl ?? px ?? p),
        minWidth: 0,
        ...style,
        ...flatStyle,
      }}
      {...rest}
    >
      {styleNode}
      {kids}
    </Tag>
  );
});
Stack.displayName = "Stack";
