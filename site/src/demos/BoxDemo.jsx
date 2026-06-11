import React from "react";
import { Box, Stack, Text } from "twico-ui";

export default function BoxDemo() {
  return (
    <Stack direction="row" gap={3} wrap>
      <Box p={4} bg="surface" border radius="lg">
        <Text>Surface + border</Text>
      </Box>
      <Box p={4} bg="surface-sunken" radius="lg">
        <Text>Sunken surface</Text>
      </Box>
      <Box p={4} bg="surface" border radius="lg" shadow="md">
        <Text>With shadow</Text>
      </Box>
    </Stack>
  );
}
