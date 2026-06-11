Generic, token-styled box — the building block for non-flex layout (padding, margin, background, border, radius, shadow) without writing CSS.

```jsx
import { Box } from "twico-ui";

<Box p={4} bg="surface" border radius="lg" shadow="sm">
  Padded, bordered surface.
</Box>
```

- Spacing props take a spacing step (number → `--space-*`) or any CSS length: `p`, `px`, `py`, `pt/pr/pb/pl`, and the `m*` equivalents.
- `bg` (surface token or CSS), `border` (bool), `radius` / `shadow` (token suffix), `as` to change the tag.
