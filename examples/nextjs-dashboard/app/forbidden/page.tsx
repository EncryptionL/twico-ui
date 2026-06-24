import { EmptyState, Button, Box } from "twico-ui";
import { ShieldIcon } from "twico-ui/icons";

// Where `requirePermission` sends a signed-in user who lacks a permission.
export default function ForbiddenPage() {
  return (
    <Box as="main" style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: "var(--space-6)", background: "var(--color-bg)" }}>
      <Box style={{ maxWidth: 460 }}>
        <EmptyState
          icon={<ShieldIcon size={42} />}
          title="403 — Access denied"
          description="You don't have permission to view this page. If you think this is a mistake, ask a workspace admin."
          actions={
            <Button as="a" href="/dashboard">
              Back to dashboard
            </Button>
          }
          bordered
        />
      </Box>
    </Box>
  );
}
