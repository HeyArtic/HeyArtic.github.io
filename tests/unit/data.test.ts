import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { site } from '../../src/config/site';
import { certificates, certificateCategories } from '../../src/data/certificates';
import { otherRepos, projects } from '../../src/data/projects';
import { skillCategories } from '../../src/data/skills';
import { formatDate, matches, normalize, searchText, sortByDateDesc, totalHours } from '../../src/lib/certificates';
import { withBase } from '../../src/lib/url';

const publicDir = join(process.cwd(), 'public');
const isPdf = (path: string) => readFileSync(path).subarray(0, 5).toString('latin1') === '%PDF-';

describe('configuração do site', () => {
  it('links profissionais usam https/e-mail válido', () => {
    expect(site.github.url).toMatch(/^https:\/\/github\.com\//);
    if (site.linkedin) expect(site.linkedin).toMatch(/^https:\/\/(www\.)?linkedin\.com\/in\//);
    if (site.email) expect(site.email).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
  });

  it('o currículo configurado existe e é um PDF', () => {
    for (const path of [site.resume.pt, site.resume.en]) {
      if (!path) continue;
      const file = join(publicDir, path);
      expect(existsSync(file), file).toBe(true);
      expect(isPdf(file)).toBe(true);
    }
  });
});

describe('projetos', () => {
  it('ids são únicos e o NutriDiet vem primeiro', () => {
    const ids = projects.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(ids[0]).toBe('nutridiet');
  });

  it('links são https e certificados relacionados existem', () => {
    const certIds = new Set(certificates.map((c) => c.id));
    for (const p of projects) {
      for (const url of [p.demoUrl, p.repoUrl]) if (url) expect(url).toMatch(/^https:\/\//);
      for (const id of p.relatedCertificates ?? []) expect(certIds.has(id), `${p.id} → ${id}`).toBe(true);
      expect(p.tech.length).toBeGreaterThan(0);
    }
    for (const r of otherRepos) expect(r.url).toMatch(/^https:\/\/github\.com\//);
  });

  it('nenhum texto localizado está vazio', () => {
    for (const p of projects) {
      const localized = [p.context, p.summary, p.goal, p.problem, p.contributionShort, p.contribution, ...p.features, ...p.technical, ...(p.notes ?? [])];
      for (const l of localized) {
        expect(l.pt.trim()).not.toBe('');
        expect(l.en.trim()).not.toBe('');
      }
    }
    for (const cat of skillCategories) for (const s of cat.skills) expect(s.evidence.length).toBeGreaterThan(0);
  });
});

describe('certificados', () => {
  it('ids únicos, categorias válidas e datas ISO', () => {
    const ids = certificates.map((c) => c.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const c of certificates) {
      if (c.category) expect(certificateCategories).toContain(c.category);
      if (c.issuedAt) expect(c.issuedAt).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      if (c.verifyUrl) expect(c.verifyUrl).toMatch(/^https:\/\//);
    }
  });

  it('todo arquivo referenciado existe em public/certificates e é um PDF', () => {
    for (const c of certificates) {
      if (!c.file) continue;
      expect(c.file).toMatch(/^[a-z0-9-]+\.pdf$/);
      const path = join(publicDir, 'certificates', c.file);
      expect(existsSync(path), path).toBe(true);
      expect(isPdf(path)).toBe(true);
    }
  });

  it('busca ignora acentos e maiúsculas', () => {
    expect(normalize('  Autenticação   JWT ')).toBe('autenticacao jwt');
    const jwt = certificates.find((c) => c.id === 'autenticacao-jwt')!;
    expect(matches(searchText(jwt), 'autenticacao')).toBe(true);
    expect(matches(searchText(jwt), 'SEGURANÇA jwt')).toBe(true);
    expect(matches(searchText(jwt), 'mongodb')).toBe(false);
  });

  it('ordena por data e soma horas aceitando campos ausentes', () => {
    const sorted = sortByDateDesc([{ issuedAt: null }, { issuedAt: '2025-01-01' }, { issuedAt: '2026-01-01' }]);
    expect(sorted.map((c) => c.issuedAt)).toEqual(['2026-01-01', '2025-01-01', null]);
    expect(totalHours([{ hours: 3 }, { hours: null }, { hours: 4 }])).toBe(7);
    expect(formatDate(null, 'pt')).toBeNull();
    expect(formatDate('data-invalida', 'en')).toBeNull();
    expect(formatDate('2026-10-08', 'en')).toBe('Oct 08, 2026');
  });
});

describe('withBase', () => {
  it('monta caminhos com e sem base', () => {
    expect(withBase('cv/a.pdf', '/portfolio')).toBe('/portfolio/cv/a.pdf');
    expect(withBase('/cv/a.pdf', '/portfolio/')).toBe('/portfolio/cv/a.pdf');
    expect(withBase('cv/a.pdf', '/')).toBe('/cv/a.pdf');
  });
});
