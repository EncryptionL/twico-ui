import React from "react";
import { ExternalLinkIcon } from "twico-ui/icons";

// An anchor that opens in a new browser tab, with a trailing "open in new tab" icon so the
// affordance is visible at a glance, plus visually-hidden text for assistive tech. Inherits
// the surrounding link color; pass `style` to match the call site and `iconSize` to tune the
// glyph. (Buttons that open a new tab use `rightIcon={<ExternalLinkIcon/>}` directly instead.)
const srOnly = {
  position: "absolute", width: 1, height: 1, padding: 0, margin: -1,
  overflow: "hidden", clip: "rect(0,0,0,0)", whiteSpace: "nowrap", border: 0,
};

export default function ExternalLink({ href, children, style, iconSize = 13, ...rest }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" style={style} {...rest}>
      {children}
      <ExternalLinkIcon
        size={iconSize}
        aria-hidden="true"
        style={{ display: "inline-block", verticalAlign: "-0.12em", marginInlineStart: 3, flex: "none" }}
      />
      <span style={srOnly}> (opens in new tab)</span>
    </a>
  );
}
