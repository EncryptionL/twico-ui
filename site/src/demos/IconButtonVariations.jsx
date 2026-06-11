import React from "react";
import { IconButton } from "twico-ui";

const HeartIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.5-1.5 3-3.2 3-5.5A4.5 4.5 0 0 0 12 5.5 4.5 4.5 0 0 0 2 8.5c0 2.3 1.5 4 3 5.5l7 7Z" /></svg>
);

const TrashIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14" /></svg>
);

const variations = [
  {
    title: "Variants",
    description: "Four visual styles, from highest to lowest emphasis. Default is ghost.",
    code: `<IconButton aria-label="Like" variant="solid" icon={<HeartIcon />} />
<IconButton aria-label="Like" variant="soft" icon={<HeartIcon />} />
<IconButton aria-label="Like" variant="outline" icon={<HeartIcon />} />
<IconButton aria-label="Like" variant="ghost" icon={<HeartIcon />} />`,
    render: () => (
      <>
        <IconButton aria-label="Like" variant="solid" icon={<HeartIcon />} />
        <IconButton aria-label="Like" variant="soft" icon={<HeartIcon />} />
        <IconButton aria-label="Like" variant="outline" icon={<HeartIcon />} />
        <IconButton aria-label="Like" variant="ghost" icon={<HeartIcon />} />
      </>
    ),
  },
  {
    title: "Sizes",
    code: `<IconButton aria-label="Like" variant="soft" size="sm" icon={<HeartIcon />} />
<IconButton aria-label="Like" variant="soft" size="md" icon={<HeartIcon />} />
<IconButton aria-label="Like" variant="soft" size="lg" icon={<HeartIcon />} />`,
    render: () => (
      <>
        <IconButton aria-label="Like" variant="soft" size="sm" icon={<HeartIcon />} />
        <IconButton aria-label="Like" variant="soft" size="md" icon={<HeartIcon />} />
        <IconButton aria-label="Like" variant="soft" size="lg" icon={<HeartIcon />} />
      </>
    ),
  },
  {
    title: "Round",
    description: "Set round for a fully circular button.",
    code: `<IconButton aria-label="Like" variant="solid" round icon={<HeartIcon />} />
<IconButton aria-label="Like" variant="soft" round icon={<HeartIcon />} />
<IconButton aria-label="Like" variant="outline" round icon={<HeartIcon />} />`,
    render: () => (
      <>
        <IconButton aria-label="Like" variant="solid" round icon={<HeartIcon />} />
        <IconButton aria-label="Like" variant="soft" round icon={<HeartIcon />} />
        <IconButton aria-label="Like" variant="outline" round icon={<HeartIcon />} />
      </>
    ),
  },
  {
    title: "Disabled",
    code: `<IconButton aria-label="Delete" variant="solid" disabled icon={<TrashIcon />} />
<IconButton aria-label="Delete" variant="outline" disabled icon={<TrashIcon />} />`,
    render: () => (
      <>
        <IconButton aria-label="Delete" variant="solid" disabled icon={<TrashIcon />} />
        <IconButton aria-label="Delete" variant="outline" disabled icon={<TrashIcon />} />
      </>
    ),
  },
];

export default variations;
