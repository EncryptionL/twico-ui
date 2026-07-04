Flexbox layout primitive for arranging children in a row or column with token-based gaps; reach for it instead of hand-written flex `div`s.

```jsx
import { Stack } from "twico-ui";

<Stack direction="row" gap={3} align="center" wrap>
  <Button>Save</Button>
  <Button variant="ghost">Cancel</Button>
</Stack>
```

- `direction` — `"row"` | `"column"` (default).
- `gap` — spacing step (number → `--space-*`) or any CSS length.
- `align` / `justify` — flex alignment; `wrap`; `inline`; `as` to change the tag.
- `p` / `px` / `py` / `pt` / `pr` / `pb` / `pl` — padding (spacing step or CSS length; most-specific wins).
- `divider` — a node rendered between children (pass an orientation-appropriate `Divider`).
- `sx` — style escape hatch: flat CSS inline (wins over base); nested keys like `"&:hover"` / `"@media …"` compile to a scoped stylesheet.
