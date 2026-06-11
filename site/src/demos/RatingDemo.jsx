import React, { useState } from "react";
import { Rating } from "twico-ui";

export default function RatingDemo() {
  const [r, setR] = useState(3);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        <Rating value={r} onChange={setR} showValue />
      </div>
      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        <Rating value={4} readOnly showValue />
      </div>
      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        <Rating defaultValue={3} size="lg" count={5} />
      </div>
    </div>
  );
}
