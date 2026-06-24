import { Heading, Text } from "twico-ui";
import { requirePermission } from "@/lib/auth";
import { can } from "@/lib/rbac";
import { listUsers } from "@/lib/users";
import { UsersTable } from "@/components/UsersTable";

// Admin-only. `users:view` is required to open the page at all; `users:manage`
// additionally unlocks editing. Both are enforced here on the server — hiding
// the buttons in the table is only cosmetic.
export default async function UsersPage() {
  const user = await requirePermission("users:view");
  const canManage = can(user.role, "users:manage");
  const users = listUsers();

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-5)" }}>
      <header style={{ display: "flex", flexDirection: "column", gap: "var(--space-1)" }}>
        <Heading level={2} size="2xl" style={{ margin: 0 }}>
          Users
        </Heading>
        <Text tone="muted">
          {users.length} accounts.{" "}
          {canManage ? "Click a row to change a role, or invite someone." : "Read-only — you can view but not edit."}
        </Text>
      </header>

      <UsersTable initialUsers={users} canManage={canManage} />
    </div>
  );
}
