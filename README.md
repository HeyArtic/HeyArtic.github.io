# Portfólio · Alisson Abreu

Portfólio profissional de desenvolvedor backend júnior (Python), bilíngue (PT/EN), com projetos, competências, certificados, um terminal interativo e integração com a API pública do GitHub.

> English version: [README.en.md](README.en.md)

## Sumário

- [Objetivo](#objetivo)
- [Stack e justificativas](#stack-e-justificativas)
- [Requisitos](#requisitos)
- [Instalação e execução local](#instalação-e-execução-local)
- [Build de produção](#build-de-produção)
- [Testes](#testes)
- [Estrutura de diretórios](#estrutura-de-diretórios)
- [Como editar o conteúdo](#como-editar-o-conteúdo)
- [Integração com o GitHub](#integração-com-o-github)
- [Terminal interativo](#terminal-interativo)
- [Publicação gratuita (GitHub Pages)](#publicação-gratuita-github-pages)
- [Problemas comuns](#problemas-comuns)

## Objetivo

Apresentar, para recrutadores e para avaliadores técnicos, projetos reais e verificáveis:

- **NutriDiet**, o projeto principal (produto em produção, desenvolvido em parceria; minha atuação é no backend em Python);
- APIs de estudo em Python (Flask, SQLAlchemy, MongoDB, Redis, RabbitMQ), com links para o código;
- competências **com evidência** (projeto, formação ou trabalho), em vez de barras de porcentagem;
- certificados em PDF com busca, filtros e visualização sob demanda.

Nenhuma informação é inventada: textos sem fonte confirmada ficam de fora ou aparecem como observação.

## Stack e justificativas

| Escolha | Por quê |
|---|---|
| **Astro 7** (saída estática) | Gera HTML pronto no build: bom para SEO e desempenho, sem framework rodando no navegador. |
| **TypeScript** | Tipagem dos dados (projetos, certificados, traduções) e da lógica do terminal e do GitHub. |
| **CSS puro** com variáveis | Identidade própria sem framework de CSS; tema escuro e `prefers-reduced-motion`. |
| **`<dialog>` nativo** | Modais acessíveis (foco preso, Escape, fundo inerte) sem biblioteca. |
| **Fontsource** (Inter e JetBrains Mono) | Fontes servidas pelo próprio site, sem requisição a terceiros. |
| **Vitest** e **Playwright + axe** | Testes unitários e ponta a ponta, incluindo acessibilidade automática. |

Não há backend: o site é estático e a API do GitHub é pública. O JavaScript do cliente (~19 KB) cuida só do idioma, dos modais, do terminal, dos certificados e dos metadados do GitHub.

## Requisitos

- **Node.js 22 ou superior** (testado com Node 24) e npm.
- Para os testes ponta a ponta: Chromium do Playwright (`npx playwright install chromium`) **ou** Edge/Chrome instalados (`PW_CHANNEL=msedge`).

## Instalação e execução local

```bash
git clone https://github.com/HeyArtic/portfolio.git
cd portfolio
npm install
npm run dev
```

Acesse `http://localhost:4321/portfolio/` (o caminho `/portfolio/` corresponde ao GitHub Pages; veja [BASE_PATH](#publicação-gratuita-github-pages)).

## Build de produção

```bash
npm run build      # gera ./dist
npm run preview    # serve ./dist localmente
```

## Testes

```bash
npm run check      # checagem de tipos (astro check)
npm test           # testes unitários (Vitest)
npm run build      # necessário antes dos testes e2e
npm run test:e2e   # testes ponta a ponta (Playwright)
npm run verify     # tudo acima, em sequência
```

No Windows, para usar o Edge instalado em vez de baixar o Chromium:

```powershell
$env:PW_CHANNEL = 'msedge'; npm run test:e2e
```

O que é verificado:

- **Unitários:** comandos do terminal (inclusive entradas maliciosas e nomes como `constructor`), cliente do GitHub (cache, timeout, limite de requisições, JSON inválido), paridade das traduções PT/EN, integridade dos dados (IDs únicos, PDFs existentes e válidos, links https).
- **Ponta a ponta:** alternância de idioma sem recarregar, modais (Escape, botão, clique fora, retorno do foco), terminal, site funcionando com a API do GitHub offline ou bloqueada, currículo e PDFs respondendo 200, busca e filtros de certificados, PDF ausente, ausência de rolagem horizontal de 320 a 1920 px, menu móvel, axe (WCAG 2.1 A/AA) e movimento reduzido.

## Estrutura de diretórios

```
├── public/
│   ├── certificates/        # PDFs dos certificados (públicos)
│   ├── cv/                  # currículo em PDF
│   ├── favicon.svg
│   └── og-image.png         # imagem de compartilhamento (scripts/og-image.mjs)
├── src/
│   ├── config/site.ts       # ⭐ nome, links, e-mail, currículo, usuário do GitHub
│   ├── data/
│   │   ├── projects.ts      # ⭐ projetos (ordem, textos, tecnologias, links)
│   │   ├── skills.ts        # ⭐ competências e evidências
│   │   └── certificates.ts  # ⭐ metadados dos certificados
│   ├── i18n/
│   │   ├── ui.ts            # ⭐ textos da interface em PT e EN
│   │   ├── dictionary.ts    # junta interface + dados em chaves planas
│   │   ├── server.ts        # helpers usados nos componentes (build)
│   │   ├── format.ts        # substituição de {variáveis}
│   │   └── types.ts
│   ├── lib/                 # lógica pura e testável
│   │   ├── terminal.ts      # comandos permitidos do terminal
│   │   ├── github.ts        # API do GitHub com cache e fallback
│   │   ├── certificates.ts  # busca, ordenação, datas
│   │   └── url.ts
│   ├── scripts/             # código do navegador (i18n, modais, terminal…)
│   ├── components/          # seções em .astro
│   ├── layouts/Base.astro   # <head>, SEO, Open Graph
│   ├── pages/               # index, robots.txt, sitemap.xml
│   └── styles/global.css    # tokens e estilos
├── tests/
│   ├── unit/                # Vitest
│   └── e2e/                 # Playwright
├── scripts/og-image.mjs
└── .github/workflows/deploy.yml
```

Os arquivos marcados com ⭐ são os que você vai editar no dia a dia, sem mexer nos componentes.

## Como editar o conteúdo

### Links profissionais, e-mail e nome

Edite `src/config/site.ts`. Qualquer campo opcional definido como `null` (LinkedIn, e-mail, localização, `sourceRepo`) some da interface; nenhum placeholder aparece para o visitante.

### Currículo

1. Substitua `public/cv/alisson-abreu-curriculo.pdf` pelo novo arquivo, mantendo o nome, **ou** coloque outro PDF em `public/cv/` e atualize `resume.pt` em `src/config/site.ts`.
2. Se tiver uma versão em inglês, adicione-a em `public/cv/` e preencha `resume.en`. Os botões passam a abrir o PDF do idioma ativo.
3. Rode `npm test`: o teste confere se o arquivo existe e é um PDF.

> ⚠️ Tudo o que está em `public/` fica acessível para qualquer pessoa. O currículo atual contém **telefone e e-mail**. Se preferir não expô-los, publique uma versão sem o telefone.

### Projetos

Edite `src/data/projects.ts`. A ordem do array é a ordem dos cards. Campos principais:

| Campo | Uso |
|---|---|
| `status` | `production`, `study` ou `in-progress` (selo do card) |
| `featured` | Selo "Projeto principal" (o tamanho do card não muda) |
| `summary`, `contributionShort` | Textos curtos do card |
| `goal`, `problem`, `contribution`, `features`, `technical`, `notes` | Conteúdo do modal |
| `featuresSource` | `code` (verificado no código) ou `site` (descrito no site público) |
| `repo` | `"usuario/repositorio"`, que ativa os metadados do GitHub |
| `relatedCertificates` | IDs de `certificates.ts`, exibidos no modal |

Todo texto é um objeto `{ pt, en }`. Repositórios que não viram card vão em `otherRepos`.

### Competências

Edite `src/data/skills.ts`. Cada tecnologia tem `evidence` (`project`, `study`, `work`) e `where` (onde a evidência pode ser conferida).

### Certificados

1. Copie o PDF para `public/certificates/` com um nome sem espaços nem acentos (ex.: `docker-fundamentos.pdf`).
2. Adicione um registro em `src/data/certificates.ts`:

```ts
{
  id: 'docker-fundamentos',
  title: 'Nome oficial, como no certificado',
  issuer: 'Instituição',          // ou null
  category: 'tools',              // python | backend | databases | architecture | tools | events | null
  type: 'micro',                  // program | micro | participation | null
  issuedAt: '2026-11-30',         // AAAA-MM-DD ou null
  hours: 8,                       // ou null
  file: 'docker-fundamentos.pdf', // ou null
  verifyUrl: null,                // página pública de verificação, se existir
  topics: ['Docker', 'Compose'],  // usados na busca
},
```

3. Rode `npm test` para validar o caminho do arquivo.

Ao remover um certificado, apague o registro e o PDF. Se um registro apontar para um arquivo inexistente, o card mostra "Arquivo indisponível" e a página continua funcionando. Para criar uma categoria, adicione-a em `certificateCategories` e o rótulo em `certs.category` nos dois idiomas de `src/i18n/ui.ts`.

### Traduções

- **Interface:** `src/i18n/ui.ts`. O objeto `en` é tipado a partir de `pt`, então uma chave faltando gera erro no `npm run check` e no `npm test`.
- **Conteúdo:** os campos `{ pt, en }` em `src/data/*`.
- **Como funciona:** o HTML é gerado em português. Cada texto traduzível recebe `data-i18n="chave"`, e ao trocar o idioma o script substitui os textos a partir de um dicionário embutido, sem recarregar a página. A preferência fica em `localStorage`, e `?lang=en` abre o site direto em inglês.

## Integração com o GitHub

`src/lib/github.ts` faz **uma** requisição a `api.github.com/users/HeyArtic/repos`, depois que a página já carregou, para complementar os cards com a linguagem principal e a data da última atualização.

- **A curadoria é local:** a API não adiciona nem remove projetos.
- **Cache de 6 horas** no `localStorage`, para não esbarrar no limite de 60 requisições por hora sem token.
- **Timeout de 6 s.** Em erro de rede, limite de requisições ou resposta inválida, o site usa o cache antigo ou os dados locais, sem mostrar erro ao visitante.
- **Sem token** e sem credenciais no código.

## Terminal interativo

É uma interface de navegação, **não um shell**. A entrada é dividida em palavras e comparada com uma lista explícita de comandos (`help`, `about`, `projects`, `open <id>`, `skills`, `certs`, `contact`, `cv`, `lang pt|en`, `whoami`, `clear`). Não há `eval`, `Function`, `innerHTML` nem acesso a arquivos ou à rede. As saídas são montadas com `textContent`, e os links passam por uma lista de protocolos permitidos (`https:`, `mailto:` e caminhos relativos).

Atalhos: **Tab** completa, **↑/↓** navega pelo histórico, **Ctrl+L** limpa.

## Publicação gratuita (GitHub Pages)

O GitHub Pages é gratuito para repositórios públicos, e o workflow `.github/workflows/deploy.yml` faz checagem, testes, build e deploy a cada push na branch `main`.

### Primeira publicação

1. Crie um repositório público no GitHub chamado **`portfolio`** (o endereço final será `https://heyartic.github.io/portfolio/`).
2. Na pasta do projeto:

   ```bash
   git init
   git add .
   git commit -m "Primeira versão do portfólio"
   git branch -M main
   git remote add origin https://github.com/HeyArtic/portfolio.git
   git push -u origin main
   ```

3. No repositório: **Settings → Pages → Build and deployment → Source: GitHub Actions**.
4. Acompanhe em **Actions**. Ao terminar, o link aparece no job `deploy`.

O workflow obtém o endereço e o caminho base com `actions/configure-pages` e os repassa ao build (`SITE_URL` e `BASE_PATH`), então não é preciso editar nada se o repositório tiver outro nome.

### Atualizar o portfólio

Edite os arquivos, rode `npm run verify` (opcional, mas recomendado) e faça `git push`. O deploy é automático.

### Domínio próprio (opcional)

1. Em **Settings → Pages → Custom domain**, informe o domínio (ex.: `alissonabreu.dev`).
2. No provedor do domínio, crie um registro `CNAME` apontando `www` para `heyartic.github.io`; para o domínio raiz, use os registros `A` indicados na [documentação do GitHub Pages](https://docs.github.com/pages/configuring-a-custom-domain-for-your-github-pages-site).
3. Marque **Enforce HTTPS** quando ficar disponível.

Com domínio próprio, o caminho base passa a ser `/`, e o workflow ajusta isso sozinho.

### Alternativa: Vercel ou Netlify

Importe o repositório e configure:

- Build command: `npm run build`; output: `dist`
- Variáveis de ambiente: `SITE_URL=https://seu-projeto.vercel.app` e `BASE_PATH=/`

## Problemas comuns

| Sintoma | Causa provável e solução |
|---|---|
| CSS e links quebrados no GitHub Pages | `BASE_PATH` errado. Use o workflow incluído ou defina `BASE_PATH=/nome-do-repositorio`. |
| Página 404 no Pages | Em Settings → Pages, a fonte precisa ser **GitHub Actions**. |
| Datas do GitHub não aparecem | Limite da API atingido ou rede bloqueada. É esperado: o site usa os dados locais. |
| PDF não aparece dentro da página no celular | Alguns navegadores móveis não exibem PDF embutido. O visualizador mostra os botões "Abrir em nova aba" e "Baixar". |
| `npm run test:e2e` não encontra o navegador | Rode `npx playwright install chromium` ou defina `PW_CHANNEL=msedge`/`chrome`. |
| Erro de chave de tradução no `npm run check` | Falta a chave em `en` (ou em `pt`) em `src/i18n/ui.ts`. |

## Privacidade

- Os arquivos em `public/` (currículo e certificados) são **públicos** para quem souber o endereço.
- Os certificados trazem nome completo, número de matrícula (RA) e código de verificação. Eles foram incluídos porque a página de verificação da Rocketseat já é pública, mas você pode removê-los a qualquer momento.
- O site não usa rastreadores, cookies ou analytics.
