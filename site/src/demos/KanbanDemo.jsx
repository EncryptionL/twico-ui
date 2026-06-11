import React, { useState } from "react";
import { Kanban } from "twico-ui";

const columns = [
  { id: "todo", title: "To do", color: "var(--slate-400)" },
  { id: "doing", title: "In progress", color: "var(--amber-500)" },
  { id: "done", title: "Done", color: "var(--emerald-500)" },
];

const initialCards = [
  { id: "1", column: "todo", title: "Design tokens", description: "Audit color scales", tags: ["Design"] },
  { id: "2", column: "todo", title: "Write docs" },
  { id: "3", column: "doing", title: "Datatable filters", tags: ["Frontend"] },
  { id: "4", column: "done", title: "Ship release", description: "v1.2.0 published" },
];

export default function KanbanDemo() {
  const [cards, setCards] = useState(initialCards);
  return (
    <div style={{ width: "100%", overflowX: "auto" }}>
      <Kanban
        columns={columns}
        cards={cards}
        onCardMove={(id, to, next) => setCards(next)}
      />
    </div>
  );
}
