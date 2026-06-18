import React from "react";
import { CurrencyField } from "twico-ui";

// Stateful demo for the "All props" example: render() runs inside a .map(), so it
// cannot call hooks directly — state lives in this module-level component instead.
function CurrencyFieldAllProps() {
  const [amount, setAmount] = React.useState("1499.95"); // or defaultValue for uncontrolled
  const [code, setCode] = React.useState("EUR"); // or defaultCurrency for uncontrolled
  return (
    <div style={{ width: 360, maxWidth: "100%" }}>
      <CurrencyField
        label="Invoice total"
        hint="Pick a currency, then type the amount" // error replaces hint when set
        required
        size="md"
        tone="info"
        currency={code}
        onCurrencyChange={(next) => setCode(next)}
        currencies={["USD", "EUR", "GBP", "JPY", "IDR"]}
        value={amount}
        placeholder="0.00"
        disabled={false}
        onChange={(e) => setAmount(e.target.value)}
        onValueChange={(num, formatted, currency) =>
          console.log(num, formatted, currency)
        }
      />
    </div>
  );
}

const variations = [
  {
    title: "Basic",
    description: "Label, hint, and a starting amount. The user picks the currency from the dropdown.",
    code: `<CurrencyField
  label="Amount"
  defaultValue="1250.5"
  hint="Pick a currency and enter an amount"
/>`,
    render: () => (
      <div style={{ width: 340, maxWidth: "100%" }}>
        <CurrencyField
          label="Amount"
          defaultValue="1250.5"
          hint="Pick a currency and enter an amount"
        />
      </div>
    ),
  },
  {
    title: "Limited currencies",
    description: "Restrict the searchable dropdown to a specific set and choose the initial code.",
    code: `<CurrencyField
  label="Price"
  defaultCurrency="EUR"
  defaultValue="49.99"
  currencies={["USD", "EUR", "GBP", "IDR"]}
/>`,
    render: () => (
      <div style={{ width: 340, maxWidth: "100%" }}>
        <CurrencyField
          label="Price"
          defaultCurrency="EUR"
          defaultValue="49.99"
          currencies={["USD", "EUR", "GBP", "IDR"]}
        />
      </div>
    ),
  },
  {
    title: "Sizes",
    description: "Three control heights that match the rest of the input family.",
    code: `<CurrencyField size="sm" label="Small" defaultValue="10" />
<CurrencyField size="md" label="Medium" defaultValue="100" />
<CurrencyField size="lg" label="Large" defaultValue="1000" />`,
    render: () => (
      <div style={{ display: "flex", flexDirection: "column", gap: 12, width: 340, maxWidth: "100%" }}>
        <CurrencyField size="sm" label="Small" defaultValue="10" />
        <CurrencyField size="md" label="Medium" defaultValue="100" />
        <CurrencyField size="lg" label="Large" defaultValue="1000" />
      </div>
    ),
  },
  {
    title: "Required with error",
    description: "Marked required and showing a validation error in place of the hint.",
    code: `<CurrencyField
  label="Budget"
  required
  defaultValue="0"
  error="Enter an amount greater than zero"
/>`,
    render: () => (
      <div style={{ width: 340, maxWidth: "100%" }}>
        <CurrencyField
          label="Budget"
          required
          defaultValue="0"
          error="Enter an amount greater than zero"
        />
      </div>
    ),
  },
  {
    title: "Disabled",
    description: "Read-only presentation; both the amount and currency picker are locked.",
    code: `<CurrencyField
  label="Total"
  defaultCurrency="GBP"
  defaultValue="320"
  disabled
/>`,
    render: () => (
      <div style={{ width: 340, maxWidth: "100%" }}>
        <CurrencyField
          label="Total"
          defaultCurrency="GBP"
          defaultValue="320"
          disabled
        />
      </div>
    ),
  },
  {
    title: "All props",
    description:
      "Every CurrencyField-specific prop in one place — label, hint (error replaces it), required, size, tone, the controlled currency + onCurrencyChange pair, a limited currencies list, the controlled value + onChange amount pair, placeholder, disabled, and the onValueChange callback (parsed number, formatted string, active code).",
    code: `function CurrencyFieldAllProps() {
  const [amount, setAmount] = React.useState("1499.95"); // or defaultValue for uncontrolled
  const [code, setCode] = React.useState("EUR");         // or defaultCurrency for uncontrolled
  return (
    <CurrencyField
      label="Invoice total"
      hint="Pick a currency, then type the amount" // error="..." replaces hint when set
      required
      size="md"                                    // sm | md | lg
      tone="info"                                  // primary | success | warning | danger | info | neutral
      currency={code}                              // controlled selected currency code
      onCurrencyChange={(next) => setCode(next)}
      currencies={["USD", "EUR", "GBP", "JPY", "IDR"]}
      value={amount}                               // controlled amount string
      placeholder="0.00"
      disabled={false}
      onChange={(e) => setAmount(e.target.value)}  // native change event
      onValueChange={(num, formatted, currency) =>
        console.log(num, formatted, currency)      // parsed number, formatted string, active code
      }
    />
  );
}`,
    render: () => <CurrencyFieldAllProps />,
  },
];

export default variations;
