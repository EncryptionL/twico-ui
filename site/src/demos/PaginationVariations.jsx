import React from "react";
import { Pagination } from "twico-ui";

function BasicExample() {
  const [page, setPage] = React.useState(1);
  return <Pagination page={page} total={12} onChange={setPage} />;
}

function SmallExample() {
  const [page, setPage] = React.useState(4);
  return <Pagination page={page} total={20} onChange={setPage} size="sm" />;
}

function SiblingsExample() {
  const [page, setPage] = React.useState(10);
  return (
    <Pagination
      page={page}
      total={24}
      onChange={setPage}
      siblings={2}
      boundaries={2}
    />
  );
}

function JumperExample() {
  const [page, setPage] = React.useState(1);
  return (
    <Pagination
      page={page}
      total={50}
      onChange={setPage}
      showJumper
      jumperLabel="Go to"
    />
  );
}

function PaginationAllProps() {
  const [page, setPage] = React.useState(7);
  return (
    <Pagination
      page={page}
      total={24}
      onChange={setPage}
      siblings={1}
      boundaries={1}
      size="md"
      showPageJumper
      jumperLabel="Jump to"
    />
  );
}

const variations = [
  {
    title: "Basic",
    description: "Controlled page navigation with smart ellipsis truncation.",
    code: `const [page, setPage] = React.useState(1);

<Pagination page={page} total={12} onChange={setPage} />`,
    render: () => <BasicExample />,
  },
  {
    title: "Small size",
    description: "A more compact control for dense layouts.",
    code: `const [page, setPage] = React.useState(4);

<Pagination page={page} total={20} onChange={setPage} size="sm" />`,
    render: () => <SmallExample />,
  },
  {
    title: "More siblings and boundaries",
    description: "Show extra page numbers around the current page and at each end.",
    code: `const [page, setPage] = React.useState(10);

<Pagination
  page={page}
  total={24}
  onChange={setPage}
  siblings={2}
  boundaries={2}
/>`,
    render: () => <SiblingsExample />,
  },
  {
    title: "With page jumper",
    description: 'Adds a "Go to" input for jumping directly to a page.',
    code: `const [page, setPage] = React.useState(1);

<Pagination
  page={page}
  total={50}
  onChange={setPage}
  showJumper
  jumperLabel="Go to"
/>`,
    render: () => <JumperExample />,
  },
  {
    title: "All props",
    description:
      "Every Pagination prop in one place — controlled page + onChange, total, siblings/boundaries window sizing, size, and the page jumper input with a custom label. Use defaultPage instead of page for an uncontrolled control; showJumper is the deprecated alias for showPageJumper.",
    code: `const [page, setPage] = React.useState(7);

<Pagination
  page={page}              // controlled current page (or defaultPage for uncontrolled)
  total={24}               // required: total number of pages
  onChange={setPage}       // (page: number) => void
  siblings={1}             // pages shown each side of current
  boundaries={1}           // pages always shown at each end
  size="md"                // sm | md | lg
  showPageJumper           // "Go to" input (showJumper is the deprecated alias)
  jumperLabel="Jump to"    // label before the jump input
/>`,
    render: () => <PaginationAllProps />,
  },
];

export default variations;
