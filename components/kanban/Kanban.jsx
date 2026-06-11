import React from "react";

const KANBAN_CSS = `
.twc-kanban { display: flex; gap: var(--space-4); font-family: var(--font-sans); overflow-x: auto; padding-bottom: var(--space-2); align-items: flex-start; }
.twc-kanban__col { flex: 0 0 280px; display: flex; flex-direction: column; max-height: 100%;
  background: var(--color-surface-sunken); border: var(--border-thin) solid var(--color-border); border-radius: var(--radius-xl); }
.twc-kanban__col[data-over="true"] { box-shadow: inset 0 0 0 2px var(--color-primary); background: var(--color-primary-subtle); }
.twc-kanban__col-h { display: flex; align-items: center; gap: var(--space-2); padding: var(--space-3) var(--space-4); }
.twc-kanban__dot { width: 9px; height: 9px; border-radius: var(--radius-full); flex: none; background: var(--_c, var(--color-text-subtle)); }
.twc-kanban__col-title { font-size: var(--text-sm); font-weight: var(--font-bold); color: var(--color-text); }
.twc-kanban__count { font-size: var(--text-xs); font-weight: var(--font-bold); color: var(--color-text-subtle); background: var(--color-surface); border: var(--border-thin) solid var(--color-border); border-radius: var(--radius-full); padding: 1px 8px; }
.twc-kanban__list { display: flex; flex-direction: column; gap: var(--space-2); padding: 0 var(--space-3) var(--space-3); overflow-y: auto; min-height: 24px; }
.twc-kanban__card { background: var(--color-surface); border: var(--border-thin) solid var(--color-border); border-radius: var(--radius-lg); padding: var(--space-3); box-shadow: var(--shadow-xs); cursor: grab;
  transition: box-shadow var(--duration-fast) var(--ease-standard), transform var(--duration-fast) var(--ease-spring), border-color var(--duration-fast); }
.twc-kanban__card:hover { box-shadow: var(--shadow-sm); border-color: var(--color-border-strong); }
.twc-kanban__card[data-dragging="true"] { opacity: 0.5; }
.twc-kanban__card:active { cursor: grabbing; }
.twc-kanban__card-title { font-size: var(--text-sm); font-weight: var(--font-semibold); color: var(--color-text); line-height: var(--leading-snug); }
.twc-kanban__card-desc { font-size: var(--text-xs); color: var(--color-text-muted); margin-top: 4px; line-height: var(--leading-snug); }
.twc-kanban__card-foot { display: flex; align-items: center; justify-content: space-between; margin-top: var(--space-3); }
.twc-kanban__tags { display: flex; flex-wrap: wrap; gap: 4px; }
.twc-kanban__tag { font-size: 10px; font-weight: var(--font-bold); padding: 2px 7px; border-radius: var(--radius-full); background: var(--color-primary-subtle); color: var(--color-primary-subtle-fg); text-transform: uppercase; letter-spacing: 0.03em; }
`;

export function Kanban({
  columns,
  cards,
  onCardMove,
  renderCard,
  className = "",
  ...rest
}) {
  React.useInsertionEffect(() => {
    if (document.getElementById("twc-kanban-styles")) return;
    const el = document.createElement("style");
    el.id = "twc-kanban-styles";
    el.textContent = KANBAN_CSS;
    document.head.appendChild(el);
  }, []);

  const [internal, setInternal] = React.useState(cards);
  const items = cards !== undefined ? cards : internal;
  const [drag, setDrag] = React.useState(null); // card id
  const [overCol, setOverCol] = React.useState(null);

  const move = (cardId, toCol) => {
    const card = items.find((c) => c.id === cardId);
    if (!card || card.column === toCol) return;
    const next = items.map((c) => (c.id === cardId ? { ...c, column: toCol } : c));
    if (cards === undefined) setInternal(next);
    onCardMove?.(cardId, toCol, next);
  };

  return (
    <div className={`twc-kanban ${className}`} {...rest}>
      {columns.map((col) => {
        const colCards = items.filter((c) => c.column === col.id);
        return (
          <div key={col.id} className="twc-kanban__col" data-over={overCol === col.id || undefined}
            onDragOver={(e) => { e.preventDefault(); setOverCol(col.id); }}
            onDragLeave={(e) => { if (!e.currentTarget.contains(e.relatedTarget)) setOverCol(null); }}
            onDrop={(e) => { e.preventDefault(); if (drag) move(drag, col.id); setOverCol(null); setDrag(null); }}>
            <div className="twc-kanban__col-h">
              <span className="twc-kanban__dot" style={col.color ? { "--_c": col.color } : undefined} />
              <span className="twc-kanban__col-title">{col.title}</span>
              <span className="twc-kanban__count">{colCards.length}</span>
            </div>
            <div className="twc-kanban__list">
              {colCards.map((card) => (
                <div key={card.id} className="twc-kanban__card" draggable data-dragging={drag === card.id || undefined}
                  onDragStart={(e) => { setDrag(card.id); e.dataTransfer.effectAllowed = "move"; }}
                  onDragEnd={() => { setDrag(null); setOverCol(null); }}>
                  {renderCard ? renderCard(card) : (
                    <>
                      <div className="twc-kanban__card-title">{card.title}</div>
                      {card.description ? <div className="twc-kanban__card-desc">{card.description}</div> : null}
                      {(card.tags?.length || card.footer) ? (
                        <div className="twc-kanban__card-foot">
                          <span className="twc-kanban__tags">{(card.tags || []).map((t, i) => <span key={i} className="twc-kanban__tag">{t}</span>)}</span>
                          {card.footer || null}
                        </div>
                      ) : null}
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
