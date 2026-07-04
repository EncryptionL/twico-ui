import * as React from "react";

export interface AppShellProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
  /** The sidebar element (e.g. a `<Sidebar/>`), rendered full-height on the inline-start side. */
  sidebar?: React.ReactNode;
  /**
   * Topbar content, rendered in a fixed header above the scrollable content. The header is a flex
   * row with `space-between`, so pass two groups (left/right) and they spread to the edges.
   */
  header?: React.ReactNode;
  /** Main content — fills the remaining space and scrolls independently of the sidebar/header. */
  children?: React.ReactNode;
  /** Overall shell height (CSS length). Use a fixed value to embed the shell in a smaller region. @default "100dvh" */
  height?: string | number;
  /** Pad the scrollable content region. @default true */
  padded?: boolean;
  /** Id for the `<main>` content region and the skip-link target. @default "twc-main" */
  mainId?: string;
  /** Label for the visually-hidden-until-focused skip-to-content link (the shell's first child). Pass `false`/`null` to opt out. @default "Skip to content" */
  skipLinkLabel?: React.ReactNode | false;
  /**
   * Open state of the sidebar's off-canvas drawer on mobile. Providing this (or
   * `onSidebarOpenChange`) makes the shell forward `overlay`/`open`/`onOpenChange`
   * to the `sidebar` element, so it renders as a drawer. Respects any of those
   * props the sidebar already sets.
   */
  sidebarOpen?: boolean;
  /** Called when the sidebar drawer requests open/close (backdrop, Escape) — wire a `Navbar`'s `onMenuClick` to `() => onSidebarOpenChange(true)`. */
  onSidebarOpenChange?: (open: boolean) => void;
}

export declare function AppShell(props: AppShellProps): React.JSX.Element;
