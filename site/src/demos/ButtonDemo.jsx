import React, { useState } from "react";
import { Button } from "twico-ui";

export default function ButtonDemo() {
  const [count, setCount] = useState(0);
  return (
    <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
      <Button variant="solid" onClick={() => setCount((c) => c + 1)}>
        Clicked {count}
      </Button>
      <Button variant="soft" size="sm">Add item</Button>
      <Button variant="outline">Cancel</Button>
      <Button variant="ghost">Skip</Button>
      <Button variant="danger" loading>Deleting…</Button>
    </div>
  );
}
