import React, { useState } from "react";
import { Slider } from "twico-ui";

export default function SliderDemo() {
  const [vol, setVol] = useState(40);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24, width: 360, maxWidth: "100%" }}>
      <Slider label="Volume" value={vol} onChange={setVol} />
      <Slider
        label="Price"
        min={0}
        max={1000}
        step={50}
        showTicks
        defaultValue={250}
        formatValue={(v) => `$${v}`}
      />
    </div>
  );
}
