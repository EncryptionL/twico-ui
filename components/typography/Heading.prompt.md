Heading (h1–h6) with consistent token typography — use it instead of bare `<h1>`…`<h6>`.

```jsx
import { Heading } from "twico-ui";

<Heading level={1}>Dashboard</Heading>
<Heading level={3}>Recent activity</Heading>
```

- `level` — 1–6, sets both the tag and the default size.
- `size` — override the size token suffix (e.g. `"3xl"`); `as` to keep semantics while changing looks; `align`.
