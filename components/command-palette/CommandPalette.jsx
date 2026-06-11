import React from "react";
import { createPortal } from "react-dom";

const COMMAND_CSS = `
.twc-cmdk__overlay { position: fixed; inset: 0; z-index: var(--z-modal); background: var(--color-overlay); backdrop-filter: blur(3px);
  display: flex; align-items: flex-start; justify-content: center; padding-top: 12vh; }
.twc-cmdk__overlay[data-state="open"] { animation: twico-fade-in var(--duration-base) var(--ease-out); }
.twc-cmdk__overlay[data-state="closed"] { animation: twc-cmdk-fade-out 150ms var(--ease-in) forwards; pointer-events: none; }
.twc-cmdk { width: 100%; max-width: 560px; max-height: 60vh; display: flex; flex-direction: column; overflow: hidden;
  background: var(--color-surface-raised); border: var(--border-thin) solid var(--color-border); border-radius: var(--radius-2xl);
  box-shadow: var(--shadow-xl); font-family: var(--font-sans); }
.twc-cmdk[data-state="open"] { animation: twico-pop-in var(--duration-base) var(--ease-spring); }
.twc-cmdk[data-state="closed"] { animation: twc-cmdk-pop-out 150ms var(--ease-in) forwards; }
@keyframes twc-cmdk-fade-out { from { opacity: 1; } to { opacity: 0; } }
@keyframes twc-cmdk-pop-out { from { opacity: 1; transform: none; } to { opacity: 0; transform: translateY(-8px) scale(0.985); } }
@media (prefers-reduced-motion: reduce) {
  .twc-cmdk__overlay[data-state], .twc-cmdk[data-state] { animation-duration: 1ms; }
}
.twc-cmdk__search { display: flex; align-items: center; gap: var(--space-3); padding: var(--space-4) var(--space-5); border-bottom: var(--border-thin) solid var(--color-divider); }
.twc-cmdk__search svg { width: 20px; height: 20px; color: var(--color-text-subtle); flex: none; }
.twc-cmdk__input { flex: 1; min-width: 0; border: none; outline: none; background: transparent; font-family: inherit; font-size: var(--text-lg); color: var(--color-text); }
.twc-cmdk__input:focus, .twc-cmdk__input:focus-visible { outline: none; box-shadow: none; }
.twc-cmdk__input::placeholder { color: var(--color-text-subtle); }
.twc-cmdk__kbd { flex: none; font-family: var(--font-mono); font-size: 11px; color: var(--color-text-subtle); padding: 3px 7px; border-radius: var(--radius-sm); background: var(--color-surface-sunken); border: var(--border-thin) solid var(--color-border); }
.twc-cmdk__list { flex: 1; overflow-y: auto; padding: var(--space-2); }
.twc-cmdk__group-label { font-size: 10px; font-weight: var(--font-bold); letter-spacing: var(--tracking-wider); text-transform: uppercase; color: var(--color-text-subtle); padding: var(--space-3) var(--space-3) var(--space-1); }
.twc-cmdk__item { display: flex; align-items: center; gap: var(--space-3); width: 100%; padding: 10px 12px; border: none; background: none; cursor: pointer;
  font-family: inherit; font-size: var(--text-sm); color: var(--color-text); text-align: left; border-radius: var(--radius-md); }
.twc-cmdk__item[data-active="true"] { background: var(--color-primary-subtle); color: var(--color-primary-subtle-fg); }
.twc-cmdk__item-ic { flex: none; display: inline-flex; color: var(--color-text-muted); }
.twc-cmdk__item[data-active="true"] .twc-cmdk__item-ic { color: var(--color-primary); }
.twc-cmdk__item-ic svg { width: 18px; height: 18px; }
.twc-cmdk__item-main { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 1px; }
.twc-cmdk__item-label { font-weight: var(--font-medium); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.twc-cmdk__item-desc { font-size: var(--text-xs); color: var(--color-text-subtle); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.twc-cmdk__item-sc { flex: none; font-family: var(--font-mono); font-size: 11px; color: var(--color-text-subtle); }
.twc-cmdk__empty { padding: var(--space-8); text-align: center; color: var(--color-text-subtle); font-size: var(--text-sm); }
`;

