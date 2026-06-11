import React from "react";
import { Kanban, Avatar, Badge } from "twico-ui";

const baseColumns = [
  { id: "todo", title: "To do", color: "var(--slate-400)" },
  { id: "doing", title: "In progress", color: "var(--amber-500)" },
  { id: "done", title: "Done", color: "var(--emerald-500)" },
];

const baseCards = [
  { id: "1", column: "todo", title: "Design tokens", description: "Audit color scales", tags: ["Design"] },
  { id: "2", column: "todo", title: "Write docs" },
  { id: "3", column: "doing", title: "Datatable filters", tags: ["Frontend"] },
  { id: "4", column: "done", title: "Ship release", description: "v1.2.0 published" },
];

const variations = [
  {
    title: "Basic board",
    description: "Three columns with cards. Uncontrolled — drag cards between columns and the board tracks moves internally.",
    code: `const columns = [
  { id: "todo", title: "To do", color: "var(--slate-400)" },
  { id: "doing", title: "In progress", color: "var(--amber-500)" },
  { id: "done", title: "Done", color: "var(--emerald-500)" },
];

const cards = [
  { id: "1", column: "todo", title: "Design tokens", description: "Audit color scales", tags: ["Design"] },
  { id: "2", column: "todo", title: "Write docs" },
  { id: "3", column: "doing", title: "Datatable filters", tags: ["Frontend"] },
  { id: "4", column: "done", title: "Ship release", description: "v1.2.0 published" },
];

<Kanban columns={columns} cards={cards} />`,
    render: () => (
      <div style={{ width: "100%", overflowX: "auto" }}>
        <Kanban columns={baseColumns} cards={baseCards} />
      </div>
    ),
  },
  {
    title: "Cards with footers",
    description: "Use a card's footer node for an assignee Avatar or due date alongside its tags.",
    code: `const cards = [
  {
    id: "1",
    column: "todo",
    title: "Onboarding flow",
    tags: ["Design"],
    footer: <Avatar name="Ada Lovelace" size="xs" />,
  },
  {
    id: "2",
    column: "doing",
    title: "API rate limits",
    tags: ["Backend"],
    footer: <Avatar name="Grace Hopper" size="xs" />,
  },
];

<Kanban columns={columns} cards={cards} />`,
    render: () => (
      <div style={{ width: "100%", overflowX: "auto" }}>
        <Kanban
          columns={baseColumns}
          cards={[
            { id: "1", column: "todo", title: "Onboarding flow", tags: ["Design"], footer: <Avatar name="Ada Lovelace" size="xs" /> },
            { id: "2", column: "doing", title: "API rate limits", tags: ["Backend"], footer: <Avatar name="Grace Hopper" size="xs" /> },
            { id: "3", column: "done", title: "Auth refactor", tags: ["Backend"], footer: <Avatar name="Alan Turing" size="xs" /> },
          ]}
        />
      </div>
    ),
  },
  {
    title: "Controlled",
    description: "Pass cards + onCardMove to own the state. The handler receives (cardId, toColumn, nextCards).",
    code: `function ControlledBoard() {
  const [cards, setCards] = React.useState([
    { id: "1", column: "todo", title: "Design tokens", tags: ["Design"] },
    { id: "2", column: "doing", title: "Datatable filters", tags: ["Frontend"] },
    { id: "3", column: "done", title: "Ship release" },
  ]);

  return (
    <Kanban
      columns={columns}
      cards={cards}
      onCardMove={(id, to, next) => setCards(next)}
    />
  );
}`,
    render: () => <ControlledBoard />,
  },
  {
    title: "Custom card renderer",
    description: "Supply renderCard to fully control each card's content — here a Badge plus an assignee.",
    code: `<Kanban
  columns={columns}
  cards={cards}
  renderCard={(card) => (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Badge tone={card.tone}>{card.priority}</Badge>
        <Avatar name={card.assignee} size="xs" />
      </div>
      <div style={{ fontWeight: 600, fontSize: 14 }}>{card.title}</div>
    </div>
  )}
/>`,
    render: () => (
      <div style={{ width: "100%", overflowX: "auto" }}>
        <Kanban
          columns={baseColumns}
          cards={[
            { id: "1", column: "todo", title: "Migrate billing API", priority: "High", tone: "danger", assignee: "Ada Lovelace" },
            { id: "2", column: "doing", title: "Polish empty states", priority: "Low", tone: "neutral", assignee: "Grace Hopper" },
            { id: "3", column: "done", title: "Dark mode pass", priority: "Med", tone: "warning", assignee: "Alan Turing" },
          ]}
          renderCard={(card) => (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <Badge tone={card.tone}>{card.priority}</Badge>
                <Avatar name={card.assignee} size="xs" />
              </div>
              <div style={{ fontWeight: 600, fontSize: 14 }}>{card.title}</div>
            </div>
          )}
        />
      </div>
    ),
  },
];

function ControlledBoard() {
  const [cards, setCards] = React.useState([
    { id: "1", column: "todo", title: "Design tokens", tags: ["Design"] },
    { id: "2", column: "doing", title: "Datatable filters", tags: ["Frontend"] },
    { id: "3", column: "done", title: "Ship release" },
  ]);

  return (
    <div style={{ width: "100%", overflowX: "auto" }}>
      <Kanban
        columns={baseColumns}
        cards={cards}
        onCardMove={(id, to, next) => setCards(next)}
      />
    </div>
  );
}

export default variations;
