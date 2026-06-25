# QA notes — Sidebar

- **Group:** navigation
- **Status:** clean
- **Reviewed:** 2026-06-17

## Open issues

- [x] **[P1] onClick items jump the page to `#`** — Nav items always render as `<a href={safeHref(it.href) || "#"}>`. The collapsed/uncontrolled demos and many real sidebars drive navigation purely from `onClick` with no `href`; because `href` defaults to `"#"` and no handler calls `preventDefault`, clicking scrolls the viewport to the top and pushes a `#` history entry. Same root cause as Navbar. _Fix:_ render a `<button>` when no `href` is supplied (also resolves the deferred render-as-button item), or drop the `"#"` fallback so the anchor is inert. `components/navigation/Sidebar.jsx:84`. — ✓ fixed 2026-06-17
- [x] **[P2] Collapsed labels are visually hidden but stay in the a11y tree** — In collapsed mode `.twc-sidebar__label`/`__badge` are hidden with `display: none` (good, fully removes them), but the row's accessible name then falls back to the first-letter "initial" span which is `aria-hidden="true"`, leaving the link with **no accessible name** for screen readers when there is no icon-with-label. The native `title` is set only when collapsed AND label is a string, which helps sighted hover but `title` is not a reliable accessible name. _Fix:_ keep an `aria-label={typeof it.label === "string" ? it.label : undefined}` on the anchor so the collapsed icon-only link is still announced. `components/navigation/Sidebar.jsx:84-92`. — ✓ fixed 2026-06-17
- [ ] **[deferred] Items render as `<a>` even with no href** — Items without `href` still emit an anchor pointing at `"#"`; see P1 for the consequence.
- [ ] **[deferred] index-as-key on items/sections** — `items.map((it, i) => … key={i})` uses the array index for both section headings and links; inserting/removing items can desync. `components/navigation/Sidebar.jsx:80-95`.

## Verified OK

- **safeHref sanitization:** `javascript:`/`data:`/`vbscript:` (incl. control-char obfuscation) stripped before the DOM href. `components/navigation/Sidebar.jsx:70-74`.
- **Collapse transition (smoothed 2026-06-25):** the rail eases `flex-basis`/`width`/`max-width` between 248px and 68px over `--duration-slow` with the `--ease-emphasis` curve. Text no longer `display:none`-pops — labels, badges, section headers and the brand wordmark **fade** (opacity), and items keep `justify-content: flex-start` (the icon naturally lands at 23px ≈ the 68px rail's centre) so nothing jolts to centre mid-animation. Sections also ease `max-height`/`padding` to 0. Fades are **directional**: instant on collapse, delayed (`--duration-fast`) on expand so the rail opens before text reappears. The collapsed head uses `padding-inline: 18px 0` so the brand mark sits ≈ centred in the 68px rail **without a right padding that would clip a mark wider than the icons** (a `0 23px` symmetric padding clipped a 30px logo — fixed 2026-06-25). Chevron still rotates 180° via `data-collapsed`. `components/navigation/Sidebar.jsx`.
  - **a11y preserved:** the faded label/badge/section/brand-text also flip to `visibility: hidden` (with a delayed `visibility` transition, so the fade still shows) — this keeps them out of the accessibility tree when collapsed, exactly as the old `display:none` did, while the collapsed icon row stays named by its `aria-label` (see P2 above).
- **Collapse toggle a11y:** `<button type="button">` with `aria-label` that flips between "Expand sidebar"/"Collapse sidebar". Controlled (`collapsed`) vs uncontrolled (`defaultCollapsed`) handled correctly; `onCollapsedChange` always fires. `components/navigation/Sidebar.jsx:65-67,102`.
- **Active state:** `aria-current="page"` + `data-active` styling. `components/navigation/Sidebar.jsx:84-85`.
- **Semantics:** root `<aside>`, items wrapped in `<nav>`, section labels are non-interactive `<div>`s.
- **RTL:** uses `border-inline-end`, `text-align: start`, `margin-inline-start` and logical layout throughout — mirrors correctly under `dir="rtl"`. `components/navigation/Sidebar.jsx:5,17`.
- **Density:** padding uses spacing tokens; nothing blocks the `data-density` remap.
- **SSR-safe:** style injection in `useInsertionEffect`; no module/render-scope DOM access.
