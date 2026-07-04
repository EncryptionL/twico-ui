Currency input where the **user picks the currency** from a dropdown; the choice drives the
prefix symbol, suffix code, and enforced precision.

```jsx
import { CurrencyField } from "./CurrencyField";

<CurrencyField label="Amount" defaultCurrency="USD"
  onValueChange={(n, str, code) => save(n, code)} />

{/* limit the currency choices */}
<CurrencyField label="Amount" defaultCurrency="EUR" currencies={["USD", "EUR", "GBP", "IDR"]} />
```

The currency dropdown is searchable and its accessible name follows the field `label` (e.g. "Price currency"),
so multiple money fields stay distinguishable. Switching currency re-clamps the amount to the new precision —
and now changing the controlled `currency` prop (not just the picker) also re-clamps and fires `onValueChange`.
`onValueChange` never emits `NaN`; `readOnly` renders a sunken, still-selectable state.
Props: `currency`/`defaultCurrency`, `onCurrencyChange`, `currencies` (limit the list), `value`/`defaultValue`,
`onValueChange(number, formatted, code)`, plus field props. Set `tone` (`primary`/`success`/`warning`/`danger`/`info`/`neutral`) to recolor the focus accent (default `primary`). For a fixed code-defined currency, use `Currency`.
