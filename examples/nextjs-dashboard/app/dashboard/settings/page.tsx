import { Heading, Text, Stack } from "twico-ui";
import { requirePermission } from "@/lib/auth";
import { SettingsForm } from "@/components/SettingsForm";

// Admin + Manager (settings:manage). Members are redirected to /forbidden.
export default async function SettingsPage() {
  await requirePermission("settings:manage");

  return (
    <Stack direction="column" gap="var(--space-5)">
      <Stack as="header" direction="column" gap="var(--space-1)">
        <Heading level={2} size="2xl" style={{ margin: 0 }}>
          Settings
        </Heading>
        <Text tone="muted">Configure your workspace, appearance, and notifications.</Text>
      </Stack>

      <SettingsForm />
    </Stack>
  );
}
