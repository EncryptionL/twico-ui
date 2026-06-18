import React from "react";
import { Tabs } from "twico-ui";

const HomeIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 10.5 12 3l9 7.5" /><path d="M5 9.5V21h14V9.5" /></svg>
);
const ActivityIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12h4l3 8 4-16 3 8h4" /></svg>
);
const SettingsIcon = () => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.9.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.9l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.9.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.9-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.9V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z" /></svg>
);

function ControlledTabsExample() {
  const [value, setValue] = React.useState("activity");
  return (
    <Tabs
      variant="line"
      value={value}
      onChange={setValue}
      items={[
        { value: "overview", label: "Overview", content: <p>Project overview and key metrics.</p> },
        { value: "activity", label: "Activity", content: <p>Recent activity feed.</p> },
        { value: "settings", label: "Settings", content: <p>Workspace settings.</p> },
      ]}
    />
  );
}

function TabsAllProps() {
  const [value, setValue] = React.useState("activity");
  return (
    <Tabs
      items={[
        { value: "overview", label: "Overview", icon: <HomeIcon />, content: <p>Project overview and key metrics.</p> },
        { value: "activity", label: "Activity", icon: <ActivityIcon />, count: 12, content: <p>Recent activity feed.</p> },
        { value: "settings", label: "Settings", icon: <SettingsIcon />, content: <p>Workspace settings.</p> },
      ]}
      value={value}
      onChange={setValue}
      variant="pill"
      tone="info"
      orientation="vertical"
    />
  );
}

