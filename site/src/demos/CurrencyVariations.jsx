import React from "react";
import { Currency } from "twico-ui";

// Stateful wrapper so the "All props" example can show the controlled value form
// (render is called inside a .map() and must not call hooks directly).
function CurrencyAllProps() {
  const [value, setValue] = React.useState("1299.50");
  const [amount, setAmount] = React.useState(1299.5);
  return (
    <div style={{ width: 340, maxWidth: "100%" }}>
      <Currency
        label="Amount"
        hint={amount != null ? `Parsed value: ${amount}` : "Enter an amount"}
        required={false}
        size="md"
        tone="primary"
        currency="EUR"
        precision={2}
        symbol="€"
        code="EUR"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onValueChange={(num) => setAmount(num)}
        disabled={false}
      />
    </div>
  );
}

const variations = [
  {
    title: "Currencies",
    description: "The currency prop sets the symbol, suffix code, and decimal precision.",
    code: `<Currency label="Price" currency="USD" defaultValue="49.99" />
<Currency label="Harga" currency="IDR" defaultValue="25000" />
<Currency label="Total" currency="JPY" defaultValue="1200" />`,
    render: () => (
      <div style={{ width: 340, maxWidth: "100%", display: "flex", flexDirection: "column", gap: 14 }}>
        <Currency label="Price" currency="USD" defaultValue="49.99" />
        <Currency label="Harga" currency="IDR" defaultValue="25000" />
        <Currency label="Total" currency="JPY" defaultValue="1200" />
      </div>
    ),
  },
  {
    title: "Sizes",
    code: `<Currency size="sm" currency="USD" defaultValue="12.50" />
<Currency size="md" currency="USD" defaultValue="12.50" />
<Currency size="lg" currency="USD" defaultValue="12.50" />`,
    render: () => (
      <div style={{ width: 340, maxWidth: "100%", display: "flex", flexDirection: "column", gap: 14 }}>
        <Currency size="sm" currency="USD" defaultValue="12.50" />
        <Currency size="md" currency="USD" defaultValue="12.50" />
        <Currency size="lg" currency="USD" defaultValue="12.50" />
      </div>
    ),
  },
  {
    title: "Custom symbol & precision",
    description: "Override the symbol, suffix code, and decimal precision for any unit.",
    code: `<Currency label="Custom" symbol="₿" code="BTC" precision={8} defaultValue="0.04210000" />`,
    render: () => (
      <div style={{ width: 340, maxWidth: "100%" }}>
        <Currency label="Custom" symbol="₿" code="BTC" precision={8} defaultValue="0.04210000" />
      </div>
    ),
  },
  {
    title: "Hint & required",
    code: `<Currency
  label="Amount"
  currency="EUR"
  required
  hint="Enter a value in euros"
/>`,
    render: () => (
      <div style={{ width: 340, maxWidth: "100%" }}>
        <Currency label="Amount" currency="EUR" required hint="Enter a value in euros" />
      </div>
    ),
  },
  {
    title: "Error & disabled",
    description: "Error replaces the hint and marks the field invalid; disabled greys it out.",
    code: `<Currency label="Budget" currency="USD" defaultValue="0" error="Must be greater than zero" />
<Currency label="Locked" currency="GBP" defaultValue="199.00" disabled />`,
    render: () => (
      <div style={{ width: 340, maxWidth: "100%", display: "flex", flexDirection: "column", gap: 14 }}>
        <Currency label="Budget" currency="USD" defaultValue="0" error="Must be greater than zero" />
        <Currency label="Locked" currency="GBP" defaultValue="199.00" disabled />
      </div>
    ),
  },
  {
    title: "All props",
    description: "Every Currency-specific prop in one place — label, hint (error replaces it and marks the field invalid), required, size, tone, currency (sets symbol/code/precision defaults), the precision/symbol/code overrides, the controlled value + native onChange, and the convenience onValueChange callback.",
    code: `const [value, setValue] = React.useState("1299.50");
const [amount, setAmount] = React.useState(1299.5);

<Currency
  label="Amount"
  hint={amount != null ? \`Parsed value: \${amount}\` : "Enter an amount"}  // error="…" replaces hint + marks invalid
  required={false}
  size="md"                 // sm | md | lg
  tone="primary"            // primary | success | warning | danger | info | neutral
  currency="EUR"            // USD | EUR | GBP | JPY | IDR | … (sets symbol/code/precision)
  precision={2}             // override the currency's decimal precision
  symbol="€"                // override the prefix symbol
  code="EUR"                // override the suffix code
  value={value}             // controlled — or defaultValue="0.00" for uncontrolled
  onChange={(e) => setValue(e.target.value)}              // native change event
  onValueChange={(num, formatted) => setAmount(num)}      // parsed number + formatted string
  disabled={false}
/>`,
    render: () => <CurrencyAllProps />,
  },
];

export default variations;
