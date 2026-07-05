import React from "react";
import { Sparkline } from "twico-ui";

const revenue = [3, 5, 4, 8, 6, 9, 7, 12, 10, 14];

export default function SparklineDemo() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <span style={{ fontSize: 14, color: "var(--color-fg-muted)" }}>
          Revenue
        </span>
        <Sparkline data={revenue} showDots />
        <strong style={{ fontSize: 14 }}>$14.2k</strong>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <span style={{ fontSize: 14, color: "var(--color-fg-muted)" }}>
          Signups
        </span>
        <Sparkline
          area
          color="var(--emerald-500)"
          data={[
            { value: 120, label: "Jan" },
            { value: 180, label: "Feb" },
            { value: 140, label: "Mar" },
            { value: 220, label: "Apr" },
            { value: 260, label: "May" },
          ]}
        />
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <span style={{ fontSize: 14, color: "var(--color-fg-muted)" }}>
          Sessions
        </span>
        <Sparkline type="bar" height={28} data={[4, 6, 2, 8, 5, 7, 3, 9]} />
      </div>
    </div>
  );
}
