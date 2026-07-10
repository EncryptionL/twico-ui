import React, { useState } from "react";
import { DateTimePicker } from "twico-ui";

export default function DateTimePickerDemo() {
  const [when, setWhen] = useState(null);
  return (
    <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
      <DateTimePicker
        label="Shift start"
        value={when}
        onChange={setWhen}
        minuteStep={15}
        hourCycle={12}
      />
    </div>
  );
}
