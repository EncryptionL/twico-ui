Custom select with a rounded popover (replaces the native browser dropdown).
Supports grouped options and two-line (title + subtitle) options.

```jsx
import { Select } from "./Select";

const [v, setV] = React.useState(null);
<Select
  label="Assignee"
  placeholder="Pick a teammate"
  value={v}
  onChange={setV}
  options={[
    { group: "Design", options: [
      { value: "ada", label: "Ada Park", description: "Product designer" },
      { value: "sam", label: "Sam Lee", description: "Brand designer" },
    ]},
    { group: "Engineering", options: [
      { value: "jo", label: "Jo Kim", description: "Frontend" },
    ]},
  ]}
/>
```

Options: strings, `{value,label,description}`, or `{group,options}` groups.
Keyboard: ↑/↓ move, Enter select, Esc close.
