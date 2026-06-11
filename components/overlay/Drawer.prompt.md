Slide-in panel from any edge (nav menu, filters, details, cart). Drive with `open` + `onClose`.

```jsx
import { Drawer } from "./Drawer";

const [open, setOpen] = React.useState(false);
<Drawer open={open} onClose={() => setOpen(false)} side="right" title="Filters"
  footer={<Button onClick={apply}>Apply</Button>}>
  …filter controls…
</Drawer>
```

Props: `open`, `onClose`, `side` (left/right/top/bottom), `title`, `description`, `footer`, `size`, `closeOnBackdrop`.
