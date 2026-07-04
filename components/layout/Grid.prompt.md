CSS grid primitive — a responsive auto-fill grid (`minChildWidth`) or a fixed column count (`columns`).

```jsx
import { Grid } from "twico-ui";

<Grid minChildWidth={220} gap={4}>
  <Card>One</Card>
  <Card>Two</Card>
  <Card>Three</Card>
</Grid>
```

- `minChildWidth` — responsive: columns auto-fill at this minimum width.
- `columns` — fixed count, or a responsive object `{ base, sm, md, lg, xl }` (CSS-only, SSR-safe).
- `gap` / `rowGap` / `columnGap` — spacing step or CSS length; `alignContent` / `justifyContent`;
  `as` to change the tag.
