Removable chip for filters and selected values.

```jsx
import { Tag } from "./Tag";

<Tag onRemove={() => remove("react")}>React</Tag>
<Tag leftIcon={<HashIcon />}>design-system</Tag>
<Tag tone="success" variant="solid">passed</Tag>
```

Props: `onRemove` (shows the × button), `leftIcon`. `variant` = fill (`soft` · `solid` ·
`outline`, default `soft`) and `tone` = color (`neutral` · `primary` · `success` · `warning` ·
`danger` · `info`, default `neutral`) — same two axes as Badge.
