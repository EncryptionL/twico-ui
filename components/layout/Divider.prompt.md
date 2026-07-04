Thin separator rule — horizontal or vertical, optionally labeled.

```jsx
import { Divider } from "./Divider";

<Divider />
<Divider>OR</Divider>                     {/* labeled */}
<span>A</span><Divider orientation="vertical" /><span>B</span>
```

Props: `orientation` (horizontal/vertical — applies to labeled dividers too, and sets `aria-orientation`),
`inset`, `align` (`start`/`center`/`end` — logical, mirrors under RTL; `left`/`right` accepted as
aliases), `children` (label).
