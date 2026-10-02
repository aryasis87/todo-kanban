// Model papan Lajur: tiga lajur + arsip. Setiap kartu mencatat kapan dibuat, mulai dikerjakan, dan selesai.
import { isoTanggal, sekarangWIB, tambahHari, selisihHari, fmtTanggal } from './waktu';

export const KUNCI = 'lajur.papan';

export const COLUMNS = [
  { id: 'todo', title: 'Antre', accent: 'bg-outline', petunjuk: 'Belum dikerjakan' },
  { id: 'inprogress', title: 'Dikerjakan', accent: 'bg-tertiary-container', petunjuk: 'Maksimal 3 sekaligus', wip: 3 },
  { id: 'done', title: 'Selesai', accent: 'bg-secondary', petunjuk: 'Bisa diarsipkan' },
];
export const PRIORITAS = ['Tinggi', 'Sedang', 'Rendah'];
export const isColumn = (id) => COLUMNS.some((c) => c.id === id);

export const tanggalWIB = (iso) => isoTanggal(new Date(new Date(iso).toLocaleString('en-US', { timeZone: 'Asia/Jakarta' })));

// Progres kartu dihitung dari checklist.
export function progres(card) {
  const l = card.checklist || [];
  if (!l.length) return null;
  return { done: l.filter((x) => x.done).length, total: l.length };
}

// Keterangan tenggat relatif terhadap hari ini.
export function infoTenggat(card, hari) {
  if (!card.due || !hari) return null;
  const n = selisihHari(hari, card.due);
  const tgl = fmtTanggal(card.due, { day: 'numeric', month: 'short' });
  if (card.selesai) return { label: tgl, status: 'selesai' };
  if (n < 0) return { label: `Lewat ${-n} hari`, status: 'lewat' };
  if (n === 0) return { label: 'Hari ini', status: 'hari-ini' };
  if (n === 1) return { label: 'Besok', status: 'dekat' };
  if (n <= 3) return { label: `${n} hari lagi`, status: 'dekat' };
  return { label: tgl, status: 'nanti' };
}

// Pindah lajur: catat waktu mulai & selesai.
export function pindahKe(card, ke) {
  const now = new Date().toISOString();
  return {
    ...card,
    mulai: ke === 'todo' ? card.mulai : card.mulai || now,
    selesai: ke === 'done' ? card.selesai || now : null,
  };
}

// Papan contoh untuk kunjungan pertama — tanggal relatif terhadap hari ini.
export function contoh() {
  const hari = isoTanggal(sekarangWIB());
  const iso = (h, jam = 9) => { const [y, m, d] = tambahHari(hari, h).split('-').map(Number); return new Date(Date.UTC(y, m - 1, d, jam - 7)).toISOString(); };
  const cl = (...xs) => xs.map(([text, done], i) => ({ id: `k${i}-${text.length}`, text, done }));
  return {
    todo: [
      { id: 'c-1', text: 'Mockup halaman beranda', desc: 'Dua versi: satu dengan video di hero, satu tanpa. Fokus ke tombol daftar.', tag: 'Desain', priority: 'Tinggi', due: tambahHari(hari, 2), checklist: cl(['Wireframe', false], ['Versi A', false], ['Versi B', false]), dibuat: iso(-4) },
      { id: 'c-2', text: 'Kumpulkan referensi halaman harga', tag: 'Riset', priority: 'Sedang', due: tambahHari(hari, 5), dibuat: iso(-2) },
      { id: 'c-3', text: 'Daftar komponen yang bisa dipakai ulang', priority: 'Rendah', dibuat: iso(-1) },
    ],
    inprogress: [
      { id: 'c-4', text: 'Pindahkan login ke sesi berbasis cookie', desc: 'Token lama tetap diterima sampai akhir bulan.', tag: 'Backend', priority: 'Tinggi', due: tambahHari(hari, -1), checklist: cl(['Endpoint sesi baru', true], ['Middleware', true], ['Uji di Safari', false], ['Hapus kode lama', false]), dibuat: iso(-6), mulai: iso(-3) },
      { id: 'c-5', text: 'Hubungkan formulir kontak ke email', tag: 'Backend', priority: 'Sedang', due: tambahHari(hari, 1), checklist: cl(['Template email', true], ['Validasi', false]), dibuat: iso(-3), mulai: iso(-1) },
    ],
    done: [
      { id: 'c-6', text: 'Siapkan repositori dan CI', tag: 'Setup', dibuat: iso(-8), mulai: iso(-8), selesai: iso(-7, 16) },
      { id: 'c-7', text: 'Wawancara lima calon pengguna', tag: 'Riset', dibuat: iso(-9), mulai: iso(-6), selesai: iso(-2, 15) },
      { id: 'c-8', text: 'Pilih palet warna', tag: 'Desain', dibuat: iso(-5), mulai: iso(-4), selesai: iso(-1, 11) },
    ],
    arsip: [
      { id: 'c-9', text: 'Tentukan nama produk', tag: 'Riset', dibuat: iso(-14), mulai: iso(-13), selesai: iso(-10, 14), diarsip: iso(-9) },
    ],
  };
}
