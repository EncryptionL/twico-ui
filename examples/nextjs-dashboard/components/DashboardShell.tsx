"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  Sidebar,
  AvatarMenu,
  IconButton,
  Tooltip,
  Badge,
  Heading,
  useColorScheme,
  useMounted,
} from "twico-ui";
import {
  Logo,
  NAV_ICONS,
  SunIcon,
  MoonIcon,
  MenuIcon,
  BellIcon,
} from "./icons";
import { logout } from "@/lib/auth-actions";
import { ROLE_LABEL, ROLE_TONE } from "@/lib/rbac";
import type { IconKey } from "@/lib/nav";
import type { SessionUser } from "@/lib/types";

interface ShellNavItem {
  label: string;
  href: string;
  icon: IconKey;
}

export function DashboardShell({
  user,
  items,
  children,
}: {
  user: SessionUser;
  items: ShellNavItem[];
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { isDark, toggle } = useColorScheme();
  const mounted = useMounted();
  const [collapsed, setCollapsed] = useState(false);

  const isActive = (href: string) =>
    href === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(href);

  const sidebarItems = [
    { section: "Workspace" },
    ...items.map((item) => ({
      label: item.label,
      icon: NAV_ICONS[item.icon],
      active: isActive(item.href),
      onClick: () => router.push(item.href),
    })),
  ];

  const current = items.find((item) => isActive(item.href));

  return (
    <div style={{ display: "flex", height: "100dvh", overflow: "hidden", background: "var(--color-bg)" }}>
      <Sidebar
        brand={<Logo showText={!collapsed} />}
        items={sidebarItems}
        collapsed={collapsed}
        onCollapsedChange={setCollapsed}
      />

      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0, height: "100%" }}>
        <header
          style={{
            position: "sticky",
            top: 0,
            zIndex: 20,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "var(--space-4)",
            height: 64,
            paddingInline: "var(--space-5)",
            borderBottom: "1px solid var(--color-border)",
            background: "var(--color-surface)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)", minWidth: 0 }}>
            <Tooltip label={collapsed ? "Expand sidebar" : "Collapse sidebar"} placement="bottom">
              <IconButton
                aria-label="Toggle sidebar"
                variant="ghost"
                icon={<MenuIcon />}
                onClick={() => setCollapsed((c) => !c)}
              />
            </Tooltip>
            <Heading level={1} size="lg" style={{ margin: 0, whiteSpace: "nowrap" }}>
              {current?.label ?? "Dashboard"}
            </Heading>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
            <Tooltip label={isDark ? "Light mode" : "Dark mode"} placement="bottom">
              <IconButton
                aria-label="Toggle theme"
                variant="ghost"
                icon={mounted && isDark ? <SunIcon /> : <MoonIcon />}
                onClick={toggle}
              />
            </Tooltip>
            <Tooltip label="Notifications" placement="bottom">
              <IconButton aria-label="Notifications" variant="ghost" icon={<BellIcon />} />
            </Tooltip>
            <AvatarMenu
              name={user.name}
              email={user.email}
              showName
              subtitle={
                <Badge size="sm" tone={ROLE_TONE[user.role]}>
                  {ROLE_LABEL[user.role]}
                </Badge>
              }
              items={[
                { label: "Your profile", onClick: () => router.push("/dashboard/profile") },
                { separator: true },
                { label: "Sign out", danger: true, onClick: () => void logout() },
              ]}
            />
          </div>
        </header>

        <main style={{ flex: 1, overflow: "auto", padding: "var(--space-6) var(--space-5)" }}>
          <div style={{ maxWidth: 1200, margin: "0 auto" }}>{children}</div>
        </main>
      </div>
    </div>
  );
}
