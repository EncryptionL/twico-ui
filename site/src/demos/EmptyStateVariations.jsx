import React from "react";
import { EmptyState, Button } from "twico-ui";

const InboxIcon = () => (
  <svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-6l-2 3h-4l-2-3H2" /><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" /></svg>
);

const SearchIcon = () => (
  <svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
);

const UploadIcon = () => (
  <svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><path d="M12 3v12" /></svg>
);

const PlusIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg>
);

const variations = [
  {
    title: "With call to action",
    description: "Icon tile, title, description, and an action button.",
    code: `<EmptyState
  icon={<InboxIcon />}
  title="No messages yet"
  description="When someone sends you a message, it'll show up here."
  actions={<Button leftIcon={<PlusIcon />}>Compose</Button>}
/>`,
    render: () => (
      <EmptyState
        icon={<InboxIcon />}
        title="No messages yet"
        description="When someone sends you a message, it'll show up here."
        actions={<Button leftIcon={<PlusIcon />}>Compose</Button>}
      />
    ),
  },
  {
    title: "Bordered drop target",
    description: "Dashed border makes a good placeholder or upload zone.",
    code: `<EmptyState
  bordered
  icon={<UploadIcon />}
  title="Drop files here"
  description="Drag and drop files, or browse to upload from your device."
  actions={<Button variant="outline">Browse files</Button>}
/>`,
    render: () => (
      <EmptyState
        bordered
        icon={<UploadIcon />}
        title="Drop files here"
        description="Drag and drop files, or browse to upload from your device."
        actions={<Button variant="outline">Browse files</Button>}
      />
    ),
  },
  {
    title: "No results",
    description: "Title and description only — no action needed.",
    code: `<EmptyState
  icon={<SearchIcon />}
  title="No results found"
  description="Try adjusting your search or filters to find what you're looking for."
/>`,
    render: () => (
      <EmptyState
        icon={<SearchIcon />}
        title="No results found"
        description="Try adjusting your search or filters to find what you're looking for."
      />
    ),
  },
  {
    title: "Multiple actions",
    description: "Pass several buttons in the actions row.",
    code: `<EmptyState
  icon={<InboxIcon />}
  title="Your inbox is empty"
  description="Start a conversation or invite teammates to collaborate."
  actions={
    <>
      <Button>New message</Button>
      <Button variant="soft">Invite people</Button>
    </>
  }
/>`,
    render: () => (
      <EmptyState
        icon={<InboxIcon />}
        title="Your inbox is empty"
        description="Start a conversation or invite teammates to collaborate."
        actions={
          <>
            <Button>New message</Button>
            <Button variant="soft">Invite people</Button>
          </>
        }
      />
    ),
  },
  {
    title: "Minimal",
    description: "Just a title and a description, no icon or actions.",
    code: `<EmptyState
  title="Nothing here yet"
  description="This space will fill up as you add content."
/>`,
    render: () => (
      <EmptyState
        title="Nothing here yet"
        description="This space will fill up as you add content."
      />
    ),
  },
];

export default variations;
