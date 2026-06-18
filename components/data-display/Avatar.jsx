import React from "react";

const AVATAR_CSS = `
.twc-avatar {
  --_sz: 40px;
  position: relative; flex: none; display: inline-grid; place-items: center;
  width: var(--_sz); height: var(--_sz);
  border-radius: var(--radius-full);
  background: var(--color-primary-subtle); color: var(--color-primary-subtle-fg);
  font-family: var(--font-sans); font-weight: var(--font-semibold);
  font-size: calc(var(--_sz) * 0.4); line-height: 1;
  overflow: visible; user-select: none;
}
.twc-avatar[data-size="xs"] { --_sz: 24px; }
.twc-avatar[data-size="sm"] { --_sz: 32px; }
.twc-avatar[data-size="lg"] { --_sz: 56px; }
.twc-avatar[data-size="xl"] { --_sz: 72px; }
.twc-avatar__img { width: 100%; height: 100%; border-radius: var(--radius-full); object-fit: cover; }
.twc-avatar[data-square="true"], .twc-avatar[data-square="true"] .twc-avatar__img { border-radius: var(--radius-md); }
.twc-avatar__ring { box-shadow: 0 0 0 2px var(--color-surface), 0 0 0 4px var(--color-primary); }
.twc-avatar__status {
  position: absolute; inset-inline-end: 0; bottom: 0;
  width: 28%; height: 28%; min-width: 8px; min-height: 8px;
  border-radius: var(--radius-full); border: 2px solid var(--color-surface);
}
.twc-avatar__status[data-status="online"] { background: var(--color-success); }
.twc-avatar__status[data-status="busy"] { background: var(--color-danger); }
.twc-avatar__status[data-status="away"] { background: var(--color-warning); }
.twc-avatar__status[data-status="offline"] { background: var(--color-text-subtle); }
`;

function initials(name) {
  if (!name) return "?";
  const trimmed = name.trim();
  if (!trimmed) return "?";
  const parts = trimmed.split(/\s+/);
  return (parts[0][0] + (parts[1] ? parts[1][0] : "")).toUpperCase();
}

// Block javascript:/vbscript: URLs (incl. whitespace/control-char obfuscation that
// browsers strip) from reaching the <img> src; data:/blob: stay allowed for previews.
function safeSrc(url) {
  if (url == null) return undefined;
  const s = String(url).replace(/[\x00-\x20]+/g, "").toLowerCase();
  return s.startsWith("javascript:") || s.startsWith("vbscript:") ? undefined : url;
}

export function Avatar({
  src,
  name,
  size = "md",
  square = false,
  status,
  ring = false,
  className = "",
  ...rest
}) {
  React.useInsertionEffect(() => {
    if (document.getElementById("twc-avatar-styles")) return;
    const el = document.createElement("style");
    el.id = "twc-avatar-styles";
    el.textContent = AVATAR_CSS;
    document.head.appendChild(el);
  }, []);

  const [errored, setErrored] = React.useState(false);
  const cleanSrc = safeSrc(src);
  const showImg = cleanSrc && !errored;

  return (
    <span
      className={`twc-avatar ${ring ? "twc-avatar__ring" : ""} ${className}`}
      data-size={size}
      data-square={square || undefined}
      role="img"
      aria-label={name || "avatar"}
      {...rest}
    >
      {showImg
        ? <img key={cleanSrc} className="twc-avatar__img" src={cleanSrc} alt={name || ""} onError={() => setErrored(true)} />
        : initials(name)}
      {status ? <span className="twc-avatar__status" data-status={status} /> : null}
    </span>
  );
}
