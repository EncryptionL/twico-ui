import React from "react";
import { Timeline } from "twico-ui";

const items = [
  { title: "Order placed", time: "9:41 AM", description: "We received your order.", tone: "primary" },
  { title: "Shipped", time: "2:10 PM", description: "Left the warehouse.", tone: "success" },
  { title: "Out for delivery", time: "Today", description: "Arriving by 5:00 PM.", tone: "warning" },
  { title: "Delivered", time: "Tomorrow" },
];

export default function TimelineDemo() {
  return (
    <div style={{ width: 420, maxWidth: "100%" }}>
      <Timeline items={items} />
    </div>
  );
}
