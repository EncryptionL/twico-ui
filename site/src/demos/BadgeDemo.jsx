import React from "react";
import { Badge } from "twico-ui";

export default function BadgeDemo() {
  return (
    <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
      <Badge tone="success" dot>Active</Badge>
      <Badge tone="warning" variant="solid">Pending</Badge>
      <Badge tone="neutral" variant="outline">Draft</Badge>
      <Badge tone="danger" variant="solid">Error</Badge>
      <Badge tone="info" size="lg">12 new</Badge>
      <Badge tone="primary">Default</Badge>
    </div>
  );
}
