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
];

export default variations;
