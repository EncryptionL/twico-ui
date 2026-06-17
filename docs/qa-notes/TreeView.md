# QA notes — TreeView

- **Group:** navigation
- **Status:** clean
- **Reviewed:** 2026-06-17

## Open issues

- [x] **[P1] Indentation uses physical `paddingLeft` — broken in RTL** — Each row's depth indent is applied via an inline `style={{ paddingLeft: 8 + depth * 18 }}`. `paddingLeft` is a physical property, so under `dir="rtl"` the hierarchy indents from the left edge while the text flows from the right, producing an upside-down/visually broken tree (deep children look shallower than parents on the start side). _Fix:_ set `paddingInlineStart` instead of `paddingLeft` in the inline style. `components/navigation/TreeView.jsx:40`. — ✓ fixed 2026-06-17
- [x] **[P2] Caret chevron does not flip in RTL** — The caret is a right-pointing chevron (`m9 18 6-6-6-6`) rotated 90° when open. In RTL a collapsed caret should point left (toward the start edge). Unlike Breadcrumb (which has a `[dir="rtl"] … { transform: scaleX(-1) }` rule), the tree caret has no RTL mirror, so collapsed rows point the wrong way under `dir="rtl"`. _Fix:_ add `[dir="rtl"] .twc-tree__caret:not([data-open="true"]) { transform: scaleX(-1); }` (and mirror the open rotation accordingly). `components/navigation/TreeView.jsx:13-16,46`. — ✓ fixed 2026-06-17

## Verified OK

- **WAI-ARIA tree pattern:** root `role="tree"`; rows are `role="treeitem"` with `aria-level`, `aria-selected`, and `aria-expanded` (only when the node has children); child lists are `role="group"`. `components/navigation/TreeView.jsx:30-53`.
- **Roving tabindex:** exactly one row is tabbable (`tabIndex` 0 vs -1), chosen as last-focused → selected → first visible. Keyboard nav matches the spec: ArrowUp/Down move, ArrowRight expands-then-descends, ArrowLeft collapses-then-ascends, Home/End jump to ends. `preventDefault` is called so the page does not scroll. `components/navigation/TreeView.jsx:114-141`.
- **Focus management:** `rowRefs` map + `focusRow` move DOM focus in lockstep with the roving index; the ref callback cleans up deleted nodes. `components/navigation/TreeView.jsx:39,117`.
- **onSelect contract:** id-first `(id, node)`, matching the `.d.ts` and prompt. Controlled `selectedId`/`expanded` vs uncontrolled state handled via `!== undefined`. Clicking a parent toggles AND selects (intentional). `components/navigation/TreeView.jsx:43,96-97`.
- **Keys:** nodes keyed by `node.id` (stable), not index. `components/navigation/TreeView.jsx:54-55,146-147`.
- **Rows are real `<button>`s:** not div-with-onClick, so they are keyboard- and AT-operable with a `:focus-visible` ring.
- **SSR-safe:** style injection in `useInsertionEffect`; no module/render-scope DOM access.
- **Reduced-motion:** only the caret rotation transitions; collapsed by the global reduced-motion handling.
