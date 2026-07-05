import React from "react";
import { Sparkline } from "twico-ui";

// A few more points so clicking individual marks is meaningful.
const revenue = [
  { value: 3, label: "Jan" },
  { value: 5, label: "Feb" },
  { value: 4, label: "Mar" },
  { value: 8, label: "Apr" },
  { value: 6, label: "May" },
  { value: 9, label: "Jun" },
  { value: 7, label: "Jul" },
  { value: 12, label: "Aug" },
  { value: 10, label: "Sep" },
  { value: 14, label: "Oct" },
];

export default function SparklineDemo() {
  const [picked, setPicked] = React.useState(null);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 8, maxWidth: 520 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: 14, color: "var(--color-fg-muted)" }}>
            Revenue
          </span>
          <Sparkline
            data={revenue}
            width={200}
            height={44}
            showDots
            onDataClick={(p) => setPicked(p)}
          />
          <strong style={{ fontSize: 14 }}>$14.2k</strong>
        </div>
        <div style={{ fontSize: "var(--text-sm)", color: "var(--color-text-muted)" }}>
          {picked ? (
            <>
              Clicked{" "}
              <strong style={{ color: "var(--color-text)" }}>{String(picked.label)}</strong>{" "}
              = {picked.value}
            </>
          ) : (
            "Hover a point for details · click to select"
          )}
        </div>
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
