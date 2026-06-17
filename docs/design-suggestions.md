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

> **Second wave shipped (2026-06-12, cont.).** Also done and removed: **search over variation
> titles** (`gen-variations-index.mjs` → `variations.js`, deep-links to `?s=variation-<i>`), the
> **Datatable column-reorder keyboard path** (Move left/right in the header menu, boundary-gated +
> announced), and formal `@deprecated` tags on the clear aliases (`Spinner.tone`,
> `Pagination.showJumper`, `EmptyState.bordered`).

> **Third wave shipped (2026-06-17).** **Datatable variable-height row virtualization** — windowing
> now measures and caches each rendered row's real height (by stable key) and drives the window off a
> prefix-sum of those heights, so tall `renderCell` content, `wrapText` columns, and `rowResize` no
> longer drift the scrollbar (see `docs/datatable.md` → "Row virtualization"). Shipped alongside it
> (not from this backlog): Datatable **wrap text**, **double-click column auto-fit**, **pin from the
> Columns panel**, and the floating-popover scroll-tracking + pinned-editable-cell alignment fixes.

## Still open

These are genuinely deferred — each needs a **major version** (breaking) or a precondition that
isn't met yet. Nothing here blocks current usage.

### Needs a release cadence
| Suggestion | Why deferred |
| --- | --- |
| Versioned docs | Pin docs per minor in GH Pages subfolders — only worth it once releases actually flow. CI change. |

### Breaking — schedule for the next major
The new, consistent names all ship today as **additive aliases**, so nothing is broken. The
remaining work is the breaking half: make the new name canonical and remove/redesign the old one.

| Item | What's left |
| --- | --- |
| Unify `Table` vs `Datatable` vocabularies (`data/key/header/render` ↔ `rows/field/headerName/renderCell`) | Table accepts both now; pick one canonical set and deprecate the other across both. |
| `Button` folds the semantic `danger` into the `variant` axis | IconButton `danger` shipped; the proper fix is a `tone` × `variant` split on Button. |
| `Drawer.size` overload | `width`/`height` + `sm/md/lg` presets shipped; eventually deprecate the overloaded `size`. |
| `TreeView.data` / `onSelect(node)` | `items` alias + `onSelectedIdChange` shipped; deprecate `data`, make `onSelect` id-first. |
| `CurrencyField.onValueChange`, `CommandPalette` item `onSelect`, `Divider` physical `align` | Kept as-is for now (richer signature / semantically fine); revisit if a consistency pass is wanted. |

_(The "Larger feature" backlog — Datatable variable-height virtualization — shipped on 2026-06-17; see the Third-wave note above.)_
