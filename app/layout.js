import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-jakarta", display: "swap" });

const __jsonld = {"@context":"https://schema.org","@type":"WebApplication","name":"Lajur Kanban","description":"Papan kanban tiga lajur: seret kartu, checklist dan tenggat di tiap kartu, batas kerja paralel, arsip, serta statistik lead time dan cycle time.","url":"https://todo-kanban-one.vercel.app","applicationCategory":"ProductivityApplication","operatingSystem":"Web","offers":{"@type":"Offer","price":"0","priceCurrency":"IDR"}};

export const metadata = {
  metadataBase: new URL("https://todo-kanban-one.vercel.app"),
  title: { default: "Lajur — Papan kanban dengan batas WIP", template: "%s — Lajur" },
  description: "Papan kanban tiga lajur: seret kartu, checklist dan tenggat di tiap kartu, batas kerja paralel, arsip, serta statistik lead time dan cycle time.",
  applicationName: "Lajur",
  keywords: ["kanban", "papan kanban", "manajemen tugas", "produktivitas", "project board"],
  authors: [{ name: "Lajur" }],
  creator: "Lajur",
  publisher: "Lajur",
  alternates: { canonical: "https://todo-kanban-one.vercel.app" },
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "https://todo-kanban-one.vercel.app",
    siteName: "Lajur",
    title: "Lajur — Papan kanban dengan batas WIP",
    description: "Papan kanban tiga lajur: seret kartu, checklist dan tenggat di tiap kartu, batas kerja paralel, arsip, serta statistik lead time dan cycle time.",
    images: [{ url: "/og.jpg", width: 1200, height: 630, alt: "Lajur — Papan kanban dengan batas WIP" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Lajur — Papan kanban dengan batas WIP",
    description: "Papan kanban tiga lajur: seret kartu, checklist dan tenggat di tiap kartu, batas kerja paralel, arsip, serta statistik lead time dan cycle time.",
    images: ["/og.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
  },
};

export const viewport = { themeColor: "#0f766e" };

const themeScript = `
(function(){try{var t=localStorage.getItem('lajur.tema');var d=t? t==='dark' : window.matchMedia('(prefers-color-scheme: dark)').matches;if(d)document.documentElement.classList.add('dark');}catch(e){}})();
`;

export default function RootLayout({ children }) {
  return (
    <html lang="id" className={jakarta.variable} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="antialiased">{children}<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(__jsonld) }} />
        </body>
    </html>
  );
}
