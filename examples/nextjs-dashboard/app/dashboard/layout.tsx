import { requireSession } from "@/lib/auth";
import { can } from "@/lib/rbac";
import { NAV_ITEMS } from "@/lib/nav";
import { DashboardShell } from "@/components/DashboardShell";

// Server layout for the whole protected area:
//  1. requireSession() — authentication gate (redirects to /login if signed out).
//  2. Filter the nav to what this role may see — the same permissions each page
//     independently enforces. (Hiding a link is UX; the page guard is security.)
export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await requireSession();

  const items = NAV_ITEMS.filter((item) => can(user.role, item.permission)).map(
    ({ label, href, icon }) => ({ label, href, icon })
  );

  return (
    <DashboardShell user={user} items={items}>
      {children}
    </DashboardShell>
  );
}
