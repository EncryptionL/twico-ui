"use client";

import { useActionState, useState } from "react";
import { Card, Input, Button, Alert, Badge, Text, Divider, List, Box, Code } from "twico-ui";
import { login, type LoginState } from "@/lib/auth-actions";
import { ROLE_TONE, ROLE_DESCRIPTION } from "@/lib/rbac";

const DEMO_ACCOUNTS = [
  { role: "admin" as const, label: "Admin", email: "admin@twico.dev" },
  { role: "manager" as const, label: "Manager", email: "manager@twico.dev" },
  { role: "member" as const, label: "Member", email: "member@twico.dev" },
];

const DEMO_PASSWORD = "demo1234";

export function LoginForm({ next }: { next: string }) {
  const [state, formAction, pending] = useActionState<LoginState, FormData>(login, {});
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <Card padding="lg">
      <form action={formAction} style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
        <input type="hidden" name="next" value={next} />

        <Input
          name="email"
          type="email"
          label="Email"
          placeholder="you@twico.dev"
          autoComplete="username"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Input
          name="password"
          type="password"
          label="Password"
          placeholder="••••••••"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {state.error ? <Alert tone="danger">{state.error}</Alert> : null}

        <Button type="submit" fullWidth loading={pending}>
          Sign in
        </Button>
      </form>

      <Box style={{ marginTop: "var(--space-5)" }}>
        <Divider>
          <Text size="xs" tone="subtle">
            Demo accounts — click one to fill the form
          </Text>
        </Divider>
        <Box style={{ marginTop: "var(--space-3)" }}>
          <List
            items={DEMO_ACCOUNTS.map((a) => ({
              leading: (
                <Badge tone={ROLE_TONE[a.role]} size="sm">
                  {a.label}
                </Badge>
              ),
              title: <Text as="span" style={{ fontFamily: "var(--font-mono)" }}>{a.email}</Text>,
              description: ROLE_DESCRIPTION[a.role],
              onClick: () => {
                setEmail(a.email);
                setPassword(DEMO_PASSWORD);
              },
            }))}
          />
          <Text size="xs" tone="subtle" align="center" style={{ display: "block", marginTop: "var(--space-3)" }}>
            Password for all accounts: <Code>{DEMO_PASSWORD}</Code>
          </Text>
        </Box>
      </Box>
    </Card>
  );
}
