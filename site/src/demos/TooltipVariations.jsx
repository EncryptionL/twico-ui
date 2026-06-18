import React from "react";
import { Tooltip, Button, IconButton } from "twico-ui";

const InfoIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M12 16v-4M12 8h.01" /></svg>
);

const variations = [
  {
    title: "Placements",
    description: "Position the tooltip on any of the four sides of its trigger.",
    code: `<Tooltip label="On top" placement="top">
  <Button variant="outline" size="sm">Top</Button>
</Tooltip>
<Tooltip label="On the right" placement="right">
  <Button variant="outline" size="sm">Right</Button>
</Tooltip>
<Tooltip label="On the bottom" placement="bottom">
  <Button variant="outline" size="sm">Bottom</Button>
</Tooltip>
<Tooltip label="On the left" placement="left">
  <Button variant="outline" size="sm">Left</Button>
</Tooltip>`,
    render: () => (
      <>
        <Tooltip label="On top" placement="top">
          <Button variant="outline" size="sm">Top</Button>
        </Tooltip>
        <Tooltip label="On the right" placement="right">
          <Button variant="outline" size="sm">Right</Button>
        </Tooltip>
        <Tooltip label="On the bottom" placement="bottom">
          <Button variant="outline" size="sm">Bottom</Button>
        </Tooltip>
        <Tooltip label="On the left" placement="left">
          <Button variant="outline" size="sm">Left</Button>
        </Tooltip>
      </>
    ),
  },
  {
    title: "On an icon button",
    description: "A tooltip gives an icon-only trigger an accessible, visible name.",
    code: `<Tooltip label="More information">
  <IconButton aria-label="More information" icon={<InfoIcon />} variant="soft" />
</Tooltip>`,
    render: () => (
      <Tooltip label="More information">
        <IconButton aria-label="More information" icon={<InfoIcon />} variant="soft" />
      </Tooltip>
    ),
  },
  {
    title: "Open delay",
    description: "Tune how long the pointer must rest before the tooltip appears.",
    code: `<Tooltip label="Appears instantly" delay={0}>
  <Button variant="outline" size="sm">No delay</Button>
</Tooltip>
<Tooltip label="Waits 600ms" delay={600}>
  <Button variant="outline" size="sm">Slow</Button>
</Tooltip>`,
    render: () => (
      <>
        <Tooltip label="Appears instantly" delay={0}>
          <Button variant="outline" size="sm">No delay</Button>
        </Tooltip>
        <Tooltip label="Waits 600ms" delay={600}>
          <Button variant="outline" size="sm">Slow</Button>
        </Tooltip>
      </>
    ),
  },
  {
    title: "Rich label",
    description: "The label accepts any React node, not just plain text.",
    code: `<Tooltip
  placement="bottom"
  label={<span>Press <kbd>⌘</kbd> <kbd>K</kbd></span>}
>
  <Button size="sm">Shortcut</Button>
</Tooltip>`,
    render: () => (
      <Tooltip
        placement="bottom"
        label={<span>Press <kbd>⌘</kbd> <kbd>K</kbd></span>}
      >
        <Button size="sm">Shortcut</Button>
      </Tooltip>
    ),
  },
  {
    title: "All props",
    description: "Every Tooltip-specific prop in one place: the label (any React node), the placement, and the open delay — wrapped around its single trigger child.",
    code: `<Tooltip
  label={<span>Profile <InfoIcon /></span>}   // any React node
  placement="right"                            // top | bottom | left | right
  delay={200}                                  // open delay in ms
>
  <Button variant="soft" size="sm">Hover me</Button>
</Tooltip>`,
    render: () => (
      <Tooltip
        label={<span style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>Profile <InfoIcon /></span>}
        placement="right"
        delay={200}
      >
        <Button variant="soft" size="sm">Hover me</Button>
      </Tooltip>
    ),
  },
];

export default variations;
