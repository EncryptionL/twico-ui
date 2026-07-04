import React from "react";
import { Treemap } from "twico-ui";

const spendData = [
  { label: "Compute", value: 4200 },
  { label: "Storage", value: 2600 },
  { label: "Network", value: 1800 },
  { label: "Database", value: 1500 },
  { label: "Other", value: 700 },
];

export default function TreemapDemo() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <div style={{ maxWidth: 520 }}>
        <Treemap
          data={spendData}
          ariaLabel="Cloud spend by service"
          valueFormat={(v) => `$${v.toLocaleString()}`}
        />
      </div>
    </div>
  );
}
