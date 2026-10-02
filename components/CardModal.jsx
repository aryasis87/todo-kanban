'use client';
import { useEffect, useRef, useState } from 'react';
import { X, Plus, Trash2, Save } from 'lucide-react';
import { COLUMNS, PRIORITAS } from '@/lib/papan';

// Detail kartu: ubah isi, checklist, tenggat, dan pindah lajur tanpa menyeret.
export default function CardModal({ card, kolom, onClose, onSave, onDelete }) {
  const [f, setF] = useState(null);
  const [item, setItem] = useState('');
  const judulRef = useRef(null);

  useEffect(() => {
    if (!card) return;
    setF({ text: card.text, desc: card.desc || '', tag: card.tag || '', priority: card.priority || '', due: card.due || '', checklist: card.checklist || [], kolom });
    setItem('');
    setTimeout(() => judulRef.current?.focus(), 30);
  }, [card, kolom]);
  useEffect(() => {
    if (!card) return;
    const k = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', k);
    return () => window.removeEventListener('keydown', k);
  }, [card, onClose]);

  if (!card || !f) return null;
  const set = (k, v) => setF((x) => ({ ...x, [k]: v }));
  const tambahItem = () => { const t = item.trim(); if (!t) return; set('checklist', [...f.checklist, { id: `k-${Date.now()}`, text: t, done: false }]); setItem(''); };
  const simpan = (e) => {
    e.preventDefault();
    if (!f.text.trim()) return;
    onSave(card.id, { text: f.text.trim(), desc: f.desc.trim(), tag: f.tag.trim(), priority: f.priority || null, due: f.due || null, checklist: f.checklist }, f.kolom);
  };
  const field = 'mt-1 w-full rounded-lg border border-outline-variant bg-surface-container-lowest px-3 py-2.5 text-sm text-on-surface outline-none focus:border-primary';
  const label = 'block text-xs font-bold uppercase tracking-wide text-on-surface-variant';
  const fmt = (iso) => (iso ? new Date(iso).toLocaleString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Jakarta' }) : '—');

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center bg-on-surface/40 backdrop-blur-sm sm:items-center sm:p-4" onClick={onClose}>
      <div role="dialog" aria-modal="true" aria-labelledby="judul-kartu" onClick={(e) => e.stopPropagation()}
        className="flex max-h-[92vh] w-full max-w-lg flex-col overflow-hidden rounded-t-3xl bg-surface shadow-2xl sm:rounded-3xl">
        <div className="flex items-center justify-between border-b border-outline-variant/60 px-6 py-4">
          <h2 id="judul-kartu" className="text-lg font-bold text-on-surface">Detail kartu</h2>
          <button type="button" onClick={onClose} aria-label="Tutup" className="rounded-full p-1.5 text-on-surface-variant hover:bg-surface-container-high"><X size={18} /></button>
        </div>

        <form id="form-kartu" onSubmit={simpan} className="flex-1 space-y-4 overflow-y-auto p-6">
          <label className={label}>Judul<input ref={judulRef} value={f.text} onChange={(e) => set('text', e.target.value)} required className={`${field} text-base font-semibold normal-case`} /></label>
          <label className={label}>Catatan<textarea value={f.desc} onChange={(e) => set('desc', e.target.value)} rows={3} className={`${field} resize-none`} /></label>
          <div className="grid grid-cols-2 gap-3">
            <label className={label}>Lajur
              <select value={f.kolom} onChange={(e) => set('kolom', e.target.value)} className={field}>{COLUMNS.map((c) => <option key={c.id} value={c.id}>{c.title}</option>)}</select>
            </label>
            <label className={label}>Prioritas
              <select value={f.priority} onChange={(e) => set('priority', e.target.value)} className={field}><option value="">Tanpa</option>{PRIORITAS.map((p) => <option key={p}>{p}</option>)}</select>
            </label>
            <label className={label}>Label<input value={f.tag} onChange={(e) => set('tag', e.target.value)} placeholder="Desain, Riset…" className={field} /></label>
            <label className={label}>Tenggat<input type="date" value={f.due} onChange={(e) => set('due', e.target.value)} className={field} /></label>
          </div>

          <fieldset>
            <legend className={label}>Checklist {f.checklist.length > 0 && `(${f.checklist.filter((x) => x.done).length}/${f.checklist.length})`}</legend>
            <ul className="mt-2 space-y-1.5">
              {f.checklist.map((x) => (
                <li key={x.id} className="flex items-center gap-2">
                  <label className="flex flex-1 items-center gap-2 text-sm text-on-surface">
                    <input type="checkbox" checked={x.done} onChange={() => set('checklist', f.checklist.map((y) => (y.id === x.id ? { ...y, done: !y.done } : y)))} className="h-4 w-4 accent-primary" />
                    <span className={x.done ? 'text-on-surface-variant line-through' : ''}>{x.text}</span>
                  </label>
                  <button type="button" onClick={() => set('checklist', f.checklist.filter((y) => y.id !== x.id))} aria-label={`Hapus ${x.text}`} className="rounded p-1 text-on-surface-variant hover:text-error"><X size={14} /></button>
                </li>
              ))}
            </ul>
            <div className="mt-2 flex gap-2">
              <label className="flex-1"><span className="sr-only">Butir checklist baru</span>
                <input value={item} onChange={(e) => setItem(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); tambahItem(); } }} placeholder="Tambah butir…" className={field.replace('mt-1 ', '')} />
              </label>
              <button type="button" onClick={tambahItem} aria-label="Tambah butir" className="rounded-lg border border-outline-variant px-3 text-primary hover:bg-surface-container-high"><Plus size={16} /></button>
            </div>
          </fieldset>

          <dl className="grid grid-cols-3 gap-2 rounded-xl bg-surface-container-low p-3 text-xs">
            {[['Dibuat', card.dibuat], ['Mulai', card.mulai], ['Selesai', card.selesai]].map(([l, v]) => (
              <div key={l}><dt className="font-semibold text-on-surface-variant">{l}</dt><dd className="mt-0.5 text-on-surface">{fmt(v)}</dd></div>
            ))}
          </dl>
        </form>

        <footer className="flex items-center justify-between gap-3 border-t border-outline-variant/60 p-4">
          <button type="button" onClick={() => { if (window.confirm('Hapus kartu ini?')) onDelete(card.id); }} className="flex items-center gap-1.5 rounded-lg px-3 py-2.5 text-sm font-semibold text-error hover:bg-error-container"><Trash2 size={16} aria-hidden="true" /> Hapus</button>
          <div className="flex gap-2">
            <button type="button" onClick={onClose} className="rounded-lg px-4 py-2.5 text-sm font-semibold text-primary hover:bg-surface-container-high">Batal</button>
            <button type="submit" form="form-kartu" className="flex items-center gap-2 rounded-lg bg-primary-container px-5 py-2.5 text-sm font-semibold text-on-primary hover:brightness-110"><Save size={16} aria-hidden="true" /> Simpan</button>
          </div>
        </footer>
      </div>
    </div>
  );
}
