A set of toggle buttons (`aria-pressed`) for a tool/mode switch, formatting bar, or segmented control.

```jsx
import { ToggleGroup } from "./ToggleGroup";

// single (exclusive) — value is a string | null; clicking the active one deselects
<ToggleGroup
  aria-label="Text alignment"
  value={align}
  onValueChange={setAlign}
  items={[
    { value: "left", label: "Left" },
    { value: "center", label: "Center" },
    { value: "right", label: "Right" },
  ]}
/>

// multiple — value is a string[]
<ToggleGroup type="multiple" aria-label="Text style" defaultValue={["bold"]}
  items={[{ value: "bold", icon: <BoldIcon />, "aria-label": "Bold" }, { value: "italic", icon: <ItalicIcon />, "aria-label": "Italic" }]} />
```

It composes `Button`, so `variant` (the OFF look, default `outline`), `tone` and `size` mirror Button;
the pressed toggle shows a soft tone fill. Per WAI-ARIA it is a *group of toggle buttons*, not a radiogroup:
set `roving` to opt into arrow-key focus (arrows move focus only; Space/Enter/click toggle). For a single
pressed button on its own, use `<Button pressed>` / `<IconButton pressed>` directly.
