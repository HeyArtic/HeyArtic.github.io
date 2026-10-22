/**
 * Certificados — metadados centralizados.
 *
 * Para adicionar um certificado:
 *   1. Copie o PDF para `public/certificates/` (nome sem espaços ou acentos).
 *   2. Adicione um registro abaixo. Campos desconhecidos podem ficar `null`.
 *
 * Os títulos são os nomes oficiais, como aparecem no documento, e não são traduzidos.
 * Os dados abaixo foram transcritos dos próprios PDFs.
 */

export const certificateCategories = [
  'python',
  'backend',
  'databases',
  'architecture',
  'tools',
  'events',
] as const;
export type CertificateCategory = (typeof certificateCategories)[number];

export type CertificateType = 'program' | 'micro' | 'participation';

export interface Certificate {
  /** Identificador único (usado em links e testes). */
  id: string;
  /** Nome oficial, exatamente como no certificado. */
  title: string;
  issuer: string | null;
  category: CertificateCategory | null;
  type: CertificateType | null;
  /** Data de emissão no formato ISO (AAAA-MM-DD). */
  issuedAt: string | null;
  /** Carga horária em horas. */
  hours: number | null;
  /** Nome do arquivo dentro de `public/certificates/`. */
  file: string | null;
  /** Página pública de verificação da emissora, se existir. */
  verifyUrl: string | null;
  /** Conteúdos listados no certificado (usados na busca). */
  topics: string[];
}

const rocketseatVerify = (code: string) => `https://app.rocketseat.com.br/certificates/${code}`;

