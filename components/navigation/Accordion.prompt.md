Expandable disclosure panels with smooth open/close animation.

```jsx
import { Accordion } from "./Accordion";

<Accordion
  multiple
  defaultOpen={["a"]}
  items={[
    { value: "a", label: "Is Twico UI free?", content: "Yes — MIT licensed, forever." },
    { value: "b", label: "Does it support dark mode?", content: "Out of the box." },
  ]}
/>
```

Items: `{ value, label, content, icon? }`. `multiple` allows several open at once.
