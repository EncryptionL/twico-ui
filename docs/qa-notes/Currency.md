# QA notes — Currency

- **Group:** inputs
- **Status:** open
- **Reviewed:** 2026-06-17

## Open issues

- [ ] **[P1] No thousand separator visual feedback** — Input shows "123456.78" without commas; locale-aware number formatting not applied during display. User sees raw number. _Fix:_ Format display value with toLocaleString() or similar, or add `lang` and `style` inline for better UX. `Currency.jsx:~line-input-render`.

- [ ] **[P2] Precision clamping doesn't update on currency change** — If user switches currency from USD (2 decimals) to JPY (0 decimals), current value "123.45" doesn't auto-clamp to "123". _Fix:_ Add effect that reclampes value when currency changes. `Currency.jsx`.

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
