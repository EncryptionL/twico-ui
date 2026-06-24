"use client";

import { useState } from "react";
import {
  Datatable,
  Dialog,
  Select,
  Input,
  Button,
  Badge,
  Avatar,
  Text,
  useToast,
} from "twico-ui";
import { ROLES, ROLE_LABEL, ROLE_DESCRIPTION, ROLE_TONE, type Role } from "@/lib/rbac";
import type { User } from "@/lib/types";
import { PlusIcon } from "@/components/icons";

const STATUS_TONE: Record<User["status"], "success" | "info" | "danger"> = {
  active: "success",
  invited: "info",
  suspended: "danger",
};

const roleOptions = ROLES.map((r) => ({
  value: r,
  label: ROLE_LABEL[r],
  description: ROLE_DESCRIPTION[r],
}));

export function UsersTable({
  initialUsers,
  canManage,
}: {
  initialUsers: User[];
  canManage: boolean;
}) {
  const { toast } = useToast();
  const [rows, setRows] = useState<User[]>(initialUsers);

  // Edit-role dialog
  const [editing, setEditing] = useState<User | null>(null);
  const [draftRole, setDraftRole] = useState<Role>("member");

  // Invite dialog
  const [inviteOpen, setInviteOpen] = useState(false);
  const [inviteName, setInviteName] = useState("");
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<Role>("member");

  const columns = [
    {
      field: "name",
      headerName: "Name",
      width: 220,
      renderCell: (value: string) => (
        <span style={{ display: "inline-flex", alignItems: "center", gap: 10 }}>
          <Avatar name={value} size="sm" />
          <span style={{ fontWeight: 600 }}>{value}</span>
        </span>
      ),
    },
    { field: "email", headerName: "Email", width: 210 },
    {
      field: "role",
      headerName: "Role",
      width: 120,
      renderCell: (value: Role) => (
        <Badge tone={ROLE_TONE[value]} size="sm">
          {ROLE_LABEL[value]}
        </Badge>
      ),
    },
    { field: "department", headerName: "Department", width: 150 },
    {
      field: "status",
      headerName: "Status",
      width: 130,
      renderCell: (value: User["status"]) => (
        <Badge tone={STATUS_TONE[value]} variant="soft" size="sm" dot>
          {value}
        </Badge>
      ),
    },
    { field: "joinedAt", headerName: "Joined", width: 120 },
  ];

  function openEdit(row: User) {
    setEditing(row);
    setDraftRole(row.role);
  }

  function saveRole() {
    if (!editing) return;
    setRows((prev) => prev.map((u) => (u.id === editing.id ? { ...u, role: draftRole } : u)));
    toast.success(`${editing.name} is now ${ROLE_LABEL[draftRole]}`);
    setEditing(null);
  }

  function sendInvite() {
    if (!inviteName.trim() || !inviteEmail.trim()) {
      toast.warning("Name and email are required");
      return;
    }
    const newUser: User = {
      id: `u_${Date.now()}`,
      name: inviteName.trim(),
      email: inviteEmail.trim(),
      role: inviteRole,
      title: "Invited",
      department: "—",
      status: "invited",
      joinedAt: new Date().toISOString().slice(0, 10),
    };
    setRows((prev) => [newUser, ...prev]);
    toast.success(`Invited ${newUser.name}`);
    setInviteOpen(false);
    setInviteName("");
    setInviteEmail("");
    setInviteRole("member");
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
      {canManage ? (
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <Button leftIcon={<PlusIcon />} onClick={() => setInviteOpen(true)}>
            Invite user
          </Button>
        </div>
      ) : null}

      <Datatable
        columns={columns}
        rows={rows}
        rowKey={(row: User) => row.id}
        pageSize={8}
        ariaLabel="Users"
        onRowClick={canManage ? (row: User) => openEdit(row) : undefined}
      />

      {/* Edit role */}
      <Dialog
        open={!!editing}
        onClose={() => setEditing(null)}
        title={editing ? `Edit ${editing.name}` : "Edit user"}
        description="Change this user's role. The change is local to this demo."
        footer={
          <div style={{ display: "flex", gap: "var(--space-2)", justifyContent: "flex-end" }}>
            <Button variant="ghost" onClick={() => setEditing(null)}>
              Cancel
            </Button>
            <Button onClick={saveRole}>Save changes</Button>
          </div>
        }
      >
        <Select
          label="Role"
          value={draftRole}
          onChange={(value) => setDraftRole(value as Role)}
          options={roleOptions}
        />
      </Dialog>

      {/* Invite */}
      <Dialog
        open={inviteOpen}
        onClose={() => setInviteOpen(false)}
        title="Invite a user"
        description="They'll appear in the table with an 'invited' status."
        footer={
          <div style={{ display: "flex", gap: "var(--space-2)", justifyContent: "flex-end" }}>
            <Button variant="ghost" onClick={() => setInviteOpen(false)}>
              Cancel
            </Button>
            <Button onClick={sendInvite}>Send invite</Button>
          </div>
        }
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)" }}>
          <Input
            label="Full name"
            placeholder="Jane Doe"
            value={inviteName}
            onChange={(e) => setInviteName(e.target.value)}
          />
          <Input
            label="Email"
            type="email"
            placeholder="jane@twico.dev"
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
          />
          <Select
            label="Role"
            value={inviteRole}
            onChange={(value) => setInviteRole(value as Role)}
            options={roleOptions}
          />
          <Text size="xs" tone="subtle">
            Demo only — no email is actually sent.
          </Text>
        </div>
      </Dialog>
    </div>
  );
}
