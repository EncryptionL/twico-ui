import React from "react";
import { Stack, Text, Code } from "twico-ui";

export default function CodeDemo() {
  return (
    <Stack gap={2}>
      <Text>
        Install with <Code>npm install twico-ui</Code> and import{" "}
        <Code>{'{ Button }'}</Code> from <Code>twico-ui</Code>.
      </Text>
      <Text tone="muted">
        Inline <Code>Code</Code> sits naturally inside body <Code>Text</Code>.
      </Text>
    </Stack>
  );
}
