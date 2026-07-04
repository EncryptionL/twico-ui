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

Items: `{ value, label, content, icon?, disabled?, headingLevel? }`. `multiple` allows several open at
once. Each trigger is wrapped in a heading (`headingLevel`, default `h3`) for document outline, and the
headers are arrow-key navigable (ArrowUp/Down wrap, Home/End jump). A `disabled` item can't be opened
or focused.
