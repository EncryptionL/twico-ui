// Compile-only fixture for #53 — the `sx` prop on the primitives + Card.
import * as React from "react";
import { Box, Stack, Text, Card } from "../../src/index";
import type { Sx } from "../../src/index";

const styles: Sx = {
  padding: 16,
  color: "var(--color-text)",
  "&:hover": { color: "var(--color-primary)" },
  "@media (min-width: 600px)": { display: "none" },
};

export function sxFixture() {
  return (
    <>
      <Box sx={{ p: 4, "&:focus-visible": { outline: "2px solid" } }} />
      <Stack sx={styles} gap={2} />
      <Text sx={{ fontWeight: 600, "&::first-line": { textTransform: "uppercase" } }} />
      <Card sx={{ maxWidth: 320, "&:hover": { boxShadow: "var(--shadow-lg)" } }}>body</Card>
      {/* @ts-expect-error — sx must be an object, not a string */}
      <Box sx="color: red" />
    </>
  );
}
