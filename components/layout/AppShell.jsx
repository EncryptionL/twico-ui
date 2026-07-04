import React from "react";
import { useScopedStyles } from "../_styles.js";

const SHELL_CSS = `
.twc-shell { position: relative; display: flex; overflow: hidden; background: var(--color-bg); color: var(--color-text); font-family: var(--font-sans); }
.twc-shell__skip { position: absolute; inset-inline-start: var(--space-3); inset-block-start: var(--space-3); z-index: 100;
  padding: var(--space-2) var(--space-4); background: var(--color-surface); color: var(--color-text);
  border: var(--border-thin) solid var(--color-border); border-radius: var(--radius-md); font-family: var(--font-sans);
  transform: translateY(-200%); transition: transform var(--duration-fast) var(--ease-standard); }
.twc-shell__skip:focus-visible { transform: translateY(0); outline: none; box-shadow: var(--ring); }
.twc-shell__main { flex: 1 1 auto; min-width: 0; display: flex; flex-direction: column; height: 100%; }
.twc-shell__header { flex: none; display: flex; align-items: center; justify-content: space-between; gap: var(--space-4);
  min-height: 60px; padding-inline: var(--space-5); border-bottom: var(--border-thin) solid var(--color-border); background: var(--color-surface); }
.twc-shell__content { flex: 1 1 auto; min-height: 0; overflow: auto; }
.twc-shell__content[data-padded="true"] { padding: var(--space-6) var(--space-5); }
/* Mobile: stack the shell so the sidebar (rendered as an off-canvas overlay) no
   longer reserves a column — the main content spans the full width. */
@media (max-width: 720px) {
  .twc-shell { flex-direction: column; }
}
`;

/**
 * Full-height application shell: a fixed `sidebar` beside a scrollable content
 * area, with an optional fixed `header` (topbar). The content fills the
 * remaining width (and grows when the sidebar collapses); only the content
 * scrolls — the sidebar and header stay put. RTL-aware (logical properties +
 * flow order put the sidebar on the inline-start side).
 *
 * For a responsive layout, pass `onSidebarOpenChange` (usually gated on a
 * `useMediaQuery` mobile check): the shell then forwards `overlay`/`open`/
 * `onOpenChange` to the `sidebar` element so it renders as an off-canvas drawer,
 * and a `Navbar`'s `onMenuClick` can call `onSidebarOpenChange(true)` to open it.
 */
export function AppShell({
  sidebar,
  header,
  children,
  height = "100dvh",
  padded = true,
  mainId = "twc-main",
  skipLinkLabel = "Skip to content",
  sidebarOpen,
  onSidebarOpenChange,
  className = "",
  style,
  ...rest
}) {
  const __twcStyles = useScopedStyles("twc-shell-styles", SHELL_CSS);

  // Mobile coordination: when the consumer opts in (by wiring onSidebarOpenChange
  // / sidebarOpen), forward the overlay-drawer props to the sidebar element —
  // explicitly, and only the three named props, respecting any the sidebar already
  // sets. Opt-out (the default) leaves `sidebar` untouched.
  const wiredSidebar =
    React.isValidElement(sidebar) && (sidebarOpen !== undefined || onSidebarOpenChange !== undefined)
      ? React.cloneElement(sidebar, {
          overlay: sidebar.props.overlay !== undefined ? sidebar.props.overlay : true,
          open: sidebar.props.open !== undefined ? sidebar.props.open : sidebarOpen,
          onOpenChange: sidebar.props.onOpenChange !== undefined ? sidebar.props.onOpenChange : onSidebarOpenChange,
        })
      : sidebar;

  return (
    <div className={`twc-shell ${className}`.trim()} style={{ height, ...style }} {...rest}>
      {__twcStyles}
      {skipLinkLabel != null && skipLinkLabel !== false ? (
        <a className="twc-shell__skip" href={`#${mainId}`}>{skipLinkLabel}</a>
      ) : null}
      {wiredSidebar}
      <div className="twc-shell__main">
        {header != null ? <header className="twc-shell__header">{header}</header> : null}
        <main className="twc-shell__content" id={mainId} tabIndex={-1} data-padded={padded ? "true" : undefined}>
          {children}
        </main>
      </div>
    </div>
  );
}
