Heading (h1–h6) with consistent token typography — use it instead of bare `<h1>`…`<h6>`.

```jsx
import { Heading } from "twico-ui";

<Heading level={1}>Dashboard</Heading>
<Heading level={3}>Recent activity</Heading>
```

- `level` — 1–6, sets both the tag and the default size (semantics).
- `size` — visual scale token, independent of `level`: `"xs"…"7xl" | "display"`; `display` renders the
  display size regardless of level; `truncate` / `lineClamp={n}` for ellipsis; `as`, `align`.
