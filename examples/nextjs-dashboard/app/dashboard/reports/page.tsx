import { Heading, Text, Stack, Box } from "twico-ui";
import { requirePermission } from "@/lib/auth";
import { ReportsView } from "@/components/ReportsView";

export default async function ReportsPage() {
  await requirePermission("reports:view");

  return (
    <Stack direction="column" gap="var(--space-5)">
      <Box as="header" style={{ display: "flex", flexDirection: "column", gap: "var(--space-1)" }}>
        <Heading level={2} size="2xl" style={{ margin: 0 }}>
          Reports
        </Heading>
        <Text tone="muted">Revenue, usage, and activation analytics.</Text>
      </Box>

      <ReportsView />
    </Stack>
  );
}
