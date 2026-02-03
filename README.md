# Rick and Morty Catalog

Uma aplicacao full-stack para explorar e favoritar personagens do universo Rick and Morty.

![Rick and Morty](https://rickandmortyapi.com/api/character/avatar/1.jpeg)

---

## Indice

- [Sobre o Projeto](#sobre-o-projeto)
- [Tecnologias](#tecnologias)
- [Arquitetura](#arquitetura)
- [Pre-requisitos](#pre-requisitos)
- [Como Rodar o Projeto](#como-rodar-o-projeto)
  - [Opcao 1: Docker (Recomendado)](#opcao-1-docker-recomendado)
  - [Opcao 2: Desenvolvimento Local](#opcao-2-desenvolvimento-local)
- [Testando a Aplicacao](#testando-a-aplicacao)
- [Endpoints da API](#endpoints-da-api)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Funcionalidades](#funcionalidades)
- [Decisoes Tecnicas](#decisoes-tecnicas)
- [Melhorias Futuras](#melhorias-futuras)

---

## Sobre o Projeto

Este projeto e um catalogo de personagens do Rick and Morty que permite:
- Navegar por 800+ personagens com paginacao
- Buscar personagens por nome
- Filtrar por status (Alive, Dead, Unknown)
- Favoritar personagens para acesso rapido
- Visualizar lista de favoritos

---

## Tecnologias

### Frontend
| Tecnologia | Versao | Descricao |
|------------|--------|-----------|
| React | 19.x | Biblioteca UI |
| TypeScript | 5.x | Tipagem estatica |
| Vite | 7.x | Build tool |
| Tailwind CSS | 4.x | Framework CSS |
| TanStack Query | 5.x | Gerenciamento de estado server |
| React Router | 7.x | Roteamento |
| Axios | 1.x | Cliente HTTP |

### Backend
| Tecnologia | Versao | Descricao |
|------------|--------|-----------|
| Node.js | 20.x | Runtime JavaScript |
| Express | 4.x | Framework HTTP |
| TypeScript | 5.x | Tipagem estatica |
| MongoDB | 7.x | Banco de dados |
| Mongoose | 8.x | ODM MongoDB |
| Zod | 3.x | Validacao de schemas |
| Pino | 8.x | Logger |
| Swagger | 6.x | Documentacao API |

### Infraestrutura
| Tecnologia | Descricao |
|------------|-----------|
| Docker | Containerizacao |
| Docker Compose | Orquestracao de containers |
| Nginx | Servidor web e proxy reverso |

---

## Arquitetura

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │     │                 │
│   Frontend      │────▶│    Backend      │────▶│    MongoDB      │
│   (React+Nginx) │     │   (Express.js)  │     │                 │
│   Port: 80      │     │   Port: 3000    │     │   Port: 27017   │
│                 │     │        │        │     │                 │
└─────────────────┘     └────────┼────────┘     └─────────────────┘
                                 │
                                 ▼
                        ┌─────────────────┐
                        │ Rick & Morty    │
                        │ Public API      │
                        └─────────────────┘
```

### Fluxo de Dados
1. Usuario acessa o frontend (React)
2. Frontend faz requisicoes para o backend via `/api/*`
3. Backend consulta a API publica do Rick and Morty (com cache de 60s)
4. Favoritos sao armazenados no MongoDB
5. Nginx serve o frontend e faz proxy para o backend

---

## Pre-requisitos

### Para rodar com Docker (Recomendado)
- [Docker](https://docs.docker.com/get-docker/) (versao 20.x ou superior)
- [Docker Compose](https://docs.docker.com/compose/install/) (versao 2.x ou superior)

### Para desenvolvimento local
- [Node.js](https://nodejs.org/) (versao 20.x ou superior)
- [pnpm](https://pnpm.io/installation) (versao 8.x ou superior)
- [Docker](https://docs.docker.com/get-docker/) (apenas para o MongoDB)

### Verificar instalacao

```bash
# Verificar Docker
docker --version
# Docker version 24.0.0 ou superior

# Verificar Docker Compose
docker compose version
# Docker Compose version v2.20.0 ou superior

# Verificar Node.js (apenas para dev local)
node --version
# v20.0.0 ou superior

# Verificar pnpm (apenas para dev local)
pnpm --version
# 8.0.0 ou superior
```

---

## Como Rodar o Projeto

### Opcao 1: Docker (Recomendado)

Esta e a forma mais simples de rodar o projeto completo.

#### Passo 1: Clonar o repositorio

```bash
git clone https://github.com/wallysom2/rick-and-morty.git
cd rick-and-morty
```

#### Passo 2: Subir os containers

```bash
docker compose up --build
```

> **Nota:** O primeiro build pode demorar alguns minutos para baixar as imagens e instalar dependencias.

#### Passo 3: Aguardar os servicos iniciarem

Voce vera logs similares a:

```
rick-mongodb   | {"t":"...","msg":"Waiting for connections","port":27017}
rick-backend   | [INFO] Server running on http://localhost:3000
rick-frontend  | nginx: ready
```

#### Passo 4: Acessar a aplicacao

| Servico | URL |
|---------|-----|
| Frontend | http://localhost |
| Backend API | http://localhost:3000/api |
| Swagger Docs | http://localhost:3000/api/docs |
| Health Check | http://localhost:3000/api/health |

#### Passo 5: Parar os containers

```bash
# Parar (mantem os dados)
docker compose down

# Parar e remover volumes (limpa os dados)
docker compose down -v
```

---

### Opcao 2: Desenvolvimento Local

Use esta opcao para desenvolver e fazer alteracoes no codigo.

#### Passo 1: Clonar o repositorio

```bash
git clone https://github.com/wallysom2/rick-and-morty.git
cd rick-and-morty
```

#### Passo 2: Subir o MongoDB com Docker

```bash
docker compose -f docker-compose.dev.yml up -d
```

Verifique se esta rodando:
```bash
docker ps
# Deve mostrar: rick-mongo-dev rodando na porta 27017
```

#### Passo 3: Configurar e rodar o Backend

```bash
# Entrar na pasta do backend
cd backend

# Copiar arquivo de ambiente
cp .env.example .env

# Instalar dependencias
pnpm install

# Rodar em modo desenvolvimento
pnpm run dev
```

Voce vera:
```
[INFO] Server running on http://localhost:3000
[INFO] API docs available at http://localhost:3000/api/docs
[INFO] Connected to MongoDB
```

#### Passo 4: Configurar e rodar o Frontend

Abra um **novo terminal** e execute:

```bash
# Entrar na pasta do frontend
cd frontend

# Instalar dependencias
pnpm install

# Rodar em modo desenvolvimento
pnpm run dev
```

Voce vera:
```
  VITE v7.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: http://xxx.xxx.xxx.xxx:5173/
```

#### Passo 5: Acessar a aplicacao

| Servico | URL |
|---------|-----|
| Frontend | http://localhost:5173 |
| Backend API | http://localhost:3000/api |
| Swagger Docs | http://localhost:3000/api/docs |

#### Passo 6: Parar os servicos

```bash
# Parar o frontend: Ctrl+C no terminal do frontend
# Parar o backend: Ctrl+C no terminal do backend

# Parar o MongoDB
docker compose -f docker-compose.dev.yml down
```

---

## Testando a Aplicacao

### Testes Automatizados do Backend

```bash
cd backend

# Rodar todos os testes
pnpm test

# Rodar com watch mode
pnpm test:watch

# Rodar com coverage
pnpm test:coverage
```

Resultado esperado:
```
✓ tests/favorites.test.ts (16 tests) 
 Test Files  1 passed (1)
      Tests  16 passed (16)
```

### Testando a API manualmente

```bash
# Health check
curl http://localhost:3000/api/health

# Listar personagens
curl http://localhost:3000/api/characters

# Buscar por nome
curl "http://localhost:3000/api/characters?name=rick"

# Filtrar por status
curl "http://localhost:3000/api/characters?status=Alive"

# Adicionar favorito
curl -X POST http://localhost:3000/api/favorites \
  -H "Content-Type: application/json" \
  -d '{"characterId": 1}'

# Listar favoritos
curl http://localhost:3000/api/favorites

# Listar IDs dos favoritos
curl http://localhost:3000/api/favorites/ids

# Remover favorito
curl -X DELETE http://localhost:3000/api/favorites/1
```

---

## Endpoints da API

### Characters

| Metodo | Endpoint | Descricao |
|--------|----------|-----------|
| GET | `/api/characters` | Lista personagens (paginado) |
| GET | `/api/characters/:id` | Busca personagem por ID |

**Query Parameters:**
| Parametro | Tipo | Descricao |
|-----------|------|-----------|
| `page` | number | Numero da pagina (default: 1) |
| `name` | string | Filtrar por nome |
| `status` | string | Filtrar por status: `Alive`, `Dead`, `unknown` |
| `species` | string | Filtrar por especie |
| `gender` | string | Filtrar por genero |

**Exemplo de resposta:**
```json
{
  "info": {
    "count": 826,
    "pages": 42,
    "next": "https://...",
    "prev": null
  },
  "results": [
    {
      "id": 1,
      "name": "Rick Sanchez",
      "status": "Alive",
      "species": "Human",
      "image": "https://rickandmortyapi.com/api/character/avatar/1.jpeg"
    }
  ]
}
```

### Favorites

| Metodo | Endpoint | Descricao |
|--------|----------|-----------|
| GET | `/api/favorites` | Lista favoritos (paginado) |
| GET | `/api/favorites/ids` | Retorna apenas IDs dos favoritos |
| POST | `/api/favorites` | Adiciona favorito |
| DELETE | `/api/favorites/:characterId` | Remove favorito |

**POST /api/favorites - Body:**
```json
{
  "characterId": 1
}
```

**Exemplo de resposta:**
```json
{
  "_id": "...",
  "characterId": 1,
  "name": "Rick Sanchez",
  "image": "https://...",
  "species": "Human",
  "status": "Alive",
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

### Health

| Metodo | Endpoint | Descricao |
|--------|----------|-----------|
| GET | `/api/health` | Health check do servidor |

---

## Estrutura do Projeto

```
rick-and-morty/
├── docker-compose.yml          # Producao: frontend + backend + mongodb
├── docker-compose.dev.yml      # Desenvolvimento: apenas mongodb
├── .env.example                # Template de variaveis de ambiente
├── README.md                   # Documentacao
│
├── backend/
│   ├── Dockerfile              # Build multi-stage
│   ├── .dockerignore
│   ├── package.json
│   ├── tsconfig.json
│   ├── vitest.config.ts
│   ├── src/
│   │   ├── index.ts            # Entry point
│   │   ├── app.ts              # Express app setup
│   │   ├── config/
│   │   │   ├── env.ts          # Validacao de env com Zod
│   │   │   ├── database.ts     # Conexao MongoDB
│   │   │   └── swagger.ts      # Configuracao Swagger
│   │   ├── controllers/        # Handlers das requisicoes
│   │   ├── middlewares/        # Error handler, request logger
│   │   ├── models/             # Schemas Mongoose
│   │   ├── repositories/       # Camada de acesso a dados
│   │   ├── routes/             # Definicao de rotas
│   │   ├── services/           # Logica de negocio
│   │   ├── types/              # TypeScript types
│   │   └── utils/              # Cache, logger
│   └── tests/                  # Testes de integracao
│
└── frontend/
    ├── Dockerfile              # Build multi-stage + nginx
    ├── .dockerignore
    ├── nginx.conf              # Configuracao do nginx
    ├── package.json
    ├── vite.config.ts
    ├── tailwind.config.js
    └── src/
        ├── main.tsx            # Entry point
        ├── App.tsx             # Componente principal
        ├── components/         # Componentes reutilizaveis
        │   ├── Header.tsx
        │   ├── CharacterCard.tsx
        │   ├── CharacterList.tsx
        │   ├── FavoriteButton.tsx
        │   ├── SearchBar.tsx
        │   ├── StatusFilter.tsx
        │   ├── Pagination.tsx
        │   └── SkeletonCard.tsx
        ├── hooks/              # Custom hooks
        │   ├── useCharacters.ts
        │   ├── useFavorites.ts
        │   └── useDebounce.ts
        ├── pages/              # Paginas
        │   ├── HomePage.tsx
        │   └── FavoritesPage.tsx
        ├── services/           # API client
        │   └── api.ts
        └── types/              # TypeScript types
```

---

## Funcionalidades

### Frontend
- **Listagem de Personagens** - Grid responsivo com 800+ personagens
- **Busca por Nome** - Com debounce de 300ms para otimizar requisicoes
- **Filtro por Status** - Alive, Dead ou Unknown
- **Paginacao** - Com prefetch da proxima pagina ao hover
- **Favoritar** - Adicionar/remover personagens dos favoritos
- **Pagina de Favoritos** - Lista dedicada com ordenacao
- **Skeleton Loading** - Animacao de carregamento
- **Toast Notifications** - Feedback visual das acoes
- **Responsivo** - Funciona em mobile e desktop

### Backend
- **API RESTful** - Endpoints bem definidos
- **Proxy para API Externa** - Cache de 60s para otimizar
- **CRUD de Favoritos** - Create, Read, Delete
- **Idempotencia** - Favoritar 2x nao duplica
- **Validacao** - Schemas Zod para entrada de dados
- **Logs Estruturados** - Request ID tracking
- **Documentacao** - Swagger UI em `/api/docs`
- **Health Check** - Endpoint para monitoramento

---

## Decisoes Tecnicas

### Por que essas tecnologias?

| Escolha | Motivo |
|---------|--------|
| **pnpm** | Mais rapido e eficiente que npm/yarn |
| **Vite** | Build mais rapido que CRA, melhor DX |
| **Tailwind CSS** | Produtividade, utility-first, facil manutencao |
| **TanStack Query** | Cache automatico, loading states, retry |
| **Zod** | Validacao type-safe, boa integracao com TS |
| **Pino** | Logger mais performatico para Node.js |
| **Mongoose** | ODM maduro, bom suporte a TypeScript |

### Arquitetura do Backend

```
Request → Routes → Controllers → Services → Repositories → Database
                                    ↓
                              External API (Rick & Morty)
```

- **Routes**: Define endpoints e middlewares
- **Controllers**: Valida entrada, chama services, formata resposta
- **Services**: Logica de negocio, orquestra repositories
- **Repositories**: Acesso direto ao banco de dados

### Cache Strategy

- API do Rick & Morty: Cache in-memory de 60 segundos
- React Query: staleTime de 1 minuto, refetch em background
- Prefetch: Proxima pagina pre-carregada ao hover no "Next"

---

## Variaveis de Ambiente

### Backend (backend/.env)

| Variavel | Descricao | Default |
|----------|-----------|---------|
| `PORT` | Porta do servidor | `3000` |
| `MONGO_URL` | String de conexao MongoDB | `mongodb://localhost:27017/rickandmorty` |
| `CORS_ORIGIN` | Origem permitida para CORS | `http://localhost:5173` |
| `LOG_LEVEL` | Nivel de log | `info` |
| `NODE_ENV` | Ambiente | `development` |

### Frontend

| Variavel | Descricao | Default |
|----------|-----------|---------|
| `VITE_API_URL` | URL da API backend | `http://localhost:3000/api` |

---

## Melhorias Futuras

- [ ] Autenticacao de usuarios
- [ ] Exportar favoritos (JSON/CSV)
- [ ] Modal com detalhes do personagem
- [ ] Paginas de episodios e localizacoes
- [ ] Scroll infinito como opcao
- [ ] PWA com suporte offline
- [ ] Testes E2E com Playwright
- [ ] CI/CD com GitHub Actions
- [ ] Rate limiting no backend
- [ ] Redis para cache distribuido

---

## Troubleshooting

### Porta 80 ja em uso

```bash
# Verificar o que esta usando a porta
netstat -ano | findstr :80

# Ou altere a porta no docker-compose.yml
ports:
  - "8080:80"  # Acesse em http://localhost:8080
```

### MongoDB nao conecta

```bash
# Verificar se o container esta rodando
docker ps

# Ver logs do MongoDB
docker logs rick-mongodb

# Reiniciar o container
docker compose restart mongodb
```

### Erro de permissao no Docker

```bash
# Linux/Mac: adicionar usuario ao grupo docker
sudo usermod -aG docker $USER
# Fazer logout e login novamente
```

### Limpar tudo e comecar do zero

```bash
# Parar e remover containers, volumes e images
docker compose down -v --rmi all

# Rebuild completo
docker compose up --build
```

---

## Licenca

MIT

---

Desenvolvido para o desafio tecnico Elephan
