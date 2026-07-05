'use client';
import { useEffect, useState } from 'react';

// Hook penyimpanan localStorage yang aman dari hydration mismatch:
// render awal (server & klien pertama) pakai `initial`, lalu sinkron dari localStorage.
export function useLocalStorage(key, initial) {
  const [value, setValue] = useState(initial);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(key);
      if (stored !== null) setValue(JSON.parse(stored));
    } catch {
      // abaikan (mis. storage diblokir)
    }
    setLoaded(true);
  }, [key]);

  useEffect(() => {
    if (!loaded) return;
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // abaikan
    }
  }, [key, value, loaded]);

  return [value, setValue, loaded];
}
