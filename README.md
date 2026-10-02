# Lajur — Papan kanban dengan batas WIP

Papan kanban tiga lajur — Antre, Dikerjakan, Selesai — dengan marka jalan putus-putus di antara lajur. Teal di atas kertas; mode gelap seperti aspal. Sebelumnya bernama "TaskFlow", diganti karena nama itu dipakai banyak aplikasi lain.

**Demo live:** https://todo-kanban-one.vercel.app

![Tangkapan layar](public/og.jpg)

> Data tersimpan di `localStorage` peramban — tanpa akun dan tanpa server. Kunjungan pertama diisi data contoh yang tanggalnya relatif terhadap hari ini; tanggal dan jam dihitung dalam WIB.

## Fitur

- Seret kartu dengan mouse, tahan sebentar di layar sentuh, atau Spasi + panah di papan ketik; pengumuman pembaca layar dalam bahasa Indonesia.
- Lajur Dikerjakan dibatasi 3 kartu (batas WIP) dan memberi peringatan bila terlampaui.
- Detail kartu: judul, catatan, label, prioritas, tenggat, checklist (progres dihitung dari checklist), dan pindah lajur tanpa menyeret.
- Setiap kartu mencatat waktu dibuat, mulai dikerjakan, dan selesai.
- `/statistik` — rata-rata lead time & cycle time, kartu selesai per hari, isi lajur terhadap batas WIP, umur kartu yang macet.
- `/arsip` — arsipkan lajur Selesai, kembalikan, atau hapus.

## Halaman

`/` · `/arsip` · `/statistik`

## Teknologi

- Next.js 15.5 (App Router) dan React 19
- Tailwind CSS v4 (token tema + `.dark`)
- JavaScript
- Lucide (ikon), @dnd-kit (core, sortable, utilities)
- Font: Plus Jakarta Sans (next/font)
- SEO: metadata per halaman, Open Graph, JSON-LD, sitemap.xml, dan robots.txt

## Menjalankan secara lokal

```bash
npm install
npm run dev
```

Buka http://localhost:3000. Untuk build produksi: `npm run build` lalu `npm start`.

---

Bagian dari koleksi 3 aplikasi daftar tugas di [PortalTodo](https://portal-todo.vercel.app). Dibuat oleh [PintuWeb](https://pintuweb.com), jasa pembuatan website.
