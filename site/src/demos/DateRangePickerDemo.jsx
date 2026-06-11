import React, { useState } from "react";
import { DateRangePicker } from "twico-ui";

export default function DateRangePickerDemo() {
  const [range, setRange] = useState({ start: null, end: null });
  return (
    <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
      <DateRangePicker
        label="Reporting period"
        value={range}
        onChange={setRange}
        placeholder="Pick a range"
        weekStartsOn={1}
      />
    </div>
  );
}
