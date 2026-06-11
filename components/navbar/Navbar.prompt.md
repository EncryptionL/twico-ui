Top application bar with brand, inline links, and an actions slot.

```jsx
import { Navbar } from "./Navbar";

<Navbar
  brand={<><LogoTile /> twico<span style={{color:"var(--color-primary)"}}>UI</span></>}
  links={[
    { label: "Dashboard", active: true },
    { label: "Projects" },
    { label: "Team" },
  ]}
  actions={<>
    <IconButton aria-label="Notifications" icon={<BellIcon />} />
    <Avatar name="Ada Park" size="sm" />
  </>}
/>
```

Links: `{ label, href?, icon?, active?, onClick? }`. Props: `brand`, `actions`, `sticky`, `onMenuClick`.
