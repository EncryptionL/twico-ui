# QA notes — DiffTable

- **Group:** data-display
- **Status:** clean (new)
- **Added:** 2026-07-10 (#205)

## Why it exists

[#205] Comparing two versions/snapshots of the same dataset (document revisions, config drift, imported
file versions, BOM version compare) always means the same work: pair rows on a key, classify each
**added / removed / modified / moved**, and for modified rows show a per-cell **before → after**. There
was no twico primitive, so it got hand-built each time. `DiffTable` generalizes it.

## Design decisions

- **Pair on `rowKey`** (defaults to `row.id`) — build `from`/`to` maps, then classify each key in the
  union: only-in-`to` → added, only-in-`from` → removed, in-both with a differing field → modified.
- **Field equality** — per-column `compare`, else a global `compare(a, b, field)`, else `===` then a
  `JSON.stringify` fallback (handles objects/arrays/dates without equating `1` and `"1"`).
- **Minimal move detection** — a same-value row is "moved" only if it's **not** on the longest
  increasing subsequence (LIS) of the common rows' `to`-positions walked in `from`-order. So moving one
  row to the top flags **just that row**, not everyone whose index shifted (the naive approach). Modified
  takes precedence over moved.
- **Display order** — `to` order (added rows in place), then removed rows appended in `from` order. The
  op badge carries the meaning, so a strict interleave isn't needed.
- **Rendering** — modified cells render `old → new` (strikethrough subtle old, `--color-success-subtle-fg`
  new); added rows render new-styled, removed rows strikethrough. Row background is tinted by op via
  `color-mix`. Op badges reuse [`Badge`](../../components/data-display/Badge.jsx); the toggle reuses
  [`Checkbox`](../../components/inputs/Checkbox.jsx).
- **Chrome is opt-out** — `showSummary` (`+N ~M -K` badges) and `showToggle` ("only changed") both
  default on; `onlyChanged` seeds the toggle. RTL-aware arrow; horizontal scroll wrapper; sticky header.

## Verified OK

- Classifies added/removed/modified/unchanged; per-cell before→after on changed fields only.
- `onlyChanged` hides unchanged; toggle reveals them; summary counts are correct.
- LIS move detection flags only genuinely-reordered rows; defaults `rowKey` to `row.id`.
- Empty state on identical inputs; `valueFormatter`/`valueGetter`/`compare` overrides honored.
- SSR-safe; className-free consumer API.
- Tests: [`tests/difftable.test.jsx`](../../tests/difftable.test.jsx).
