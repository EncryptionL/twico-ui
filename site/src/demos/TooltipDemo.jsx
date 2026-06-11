import React from "react";
import { Tooltip, Button } from "twico-ui";

export default function TooltipDemo() {
  return (
    <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
      <Tooltip label="Copy to clipboard" placement="top">
        <Button variant="outline" size="sm">Copy</Button>
      </Tooltip>
      <Tooltip label="Shown on the right" placement="right" delay={200}>
        <Button variant="outline" size="sm">Hover me</Button>
      </Tooltip>
      <Tooltip label="Appears below" placement="bottom">
        <Button variant="outline" size="sm">Info</Button>
      </Tooltip>
    </div>
  );
}
