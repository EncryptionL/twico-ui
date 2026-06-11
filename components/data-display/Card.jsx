import React from "react";

const CARD_CSS = `
.twc-card {
  display: flex; flex-direction: column;
  background: var(--color-surface);
  border-radius: var(--radius-lg);
  font-family: var(--font-sans); color: var(--color-text);
  overflow: hidden;
  transition: box-shadow var(--duration-base) var(--ease-standard),
              transform var(--duration-base) var(--ease-spring),
              border-color var(--duration-base) var(--ease-standard);
}
.twc-card[data-variant="elevated"] { box-shadow: var(--shadow-md); border: var(--border-thin) solid transparent; }
.twc-card[data-variant="outline"] { border: var(--border-thin) solid var(--color-border); }
.twc-card[data-variant="soft"] { background: var(--color-surface-sunken); border: var(--border-thin) solid transparent; }
.twc-card[data-interactive="true"] { cursor: pointer; }
.twc-card[data-interactive="true"]:hover { transform: translateY(-3px); box-shadow: var(--shadow-lg); border-color: var(--color-primary-border); }
.twc-card[data-pad="md"] { padding: var(--space-5); }
.twc-card[data-pad="lg"] { padding: var(--space-6); }
.twc-card[data-pad="none"] { padding: 0; }
.twc-card__header { display: flex; flex-direction: column; gap: 2px; margin-bottom: var(--space-3); }
.twc-card__title { font-size: var(--text-lg); font-weight: var(--font-bold); letter-spacing: -0.01em; }
.twc-card__subtitle { font-size: var(--text-sm); color: var(--color-text-muted); }
.twc-card__body { font-size: var(--text-sm); color: var(--color-text-muted); line-height: var(--leading-normal); }
.twc-card__footer { margin-top: var(--space-4); display: flex; gap: var(--space-2); align-items: center; }
`;

export function Card({
  children,
  title,
  subtitle,
  footer,
  variant = "elevated",
  padding = "md",
  interactive = false,
  className = "",
  ...rest
}) {
  React.useEffect(() => {
    if (document.getElementById("twc-card-styles")) return;
    const el = document.createElement("style");
    el.id = "twc-card-styles";
    el.textContent = CARD_CSS;
    document.head.appendChild(el);
  }, []);

  return (
    <div
      className={`twc-card ${className}`}
      data-variant={variant}
      data-pad={padding}
      data-interactive={interactive || undefined}
      {...rest}
    >
      {(title || subtitle) ? (
        <div className="twc-card__header">
          {title ? <div className="twc-card__title">{title}</div> : null}
          {subtitle ? <div className="twc-card__subtitle">{subtitle}</div> : null}
        </div>
      ) : null}
      {children ? <div className="twc-card__body">{children}</div> : null}
      {footer ? <div className="twc-card__footer">{footer}</div> : null}
    </div>
  );
}
