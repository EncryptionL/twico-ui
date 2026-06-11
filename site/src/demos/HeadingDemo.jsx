import React from "react";
import { Stack, Heading } from "twico-ui";

export default function HeadingDemo() {
  return (
    <Stack gap={2}>
      <Heading level={1}>Heading level 1</Heading>
      <Heading level={2}>Heading level 2</Heading>
      <Heading level={3}>Heading level 3</Heading>
      <Heading level={4}>Heading level 4</Heading>
    </Stack>
  );
}
