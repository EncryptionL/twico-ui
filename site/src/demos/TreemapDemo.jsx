import React from "react";
import { Treemap } from "twico-ui";

const spendData = [
  { label: "Compute", value: 4200 },
  { label: "Storage", value: 2600 },
  { label: "Network", value: 1800 },
  { label: "Database", value: 1500 },
  { label: "Analytics", value: 1200 },
  { label: "Other", value: 700 },
];

export default function TreemapDemo() {
  const [picked, setPicked] = React.useState(null);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <div style={{ maxWidth: 520 }}>
        <Treemap
          data={spendData}
          ariaLabel="Cloud spend by service"
          valueFormat={(v) => `$${v.toLocaleString()}`}
          onDataClick={(p) => setPicked(p)}
        />
      </div>
      <div style={{ fontSize: "var(--text-sm)", color: "var(--color-text-muted)" }}>
        {picked
          ? (
              <>
                Clicked <strong style={{ color: "var(--color-text)" }}>{String(picked.label)}</strong>
                {" = "}${picked.value.toLocaleString()} · {(picked.share * 100).toFixed(1)}% of spend
              </>
            )
          : "Hover a tile for details · click to select"}
      </div>
    </div>
  );
}
