import React from "react";
import { useSx } from "../_sx.js";
import { useScopedStyles } from "../_styles.js";

// #543: the UA margin reset lives in a SCOPED STYLESHEET, not in the inline style object.
//
// An inline declaration beats every stylesheet rule whatever its specificity, so while this was
// `marginBottom: 0` inline it could not be overridden by anything - not by a consumer's own CSS,
// not by a className, and not by the library itself. FieldRow's fragment-cell lane (#531) is a
// `margin-block-end` on the cell's lane-less child, and it is the library itself that was being
// vetoed: a Text between two inputs in a range row sat one lane (24px) below its siblings' control
// boxes on the wrapping path, with the computed margin reading 0px instead of the calc() the rule
// asked for. Measured at 520px, 760px and at the default floor: 24px each time.
//
// As a rule at (0,1,0) it still beats base.css's own element reset in a tie and still loses to any
// rule that means to move it - FieldRow's is (0,3,0) - so the lane lands and a consumer's CSS works
// where it previously could not. Pre already did it this way; this is the in-house pattern, not a new one.
//
// ONLY THE MARGIN MOVES, and the rest is NOT all prop-derived - an earlier version of this comment
// said it was, which overstated the fix. font-size (size), color (tone), font-weight (weight),
// text-align (align) and the truncate/lineClamp block genuinely are prop values, which no shared
// stylesheet can express. But font-family and line-height below are CONSTANTS that stay inline, and
// they are as un-overridable by any stylesheet as the margin was - the same defect class. #543 fixed
// the one case where the library vetoed ITSELF (FieldRow's lane); it did not close the class.
// Widening it is a public-API decision rather than a cleanup, because moving a VISUAL constant
// changes what third-party CSS can do to every Text on a page. Tracked separately.
const TEXT_CSS = `
.twc-text { margin: 0; line-height: var(--leading-body, 1.6); }
`;

const TONE = {
  default: "--color-text",
  muted: "--color-text-muted",
  subtle: "--color-text-subtle",
  primary: "--color-primary",
  danger: "--color-danger",
  // New intents use the readable "-subtle-fg" (text-grade) tokens where the base hue
  // would be too light for text contrast (warning/info especially).
  success: "--color-success",
  warning: "--color-warning-subtle-fg",
  info: "--color-info-subtle-fg",
  neutral: "--color-text-muted",
  // Adopt the surrounding color (e.g. inside a solid Button/Badge/Alert or a link).
  inherit: "inherit",
};

// Block javascript:/data:/vbscript: URLs (incl. whitespace/control-char obfuscation
// that browsers strip) from reaching a DOM href. Consumer hrefs are a trust boundary.
function safeHref(url) {
  if (url == null) return undefined;
  const s = String(url).replace(/[\x00-\x20]+/g, "").toLowerCase();
  return s.startsWith("javascript:") || s.startsWith("data:") || s.startsWith("vbscript:") ? undefined : url;
}

/** Body text with token sizes and semantic color tones. Renders <p> by default. */
export const Text = /*#__PURE__*/ React.forwardRef(function Text({
  as: Tag = "p",
  size = "base",
  tone = "default",
  weight,
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
  const __twcStyles = useScopedStyles("twc-text-styles", TEXT_CSS);
  if (Tag === "a" && rest.href != null) rest.href = safeHref(rest.href);
  const toneToken = TONE[tone] || TONE.default;
  return (
    <Tag
      ref={ref}
      className={`twc-text ${className}`.trim()}
      data-twc-sx={sxAttr}
      style={{
        fontSize: `var(--text-${size})`,
        color: toneToken.startsWith("--") ? `var(${toneToken})` : toneToken,
        fontWeight: weight ? `var(--font-${weight})` : undefined,
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
