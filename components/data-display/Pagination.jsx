import React from "react";

const PAGINATION_CSS = `
.twc-pagination { display: inline-flex; align-items: center; gap: 4px; font-family: var(--font-sans); }
.twc-page {
  display: inline-grid; place-items: center; min-width: 36px; height: 36px; padding: 0 8px;
  font-size: var(--text-sm); font-weight: var(--font-medium); color: var(--color-text-muted);
  background: transparent; border: var(--border-thin) solid transparent; border-radius: var(--radius-md);
  cursor: pointer;
  transition: background-color var(--duration-fast) var(--ease-standard), color var(--duration-fast) var(--ease-standard), transform var(--duration-fast) var(--ease-spring);
}
.twc-page:hover:not(:disabled):not([data-active="true"]) { background: var(--color-surface-sunken); color: var(--color-text); }
.twc-page:active:not(:disabled) { transform: scale(0.9); }
.twc-page:focus-visible { outline: none; box-shadow: var(--ring); }
.twc-page[data-active="true"] { background: var(--color-primary); color: var(--color-primary-fg); font-weight: var(--font-semibold); }
.twc-page:disabled { opacity: 0.4; cursor: not-allowed; }
.twc-page svg { width: 17px; height: 17px; }
[dir="rtl"] .twc-page svg { transform: scaleX(-1); }
.twc-page__ellipsis { color: var(--color-text-subtle); cursor: default; }
.twc-page[data-size="sm"] { min-width: 30px; height: 30px; font-size: var(--text-xs); }
.twc-page[data-size="lg"] { min-width: 42px; height: 42px; font-size: var(--text-base); }
.twc-page[data-size="lg"] svg { width: 20px; height: 20px; }
.twc-pagination__jump { display: inline-flex; align-items: center; gap: 7px; margin-inline-start: 8px;
  font-size: var(--text-sm); color: var(--color-text-muted); white-space: nowrap; }
.twc-pagination__jump input {
  width: 56px; height: 34px; text-align: center; box-sizing: border-box;
  font-family: inherit; font-size: var(--text-sm); color: var(--color-text);
  background: var(--color-surface); border: var(--border-thin) solid var(--color-border);
  border-radius: var(--radius-md); outline: none; -moz-appearance: textfield;
  transition: border-color var(--duration-fast) var(--ease-standard), box-shadow var(--duration-fast) var(--ease-standard);
}
.twc-pagination__jump input::-webkit-outer-spin-button,
.twc-pagination__jump input::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
.twc-pagination__jump input:hover { border-color: var(--color-border-strong); }
.twc-pagination__jump input:focus { border-color: var(--color-primary); box-shadow: var(--ring); }
.twc-pagination__jump[data-size="sm"] input { height: 30px; width: 50px; }
.twc-pagination__jump[data-size="lg"] input { height: 40px; width: 62px; font-size: var(--text-base); }
`;

function range(start, end) {
  const r = [];
  for (let i = start; i <= end; i++) r.push(i);
  return r;
}

function buildPages(current, total, siblings = 1, boundaries = 1) {
  // Always show `boundaries` pages at each edge + current ± siblings, ellipsis between.
  const pages = new Set();
  for (let i = 1; i <= boundaries; i++) { pages.add(i); pages.add(total - i + 1); }
  for (let i = current - siblings; i <= current + siblings; i++) pages.add(i);
  const valid = [...pages].filter((p) => p >= 1 && p <= total).sort((a, b) => a - b);
  // Collapse if the gap-with-ellipsis would be no shorter than just showing the page.
  const out = [];
  let prev = 0;
  for (const p of valid) {
    if (p - prev === 2) out.push(prev + 1);
    else if (p - prev > 2) out.push("…");
    out.push(p);
    prev = p;
  }
  return out;
}

export function Pagination({
  page: pageProp,
  defaultPage = 1,
  total,
  onChange,
  siblings = 1,
  boundaries = 1,
  size = "md",
  showJumper = false,
  showPageJumper,
  jumperLabel = "Go to",
  className = "",
  ...rest
}) {
  // `showPageJumper` is the preferred alias for `showJumper`; either enables the input.
  const jumperEnabled = showPageJumper ?? showJumper;
  React.useInsertionEffect(() => {
    if (document.getElementById("twc-pagination-styles")) return;
    const el = document.createElement("style");
    el.id = "twc-pagination-styles";
    el.textContent = PAGINATION_CSS;
    document.head.appendChild(el);
  }, []);

  const [internal, setInternal] = React.useState(defaultPage);
  const page = pageProp !== undefined ? pageProp : internal;
  const pages = buildPages(page, total, siblings, boundaries);
  const go = (p) => {
    if (p < 1 || p > total || p === page) return;
    if (pageProp === undefined) setInternal(p);
    onChange?.(p);
  };
  const [jump, setJump] = React.useState("");
  const submitJump = () => {
    const n = parseInt(jump, 10);
    if (!Number.isNaN(n)) go(Math.min(Math.max(n, 1), total));
    setJump("");
  };

  return (
    <nav className={`twc-pagination ${className}`} aria-label="Pagination" {...rest}>
      <button type="button" className="twc-page" data-size={size} onClick={() => go(page - 1)} disabled={page <= 1} aria-label="Previous page">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
      </button>
      {pages.map((p, i) =>
        p === "…" ? (
          <span key={`e${i}`} className="twc-page twc-page__ellipsis" aria-hidden="true">…</span>
        ) : (
          <button key={p} type="button" className="twc-page" data-size={size} data-active={p === page || undefined}
                  aria-current={p === page ? "page" : undefined} onClick={() => go(p)}>
            {p}
          </button>
        )
      )}
      <button type="button" className="twc-page" data-size={size} onClick={() => go(page + 1)} disabled={page >= total} aria-label="Next page">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
      </button>
      {jumperEnabled && total > 1 ? (
        <span className="twc-pagination__jump" data-size={size}>
          {jumperLabel}
          <input type="number" min={1} max={total} value={jump} placeholder={String(page)}
            aria-label="Go to page"
            onChange={(e) => setJump(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); submitJump(); } }}
            onBlur={submitJump} />
        </span>
      ) : null}
    </nav>
  );
}
