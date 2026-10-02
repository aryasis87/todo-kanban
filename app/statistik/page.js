import TopBar from '@/components/TopBar';
import Statistik from '@/components/Statistik';

export const metadata = {
  title: 'Statistik',
  description: 'Statistik papan Lajur: lead time, cycle time, kartu selesai per hari, isi tiap lajur terhadap batas WIP, dan umur kartu yang sedang dikerjakan.',
  alternates: { canonical: '/statistik' },
};

export default function StatistikPage() {
  return (
    <div className="min-h-screen bg-background">
      <TopBar />
      <main className="mx-auto w-full max-w-4xl px-5 py-8">
        <h1 className="text-3xl font-extrabold tracking-tight text-on-surface">Statistik alur</h1>
        <p className="mt-1 text-on-surface-variant">Seberapa cepat kartu melewati lajur — bukan seberapa sibuk papannya.</p>
        <div className="mt-8"><Statistik /></div>
      </main>
    </div>
  );
}
