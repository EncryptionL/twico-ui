// ---------------------------------------------------------------------------
// Role-Based Access Control (RBAC)
//
// Roles map to a fixed set of permissions. Authorization is always a check of
// "does this role have this permission?" via `can()`. This is the single source
// of truth used by the proxy, the per-page `requirePermission` guards, and
// the UI (to gate nav items and actions).
// ---------------------------------------------------------------------------

export type Role = "admin" | "manager" | "member";

export type Permission =
  | "dashboard:view"
  | "reports:view"
  | "team:view"
  | "team:manage"
  | "users:view"
  | "users:manage"
  | "settings:manage"
  | "billing:view"
  | "profile:edit";

export const ROLES: Role[] = ["admin", "manager", "member"];

/** Permissions granted to each role. `"*"` = all permissions (admin). */
const ROLE_PERMISSIONS: Record<Role, Permission[] | "*"> = {
  admin: "*",
  manager: [
    "dashboard:view",
    "reports:view",
    "team:view",
    "team:manage",
    "settings:manage",
    "profile:edit",
  ],
  member: ["dashboard:view", "team:view", "profile:edit"],
};

/** The core authorization check: does `role` have `permission`? */
export function can(role: Role, permission: Permission): boolean {
  const perms = ROLE_PERMISSIONS[role];
  return perms === "*" || perms.includes(permission);
}

/** Every permission a role holds (expands `"*"` for admin) — handy for UIs. */
export function permissionsFor(role: Role): Permission[] {
  const perms = ROLE_PERMISSIONS[role];
  if (perms !== "*") return perms;
  return [
    "dashboard:view",
    "reports:view",
    "team:view",
    "team:manage",
    "users:view",
    "users:manage",
    "settings:manage",
    "billing:view",
    "profile:edit",
  ];
}

export const ROLE_LABEL: Record<Role, string> = {
  admin: "Admin",
  manager: "Manager",
  member: "Member",
};

export const ROLE_DESCRIPTION: Record<Role, string> = {
  admin: "Full access, including user and billing management.",
  manager: "Manage the team, reports, and workspace settings.",
  member: "View the dashboard and team; edit own profile.",
};

/** Badge tone per role (Twico UI Badge `tone`). */
export const ROLE_TONE: Record<Role, "danger" | "warning" | "neutral"> = {
  admin: "danger",
  manager: "warning",
  member: "neutral",
};
