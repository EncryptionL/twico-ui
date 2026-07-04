Grouped radio buttons with one controlled value, a group label, and a single hoisted error —
so you don't hand-wire a shared `name` or duplicate the error on every `<Radio>`.

```jsx
import { RadioGroup } from "./RadioGroup";

const [plan, setPlan] = React.useState("pro");
<RadioGroup
  label="Plan"
  value={plan}
  onChange={setPlan}
  options={[
    { value: "free", label: "Free", description: "For hobby projects" },
    { value: "pro", label: "Pro", description: "For teams" },
    { value: "ent", label: "Enterprise", disabled: true },
  ]}
/>

{/* or pass <Radio> children — name/checked/onChange are injected */}
<RadioGroup label="Size" defaultValue="m" orientation="horizontal">
  <Radio value="s" label="Small" />
  <Radio value="m" label="Medium" />
  <Radio value="l" label="Large" />
</RadioGroup>
```

The container is a `role="radiogroup"` named by `label`; `error`/`hint` render once for the whole group
and set `aria-invalid`/`aria-describedby`. Since the radios are real inputs sharing one `name`, the browser
handles roving tabindex + Arrow-key selection natively. Props: `value`/`defaultValue`, `onChange(value)`,
`options` or `children`, `name`, `label`, `hint`, `error`, `orientation`, `disabled`, `required`, `size`, `tone`.
