import React from "react";
import { useScopedStyles } from "../_styles.js";
import { Avatar } from "./Avatar";
import { Menu } from "../overlay/Menu";

const AVATARMENU_CSS = `
.twc-avatar-menu { display: inline-flex; align-items: center; gap: var(--space-2); padding: 3px 4px 3px 3px; border: none; background: transparent;
  cursor: pointer; border-radius: var(--radius-full); font-family: var(--font-sans); color: var(--color-text);
  transition: background-color var(--duration-fast) var(--ease-standard); }
.twc-avatar-menu:hover { background: var(--color-surface-sunken); }
.twc-avatar-menu:focus-visible { outline: none; box-shadow: var(--ring); }
.twc-avatar-menu__text { display: flex; flex-direction: column; align-items: flex-start; gap: 0; min-width: 0; line-height: 1.2; }
.twc-avatar-menu__name { font-size: var(--text-sm); font-weight: var(--font-semibold); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 140px; }
.twc-avatar-menu__sub { font-size: var(--text-xs); color: var(--color-text-subtle); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 140px; }
.twc-avatar-menu__chev { color: var(--color-text-subtle); display: inline-flex; flex: none; margin-inline-end: 2px; transition: transform var(--duration-base) var(--ease-spring); }
.twc-avatar-menu__chev svg { width: 15px; height: 15px; }
/* #402: fullWidth — the trigger (and its Menu wrap) stretch, the text column grows, and the chevron is pinned
   to the inline-end, so a sidebar footer account row fills the rail. The compound .--block.twc-menu-wrap beats
   Menu's own .twc-menu-wrap rule regardless of scoped-stylesheet order. */
.twc-avatar-menu--block.twc-menu-wrap { display: flex; width: 100%; }
.twc-avatar-menu--block .twc-avatar-menu { display: flex; width: 100%; }
.twc-avatar-menu--block .twc-avatar-menu__text { flex: 1 1 auto; }
.twc-avatar-menu--block .twc-avatar-menu__name, .twc-avatar-menu--block .twc-avatar-menu__sub { max-width: none; }
`;

export function AvatarMenu({
  name,
  src,
  email,
  subtitle,
  status,
  size = "sm",
  items,
  showName = false,
  showChevron,
  fullWidth = false,
  align = "end",
  className = "",
  ...rest
}) {
  const __twcStyles = useScopedStyles("twc-avatar-menu-styles", AVATARMENU_CSS);

  const sub = subtitle ?? email;
  const showChev = showChevron ?? showName;

  const header = (
    <>
      <Avatar name={name} src={src} size="md" status={status} />
      <span className="twc-menu__header-main">
        <span className="twc-menu__header-title">{name}</span>
        {sub ? <span className="twc-menu__header-sub">{sub}</span> : null}
      </span>
    </>
  );

  const trigger = (
    <span
      className="twc-avatar-menu"
      role="button"
      tabIndex={0}
      aria-haspopup="menu"
      aria-label={`${name || "Account"} menu`}
    >
      {__twcStyles}
      <Avatar name={name} src={src} size={size} status={status} />
      {showName ? (
        <span className="twc-avatar-menu__text">
          <span className="twc-avatar-menu__name">{name}</span>
          {sub ? <span className="twc-avatar-menu__sub">{sub}</span> : null}
        </span>
      ) : null}
      {showChev ? (
        <span className="twc-avatar-menu__chev" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
        </span>
      ) : null}
    </span>
  );

  const wrapClass = `${fullWidth ? "twc-avatar-menu--block " : ""}${className}`.trim();
  return <Menu className={wrapClass} trigger={trigger} items={items} header={header} align={align} width={240} aria-label={`${name || "Account"} menu`} {...rest} />;
}
