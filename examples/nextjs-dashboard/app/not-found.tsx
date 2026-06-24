import { EmptyState, Button } from "twico-ui";

export default function NotFound() {
  return (
    <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: "var(--space-6)", background: "var(--color-bg)" }}>
      <div style={{ maxWidth: 460 }}>
        <EmptyState
          title="404 — Page not found"
          description="The page you're looking for doesn't exist or has moved."
          actions={
            <Button as="a" href="/dashboard">
              Back to dashboard
            </Button>
          }
          bordered
        />
      </div>
    </main>
  );
}
