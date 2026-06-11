import React, { useState } from "react";
import { Alert } from "twico-ui";

export default function AlertDemo() {
  const [showSaved, setShowSaved] = useState(true);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {showSaved && (
        <Alert tone="success" title="Saved" onClose={() => setShowSaved(false)}>
          Your changes are live.
        </Alert>
      )}
      <Alert tone="info" title="Heads up">
        A new version is available.
      </Alert>
      <Alert tone="warning">
        Your trial ends in 3 days.
      </Alert>
      <Alert tone="danger" title="Payment failed">
        We could not process your card.
      </Alert>
    </div>
  );
}
