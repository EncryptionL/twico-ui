import React from "react";
import { useScopedStyles } from "../_styles.js";
import { useSx } from "../_sx.js";

function space(v) {
  if (v == null) return undefined;
  if (typeof v === "number") return `var(--space-${String(v).replace(".", "-")})`;
  return v;
}
function len(v) {
  return typeof v === "number" ? `${v}px` : v;
}

// Breakpoints match Container's SIZES.
const BP = { sm: 640, md: 768, lg: 1024, xl: 1280 };

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
export const Grid = React.forwardRef(function Grid({
  as: Tag = "div",
  columns,
  minChildWidth,
  gap = 4,
  rowGap,
  columnGap,
  align,
  justify,
  justifyItems,
  alignContent,
  justifyContent,
  sx,
  className = "",
  style,
  children,
  ...rest
}, ref) {
  const { flatStyle, styleNode, sxAttr } = useSx(sx);
  const responsive = columns != null && typeof columns === "object";
  const uid = React.useId();
  const gridId = responsive ? `g${uid.replace(/[^a-zA-Z0-9]/g, "")}` : null;

  // Responsive columns: CSS-only (no useMediaQuery — SSR-safe, no hydration mismatch).
  // Emit scoped rules that set --twc-grid-cols at each breakpoint.
  let css = "";
  if (responsive) {
    const base = columns.base ?? 1;
    const sel = `[data-twc-grid-id="${gridId}"]`;
    css = `${sel} { --twc-grid-cols: ${base}; }`;
    for (const bp of ["sm", "md", "lg", "xl"]) {
      if (columns[bp] != null) css += `\n@media (min-width: ${BP[bp]}px) { ${sel} { --twc-grid-cols: ${columns[bp]}; } }`;
    }
  }
  const __twcStyles = useScopedStyles(gridId ? `twc-grid-${gridId}` : "twc-grid", css);

  const templateColumns = minChildWidth
    ? `repeat(auto-fill, minmax(min(${len(minChildWidth)}, 100%), 1fr))`
    : responsive
      ? `repeat(var(--twc-grid-cols, ${columns.base ?? 1}), minmax(0, 1fr))`
      : `repeat(${columns || 1}, minmax(0, 1fr))`;
  if (Tag === "a" && rest.href != null) rest.href = safeHref(rest.href);
  return (
    <Tag
      ref={ref}
      className={`twc-grid ${className}`.trim()}
      data-twc-grid-id={gridId || undefined}
      data-twc-sx={sxAttr}
      style={{
        display: "grid",
        gridTemplateColumns: templateColumns,
        rowGap: space(rowGap ?? gap),
        columnGap: space(columnGap ?? gap),
        alignItems: align,
        // #216: `justifyItems` is the explicit, correctly-named prop; `justify` remains a
        // backward-compatible alias for it (note: on Grid `justify` = justify-**items**, unlike
        // Stack.justify = justify-**content**). The explicit prop wins when both are set.
        justifyItems: justifyItems ?? justify,
        alignContent,
        justifyContent,
        ...style,
        ...flatStyle,
      }}
      {...rest}
    >
      {responsive ? __twcStyles : null}
      {styleNode}
      {children}
    </Tag>
  );
});
Grid.displayName = "Grid";
