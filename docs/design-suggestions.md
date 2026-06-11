# Design & product suggestions (backlog)

Proposals reviewed and worth doing, but **not yet implemented**. Each is scoped so it can be
picked up later as its own Conventional-Commit-sized change. Keep this list pruned: when an item
ships, delete it here and document it in the relevant doc.

> **Most of the original backlog shipped on 2026-06-12.** Done and removed from this list:
> `useToast`/`ToastProvider`, the `Field` wrapper, Button `size="xs"` + IconButton `danger`,
> Skeleton shape presets, Tabs `orientation="vertical"`, Dialog `size="full"` + `scrollBody`,
> DatePicker/DateRangePicker `locale` + `weekStartsOn`, Table `stickyHeader`/`maxHeight`, the
> dark-mode elevation fix, the `data-density` scale, the `--duration-exit` token, RTL via logical
> properties, the Theme Builder + Playground pages, search-over-prop-names, the Vitest suite,
> the visual-regression scaffold, `size-limit`, and the `build:css` / `gen-exports` automation.
> Field-affordance + naming-alias + a11y items from the audit also shipped (see the git log).

## Still open

### Docs site
| Suggestion | Why | Scope |
| --- | --- | --- |
| Search over **variation titles** | Prop names are indexed now; variation example titles still aren't (they live in lazy `*Variations.jsx`, not `components.js`). | Small: surface variation titles into the search index at build time. |
| Versioned docs | Once releases flow regularly, pin docs per minor (GH Pages subfolders). | CI change; needs a real release cadence first. |

### Breaking / deprecation-cycle work (aliases shipped; canonical rename later)
These now have **additive aliases** so nothing is broken; the remaining work is to pick the
canonical name, mark the old one `@deprecated`, and remove it in the next major.

| Item | State |
| --- | --- |
| Unify `Table` vs `Datatable` vocabularies (`data/key/header/render` ↔ `rows/field/headerName/renderCell`) | Table accepts both now; still need to choose one canonical set + deprecate the other across both. |
| `Button` folds the semantic `danger` into the `variant` axis | IconButton `danger` shipped; the proper fix is a `tone` × `variant` split on Button (breaking). |
| `Drawer.size` raw dimension vs `Dialog.size` token | `width`/`height` + `sm/md/lg` presets shipped on Drawer; eventually deprecate the overloaded `size`. |
| `CurrencyField.onValueChange`, `CommandPalette` item `onSelect`, `Pagination.showJumper`, `EmptyState.bordered`, `Spinner.tone`, `Divider` physical `align` | All have the consistent new alias now; deprecate the originals once they've bedded in. |
| `TreeView.data` / `onSelect(node)` | `items` alias + `onSelectedIdChange` shipped; deprecate `data` + make `onSelect` id-first in a major. |

### Component API (additive, not yet done)
| Suggestion | Why | Scope |
| --- | --- | --- |
| Datatable **column-reorder keyboard path** | Row reorder + column resize are keyboard-operable; column reordering is still drag-only — add "Move left/Move right" items to the column header menu. | Additive; the header menu already exists. |
| Datatable virtualization for **variable row heights** | Windowing assumes a fixed row height; tall `renderCell` content or `rowResize` can drift the scrollbar. | Measure-and-cache row heights (larger change). |
