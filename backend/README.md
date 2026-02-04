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
│   │   └── logger.ts       # Configuração do Pino
│   │
│   ├── 📂 controllers/     # Controladores HTTP
│   │   ├── character.controller.ts
│   │   └── health.controller.ts
│   │
│   ├── 📂 docs/            # Configuração Swagger
│   │   └── swagger.ts
│   │
│   ├── 📂 middlewares/     # Middlewares Express
│   │   ├── error.middleware.ts
│   │   └── validation.middleware.ts
│   │
│   ├── 📂 models/          # Modelos Mongoose
│   │   └── character.model.ts
│   │
│   ├── 📂 repositories/    # Camada de acesso a dados
│   │   └── character.repository.ts
│   │
│   ├── 📂 routes/          # Definição de rotas
│   │   ├── character.routes.ts
│   │   ├── health.routes.ts
│   │   └── index.ts
│   │
│   ├── 📂 services/        # Lógica de negócio
│   │   ├── character.service.ts
│   │   └── rickandmorty.service.ts
│   │
│   ├── 📂 types/           # Definições TypeScript
│   │   └── character.types.ts
│   │
│   ├── 📂 utils/           # Utilitários
│   │   ├── api-error.ts
│   │   └── response.ts
│   │
│   ├── 📄 app.ts           # Configuração do Express
│   └── 📄 index.ts         # Entry point
│
├── 📂 tests/               # Testes automatizados
│   ├── character.test.ts
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

#### Personagens

| Método | Rota | Descrição |
|--------|------|-----------|
| `GET` | `/api/characters` | Lista todos os personagens |
| `GET` | `/api/characters/:id` | Busca personagem por ID |
| `POST` | `/api/characters` | Cria novo personagem |
| `PUT` | `/api/characters/:id` | Atualiza personagem |
| `DELETE` | `/api/characters/:id` | Remove personagem |
| `GET` | `/api/characters/search` | Pesquisa personagens |
| `POST` | `/api/characters/sync` | Sincroniza com API externa |

### Exemplo de Requisição

```bash
# Listar personagens
curl http://localhost:3000/api/characters

# Buscar por ID
curl http://localhost:3000/api/characters/1

# Pesquisar
curl "http://localhost:3000/api/characters/search?name=rick&status=alive"
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
                              External API
```

### Camadas

| Camada | Responsabilidade |
|--------|------------------|
| **Routes** | Definição de rotas e middlewares |
| **Controllers** | Tratamento de requisições HTTP |
| **Services** | Lógica de negócio |
| **Repositories** | Acesso ao banco de dados |
| **Models** | Schemas do Mongoose |

### Padrões Utilizados

- **Repository Pattern**: Abstração do acesso a dados
- **Service Layer**: Encapsulamento da lógica de negócio
- **Error Handling**: Tratamento centralizado de erros
- **Validation**: Validação com Zod

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
