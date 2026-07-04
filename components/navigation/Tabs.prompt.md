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

Items: `{ value, label, icon?, count?, disabled?, content? }`. `count` is any node (`12`, `"99+"`,
`"1.2k"`); a `disabled` item is dimmed and skipped by click + keyboard. Controlled via `value` +
`onChange`. A horizontal tablist scrolls when the tabs overflow, keeping the active tab in view.

`tone` sets the color intent (primary · success · warning · danger · info · neutral, default primary).
