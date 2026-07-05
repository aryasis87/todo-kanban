import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });

const __jsonld = {"@context":"https://schema.org","@type":"WebApplication","name":"TaskFlow Kanban","description":"Papan Kanban premium","url":"https://kanban-board.pintuweb.com","applicationCategory":"ProductivityApplication","operatingSystem":"Web","offers":{"@type":"Offer","price":"0","priceCurrency":"IDR"}};

export const metadata = {
  metadataBase: new URL("https://kanban-board.pintuweb.com"),
  title: "TaskFlow — Papan Kanban Produktif",
  description: "Papan Kanban premium: drag & drop antar kolom, prioritas, tenggat, progress, dan dark mode.",
  applicationName: "TaskFlow",
  keywords: ["kanban", "papan kanban", "manajemen tugas", "produktivitas", "project board"],
  authors: [{ name: "TaskFlow" }],
  creator: "TaskFlow",
  publisher: "TaskFlow",
  alternates: { canonical: "https://kanban-board.pintuweb.com" },
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "https://kanban-board.pintuweb.com",
    siteName: "TaskFlow",
    title: "TaskFlow — Papan Kanban Produktif",
    description: "Papan Kanban premium: drag & drop antar kolom, prioritas, tenggat, progress, dan dark mode.",
    images: [{ url: "/og.jpg", width: 1200, height: 630, alt: "TaskFlow — Papan Kanban Produktif" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "TaskFlow — Papan Kanban Produktif",
    description: "Papan Kanban premium: drag & drop antar kolom, prioritas, tenggat, progress, dan dark mode.",
    images: ["/og.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
  },
};

export const viewport = { themeColor: "#4f46e5" };

const themeScript = `
(function(){try{var t=localStorage.getItem('taskflow.theme');var d=t? t==='dark' : window.matchMedia('(prefers-color-scheme: dark)').matches;if(d)document.documentElement.classList.add('dark');}catch(e){}})();
`;

export default function RootLayout({ children }) {
  return (
    <html lang="id" className={inter.variable} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="antialiased">{children}<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(__jsonld) }} />
        </body>
    </html>
  );
}
