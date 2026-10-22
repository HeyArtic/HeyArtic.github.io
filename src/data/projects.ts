import type { Localized } from '../i18n/types';

/**
 * Projetos exibidos no portfólio — curadoria manual.
 *
 * A ordem do array é a ordem dos cards. Cada texto existe em PT e EN.
 * Só descreva aqui o que pode ser comprovado (código, README, site público).
 *
 * `repo` ("usuario/repositorio") ativa o complemento de metadados pela API
 * pública do GitHub; os dados locais continuam valendo se a API falhar.
 */

export type ProjectStatus = 'production' | 'study' | 'in-progress';

export interface Project {
  id: string;
  name: string;
  status: ProjectStatus;
  /** Destaque editorial (selo "projeto principal"). O tamanho do card não muda. */
  featured?: boolean;
  /** Contexto de origem: produto real, formação, evento etc. */
  context: Localized;
  /** Texto curto do card. */
  summary: Localized;
  /** Objetivo do projeto (modal). */
  goal: Localized;
  /** Problema que o projeto procura resolver (modal). */
  problem: Localized;
  /** Contribuição em uma linha (card). */
  contributionShort: Localized;
  /** Contribuição detalhada (modal). */
  contribution: Localized;
  /** Tecnologias verificadas (código, dependências ou informação do autor). */
  tech: string[];
  /** De onde vêm as funcionalidades listadas: código do repositório ou site público. */
  featuresSource: 'code' | 'site';
  features: Localized[];
  technical: Localized[];
  /** Limitações conhecidas, estado do projeto, ressalvas. */
  notes?: Localized[];
  /** Linguagem principal usada quando a API do GitHub não responde. */
  language?: string;
  repo?: string;
  repoUrl?: string | null;
  demoUrl?: string | null;
  /** IDs de certificados relacionados (ver `certificates.ts`). */
  relatedCertificates?: string[];
}

