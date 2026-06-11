# Design & product suggestions (backlog)

Proposals reviewed and worth doing, but **not yet implemented**. Each is scoped so it can be
picked up later as its own Conventional-Commit-sized change. Keep this list pruned: when an item
ships, delete it here and document it in the relevant doc.

## Component API

| Suggestion | Why | Scope |
| --- | --- | --- |
| `useToast()` hook + imperative toast manager | Today consumers hand-manage a toast array in state. A small manager (`const { toast } = useToast()` → `toast.success("Saved")`) with the existing `ToastViewport limit`/`duration` underneath is the API most apps expect. | New hook + provider, no breaking change. |
| `Field` wrapper component | `label` / `hint` / `error` / `required` are re-implemented per input (Input, Select, Combobox, …). A shared `Field` would guarantee identical spacing/ids and shrink each input. | Internal refactor; public API unchanged. |
| Button `size="xs"` + icon-only mode | Dense toolbars need a smaller hit size; `IconButton` covers some of it but not text buttons. | Additive prop value. |
| Skeleton presets (`variant="text" \| "circle" \| "rect"`) | Composing realistic loading states is verbose today. | Additive. |
| Tabs `orientation="vertical"` | Settings-style layouts. | Additive + keyboard handling (Up/Down). |
| Dialog `size="full"` and scroll-body mode | Long-form content currently overflows the 640px `lg` cap. | Additive. |
| DatePicker/DateRangePicker `locale` + week-start props | Currently en-US assumptions. | Additive; uses `Intl`, no deps. |
| Datatable virtualized rows | >2k client rows start to lag; windowing keeps the premium feel. | Significant; isolated to Datatable. |
| Sticky header option for `Table` | Long tables lose context when scrolling. | Small CSS + prop. |

## Visual / design system

| Suggestion | Why | Scope |
| --- | --- | --- |
| Dark-mode elevation audit | Shadows read ~invisible on dark surfaces; consider subtle borders or lighter surface steps for raised elements (Menu, Dialog, Card elevated). | Token-level change, review every overlay. |
| Global density scale | Datatable has `density`; a `--control-density` token could compact all controls for data-heavy apps. | Token + per-component audit. |
| RTL support | `padding-inline`/`margin-inline` are already used in places; finish the sweep and add `dir="rtl"` previews. | Audit + CSS logical properties. |
| Motion-duration token on overlays' exit animations | Exit timings are hardcoded (120–200 ms) and must match the JS unmount timeouts; a `--duration-exit` token + one constant would keep them in lockstep. | Small, touches all overlays. |

## Docs site

| Suggestion | Why | Scope |
| --- | --- | --- |
| Theme-builder page | Edit the core tokens live (primary hue, radius, font) → preview all components → export a CSS override block. The strongest possible demo of "themes to your brand". | New page; pure Twico UI. |
| Editable playground (self-hosted, no CDN) | Let visitors tweak demo code inline. Needs a bundler-in-browser or controlled prop-knobs approach (knobs is simpler and CDN-free). | Medium; prop-knobs per demo is the pragmatic version. |
| Search over prop names + variation titles | Search currently indexes name/tagline/summary/group; adding props lets "fullWidth" find Button. | Small: extend the keywords string. |
| Versioned docs | Once releases flow regularly, pin docs per minor (GH Pages subfolders). | CI change, later. |

## Infrastructure / quality

| Suggestion | Why | Scope |
| --- | --- | --- |
| Unit tests (Vitest + Testing Library) | There are **no unit tests** today; the render-check is the only behavioral gate. Start with the trickiest logic: useControllableState, Datatable filtering/sorting, Select keyboard nav, Toast timers. | New dev-dep + CI step. |
| Visual-regression CI | The headless render-check catches errors, not regressions in look. Playwright screenshot diffs of ~10 key pages would catch spacing/theme breakage. | CI + baseline images. |
| Bundle-size budget (`size-limit`) in CI | Keeps the zero-dep promise honest as components grow. | Small CI step. |
| Automate `styles/twico-ui.css` concatenation | It is hand-maintained today; a script + CI drift-guard (`tokens/* + base.css` → concat → diff) removes a whole class of stale-stylesheet bugs. | Small script + CI step. |
| Automate `site/src/data/exports.js` sync | Generated from `src/index.ts` at site build time instead of hand-maintained. | Small Vite plugin or prebuild script. |
