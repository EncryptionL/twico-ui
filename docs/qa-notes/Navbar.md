# QA notes — Navbar

- **Group:** navigation
- **Status:** open
- **Reviewed:** 2026-06-17

## Open issues

- [x] **[P1] onClick links jump the page to `#`** — Links always render as `<a href={safeHref(l.href) || "#"}>`. When a consumer supplies only `onClick` (no `href`) — exactly the pattern the docs demo ships (`onClick: () => setActive(label)`, no `preventDefault`) — the click both fires the handler and navigates the anchor to `"#"`, scrolling the viewport to the top and pushing a `#` history entry. The library bakes this in by defaulting `href` to `"#"`. _Fix:_ render the link as a `<button>` when no `href` is provided (also resolves the deferred render-as-button item), or omit `href` entirely so the anchor is non-navigable. `components/navigation/Navbar.jsx:65`. — ✓ fixed 2026-06-17
- [ ] **[P2] Brand is a hardcoded `href="#"` anchor** — `brand` always renders as `<a className="twc-navbar__brand" href="#">`, with no way to pass a real href or onClick. Clicking the logo scrolls to top and adds a `#` history entry; there is no API to make it a home link or a non-interactive node. _Fix:_ accept `brandHref`/`onBrandClick` (or render a plain `<span>` when neither is given) instead of a fixed `#` anchor. `components/navigation/Navbar.jsx:62`.
- [ ] **[deferred] Links render as `<a>` even with no href** — Items without an `href` still emit an anchor (`href="#"`), so semantically they are links pointing nowhere. Deferred per review scope; see P1 above for the user-visible consequence.
- [ ] **[deferred] index-as-key on links** — `links.map((l, i) => <a key={i} …>)` uses the array index; reordering/filtering links can desync state. Low impact for a typically-static nav. `components/navigation/Navbar.jsx:64`.

## Verified OK

- **safeHref sanitization:** `javascript:`/`data:`/`vbscript:` schemes (including `\x00-\x20` whitespace/control-char obfuscation) are stripped before reaching the DOM href. `components/navigation/Navbar.jsx:32-36`.
- **Sticky + backdrop-filter:** `position: sticky; top: 0` with `backdrop-filter: blur(10px)` and translucent surface; `z-index: var(--z-sticky)`. The blur creates a containing block for descendant `position: fixed` — a known gotcha for consumers portaling INTO the bar, but the navbar itself portals nothing, so it is self-consistent.
- **Mobile collapse:** `@media (max-width: 720px)` hides `.twc-navbar__links` and shows the hamburger (`display: inline-grid`). The menu button only renders when `onMenuClick` is supplied; it is `type="button"`, has `aria-label="Open menu"`, and a `:focus-visible` ring.
- **Active state a11y:** active link gets `aria-current="page"` plus `data-active` styling. `components/navigation/Navbar.jsx:65-66`.
- **Semantics:** root is `<header>`, links are wrapped in a `<nav>`. Actions slot is a passthrough.
- **SSR-safe:** style injection is in `useInsertionEffect`; no `window`/`document` access at module or render scope.
- **RTL:** uses `gap`/flex and the actions sit after a `flex:1` spacer, so the layout mirrors under `dir="rtl"` without physical-side assumptions.
- **Reduced-motion:** only color/background transitions on links — no large motion to suppress.
