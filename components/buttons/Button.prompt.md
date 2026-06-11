Action button with a click ripple, used for primary and secondary actions throughout the UI.

```jsx
import { Button } from "./Button";

<Button variant="solid" size="md" onClick={save}>Save changes</Button>
<Button variant="soft" leftIcon={<PlusIcon />}>Add item</Button>
<Button variant="outline">Cancel</Button>
<Button variant="ghost">Skip</Button>
<Button variant="danger" loading>Deleting…</Button>
```

Variants: `solid` (primary CTA), `soft` (tinted secondary), `outline`, `ghost`, `danger`.
Sizes: `sm` · `md` · `lg`. Props: `leftIcon`, `rightIcon`, `loading`, `fullWidth`, `as="a"`.
