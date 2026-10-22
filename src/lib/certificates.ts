import type { Certificate } from '../data/certificates';

/** Normaliza para busca: minúsculas, sem acentos, espaços simples. */
export function normalize(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();
}

/** Texto pesquisável de um certificado, incluindo rótulos de categoria nos dois idiomas. */
export function searchText(cert: Certificate, categoryLabels: string[] = []): string {
  return normalize([cert.title, cert.issuer ?? '', ...cert.topics, ...categoryLabels].join(' '));
}

export function matches(haystack: string, query: string): boolean {
  const terms = normalize(query).split(' ').filter(Boolean);
  return terms.every((term) => haystack.includes(term));
}

/** Mais recentes primeiro; certificados sem data vão para o fim. */
export function sortByDateDesc<T extends Pick<Certificate, 'issuedAt'>>(items: T[]): T[] {
  return [...items].sort((a, b) => {
    if (a.issuedAt === b.issuedAt) return 0;
    if (!a.issuedAt) return 1;
    if (!b.issuedAt) return -1;
    return b.issuedAt.localeCompare(a.issuedAt);
  });
}

export function totalHours(items: Pick<Certificate, 'hours'>[]): number {
  return items.reduce((sum, c) => sum + (c.hours ?? 0), 0);
}

export function formatDate(iso: string | null, lang: 'pt' | 'en'): string | null {
  if (!iso || !/^\d{4}-\d{2}-\d{2}$/.test(iso)) return null;
  const [y, m, d] = iso.split('-').map(Number);
  const date = new Date(Date.UTC(y, m - 1, d));
  return new Intl.DateTimeFormat(lang === 'pt' ? 'pt-BR' : 'en-US', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(date);
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
