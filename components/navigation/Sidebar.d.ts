import * as React from "react";

export interface SidebarItem {
  /** Item label. */
  label?: React.ReactNode;
  /** Leading icon (shown in collapsed mode too). */
  icon?: React.ReactNode;
  href?: string;
  active?: boolean;
  onClick?: (e: React.MouseEvent) => void;
  /** Trailing count badge. */
  badge?: React.ReactNode;
  /** Render as an uppercase section heading instead of a link. */
  section?: React.ReactNode;
}

/**
 * Collapsible side navigation — brand header, grouped nav items with icons and
 * badges, an optional footer, and a collapse toggle (icon-only when collapsed).
 *
 * @startingPoint section="Layout" subtitle="Collapsible side navigation" viewport="280x520"
 */
export interface SidebarProps extends React.HTMLAttributes<HTMLElement> {
  brand?: React.ReactNode;
  items: SidebarItem[];
  /** Content pinned above the collapse toggle (e.g. a user row). */
  footer?: React.ReactNode;
  /** Controlled collapsed state. */
  collapsed?: boolean;
  /** Uncontrolled initial collapsed state. @default false */
  defaultCollapsed?: boolean;
  /** Show the collapse toggle. @default true */
  collapsible?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
  /** Accessible name for the inner `<nav>` landmark (and the overlay dialog). @default "Main" */
  navLabel?: string;
}

export function Sidebar(props: SidebarProps): React.JSX.Element;
