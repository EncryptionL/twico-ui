import type { ReactNode } from "react";
import {
  LayoutDashboardIcon,
  ChartColumnIcon,
  UsersIcon,
  ShieldCheckIcon,
  SettingsIcon,
  UserIcon,
} from "twico-ui/icons";
import type { IconKey } from "@/lib/nav";

// Icons come from twico-ui/icons (the full Lucide set). The sidebar maps each
// nav key to a Lucide icon; standalone icons are imported from "twico-ui/icons"
// directly where they're used. Only the brand wordmark below is custom.

/** Nav icon by key — used to render the sidebar from the (data-only) NAV_ITEMS. */
export const NAV_ICONS: Record<IconKey, ReactNode> = {
  overview: <LayoutDashboardIcon size={18} />,
  reports: <ChartColumnIcon size={18} />,
  team: <UsersIcon size={18} />,
  users: <ShieldCheckIcon size={18} />,
  settings: <SettingsIcon size={18} />,
  profile: <UserIcon size={18} />,
};

/** The Twico-style wordmark used for branding (a custom mark, not a Lucide icon). */
export function Logo({ showText = true }: { showText?: boolean }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 9,
        fontWeight: 800,
        fontSize: 18,
        letterSpacing: "-0.02em",
        color: "var(--color-text)",
      }}
    >
      <span
        style={{
          display: "grid",
          placeItems: "center",
          width: 30,
          height: 30,
          borderRadius: 9,
          background: "var(--color-primary)",
          color: "var(--color-primary-fg)",
          boxShadow: "var(--shadow-brand)",
          flex: "none",
        }}
      >
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round">
          <path d="M5 7h14M5 12h9M5 17h6" />
        </svg>
      </span>
      {showText && (
        <span>
          Twico <span style={{ color: "var(--color-primary)" }}>UI</span>
        </span>
      )}
    </span>
  );
}
