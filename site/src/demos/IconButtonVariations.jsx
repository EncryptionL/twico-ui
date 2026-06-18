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
    title: "Tones",
    description: "tone is a separate axis from variant (mirrors Button) — pair tone=\"danger\" with any fill style for destructive actions.",
    code: `<IconButton aria-label="Delete" tone="danger" icon={<TrashIcon />} />
<IconButton aria-label="Delete" variant="soft" tone="danger" icon={<TrashIcon />} />
<IconButton aria-label="Delete" variant="outline" tone="danger" icon={<TrashIcon />} />
<IconButton aria-label="Delete" variant="solid" tone="danger" icon={<TrashIcon />} />`,
    render: () => (
      <>
        <IconButton aria-label="Delete (ghost danger)" tone="danger" icon={<TrashIcon />} />
        <IconButton aria-label="Delete (soft danger)" variant="soft" tone="danger" icon={<TrashIcon />} />
        <IconButton aria-label="Delete (outline danger)" variant="outline" tone="danger" icon={<TrashIcon />} />
        <IconButton aria-label="Delete (solid danger)" variant="solid" tone="danger" icon={<TrashIcon />} />
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
  {
    title: "All props",
    description: "Every IconButton-specific prop in one place. aria-label is required for icon-only buttons. variant and tone are orthogonal axes; size and round shape the control; icon is the rendered node.",
    code: `<IconButton
  icon={<HeartIcon />}
  aria-label="Add to favorites"  // required for icon-only buttons
  variant="soft"                 // solid | soft | outline | ghost
  tone="primary"                 // primary | danger
  size="md"                      // xs | sm | md | lg
  round={true}                   // fully circular
  onClick={() => {}}             // inherited DOM handler
/>`,
    render: () => (
      <>
        <IconButton
          icon={<HeartIcon />}
          aria-label="Add to favorites"
          variant="soft"
          tone="primary"
          size="md"
          round={true}
          onClick={() => {}}
        />
      </>
    ),
  },
];

export default variations;
