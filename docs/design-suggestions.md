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

> **Fourth wave shipped (2026-06-17) — the breaking API unifications.** The deferred "next major"
> cleanups are now done (one coordinated breaking change; the old names are **removed**, not just
> deprecated):
> - **Table** uses the Datatable vocabulary as canonical — `rows` / column `field` / `headerName` /
>   `renderCell`, and `TableSort` is `{ field, dir }`. The old `data` / `key` / `header` / `render`
>   names are gone.
> - **Button** (and **IconButton**, aligned 2026-06-17 for consistency) split color out of fill:
>   `variant` is `solid|soft|outline|ghost`, `tone` is `primary|danger` (default `primary`). A
>   destructive button is `tone="danger"` with any variant; `variant="danger"` no longer exists.
>   (Other intent-bearing components — Badge, Alert, Progress, Spinner, Toast, Timeline, Text — already
>   expose `tone`; the per-item `danger` boolean on Menu items / Datatable actions is a separate,
>   intentional pattern, not a color axis.)
> - **Drawer** drops the overloaded `size`; use `width` (left/right) / `height` (top/bottom), each
>   accepting `sm|md|lg` | number | CSS length.
> - **TreeView** drops `data` (use `items`) and `onSelectedIdChange`; `onSelect(id, node)` is id-first.

> **Fifth wave shipped (2026-06-17) — library-wide `tone` × `variant` (additive, non-breaking).**
> Every component that renders an accent now takes the 6-intent `tone` axis; the chip/banner gained a
> `variant` axis; defaults reproduce the prior look exactly. Selection controls (Checkbox, Radio,
> Switch, Slider), nav (Tabs, Stepper), the whole field family (Input, Textarea, Select, Combobox,
> MultiSelect, Currency, CurrencyField, DatePicker, DateRangePicker, FileUpload, ColorPicker → focus/
> open accent), and Rating gained `tone`; **Tag** and **Alert** gained `soft|solid|outline`; Alert/Text/
> Spinner tone sets were normalized to the full intents. All wired through the shared `--_accent` model.
> See [tone-variant-system.md](./tone-variant-system.md). Layout primitives, surfaces/overlays, and
> structural/display components are intentionally excluded (no meaningful color axis).

## Still open

These are genuinely deferred — each needs a precondition that isn't met yet. Nothing here blocks
current usage.

### Needs a release cadence
| Suggestion | Why deferred |
| --- | --- |
| Versioned docs | Pin docs per minor in GH Pages subfolders — only worth it once releases actually flow. CI change. |

### Possible future consistency pass
| Item | Why deferred |
| --- | --- |
| `CurrencyField.onValueChange`, `CommandPalette` item `onSelect`, `Divider` physical `align` | Kept as-is (richer signature / semantically fine); revisit only if a broader consistency pass is wanted. |
