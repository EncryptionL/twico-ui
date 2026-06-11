import React from "react";
import { Stat } from "twico-ui";

const DollarIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
  </svg>
);

const UsersIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M8.5 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8M23 21v-2a4 4 0 0 0-3-3.87M17 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const variations = [
  {
    title: "Basic",
    description: "Label, value, and a trend delta. Direction is inferred from a leading minus sign.",
    code: `<Stat label="Revenue" value="$48,200" delta="+12.5%" helpText="vs last month" />`,
    render: () => (
      <Stat label="Revenue" value="$48,200" delta="+12.5%" helpText="vs last month" />
    ),
  },
  {
    title: "Delta directions",
    description: "Override the inferred direction with up, down, or flat to control color and arrow.",
    code: `<Stat label="Churn" value="2.1%" delta="-0.4%" deltaDirection="up" helpText="improved" />
<Stat label="Refunds" value="$1,920" delta="+8%" deltaDirection="down" helpText="vs last week" />
<Stat label="Active users" value="1,284" delta="0%" deltaDirection="flat" />`,
    render: () => (
      <>
        <Stat label="Churn" value="2.1%" delta="-0.4%" deltaDirection="up" helpText="improved" />
        <Stat label="Refunds" value="$1,920" delta="+8%" deltaDirection="down" helpText="vs last week" />
        <Stat label="Active users" value="1,284" delta="0%" deltaDirection="flat" />
      </>
    ),
  },
  {
    title: "With icon",
    description: "An icon is shown top-right in a tinted tile.",
    code: `<Stat label="Revenue" value="$48,200" delta="+12.5%" helpText="vs last month" icon={<DollarIcon />} />
<Stat label="Active users" value="1,284" delta="+3.2%" icon={<UsersIcon />} />`,
    render: () => (
      <>
        <Stat label="Revenue" value="$48,200" delta="+12.5%" helpText="vs last month" icon={<DollarIcon />} />
        <Stat label="Active users" value="1,284" delta="+3.2%" icon={<UsersIcon />} />
      </>
    ),
  },
  {
    title: "Value only",
    description: "Drop the delta and help text for a clean single metric.",
    code: `<Stat label="Open tickets" value="42" />
<Stat label="Avg. response" value="1h 12m" />`,
    render: () => (
      <>
        <Stat label="Open tickets" value="42" />
        <Stat label="Avg. response" value="1h 12m" />
      </>
    ),
  },
  {
    title: "Plain",
    description: "Drop the card chrome (no border, background, or padding) to embed in your own layout.",
    code: `<Stat plain label="Revenue" value="$48,200" delta="+12.5%" helpText="vs last month" />`,
    render: () => (
      <Stat plain label="Revenue" value="$48,200" delta="+12.5%" helpText="vs last month" />
    ),
  },
];

export default variations;
