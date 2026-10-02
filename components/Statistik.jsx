'use client';
import { useEffect } from 'react';
import { useLocalStorage } from '@/lib/useLocalStorage';
import { useHariIni } from '@/lib/useHariIni';
import { tambahHari, fmtTanggal } from '@/lib/waktu';
import { contoh, KUNCI, COLUMNS, tanggalWIB, infoTenggat } from '@/lib/papan';

const HARI_MS = 86400000;
const rata = (xs) => (xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : null);
const fmtHari = (n) => (n == null ? '—' : `${n.toLocaleString('id-ID', { maximumFractionDigits: 1 })} hari`);

export default function Statistik() {
  const [data, setData, loaded] = useLocalStorage(KUNCI, null);
  // Kunjungan pertama langsung ke halaman ini: siapkan papan contoh.
  useEffect(() => { if (loaded && data === null) setData(contoh()); }, [loaded, data, setData]);
  const { hari, sekarang } = useHariIni();
  if (!loaded || !hari) return <p className="py-16 text-center text-sm text-on-surface-variant">Memuat…</p>;
  if (!data) return <p className="py-16 text-center text-sm text-on-surface-variant">Memuat…</p>;

  const selesai = [...data.done, ...(data.arsip || [])].filter((c) => c.selesai);
  const lead = rata(selesai.filter((c) => c.dibuat).map((c) => (new Date(c.selesai) - new Date(c.dibuat)) / HARI_MS));
  const cycle = rata(selesai.filter((c) => c.mulai).map((c) => (new Date(c.selesai) - new Date(c.mulai)) / HARI_MS));
  const hariHari = Array.from({ length: 7 }, (_, i) => tambahHari(hari, i - 6));
  const per = hariHari.map((d) => selesai.filter((c) => tanggalWIB(c.selesai) === d).length);
  const maks = Math.max(1, ...per);
  const umur = data.inprogress.map((c) => ({ ...c, umur: c.mulai ? (sekarang - new Date(c.mulai)) / HARI_MS : 0 })).sort((a, b) => b.umur - a.umur);
  const lewat = [...data.todo, ...data.inprogress].filter((c) => infoTenggat(c, hari)?.status === 'lewat');

  return (
    <div className="space-y-10">
      <dl className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {[
          ['Rata-rata lead time', fmtHari(lead), 'dibuat → selesai'],
          ['Rata-rata cycle time', fmtHari(cycle), 'mulai → selesai'],
          ['Selesai 7 hari', per.reduce((a, b) => a + b, 0), 'termasuk yang diarsip'],
          ['Lewat tenggat', lewat.length, 'di Antre & Dikerjakan'],
        ].map(([l, v, k]) => (
          <div key={l} className="flex flex-col-reverse rounded-2xl border border-outline-variant/60 bg-surface-container-lowest p-4">
            <dt className="mt-1 text-xs text-on-surface-variant"><span className="block font-bold uppercase tracking-wide">{l}</span>{k}</dt>
            <dd className="text-2xl font-extrabold text-on-surface">{v}</dd>
          </div>
        ))}
      </dl>

      <section aria-labelledby="h-lajur">
        <h2 id="h-lajur" className="text-lg font-bold text-on-surface">Isi tiap lajur</h2>
        <ul className="mt-3 grid gap-3 sm:grid-cols-3">
          {COLUMNS.map((c) => {
            const n = data[c.id].length;
            const lebih = c.wip && n > c.wip;
            return (
              <li key={c.id} className={`rounded-xl border p-4 ${lebih ? 'border-error/60 bg-error-container/40' : 'border-outline-variant/60 bg-surface-container-low'}`}>
                <p className="flex items-center gap-2 text-sm font-semibold text-on-surface"><span className={`h-2.5 w-2.5 rounded-full ${c.accent}`} aria-hidden="true" />{c.title}</p>
                <p className="mt-1 text-3xl font-extrabold text-on-surface">{n}{c.wip ? <span className="text-base font-semibold text-on-surface-variant"> / {c.wip}</span> : null}</p>
                {lebih && <p className="text-xs font-semibold text-error">Melebihi batas WIP</p>}
              </li>
            );
          })}
        </ul>
      </section>

      <section aria-labelledby="h-throughput">
        <h2 id="h-throughput" className="text-lg font-bold text-on-surface">Kartu selesai per hari</h2>
        <ol className="mt-4 flex h-40 items-end gap-2 border-b border-outline-variant pb-2">
          {hariHari.map((d, i) => (
            <li key={d} className="flex h-full flex-1 flex-col items-center justify-end gap-1">
              <span className="text-xs font-bold text-on-surface">{per[i]}</span>
              <span className={`w-full max-w-10 rounded-t-md ${d === hari ? 'bg-primary' : 'bg-primary/40'}`} style={{ height: `${(per[i] / maks) * 100}%`, minHeight: per[i] ? 6 : 2 }} aria-hidden="true" />
              <span className="sr-only">{fmtTanggal(d)}: {per[i]} kartu</span>
            </li>
          ))}
        </ol>
        <div className="mt-2 flex gap-2" aria-hidden="true">{hariHari.map((d) => <span key={d} className="flex-1 text-center text-xs text-on-surface-variant">{d === hari ? 'Hari ini' : fmtTanggal(d, { weekday: 'short' })}</span>)}</div>
      </section>

      <section aria-labelledby="h-umur">
        <h2 id="h-umur" className="text-lg font-bold text-on-surface">Umur kartu yang sedang dikerjakan</h2>
        <p className="mt-1 text-sm text-on-surface-variant">Kartu yang terlalu lama di lajur Dikerjakan biasanya macet — pecah atau minta bantuan.</p>
        {umur.length === 0 ? <p className="mt-3 text-on-surface-variant">Lajur Dikerjakan kosong.</p> : (
          <ul className="mt-3 divide-y divide-outline-variant/50 rounded-xl border border-outline-variant/60 bg-surface-container-lowest">
            {umur.map((c) => (
              <li key={c.id} className="flex items-center justify-between gap-4 px-4 py-3">
                <span className="text-on-surface">{c.text}</span>
                <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-bold ${c.umur > 3 ? 'bg-error-container text-on-error-container' : 'bg-surface-container-high text-on-surface-variant'}`}>{fmtHari(c.umur)}</span>
              </li>
            ))}
          </ul>
        )}
      </section>
      <p className="text-xs text-on-surface-variant">Lead time menghitung sejak kartu dibuat; cycle time sejak pertama kali masuk lajur Dikerjakan. Semua dari data di peramban ini.</p>
    </div>
  );
}
