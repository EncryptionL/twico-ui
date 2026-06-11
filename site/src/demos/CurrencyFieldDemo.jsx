import React, { useState } from "react";
import { CurrencyField } from "twico-ui";

export default function CurrencyFieldDemo() {
  const [currency, setCurrency] = useState("USD");
  const [formatted, setFormatted] = useState("");

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12, maxWidth: 360 }}>
      <CurrencyField
        label="Amount"
        defaultValue="1250.5"
        currency={currency}
        onCurrencyChange={setCurrency}
        currencies={["USD", "EUR", "GBP", "IDR"]}
        hint="Pick a currency and enter an amount"
        onValueChange={(n, str) => setFormatted(str)}
      />
      <div>
        Stored: {formatted || "0.00"} {currency}
      </div>
    </div>
  );
}
