import React from "react";
import { Stack, Text } from "twico-ui";

export default function TextDemo() {
  return (
    <Stack gap={2}>
      <Text size="lg">Large lead text for intros.</Text>
      <Text>Default body text — the everyday paragraph.</Text>
      <Text size="sm" tone="muted">Small muted text for captions and hints.</Text>
      <Text size="sm" tone="subtle">Subtle text, even quieter.</Text>
      <Text weight="semibold" tone="primary">Primary, semibold emphasis.</Text>
      <Text tone="danger">Danger tone for errors.</Text>
    </Stack>
  );
}
