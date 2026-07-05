'use client';
import { useEffect, useState } from 'react';
import { LayoutGrid, Search, Moon, Sun } from 'lucide-react';

// Top app bar (selaras dgn classic-todo): logo, pencarian, toggle tema, avatar.
export default function TopBar({ query, onQuery }) {
  const [dark, setDark] = useState(false);
  useEffect(() => { setDark(document.documentElement.classList.contains('dark')); }, []);

  const toggleTheme = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle('dark', next);
    try { localStorage.setItem('taskflow.theme', next ? 'dark' : 'light'); } catch {}
  };

  return (
    <header className="sticky top-0 z-50 border-b border-outline-variant/40 bg-surface/85 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-5 py-3">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-container text-on-primary">
            <LayoutGrid size={18} />
          </span>
          <span className="text-xl font-bold tracking-tight text-primary">TaskFlow</span>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <div className="relative">
            <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-outline" />
            <input
              value={query}
              onChange={(e) => onQuery(e.target.value)}
              placeholder="Cari kartu..."
              aria-label="Cari kartu"
              className="w-32 rounded-full border-none bg-surface-container-low py-2 pl-9 pr-4 text-sm text-on-surface outline-none transition-all focus:w-44 focus:ring-2 focus:ring-primary sm:w-56 sm:focus:w-64"
            />
          </div>
          <button onClick={toggleTheme} aria-label="Ganti tema" className="rounded-full p-2 text-on-surface-variant transition-colors hover:bg-surface-container-high/60 active:scale-95">
            {dark ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-container text-sm font-bold text-on-primary">B</span>
        </div>
      </div>
    </header>
  );
}
