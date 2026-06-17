# QA notes — Pagination

- **Group:** data-display
- **Status:** clean
- **Reviewed:** 2026-06-17

## Open issues

- [x] **[P2] Jump input validation not enforced** — The page jumper input(type="number") accepts any number but doesn't validate it's in [1, total]. If a user types "999" in a 12-page table and hits Enter, the input handler should clamp or reject it before calling onChange. _Fix:_ Add validation in the jump input's onChange: `Math.min(Math.max(+val, 1), total)` before calling setPage. `Pagination.jsx:100+` (see full readPagination for onKeyDown logic). — ✓ fixed 2026-06-17

## Verified OK

- **Ellipsis logic (buildPages):** Correctly collapses gaps: if pages are 2 apart it shows the page, if >2 apart it inserts "…". Prevents unnecessary "…1 2…" cases.
- **Uncontrolled/controlled:** Manages internal page state; respects pageProp override when provided.
- **Siblings + boundaries:** Configurable page window around current + fixed start/end counts.
- **Arrow disable state:** First/last arrows disabled at boundaries (no prop, so they're visually :disabled).
- **Jump input (showPageJumper):** Deprecated showJumper alias still works; showPageJumper takes precedence. Input accepts 1-based page number.
- **Size variant:** sm/md toggle padding + font size.
- **RTL:** SVG transform scaleX(-1) on arrow icons; logical properties elsewhere.
- **Accessibility:** Buttons have aria-label; numbers are clickable buttons; jump input is labeled.
