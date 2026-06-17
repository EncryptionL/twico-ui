Searchable single-select, MUI-Autocomplete style — type directly in the field
to filter; the overlay shows only options. Supports groups + two-line options.

```jsx
import { Combobox } from "./Combobox";

const [country, setCountry] = React.useState(null);
<Combobox
  label="Country"
  placeholder="Search a country"
  clearable
  value={country}
  onChange={setCountry}
  options={[
    { group: "Asia", options: [
      { value: "id", label: "Indonesia", description: "Jakarta" },
      { value: "jp", label: "Japan", description: "Tokyo" },
    ]},
    { group: "Europe", options: [
      { value: "de", label: "Germany", description: "Berlin" },
    ]},
  ]}
/>
```

Props: `options` (strings / {value,label,description} / {group,options}), `value`/`defaultValue`,
`onChange`, `placeholder`, `clearable`, `size`, plus field props. Keyboard: ↑/↓, Enter, Esc.

`tone` (`primary` | `success` | `warning` | `danger` | `info` | `neutral`, default `primary`) recolors the focus/open border and ring accent.
