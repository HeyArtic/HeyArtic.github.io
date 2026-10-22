import type { Localized } from '../i18n/types';

/**
 * Competências organizadas por categoria.
 *
 * Em vez de níveis ou porcentagens, cada tecnologia mostra o tipo de
 * evidência que a sustenta:
 *   - project:  usada em um repositório público (ou no NutriDiet)
 *   - study:    estudada em formação/curso certificado, sem projeto público ainda
 *   - work:     usada no trabalho (segundo o currículo)
 */

export type EvidenceKind = 'project' | 'study' | 'work';

export interface Skill {
  /** Nome da tecnologia. Use `Localized` apenas quando o nome precisar de tradução. */
  name: string | Localized;
  evidence: EvidenceKind[];
  /** Onde a evidência pode ser conferida (nomes de projetos, módulos, etc.). */
  where: Localized;
}

export interface SkillCategory {
  id: string;
  title: Localized;
  skills: Skill[];
}

export const skillCategories: SkillCategory[] = [
  {
    id: 'language',
    title: { pt: 'Linguagem principal', en: 'Main language' },
    skills: [
      {
        name: 'Python',
        evidence: ['project', 'study', 'work'],
        where: {
          pt: 'NutriDiet, projetos de API, formação de 100h e automações no trabalho',
          en: 'NutriDiet, API projects, a 100-hour program and automation at work',
        },
      },
    ],
  },
  {
    id: 'apis',
    title: { pt: 'APIs e frameworks', en: 'APIs and frameworks' },
    skills: [
      {
        name: 'Flask',
        evidence: ['project', 'study'],
        where: { pt: 'PetShop, Delivery, Pix, LoginAPI', en: 'PetShop, Delivery, Pix, LoginAPI' },
      },
      {
        name: { pt: 'APIs REST', en: 'REST APIs' },
        evidence: ['project', 'study'],
        where: { pt: 'Rotas CRUD com validação e erros HTTP tipados', en: 'CRUD routes with validation and typed HTTP errors' },
      },
      {
        name: 'Pydantic · Cerberus',
        evidence: ['project'],
        where: { pt: 'Validação de payload (PetShop, Delivery)', en: 'Payload validation (PetShop, Delivery)' },
      },
      {
        name: 'WebSocket · Socket.IO',
        evidence: ['project', 'study'],
        where: { pt: 'Confirmação em tempo real (Pix)', en: 'Real-time confirmation (Pix)' },
      },
      {
        name: 'FastAPI',
        evidence: ['study'],
        where: { pt: 'Formação Python: ASGI, Uvicorn, async e Pydantic', en: 'Python program: ASGI, Uvicorn, async and Pydantic' },
      },
    ],
  },
  {
    id: 'databases',
    title: { pt: 'Bancos de dados e SQL', en: 'Databases and SQL' },
    skills: [
      {
        name: 'SQL',
        evidence: ['project'],
        where: { pt: 'Schemas e consultas parametrizadas (PetShop, Finance)', en: 'Schemas and parameterized queries (PetShop, Finance)' },
      },
      {
        name: 'SQLAlchemy',
        evidence: ['project', 'study'],
        where: { pt: 'PetShop, Pix, LoginAPI', en: 'PetShop, Pix, LoginAPI' },
      },
      {
        name: 'SQLite',
        evidence: ['project'],
        where: { pt: 'Banco local nos projetos de estudo', en: 'Local database in study projects' },
      },
      {
        name: 'PostgreSQL',
        evidence: ['project'],
        where: { pt: 'Com pgvector no projeto do NLW Agents', en: 'With pgvector in the NLW Agents project' },
      },
      {
        name: 'MySQL',
        evidence: ['study'],
        where: { pt: 'Formação Python (integração via SQLAlchemy)', en: 'Python program (integration via SQLAlchemy)' },
      },
      {
        name: 'MongoDB',
        evidence: ['project', 'study'],
        where: { pt: 'Delivery Orders API', en: 'Delivery Orders API' },
      },
    ],
  },
  {
    id: 'cache-messaging',
    title: { pt: 'Cache e mensageria', en: 'Caching and messaging' },
    skills: [
      {
        name: 'Redis',
        evidence: ['project', 'study'],
        where: { pt: 'Cache-aside com expiração (em desenvolvimento)', en: 'Cache-aside with expiry (in progress)' },
      },
      {
        name: 'RabbitMQ',
        evidence: ['project', 'study'],
        where: { pt: 'Publisher/consumer com fila durável', en: 'Publisher/consumer with a durable queue' },
      },
    ],
  },
  {
    id: 'quality',
    title: { pt: 'Arquitetura e qualidade', en: 'Architecture and quality' },
    skills: [
      {
        name: { pt: 'Arquitetura em camadas · MVC', en: 'Layered architecture · MVC' },
        evidence: ['project', 'study'],
        where: { pt: 'Repositórios, controllers, views e composers', en: 'Repositories, controllers, views and composers' },
      },
      {
        name: 'SOLID · interfaces',
        evidence: ['project', 'study'],
        where: { pt: 'Interfaces abstratas e injeção de dependências', en: 'Abstract interfaces and dependency injection' },
      },
      {
        name: 'Pytest · mocks',
        evidence: ['project', 'study'],
        where: { pt: 'Testes de repositório, validador e caso de uso', en: 'Repository, validator and use-case tests' },
      },
      {
        name: 'JWT',
        evidence: ['project', 'study'],
        where: { pt: 'Geração e validação de tokens (Finance)', en: 'Token generation and validation (Finance)' },
      },
    ],
  },
  {
    id: 'tools',
    title: { pt: 'Ferramentas e infraestrutura', en: 'Tools and infrastructure' },
    skills: [
      {
        name: 'Git · GitHub',
        evidence: ['project', 'study'],
        where: { pt: 'Versionamento de todos os projetos', en: 'Version control for every project' },
      },
      {
        name: 'Docker',
        evidence: ['project'],
        where: { pt: 'Docker Compose para PostgreSQL (NLW Agents)', en: 'Docker Compose for PostgreSQL (NLW Agents)' },
      },
      {
        name: 'Pylint · pre-commit',
        evidence: ['project'],
        where: { pt: 'Lint automático antes do commit (PetShop)', en: 'Automatic linting before each commit (PetShop)' },
      },
    ],
  },
];
