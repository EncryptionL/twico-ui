import React from "react";
import { AvatarMenu } from "twico-ui";

const UserIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></svg>
);
const SettingsIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3" /><path d="M12 2v3M12 19v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2 12h3M19 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1" /></svg>
);
const LogOutIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><path d="m16 17 5-5-5-5M21 12H9" /></svg>
);

const accountItems = [
  { label: "Profile", icon: <UserIcon />, onClick: () => {} },
  { label: "Settings", icon: <SettingsIcon />, shortcut: "⌘,", onClick: () => {} },
  { separator: true },
  { label: "Sign out", icon: <LogOutIcon />, danger: true, onClick: () => {} },
];

const variations = [
  {
    title: "Avatar only",
    description: "Just the avatar trigger — ideal in a navbar. Click to open the menu.",
    code: `<AvatarMenu name="Ada Park" items={items} />`,
    render: () => <AvatarMenu name="Ada Park" items={accountItems} />,
  },
  {
    title: "With name & email",
    description: "Set showName to reveal the name, subtitle, and chevron — ideal in a sidebar.",
    code: `<AvatarMenu
  name="Ada Park"
  email="ada@twico.dev"
  showName
  items={items}
/>`,
    render: () => (
      <AvatarMenu name="Ada Park" email="ada@twico.dev" showName items={accountItems} />
    ),
  },
  {
    title: "Presence status",
    description: "A presence dot on the avatar: online, busy, away, or offline.",
    code: `<AvatarMenu name="Ada Park" status="online" items={items} />
<AvatarMenu name="Bo Lin" status="busy" items={items} />
<AvatarMenu name="Cy Reed" status="away" items={items} />
<AvatarMenu name="Di Vale" status="offline" items={items} />`,
    render: () => (
      <>
        <AvatarMenu name="Ada Park" status="online" items={accountItems} />
        <AvatarMenu name="Bo Lin" status="busy" items={accountItems} />
        <AvatarMenu name="Cy Reed" status="away" items={accountItems} />
        <AvatarMenu name="Di Vale" status="offline" items={accountItems} />
      </>
    ),
  },
  {
    title: "Sizes",
    description: "Trigger avatar size, from xs to xl.",
    code: `<AvatarMenu name="Ada Park" size="xs" items={items} />
<AvatarMenu name="Ada Park" size="sm" items={items} />
<AvatarMenu name="Ada Park" size="md" items={items} />
<AvatarMenu name="Ada Park" size="lg" items={items} />
<AvatarMenu name="Ada Park" size="xl" items={items} />`,
    render: () => (
      <>
        <AvatarMenu name="Ada Park" size="xs" items={accountItems} />
        <AvatarMenu name="Ada Park" size="sm" items={accountItems} />
        <AvatarMenu name="Ada Park" size="md" items={accountItems} />
        <AvatarMenu name="Ada Park" size="lg" items={accountItems} />
        <AvatarMenu name="Ada Park" size="xl" items={accountItems} />
      </>
    ),
  },
  {
    title: "Custom subtitle & start alignment",
    description: "Override the header subtitle and align the menu to the start of the trigger.",
    code: `<AvatarMenu
  name="Ada Park"
  subtitle="Workspace admin"
  status="online"
  showName
  align="start"
  items={items}
/>`,
    render: () => (
      <AvatarMenu
        name="Ada Park"
        subtitle="Workspace admin"
        status="online"
        showName
        align="start"
        items={accountItems}
      />
    ),
  },
  {
    title: "All props",
    description:
      "Every AvatarMenu prop in one place. subtitle overrides email for the displayed text; items hold their own onClick callbacks. Click the avatar to open the menu.",
    code: `// items carry their own per-item onClick callbacks
const items = [
  { label: "Profile", icon: <UserIcon />, onClick: () => {} },
  { label: "Settings", icon: <SettingsIcon />, shortcut: "⌘,", onClick: () => {} },
  { separator: true },
  { label: "Sign out", icon: <LogOutIcon />, danger: true, onClick: () => {} },
];

<AvatarMenu
  name="Ada Park"
  src="/u/ada.jpg"                          // avatar image; falls back to initials
  email="ada@twico.dev"                     // shown in header (and trigger when showName)
  subtitle="Workspace admin"                // overrides email for the displayed text
  status="online"                           // online | busy | away | offline
  size="md"                                 // xs | sm | md | lg | xl
  showName                                  // reveal name + subtitle next to the avatar
  showChevron                               // defaults to showName; force it on
  align="end"                               // start | end
  items={items}
/>`,
    render: () => (
      <AvatarMenu
        name="Ada Park"
        src="/u/ada.jpg"
        email="ada@twico.dev"
        subtitle="Workspace admin"
        status="online"
        size="md"
        showName
        showChevron
        align="end"
        items={accountItems}
      />
    ),
  },
];

export default variations;
