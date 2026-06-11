import React, { useState } from "react";
import { DatePicker } from "twico-ui";

export default function DatePickerDemo() {
  const [date, setDate] = useState(null);
  return (
    <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
      <DatePicker
        label="Start date"
        value={date}
        onChange={setDate}
        placeholder="Pick a day"
        min={new Date()}
        weekStartsOn={1}
        clearable
      />
    </div>
  );
}
