import React from "react";
import { Card, Button } from "twico-ui";

export default function CardDemo() {
  return (
    <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "flex-start" }}>
      <Card
        title="Monthly revenue"
        subtitle="June 2026"
        footer={<Button size="sm">View report</Button>}
      >
        Revenue grew 18% month over month.
      </Card>
      <Card variant="outline" interactive>
        Hover me — I lift.
      </Card>
      <Card variant="soft" padding="lg" title="Notes">
        A soft surface with large padding.
      </Card>
    </div>
  );
}
