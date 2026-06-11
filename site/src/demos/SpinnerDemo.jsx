import React from "react";
import { Spinner } from "twico-ui";

export default function SpinnerDemo() {
  return (
    <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
      <Spinner size="sm" />
      <Spinner size="md" />
      <Spinner size="lg" />
      <Spinner size="xl" />
      <Spinner tone="neutral" />
      <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 16px", borderRadius: 8, background: "#2563eb" }}>
        <Spinner tone="white" size="sm" label="Saving" />
        <span style={{ color: "#fff" }}>Saving...</span>
      </div>
    </div>
  );
}
