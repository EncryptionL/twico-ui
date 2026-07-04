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

Options: strings, `{value,label,description}`, or `{group,options}` groups. An option may set
`disabled` (skipped by keyboard nav, not selectable). More props: `name` (hidden form field),
`loading` (spinner row), `emptyText`, `matchTriggerWidth={false}` (size the popover to the widest option).
Keyboard: ↑/↓ move, Enter select, Esc close, and printable characters type-ahead-jump on the closed trigger.
`tone` ("primary" | "success" | "warning" | "danger" | "info" | "neutral", default "primary") sets the focus/open border and ring color.
For very long lists set `virtualized` (with optional `overscan`, default 8) to render only the visible option slice; keyboard nav still scrolls unrendered options into view.
