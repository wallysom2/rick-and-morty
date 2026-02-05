# ⚙️ Rick and Morty - Backend

API RESTful para gerenciar o catálogo de personagens da série Rick and Morty.

---

## 📋 Índice

- [Tecnologias](#-tecnologias)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Configuração](#-configuração)
- [Scripts](#-scripts)
- [API Endpoints](#-api-endpoints)
- [Arquitetura](#-arquitetura)
- [Testes](#-testes)

---

## 🛠️ Tecnologias

| Tecnologia | Versão | Descrição |
|------------|--------|-----------|
| **Node.js** | >= 18.0.0 | Runtime JavaScript |
| **Express** | 4.18.2 | Framework web |
| **TypeScript** | 5.3.3 | Tipagem estática |
| **MongoDB** | - | Banco de dados NoSQL |
| **Mongoose** | 8.0.3 | ODM para MongoDB |
| **Zod** | 3.22.4 | Validação de schemas |
| **Pino** | 8.17.2 | Logger de alta performance |
| **OpenAI** | 4.x | API de chat com IA (opcional) |
| **Swagger** | 6.2.8 | Documentação da API |
| **Vitest** | 1.1.3 | Framework de testes |

---

## 📁 Estrutura do Projeto

```
backend/
├── 📂 src/
│   ├── 📂 config/          # Configurações
│   │   ├── database.ts     # Conexão MongoDB
│   │   ├── env.ts          # Variáveis de ambiente
│   │   └── swagger.ts      # Configuração Swagger
│   │
│   ├── 📂 controllers/     # Controladores HTTP
│   │   ├── characters.controller.ts
│   │   ├── favorites.controller.ts
│   │   ├── episodes.controller.ts
│   │   ├── locations.controller.ts
│   │   ├── chat.controller.ts
│   │   └── health.controller.ts
│   │
│   ├── 📂 docs/            # Documentação OpenAPI
│   │   └── api.yaml
│   │
│   ├── 📂 middlewares/     # Middlewares Express
│   │   ├── error.middleware.ts
│   │   └── requestId.middleware.ts
│   │
│   ├── 📂 models/          # Modelos Mongoose
│   │   └── favorite.model.ts
│   │
│   ├── 📂 repositories/    # Camada de acesso a dados
│   │   └── favorites.repository.ts
│   │
│   ├── 📂 routes/          # Definição de rotas
│   │   ├── characters.routes.ts
│   │   ├── favorites.routes.ts
│   │   ├── episodes.routes.ts
│   │   ├── locations.routes.ts
│   │   ├── chat.routes.ts
│   │   ├── health.routes.ts
│   │   └── index.ts
│   │
│   ├── 📂 services/        # Lógica de negócio
│   │   ├── rickandmorty.service.ts
│   │   ├── favorites.service.ts
│   │   └── chat.service.ts
│   │
│   ├── 📂 types/           # Definições TypeScript
│   │   └── index.ts
│   │
│   ├── 📂 utils/           # Utilitários
│   │   ├── cache.ts
│   │   └── logger.ts
│   │
│   ├── 📄 app.ts           # Configuração do Express
│   └── 📄 index.ts         # Entry point
│
├── 📂 tests/               # Testes automatizados
│   ├── characters.test.ts
│   ├── favorites.test.ts
│   └── setup.ts
│
├── 📄 Dockerfile           # Configuração Docker
├── 📄 tsconfig.json        # Configuração TypeScript
├── 📄 vitest.config.ts     # Configuração Vitest
├── 📄 package.json         # Dependências e scripts
└── 📄 README.md            # Este arquivo
```

---

## ⚙️ Configuração

### Variáveis de Ambiente

Crie um arquivo `.env` na pasta `backend/` baseado no `.env.example`:

```env
# Servidor
PORT=3000
NODE_ENV=development

# MongoDB
MONGO_URL=mongodb://localhost:27017/rickandmorty

# CORS
CORS_ORIGIN=http://localhost:5173

# Logs
LOG_LEVEL=debug

# OpenAI API Key (optional - only required for chat feature)
# Get your key at: https://platform.openai.com/api-keys
# Leave empty or remove to run without chat functionality
OPENAI_API_KEY=your_openai_api_key_here
```

### Instalação

```bash
# Na raiz do monorepo
pnpm install

# Ou apenas o backend
cd backend
pnpm install
```

---

## 📜 Scripts

Execute a partir da pasta `backend/`:

| Script | Comando | Descrição |
|--------|---------|-----------|
| **Dev** | `pnpm dev` | Inicia com hot-reload (tsx) |
| **Build** | `pnpm build` | Compila TypeScript |
| **Start** | `pnpm start` | Executa build de produção |
| **Test** | `pnpm test` | Executa testes |
| **Test Watch** | `pnpm test:watch` | Testes em modo watch |
| **Test Coverage** | `pnpm test:coverage` | Relatório de cobertura |
| **Lint** | `pnpm lint` | Verifica erros de linting |
| **Lint Fix** | `pnpm lint:fix` | Corrige erros automaticamente |

### Executando

```bash
# Desenvolvimento (porta 3000)
pnpm dev

# Produção
pnpm build
pnpm start
```

---

## 🌐 API Endpoints

### Base URL

```
http://localhost:3000/api
```

### Documentação Swagger

Acesse a documentação interativa em:

```
http://localhost:3000/api/docs
```

### Endpoints Disponíveis

#### Health Check

| Método | Rota | Descrição |
|--------|------|-----------|
| `GET` | `/api/health` | Verifica status da API |

#### Personagens (Characters)

| Método | Rota | Descrição |
|--------|------|-----------|
| `GET` | `/api/characters` | Lista personagens com filtros |
| `GET` | `/api/characters/:id` | Busca por ID único ou múltiplos (IDs separados por vírgula) |

**Filtros disponíveis**: `name`, `status`, `species`, `gender`, `page`

#### Favoritos (Favorites)

| Método | Rota | Descrição |
|--------|------|-----------|
| `GET` | `/api/favorites` | Lista todos os favoritos com paginação |
| `GET` | `/api/favorites/ids` | Retorna apenas IDs dos favoritos |
| `GET` | `/api/favorites/check/:characterId` | Verifica se personagem está favoritado |
| `POST` | `/api/favorites` | Adiciona personagem aos favoritos |
| `DELETE` | `/api/favorites/:characterId` | Remove personagem dos favoritos |

**Parâmetros de paginação**: `page`, `limit`, `search`, `sortBy`, `order`

#### Episódios (Episodes)

| Método | Rota | Descrição |
|--------|------|-----------|
| `GET` | `/api/episodes` | Lista episódios com filtros |
| `GET` | `/api/episodes/:id` | Busca por ID único ou múltiplos |

**Filtros disponíveis**: `name`, `episode`, `page`

#### Localizações (Locations)

| Método | Rota | Descrição |
|--------|------|-----------|
| `GET` | `/api/locations` | Lista localizações com filtros |
| `GET` | `/api/locations/:id` | Busca por ID único ou múltiplos |

**Filtros disponíveis**: `name`, `type`, `dimension`, `page`

#### Chat com IA (Chat)

| Método | Rota | Descrição |
|--------|------|-----------|
| `POST` | `/api/chat` | Conversa com Rick ou Morty usando IA |

**Importante**: Requer `OPENAI_API_KEY` configurada no `.env`

**Exemplo de requisição**:
```json
{
  "message": "Quem é você?",
  "character": "rick",
  "history": [
    { "role": "user", "content": "Oi!" },
    { "role": "assistant", "content": "*arroto* Oi, eu sou o Rick!" }
  ]
}
```

**Personagens disponíveis**: `rick` (cínico e genial) ou `morty` (nervoso e ansioso)

### Exemplo de Requisição

```bash
# Listar personagens
curl http://localhost:3000/api/characters

# Buscar por ID
curl http://localhost:3000/api/characters/1

# Buscar múltiplos personagens
curl http://localhost:3000/api/characters/1,2,3

# Filtrar personagens
curl "http://localhost:3000/api/characters?name=rick&status=alive"

# Adicionar aos favoritos
curl -X POST http://localhost:3000/api/favorites \
  -H "Content-Type: application/json" \
  -d '{"characterId": 1}'

# Chat com Rick
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Oi Rick!", "character": "rick"}'
```

### Exemplo de Resposta

```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Rick Sanchez",
    "status": "Alive",
    "species": "Human",
    "type": "",
    "gender": "Male",
    "origin": {
      "name": "Earth (C-137)",
      "url": "..."
    },
    "location": {
      "name": "Citadel of Ricks",
      "url": "..."
    },
    "image": "https://rickandmortyapi.com/api/character/avatar/1.jpeg",
    "episode": ["..."],
    "created": "2017-11-04T18:48:46.250Z"
  }
}
```

---

## 🏗️ Arquitetura

O backend segue uma arquitetura em camadas:

```
Request → Routes → Controllers → Services → Repositories → Database
                                    ↓
                              External APIs
                          (Rick & Morty API, OpenAI)
```

### Camadas

| Camada | Responsabilidade |
|--------|------------------|
| **Routes** | Definição de rotas e middlewares |
| **Controllers** | Tratamento de requisições HTTP |
| **Services** | Lógica de negócio e integração com APIs externas |
| **Repositories** | Acesso ao banco de dados MongoDB |
| **Models** | Schemas do Mongoose |

### Recursos Principais

- **Rick and Morty API Integration**: Integração completa com a API oficial
- **Favorites System**: Gerenciamento de favoritos com MongoDB
- **AI-Powered Chat**: Chat interativo com Rick e Morty usando OpenAI GPT
- **Caching**: Cache em memória para otimizar chamadas à API externa
- **Swagger Documentation**: Documentação interativa completa da API
- **Error Handling**: Tratamento centralizado de erros
- **Validation**: Validação de entrada com Zod

### Padrões Utilizados

- **Repository Pattern**: Abstração do acesso a dados
- **Service Layer**: Encapsulamento da lógica de negócio
- **Singleton Pattern**: Para serviços e controllers
- **Error Handling**: Tratamento centralizado de erros
- **Input Validation**: Validação com Zod

---

## 🧪 Testes

### Executando Testes

```bash
# Rodar todos os testes
pnpm test

# Modo watch
pnpm test:watch

# Com cobertura
pnpm test:coverage
```

### Estrutura de Testes

```
tests/
├── setup.ts              # Configuração inicial
├── character.test.ts     # Testes de personagens
└── integration/          # Testes de integração
```

### MongoDB em Memória

Os testes utilizam `mongodb-memory-server` para simular o banco de dados, garantindo isolamento e velocidade.

---

## 🔧 Configurações

### TypeScript (`tsconfig.json`)

- Target: ES2022
- Module: NodeNext
- Strict mode habilitado
- Path aliases configurados

### ESLint

- TypeScript ESLint
- Regras recomendadas
- Prettier integration

---

## 🚀 Deploy

### Build de Produção

```bash
pnpm build
```

Os arquivos serão gerados em `dist/`.

### Docker

O backend inclui um `Dockerfile` otimizado:

```bash
docker build -t rick-backend .
docker run -p 3000:3000 rick-backend
```

### Variáveis de Produção

```env
NODE_ENV=production
PORT=3000
MONGO_URL=mongodb://mongodb:27017/rickandmorty
CORS_ORIGIN=https://seu-dominio.com
LOG_LEVEL=info
```

---

## 📚 Recursos Adicionais

- [Documentação do Express](https://expressjs.com/)
- [Documentação do Mongoose](https://mongoosejs.com/)
- [Documentação do Zod](https://zod.dev/)
- [Rick and Morty API](https://rickandmortyapi.com/)

---

<div align="center">
  <sub>⬅️ <a href="../README.md">Voltar para o README principal</a></sub>
</div>
