import type { Permission } from "./rbac";

// The dashboard navigation, declared once. Each item names the permission
// required to see it; the sidebar filters this list against the current role,
// and each page independently enforces the same permission server-side.

export type IconKey = "overview" | "reports" | "team" | "users" | "settings" | "profile";

export interface NavItem {
  label: string;
  href: string;
  icon: IconKey;
  permission: Permission;
  description: string;
}

export const NAV_ITEMS: NavItem[] = [
  { label: "Overview", href: "/dashboard", icon: "overview", permission: "dashboard:view", description: "KPIs, activity, and trends" },
  { label: "Reports", href: "/dashboard/reports", icon: "reports", permission: "reports:view", description: "Revenue and usage analytics" },
  { label: "Team", href: "/dashboard/team", icon: "team", permission: "team:view", description: "Your workspace members" },
  { label: "Users", href: "/dashboard/users", icon: "users", permission: "users:view", description: "Manage accounts and roles" },
  { label: "Settings", href: "/dashboard/settings", icon: "settings", permission: "settings:manage", description: "Workspace configuration" },
  { label: "Profile", href: "/dashboard/profile", icon: "profile", permission: "profile:edit", description: "Your account details" },
];
