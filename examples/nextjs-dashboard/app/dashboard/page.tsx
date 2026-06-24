import { Card, Stat, Chart, Timeline, Grid, Heading, Text, Tag, Badge, Stack, Box } from "twico-ui";
import { requirePermission } from "@/lib/auth";
import { permissionsFor, ROLE_LABEL, ROLE_DESCRIPTION, ROLE_TONE } from "@/lib/rbac";
import { ChartColumnIcon, UsersIcon, PlusIcon, BellIcon } from "twico-ui/icons";

const GROWTH = [
  { label: "Jan", signups: 120, activations: 80 },
  { label: "Feb", signups: 150, activations: 110 },
  { label: "Mar", signups: 180, activations: 130 },
  { label: "Apr", signups: 165, activations: 118 },
  { label: "May", signups: 210, activations: 162 },
  { label: "Jun", signups: 198, activations: 151 },
];

const ACTIVITY = [
  { title: "New signup — Liam Novak", time: "12 min ago", tone: "primary" as const },
  { title: "Invoice #1043 paid", time: "1 hour ago", tone: "success" as const, description: "$1,200 · Pro plan" },
  { title: "Failed login blocked", time: "3 hours ago", tone: "warning" as const },
  { title: "Nora Frey suspended", time: "Yesterday", tone: "danger" as const },
  { title: "Workspace settings updated", time: "Yesterday", tone: "info" as const },
];

export default async function OverviewPage() {
  const user = await requirePermission("dashboard:view");
  const permissions = permissionsFor(user.role);

  return (
    <Stack gap="var(--space-6)">
      <Box as="header" style={{ display: "flex", flexDirection: "column", gap: "var(--space-1)" }}>
        <Heading level={2} size="2xl" style={{ margin: 0 }}>
          Welcome back, {user.name.split(" ")[0]}
        </Heading>
        <Text tone="muted">Here's what's happening across your workspace today.</Text>
      </Box>

      <Grid minChildWidth={210} gap={4}>
        <Stat label="Revenue" value="$48,250" delta="+12.5%" deltaDirection="up" helpText="vs last month" icon={<ChartColumnIcon size={18} />} />
        <Stat label="Active users" value="2,318" delta="+4.1%" deltaDirection="up" helpText="vs last month" icon={<UsersIcon size={18} />} />
        <Stat label="New signups" value="198" delta="+9.2%" deltaDirection="up" helpText="this month" icon={<PlusIcon size={18} />} />
        <Stat label="Churn" value="1.4%" delta="-0.3%" deltaDirection="down" helpText="vs last month" icon={<BellIcon size={18} />} />
      </Grid>

      <Grid minChildWidth={320} gap="var(--space-5)">
        <Box style={{ gridColumn: "1 / -1" }}>
          <Card title="Growth" subtitle="Signups vs activations · last 6 months">
            <Chart
              type="line"
              series={["signups", "activations"]}
              data={GROWTH}
              height={260}
              showLegend
              ariaLabel="Signups and activations over the last six months"
            />
          </Card>
        </Box>

        <Card title="Recent activity" subtitle="Across the workspace">
          <Timeline items={ACTIVITY} />
        </Card>

        <Card
          title="Your access"
          subtitle={`Role-based access control · ${ROLE_LABEL[user.role]}`}
        >
          <Stack gap="var(--space-3)">
            <Stack direction="row" align="center" gap="var(--space-2)">
              <Badge tone={ROLE_TONE[user.role]}>{ROLE_LABEL[user.role]}</Badge>
              <Text size="sm" tone="muted">
                {ROLE_DESCRIPTION[user.role]}
              </Text>
            </Stack>
            <Box>
              <Text size="xs" tone="subtle" style={{ display: "block", marginBottom: "var(--space-2)" }}>
                {permissions.length} permission{permissions.length === 1 ? "" : "s"} granted
              </Text>
              <Stack direction="row" wrap gap="var(--space-2)">
                {permissions.map((permission) => (
                  <Tag key={permission} tone="neutral">
                    {permission}
                  </Tag>
                ))}
              </Stack>
            </Box>
            <Text size="xs" tone="subtle">
              Try signing in as a different role — the sidebar, pages, and actions all change.
            </Text>
          </Stack>
        </Card>
      </Grid>
    </Stack>
  );
}
