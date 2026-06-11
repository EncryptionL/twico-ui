import React from "react";
import { Popover, Button, Input } from "twico-ui";

const InfoIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9" /><path d="M12 16v-4M12 8h.01" /></svg>
);

const variations = [
  {
    title: "Basic",
    description: "A click-triggered panel with a title and rich content.",
    code: `<Popover
  trigger={<Button variant="outline">Share</Button>}
  title="Share link"
  width={260}
>
  <Input defaultValue="https://twico.dev/x" />
  <Button fullWidth>Copy link</Button>
</Popover>`,
    render: () => (
      <Popover
        trigger={<Button variant="outline">Share</Button>}
        title="Share link"
        width={260}
      >
        <Input defaultValue="https://twico.dev/x" />
        <Button fullWidth>Copy link</Button>
      </Popover>
    ),
  },
  {
    title: "Placement",
    description: "Open toward any of the four sides. Auto-flips near a viewport edge.",
    code: `<Popover trigger={<Button variant="soft">Top</Button>} placement="top">
  Opens upward.
</Popover>
<Popover trigger={<Button variant="soft">Right</Button>} placement="right">
  Opens to the right.
</Popover>
<Popover trigger={<Button variant="soft">Bottom</Button>} placement="bottom">
  Opens downward.
</Popover>`,
    render: () => (
      <>
        <Popover trigger={<Button variant="soft">Top</Button>} placement="top">
          Opens upward.
        </Popover>
        <Popover trigger={<Button variant="soft">Right</Button>} placement="right">
          Opens to the right.
        </Popover>
        <Popover trigger={<Button variant="soft">Bottom</Button>} placement="bottom">
          Opens downward.
        </Popover>
      </>
    ),
  },
  {
    title: "Alignment",
    description: "Cross-axis alignment for top/bottom placements.",
    code: `<Popover trigger={<Button variant="outline">Start</Button>} align="start">
  Aligned to the trigger's start edge.
</Popover>
<Popover trigger={<Button variant="outline">End</Button>} align="end">
  Aligned to the trigger's end edge.
</Popover>`,
    render: () => (
      <>
        <Popover trigger={<Button variant="outline">Start</Button>} align="start">
          Aligned to the trigger's start edge.
        </Popover>
        <Popover trigger={<Button variant="outline">End</Button>} align="end">
          Aligned to the trigger's end edge.
        </Popover>
      </>
    ),
  },
  {
    title: "Custom width",
    description: "Set the panel width in pixels for wider content.",
    code: `<Popover
  trigger={<Button leftIcon={<InfoIcon />} variant="ghost">Details</Button>}
  title="About this metric"
  width={320}
>
  Daily active users counts unique signed-in accounts that performed at least one
  action in the last 24 hours.
</Popover>`,
    render: () => (
      <Popover
        trigger={<Button leftIcon={<InfoIcon />} variant="ghost">Details</Button>}
        title="About this metric"
        width={320}
      >
        Daily active users counts unique signed-in accounts that performed at least one
        action in the last 24 hours.
      </Popover>
    ),
  },
  {
    title: "No title",
    description: "Omit the title for a plain content panel.",
    code: `<Popover trigger={<Button>Quick note</Button>}>
  This popover has no bold title — just body content.
</Popover>`,
    render: () => (
      <Popover trigger={<Button>Quick note</Button>}>
        This popover has no bold title — just body content.
      </Popover>
    ),
  },
];

export default variations;
