import React, { useState } from "react";
import { Currency } from "twico-ui";

export default function CurrencyDemo() {
  const [price, setPrice] = useState(null);
  return (
    <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "flex-start" }}>
      <Currency
        label="Price"
        currency="USD"
        hint={price == null ? "Enter an amount" : `Parsed: ${price}`}
        onValueChange={(n) => setPrice(n)}
      />
      <Currency label="Harga" currency="IDR" defaultValue="25000" />
      <Currency label="Total" currency="JPY" defaultValue="1200" />
      <Currency label="Custom" symbol="₿" code="BTC" precision={8} />
    </div>
  );
}
