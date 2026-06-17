import React from "react";
import { Timeline } from "twico-ui";

const CheckIcon = () => (
  <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>
);
const TruckIcon = () => (
  <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 17h4V5H2v12h2m12 0h2.5a1.5 1.5 0 0 0 1.5-1.5V11l-3-3h-4v9h1m-9 0a2 2 0 1 0 4 0 2 2 0 0 0-4 0Zm12 0a2 2 0 1 0 4 0 2 2 0 0 0-4 0Z" /></svg>
);
const DotIcon = () => (
  <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor"><circle cx="12" cy="12" r="5" /></svg>
);

const variations = [
  {
    title: "Basic",
    description: "Title and time only — the minimal shape, just titles connected by the rail.",
    code: `<Timeline
  items={[
    { title: "Account created" },
    { title: "Profile completed", time: "2 days ago" },
    { title: "First project shipped", time: "Today" },
  ]}
/>`,
    render: () => (
      <div style={{ width: 420, maxWidth: "100%" }}>
        <Timeline
          items={[
            { title: "Account created" },
            { title: "Profile completed", time: "2 days ago" },
            { title: "First project shipped", time: "Today" },
          ]}
        />
      </div>
    ),
  },
  {
    title: "Tones",
    description: "Each item's node dot can carry a tone: primary, success, warning, or danger.",
    code: `<Timeline
  items={[
    { title: "Order placed", time: "9:41 AM", tone: "primary" },
    { title: "Shipped", time: "2:10 PM", tone: "success" },
    { title: "Delayed", time: "3:20 PM", tone: "warning" },
    { title: "Failed delivery", time: "5:00 PM", tone: "danger" },
  ]}
/>`,
    render: () => (
      <div style={{ width: 420, maxWidth: "100%" }}>
        <Timeline
          items={[
            { title: "Order placed", time: "9:41 AM", tone: "primary" },
            { title: "Shipped", time: "2:10 PM", tone: "success" },
            { title: "Delayed", time: "3:20 PM", tone: "warning" },
            { title: "Failed delivery", time: "5:00 PM", tone: "danger" },
          ]}
        />
      </div>
    ),
  },
  {
    title: "With descriptions",
    description: "Add a supporting description under each event for richer context.",
    code: `<Timeline
  items={[
    { title: "Order placed", time: "9:41 AM", description: "We received your order and sent a confirmation email.", tone: "primary" },
    { title: "Shipped", time: "2:10 PM", description: "Your package left the warehouse.", tone: "success" },
    { title: "Out for delivery", time: "Today", description: "Arriving by 5:00 PM.", tone: "warning" },
    { title: "Delivered", time: "Tomorrow" },
  ]}
/>`,
    render: () => (
      <div style={{ width: 420, maxWidth: "100%" }}>
        <Timeline
          items={[
            { title: "Order placed", time: "9:41 AM", description: "We received your order and sent a confirmation email.", tone: "primary" },
            { title: "Shipped", time: "2:10 PM", description: "Your package left the warehouse.", tone: "success" },
            { title: "Out for delivery", time: "Today", description: "Arriving by 5:00 PM.", tone: "warning" },
            { title: "Delivered", time: "Tomorrow" },
          ]}
        />
      </div>
    ),
  },
  {
    title: "With icons",
    description: "Drop an inline SVG into each node dot via the item's icon prop.",
    code: `<Timeline
  items={[
    { title: "Order placed", time: "9:41 AM", icon: <CheckIcon />, tone: "primary" },
    { title: "Shipped", time: "2:10 PM", icon: <TruckIcon />, tone: "success" },
    { title: "Out for delivery", time: "Today", icon: <DotIcon />, tone: "warning" },
  ]}
/>`,
    render: () => (
      <div style={{ width: 420, maxWidth: "100%" }}>
        <Timeline
          items={[
            { title: "Order placed", time: "9:41 AM", icon: <CheckIcon />, tone: "primary" },
            { title: "Shipped", time: "2:10 PM", icon: <TruckIcon />, tone: "success" },
            { title: "Out for delivery", time: "Today", icon: <DotIcon />, tone: "warning" },
          ]}
        />
      </div>
    ),
  },
  {
    title: "Activity feed",
    description: "Combine tones, icons, and descriptions for a complete activity log.",
    code: `<Timeline
  items={[
    { title: "Jane merged a pull request", time: "10:02 AM", description: "feat: add Timeline component", icon: <CheckIcon />, tone: "success" },
    { title: "CI build started", time: "10:03 AM", description: "Running tests on main.", icon: <DotIcon />, tone: "primary" },
    { title: "Deploy queued", time: "10:09 AM", description: "Waiting for an available runner.", tone: "warning" },
    { title: "Deploy failed", time: "10:14 AM", description: "Timed out after 5 minutes.", tone: "danger" },
  ]}
/>`,
    render: () => (
      <div style={{ width: 440, maxWidth: "100%" }}>
        <Timeline
          items={[
            { title: "Jane merged a pull request", time: "10:02 AM", description: "feat: add Timeline component", icon: <CheckIcon />, tone: "success" },
            { title: "CI build started", time: "10:03 AM", description: "Running tests on main.", icon: <DotIcon />, tone: "primary" },
            { title: "Deploy queued", time: "10:09 AM", description: "Waiting for an available runner.", tone: "warning" },
            { title: "Deploy failed", time: "10:14 AM", description: "Timed out after 5 minutes.", tone: "danger" },
          ]}
        />
      </div>
    ),
  },
  {
    title: "All tones",
    description: "Every node tone side by side — primary, info, success, warning, and danger — so you can see each accent color on its dot.",
    code: `<Timeline
  items={[
    { title: "Primary", time: "Step 1", description: "The default brand accent.", tone: "primary" },
    { title: "Info", time: "Step 2", description: "Neutral, informational events.", tone: "info" },
    { title: "Success", time: "Step 3", description: "Something completed successfully.", tone: "success" },
    { title: "Warning", time: "Step 4", description: "Needs attention soon.", tone: "warning" },
    { title: "Danger", time: "Step 5", description: "An error or failed step.", tone: "danger" },
  ]}
/>`,
    render: () => (
      <div style={{ display: "flex", width: 440, maxWidth: "100%" }}>
        <Timeline
          items={[
            { title: "Primary", time: "Step 1", description: "The default brand accent.", tone: "primary" },
            { title: "Info", time: "Step 2", description: "Neutral, informational events.", tone: "info" },
            { title: "Success", time: "Step 3", description: "Something completed successfully.", tone: "success" },
            { title: "Warning", time: "Step 4", description: "Needs attention soon.", tone: "warning" },
            { title: "Danger", time: "Step 5", description: "An error or failed step.", tone: "danger" },
          ]}
        />
      </div>
    ),
  },
];

export default variations;
