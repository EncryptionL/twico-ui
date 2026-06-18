import React from "react";
import { Menu, Button, IconButton, Avatar } from "twico-ui";

const UserIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
);
const SettingsIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" /></svg>
);
const LogOutIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>
);
const MoreIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><circle cx="12" cy="5" r="2" /><circle cx="12" cy="12" r="2" /><circle cx="12" cy="19" r="2" /></svg>
);

// Stateful wrapper: `render` runs inside .map() so it can't call hooks directly.
// Uses the controlled open form (open + onOpenChange) — swap for defaultOpen to go uncontrolled.
function MenuAllProps() {
  const [open, setOpen] = React.useState(false);
  return (
    <Menu
      trigger={<Button variant="soft">Account</Button>}
      align="end"
      width={260}
      open={open}                          // controlled — or use defaultOpen={false} for uncontrolled
      onOpenChange={setOpen}               // fires on trigger click, select, Esc, outside click
      header={
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <Avatar name="Jane Doe" />
          <div>
            <div style={{ fontWeight: 600 }}>Jane Doe</div>
            <div style={{ fontSize: 13, opacity: 0.7 }}>jane@example.com</div>
          </div>
        </div>
      }
      items={[
        { label: "Account", heading: true },                                  // uppercase section heading
        { label: "Profile", icon: <UserIcon />, shortcut: "⌘P", onClick: () => {} },
        { label: "Settings", icon: <SettingsIcon />, shortcut: "⌘,", onClick: () => {} },
        { label: "Billing", disabled: true },                                 // non-interactive
        { separator: true },                                                  // divider line
        { label: "Sign out", icon: <LogOutIcon />, danger: true, onClick: () => {} },
      ]}
    />
  );
}

const variations = [
  {
    title: "Basic",
    description: "A trigger plus a flat list of items. Closes on select, outside click, or Esc.",
    code: `<Menu
  trigger={<Button>Options</Button>}
  items={[
    { label: "Profile", onClick: () => {} },
    { label: "Settings", onClick: () => {} },
    { label: "Help", onClick: () => {} },
  ]}
/>`,
    render: () => (
      <Menu
        trigger={<Button>Options</Button>}
        items={[
          { label: "Profile", onClick: () => {} },
          { label: "Settings", onClick: () => {} },
          { label: "Help", onClick: () => {} },
        ]}
      />
    ),
  },
  {
    title: "Headings, shortcuts & separators",
    description: "Group items under an uppercase heading, add mono shortcut hints, and split with a separator.",
    code: `<Menu
  trigger={<Button variant="soft">Account</Button>}
  items={[
    { label: "Signed in as", heading: true },
    { label: "Profile", shortcut: "⌘P", onClick: () => {} },
    { label: "Settings", shortcut: "⌘,", onClick: () => {} },
    { separator: true },
    { label: "Sign out", onClick: () => {} },
  ]}
/>`,
    render: () => (
      <Menu
        trigger={<Button variant="soft">Account</Button>}
        items={[
          { label: "Signed in as", heading: true },
          { label: "Profile", shortcut: "⌘P", onClick: () => {} },
          { label: "Settings", shortcut: "⌘,", onClick: () => {} },
          { separator: true },
          { label: "Sign out", onClick: () => {} },
        ]}
      />
    ),
  },
  {
    title: "Icons, disabled & danger items",
    description: "Leading icons, a disabled (non-clickable) item, and a danger-colored destructive action.",
    code: `<Menu
  align="end"
  trigger={<IconButton aria-label="More options" icon={<MoreIcon />} />}
  items={[
    { label: "Profile", icon: <UserIcon />, onClick: () => {} },
    { label: "Settings", icon: <SettingsIcon />, onClick: () => {} },
    { label: "Billing", disabled: true },
    { separator: true },
    { label: "Sign out", icon: <LogOutIcon />, danger: true, onClick: () => {} },
  ]}
/>`,
    render: () => (
      <Menu
        align="end"
        trigger={<IconButton aria-label="More options" icon={<MoreIcon />} />}
        items={[
          { label: "Profile", icon: <UserIcon />, onClick: () => {} },
          { label: "Settings", icon: <SettingsIcon />, onClick: () => {} },
          { label: "Billing", disabled: true },
          { separator: true },
          { label: "Sign out", icon: <LogOutIcon />, danger: true, onClick: () => {} },
        ]}
      />
    ),
  },
  {
    title: "Rich header & fixed width",
    description: "A custom header node (user info) above the items, with a fixed menu width and end alignment.",
    code: `<Menu
  align="end"
  width={240}
  trigger={<Button variant="outline">Jane Doe</Button>}
  header={
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <Avatar name="Jane Doe" />
      <div>
        <div style={{ fontWeight: 600 }}>Jane Doe</div>
        <div style={{ fontSize: 13, opacity: 0.7 }}>jane@example.com</div>
      </div>
    </div>
  }
  items={[
    { label: "Profile", icon: <UserIcon />, onClick: () => {} },
    { label: "Settings", icon: <SettingsIcon />, onClick: () => {} },
    { separator: true },
    { label: "Sign out", icon: <LogOutIcon />, danger: true, onClick: () => {} },
  ]}
/>`,
    render: () => (
      <Menu
        align="end"
        width={240}
        trigger={<Button variant="outline">Jane Doe</Button>}
        header={
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Avatar name="Jane Doe" />
            <div>
              <div style={{ fontWeight: 600 }}>Jane Doe</div>
              <div style={{ fontSize: 13, opacity: 0.7 }}>jane@example.com</div>
            </div>
          </div>
        }
        items={[
          { label: "Profile", icon: <UserIcon />, onClick: () => {} },
          { label: "Settings", icon: <SettingsIcon />, onClick: () => {} },
          { separator: true },
          { label: "Sign out", icon: <LogOutIcon />, danger: true, onClick: () => {} },
        ]}
      />
    ),
  },
  {
    title: "All props",
    description:
      "Every Menu-specific prop in one place — trigger, items (with label, icon, onClick, shortcut, danger, disabled, separator and heading), align, header, width, and the controlled open + onOpenChange pair (swap for defaultOpen to go uncontrolled).",
    code: `const [open, setOpen] = React.useState(false);

<Menu
  trigger={<Button variant="soft">Account</Button>}
  align="end"                          // start | end
  width={260}                          // fixed px width (else max(200, trigger width))
  open={open}                          // controlled — or use defaultOpen={false} for uncontrolled
  onOpenChange={setOpen}               // fires on trigger click, select, Esc, outside click
  header={
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <Avatar name="Jane Doe" />
      <div>
        <div style={{ fontWeight: 600 }}>Jane Doe</div>
        <div style={{ fontSize: 13, opacity: 0.7 }}>jane@example.com</div>
      </div>
    </div>
  }
  items={[
    { label: "Account", heading: true },                                  // uppercase section heading
    { label: "Profile", icon: <UserIcon />, shortcut: "⌘P", onClick: () => {} },
    { label: "Settings", icon: <SettingsIcon />, shortcut: "⌘,", onClick: () => {} },
    { label: "Billing", disabled: true },                                 // non-interactive
    { separator: true },                                                  // divider line
    { label: "Sign out", icon: <LogOutIcon />, danger: true, onClick: () => {} },
  ]}
/>`,
    render: () => <MenuAllProps />,
  },
];

export default variations;
