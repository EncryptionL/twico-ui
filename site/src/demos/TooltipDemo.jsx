import React from "react";
import { Tooltip } from "twico-ui";

export default function TooltipDemo() {
  return (
    <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
      <Tooltip label="Copy to clipboard" placement="top">
        <button aria-label="Copy">Copy</button>
      </Tooltip>
      <Tooltip label="Shown on the right" placement="right" delay={200}>
        <button>Hover me</button>
      </Tooltip>
      <Tooltip label="Appears below" placement="bottom">
        <button>Info</button>
      </Tooltip>
    </div>
  );
}
