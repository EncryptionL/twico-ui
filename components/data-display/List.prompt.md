Vertical list of rows with leading/trailing slots; rows can be static, links, or buttons.

```jsx
import { List } from "./List";

<List items={[
  { leading: <Avatar name="Ada Park" size="sm" />, title: "Ada Park", description: "ada@twico.dev", trailing: <Badge tone="success">Active</Badge>, onClick: open },
  { leading: <FileIcon />, title: "report.pdf", description: "2.4 MB", trailing: "Today" },
]} />
```

Items: `{ title, description?, leading?, trailing?, onClick?, href?, active? }`. Props: `plain`, `emptyMessage`.
The `<ul>`/`<li>` carry explicit `list`/`listitem` roles (restored under `list-style:none` + `display:contents`),
`active` rows get `aria-current="page"`, and an empty `items` array renders `emptyMessage` (default "Nothing here yet").
