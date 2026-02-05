# 🎨 Rick and Morty - Frontend

Aplicação web moderna para visualizar e explorar personagens da série Rick and Morty.

---

## 📋 Índice

- [Tecnologias](#-tecnologias)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Configuração](#-configuração)
- [Scripts](#-scripts)
- [Componentes](#-componentes)
- [Estilização](#-estilização)

---

## 🛠️ Tecnologias

| Tecnologia | Versão | Descrição |
|------------|--------|-----------|
| **React** | 19.2.0 | Biblioteca para construção de interfaces |
| **Vite** | 7.2.4 | Build tool e dev server |
| **TypeScript** | 5.9.3 | Tipagem estática |
| **TailwindCSS** | 4.1.18 | Framework CSS utilitário |
| **React Router DOM** | 7.13.0 | Roteamento SPA |
| **TanStack Query** | 5.90.20 | Gerenciamento de estado do servidor |
| **Axios** | 1.13.4 | Cliente HTTP |
| **React Hot Toast** | 2.6.0 | Notificações toast |

---

## 📁 Estrutura do Projeto

```
frontend/
├── 📂 public/              # Arquivos estáticos
│   └── favicon/
│
├── 📂 src/
│   ├── 📂 assets/          # Imagens e recursos
│   │
│   ├── 📂 components/      # Componentes reutilizáveis
│   │   ├── CharacterCard/
│   │   ├── CharacterList/
│   │   ├── Header/
│   │   ├── Loading/
│   │   └── ...
│   │
│   ├── 📂 hooks/           # Custom hooks
│   │   ├── useCharacters.ts
│   │   ├── useFavorites.ts
│   │   └── ...
│   │
│   ├── 📂 pages/           # Páginas da aplicação
│   │   ├── Home/
│   │   ├── CharacterDetail/
│   │   └── Favorites/
│   │
│   ├── 📂 services/        # Comunicação com API
│   │   └── api.ts
│   │
│   ├── 📂 types/           # Definições TypeScript
│   │   └── character.ts
│   │
│   ├── 📄 App.tsx          # Componente principal
│   ├── 📄 App.css          # Estilos globais do App
│   ├── 📄 main.tsx         # Entry point
│   └── 📄 index.css        # Estilos globais + Tailwind
│
├── 📄 index.html           # Template HTML
├── 📄 vite.config.ts       # Configuração do Vite
├── 📄 tsconfig.json        # Configuração TypeScript
├── 📄 tailwind.config.js   # Configuração Tailwind
├── 📄 package.json         # Dependências e scripts
└── 📄 README.md            # Este arquivo
```

---

## ⚙️ Configuração

### Variáveis de Ambiente

Crie um arquivo `.env` na pasta `frontend/` baseado no `.env.example`:

```env
VITE_API_URL=http://localhost:3000/api
```

### Instalação

```bash
# Na raiz do monorepo
pnpm install

# Ou apenas o frontend
cd frontend
pnpm install
```

---

## 📜 Scripts

Execute a partir da pasta `frontend/`:

| Script | Comando | Descrição |
|--------|---------|-----------|
| **Dev** | `pnpm dev` | Inicia o servidor de desenvolvimento |
| **Build** | `pnpm build` | Compila para produção |
| **Preview** | `pnpm preview` | Visualiza a build de produção |
| **Lint** | `pnpm lint` | Verifica erros de linting |

### Executando

```bash
# Desenvolvimento (porta 5173)
pnpm dev

# Build de produção
pnpm build

# Visualizar build
pnpm preview
```

---

## 🧩 Componentes

### Componentes Principais

| Componente | Descrição |
|------------|-----------|
| `CharacterCard` | Card individual de personagem |
| `CharacterList` | Lista de cards de personagens |
| `CharacterDetail` | Detalhes completos de um personagem |
| `Header` | Navegação principal |
| `Loading` | Indicadores de carregamento |
| `SearchBar` | Barra de pesquisa |
| `Pagination` | Controles de paginação |
| `FavoriteButton` | Botão para favoritar |

### Custom Hooks

| Hook | Descrição |
|------|-----------|
| `useCharacters` | Busca e gerencia lista de personagens |
| `useCharacter` | Busca detalhes de um personagem |
| `useFavorites` | Gerencia personagens favoritos |
| `useSearch` | Lógica de pesquisa e filtros |

---

## 🎨 Estilização

O projeto utiliza **TailwindCSS v4** para estilização.

### Arquivo Principal

Os estilos globais estão em `src/index.css`:

```css
@import "tailwindcss";

/* Variáveis customizadas */
:root {
  --color-primary: #...;
  --color-secondary: #...;
}

/* Estilos globais */
body {
  @apply bg-gradient-to-br from-gray-900 to-gray-800;
}
```

### Tema Customizado

O tema segue a paleta de cores da série Rick and Morty:

- **Verde Portal**: `#97ce4c`
- **Azul Espacial**: `#24325f`
- **Roxo Dimensional**: `#8b5cf6`

---

## 🔧 Configurações

### Vite (`vite.config.ts`)

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
    proxy: {
      '/api': 'http://localhost:3000'
    }
  }
})
```

### TypeScript (`tsconfig.json`)

- **Strict mode** habilitado
- Path aliases configurados
- Suporte a React JSX

---

## 🚀 Deploy

### Build de Produção

```bash
pnpm build
```

Os arquivos serão gerados em `dist/`.

### Docker

O frontend inclui um `Dockerfile` que:
1. Compila a aplicação
2. Serve via Nginx otimizado

```bash
docker build -t rick-frontend .
docker run -p 80:80 rick-frontend
```

---

## 📚 Recursos Adicionais

- [Documentação do React](https://react.dev/)
- [Documentação do Vite](https://vitejs.dev/)
- [Documentação do TailwindCSS](https://tailwindcss.com/)
- [TanStack Query Docs](https://tanstack.com/query/latest)

---

<div align="center">
  <sub>⬅️ <a href="../README.md">Voltar para o README principal</a></sub>
</div>
