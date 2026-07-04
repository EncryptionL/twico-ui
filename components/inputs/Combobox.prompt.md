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
`onChange`, `placeholder`, `clearable`, `size`, plus field props. Keyboard: ↑/↓, Enter, Esc; Backspace on an
empty input clears the selection. For **async/remote** options pass `onInputChange` (raw query — debounce it),
`filter={false}` (skip client filtering of server-ranked results), and `loading`. An option may set `disabled`;
`name` submits the value via a hidden form field; `emptyText` customizes the no-results text.

`tone` (`primary` | `success` | `warning` | `danger` | `info` | `neutral`, default `primary`) recolors the focus/open border and ring accent.
