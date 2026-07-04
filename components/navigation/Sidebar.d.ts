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
 * Set `overlay` for a mobile off-canvas drawer (backdrop, focus trap, Escape-to-close).
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
  /**
   * Render as an off-canvas drawer instead of an in-flow rail: a fixed slide-over
   * panel behind a dismissable backdrop, portaled to `document.body`, with a focus
   * trap, Escape-to-close, and body-scroll lock. Drive visibility with
   * `open`/`defaultOpen`/`onOpenChange`. For a responsive layout, render the rail on
   * desktop and the overlay on mobile. @default false
   */
  overlay?: boolean;
  /** Controlled open state of the overlay drawer (only when `overlay`). */
  open?: boolean;
  /** Uncontrolled initial open state of the overlay drawer. @default false */
  defaultOpen?: boolean;
  /** Called when the overlay drawer requests open/close (backdrop, Escape). */
  onOpenChange?: (open: boolean) => void;
  /** Accessible name for the inner `<nav>` landmark (and the overlay dialog). @default "Main" */
  navLabel?: string;
}

export function Sidebar(props: SidebarProps): React.JSX.Element;
