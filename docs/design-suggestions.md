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

## From the 2026-06-12 full audit — deferred items

Confirmed findings that are **breaking renames or large features**, deferred from the immediate
fix pass (additive fixes shipped). Each needs a deprecation path or real design time:

| Finding | Why deferred |
| --- | --- |
| Unify `Table` vs `Datatable` vocabularies (`data/key/header/render` vs `rows/field/headerName/renderCell`) | Breaking on one of the two; needs aliases + deprecation cycle. |
| `Button` mixes the semantic `danger` into the `variant` axis; `IconButton` can't render danger at all | API redesign (`tone` × `variant`); additive `danger` on IconButton is the cheap first step. |
| `Dialog.size` is `"sm"\|"md"\|"lg"` but `Drawer.size` is a raw CSS dimension | Same prop name, different semantics — needs a deprecating rename (`width`/`height` on Drawer). |
| `CurrencyField` uses `onValueChange`; everything else uses `onChange(value)` | Add `onChange` alias, deprecate later. |
| `CommandPalette` items use `onSelect`; every other item array uses `onClick` | Alias + deprecate. |
| `Pagination.showJumper` vs `Datatable.showPageJumper`; `Box.border` vs `EmptyState.bordered`; `Divider.align` physical (`left/right`) vs logical (`start/end`) elsewhere | Naming standardization sweep with aliases. |
| `Spinner.tone` holds literal colors (`"white"`); `Progress`/`Timeline` tone unions omit `"info"` | Rename to `color` + alias; additive `"info"`. |
| `Badge` size scale starts at `"md"` (no `"sm"`) | Additive but needs design of an actual smaller badge. |
| Toggle family (`Checkbox`/`Radio`/`Switch`) has no `error` state; picker family lacks `label`/`hint`/`error`/`required` | Field-affordance sweep — pairs with the `Field` wrapper proposal above. |
| Keyboard alternatives for drag interactions: Kanban card moves, Datatable column resize/reorder + row reorder | Real feature work (roving tabindex, move menus, `role="separator"` resize). |
| `TreeView.data`→`items`, `onSelect(node)`→id-first | Breaking; alias path. |
| `Datatable` header/row/export menus lack `role="menu"`/focus management | Larger a11y rework of the menu plumbing. |
