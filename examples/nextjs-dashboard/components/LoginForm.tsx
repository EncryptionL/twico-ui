"use client";

import { useActionState, useState } from "react";
import { Card, Input, Button, Alert, Badge, Text, Divider } from "twico-ui";
import { login, type LoginState } from "@/lib/auth-actions";
import { ROLE_TONE } from "@/lib/rbac";

const DEMO_ACCOUNTS = [
  { role: "admin" as const, label: "Admin", email: "admin@twico.dev" },
  { role: "manager" as const, label: "Manager", email: "manager@twico.dev" },
  { role: "member" as const, label: "Member", email: "member@twico.dev" },
];

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

      <div style={{ marginTop: "var(--space-5)" }}>
        <Divider>
          <Text size="xs" tone="subtle">
            Quick demo accounts
          </Text>
        </Divider>
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)", marginTop: "var(--space-3)" }}>
          {DEMO_ACCOUNTS.map((a) => (
            <Button
              key={a.email}
              type="button"
              variant="soft"
              fullWidth
              onClick={() => {
                setEmail(a.email);
                setPassword("demo1234");
              }}
            >
              <span style={{ display: "inline-flex", alignItems: "center", gap: 8, justifyContent: "center" }}>
                <Badge tone={ROLE_TONE[a.role]} size="sm">
                  {a.label}
                </Badge>
                <span style={{ fontFamily: "var(--font-mono)" }}>{a.email}</span>
              </span>
            </Button>
          ))}
          <Text size="xs" tone="subtle" align="center">
            Password for all demo accounts: <code>demo1234</code>
          </Text>
        </div>
      </div>
    </Card>
  );
}
