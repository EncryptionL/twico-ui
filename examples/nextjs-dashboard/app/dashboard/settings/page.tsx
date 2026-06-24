import { Heading, Text } from "twico-ui";
import { requirePermission } from "@/lib/auth";
import { SettingsForm } from "@/components/SettingsForm";

// Admin + Manager (settings:manage). Members are redirected to /forbidden.
export default async function SettingsPage() {
  await requirePermission("settings:manage");

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-5)" }}>
      <header style={{ display: "flex", flexDirection: "column", gap: "var(--space-1)" }}>
        <Heading level={2} size="2xl" style={{ margin: 0 }}>
          Settings
        </Heading>
        <Text tone="muted">Configure your workspace, appearance, and notifications.</Text>
      </header>

      <SettingsForm />
    </div>
  );
}