export const certificates: Certificate[] = [
  {
    id: 'formacao-python',
    title: 'Especialização/Formação em Python',
    issuer: 'Faculdade de Tecnologia Rocketseat',
    category: 'python',
    type: 'program',
    issuedAt: '2026-10-08',
    hours: 100,
    file: 'formacao-python.pdf',
    verifyUrl: rocketseatVerify('60c8b2fa-423e-4815-8e9e-3e8b3e3a1f0e'),
    topics: [
      'Python', 'Flask', 'CRUD', 'SQLAlchemy', 'MySQL', 'SQLite', 'Redis', 'MongoDB',
      'WebSocket', 'Design Patterns', 'SOLID', 'MVC', 'JWT', 'Pytest', 'RabbitMQ',
      'FastAPI', 'Uvicorn', 'Pydantic', 'Ollama', 'Streamlit',
    ],
  },
  {
    id: 'rabbitmq-python',
    title: 'RabbitMQ com Python',
    issuer: 'Faculdade de Tecnologia Rocketseat',
    category: 'backend',
    type: 'micro',
    issuedAt: '2026-06-21',
    hours: 3,
    file: 'rabbitmq-com-python.pdf',
    verifyUrl: rocketseatVerify('28562719-f31f-4fec-89a8-6a9470584e71'),
    topics: ['Flask', 'HTTP', 'API', 'SQLAlchemy', 'RabbitMQ', 'Pytest'],
  },
  {
    id: 'redis-python-flask',
    title: 'Aplicações com Redis, Python e Flask',
    issuer: 'Faculdade de Tecnologia Rocketseat',
    category: 'databases',
    type: 'micro',
    issuedAt: '2026-06-06',
    hours: 4,
    file: 'aplicacoes-com-redis-python-e-flask.pdf',
    verifyUrl: rocketseatVerify('1ceb76b0-ed13-4786-afc7-01454e3a4cce'),
    topics: ['Flask', 'HTTP', 'API', 'SQLAlchemy', 'Redis', 'Pytest'],
  },
  {
    id: 'nosql-mongodb',
    title: 'NoSQL com MongoDB',
    issuer: 'Faculdade de Tecnologia Rocketseat',
    category: 'databases',
    type: 'micro',
    issuedAt: '2026-04-29',
    hours: 6,
    file: 'nosql-com-mongodb.pdf',
    verifyUrl: rocketseatVerify('9f5fd2ca-5d76-41ec-abaf-5752e1181c27'),
    topics: ['Flask', 'HTTP', 'API', 'SQLAlchemy', 'MongoDB', 'Pytest', 'NoSQL'],
  },
  {
    id: 'nlw-operator-python',
    title: 'NLW Operator - Python',
    issuer: 'Rocketseat',
    category: 'events',
    type: 'participation',
    issuedAt: '2026-03-17',
    hours: 5,
    file: 'nlw-operator-python.pdf',
    verifyUrl: rocketseatVerify('2d999af3-8936-4008-b7df-7a86d6de5c56'),
    topics: [
      'Visão computacional', 'Computer vision', 'PyTorch', 'OpenCV', 'MediaPipe',
      'Scikit-Learn', 'YOLO', 'Gemini API', 'FastHTML', 'WebSockets',
    ],
  },
  {
    id: 'autenticacao-jwt',
    title: 'Autenticação JWT e Segurança',
    issuer: 'Faculdade de Tecnologia Rocketseat',
    category: 'backend',
    type: 'micro',
    issuedAt: '2026-02-14',
    hours: 7,
    file: 'autenticacao-jwt-e-seguranca.pdf',
    verifyUrl: rocketseatVerify('1f7ff97e-902b-4a2c-9d35-87afde92e54e'),
    topics: ['Flask', 'HTTP', 'API', 'SQLAlchemy', 'Flask-Login', 'Pytest', 'JWT', 'Segurança', 'Security'],
  },
  {
    id: 'arquitetura-mvc',
    title: 'Arquitetura de Software e Padrão MVC',
    issuer: 'Faculdade de Tecnologia Rocketseat',
    category: 'architecture',
    type: 'micro',
    issuedAt: '2025-09-10',
    hours: 10,
    file: 'arquitetura-de-software-e-padrao-mvc.pdf',
    verifyUrl: rocketseatVerify('6743c7ff-0a9c-4d16-b47e-94591c4d1dab'),
    topics: ['Flask', 'HTTP', 'API', 'SQLAlchemy', 'Pytest', 'Banco de dados', 'SOLID', 'Render', 'MVC'],
  },
  {
    id: 'design-de-codigo',
    title: 'Design de código',
    issuer: 'Faculdade de Tecnologia Rocketseat',
    category: 'architecture',
    type: 'micro',
    issuedAt: '2025-09-10',
    hours: 6,
    file: 'design-de-codigo.pdf',
    verifyUrl: rocketseatVerify('ea478a91-793c-494d-9401-ddf2321c5e85'),
    topics: ['Typing', 'Pytest', 'Unittest', 'Mock', 'SOLID', 'Interfaces', 'Erros personalizados'],
  },
  {
    id: 'nlw-agents',
    title: 'NLW Agents - Iniciante',
    issuer: 'Rocketseat',
    category: 'events',
    type: 'participation',
    issuedAt: '2025-07-14',
    hours: 5,
    file: 'nlw-agents-iniciante.pdf',
    verifyUrl: rocketseatVerify('1f71f43e-02ff-403e-8a3c-353968e36200'),
    topics: ['HTML', 'CSS', 'JavaScript', 'LLMs', 'Agentes de IA', 'AI agents', 'Prompt', 'Gemini'],
  },
  {
    id: 'explorando-flask',
    title: 'Explorando o framework Flask',
    issuer: 'Faculdade de Tecnologia Rocketseat',
    category: 'backend',
    type: 'micro',
    issuedAt: '2025-06-16',
    hours: 10,
    file: 'explorando-o-framework-flask.pdf',
    verifyUrl: rocketseatVerify('99e676cf-eb7b-46e6-bfe1-0dcfe02ccc58'),
    topics: ['Flask', 'HTTP', 'API', 'SQLAlchemy', 'Flask-Login', 'WebSocket', 'SocketIO', 'Banco de dados'],
  },
  {
    id: 'fundamentos-python',
    title: 'Fundamentos de Python',
    issuer: 'Faculdade de Tecnologia Rocketseat',
    category: 'python',
    type: 'micro',
    issuedAt: '2025-05-31',
    hours: 10,
    file: 'fundamentos-de-python.pdf',
    verifyUrl: rocketseatVerify('5c0d1303-a763-4f6e-926e-5cde7eb12c54'),
    topics: ['Estrutura de dados', 'Tipos de dados', 'Condicionais', 'Loops', 'Orientação a objetos', 'OOP'],
  },
  {
    id: 'git-github',
    title: 'O básico de Git e GitHub',
    issuer: 'Faculdade de Tecnologia Rocketseat',
    category: 'tools',
    type: 'micro',
    issuedAt: '2025-05-21',
    hours: 1,
    file: 'o-basico-de-git-e-github.pdf',
    verifyUrl: rocketseatVerify('18391354-ae85-436d-8495-d40b28b13801'),
    topics: ['Git', 'GitHub', 'Commits', 'Controle de versão', 'Version control'],
  },
];
