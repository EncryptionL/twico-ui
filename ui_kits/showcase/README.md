# Showcase site — UI kit

The Twico UI marketing / documentation landing page. It is the canonical example of
the library "selling itself" and doubles as a live component playground.

## Files
- `index.html` — app shell. Loads `styles.css`, the compiled `_ds_bundle.js`, Lucide, and the
  section scripts below, then mounts `<App>` with a working light/dark toggle.
- `Nav.jsx` — sticky translucent top bar: logo, nav links, GitHub stars, dark-mode toggle, CTA.
- `Hero.jsx` — headline, subhead, primary/secondary CTAs, and a copy-to-clipboard install command.
- `Showcase.jsx` — a framed "browser window" playground with pill `Tabs` switching between
  live **Buttons**, **Forms**, and **Data** (Table + Pagination) panels.
- `Features.jsx` — six interactive feature cards (themeable, dark mode, motion, responsive, a11y, free).
- `Footer.jsx` — gradient CTA band + link columns + legal bar.

## Interactions
- The **moon/sun** button in the nav toggles `.dark` on the app root — the whole page re-themes.
- The playground tabs animate a sliding indicator and swap live component demos.
- The table header sorts; pagination updates the page; buttons ripple; the install command copies.

## Composition
Every visible control is a real component from `window.TwicoUiDesignSystem_f2f16a`
(Button, IconButton, Input, Select, Checkbox, Radio, Switch, Card, Badge, Tag, Avatar,
Table, Pagination, Tabs, Spinner). Nothing is re-implemented locally — layout and copy only.