export const projects: Project[] = [
  {
    id: 'nutridiet',
    name: 'NutriDiet',
    status: 'production',
    featured: true,
    context: {
      pt: 'Produto em produção · desenvolvido em parceria',
      en: 'Live product · built in partnership',
    },
    summary: {
      pt: 'Software para nutricionistas: agenda, prontuário, avaliação física, plano alimentar e financeiro do consultório, com app para o paciente.',
      en: 'Software for nutritionists: scheduling, patient records, physical assessment, meal plans and practice finances, plus an app for patients.',
    },
    goal: {
      pt: 'Reunir a rotina do consultório de nutrição em um único sistema acessível pelo navegador, no computador, tablet ou celular.',
      en: "Bring a nutrition practice's daily routine into a single system that runs in the browser on desktop, tablet or phone.",
    },
    problem: {
      pt: 'Organizar agenda, prontuários, avaliações, planos alimentares, exames e pagamentos do consultório em um só lugar, e dar ao paciente acesso ao próprio plano.',
      en: "Keep the practice's schedule, patient records, assessments, meal plans, exams and payments in one place, and give patients access to their own plan.",
    },
    contributionShort: {
      pt: 'Backend em Python',
      en: 'Python backend',
    },
    contribution: {
      pt: 'Atuo principalmente no backend, em Python. O NutriDiet é desenvolvido em parceria com um amigo: o produto não é de autoria exclusiva minha.',
      en: 'I work mainly on the backend, in Python. NutriDiet is built together with a friend, so the product is not solely my work.',
    },
    tech: ['Python'],
    featuresSource: 'site',
    features: [
      {
        pt: 'Agenda com lembretes por WhatsApp: a mensagem é preparada e o profissional revisa e envia pela própria conta.',
        en: 'Scheduling with WhatsApp reminders: the message is drafted, and the professional reviews and sends it from their own account.',
      },
      {
        pt: 'Prontuário com anamnese estruturada e evolução no modelo SOAP.',
        en: 'Patient records with structured anamnesis and SOAP progress notes.',
      },
      {
        pt: 'Avaliação física: IMC, relação cintura-quadril e % de gordura (Jackson & Pollock com 7 ou 3 dobras, ou bioimpedância).',
        en: 'Physical assessment: BMI, waist-hip ratio and body fat % (Jackson & Pollock with 7 or 3 skinfolds, or bioimpedance).',
      },
      {
        pt: 'Plano alimentar com a Tabela TACO e exportação em PDF.',
        en: 'Meal plans based on the TACO food composition table, with PDF export.',
      },
      {
        pt: 'Solicitação e resultados de exames, com geração de PDF.',
        en: 'Exam requests and results, with PDF output.',
      },
      {
        pt: 'Financeiro das consultas e relatórios de atendimentos, retornos e peso dos pacientes.',
        en: 'Consultation payments, plus reports on appointments, follow-ups and patient weight.',
      },
      {
        pt: 'App do paciente com plano alimentar e check-in diário.',
        en: 'Patient app with the meal plan and a daily check-in.',
      },
    ],
    technical: [
      {
        pt: 'Backend desenvolvido em Python.',
        en: 'Backend written in Python.',
      },
      {
        pt: 'Repositório privado: o código-fonte não está disponível publicamente.',
        en: 'Private repository: the source code is not publicly available.',
      },
    ],
    notes: [
      {
        pt: 'As funcionalidades acima são as descritas no site público do produto. Elas mostram o escopo do sistema, não uma lista do que eu implementei sozinho.',
        en: "The features above are the ones described on the product's public website. They show the scope of the system, not a list of what I built on my own.",
      },
    ],
    demoUrl: 'https://nutridiet.com.br',
    repoUrl: null,
  },
  {
    id: 'petshop-api',
    name: 'PetShop API',
    status: 'study',
    context: {
      pt: 'Formação Python · Rocketseat',
      en: 'Python program · Rocketseat',
    },
    summary: {
      pt: 'API REST de cadastro de pessoas e gestão de pets, organizada em camadas (models, controllers, views e composers) e com testes.',
      en: 'REST API for registering people and managing pets, organized in layers (models, controllers, views and composers), with tests.',
    },
    goal: {
      pt: 'Praticar a construção de uma API com responsabilidades bem separadas, aplicando arquitetura em camadas e princípios SOLID.',
      en: 'Practice building an API with clearly separated responsibilities, applying a layered architecture and SOLID principles.',
    },
    problem: {
      pt: 'Manter a regra de negócio, o acesso a dados e a camada HTTP independentes, para que cada parte possa ser testada e alterada isoladamente.',
      en: 'Keep business rules, data access and the HTTP layer independent, so each part can be tested and changed on its own.',
    },
    contributionShort: {
      pt: 'Implementação completa',
      en: 'Full implementation',
    },
    contribution: {
      pt: 'Implementei o código do repositório durante o módulo de arquitetura da formação: rotas, controllers, repositórios, validação, tratamento de erros e testes.',
      en: "I wrote the repository's code during the architecture module of the program: routes, controllers, repositories, validation, error handling and tests.",
    },
    tech: ['Python', 'Flask', 'SQLAlchemy', 'SQLite', 'Pydantic', 'Pytest', 'Pylint'],
    featuresSource: 'code',
    features: [
      {
        pt: 'POST /people: cadastro de pessoa vinculada a um pet, com validação de nome (apenas letras) e idade mínima de 18 anos.',
        en: 'POST /people: registers a person linked to a pet, validating the name (letters only) and a minimum age of 18.',
      },
      { pt: 'GET /people/<id>: consulta de pessoa por ID.', en: 'GET /people/<id>: fetches a person by ID.' },
      { pt: 'GET /pets: listagem de pets.', en: 'GET /pets: lists pets.' },
      { pt: 'DELETE /pets/<name>: remoção de pet pelo nome.', en: 'DELETE /pets/<name>: removes a pet by name.' },
    ],
    technical: [
      {
        pt: 'Composers montam a cadeia repositório → controller → view, com injeção de dependências manual.',
        en: 'Composers wire the repository → controller → view chain with manual dependency injection.',
      },
      {
        pt: 'Interfaces abstratas para repositórios, controllers e views.',
        en: 'Abstract interfaces for repositories, controllers and views.',
      },
      {
        pt: 'Tratamento centralizado de erros HTTP com tipos próprios (400, 404, 422).',
        en: 'Centralized HTTP error handling with custom error types (400, 404, 422).',
      },
      {
        pt: 'Validação de payload com Pydantic.',
        en: 'Payload validation with Pydantic.',
      },
      {
        pt: 'Testes de repositório com mock-alchemy, simulando a sessão do SQLAlchemy sem banco real.',
        en: 'Repository tests with mock-alchemy, simulating the SQLAlchemy session without a real database.',
      },
      {
        pt: 'Pylint configurado como hook de pre-commit.',
        en: 'Pylint set up as a pre-commit hook.',
      },
    ],
    language: 'Python',
    repo: 'HeyArtic/PetShop',
    repoUrl: 'https://github.com/HeyArtic/PetShop',
    relatedCertificates: ['arquitetura-mvc', 'design-de-codigo'],
  },
  {
    id: 'delivery-api',
    name: 'Delivery Orders API',
    status: 'study',
    context: {
      pt: 'Formação Python · Rocketseat',
      en: 'Python program · Rocketseat',
    },
    summary: {
      pt: 'API de pedidos de delivery com Flask e MongoDB: registro, consulta por ID e atualização parcial, com validação de schema.',
      en: 'Delivery order API with Flask and MongoDB: create, fetch by ID and partial updates, with schema validation.',
    },
    goal: {
      pt: 'Aplicar um banco orientado a documentos em uma API organizada por casos de uso.',
      en: 'Use a document database in an API organized around use cases.',
    },
    problem: {
      pt: 'Pedidos têm estrutura variável (itens, endereço, cupom). O projeto armazena esses dados no MongoDB e valida a entrada antes de persistir.',
      en: 'Orders have a variable structure (items, address, coupon). The project stores them in MongoDB and validates input before saving.',
    },
    contributionShort: {
      pt: 'Implementação completa',
      en: 'Full implementation',
    },
    contribution: {
      pt: 'Implementei o projeto durante o módulo de NoSQL da formação, em 17 commits incrementais: repositório, casos de uso, validadores, rotas e testes.',
      en: 'I built the project during the NoSQL module of the program, across 17 incremental commits: repository, use cases, validators, routes and tests.',
    },
    tech: ['Python', 'Flask', 'MongoDB', 'PyMongo', 'Cerberus', 'Pytest'],
    featuresSource: 'code',
    features: [
      { pt: 'POST /delivery/order: registro de pedido com data de criação.', en: 'POST /delivery/order: creates an order with a creation timestamp.' },
      { pt: 'GET /delivery/order/<id>: consulta de pedido por ObjectId.', en: 'GET /delivery/order/<id>: fetches an order by ObjectId.' },
      { pt: 'PATCH /delivery/order/<id>: atualização parcial com $set.', en: 'PATCH /delivery/order/<id>: partial update using $set.' },
    ],
    technical: [
      {
        pt: 'Um caso de uso por operação (registro, consulta, atualização), cada um com seu composer.',
        en: 'One use case per operation (create, fetch, update), each with its own composer.',
      },
      {
        pt: 'Validação do corpo da requisição com Cerberus antes de persistir.',
        en: 'Request body validated with Cerberus before saving.',
      },
      {
        pt: 'Erros tipados (404, 422) convertidos em respostas HTTP por um error handler.',
        en: 'Typed errors (404, 422) turned into HTTP responses by an error handler.',
      },
      {
        pt: 'Repositório com interface e testes de validador, caso de uso (com repositório falso) e repositório.',
        en: 'Repository behind an interface, with tests for the validator, the use case (using a fake repository) and the repository.',
      },
    ],
    language: 'Python',
    repo: 'HeyArtic/mongodb',
    repoUrl: 'https://github.com/HeyArtic/mongodb',
    relatedCertificates: ['nosql-mongodb'],
  },
  {
    id: 'pix-payment-api',
    name: 'Pix Payment API',
    status: 'study',
    context: {
      pt: 'Formação Python · Rocketseat',
      en: 'Python program · Rocketseat',
    },
    summary: {
      pt: 'Simulação de pagamentos Pix: cobrança com QR Code e validade de 30 minutos, com confirmação notificada em tempo real via WebSocket.',
      en: 'Simulated Pix payments: a charge with a QR code and a 30-minute expiry, with confirmation pushed in real time over WebSocket.',
    },
    goal: {
      pt: 'Entender o fluxo de uma cobrança com prazo de validade e a notificação do cliente no momento da confirmação, sem recarregar a página.',
      en: 'Understand the flow of a charge with an expiry time, and notify the client the moment it is confirmed, without reloading the page.',
    },
    problem: {
      pt: 'A página de pagamento precisa saber quando a cobrança foi confirmada. Para isso, o servidor emite um evento Socket.IO ao confirmar.',
      en: 'The payment page needs to know when the charge is confirmed. To do that, the server emits a Socket.IO event on confirmation.',
    },
    contributionShort: {
      pt: 'Implementação completa',
      en: 'Full implementation',
    },
    contribution: {
      pt: 'Implementei a API durante o módulo de Flask da formação. Esta versão reorganiza em pacotes e blueprints a primeira versão, publicada no repositório APIPay.',
      en: 'I built the API during the Flask module of the program. This version restructures the first version (in the APIPay repository) into packages and blueprints.',
    },
    tech: ['Python', 'Flask', 'Flask-SQLAlchemy', 'Flask-SocketIO', 'SQLite', 'Jinja2'],
    featuresSource: 'code',
    features: [
      {
        pt: 'POST /payment/pix: cria a cobrança com validade de 30 minutos e gera o QR Code.',
        en: 'POST /payment/pix: creates the charge with a 30-minute expiry and generates the QR code.',
      },
      {
        pt: 'POST /payment/pix/confirmation: confirma o pagamento conferindo identificador e valor.',
        en: 'POST /payment/pix/confirmation: confirms the payment after checking the identifier and amount.',
      },
      {
        pt: 'GET /payment/pix/<id>: página de pagamento, de confirmação ou 404, renderizada com Jinja2.',
        en: 'GET /payment/pix/<id>: renders the payment, confirmation or 404 page with Jinja2.',
      },
      {
        pt: 'Evento Socket.IO payment-confirmed-<id> emitido na confirmação.',
        en: 'Socket.IO event payment-confirmed-<id> emitted on confirmation.',
      },
    ],
    technical: [
      {
        pt: 'Application factory com blueprints e configuração separada.',
        en: 'Application factory with blueprints and separate configuration.',
      },
      {
        pt: 'Modelos SQLAlchemy para pagamento (valor, status, expiração, QR Code).',
        en: 'SQLAlchemy models for payments (amount, status, expiry, QR code).',
      },
    ],
    notes: [
      {
        pt: 'O Pix é simulado: o QR Code contém um identificador gerado localmente e não há integração com instituição financeira.',
        en: 'Pix is simulated: the QR code holds a locally generated identifier, and there is no integration with a financial institution.',
      },
    ],
    language: 'HTML',
    repo: 'HeyArtic/APIPayment',
    repoUrl: 'https://github.com/HeyArtic/APIPayment',
    relatedCertificates: ['explorando-flask'],
  },
  {
    id: 'redis-cache',
    name: 'Redis Cache-Aside',
    status: 'in-progress',
    context: {
      pt: 'Formação Python · Rocketseat',
      en: 'Python program · Rocketseat',
    },
    summary: {
      pt: 'Consulta de produtos com o padrão cache-aside: busca primeiro no Redis e, se não encontrar, no SQLite, repovoando o cache.',
      en: 'Product lookup using the cache-aside pattern: Redis first, falling back to SQLite and repopulating the cache.',
    },
    goal: {
      pt: 'Praticar o uso do Redis como cache na frente de um banco relacional.',
      en: 'Practice using Redis as a cache in front of a relational database.',
    },
    problem: {
      pt: 'Evitar consultas repetidas ao banco para dados lidos com frequência, com expiração automática das chaves no cache.',
      en: 'Avoid repeated database queries for frequently read data, with cache keys that expire automatically.',
    },
    contributionShort: {
      pt: 'Implementação em andamento',
      en: 'Implementation in progress',
    },
    contribution: {
      pt: 'Implementei as conexões, os repositórios (Redis e SQLite) com interfaces e os casos de uso de criação e busca de produtos.',
      en: 'I implemented the connections, the Redis and SQLite repositories with interfaces, and the product creation and lookup use cases.',
    },
    tech: ['Python', 'Flask', 'Redis', 'SQLite'],
    featuresSource: 'code',
    features: [
      {
        pt: 'ProductFinder: busca no Redis → SQLite → grava no cache com expiração de 60 segundos.',
        en: 'ProductFinder: looks up Redis → SQLite → writes to the cache with a 60-second expiry.',
      },
      {
        pt: 'ProductCreator: grava o produto no SQLite e no cache.',
        en: 'ProductCreator: saves the product to SQLite and to the cache.',
      },
    ],
    technical: [
      {
        pt: 'Repositórios separados para Redis e SQLite, ambos atrás de interfaces.',
        en: 'Separate repositories for Redis and SQLite, both behind interfaces.',
      },
      {
        pt: 'Repositório Redis com operações de chave simples e de hash.',
        en: 'Redis repository with plain key and hash operations.',
      },
    ],
    notes: [
      {
        pt: 'Em desenvolvimento: os casos de uso estão implementados, mas as rotas HTTP ainda retornam respostas provisórias e não estão conectadas a eles.',
        en: 'In progress: the use cases are implemented, but the HTTP routes still return placeholder responses and are not wired to them yet.',
      },
    ],
    language: 'Python',
    repo: 'HeyArtic/redis-python',
    repoUrl: 'https://github.com/HeyArtic/redis-python',
    relatedCertificates: ['redis-python-flask'],
  },
  {
    id: 'rabbitmq-telegram',
    name: 'RabbitMQ → Telegram',
    status: 'study',
    context: {
      pt: 'Formação Python · Rocketseat',
      en: 'Python program · Rocketseat',
    },
    summary: {
      pt: 'Mensageria com RabbitMQ: um publisher envia mensagens para uma exchange, e um consumer as lê de uma fila durável e repassa a um chat do Telegram.',
      en: 'Messaging with RabbitMQ: a publisher sends messages to an exchange, and a consumer reads them from a durable queue and forwards them to a Telegram chat.',
    },
    goal: {
      pt: 'Praticar comunicação assíncrona entre processos com um message broker.',
      en: 'Practice asynchronous communication between processes through a message broker.',
    },
    problem: {
      pt: 'Desacoplar quem gera um evento de quem envia a notificação: o publisher não precisa conhecer o Telegram.',
      en: 'Decouple whoever produces an event from whoever sends the notification: the publisher does not need to know about Telegram.',
    },
    contributionShort: {
      pt: 'Implementação completa',
      en: 'Full implementation',
    },
    contribution: {
      pt: 'Implementei o publisher, o consumer, o callback de processamento e o driver de envio para a Bot API do Telegram.',
      en: 'I implemented the publisher, the consumer, the processing callback and the driver that sends messages through the Telegram Bot API.',
    },
    tech: ['Python', 'RabbitMQ', 'Pika', 'Telegram Bot API'],
    featuresSource: 'code',
    features: [
      {
        pt: 'Publisher com mensagens persistentes (delivery_mode=2) em JSON.',
        en: 'Publisher sending persistent JSON messages (delivery_mode=2).',
      },
      {
        pt: 'Consumer em fila durável, com callback que decodifica a mensagem e a envia ao Telegram.',
        en: 'Consumer on a durable queue, with a callback that decodes the message and sends it to Telegram.',
      },
    ],
    technical: [
      {
        pt: 'Token do bot e ID do chat lidos de variáveis de ambiente (.env), fora do código.',
        en: 'Bot token and chat ID read from environment variables (.env), kept out of the code.',
      },
      {
        pt: 'Driver de envio isolado em src/drivers, separado da configuração do RabbitMQ.',
        en: 'Sending driver isolated in src/drivers, separate from the RabbitMQ setup.',
      },
    ],
    notes: [
      {
        pt: 'O consumer usa confirmação automática (auto_ack): se o envio ao Telegram falhar, a mensagem não volta para a fila.',
        en: 'The consumer uses automatic acknowledgement (auto_ack): if sending to Telegram fails, the message is not requeued.',
      },
    ],
    language: 'Python',
    repo: 'HeyArtic/rabbitmq-telegram',
    repoUrl: 'https://github.com/HeyArtic/rabbitmq-telegram',
    relatedCertificates: ['rabbitmq-python'],
  },
];

