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
];

export default variations;
