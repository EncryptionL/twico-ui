import React from "react";
import { EmptyState, Button } from "twico-ui";

export default function EmptyStateDemo() {
  return (
    <div style={{ display: "flex", gap: 24, flexWrap: "wrap", alignItems: "stretch" }}>
      <EmptyState
        icon={<span style={{ fontSize: 28 }}>📭</span>}
        title="No messages yet"
        description="When someone sends you a message, it'll show up here."
        actions={<Button>Compose</Button>}
      />
      <EmptyState
        bordered
        icon={<span style={{ fontSize: 28 }}>📁</span>}
        title="Drop files here"
        description="Drag and drop files, or browse to upload."
        actions={<Button variant="outline">Browse</Button>}
      />
    </div>
  );
}
