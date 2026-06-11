import React from "react";
import { Tag } from "twico-ui";

const HashIcon = () => (
  <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 9h16M4 15h16M10 3 8 21M16 3l-2 18" /></svg>
);

function RemovableList() {
  const [tags, setTags] = React.useState(["react", "design-system", "ui"]);
  const remove = (name) => setTags((prev) => prev.filter((t) => t !== name));
  return (
    <>
      {tags.map((t) => (
        <Tag key={t} onRemove={() => remove(t)}>
          {t}
        </Tag>
      ))}
    </>
  );
}

const variations = [
  {
    title: "Basic",
    description: "A read-only chip for keywords or selected values.",
    code: `<Tag>react</Tag>
<Tag>design-system</Tag>
<Tag>ui</Tag>`,
    render: () => (
      <>
        <Tag>react</Tag>
        <Tag>design-system</Tag>
        <Tag>ui</Tag>
      </>
    ),
  },
  {
    title: "With leading icon",
    description: "Add a leftIcon to label the kind of value.",
    code: `<Tag leftIcon={<HashIcon />}>design-system</Tag>
<Tag leftIcon={<span>#</span>}>frontend</Tag>`,
    render: () => (
      <>
        <Tag leftIcon={<HashIcon />}>design-system</Tag>
        <Tag leftIcon={<span>#</span>}>frontend</Tag>
      </>
    ),
  },
  {
    title: "Removable",
    description: "Passing onRemove renders a × button.",
    code: `<Tag onRemove={() => remove("react")}>react</Tag>
<Tag leftIcon={<HashIcon />} onRemove={() => remove("ui")}>ui</Tag>`,
    render: () => (
      <>
        <Tag onRemove={() => {}}>react</Tag>
        <Tag leftIcon={<HashIcon />} onRemove={() => {}}>ui</Tag>
      </>
    ),
  },
  {
    title: "Removable list",
    description: "Track tags in state and filter on remove.",
    code: `const [tags, setTags] = useState(["react", "design-system", "ui"]);
const remove = (name) => setTags((prev) => prev.filter((t) => t !== name));

{tags.map((t) => (
  <Tag key={t} onRemove={() => remove(t)}>{t}</Tag>
))}`,
    render: () => <RemovableList />,
  },
];

export default variations;
