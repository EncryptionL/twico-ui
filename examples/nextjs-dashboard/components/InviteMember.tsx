"use client";

import { useState } from "react";
import { Button, Dialog, Input, Select, Stack, Text, useToast } from "twico-ui";
import { ROLES, ROLE_LABEL, ROLE_DESCRIPTION, type Role } from "@/lib/rbac";
import { PlusIcon } from "twico-ui/icons";

const roleOptions = ROLES.map((r) => ({
  value: r,
  label: ROLE_LABEL[r],
  description: ROLE_DESCRIPTION[r],
}));

/** Shown only to roles with `team:manage`. Invites are mocked (no email sent). */
export function InviteMember() {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<Role>("member");

  function invite() {
    if (!name.trim() || !email.trim()) {
      toast.warning("Name and email are required");
      return;
    }
    toast.success(`Invitation sent to ${email}`);
    setOpen(false);
    setName("");
    setEmail("");
    setRole("member");
  }

  return (
    <>
      <Button leftIcon={<PlusIcon size={18} />} onClick={() => setOpen(true)}>
        Invite member
      </Button>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        title="Invite a member"
        description="Send a workspace invitation."
        footer={
          <Stack direction="row" gap="var(--space-2)" justify="flex-end">
            <Button variant="ghost" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={invite}>Send invite</Button>
          </Stack>
        }
      >
        <Stack gap="var(--space-3)">
          <Input label="Full name" placeholder="Jane Doe" value={name} onChange={(e) => setName(e.target.value)} />
          <Input label="Email" type="email" placeholder="jane@twico.dev" value={email} onChange={(e) => setEmail(e.target.value)} />
          <Select label="Role" value={role} onChange={(value) => setRole(value as Role)} options={roleOptions} />
          <Text size="xs" tone="subtle">
            Demo only — no email is actually sent.
          </Text>
        </Stack>
      </Dialog>
    </>
  );
}
