'use client';
import { useState, useRef, useEffect } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Plus, X } from 'lucide-react';
import Card from './Card';

// Kolom Kanban: header + area droppable + daftar sortable + tambah kartu.
export default function Column({ column, cards, onAdd, onRemove }) {
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

  return (
    <div className="flex w-[280px] shrink-0 flex-col rounded-xl border border-outline-variant/30 bg-surface-container-low/60">
      {/* Header */}
      <div className="sticky top-0 z-10 flex items-center justify-between gap-2 rounded-t-xl border-b border-outline-variant/40 bg-surface-container-low/90 px-4 py-3 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <span className={`h-2.5 w-2.5 rounded-full ${column.accent}`} />
          <h2 className="text-[15px] font-semibold text-on-surface">{column.title}</h2>
          <span className="rounded-full bg-surface-variant px-2 py-0.5 text-xs font-medium text-on-surface-variant">
            {cards.length}
          </span>
        </div>
      </div>

      {/* Droppable list */}
      <div
        ref={setNodeRef}
        className={`flex-1 space-y-2.5 p-2.5 transition ${isOver ? 'bg-primary-container/5 ring-2 ring-inset ring-primary/40' : ''}`}
      >
        <SortableContext items={cards.map((c) => c.id)} strategy={verticalListSortingStrategy}>
          {cards.map((c) => (
            <Card key={c.id} card={c} onRemove={onRemove} />
          ))}
        </SortableContext>
        {cards.length === 0 && (
          <p className="select-none rounded-lg border border-dashed border-outline-variant/50 py-8 text-center text-xs text-outline">
            Tarik kartu ke sini
          </p>
        )}
      </div>

      {/* Tambah kartu */}
      <div className="p-2.5 pt-0">
        {adding ? (
          <form onSubmit={submit} className="flex gap-1.5">
            <input
              ref={inputRef}
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Escape') { setText(''); setAdding(false); } }}
              placeholder="Judul kartu…"
              className="w-full rounded-lg border border-outline-variant/50 bg-surface-container-lowest px-3 py-2 text-sm text-on-surface outline-none focus:border-primary"
            />
            <button type="submit" aria-label="Simpan kartu" className="shrink-0 rounded-lg bg-primary-container px-2.5 text-on-primary transition hover:brightness-110">
              <Plus size={16} />
            </button>
            <button type="button" onClick={() => { setText(''); setAdding(false); }} aria-label="Batal" className="shrink-0 rounded-lg px-1.5 text-on-surface-variant hover:text-error">
              <X size={16} />
            </button>
          </form>
        ) : (
          <button
            onClick={() => setAdding(true)}
            className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-dashed border-primary/40 py-2.5 text-sm font-medium text-primary transition-colors hover:bg-primary-fixed/40"
          >
            <Plus size={18} /> Tambah kartu
          </button>
        )}
      </div>
    </div>
  );
}
