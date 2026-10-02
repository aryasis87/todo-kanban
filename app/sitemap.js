const URL = 'https://todo-kanban-one.vercel.app';

export default function sitemap() {
  const now = new Date();
  return ['', '/statistik', '/arsip'].map((p) => ({ url: URL + p, lastModified: now, changeFrequency: 'monthly', priority: p ? 0.6 : 1 }));
}
