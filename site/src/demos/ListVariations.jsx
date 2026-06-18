import React from "react";
import { List, Avatar, Badge } from "twico-ui";

const FileIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><path d="M14 2v6h6" /></svg>
);

const ChevronIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
);

const variations = [
  {
    title: "Basic rows",
    description: "Title and description per row, wrapped in the default card chrome.",
    code: `<List
  items={[
    { title: "Ada Park", description: "ada@twico.dev" },
    { title: "Liam Cho", description: "liam@twico.dev" },
    { title: "Mira Sato", description: "mira@twico.dev" },
  ]}
/>`,
    render: () => (
      <div style={{ width: 360, maxWidth: "100%" }}>
        <List
          items={[
            { title: "Ada Park", description: "ada@twico.dev" },
            { title: "Liam Cho", description: "liam@twico.dev" },
            { title: "Mira Sato", description: "mira@twico.dev" },
          ]}
        />
      </div>
    ),
  },
  {
    title: "Leading + trailing slots",
    description: "Avatars in the leading slot and a Badge in the trailing slot.",
    code: `<List
  items={[
    {
      leading: <Avatar name="Ada Park" size="sm" />,
      title: "Ada Park",
      description: "Owner",
      trailing: <Badge tone="success">Active</Badge>,
    },
    {
      leading: <Avatar name="Liam Cho" size="sm" />,
      title: "Liam Cho",
      description: "Editor",
      trailing: <Badge tone="warning">Invited</Badge>,
    },
  ]}
/>`,
    render: () => (
      <div style={{ width: 360, maxWidth: "100%" }}>
        <List
          items={[
            {
              leading: <Avatar name="Ada Park" size="sm" />,
              title: "Ada Park",
              description: "Owner",
              trailing: <Badge tone="success">Active</Badge>,
            },
            {
              leading: <Avatar name="Liam Cho" size="sm" />,
              title: "Liam Cho",
              description: "Editor",
              trailing: <Badge tone="warning">Invited</Badge>,
            },
          ]}
        />
      </div>
    ),
  },
  {
    title: "Plain (no card chrome)",
    description: "Set plain to drop the border and background — ideal inside an existing card.",
    code: `<List
  plain
  items={[
    { leading: <FileIcon />, title: "report.pdf", description: "2.4 MB", trailing: "Today" },
    { leading: <FileIcon />, title: "notes.txt", description: "12 KB", trailing: "Yesterday" },
  ]}
/>`,
    render: () => (
      <div style={{ width: 360, maxWidth: "100%" }}>
        <List
          plain
          items={[
            { leading: <FileIcon />, title: "report.pdf", description: "2.4 MB", trailing: "Today" },
            { leading: <FileIcon />, title: "notes.txt", description: "12 KB", trailing: "Yesterday" },
          ]}
        />
      </div>
    ),
  },
  {
    title: "Link rows",
    description: "An href turns the row into a link with a trailing chevron affordance.",
    code: `<List
  items={[
    { title: "Account settings", description: "Profile, security", href: "#account", trailing: <ChevronIcon /> },
    { title: "Notifications", description: "Email & push", href: "#notifications", trailing: <ChevronIcon /> },
  ]}
/>`,
    render: () => (
      <div style={{ width: 360, maxWidth: "100%" }}>
        <List
          items={[
            { title: "Account settings", description: "Profile, security", href: "#account", trailing: <ChevronIcon /> },
            { title: "Notifications", description: "Email & push", href: "#notifications", trailing: <ChevronIcon /> },
          ]}
        />
      </div>
    ),
  },
  {
    title: "Selectable rows",
    description: "onClick makes rows buttons; active highlights the current selection.",
    code: `<List
  items={[
    { title: "Inbox", description: "12 new", active: true, onClick: () => {} },
    { title: "Starred", description: "3 items", onClick: () => {} },
    { title: "Archive", description: "Older mail", onClick: () => {} },
  ]}
/>`,
    render: () => (
      <div style={{ width: 360, maxWidth: "100%" }}>
        <List
          items={[
            { title: "Inbox", description: "12 new", active: true, onClick: () => {} },
            { title: "Starred", description: "3 items", onClick: () => {} },
            { title: "Archive", description: "Older mail", onClick: () => {} },
          ]}
        />
      </div>
    ),
  },
  {
    title: "All props",
    description:
      "Every List prop in one place. items carries all ListItemData fields — title, description, leading, trailing, plus active and either onClick (button row) or href (link row); the two are mutually exclusive per item, so href wins if both are set. plain drops the card chrome.",
    code: `<List
  plain={false}                       // true drops the border + background
  items={[
    {
      leading: <Avatar name="Ada Park" size="sm" />,  // icon / avatar
      title: "Ada Park",                              // ReactNode (required)
      description: "ada@twico.dev",                    // secondary text
      trailing: <Badge tone="success">Active</Badge>, // badge / meta / switch
      active: true,                                    // highlight as selected
      onClick: () => {},                               // makes the row a button
    },
    {
      leading: <FileIcon />,
      title: "Account settings",
      description: "Profile, security",
      trailing: <ChevronIcon />,
      href: "#account",                                // makes the row a link (wins over onClick)
    },
  ]}
/>`,
    render: () => (
      <div style={{ width: 360, maxWidth: "100%" }}>
        <List
          plain={false}
          items={[
            {
              leading: <Avatar name="Ada Park" size="sm" />,
              title: "Ada Park",
              description: "ada@twico.dev",
              trailing: <Badge tone="success">Active</Badge>,
              active: true,
              onClick: () => {},
            },
            {
              leading: <FileIcon />,
              title: "Account settings",
              description: "Profile, security",
              trailing: <ChevronIcon />,
              href: "#account",
            },
          ]}
        />
      </div>
    ),
  },
];

export default variations;
