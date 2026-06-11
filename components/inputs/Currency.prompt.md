Currency input with a **fixed** currency defined in code. Renders the symbol as a prefix
and the currency code as a suffix, and enforces the currency's decimal precision.

```jsx
import { Currency } from "./Currency";

<Currency label="Price" currency="USD" onValueChange={(n) => setPrice(n)} />
<Currency label="Harga" currency="IDR" />          {/* Rp … IDR */}
<Currency label="Total" currency="JPY" />          {/* ¥ … JPY, 0 decimals */}
<Currency label="Custom" symbol="₿" code="BTC" precision={8} />
```

Precision is enforced as you type — with `precision={2}`, typing `2.259` yields `2.25`; on blur the
value is normalized to fixed decimals. Props: `currency` (USD/EUR/GBP/JPY/IDR/…), `precision`, `symbol`,
`code`, `value`/`defaultValue`, `onValueChange(number, formatted)`, plus field props (`label`, `hint`, `error`).
For a user-selectable currency, use `CurrencyField`.
