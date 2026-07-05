'use client';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Flag, Calendar, ListChecks, MessageSquare, Paperclip, CheckCircle2, Trash2 } from 'lucide-react';

const PRIORITY = {
  Tinggi: 'text-error',
  Sedang: 'text-tertiary',
  Rendah: 'text-on-surface-variant',
};

// Tampilan visual kartu (dipakai juga oleh DragOverlay).
export function CardView({ card, onRemove, dragging }) {
  return (
    <div
      className={`card-shadow group rounded-xl border border-transparent bg-surface-container-lowest p-4 transition-colors hover:border-primary ${
        card.done ? 'opacity-80' : ''
      } ${dragging ? 'rotate-2 ring-2 ring-primary' : ''}`}
    >
      <div className="mb-2 flex items-start justify-between gap-2">
        {card.tag && (
          <span className="rounded bg-primary-container/10 px-2 py-1 text-[11px] font-semibold tracking-wide text-primary">
            {card.tag}
          </span>
        )}
        {onRemove && (
          <button
            onClick={() => onRemove(card.id)}
            onPointerDown={(e) => e.stopPropagation()}
            aria-label="Hapus kartu"
            className="ml-auto rounded p-1 text-outline opacity-0 transition hover:text-error focus:opacity-100 group-hover:opacity-100"
          >
            <Trash2 size={15} />
          </button>
        )}
      </div>

      <h3 className={`text-[15px] font-medium text-on-surface ${card.done ? 'line-through decoration-outline-variant' : ''}`}>
        {card.text}
      </h3>
      {card.desc && !card.done && (
        <p className="mt-1 line-clamp-2 text-sm text-on-surface-variant">{card.desc}</p>
      )}

      {typeof card.progress === 'number' && !card.done && (
        <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-surface-variant">
          <div className="h-full rounded-full bg-primary-container" style={{ width: `${card.progress}%` }} />
        </div>
      )}

      <div className="mt-3 flex items-center justify-between text-on-surface-variant">
        {card.done ? (
          <span className="flex items-center gap-1 text-[12px] font-medium text-secondary">
            <CheckCircle2 size={15} /> Selesai
          </span>
        ) : (
          <div className="flex items-center gap-3 text-[12px] font-medium">
            {card.priority && (
              <span className={`flex items-center gap-1 ${PRIORITY[card.priority] || 'text-on-surface-variant'}`}>
                <Flag size={14} /> {card.priority}
              </span>
            )}
            {card.checklist && (
              <span className="flex items-center gap-1">
                <ListChecks size={14} /> {card.checklist.done}/{card.checklist.total}
              </span>
            )}
          </div>
        )}
        {card.due && (
          <span className="flex items-center gap-1 text-[12px]">
            <Calendar size={14} /> {card.due}
          </span>
        )}
      </div>

      {(card.comments || card.attachments) && (
        <div className="mt-3 flex items-center gap-4 border-t border-outline-variant/30 pt-2 text-[12px] text-on-surface-variant">
          {card.comments ? (
            <span className="flex items-center gap-1"><MessageSquare size={13} /> {card.comments}</span>
          ) : null}
          {card.attachments ? (
            <span className="flex items-center gap-1"><Paperclip size={13} /> {card.attachments}</span>
          ) : null}
        </div>
      )}
    </div>
  );
}

// Pembungkus sortable (drag pada seluruh kartu).
export default function Card({ card, onRemove }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: card.id });
  const style = { transform: CSS.Transform.toString(transform), transition };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`cursor-grab touch-none active:cursor-grabbing ${isDragging ? 'opacity-40' : ''}`}
    >
      <CardView card={card} onRemove={onRemove} />
    </div>
  );
}
