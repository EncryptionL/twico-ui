import { Heading, Text } from "twico-ui";
import { requirePermission } from "@/lib/auth";
import { ReportsView } from "@/components/ReportsView";

export default async function ReportsPage() {
  await requirePermission("reports:view");

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-5)" }}>
      <header style={{ display: "flex", flexDirection: "column", gap: "var(--space-1)" }}>
        <Heading level={2} size="2xl" style={{ margin: 0 }}>
          Reports
        </Heading>
        <Text tone="muted">Revenue, usage, and activation analytics.</Text>
      </header>

      <ReportsView />
    </div>
  );
}
