import React, { useState } from "react";
import { Select } from "twico-ui";

export default function SelectDemo() {
  const [value, setValue] = useState(null);
  const options = [
    { group: "Design", options: [
      { value: "ada", label: "Ada Park", description: "Product designer" },
      { value: "sam", label: "Sam Lee", description: "Brand designer" },
    ]},
    { group: "Engineering", options: [
      { value: "jo", label: "Jo Kim", description: "Frontend" },
      { value: "ravi", label: "Ravi Shah", description: "Backend" },
    ]},
  ];
  return (
    <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center", maxWidth: 320 }}>
      <Select
        label="Assignee"
        placeholder="Pick a teammate"
        hint="Choose who owns this task"
        value={value}
        onChange={setValue}
        options={options}
      />
    </div>
  );
}