const variations = [
  {
    title: "Line variant",
    description: "Default underline style with a sliding active indicator.",
    code: `<Tabs
  variant="line"
  defaultValue="overview"
  items={[
    { value: "overview", label: "Overview", content: <p>Project overview and key metrics.</p> },
    { value: "activity", label: "Activity", content: <p>Recent activity feed.</p> },
    { value: "settings", label: "Settings", content: <p>Workspace settings.</p> },
  ]}
/>`,
    render: () => (
      <div style={{ width: 420, maxWidth: "100%" }}>
        <Tabs
          variant="line"
          defaultValue="overview"
          items={[
            { value: "overview", label: "Overview", content: <p>Project overview and key metrics.</p> },
            { value: "activity", label: "Activity", content: <p>Recent activity feed.</p> },
            { value: "settings", label: "Settings", content: <p>Workspace settings.</p> },
          ]}
        />
      </div>
    ),
  },
  {
    title: "Pill variant",
    description: "Filled, rounded tabs for a more contained look.",
    code: `<Tabs
  variant="pill"
  defaultValue="activity"
  items={[
    { value: "overview", label: "Overview", content: <p>Project overview and key metrics.</p> },
    { value: "activity", label: "Activity", content: <p>Recent activity feed.</p> },
    { value: "settings", label: "Settings", content: <p>Workspace settings.</p> },
  ]}
/>`,
    render: () => (
      <div style={{ width: 420, maxWidth: "100%" }}>
        <Tabs
          variant="pill"
          defaultValue="activity"
          items={[
            { value: "overview", label: "Overview", content: <p>Project overview and key metrics.</p> },
            { value: "activity", label: "Activity", content: <p>Recent activity feed.</p> },
            { value: "settings", label: "Settings", content: <p>Workspace settings.</p> },
          ]}
        />
      </div>
    ),
  },
  {
    title: "With icons and counts",
    description: "Each item can carry a leading icon and a trailing count pill.",
    code: `<Tabs
  variant="line"
  defaultValue="overview"
  items={[
    { value: "overview", label: "Overview", icon: <HomeIcon />, content: <p>Project overview.</p> },
    { value: "activity", label: "Activity", icon: <ActivityIcon />, count: 12, content: <p>Recent activity feed.</p> },
    { value: "settings", label: "Settings", icon: <SettingsIcon />, content: <p>Workspace settings.</p> },
  ]}
/>`,
    render: () => (
      <div style={{ width: 460, maxWidth: "100%" }}>
        <Tabs
          variant="line"
          defaultValue="overview"
          items={[
            { value: "overview", label: "Overview", icon: <HomeIcon />, content: <p>Project overview.</p> },
            { value: "activity", label: "Activity", icon: <ActivityIcon />, count: 12, content: <p>Recent activity feed.</p> },
            { value: "settings", label: "Settings", icon: <SettingsIcon />, content: <p>Workspace settings.</p> },
          ]}
        />
      </div>
    ),
  },
  {
    title: "Nav-only (no content)",
    description: "Omit content to render tabs purely as a navigation bar.",
    code: `<Tabs
  variant="pill"
  defaultValue="all"
  items={[
    { value: "all", label: "All" },
    { value: "active", label: "Active", count: 8 },
    { value: "archived", label: "Archived", count: 3 },
  ]}
/>`,
    render: () => (
      <div style={{ width: 360, maxWidth: "100%" }}>
        <Tabs
          variant="pill"
          defaultValue="all"
          items={[
            { value: "all", label: "All" },
            { value: "active", label: "Active", count: 8 },
            { value: "archived", label: "Archived", count: 3 },
          ]}
        />
      </div>
    ),
  },
  {
    title: "Controlled",
    description: "Drive the active tab from state with value + onChange.",
    code: `function ControlledTabs() {
  const [value, setValue] = React.useState("activity");
  return (
    <Tabs
      variant="line"
      value={value}
      onChange={setValue}
      items={[
        { value: "overview", label: "Overview", content: <p>Project overview and key metrics.</p> },
        { value: "activity", label: "Activity", content: <p>Recent activity feed.</p> },
        { value: "settings", label: "Settings", content: <p>Workspace settings.</p> },
      ]}
    />
  );
}`,
    render: () => (
      <div style={{ width: 420, maxWidth: "100%" }}>
        <ControlledTabsExample />
      </div>
    ),
  },
  {
    title: "Tones",
    description: "Color intents tint the active label and indicator: primary, success, warning, danger, info.",
    code: `<Tabs variant="line" tone="primary" defaultValue="overview" items={items} />
<Tabs variant="line" tone="success" defaultValue="overview" items={items} />
<Tabs variant="line" tone="warning" defaultValue="overview" items={items} />
<Tabs variant="pill" tone="danger" defaultValue="overview" items={items} />
<Tabs variant="pill" tone="info" defaultValue="overview" items={items} />`,
    render: () => {
      const items = [
        { value: "overview", label: "Overview", content: <p>Project overview and key metrics.</p> },
        { value: "activity", label: "Activity", content: <p>Recent activity feed.</p> },
        { value: "settings", label: "Settings", content: <p>Workspace settings.</p> },
      ];
      return (
        <div style={{ display: "grid", gap: 24, width: 420, maxWidth: "100%" }}>
          <Tabs variant="line" tone="primary" defaultValue="overview" items={items} />
          <Tabs variant="line" tone="success" defaultValue="overview" items={items} />
          <Tabs variant="line" tone="warning" defaultValue="overview" items={items} />
          <Tabs variant="pill" tone="danger" defaultValue="overview" items={items} />
          <Tabs variant="pill" tone="info" defaultValue="overview" items={items} />
        </div>
      );
    },
  },
  {
    title: "All props",
    description:
      "Every Tabs prop in one place — the items array (each item's value, label, icon, count, and content panel), controlled value + onChange, variant, tone, and orientation. Swap value/onChange for defaultValue to run uncontrolled.",
    code: `function TabsAllProps() {
  const [value, setValue] = React.useState("activity");
  return (
    <Tabs
      items={[
        { value: "overview", label: "Overview", icon: <HomeIcon />, content: <p>Project overview and key metrics.</p> },
        { value: "activity", label: "Activity", icon: <ActivityIcon />, count: 12, content: <p>Recent activity feed.</p> },
        { value: "settings", label: "Settings", icon: <SettingsIcon />, content: <p>Workspace settings.</p> },
      ]}
      value={value}          // controlled — or defaultValue for uncontrolled
      onChange={setValue}
      variant="pill"         // line | pill
      tone="info"            // primary | success | warning | danger | info | neutral
      orientation="vertical" // horizontal | vertical
    />
  );
}`,
    render: () => (
      <div style={{ width: 460, maxWidth: "100%" }}>
        <TabsAllProps />
      </div>
    ),
  },
];

export default variations;
