import React from "react";
import { useSx } from "../_sx.js";
import { useScopedStyles } from "../_styles.js";

// #543: the UA margin reset lives in a SCOPED STYLESHEET, not in the inline style object.
//
// An inline declaration beats every stylesheet rule whatever its specificity, so while this was
// `marginBottom: 0` inline it could not be overridden by anything - not by a consumer's own CSS,
// not by a className, and not by the library itself. FieldRow's fragment-cell lane (#531) is a
// `margin-block-end` on the cell's lane-less child, and it is the library itself that was being
// vetoed: a Heading between two inputs in a range row sat one lane (24px) below its siblings' control
// boxes on the wrapping path, with the computed margin reading 0px instead of the calc() the rule
// asked for. Measured at 520px, 760px and at the default floor: 24px each time.
//
// As a rule at (0,1,0) it still beats base.css's own element reset in a tie and still loses to any
// rule that means to move it - FieldRow's is (0,3,0) - so the lane lands and a consumer's CSS works
// where it previously could not. Text and Pre do the same; this is the in-house pattern, not a new one.
//
// Everything else stays inline on purpose: those declarations carry PROP VALUES (size, tone,
// weight, align, truncate), and a value derived from a prop is not something a stylesheet can
// express. Only the constant reset moves.
const HEADING_CSS = `
.twc-heading { margin: 0; }
`;

const LEVEL_SIZE = { 1: "4xl", 2: "2xl", 3: "xl", 4: "lg", 5: "base", 6: "sm" };

// Block javascript:/data:/vbscript: URLs (incl. whitespace/control-char obfuscation
// that browsers strip) from reaching a DOM href. Consumer hrefs are a trust boundary.
function safeHref(url) {
  if (url == null) return undefined;
  const s = String(url).replace(/[\x00-\x20]+/g, "").toLowerCase();
  return s.startsWith("javascript:") || s.startsWith("data:") || s.startsWith("vbscript:") ? undefined : url;
}

/** Heading (h1–h6) with token typography. `level` sets the tag + default size. */
export const Heading = /*#__PURE__*/ React.forwardRef(function Heading({
  as,
  level = 2,
  size,
  display = false,
  align,
  truncate,
  lineClamp,
  sx,
  className = "",
  style,
  children,
  ...rest
}, ref) {
  const { flatStyle, styleNode, sxAttr } = useSx(sx);
  const __twcStyles = useScopedStyles("twc-heading-styles", HEADING_CSS);
  const Tag = as || `h${level}`;
  const sz = size || (display ? "display" : LEVEL_SIZE[level]) || "2xl";
  if (Tag === "a" && rest.href != null) rest.href = safeHref(rest.href);
  return (
    <Tag
      ref={ref}
      className={`twc-heading ${className}`.trim()}
      data-twc-sx={sxAttr}
      style={{
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
        ...flatStyle,
      }}
      {...rest}
    >
      {__twcStyles}
      {styleNode}
      {children}
    </Tag>
  );
});