export function CommandPalette({
  open,
  onClose,
  commands,
  placeholder = "Type a command or search…",
  emptyText = "No results found",
  className = "",
  ...rest
}) {
  React.useInsertionEffect(() => {
    if (document.getElementById("twc-cmdk-styles")) return;
    const el = document.createElement("style");
    el.id = "twc-cmdk-styles";
    el.textContent = COMMAND_CSS;
    document.head.appendChild(el);
  }, []);

  const [query, setQuery] = React.useState("");
  const [active, setActive] = React.useState(0);
  const inputRef = React.useRef(null);
  const listRef = React.useRef(null);

  // Stay mounted through the exit animation so closing is smooth, then unmount.
  const [mounted, setMounted] = React.useState(open);
  React.useEffect(() => {
    if (open) { setMounted(true); return; }
    const t = setTimeout(() => setMounted(false), 170);
    return () => clearTimeout(t);
  }, [open]);

  React.useEffect(() => {
    if (open) { setQuery(""); setActive(0); const t = setTimeout(() => inputRef.current?.focus(), 30); return () => clearTimeout(t); }
  }, [open]);

  const q = query.trim().toLowerCase();
  const filtered = React.useMemo(() => commands.filter((c) =>
    !q || c.label.toLowerCase().includes(q) || (c.keywords || "").toLowerCase().includes(q) || (c.group || "").toLowerCase().includes(q)
  ), [commands, q]);

  // group while preserving order; build flat index for keyboard nav
  const groups = [];
  const flat = [];
  filtered.forEach((c) => {
    const key = c.group || "";
    let g = groups.find((x) => x.key === key);
    if (!g) { g = { key, items: [] }; groups.push(g); }
    g.items.push(c); flat.push(c);
  });

  React.useEffect(() => { setActive(0); }, [query]);

  const run = (cmd) => { cmd?.onSelect?.(); onClose?.(); };

  function onKeyDown(e) {
    if (e.key === "ArrowDown") { e.preventDefault(); setActive((a) => Math.min(a + 1, flat.length - 1)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setActive((a) => Math.max(a - 1, 0)); }
    else if (e.key === "Enter") { e.preventDefault(); run(flat[active]); }
    else if (e.key === "Escape") { e.preventDefault(); onClose?.(); }
  }

  React.useEffect(() => {
    const node = listRef.current?.querySelector('[data-active="true"]');
    if (node) node.scrollIntoView({ block: "nearest" });
  }, [active]);

  if (!mounted) return null;
  const state = open ? "open" : "closed";
  let idx = -1;

  const overlay = (
    <div className="twc-cmdk__overlay" data-state={state} onMouseDown={(e) => { if (e.target === e.currentTarget) onClose?.(); }}>
      <div className={`twc-cmdk ${className}`} data-state={state} role="dialog" aria-modal="true" aria-label="Command palette" {...rest}>
        <div className="twc-cmdk__search">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
          <input ref={inputRef} className="twc-cmdk__input" value={query} placeholder={placeholder}
            onChange={(e) => setQuery(e.target.value)} onKeyDown={onKeyDown} />
          <span className="twc-cmdk__kbd">esc</span>
        </div>
        <div className="twc-cmdk__list" ref={listRef}>
          {flat.length === 0 ? <div className="twc-cmdk__empty">{emptyText}</div> :
            groups.map((g) => (
              <div key={g.key || "_"} role="group">
                {g.key ? <div className="twc-cmdk__group-label">{g.key}</div> : null}
                {g.items.map((c) => {
                  idx += 1; const i = idx;
                  return (
                    <button key={c.id || i} className="twc-cmdk__item" role="option" aria-selected={i === active}
                      data-active={i === active || undefined} onMouseEnter={() => setActive(i)}
                      onMouseDown={(e) => e.preventDefault()} onClick={() => run(c)}>
                      {c.icon ? <span className="twc-cmdk__item-ic" aria-hidden="true">{c.icon}</span> : null}
                      <span className="twc-cmdk__item-main">
                        <span className="twc-cmdk__item-label">{c.label}</span>
                        {c.description ? <span className="twc-cmdk__item-desc">{c.description}</span> : null}
                      </span>
                      {c.shortcut ? <span className="twc-cmdk__item-sc">{c.shortcut}</span> : null}
                    </button>
                  );
                })}
              </div>
            ))}
        </div>
      </div>
    </div>
  );

  // Portal to <body> so the overlay escapes any transformed / backdrop-filtered
  // ancestor (e.g. a sticky navbar) that would otherwise become its containing block.
  const RD = typeof createPortal === "function" ? createPortal : null;
  return RD ? RD(overlay, document.body) : overlay;
}
