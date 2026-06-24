import { Heading, Text, Stack, Box } from "twico-ui";
import { requirePermission } from "@/lib/auth";
import { findUserById } from "@/lib/users";
import { ProfileForm } from "@/components/ProfileForm";

// Available to every signed-in role (profile:edit).
export default async function ProfilePage() {
  const session = await requirePermission("profile:edit");
  const record = findUserById(session.id);

  return (
    <Stack gap="var(--space-5)">
      <Box as="header" style={{ display: "flex", flexDirection: "column", gap: "var(--space-1)" }}>
        <Heading level={2} size="2xl" style={{ margin: 0 }}>
          Profile
        </Heading>
        <Text tone="muted">Manage your account details.</Text>
      </Box>

      <ProfileForm
        name={session.name}
        email={session.email}
        role={session.role}
        title={record?.title ?? ""}
        department={record?.department ?? ""}
      />
    </Stack>
  );
}
