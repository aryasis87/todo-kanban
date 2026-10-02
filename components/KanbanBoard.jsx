'use client';
import { Fragment, useEffect, useState } from 'react';
import {
  DndContext, DragOverlay, MouseSensor, TouchSensor, KeyboardSensor,
  useSensor, useSensors, closestCorners,
} from '@dnd-kit/core';
import { arrayMove, sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { useLocalStorage } from '@/lib/useLocalStorage';
import { useHariIni } from '@/lib/useHariIni';
import { KUNCI, COLUMNS, isColumn, contoh, pindahKe } from '@/lib/papan';
import TopBar from './TopBar';
import Column from './Column';
import CardModal from './CardModal';
import { CardView } from './Card';

const CHIPS = [
  { key: 'all', label: 'Semua' },
  { key: 'penting', label: 'Prioritas tinggi' },
  { key: 'tenggat', label: 'Bertenggat' },
];

// Pengumuman pembaca layar dalam bahasa Indonesia.
const judulKolom = (id) => COLUMNS.find((c) => c.id === id)?.title;
const aksesibilitas = (cari) => ({
  screenReaderInstructions: { draggable: 'Tekan Spasi atau Enter untuk mengangkat kartu. Pakai tombol panah untuk memindahkan, Spasi atau Enter untuk meletakkan, Escape untuk batal.' },
  announcements: {
    onDragStart: ({ active }) => `Kartu ${cari(active.id)?.text || ''} diangkat.`,
    onDragOver: ({ over }) => (over ? `Di atas ${judulKolom(over.id) || 'kartu ' + (cari(over.id)?.text || '')}.` : 'Tidak di atas lajur.'),
    onDragEnd: ({ active, over }) => (over ? `Kartu ${cari(active.id)?.text || ''} diletakkan.` : 'Kartu dilepas.'),
    onDragCancel: () => 'Pemindahan dibatalkan.',
  },
});

export default function KanbanBoard() {
  const { hari } = useHariIni(300);
  const [data, setData, loaded] = useLocalStorage(KUNCI, null);
  const [activeCard, setActiveCard] = useState(null);
  const [query, setQuery] = useState('');
  const [chip, setChip] = useState('all');
  const [buka, setBuka] = useState(null);

  useEffect(() => { if (loaded && data === null) setData(contoh()); }, [loaded, data, setData]);

  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 220, tolerance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const papan = data || { todo: [], inprogress: [], done: [], arsip: [] };
  const colOf = (id) => COLUMNS.find((c) => papan[c.id]?.some((card) => card.id === id))?.id;
  const cari = (id) => COLUMNS.map((c) => papan[c.id].find((x) => x.id === id)).find(Boolean);

  const onDragStart = ({ active }) => setActiveCard(cari(active.id) || null);
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
      let insertAt = toCards.length;
      if (!isColumn(over.id)) { const o = toCards.findIndex((c) => c.id === over.id); if (o >= 0) insertAt = o; }
      toCards.splice(insertAt, 0, pindahKe(moved, to));
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
        const a = cards.findIndex((c) => c.id === active.id);
        const b = cards.findIndex((c) => c.id === over.id);
        if (a === -1 || b === -1) return prev;
        return { ...prev, [col]: arrayMove(cards, a, b) };
      });
    }
  };

  const add = (colId, text) => {
    const now = new Date().toISOString();
    setData((prev) => ({ ...prev, [colId]: [...prev[colId], pindahKe({ id: `c-${Date.now()}`, text, dibuat: now, checklist: [] }, colId)] }));
  };
  const simpan = (id, isi, ke) => {
    setData((prev) => {
      const dari = COLUMNS.find((c) => prev[c.id].some((x) => x.id === id))?.id;
      if (!dari) return prev;
      const kartu = { ...prev[dari].find((x) => x.id === id), ...isi };
      if (dari === ke) return { ...prev, [dari]: prev[dari].map((x) => (x.id === id ? kartu : x)) };
      return { ...prev, [dari]: prev[dari].filter((x) => x.id !== id), [ke]: [...prev[ke], pindahKe(kartu, ke)] };
    });
    setBuka(null);
  };
  const hapus = (id) => { setData((prev) => Object.fromEntries(Object.entries(prev).map(([k, v]) => [k, v.filter((x) => x.id !== id)]))); setBuka(null); };
  const arsipkanSelesai = () => {
    if (!window.confirm(`Arsipkan ${papan.done.length} kartu di lajur Selesai?`)) return;
    const now = new Date().toISOString();
    setData((prev) => ({ ...prev, done: [], arsip: [...prev.done.map((x) => ({ ...x, diarsip: now })), ...(prev.arsip || [])] }));
  };

  const matches = (c) => {
    if (chip === 'penting' && c.priority !== 'Tinggi') return false;
    if (chip === 'tenggat' && !c.due) return false;
    if (query.trim()) {
      const q = query.toLowerCase();
      return [c.text, c.desc, c.tag, ...(c.checklist || []).map((x) => x.text)].filter(Boolean).some((s) => s.toLowerCase().includes(q));
    }
    return true;
  };

  return (
    <div className="min-h-screen bg-background">
      <TopBar query={query} onQuery={setQuery} />

      <main>
        <div className="mx-auto w-full max-w-6xl px-5 pt-6">
          <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
            <div>
              <h1 className="text-2xl font-extrabold tracking-tight text-on-surface">Papan proyek</h1>
              <p className="mt-0.5 text-sm text-on-surface-variant">Seret kartu antarlajur, tahan sebentar di layar sentuh, atau buka detail untuk memindahkannya.</p>
            </div>
            <div className="flex flex-wrap gap-2" role="group" aria-label="Saring kartu">
              {CHIPS.map((ch) => (
                <button key={ch.key} type="button" onClick={() => setChip(ch.key)} aria-pressed={chip === ch.key}
                  className={`rounded-full border px-4 py-1.5 text-xs font-semibold transition-colors ${chip === ch.key ? 'border-transparent bg-primary-container text-on-primary' : 'border-outline-variant bg-surface-container-lowest text-on-surface-variant hover:text-primary'}`}>
                  {ch.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {!loaded || data === null ? (
          <p className="py-16 text-center text-sm text-on-surface-variant">Memuat…</p>
        ) : (
          <DndContext sensors={sensors} collisionDetection={closestCorners} onDragStart={onDragStart} onDragOver={onDragOver} onDragEnd={onDragEnd} onDragCancel={() => setActiveCard(null)} accessibility={aksesibilitas(cari)}>
            <div className="hide-scrollbar relative overflow-x-auto px-5 pb-16">
              <div className="mx-auto flex w-max max-w-6xl gap-4">
                {COLUMNS.map((col, i) => (
                  <Fragment key={col.id}>
                    {i > 0 && <span className="garis-lajur" aria-hidden="true" />}
                    <Column column={col} cards={(papan[col.id] || []).filter(matches)} jumlah={papan[col.id].length} hari={hari}
                      onAdd={add} onOpen={setBuka} onArsip={col.id === 'done' ? arsipkanSelesai : null} />
                  </Fragment>
                ))}
              </div>
            </div>
            <DragOverlay>
              {activeCard ? <div className="w-[264px]"><CardView card={activeCard} hari={hari} dragging /></div> : null}
            </DragOverlay>
          </DndContext>
        )}
      </main>

      <CardModal card={buka} kolom={buka ? colOf(buka.id) : null} onClose={() => setBuka(null)} onSave={simpan} onDelete={hapus} />
    </div>
  );
}
