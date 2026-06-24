import React from "react";
import { useScopedStyles } from "../_styles.js";

const SHELL_CSS = `
.twc-shell { display: flex; overflow: hidden; background: var(--color-bg); color: var(--color-text); font-family: var(--font-sans); }
.twc-shell__main { flex: 1 1 auto; min-width: 0; display: flex; flex-direction: column; height: 100%; }
.twc-shell__header { flex: none; display: flex; align-items: center; justify-content: space-between; gap: var(--space-4);
  min-height: 60px; padding-inline: var(--space-5); border-bottom: var(--border-thin) solid var(--color-border); background: var(--color-surface); }
.twc-shell__content { flex: 1 1 auto; min-height: 0; overflow: auto; }
.twc-shell__content[data-padded="true"] { padding: var(--space-6) var(--space-5); }
`;

/**
 * Full-height application shell: a fixed `sidebar` beside a scrollable content
 * area, with an optional fixed `header` (topbar). The content fills the
 * remaining width (and grows when the sidebar collapses); only the content
 * scrolls — the sidebar and header stay put. RTL-aware (logical properties +
 * flow order put the sidebar on the inline-start side).
 */
export function AppShell({
  sidebar,
  header,
  children,
  height = "100dvh",
  padded = true,
  className = "",
  style,
  ...rest
}) {
  const __twcStyles = useScopedStyles("twc-shell-styles", SHELL_CSS);

  return (
    <div className={`twc-shell ${className}`.trim()} style={{ height, ...style }} {...rest}>
      {__twcStyles}
      {sidebar}
      <div className="twc-shell__main">
        {header != null ? <header className="twc-shell__header">{header}</header> : null}
        <main className="twc-shell__content" data-padded={padded ? "true" : undefined}>
          {children}
        </main>
      </div>
    </div>
  );
}
