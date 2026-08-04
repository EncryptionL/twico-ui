Multi-line text input for longer-form content.

```jsx
import { Textarea } from "./Textarea";

<Textarea label="Bio" rows={4} placeholder="Tell us about yourself" hint="Max 280 characters" />
```

Set `tone` to recolor the focus accent and ring to any of the six intents (`primary`, `success`, `warning`, `danger`, `info`, `neutral`); it defaults to `primary`.

Props: `label`, `hint`, `error`, `required`, `rows`, `tone`, `autosize` (grow to fit content between
`minRows`/`maxRows`), `showCount` (a live `current / max` counter with `maxLength`), `clearable` (a top-inline-end
clear ✕, shown only when non-empty; empties the value and fires `onChange` with `""`, and re-collapses `autosize`),
plus native textarea attrs. The component forwards `ref` to the inner `<textarea>`, and `readOnly` renders a sunken state.
