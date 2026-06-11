import React, { useState } from "react";
import { Stepper } from "twico-ui";

export default function StepperDemo() {
  const [active, setActive] = useState(1);
  const steps = [
    { title: "Account", description: "Your details" },
    { title: "Payment", description: "Billing info" },
    { title: "Confirm", description: "Review order" },
  ];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <Stepper active={active} clickable onStepClick={setActive} steps={steps} />
      <Stepper orientation="vertical" active={active} clickable onStepClick={setActive} steps={steps} />
    </div>
  );
}
