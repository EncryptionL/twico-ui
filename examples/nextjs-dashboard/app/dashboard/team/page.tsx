import { Card, Grid, Avatar, Badge, Tag, Text, Heading, Box, Stack } from "twico-ui";
import { requirePermission } from "@/lib/auth";
import { can, ROLE_LABEL, ROLE_TONE } from "@/lib/rbac";
import { listUsers } from "@/lib/users";
import { InviteMember } from "@/components/InviteMember";
import type { User } from "@/lib/types";

const STATUS_TONE: Record<User["status"], "success" | "info" | "danger"> = {
  active: "success",
  invited: "info",
  suspended: "danger",
};
const AVATAR_STATUS: Record<User["status"], "online" | "away" | "busy"> = {
  active: "online",
  invited: "away",
  suspended: "busy",
};

export default async function TeamPage() {
  const user = await requirePermission("team:view");
  const canManage = can(user.role, "team:manage");
  const members = listUsers();

  return (
    <Stack gap="var(--space-5)">
      <Box as="header" style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: "var(--space-4)", flexWrap: "wrap" }}>
        <Stack gap="var(--space-1)">
          <Heading level={2} size="2xl" style={{ margin: 0 }}>
            Team
          </Heading>
          <Text tone="muted">{members.length} members in your workspace.</Text>
        </Stack>
        {canManage ? <InviteMember /> : null}
      </Box>

      <Grid minChildWidth={260} gap={4}>
        {members.map((m) => (
          <Card key={m.id} variant="outline">
            <Stack gap="var(--space-3)">
              <Stack direction="row" align="center" gap="var(--space-3)">
                <Avatar name={m.name} size="md" status={AVATAR_STATUS[m.status]} />
                <Box style={{ minWidth: 0 }}>
                  <Text style={{ fontWeight: 600 }}>{m.name}</Text>
                  <Text size="sm" tone="muted">
                    {m.title}
                  </Text>
                </Box>
              </Stack>
              <Stack direction="row" wrap gap="var(--space-2)">
                <Badge tone={ROLE_TONE[m.role]} size="sm">
                  {ROLE_LABEL[m.role]}
                </Badge>
                <Badge tone={STATUS_TONE[m.status]} variant="soft" size="sm">
                  {m.status}
                </Badge>
                <Tag tone="neutral">{m.department}</Tag>
              </Stack>
              <Text size="xs" tone="subtle">
                {m.email}
              </Text>
            </Stack>
          </Card>
        ))}
      </Grid>
    </Stack>
  );
}
