import React, { useState } from "react";
import { ColorPicker } from "twico-ui";

export default function ColorPickerDemo() {
  const [color, setColor] = useState("#6366F1");
  const presets = ["#6366F1", "#14B8A6", "#F43F5E", "#F59E0B", "#0EA5E9"];
  return (
    <div style={{ display: "flex", gap: 24, flexWrap: "wrap", alignItems: "flex-start" }}>
      <ColorPicker
        label="Brand color"
        value={color}
        onChange={setColor}
        presets={presets}
      />
      <ColorPicker label="Accent (uncontrolled)" defaultValue="#14B8A6" />
    </div>
  );
}
