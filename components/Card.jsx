'use client';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Flag, Calendar, ListChecks, CheckCircle2, PanelRightOpen } from 'lucide-react';
import { progres, infoTenggat } from '@/lib/papan';

const PRIORITY = { Tinggi: 'text-error', Sedang: 'text-tertiary', Rendah: 'text-on-surface-variant' };
const TENGGAT = { lewat: 'bg-error-container text-on-error-container', 'hari-ini': 'bg-tertiary-container/25 text-tertiary', dekat: 'bg-tertiary-container/15 text-tertiary', nanti: 'text-on-surface-variant', selesai: 'text-on-surface-variant' };

// Tampilan kartu (dipakai juga oleh DragOverlay).
export function CardView({ card, hari, onOpen, dragging }) {
  const p = progres(card);
  const t = infoTenggat(card, hari);
  const selesai = !!card.selesai;
  return (
    <div className={`card-shadow group rounded-xl border bg-surface-container-lowest p-4 transition-colors ${dragging ? 'rotate-2 border-primary ring-2 ring-primary' : 'border-outline-variant/40 hover:border-primary'}`}>
      <div className="mb-2 flex items-start justify-between gap-2">
        {card.tag ? <span className="rounded bg-primary-fixed px-2 py-0.5 text-[11px] font-bold tracking-wide text-primary">{card.tag}</span> : <span />}
        {onOpen && (
          <button type="button" onClick={() => onOpen(card)} onPointerDown={(e) => e.stopPropagation()} onKeyDown={(e) => e.stopPropagation()}
            aria-label={`Buka detail: ${card.text}`} className="-m-1 rounded p-1 text-on-surface-variant transition hover:bg-surface-container-high hover:text-primary">
            <PanelRightOpen size={16} />
          </button>
        )}
      </div>

      <h3 className={`text-[15px] font-semibold leading-snug text-on-surface ${selesai ? 'text-on-surface-variant line-through decoration-outline' : ''}`}>{card.text}</h3>
      {card.desc && !selesai && <p className="mt-1 line-clamp-2 text-sm text-on-surface-variant">{card.desc}</p>}

      {p && !selesai && (
        <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-surface-variant" aria-hidden="true">
          <div className="h-full rounded-full bg-primary" style={{ width: `${(p.done / p.total) * 100}%` }} />
        </div>
      )}

      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-[12px] font-medium text-on-surface-variant">
        {selesai ? (
          <span className="flex items-center gap-1 text-secondary"><CheckCircle2 size={15} aria-hidden="true" /> Selesai</span>
        ) : (
          <div className="flex items-center gap-3">
            {card.priority && <span className={`flex items-center gap-1 ${PRIORITY[card.priority]}`}><Flag size={14} aria-hidden="true" /> {card.priority}</span>}
            {p && <span className="flex items-center gap-1"><ListChecks size={14} aria-hidden="true" /> {p.done}/{p.total}</span>}
          </div>
        )}
        {t && <span className={`flex items-center gap-1 rounded px-1.5 py-0.5 ${TENGGAT[t.status]}`}><Calendar size={13} aria-hidden="true" /> {t.label}</span>}
      </div>
    </div>
  );
}

// Pembungkus sortable. Seret dengan mouse, tahan sebentar di layar sentuh, atau Spasi lalu panah di papan ketik.
export default function Card({ card, hari, onOpen }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: card.id });
  const style = { transform: CSS.Transform.toString(transform), transition };
  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners} role="group" aria-label={card.text} aria-roledescription="kartu yang dapat dipindah"
      className={`cursor-grab touch-manipulation rounded-xl active:cursor-grabbing ${isDragging ? 'opacity-40' : ''}`}>
      <CardView card={card} hari={hari} onOpen={onOpen} />
    </div>
  );
}
