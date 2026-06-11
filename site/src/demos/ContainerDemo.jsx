import React from "react";
import { Container, Stack, Heading, Text } from "twico-ui";

export default function ContainerDemo() {
  return (
    <Container size="sm" style={{ border: "1px dashed var(--color-border)", borderRadius: "var(--radius-lg)", paddingBlock: "var(--space-4)" }}>
      <Stack gap={2}>
        <Heading level={3}>Centered, max-width content</Heading>
        <Text tone="muted">
          Container caps the width and centers it with responsive horizontal padding. Resize the
          preview — the content stays comfortably readable.
        </Text>
      </Stack>
    </Container>
  );
}
