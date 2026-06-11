# Twico UI — Design System

**Twico UI** is a completely free, open-source (MIT) React + Tailwind CSS component
library. It provides modern, fully themeable UI components for web applications, with
**dark mode**, **lively motion**, **responsive** layouts, and **rounded** geometry
throughout — *no pointy corners*. Every color, radius, shadow, and font is a CSS custom
property, so the entire system can be re-skinned by overriding a handful of variables.

This project is the **design source of truth** for Twico UI. The component library
itself is being built (with Claude Code) against the foundations, tokens, and React
recreations defined here.

> **Brand personality:** crisp & professional — clean, confident, restrained.
> **Primary:** Indigo `#6366F1` · **Type:** Plus Jakarta Sans · **Icons:** Lucide ·
> **Motion:** lively (spring + ripple) · **Modes:** light & dark, equally supported.

---

## Sources & references

- **Origin repo:** `https://github.com/EncryptionL/twico-ui` — *empty at time of authoring*
  (no committed code yet). The visual identity below was created from scratch to match the
  product brief, not reverse-engineered from existing source. When the repo has code,
  re-read it and reconcile any divergence.
- **Design north stars** (for ergonomics & coverage, not copied):
  [Material UI](https://mui.com), [Chakra UI](https://chakra-ui.com),
  [Bootstrap](https://getbootstrap.com), [Materialize](https://materializecss.com).
- **Fonts:** [Plus Jakarta Sans](https://github.com/google/fonts/tree/main/ofl/plusjakartasans)
  and [JetBrains Mono](https://github.com/google/fonts/tree/main/ofl/jetbrainsmono) — both OFL,
  self-hosted in `assets/fonts/`.
- **Icons:** [Lucide](https://lucide.dev) (ISC license), loaded from CDN.

Readers with access should explore the origin repo and the reference libraries above to
build richer, more faithful designs on top of Twico UI.

---

## CONTENT FUNDAMENTALS — how Twico UI writes

The voice is **confident, plain, and developer-friendly** — the tone of a well-run open
source project, not a sales page.

- **Person:** Speak to the developer as **"you"**; the project refers to itself as
  **"Twico UI"** or **"we"**. (*"Drive it with `open` + `onClose`."* / *"We ship dark mode
  out of the box."*)
- **Casing:** **Sentence case** everywhere — buttons, headings, labels, menu items
  (*"Get started"*, *"Create account"*, not *"Get Started"*). The only uppercase is the
  small eyebrow/label style (tracked-out, 12px) and table column headers.
- **Brand name:** Written **"Twico UI"** in prose. The wordmark styles it lowercase as
  **twico**`UI` with the *UI* in the primary color.
- **Length:** Short and declarative. Headlines are 3–7 words
  (*"The free React + Tailwind component library"*). Body copy is one or two tight sentences.
- **Numbers & claims:** Concrete and honest — *"24 components"*, *"MIT licensed"*,
  *"free forever"*. No vague superlatives, no fake metrics.
- **Buttons/CTAs:** Verb-first and specific — *"Get started"*, *"Star on GitHub"*,
  *"Create account"*, *"Delete project"*. Avoid "Click here" / "Submit".
- **Emoji:** **Not used** in product UI or docs. Personality comes from motion and color,
  not emoji.
- **Microcopy vibe:** Friendly but precise. Helper text explains, error text is direct
  (*"Must be at least 8 characters"*). Empty/destructive states are calm and clear
  (*"This action cannot be undone."*).

---

## VISUAL FOUNDATIONS

### Color
- **Primary** is Indigo (`--brand-500` = `#6366F1`) with a full 50–950 scale. Hover deepens
  to 600, active to 700. In dark mode hover *lightens* (400) instead.
- **Neutrals** are Slate (cool gray). Text is `slate-900` on light / `slate-50` on dark;
  borders are `slate-200` / a tuned `#25324a`.
- **Semantics:** success = emerald, warning = amber, danger = rose, info = sky. Each ships
  `solid`, `subtle` (tinted bg), and `subtle-fg` variants that flip per mode.
- **Theming model:** semantic aliases (`--color-primary`, `--color-surface`, `--color-text`…)
  reference primitive scales. Override `--brand-*` to reskin, or override the aliases directly
  for a one-off theme. Dark mode is a `.dark` / `[data-theme="dark"]` scope that only
  remaps the aliases.

### Type
- **Plus Jakarta Sans** for everything UI — geometric, friendly, modern. Weights 200–800
  (variable). Display/headings use 700–800 with tight tracking (`-0.03em` to `-0.01em`).
- **JetBrains Mono** for code, install commands, table-ish numerics, and shortcut hints.
- Modular scale from `--text-xs` (12) to `--text-7xl` (72); body is 16/1.5.

### Shape & corners
- **Nothing is sharp.** Base control radius is `--radius-md` (**10px**) for buttons, inputs,
  selects, badges. Cards/menus use `lg` (14), large panels `xl`/`2xl` (18/24), pills &
  avatars `full`. Border width is a hairline 1px (1.5px on toggles/checks).

### Elevation & borders
- Shadows are **soft and slate-tinted**, never harsh — a 5-step scale (`xs`→`xl`) plus a
  **brand glow** (`--shadow-brand`) used on primary-button hover and the logo tile. Dark mode
  swaps to deeper black-based shadows.
- Cards are defined by a **hairline border + soft shadow** (elevated) or border-only (outline)
  or a sunken tint (soft). Hover on interactive cards lifts `-3px` and adds a brand-tinted border.

### Backgrounds & texture
- App background is a near-white slate (`--color-bg`); surfaces are pure white (dark: slate-900
  on slate-950). The hero uses a subtle **dotted grid** masked with a radial fade — the only
  decorative texture. **No heavy gradients** except one tasteful indigo CTA band. No photography
  is required by the system (imagery is opt-in per product).

### Motion (lively)
- **Entrances:** spring/`ease-spring` (cubic-bezier(0.34,1.56,0.64,1)) overshoot for pop-ins,
  `ease-out` for fades/slides. Durations 140–320ms.
- **Press:** controls scale to `0.96`; switch thumbs and check boxes squish slightly.
- **Ripple:** buttons emit a click ripple from the pointer.
- **Indicators:** tab underline/pill slides with spring; accordion uses animated
  `grid-template-rows`. Everything respects `prefers-reduced-motion`.

### Hover / press / focus states
- **Hover:** primary buttons deepen + glow; soft/ghost fill with `surface-sunken`; outline
  buttons gain a primary border + tint; links shift to `--color-primary-hover`.
- **Press:** scale-down (see motion).
- **Focus:** a 3px focus ring (`--ring`, semi-transparent indigo) via `box-shadow` on
  `:focus-visible`, for standalone interactive elements (buttons, links, tabbable rows).
  Danger fields ring in rose. **Text inputs/textarea/select are excluded from the blanket
  ring** (base.css) — a text field shows focus through its **bordered wrapper's
  `:focus-within`** ring, never its own box. So when you build a new input-like control:
  wrap the bare `<input>` (which has `border:none; outline:none`) in a container that paints
  `:focus-within { border-color: --color-primary; box-shadow: var(--ring) }`. A genuinely
  standalone field (no wrapper, e.g. pagination page-jump) opts back in with its own
  higher-specificity `:focus { box-shadow: var(--ring) }`. This is why command/search inputs
  must never show a stray purple box.

### Transparency & blur
- Used sparingly: the sticky nav is an 82%-opacity background with `backdrop-filter: blur`;
  the modal scrim is a 45–65% slate overlay with a light blur. Elsewhere surfaces are opaque.

### Layout
- Centered `1120px` max-width container with 24px gutters. Responsive grids use
  `auto-fit/minmax`. Sticky translucent header. Mobile-first; hit targets ≥ 40px (`control-h-md`).

---

## ICONOGRAPHY

- **System:** [Lucide](https://lucide.dev) — clean, consistent **2px rounded strokes** on a
  24×24 grid. The rounded stroke terminals pair naturally with Twico's rounded geometry.
- **Delivery:** Lucide UMD is loaded from CDN. Inside React cards/kits, icons render through
  `assets/twico-icons.js`, which exposes `window.TwicoIcon({ name, size })` — it builds an
  `<svg stroke="currentColor">` from Lucide's icon data, so icons inherit text color and size.
  In plain HTML cards, use `<i data-lucide="name"></i>` + `lucide.createIcons()`.
- **Sizing:** 15–16px inside `sm`/`md` controls, 18–20px standalone, 22–30px for feature tiles.
  Icons always inherit `currentColor`; they are never recolored arbitrarily.
- **Components never hard-depend on an icon library** — they accept icons as `ReactNode` props
  (`leftIcon`, `icon`, etc.), so consumers can swap sets.
- **Emoji:** never used as icons. **Unicode** is used only for tiny glyphs already in copy
  (e.g. the `×` close affixes are drawn as SVG strokes, not the literal character).
- **Substitution note:** Lucide is a substitution chosen for the greenfield brand (the origin
  repo shipped no icon set). If the real Twico UI adopts a different set, swap the CDN + the
  `TwicoIcon` resolver and re-document here.

---

## Index / manifest

**Root**
- `styles.css` — the single entry point consumers link. `@import`s every token + font + base file.
- `base.css` — minimal reset + element defaults (applies font, colors, focus ring).
- `readme.md` — this guide. · `SKILL.md` — portable Agent-Skill manifest.

**`tokens/`** — `colors.css` · `typography.css` · `spacing.css` · `radius.css` (radii + borders +
shadows) · `motion.css` (durations, easings, keyframes) · `fonts.css` (`@font-face`).

**`assets/`** — `fonts/` (Plus Jakarta Sans, JetBrains Mono variable TTFs + OFL) ·
`twico-icons.js` (Lucide → React helper).

**`components/`** — 59 components across 34 groups (each: `.jsx` + `.d.ts` + `.prompt.md`, one
`@dsCard` per directory):
- `buttons/` — **Button**, **IconButton**
- `inputs/` — **Input** (suffix icon; password reveal toggle), **Textarea**, **Currency** (fixed code-defined currency), **CurrencyField** (user-selectable currency) — symbol prefix + code suffix, precision-enforced
- `selects/` — **Select** (custom popover), **Combobox** (searchable), **MultiSelect** — all support grouped + two-line options
- `toggles/` — **Checkbox**, **Radio**, **Switch**
- `data-display/` — **Card**, **Avatar**, **AvatarMenu** (avatar → account dropdown), **Badge**, **Tag**
- `stat/` — **Stat** (KPI / metric card with trend delta)
- `timeline/` — **Timeline** (vertical event feed with node dots + tones)
- `list/` — **List** (rows with leading/trailing slots; static/link/button)
- `carousel/` — **Carousel** (sliding slides — arrows, dots, autoplay)
- `color-picker/` — **ColorPicker** (sat/value square, hue, hex, presets)
- `tree-view/` — **TreeView** (hierarchical expand/collapse + selection)
- `chart/` — **Chart** (dependency-free SVG bar & line, multi-series)
- `kanban/` — **Kanban** (drag-and-drop board, columns of cards)
- `date-range/` — **DateRangePicker** (range calendar + quick presets)
- `command-palette/` — **CommandPalette** (⌘K searchable command menu)
- `table/` — **Table**, **Pagination**
- `datatable/` — **Datatable** (MUI Data Grid Premium-style: sort, filter incl. multi-value, searchable columns, hide, pin, reorder, resize, density, multi-format export (CSV/Excel/TSV/JSON), aggregation footer, row grouping/reorder/resize/pinning, inline editing, row/cell selection, batch actions, pivoting, server-side mode, pagination + jump-to-page, skeleton, full a11y; filter controls + pager reuse Select/Input/Pagination)
- `feedback/` — **Alert**, **Spinner**, **Progress**, **Skeleton**, **Toast** (+ `ToastViewport`)
- `empty-state/` — **EmptyState** (zero-data placeholder + CTA)
- `navigation/` — **Tabs**, **Accordion**
- `breadcrumb/` — **Breadcrumb** (path trail, icons, middle-collapse)
- `stepper/` — **Stepper** (wizard progress, horizontal/vertical, error state)
- `slider/` — **Slider** (range, value bubble, ticks, keyboard)
- `rating/` — **Rating** (interactive/read-only stars)
- `datepicker/` — **DatePicker** (calendar popover, min/max, month/year nav)
- `file-upload/` — **FileUpload** (drag-and-drop dropzone + file list)
- `divider/` — **Divider** (horizontal/vertical, labeled)
- `overlay/` — **Tooltip**, **Dialog**, **Menu** (portaled dropdown — headings, shortcuts, rich header, keyboard nav)
- `drawer/` — **Drawer** (slide-in panel from any edge)
- `popover/` — **Popover** (portaled anchored panel, auto-flip)
- `navbar/` — **Navbar** (top app bar — brand, links, actions)
- `sidebar/` — **Sidebar** (collapsible side nav — sections, icons, badges)

Mount in card/kit HTML via `const { Button } = window.TwicoUiDesignSystem_f2f16a` after loading
`_ds_bundle.js`.

**`guidelines/`** — foundation specimen cards for the Design System tab (Colors, Type, Spacing,
Motion, Brand).

**`ui_kits/showcase/`** — the Twico UI landing page / live playground (see its `README.md`).

---

## Using this system
- **Throwaway artifacts** (slides, mocks, prototypes): copy assets out, link `styles.css`, and
  render components from the bundle into static HTML.
- **Production:** lift the tokens (`styles.css` + `tokens/`) and the component contracts
  (`.d.ts` / `.prompt.md`) and re-implement in your stack — they encode the real API.
- **Theming:** override `--brand-*` (or any `--color-*` alias) at `:root`; add `.dark` for dark mode.
