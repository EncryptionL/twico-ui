import React, { useState } from "react";
import { TimePicker } from "twico-ui";

export default function TimePickerDemo() {
  const [time, setTime] = useState(null);
  return (
    <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
      <TimePicker
        label="Start time"
        value={time}
        onChange={setTime}
        placeholder="Pick a time"
        minuteStep={15}
        clearable
      />
    </div>
  );
}
