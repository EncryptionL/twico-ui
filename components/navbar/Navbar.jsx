import React from "react";

const NAVBAR_CSS = `
.twc-navbar { display: flex; align-items: center; gap: var(--space-4); height: 60px; padding: 0 var(--space-5);
  font-family: var(--font-sans); background: var(--color-surface); border-bottom: var(--border-thin) solid var(--color-border); }
.twc-navbar[data-sticky="true"] { position: sticky; top: 0; z-index: var(--z-sticky);
  background: color-mix(in srgb, var(--color-surface) 85%, transparent); backdrop-filter: blur(10px); }
.twc-navbar__brand { display: inline-flex; align-items: center; gap: var(--space-2-5); font-weight: var(--font-extrabold);
  font-size: var(--text-lg); letter-spacing: -0.02em; color: var(--color-text); text-decoration: none; flex: none; }
.twc-navbar__links { display: flex; align-items: center; gap: 2px; }
.twc-navbar__link { display: inline-flex; align-items: center; gap: 7px; padding: 8px 12px; border-radius: var(--radius-md);
  font-size: var(--text-sm); font-weight: var(--font-semibold); color: var(--color-text-muted); text-decoration: none; cursor: pointer;
  background: none; border: none; font-family: inherit; transition: background-color var(--duration-fast) var(--ease-standard), color var(--duration-fast) var(--ease-standard); }
.twc-navbar__link:hover { background: var(--color-surface-sunken); color: var(--color-text); }
.twc-navbar__link[data-active="true"] { color: var(--color-primary); background: var(--color-primary-subtle); }
.twc-navbar__link svg { width: 16px; height: 16px; }
.twc-navbar__spacer { flex: 1; }
.twc-navbar__actions { display: flex; align-items: center; gap: var(--space-2); flex: none; }
.twc-navbar__menu-btn { display: none; }
@media (max-width: 720px) {
  .twc-navbar__links { display: none; }
  .twc-navbar__menu-btn { display: inline-grid; }
}
`;

// Block javascript:/data:/vbscript: URLs (incl. whitespace/control-char obfuscation)
// from reaching a DOM href. Consumer hrefs are a trust boundary.
function safeHref(url) {
  if (url == null) return undefined;
  const s = String(url).replace(/[\x00-\x20]+/g, "").toLowerCase();
  return s.startsWith("javascript:") || s.startsWith("data:") || s.startsWith("vbscript:") ? undefined : url;
}

export function Navbar({
  brand,
  links = [],
  actions,
  sticky = true,
  onMenuClick,
  className = "",
  ...rest
}) {
  React.useEffect(() => {
    if (document.getElementById("twc-navbar-styles")) return;
    const el = document.createElement("style");
    el.id = "twc-navbar-styles";
    el.textContent = NAVBAR_CSS;
    document.head.appendChild(el);
  }, []);

  return (
    <header className={`twc-navbar ${className}`} data-sticky={sticky || undefined} {...rest}>
      {brand ? <a className="twc-navbar__brand" href="#">{brand}</a> : null}
      <nav className="twc-navbar__links">
        {links.map((l, i) => (
          <a key={i} className="twc-navbar__link" href={safeHref(l.href) || "#"} data-active={l.active || undefined} onClick={l.onClick}>
            {l.icon}{l.label}
          </a>
        ))}
      </nav>
      <span className="twc-navbar__spacer" />
      {actions ? <div className="twc-navbar__actions">{actions}</div> : null}
    </header>
  );
}
