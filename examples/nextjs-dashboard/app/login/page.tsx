import { Text, Box, Stack } from "twico-ui";
import { Logo } from "@/components/icons";
import { LoginForm } from "@/components/LoginForm";

// Public route. `next` is the path to return to after a successful sign-in
// (set by the proxy when it bounces an unauthenticated request).
export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;

  return (
    <Box
      as="main"
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        padding: "var(--space-6)",
        background:
          "radial-gradient(1200px 600px at 50% -10%, var(--color-primary-subtle), transparent), var(--color-bg)",
      }}
    >
      <Stack direction="column" gap="var(--space-5)" style={{ width: "100%", maxWidth: 420 }}>
        <Stack direction="column" align="center" gap="var(--space-2)" style={{ textAlign: "center" }}>
          <Logo />
          <Text tone="muted" size="sm">
            Sign in to the Twico UI demo dashboard.
          </Text>
        </Stack>

        <LoginForm next={next ?? "/dashboard"} />

        <Text tone="subtle" size="xs" align="center">
          Demo only — credentials are mocked and the session is a signed cookie.
        </Text>
      </Stack>
    </Box>
  );
}
