Icon-only button for toolbars, cards, and dense UI. Requires an `aria-label`.

```jsx
import { IconButton } from "./IconButton";

<IconButton aria-label="Settings" icon={<SettingsIcon />} />
<IconButton aria-label="Like" variant="soft" round icon={<HeartIcon />} />
<IconButton aria-label="Delete" tone="danger" icon={<TrashIcon />} />
{/* icon LINK — navigation should be a real link, not a button */}
<IconButton as="a" href="https://github.com/…" target="_blank" rel="noopener noreferrer" aria-label="GitHub (opens in new tab)" icon={<GithubIcon />} />
```

Same two axes as Button: `variant` = fill (`solid` · `soft` · `outline` · `ghost`, default `ghost`);
`tone` = color (`primary` · `danger`, default `primary`). A destructive icon button is `tone="danger"`
with any variant. Sizes: `sm` · `md` · `lg`. `round` makes it circular.
Set `as="a"` (with `href`, and `target`/`rel` for external links) to render an **icon link** — use this for
navigation (a repo/GitHub icon, external links) so it's a real anchor: middle-clickable, open-in-new-tab, and
announced as a link. `href` is scheme-sanitized (`javascript:`/`data:`/`vbscript:` drop the href); a `disabled`
link renders inert (no href, `aria-disabled`, out of the tab order).
