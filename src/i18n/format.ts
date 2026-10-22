export type Dictionary = Record<string, string>;
export type Vars = Record<string, string | number>;

/** Substitui {variáveis} em um texto traduzido. Variáveis desconhecidas ficam intactas. */
export function format(template: string, vars?: Vars): string {
  if (!vars) return template;
  return template.replace(/\{(\w+)\}/g, (match, name: string) =>
    Object.prototype.hasOwnProperty.call(vars, name) ? String(vars[name]) : match,
  );
}

/** Cria uma função de tradução sobre um dicionário. Chaves ausentes retornam a própria chave. */
export function createTranslator(dict: Dictionary) {
  return (key: string, vars?: Vars) => format(dict[key] ?? key, vars);
}
