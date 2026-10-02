'use client';
import { useState, useRef, useEffect } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Plus, X, Archive, AlertTriangle } from 'lucide-react';
import Card from './Card';

// Satu lajur: header (jumlah + batas WIP), area lepas, daftar kartu, tambah kartu.
export default function Column({ column, cards, jumlah, hari, onAdd, onOpen, onArsip }) {
  const { setNodeRef, isOver } = useDroppable({ id: column.id });
  const [adding, setAdding] = useState(false);
  const [text, setText] = useState('');
  const inputRef = useRef(null);
  useEffect(() => { if (adding) inputRef.current?.focus(); }, [adding]);

  const submit = (e) => {
    e.preventDefault();
    const v = text.trim();
    if (!v) return;
    onAdd(column.id, v);
    setText('');
  };
  const lebih = column.wip && jumlah > column.wip;

  return (
    <section aria-labelledby={`h-${column.id}`} className={`flex w-[284px] shrink-0 flex-col rounded-2xl border bg-surface-container-low ${lebih ? 'border-error/60' : 'border-outline-variant/50'}`}>
      <div className="flex items-start justify-between gap-2 rounded-t-2xl border-b border-outline-variant/50 px-4 py-3">
        <div>
          <div className="flex items-center gap-2">
            <span className={`h-2.5 w-2.5 rounded-full ${column.accent}`} aria-hidden="true" />
            <h2 id={`h-${column.id}`} className="text-[15px] font-bold text-on-surface">{column.title}</h2>
            <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${lebih ? 'bg-error-container text-on-error-container' : 'bg-surface-variant text-on-surface-variant'}`}>
              {column.wip ? `${jumlah}/${column.wip}` : jumlah}
            </span>
          </div>
          <p className={`mt-0.5 text-xs ${lebih ? 'flex items-center gap-1 font-semibold text-error' : 'text-on-surface-variant'}`}>
            {lebih ? <><AlertTriangle size={12} aria-hidden="true" /> Melebihi batas — selesaikan dulu yang ada</> : column.petunjuk}
          </p>
        </div>
        {onArsip && jumlah > 0 && (
          <button type="button" onClick={onArsip} className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-semibold text-on-surface-variant hover:bg-surface-container-high hover:text-primary">
            <Archive size={14} aria-hidden="true" /> Arsipkan
          </button>
        )}
      </div>

      <div ref={setNodeRef} className={`flex-1 space-y-2.5 p-2.5 transition ${isOver ? 'bg-primary-fixed/40 ring-2 ring-inset ring-primary/40' : ''}`}>
        <SortableContext items={cards.map((c) => c.id)} strategy={verticalListSortingStrategy}>
          {cards.map((c) => <Card key={c.id} card={c} hari={hari} onOpen={onOpen} />)}
        </SortableContext>
        {cards.length === 0 && (
          <p className="select-none rounded-lg border border-dashed border-outline-variant py-8 text-center text-xs text-on-surface-variant">Tarik kartu ke sini</p>
        )}
      </div>

      <div className="p-2.5 pt-0">
        {adding ? (
          <form onSubmit={submit} className="flex gap-1.5">
            <label className="w-full">
              <span className="sr-only">Judul kartu baru di {column.title}</span>
              <input ref={inputRef} value={text} onChange={(e) => setText(e.target.value)} onKeyDown={(e) => { if (e.key === 'Escape') { setText(''); setAdding(false); } }}
                placeholder="Judul kartu…" className="w-full rounded-lg border border-outline-variant bg-surface-container-lowest px-3 py-2 text-sm text-on-surface outline-none focus:border-primary" />
            </label>
            <button type="submit" aria-label="Simpan kartu" className="shrink-0 rounded-lg bg-primary-container px-2.5 text-on-primary transition hover:brightness-110"><Plus size={16} /></button>
            <button type="button" onClick={() => { setText(''); setAdding(false); }} aria-label="Batal" className="shrink-0 rounded-lg px-1.5 text-on-surface-variant hover:text-error"><X size={16} /></button>
          </form>
        ) : (
          <button type="button" onClick={() => setAdding(true)} className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-dashed border-primary/50 py-2.5 text-sm font-semibold text-primary transition-colors hover:bg-primary-fixed/50">
            <Plus size={18} aria-hidden="true" /> Tambah kartu
          </button>
        )}
      </div>
    </section>
  );
}
