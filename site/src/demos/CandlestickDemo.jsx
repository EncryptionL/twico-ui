import React from "react";
import { Candlestick } from "twico-ui";

const ohlc = [
  { label: "Mon", open: 132, high: 138, low: 130, close: 136 },
  { label: "Tue", open: 136, high: 141, low: 134, close: 135 },
  { label: "Wed", open: 135, high: 137, low: 128, close: 129 },
  { label: "Thu", open: 129, high: 133, low: 127, close: 132 },
  { label: "Fri", open: 132, high: 140, low: 131, close: 139 },
];

export default function CandlestickDemo() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <div style={{ maxWidth: 520 }}>
        <Candlestick data={ohlc} valueFormat={(v) => `$${v}`} />
      </div>
    </div>
  );
}
