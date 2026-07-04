Multi-select, MUI-Autocomplete style — type among the chips to filter; the
overlay shows checkable options. Supports groups + two-line options.

```jsx
import { MultiSelect } from "./MultiSelect";

const [tags, setTags] = React.useState(["react", "tailwind"]);
<MultiSelect
  label="Tech stack"
  placeholder="Add technologies"
  value={tags}
  onChange={setTags}
  options={[
    { group: "Frameworks", options: [
      { value: "react", label: "React", description: "UI library" },
      { value: "vue", label: "Vue", description: "Progressive framework" },
    ]},
    { group: "Tooling", options: ["tailwind", "typescript"] },
  ]}
/>
```

Props: `options` (strings / {value,label,description} / {group,options}; an option may set `disabled`),
`value`/`defaultValue` (string[]), `onChange(values)`, `max` (cap selections — over-cap options disable),
`maxTagCount` (collapse chips to a "+N more" pill), `name` (hidden form fields), `loading`, `emptyText`,
plus field props. Backspace on empty input removes the last chip; chip remove buttons are out of the tab order.
Set `tone` (`primary` default, `success`/`warning`/`danger`/`info`/`neutral`) to recolor the focus/open accent.
