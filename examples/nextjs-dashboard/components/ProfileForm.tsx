"use client";

import { useState } from "react";
import { Card, Avatar, Input, Textarea, Select, Button, Badge, Text, Stack, Grid, useToast } from "twico-ui";
import { ROLE_LABEL, ROLE_TONE, type Role } from "@/lib/rbac";

const DEPARTMENTS = ["Engineering", "Design", "Sales", "Marketing", "Support", "Finance"].map((d) => ({
  value: d,
  label: d,
}));

export function ProfileForm({
  name: initialName,
  email,
  role,
  title: initialTitle,
  department: initialDepartment,
}: {
  name: string;
  email: string;
  role: Role;
  title: string;
  department: string;
}) {
  const { toast } = useToast();
  const [name, setName] = useState(initialName);
  const [title, setTitle] = useState(initialTitle);
  const [department, setDepartment] = useState(initialDepartment || "Engineering");
  const [bio, setBio] = useState("");

  return (
    <Card>
      <Stack gap="var(--space-5)">
        <Stack direction="row" align="center" gap="var(--space-4)">
          <Avatar name={name} size="xl" ring />
          <Stack gap="var(--space-1)">
            <Text style={{ fontWeight: 700, fontSize: "var(--text-lg)" }}>{name}</Text>
            <Stack direction="row" align="center" gap="var(--space-2)">
              <Badge tone={ROLE_TONE[role]} size="sm">
                {ROLE_LABEL[role]}
              </Badge>
              <Text size="sm" tone="muted">
                {email}
              </Text>
            </Stack>
          </Stack>
        </Stack>

        <Grid minChildWidth={240} gap="var(--space-4)">
          <Input label="Full name" value={name} onChange={(e) => setName(e.target.value)} />
          <Input label="Email" type="email" value={email} readOnly hint="Your email can't be changed in this demo." />
          <Input label="Job title" value={title} onChange={(e) => setTitle(e.target.value)} />
          <Select label="Department" value={department} onChange={(value) => setDepartment(value ?? "")} options={DEPARTMENTS} />
        </Grid>

        <Textarea label="Bio" rows={4} placeholder="A short bio…" value={bio} onChange={(e) => setBio(e.target.value)} />

        <Stack direction="row" gap="var(--space-2)">
          <Button onClick={() => toast.success("Profile updated")}>Save profile</Button>
          <Button variant="ghost" onClick={() => { setName(initialName); setTitle(initialTitle); setDepartment(initialDepartment || "Engineering"); setBio(""); }}>
            Reset
          </Button>
        </Stack>
      </Stack>
    </Card>
  );
}