/** Repositórios públicos que não viram card, mas aparecem em uma lista compacta. */
export interface OtherRepo {
  name: string;
  repo: string;
  url: string;
  language?: string;
  note: Localized;
}

export const otherRepos: OtherRepo[] = [
  {
    name: 'LoginAPI',
    repo: 'HeyArtic/LoginAPI',
    url: 'https://github.com/HeyArtic/LoginAPI',
    language: 'Python',
    note: {
      pt: 'Autenticação com Flask-Login, hash de senha (Werkzeug) e papéis user/admin.',
      en: 'Authentication with Flask-Login, password hashing (Werkzeug) and user/admin roles.',
    },
  },
  {
    name: 'Finance',
    repo: 'HeyArtic/Finance',
    url: 'https://github.com/HeyArtic/Finance',
    language: 'Python',
    note: {
      pt: 'Em desenvolvimento: finanças pessoais com repositórios SQL, controllers e JWT; ainda sem servidor HTTP.',
      en: 'In progress: personal finance with SQL repositories, controllers and JWT; no HTTP server yet.',
    },
  },
  {
    name: 'APIPay',
    repo: 'HeyArtic/APIPay',
    url: 'https://github.com/HeyArtic/APIPay',
    language: 'HTML',
    note: {
      pt: 'Primeira versão da API de pagamentos Pix, depois reorganizada no APIPayment.',
      en: 'First version of the Pix payment API, later restructured as APIPayment.',
    },
  },
  {
    name: 'agents',
    repo: 'HeyArtic/agents',
    url: 'https://github.com/HeyArtic/agents',
    language: 'TypeScript',
    note: {
      pt: 'Aplicação do evento NLW Agents (Rocketseat): Fastify, Drizzle, PostgreSQL com pgvector em Docker e Gemini.',
      en: 'App from the NLW Agents event (Rocketseat): Fastify, Drizzle, PostgreSQL with pgvector in Docker, and Gemini.',
    },
  },
];
