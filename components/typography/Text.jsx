import React from "react";

const TONE = {
  default: "--color-text",
  muted: "--color-text-muted",
  subtle: "--color-text-subtle",
  primary: "--color-primary",
  danger: "--color-danger",
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
  className = "",
  style,
  children,
  ...rest
}) {
  if (Tag === "a" && rest.href != null) rest.href = safeHref(rest.href);
  return (
    <Tag
      className={`twc-text ${className}`.trim()}
      style={{
        margin: 0,
        fontFamily: "var(--font-sans)",
        lineHeight: 1.6,
        fontSize: `var(--text-${size})`,
        color: `var(${TONE[tone] || TONE.default})`,
        fontWeight: weight ? `var(--font-${weight})` : undefined,
        textAlign: align,
        ...style,
      }}
      {...rest}
    >
      {children}
    </Tag>
  );
}
