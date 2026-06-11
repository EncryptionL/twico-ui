import React, { useState } from "react";
import { Progress } from "twico-ui";

export default function ProgressDemo() {
  const [value, setValue] = useState(64);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16, width: 360, maxWidth: "100%" }}>
      <Progress value={value} showLabel />
      <input
        type="range"
        min={0}
        max={100}
        value={value}
        onChange={(e) => setValue(Number(e.target.value))}
      />
      <Progress value={90} tone="success" />
      <Progress value={45} tone="warning" size="lg" />
      <Progress indeterminate />
    </div>
  );
}
