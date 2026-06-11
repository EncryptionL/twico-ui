import React from "react";
import { Stat } from "twico-ui";

export default function StatDemo() {
  return (
    <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
      <Stat
        label="Revenue"
        value="$48,200"
        delta="+12.5%"
        helpText="vs last month"
      />
      <Stat
        label="Churn"
        value="2.1%"
        delta="-0.4%"
        deltaDirection="up"
        helpText="improved"
      />
      <Stat label="Active users" value="1,284" delta="0%" deltaDirection="flat" />
    </div>
  );
}
