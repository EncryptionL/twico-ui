Inline code with a mono font and a subtle token-styled surface — use it instead of a bare `<code>` tag.

```jsx
import { Code } from "twico-ui";

<Text>Install with <Code>npm install twico-ui</Code>.</Text>

<Code block copyable>{`npm install twico-ui\nimport { Button } from "twico-ui";`}</Code>
```

- `as` to change the tag (defaults to `"code"`, or `"pre"` when `block`).
- `block` renders a scrollable multi-line `<pre>`; `copyable` adds a copy-to-clipboard button
  (`copyLabel` / `copiedLabel` for its accessible name).
