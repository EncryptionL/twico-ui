# QA notes — Sidebar

- **Group:** navigation
- **Status:** open
- **Reviewed:** 2026-06-17

## Open issues

- [ ] **[P1] onClick items jump the page to `#`** — Nav items always render as `<a href={safeHref(it.href) || "#"}>`. The collapsed/uncontrolled demos and many real sidebars drive navigation purely from `onClick` with no `href`; because `href` defaults to `"#"` and no handler calls `preventDefault`, clicking scrolls the viewport to the top and pushes a `#` history entry. Same root cause as Navbar. _Fix:_ render a `<button>` when no `href` is supplied (also resolves the deferred render-as-button item), or drop the `"#"` fallback so the anchor is inert. `components/navigation/Sidebar.jsx:84`.
- [ ] **[P2] Collapsed labels are visually hidden but stay in the a11y tree** — In collapsed mode `.twc-sidebar__label`/`__badge` are hidden with `display: none` (good, fully removes them), but the row's accessible name then falls back to the first-letter "initial" span which is `aria-hidden="true"`, leaving the link with **no accessible name** for screen readers when there is no icon-with-label. The native `title` is set only when collapsed AND label is a string, which helps sighted hover but `title` is not a reliable accessible name. _Fix:_ keep an `aria-label={typeof it.label === "string" ? it.label : undefined}` on the anchor so the collapsed icon-only link is still announced. `components/navigation/Sidebar.jsx:84-92`.
- [ ] **[deferred] Items render as `<a>` even with no href** — Items without `href` still emit an anchor pointing at `"#"`; see P1 for the consequence.
- [ ] **[deferred] index-as-key on items/sections** — `items.map((it, i) => … key={i})` uses the array index for both section headings and links; inserting/removing items can desync. `components/navigation/Sidebar.jsx:80-95`.

## Verified OK

- **safeHref sanitization:** `javascript:`/`data:`/`vbscript:` (incl. control-char obfuscation) stripped before the DOM href. `components/navigation/Sidebar.jsx:70-74`.
- **Collapse transition:** animates `flex-basis`/`width`/`max-width` between 248px and 68px; `overflow:hidden` clips labels during the transition. The collapse chevron rotates 180° via `data-collapsed`. `components/navigation/Sidebar.jsx:6-8,38-39`.
- **Collapse toggle a11y:** `<button type="button">` with `aria-label` that flips between "Expand sidebar"/"Collapse sidebar". Controlled (`collapsed`) vs uncontrolled (`defaultCollapsed`) handled correctly; `onCollapsedChange` always fires. `components/navigation/Sidebar.jsx:65-67,102`.
- **Active state:** `aria-current="page"` + `data-active` styling. `components/navigation/Sidebar.jsx:84-85`.
- **Semantics:** root `<aside>`, items wrapped in `<nav>`, section labels are non-interactive `<div>`s.
- **RTL:** uses `border-inline-end`, `text-align: start`, `margin-inline-start` and logical layout throughout — mirrors correctly under `dir="rtl"`. `components/navigation/Sidebar.jsx:5,17`.
- **Density:** padding uses spacing tokens; nothing blocks the `data-density` remap.
- **SSR-safe:** style injection in `useInsertionEffect`; no module/render-scope DOM access.
