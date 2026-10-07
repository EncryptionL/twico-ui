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
The trigger is the APG select-only combobox — `role="combobox"` with `aria-haspopup="listbox"`, as
MUI's Select is too — so query it by the **combobox** role, not by `button`. Give it a `label` (or
`aria-label`): that role takes its name from the label, not from the selected value. A host-language
`<label htmlFor>` or a wrapping `<label>` works too - the component checks the DOM and only names
itself after the `placeholder` when nothing else names it, so its fallback can never override yours.
`tone` ("primary" | "success" | "warning" | "danger" | "info" | "neutral", default "primary") sets the focus/open border and ring color.
For very long lists set `virtualized` (with optional `overscan`, default 8) to render only the visible option slice; keyboard nav still scrolls unrendered options into view.
Richer options: an option may add `icon` (leading node) and/or `hint` (trailing muted node). For full control pass
`renderOption(option, { selected, active }) => node` — twico keeps the row chrome (keyboard nav, ARIA, selected checkmark),
you own the body. `renderOption` takes precedence over `icon`/`hint` and disables `virtualized` (custom rows aren't a fixed height).
