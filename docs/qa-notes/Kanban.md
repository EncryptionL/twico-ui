# QA notes — Kanban

- **Group:** data-display
- **Status:** clean
- **Reviewed:** 2026-06-17

## Open issues

- [x] **[P1] Missing column focus restoration after drag-reorder** — ✓ fixed 2026-06-17 (focus deferred to requestAnimationFrame so it runs after the card re-renders in its new column). When a card is keyboard-moved between columns and drops (Enter), focusIdRef.current is set but the focus restoration check in useEffect(focusIdRef) happens *before* the card is re-rendered into its new column's DOM position. If React batches the state update, the querySelector may find the old card element or none, leaving focus lost. _Fix:_ Use a useLayoutEffect or ensure focusIdRef clears *after* rendering via a ref callback on the card elements. See `Kanban.jsx:54–61`.

- [x] **[#465] the keyboard card move used physical arrow direction, inverting under RTL** - the target was `grab.targetIdx + (key === 'ArrowRight' ? 1 : -1)`, i.e. next-by-index, but the board is a plain flex row with no explicit direction, so under `dir="rtl"` the columns lay out right-to-left and index 0 is the RIGHTMOST. An RTL keyboard user grabbed a card, pressed ArrowRight and it moved LEFT - every move the wrong way, with no visual cue, while the announcement ('Use the left and right arrow keys') was then literally wrong. The step is now negated from the root's computed `direction`, which keeps the mapping visual and the announcement accurate. (The publish-audit 'Kanban chevron mirroring' note is stale - Kanban renders no chevron.) `Kanban.jsx:90` - fixed 2026-10-07

## Verified OK

- **Drag & drop (mouse):** Card opacity=0.5 while dragging; drop target column highlights with inset shadow + primary border tint (data-over="true").
- **Keyboard operability (Enter/Space):** Grabs card, ArrowLeft/Right cycles columns (with wraparound), Enter drops, Escape cancels. All with live-region announcements.
- **Column reflow:** onCardMove callback receives (cardId, toColumn, nextCards). Uncontrolled mode updates internal state; controlled mode fires callback only.
- **Column counts:** Dynamic badge shows item count per column.
- **Focus visibility:** Cards are focusable (tabindex implicit on button-like role), show ring on focus.
- **RTL:** Flex layout, no physical left/right; safe.
- **Accessibility:** Each card has data-card-id for focus restoration; live-region announcements via setAnnounce (ARIA live).
