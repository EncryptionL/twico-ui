import React from "react";
import { Breadcrumb } from "twico-ui";

const HomeIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9.5 12 3l9 6.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1Z" /></svg>
);

const SlashIcon = () => (
  <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="m16 4-8 16" /></svg>
);

const longTrail = [
  { label: "Home", href: "/" },
  { label: "Projects", href: "/projects" },
  { label: "Twico UI", href: "/projects/twico-ui" },
  { label: "Components", href: "/projects/twico-ui/components" },
  { label: "Breadcrumb" },
];

const variations = [
  {
    title: "Basic trail",
    description: "The last item renders as the current page and is not a link.",
    code: `<Breadcrumb
  items={[
    { label: "Home", href: "/" },
    { label: "Projects", href: "/projects" },
    { label: "Breadcrumb" },
  ]}
/>`,
    render: () => (
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Projects", href: "/projects" },
          { label: "Breadcrumb" },
        ]}
      />
    ),
  },
  {
    title: "With icons",
    description: "Each item can carry a leading icon.",
    code: `<Breadcrumb
  items={[
    { label: "Home", href: "/", icon: <HomeIcon /> },
    { label: "Projects", href: "/projects" },
    { label: "Twico UI" },
  ]}
/>`,
    render: () => (
      <Breadcrumb
        items={[
          { label: "Home", href: "/", icon: <HomeIcon /> },
          { label: "Projects", href: "/projects" },
          { label: "Twico UI" },
        ]}
      />
    ),
  },
  {
    title: "Custom separator",
    description: "Swap the default chevron for any node.",
    code: `<Breadcrumb
  separator={<SlashIcon />}
  items={[
    { label: "Home", href: "/" },
    { label: "Docs", href: "/docs" },
    { label: "Breadcrumb" },
  ]}
/>`,
    render: () => (
      <Breadcrumb
        separator={<SlashIcon />}
        items={[
          { label: "Home", href: "/" },
          { label: "Docs", href: "/docs" },
          { label: "Breadcrumb" },
        ]}
      />
    ),
  },
  {
    title: "Collapsed middle",
    description: "Past maxItems, the middle collapses to “…”. Click it to expand.",
    code: `<Breadcrumb maxItems={3} items={longTrail} />`,
    render: () => <Breadcrumb maxItems={3} items={longTrail} />,
  },
];

export default variations;
