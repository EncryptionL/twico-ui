# Dashboard — UI kit

A real admin-dashboard screen that composes Twico UI primitives into a working product view.

## Files
- `index.html` — app shell + layout CSS. Loads `styles.css`, the compiled `_ds_bundle.js`, Lucide,
  `data.js`, and `DashboardApp.jsx`, then mounts `<DashboardApp>`.
- `data.js` — mock members + activity feed (`window.DASH_MEMBERS`, `window.DASH_ACTIVITY`).
- `DashboardApp.jsx` — the screen: a collapsible **Sidebar**, a top **Navbar** (with a ⌘K search
  button + dark-mode toggle), a KPI row of four **Stat** cards, a **Datatable** of members
  (checkbox selection, batch actions, pinned actions column, aggregation footer, export), a
  **Timeline** activity panel, and a **CommandPalette** wired to ⌘K / Ctrl K.

## Interactions
- **⌘K / Ctrl K** (or the Search button) opens the command palette; "Toggle dark mode" re-themes.
- The theme toggle in the navbar flips the `.dark` class on `<html>` (where the dark tokens
  live), so the whole page — body, scroll area, and portaled menus/command palette — re-themes.
- The sidebar collapses; the members table sorts/filters/paginates/selects and exports.

## Composition
Every element is a real component from `window.TwicoUiDesignSystem_f2f16a` — Sidebar, Navbar, Stat,
Datatable, Timeline, Avatar, Badge, Button, IconButton, CommandPalette. Layout + mock data only;
no primitive is re-implemented here.
