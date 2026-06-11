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
.twc-kanban__card:focus-visible { outline: none; box-shadow: var(--ring); }
.twc-kanban__card[data-grabbed="true"] { box-shadow: var(--ring); border-color: var(--color-primary); }
.twc-kanban__card:active { cursor: grabbing; }
.twc-kanban__sr { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; border: 0; }
.twc-kanban__card-title { font-size: var(--text-sm); font-weight: var(--font-semibold); color: var(--color-text); line-height: var(--leading-snug); }
.twc-kanban__card-desc { font-size: var(--text-xs); color: var(--color-text-muted); margin-top: 4px; line-height: var(--leading-snug); }
.twc-kanban__card-foot { display: flex; align-items: center; justify-content: space-between; margin-top: var(--space-3); }
.twc-kanban__tags { display: flex; flex-wrap: wrap; gap: 4px; }
.twc-kanban__tag { font-size: 10px; font-weight: var(--font-bold); padding: 2px 7px; border-radius: var(--radius-full); background: var(--color-primary-subtle); color: var(--color-primary-subtle-fg); text-transform: uppercase; letter-spacing: 0.03em; }
`;

export function Kanban({
  columns,
  cards,
  defaultCards,
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

  const [internal, setInternal] = React.useState(cards ?? defaultCards ?? []);
  const items = cards !== undefined ? cards : internal;
  const [drag, setDrag] = React.useState(null); // card id
  const [overCol, setOverCol] = React.useState(null);
  const [grab, setGrab] = React.useState(null); // keyboard move mode: { id, targetIdx }
  const [announce, setAnnounce] = React.useState("");
  const rootRef = React.useRef(null);
  const focusIdRef = React.useRef(null);

  // Restore focus to a card after a keyboard drop re-parents it into another column.
  React.useEffect(() => {
    if (focusIdRef.current == null) return;
    const id = focusIdRef.current;
    focusIdRef.current = null;
    const els = rootRef.current ? rootRef.current.querySelectorAll(".twc-kanban__card") : [];
    for (const el of els) if (el.getAttribute("data-card-id") === id) { el.focus(); break; }
  });

  const move = (cardId, toCol) => {
    const card = items.find((c) => c.id === cardId);
    if (!card || card.column === toCol) return;
    const next = items.map((c) => (c.id === cardId ? { ...c, column: toCol } : c));
    if (cards === undefined) setInternal(next);
    onCardMove?.(cardId, toCol, next);
  };

  const colTitle = (col) => (typeof col.title === "string" ? col.title : col.id);
  const cardTitle = (card) => (typeof card.title === "string" ? card.title : "Card");

  // Keyboard move mode: Enter/Space grabs, ArrowLeft/ArrowRight picks a column, Enter drops, Escape cancels.
  const handleCardKey = (e, card, colIdx) => {
    if (e.target !== e.currentTarget) return; // let interactive content inside cards keep its keys
    const grabbed = grab && grab.id === card.id;
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      if (!grabbed) {
        setGrab({ id: card.id, targetIdx: colIdx });
        setAnnounce(`${cardTitle(card)} grabbed. Use the left and right arrow keys to choose a column, Enter to drop, Escape to cancel.`);
      } else {
        const toCol = columns[grab.targetIdx];
        if (toCol) { focusIdRef.current = card.id; move(card.id, toCol.id); setAnnounce(`${cardTitle(card)} dropped in ${colTitle(toCol)}.`); }
        setGrab(null);
      }
    } else if (grabbed && (e.key === "ArrowLeft" || e.key === "ArrowRight")) {
      e.preventDefault();
      const next = (grab.targetIdx + (e.key === "ArrowRight" ? 1 : -1) + columns.length) % columns.length;
      setGrab({ id: card.id, targetIdx: next });
      setAnnounce(`Move ${cardTitle(card)} to ${colTitle(columns[next])}. Press Enter to drop.`);
    } else if (grabbed && e.key === "Escape") {
      e.preventDefault();
      setGrab(null);
      setAnnounce("Move cancelled.");
    }
  };

  const keyTargetCol = grab ? columns[grab.targetIdx]?.id : null;

  return (
    <div className={`twc-kanban ${className}`} ref={rootRef} {...rest}>
      <div className="twc-kanban__sr" role="status" aria-live="polite">{announce}</div>
      {columns.map((col, colIdx) => {
        const colCards = items.filter((c) => c.column === col.id);
        return (
          <div key={col.id} className="twc-kanban__col" role="group" aria-label={typeof col.title === "string" ? col.title : undefined}
            data-over={overCol === col.id || keyTargetCol === col.id || undefined}
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
                  role="button" tabIndex={0} aria-roledescription="draggable card" data-card-id={card.id}
                  data-grabbed={(grab && grab.id === card.id) || undefined}
                  onKeyDown={(e) => handleCardKey(e, card, colIdx)}
                  onBlur={() => { if (grab && grab.id === card.id) setGrab(null); }}
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
