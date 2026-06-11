import React from "react";
import { Currency } from "twico-ui";

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
];

export default variations;
