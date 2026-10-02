'use client';
import { useEffect, useState } from 'react';
import { isoTanggal, sekarangWIB } from './waktu';

// Tanggal hari ini (WIB) setelah halaman dimuat; null saat render server agar tidak basi.
// `detik` > 0 membuat nilai `sekarang` diperbarui berkala (untuk menutup slot yang lewat).
export function useHariIni(detik = 0) {
  const [now, setNow] = useState(null);
  useEffect(() => {
    setNow(sekarangWIB());
    if (!detik) return;
    const t = setInterval(() => setNow(sekarangWIB()), detik * 1000);
    return () => clearInterval(t);
  }, [detik]);
  return { hari: now ? isoTanggal(now) : null, sekarang: now };
}
