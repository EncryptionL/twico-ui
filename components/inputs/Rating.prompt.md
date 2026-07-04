Star rating — interactive or read-only.

```jsx
import { Rating } from "./Rating";

const [r, setR] = React.useState(0);
<Rating value={r} onChange={setR} />
<Rating value={4} readOnly showValue />     {/* display */}
<Rating defaultValue={3} size="lg" count={5} />
```

Props: `value`/`defaultValue`, `count`, `size` (sm/md/lg), `tone` (color intent, default
`warning`/gold), `color` (explicit override), `readOnly`, `showValue`, `clearable`, `format`, `onChange`.
A fractional `value` renders a **partial star fill** in `readOnly` mode (interactive selection is
integer-only); read-only ratings expose a single `role="img"` named "N out of M stars". Clear to 0 by
clicking the selected star or pressing Delete/Backspace (`clearable`, default true). `showValue` prints a
clean integer (or one decimal); pass `format` to customize the badge + accessible label. Pass `name` to
submit the value via a hidden form field.
