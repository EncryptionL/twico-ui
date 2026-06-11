import React, { useState } from "react";
import { Radio } from "twico-ui";

const plans = [
  { value: "free", label: "Free", description: "For personal projects" },
  { value: "pro", label: "Pro", description: "$12 / month" },
  { value: "team", label: "Team", description: "$30 / month" },
];

export default function RadioDemo() {
  const [plan, setPlan] = useState("free");
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {plans.map((p) => (
        <Radio
          key={p.value}
          name="plan"
          value={p.value}
          label={p.label}
          description={p.description}
          checked={plan === p.value}
          onChange={() => setPlan(p.value)}
        />
      ))}
    </div>
  );
}
