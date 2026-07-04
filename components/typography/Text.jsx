import React from "react";

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
export function Text({
  as: Tag = "p",
  size = "base",
  tone = "default",
  weight,
  align,
  truncate,
  lineClamp,
  className = "",
  style,
  children,
  ...rest
}) {
  if (Tag === "a" && rest.href != null) rest.href = safeHref(rest.href);
  const toneToken = TONE[tone] || TONE.default;
  return (
    <Tag
      className={`twc-text ${className}`.trim()}
      style={{
        margin: 0,
        fontFamily: "var(--font-sans)",
        lineHeight: 1.6,
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
      }}
      {...rest}
    >
      {children}
    </Tag>
  );
}
