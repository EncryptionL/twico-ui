Modal dialog with scrim and pop-in. Drive with `open` + `onClose`.

```jsx
import { Dialog } from "./Dialog";

const [open, setOpen] = React.useState(false);
<Dialog
  open={open}
  onClose={() => setOpen(false)}
  title="Delete project?"
  description="This action cannot be undone."
  footer={<>
    <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
    <Button variant="danger" onClick={confirm}>Delete</Button>
  </>}
>
  The project and all its data will be permanently removed.
</Dialog>
```

Props: `open`, `onClose`, `title`, `description`, `footer`, `size` (sm/md/lg), `closeOnBackdrop`.
