/**
 * Configuração central do portfólio.
 *
 * Tudo o que muda com frequência (nome, links, currículo, usuário do GitHub)
 * fica aqui. Campos com `null` são omitidos da interface — nada de placeholder
 * aparece para o visitante.
 */

export interface SiteConfig {
  /** Nome exibido no site. Fonte: perfil do GitHub e currículo. */
  name: string;
  /** Localização exibida na seção "Sobre". `null` para ocultar. */
  location: { pt: string; en: string } | null;
  github: {
    username: string;
    url: string;
  };
  /** URL completa do LinkedIn. `null` para ocultar. Fonte: currículo e READMEs. */
  linkedin: string | null;
  /** E-mail profissional. `null` para ocultar. Fonte: currículo. */
  email: string | null;
  /**
   * Currículo em PDF, com caminho relativo à pasta `public/`.
   * `en: null` faz a versão em inglês apontar para o PDF em português,
   * com o rótulo indicando o idioma do documento.
   */
  resume: { pt: string | null; en: string | null };
  /** Repositório do próprio portfólio (exibido no rodapé). `null` para ocultar. */
  sourceRepo: string | null;
}

export const site: SiteConfig = {
  name: 'Alisson Abreu',
  location: { pt: 'Ceará, Brasil', en: 'Ceará, Brazil' },
  github: {
    username: 'HeyArtic',
    url: 'https://github.com/HeyArtic',
  },
  linkedin: 'https://www.linkedin.com/in/alisson-abreuh',
  email: 'alissonabreuh@gmail.com',
  resume: {
    pt: 'cv/alisson-abreu-curriculo.pdf',
    en: null,
  },
  sourceRepo: null,
};
