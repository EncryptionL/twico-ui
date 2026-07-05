import React from "react";
import { RadarChart } from "twico-ui";

const skillData = [
  { label: "Speed", team: 80, rival: 65 },
  { label: "Power", team: 60, rival: 90 },
  { label: "Range", team: 70, rival: 55 },
  { label: "Defense", team: 85, rival: 60 },
  { label: "Control", team: 50, rival: 75 },
  { label: "Stamina", team: 78, rival: 68 },
];

export default function RadarChartDemo() {
  const [picked, setPicked] = React.useState(null);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8, maxWidth: 520 }}>
      <RadarChart
        series={["team", "rival"]}
        showLegend
        data={skillData}
        onDataClick={(p) => setPicked(p)}
        ariaLabel="Interactive radar chart comparing two teams"
      />
      <div style={{ fontSize: "var(--text-sm)", color: "var(--color-text-muted)" }}>
        {picked ? (
          <>
            Clicked{" "}
            <strong style={{ color: "var(--color-text)" }}>{String(picked.label)}</strong>{" "}
            · <strong style={{ color: "var(--color-text)" }}>{picked.series}</strong> ={" "}
            {picked.value}
          </>
        ) : (
          "Hover a vertex for details · click a dot to select"
        )}
      </div>
    </div>
  );
}
