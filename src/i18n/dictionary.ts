import { projects, otherRepos } from '../data/projects';
import { skillCategories } from '../data/skills';
import { site } from '../config/site';
import { ui } from './ui';
import { languages, type Lang, type Localized } from './types';
import { format, createTranslator, type Dictionary } from './format';

export type { Dictionary };

function flatten(obj: Record<string, unknown>, prefix = '', out: Dictionary = {}): Dictionary {
  for (const [key, value] of Object.entries(obj)) {
    const path = prefix ? `${prefix}.${key}` : key;
    if (typeof value === 'string') out[path] = value;
    else if (value && typeof value === 'object') flatten(value as Record<string, unknown>, path, out);
  }
  return out;
}

function addLocalized(out: Dictionary, key: string, value: Localized | undefined, lang: Lang) {
  if (value) out[key] = value[lang];
}

/** Chaves usadas pelos componentes para textos vindos de `src/data`. */
export const dataKey = {
  project: (id: string, field: string) => `project.${id}.${field}`,
  projectItem: (id: string, field: string, i: number) => `project.${id}.${field}.${i}`,
  otherRepo: (repo: string) => `otherRepo.${repo}`,
  skillCategory: (id: string) => `skillCategory.${id}`,
  skillName: (cat: string, i: number) => `skill.${cat}.${i}.name`,
  skillWhere: (cat: string, i: number) => `skill.${cat}.${i}.where`,
  location: () => 'site.location',
};

function buildFor(lang: Lang): Dictionary {
  const out = flatten(ui[lang] as unknown as Record<string, unknown>);

  for (const p of projects) {
    const fields = ['context', 'summary', 'goal', 'problem', 'contributionShort', 'contribution'] as const;
    for (const f of fields) addLocalized(out, dataKey.project(p.id, f), p[f], lang);
    p.features.forEach((v, i) => addLocalized(out, dataKey.projectItem(p.id, 'features', i), v, lang));
    p.technical.forEach((v, i) => addLocalized(out, dataKey.projectItem(p.id, 'technical', i), v, lang));
    p.notes?.forEach((v, i) => addLocalized(out, dataKey.projectItem(p.id, 'notes', i), v, lang));
  }

  for (const r of otherRepos) addLocalized(out, dataKey.otherRepo(r.repo), r.note, lang);

  for (const cat of skillCategories) {
    addLocalized(out, dataKey.skillCategory(cat.id), cat.title, lang);
    cat.skills.forEach((s, i) => {
      out[dataKey.skillName(cat.id, i)] = typeof s.name === 'string' ? s.name : s.name[lang];
      addLocalized(out, dataKey.skillWhere(cat.id, i), s.where, lang);
    });
  }

  if (site.location) out[dataKey.location()] = site.location[lang];

  return out;
}

export function buildDictionaries(): Record<Lang, Dictionary> {
  return Object.fromEntries(languages.map((l) => [l, buildFor(l)])) as Record<Lang, Dictionary>;
}

export { format, createTranslator };
