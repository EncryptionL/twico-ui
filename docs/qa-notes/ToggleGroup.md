# QA notes — ToggleGroup

- **Group:** buttons
- **Status:** clean
- **Reviewed:** 2026-09-23

## Open issues

- [x] **[#411] one tone for the whole group; no per-option meaning colour** — ToggleGroupItem gains `tone`, the group tone widens to the full Tone scale (drives the pressed fill via Button pressedTone; the unpressed look stays ActionTone-safe). `ToggleGroup.jsx`/`.d.ts` — ✓ 2026-09-23

- [x] **[#405] no toggle-button group (only a form RadioGroup or a Tabs tablist existed)** — added
  `ToggleGroup`, a `role="group"` of toggle buttons that composes `Button` (reusing its variant/tone CSS, so it
  adds almost no bytes). `type="single"` (a `string | null`; clicking the active value deselects, MUI-style) or
  `"multiple"` (a `string[]`); controlled/uncontrolled (`value`/`defaultValue`/`onValueChange`); opt-in `roving`
  arrow-key focus (WAI-ARIA *group of toggle buttons* — arrows move focus only, Space/Enter/click toggle);
  `horizontal`/`vertical`. Paired with the new `Button`/`IconButton` `pressed` prop for a lone toggle. 8 tests in
  `tests/toggle-group.test.jsx`. `ToggleGroup.jsx`/`.d.ts` — ✓ added 2026-09-22

## Notes

- Deliberately NOT a `RadioGroup` (no roving-selection) nor `Tabs` (no tabpanels) — it is a set of independent
  toggle buttons. For a single pressed button, use `<Button pressed>` / `<IconButton pressed>` directly.
