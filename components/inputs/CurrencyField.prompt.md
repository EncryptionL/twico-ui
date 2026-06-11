Currency input where the **user picks the currency** from a dropdown; the choice drives the
prefix symbol, suffix code, and enforced precision.

```jsx
import { CurrencyField } from "./CurrencyField";

<CurrencyField label="Amount" defaultCurrency="USD"
  onValueChange={(n, str, code) => save(n, code)} />

{/* limit the currency choices */}
<CurrencyField label="Amount" defaultCurrency="EUR" currencies={["USD", "EUR", "GBP", "IDR"]} />
```

The currency dropdown is searchable. Switching currency re-clamps the amount to the new precision.
Props: `currency`/`defaultCurrency`, `onCurrencyChange`, `currencies` (limit the list), `value`/`defaultValue`,
`onValueChange(number, formatted, code)`, plus field props. For a fixed code-defined currency, use `Currency`.
