'use client';
import { useEffect } from 'react';
import Link from 'next/link';
import { RotateCcw, Trash2 } from 'lucide-react';
import { useLocalStorage } from '@/lib/useLocalStorage';
import { contoh, KUNCI } from '@/lib/papan';

const fmt = (iso) => (iso ? new Date(iso).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'Asia/Jakarta' }) : '—');

export default function Arsip() {
  const [data, setData, loaded] = useLocalStorage(KUNCI, null);
  // Kunjungan pertama langsung ke halaman ini: siapkan papan contoh.
  useEffect(() => { if (loaded && data === null) setData(contoh()); }, [loaded, data, setData]);
  if (!loaded || !data) return <p className="py-16 text-center text-sm text-on-surface-variant">Memuat…</p>;
  const arsip = data?.arsip || [];
  if (!arsip.length) {
    return (
      <div className="rounded-2xl border border-dashed border-outline-variant p-10 text-center">
        <p className="text-lg font-bold text-on-surface">Arsip kosong</p>
        <p className="mt-1 text-on-surface-variant">Kartu dari lajur Selesai yang diarsipkan akan muncul di sini.</p>
        <Link href="/" className="mt-4 inline-block rounded-lg bg-primary-container px-5 py-2.5 text-sm font-semibold text-on-primary">Kembali ke papan</Link>
      </div>
    );
  }
  const kembalikan = (id) => setData((p) => { const c = p.arsip.find((x) => x.id === id); const { diarsip, ...sisa } = c; return { ...p, arsip: p.arsip.filter((x) => x.id !== id), done: [sisa, ...p.done] }; });
  const hapus = (id) => { if (window.confirm('Hapus kartu ini selamanya?')) setData((p) => ({ ...p, arsip: p.arsip.filter((x) => x.id !== id) })); };

  return (
    <div className="relative overflow-x-auto rounded-2xl border border-outline-variant/60 bg-surface-container-lowest">
      <table className="w-full min-w-[560px] text-left text-sm">
        <caption className="sr-only">Kartu yang diarsipkan</caption>
        <thead className="border-b border-outline-variant/60 text-xs uppercase tracking-wide text-on-surface-variant">
          <tr><th scope="col" className="px-4 py-3">Kartu</th><th scope="col" className="px-4 py-3">Selesai</th><th scope="col" className="px-4 py-3">Diarsip</th><th scope="col" className="px-4 py-3"><span className="sr-only">Aksi</span></th></tr>
        </thead>
        <tbody>
          {arsip.map((c) => (
            <tr key={c.id} className="border-b border-outline-variant/40 last:border-b-0">
              <th scope="row" className="px-4 py-3 font-semibold text-on-surface">{c.text}{c.tag && <span className="ml-2 rounded bg-primary-fixed px-1.5 py-0.5 text-[11px] font-bold text-primary">{c.tag}</span>}</th>
              <td className="px-4 py-3 text-on-surface-variant">{fmt(c.selesai)}</td>
              <td className="px-4 py-3 text-on-surface-variant">{fmt(c.diarsip)}</td>
              <td className="px-4 py-3">
                <div className="flex justify-end gap-1">
                  <button type="button" onClick={() => kembalikan(c.id)} className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-semibold text-primary hover:bg-surface-container-high"><RotateCcw size={14} aria-hidden="true" /> Kembalikan</button>
                  <button type="button" onClick={() => hapus(c.id)} aria-label={`Hapus ${c.text}`} className="rounded-lg p-1.5 text-on-surface-variant hover:text-error"><Trash2 size={14} /></button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
