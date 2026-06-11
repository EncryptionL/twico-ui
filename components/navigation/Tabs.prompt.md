Tabbed navigation with a sliding active indicator. Line or pill variant.

```jsx
import { Tabs } from "./Tabs";

<Tabs
  variant="line"
  defaultValue="overview"
  items={[
    { value: "overview", label: "Overview", content: <p>…</p> },
    { value: "activity", label: "Activity", count: 12, content: <p>…</p> },
    { value: "settings", label: "Settings", icon: <SettingsIcon />, content: <p>…</p> },
  ]}
/>
```

Items: `{ value, label, icon?, count?, content? }`. Controlled via `value` + `onChange`.
