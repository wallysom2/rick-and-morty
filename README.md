# 🛸 Rick and Morty Character Catalog

![Rick and Morty](https://rickandmortyapi.com/api/character/avatar/1.jpeg)

Um catálogo interativo de personagens da série Rick and Morty, construído como um **monorepo** com frontend React e backend Node.js.

**✨ Recursos principais:**
- 🎬 Navegação completa de personagens, episódios e localizações
- ⭐ Sistema de favoritos persistente
- 🤖 Chat interativo com Rick e Morty usando IA (OpenAI GPT)
- 📚 Documentação completa da API com Swagger
- 🐳 Suporte completo a Docker
- 🔎 Testes unitários

---

## 📋 Índice

- [Requisitos](#-requisitos)
- [Instalação Rápida](#-instalação-rápida)
- [Executando o Projeto](#-executando-o-projeto)
- [Docker](#-docker)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Scripts Disponíveis](#-scripts-disponíveis)

---

## 🔧 Requisitos

Antes de começar, certifique-se de ter instalado:

| Ferramenta | Versão Mínima |
|------------|---------------|
| **Node.js** | >= 18.0.0 |
| **pnpm** | >= 8.0.0 |
| **Docker** | >= 20.0 (opcional) |
| **Docker Compose** | >= 2.0 (opcional) |

### Instalando o pnpm

Se você ainda não tem o pnpm instalado:

```bash
npm install -g pnpm
```

---

## 🚀 Instalação Rápida

### 1. Clone o repositório

```bash
git clone https://github.com/seu-usuario/rick-and-morty.git
cd rick-and-morty
```

### 2. Configure as variáveis de ambiente

```bash
# Na raiz do projeto
cp .env.example .env

# No backend
cp backend/.env.example backend/.env

# No frontend
cp frontend/.env.example frontend/.env
```

**Importante para funcionalidade de chat:**
- A funcionalidade de chat com IA é **opcional**
- Para habilitá-la, configure `OPENAI_API_KEY` no `backend/.env`
- Obtenha sua chave em: https://platform.openai.com/api-keys
- O projeto funciona normalmente sem a chave (chat ficará desabilitado)
- É possível testar essa funcionalidade atraves do link de deploy

### 3. Instale as dependências na raiz do projeto

```bash
pnpm install
```

Este comando instalará as dependências de todos os workspaces (frontend e backend).

---

## ▶️ Executando o Projeto

### Desenvolvimento Local

#### Opção 1: Executar tudo junto

```bash
pnpm dev
```

Este comando inicia o frontend e o backend simultaneamente.

#### Opção 2: Executar separadamente

```bash
# Apenas o Frontend (porta 5173)
pnpm dev:frontend

# Apenas o Backend (porta 3000)
pnpm dev:backend
```

### URLs de Acesso

| Serviço | URL |
|---------|-----|
| **Frontend** | http://localhost:5173 |
| **Backend API** | http://localhost:3000 |
| **API Docs (Swagger)** | http://localhost:3000/api/docs |

---

## 🐳 Docker

### Executar com Docker Compose (Produção)

Este método levanta todos os serviços: MongoDB, Backend e Frontend.

```bash
# Construir e iniciar todos os containers
docker-compose up -d --build

# Ver logs
docker-compose logs -f

# Parar todos os serviços
docker-compose down
```

### URLs com Docker

| Serviço | URL |
|---------|-----|
| **Frontend** | http://localhost |
| **Backend API** | http://localhost:3000 |
| **MongoDB** | localhost:27017 |

### Desenvolvimento com Docker (Apenas MongoDB)

Para desenvolvimento local, você pode usar apenas o MongoDB via Docker:

```bash
docker-compose -f docker-compose.dev.yml up -d
```

---

## 📁 Estrutura do Projeto

```
rick-and-morty/
├── 📂 frontend/          # Aplicação React + Vite
│   ├── src/
│   ├── package.json
│   └── README.md         # Documentação do Frontend
│
├── 📂 backend/           # API Node.js + Express
│   ├── src/
│   │   ├── config/       # Configurações (DB, env, Swagger)
│   │   ├── controllers/  # Controllers HTTP
│   │   ├── docs/         # OpenAPI/Swagger docs
│   │   ├── routes/       # Definição de rotas
│   │   ├── services/     # Lógica de negócio + APIs externas
│   │   └── models/       # Mongoose schemas
│   ├── tests/
│   ├── package.json
│   └── README.md         # Documentação do Backend
│
├── 📄 docker-compose.yml      # Configuração Docker (produção)
├── 📄 docker-compose.dev.yml  # Configuração Docker (desenvolvimento)
├── 📄 package.json            # Scripts do monorepo
├── 📄 pnpm-workspace.yaml     # Configuração do workspace
└── 📄 README.md               # Este arquivo
```

---

## 📜 Scripts Disponíveis

Todos os scripts podem ser executados na raiz do projeto:

| Script | Descrição |
|--------|-----------|
| `pnpm install` | Instala todas as dependências |
| `pnpm dev` | Executa frontend e backend em modo desenvolvimento |
| `pnpm dev:frontend` | Executa apenas o frontend |
| `pnpm dev:backend` | Executa apenas o backend |
| `pnpm build` | Compila ambos os projetos para produção |
| `pnpm build:frontend` | Compila apenas o frontend |
| `pnpm build:backend` | Compila apenas o backend |
| `pnpm lint` | Executa o linter em todos os projetos |
| `pnpm test` | Executa os testes do backend |

---

## 🔍 Troubleshooting

### Erro: "OPENAI_API_KEY is required"

Este erro ocorria em versões antigas. **Já foi resolvido!** A chave agora é opcional.

Se você ainda vê esse erro:
- A funcionalidade de chat é opcional e não impede o projeto de rodar
- Para usar o chat, obtenha uma chave em: https://platform.openai.com/api-keys
- Configure no `backend/.env`: `OPENAI_API_KEY=sua-chave-aqui`

### Erro: "tsx is not recognized"

Certifique-se de que as dependências foram instaladas corretamente:

```bash
pnpm install
```

### Erro de conexão com MongoDB

Verifique se o MongoDB está rodando:

```bash
# Com Docker
docker-compose -f docker-compose.dev.yml up -d

# Verificar status
docker ps
```

### Porta já em uso

Verifique e mate processos nas portas 3000 ou 5173:

```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Linux/Mac
lsof -i :3000
kill -9 <PID>
```

---

## 📚 Documentação Adicional

- 📖 [Documentação do Frontend](./frontend/README.md)
- 📖 [Documentação do Backend](./backend/README.md)

---

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

<div align="center">
  <sub>Desenvolvido com 💚 por Wallyson Matheus</sub>
</div>
