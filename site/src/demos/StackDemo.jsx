import React from "react";
import { Stack, Button, Badge } from "twico-ui";

export default function StackDemo() {
  return (
    <Stack gap={4}>
      <Stack direction="row" gap={2} align="center" wrap>
        <Button>Save</Button>
        <Button variant="soft">Duplicate</Button>
        <Button variant="ghost">Cancel</Button>
        <Badge>row</Badge>
      </Stack>
      <Stack gap={2} style={{ width: 220, maxWidth: "100%" }}>
        <Button fullWidth>Top</Button>
        <Button fullWidth variant="soft">Middle</Button>
        <Button fullWidth variant="outline">Bottom</Button>
        <Badge>column</Badge>
      </Stack>
    </Stack>
  );
}
