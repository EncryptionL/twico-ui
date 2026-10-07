# QA notes — Currency

- **Group:** inputs
- **Status:** open
- **Reviewed:** 2026-06-17

## Open issues

- [ ] **[P1] No thousand separator visual feedback** — Input shows "123456.78" without commas; locale-aware number formatting not applied during display. User sees raw number. _Fix:_ Format display value with toLocaleString() or similar, or add `lang` and `style` inline for better UX. `Currency.jsx:~line-input-render`.

- [ ] **[P2] Precision clamping doesn't update on currency change** — If user switches currency from USD (2 decimals) to JPY (0 decimals), current value "123.45" doesn't auto-clamp to "123". _Fix:_ Add effect that reclampes value when currency changes. `Currency.jsx`.

- [x] **[#462] readonly placeholder at 4.34:1** - same as Input; scoped to `--color-text-muted`. `Currency.jsx:82` - fixed 2026-10-07
- [x] **[#470] an uncontrolled value was never re-clamped when `currency`/`precision` changed** - the controlled branch re-clamps on every render (and #65's effect notifies the parent), but the uncontrolled branch returned `internal` verbatim, and `internal` was clamped at init and on change/blur only. Flipping `currency` from USD (precision 2) to JPY (precision 0) kept "123.45" on screen beside the yen symbol - not a representable amount - and never re-emitted, so the host's parsed number stayed 123.45 too. It self-corrected only once the user typed. A `[prec]` effect now re-clamps and re-emits. This closes the open P2 in this file; the controlled half was already fixed. `Currency.jsx:113` - fixed 2026-10-07

## Verified OK

- Controlled/uncontrolled currency amount (value/defaultValue/onChange)
- Fixed currency defined in code (not user-selectable)
- Precision enforcement via clampPrecision utility (removes extra decimals)
- Symbol prefix and code suffix render in separate affixes (lines 66-72)
- All tone variants apply to input focus ring
- Size variants (sm/md/lg) scale properly
- onValueChange callback for parsed numeric values (separate from onChange which gets display string)
- Required asterisk and error message support
- Label, hint, error rendering conditional
- Disabled state reduces opacity
- Removes spinner buttons on input[type="number"]
- Currency metadata inline (CURRENCIES export)
- SSR-safe: useInsertionEffect
