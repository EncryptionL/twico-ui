Avatar that opens an account dropdown — avatar trigger + a menu with a rich user header.

```jsx
import { AvatarMenu } from "./AvatarMenu";

<AvatarMenu
  name="Ada Park" email="ada@twico.dev" status="online" showName
  items={[
    { label: "Profile", icon: <UserIcon />, onClick: openProfile },
    { label: "Settings", icon: <SettingsIcon />, onClick: openSettings, shortcut: "⌘," },
    { separator: true },
    { label: "Sign out", icon: <LogOutIcon />, danger: true, onClick: signOut },
  ]}
/>
```

Props: `name`, `src`, `email`/`subtitle`, `status`, `size`, `items` (Menu item shape), `showName`, `showChevron`, `align`.
Avatar-only when `showName` is false (e.g. in a navbar); name+email+chevron when true (e.g. in a sidebar).
