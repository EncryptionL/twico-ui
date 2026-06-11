import React from "react";
import { CurrencyField } from "twico-ui";

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
];

export default variations;
