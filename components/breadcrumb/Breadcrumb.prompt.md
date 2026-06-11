Breadcrumb trail to the current page, with optional per-item icons and middle-collapse.

```jsx
import { Breadcrumb } from "./Breadcrumb";

<Breadcrumb items={[
  { label: "Home", href: "/", icon: <HomeIcon /> },
  { label: "Projects", href: "/projects" },
  { label: "Twico UI" },           // last = current page
]} />

<Breadcrumb maxItems={3} items={longTrail} />   // collapses middle into …
```

Items: `{ label, href?, icon?, onClick? }`. Props: `separator`, `maxItems`.
