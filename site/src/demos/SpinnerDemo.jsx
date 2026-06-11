import React from "react";
import { Spinner, Button } from "twico-ui";

export default function SpinnerDemo() {
  return (
    <div style={{ display: "flex", gap: 16, flexWrap: "wrap", alignItems: "center" }}>
      <Spinner size="sm" />
      <Spinner size="md" />
      <Spinner size="lg" />
      <Spinner tone="primary" size="lg" />
      {/* Inside a button the spinner inherits the button's text color — visible by default. */}
      <Button leftIcon={<Spinner size="sm" />}>Saving…</Button>
      <Button variant="soft" leftIcon={<Spinner size="sm" />}>Loading</Button>
    </div>
  );
}
