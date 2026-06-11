Vertical timeline of events (activity feed, order tracking, history).

```jsx
import { Timeline } from "./Timeline";

<Timeline items={[
  { title: "Order placed", time: "9:41 AM", description: "We received your order.", tone: "primary", icon: <CheckIcon /> },
  { title: "Shipped", time: "2:10 PM", description: "Left the warehouse.", tone: "success" },
  { title: "Out for delivery", time: "Tomorrow" },
]} />
```

Items: `{ title, time?, description?, icon?, tone? }` (tone: primary/success/warning/danger).
