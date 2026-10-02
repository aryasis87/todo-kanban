'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, Moon, Sun } from 'lucide-react';

const NAV = [
  { href: '/', label: 'Papan' },
  { href: '/statistik', label: 'Statistik' },
  { href: '/arsip', label: 'Arsip' },
];

// Logo: tiga lajur dengan marka putus-putus.
function Logo() {
  return (
    <svg viewBox="0 0 32 32" className="h-8 w-8" aria-hidden="true">
      <rect width="32" height="32" rx="8" className="fill-primary-container" />
      <path d="M11 6v20M21 6v20" stroke="#fbbf24" strokeWidth="2" strokeDasharray="3 3" />
    </svg>
  );
}

export default function TopBar({ query, onQuery }) {
  const path = usePathname();
  const [dark, setDark] = useState(false);
  useEffect(() => { setDark(document.documentElement.classList.contains('dark')); }, []);
  const toggleTheme = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle('dark', next);
    try { localStorage.setItem('lajur.tema', next ? 'dark' : 'light'); } catch {}
  };

  return (
    <header className="sticky top-0 z-50 border-b border-outline-variant/60 bg-surface/90 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-x-4 gap-y-2 px-5 py-3">
        <div className="flex items-center gap-5">
          <Link href="/" className="flex items-center gap-2">
            <Logo />
            <span className="text-xl font-extrabold tracking-tight text-on-surface">Lajur</span>
          </Link>
          <nav aria-label="Utama" className="flex gap-1 text-sm font-semibold">
            {NAV.map((n) => {
              const aktif = n.href === '/' ? path === '/' : path?.startsWith(n.href);
              return (
                <Link key={n.href} href={n.href} aria-current={aktif ? 'page' : undefined}
                  className={`rounded-full px-3 py-1.5 transition ${aktif ? 'bg-primary-container text-on-primary' : 'text-on-surface-variant hover:bg-surface-container-high'}`}>
                  {n.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          {onQuery && (
            <div className="relative">
              <Search size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-outline" aria-hidden="true" />
              <input value={query} onChange={(e) => onQuery(e.target.value)} placeholder="Cari kartu…" aria-label="Cari kartu"
                className="w-36 rounded-full border border-outline-variant/70 bg-surface-container-lowest py-2 pl-9 pr-4 text-sm text-on-surface outline-none transition-all focus:w-48 focus:border-primary sm:w-56 sm:focus:w-64" />
            </div>
          )}
          <button type="button" onClick={toggleTheme} aria-label={dark ? 'Pakai mode terang' : 'Pakai mode gelap'} className="rounded-full p-2 text-on-surface-variant transition-colors hover:bg-surface-container-high">
            {dark ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>
      </div>
    </header>
  );
}
