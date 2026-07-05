'use client';
import { useState } from 'react';
import {
  DndContext, DragOverlay, PointerSensor, KeyboardSensor,
  useSensor, useSensors, closestCorners,
} from '@dnd-kit/core';
import { arrayMove, sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { useLocalStorage } from '@/lib/useLocalStorage';
import TopBar from './TopBar';
import Column from './Column';
import { CardView } from './Card';

const COLUMNS = [
  { id: 'todo', title: 'To Do', accent: 'bg-primary-container' },
  { id: 'inprogress', title: 'Sedang Dikerjakan', accent: 'bg-tertiary-container' },
  { id: 'done', title: 'Selesai', accent: 'bg-secondary' },
];

const initial = {
  todo: [
    { id: 'c-1', text: 'Desain Landing Page', desc: 'Buat mockup hi-fi untuk halaman beranda baru dengan fokus konversi.', tag: 'Desain', priority: 'Tinggi', due: '28 Okt', comments: 3, attachments: 2 },
    { id: 'c-2', text: 'Riset referensi kompetitor', tag: 'Riset', priority: 'Sedang', due: '30 Okt' },
    { id: 'c-3', text: 'Susun struktur komponen', priority: 'Rendah' },
  ],
  inprogress: [
    { id: 'c-4', text: 'Refaktor API Auth', desc: 'Migrasi ke sistem JWT baru untuk meningkatkan keamanan.', tag: 'Backend', progress: 40, checklist: { done: 2, total: 5 }, due: '26 Okt', comments: 8 },
    { id: 'c-5', text: 'Integrasi gateway pembayaran', tag: 'Backend', priority: 'Tinggi', progress: 70, due: '27 Okt' },
  ],
  done: [
    { id: 'c-6', text: 'Setup project Next.js', tag: 'Setup', done: true, attachments: 1 },
    { id: 'c-7', text: 'Riset Kompetitor', tag: 'Riset', done: true },
  ],
};

const CHIPS = [
  { key: 'all', label: 'Semua' },
  { key: 'penting', label: 'Penting' },
];

const isColumn = (id) => COLUMNS.some((c) => c.id === id);

export default function KanbanBoard() {
  const [data, setData, loaded] = useLocalStorage('board.kanban.v2', initial);
  const [activeCard, setActiveCard] = useState(null);
  const [query, setQuery] = useState('');
  const [chip, setChip] = useState('all');

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const colOf = (id) => COLUMNS.find((c) => data[c.id]?.some((card) => card.id === id))?.id;

  const onDragStart = ({ active }) => {
    const col = colOf(active.id);
    setActiveCard(col ? data[col].find((c) => c.id === active.id) : null);
  };

  const onDragOver = ({ active, over }) => {
    if (!over) return;
    const from = colOf(active.id);
    const to = isColumn(over.id) ? over.id : colOf(over.id);
    if (!from || !to || from === to) return;
    setData((prev) => {
      const fromCards = [...prev[from]];
      const toCards = [...prev[to]];
      const idx = fromCards.findIndex((c) => c.id === active.id);
      if (idx === -1) return prev;
      const [moved] = fromCards.splice(idx, 1);
      // Pindah ke "Selesai" -> tandai done; keluar dari "Selesai" -> hapus done
      moved.done = to === 'done';
      let insertAt = toCards.length;
      if (!isColumn(over.id)) {
        const oIdx = toCards.findIndex((c) => c.id === over.id);
        if (oIdx >= 0) insertAt = oIdx;
      }
      toCards.splice(insertAt, 0, moved);
      return { ...prev, [from]: fromCards, [to]: toCards };
    });
  };

  const onDragEnd = ({ active, over }) => {
    setActiveCard(null);
    if (!over) return;
    const col = colOf(active.id);
    const overCol = isColumn(over.id) ? over.id : colOf(over.id);
    if (col && overCol && col === overCol && active.id !== over.id) {
      setData((prev) => {
        const cards = [...prev[col]];
        const oldIdx = cards.findIndex((c) => c.id === active.id);
        const newIdx = cards.findIndex((c) => c.id === over.id);
        if (oldIdx === -1 || newIdx === -1) return prev;
        return { ...prev, [col]: arrayMove(cards, oldIdx, newIdx) };
      });
    }
  };

  const add = (colId, text) =>
    setData((prev) => ({ ...prev, [colId]: [...prev[colId], { id: `c-${Date.now()}`, text, done: colId === 'done' }] }));
  const remove = (id) => {
    const col = colOf(id);
    if (col) setData((prev) => ({ ...prev, [col]: prev[col].filter((c) => c.id !== id) }));
  };

  const matches = (c) => {
    if (chip === 'penting' && c.priority !== 'Tinggi') return false;
    if (query.trim()) {
      const q = query.toLowerCase();
      return [c.text, c.desc, c.tag].filter(Boolean).some((s) => s.toLowerCase().includes(q));
    }
    return true;
  };

  return (
    <div className="min-h-screen bg-background">
      <TopBar query={query} onQuery={setQuery} />

      <div className="mx-auto w-full max-w-6xl px-5 pt-6">
        <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-on-surface">Papan Kanban</h1>
            <p className="mt-0.5 text-sm text-on-surface-variant">Seret kartu antar kolom untuk mengatur progres.</p>
          </div>
          <div className="flex gap-2">
            {CHIPS.map((ch) => (
              <button
                key={ch.key}
                onClick={() => setChip(ch.key)}
                className={`rounded-full border px-4 py-1.5 text-xs font-semibold transition-colors ${
                  chip === ch.key
                    ? 'border-transparent bg-primary-container text-on-primary'
                    : 'border-outline-variant bg-surface-container text-on-surface-variant hover:text-primary'
                }`}
              >
                {ch.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {!loaded ? (
        <p className="py-16 text-center text-sm text-outline">Memuat…</p>
      ) : (
        <DndContext sensors={sensors} collisionDetection={closestCorners} onDragStart={onDragStart} onDragOver={onDragOver} onDragEnd={onDragEnd}>
          <div className="hide-scrollbar overflow-x-auto px-5 pb-16">
            <div className="mx-auto flex w-max max-w-6xl gap-4">
              {COLUMNS.map((col) => (
                <Column key={col.id} column={col} cards={(data[col.id] || []).filter(matches)} onAdd={add} onRemove={remove} />
              ))}
            </div>
          </div>

          <DragOverlay>
            {activeCard ? <div className="w-[256px]"><CardView card={activeCard} dragging /></div> : null}
          </DragOverlay>
        </DndContext>
      )}
    </div>
  );
}
