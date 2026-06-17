# QA notes — CurrencyField

- **Group:** inputs
- **Status:** clean
- **Reviewed:** 2026-06-17

## Open issues

None identified.

## Verified OK

- Controlled/uncontrolled currency (currency/defaultCurrency/onCurrencyChange)
- Controlled/uncontrolled amount (value/defaultValue/onChange)
- Select dropdown for currency picker embeds in left affix (lines 44-46)
- Symbol and code affixes derive from selected currency
- Precision auto-adjusts when currency changes (line 98)
- onValueChange callback for numeric parsed value
- All tone variants apply (custom CSS merges currency + select styles)
- Size variants (sm/md/lg) scale control height
- Debouncing not needed (synchronous)
- Required asterisk and error message support
- Label, hint, error rendering conditional
- Disabled state reduces opacity and disables both inputs
- Select is visually integrated (no border, matches color theme)
- Currency options customizable via `currencies` prop (line 90)
- Fallback to CURRENCY_OPTIONS if currencies not provided (line 90)
- aria-describedby merged with consumer-supplied aria-describedby (lines 86-87)
- SSR-safe: useInsertionEffect
- Field-wrapped properly for consistent layout
