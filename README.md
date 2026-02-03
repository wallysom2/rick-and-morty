# Rick and Morty Catalog

A full-stack application for exploring and favoriting characters from the Rick and Morty universe.

## Tech Stack

### Frontend
- **React 19** + **TypeScript**
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **TanStack Query** - Data fetching & caching
- **React Router** - Navigation
- **Axios** - HTTP client

### Backend
- **Node.js** + **Express** + **TypeScript**
- **MongoDB** + **Mongoose** - Database
- **Zod** - Validation
- **Pino** - Logging
- **Swagger** - API Documentation

### Infrastructure
- **Docker** + **Docker Compose**
- **Nginx** - Frontend server & reverse proxy

## Architecture

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

## Quick Start

### Prerequisites
- Docker & Docker Compose

### Run with Docker

```bash
# Clone the repository
git clone https://github.com/wallysom2/rick-and-morty.git
cd rick-and-morty

# Start all services
docker-compose up --build

# Access the application
# Frontend: http://localhost
# Backend API: http://localhost:3000/api
# Swagger Docs: http://localhost:3000/api/docs
```

### Run for Development

```bash
# Start MongoDB only
docker-compose -f docker-compose.dev.yml up -d

# Backend
cd backend
cp .env.example .env
pnpm install
pnpm run dev

# Frontend (new terminal)
cd frontend
pnpm install
pnpm run dev

# Access
# Frontend: http://localhost:5173
# Backend: http://localhost:3000
```

## API Endpoints

### Characters

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/characters` | List characters (paginated) |
| GET | `/api/characters/:id` | Get character by ID |

**Query Parameters:**
- `page` - Page number (default: 1)
- `name` - Filter by name
- `status` - Filter by status (Alive, Dead, unknown)
- `species` - Filter by species

### Favorites

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/favorites` | List favorites (paginated) |
| GET | `/api/favorites/ids` | Get all favorite IDs |
| POST | `/api/favorites` | Add favorite |
| DELETE | `/api/favorites/:characterId` | Remove favorite |

**POST /api/favorites body:**
```json
{
  "characterId": 1
}
```

### Health

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |

## Project Structure

```
rick-and-morty/
├── docker-compose.yml        # Production compose
├── docker-compose.dev.yml    # Development (MongoDB only)
├── .env.example              # Environment template
│
├── backend/
│   ├── Dockerfile
│   ├── src/
│   │   ├── config/           # Env validation, DB connection
│   │   ├── controllers/      # Request handlers
│   │   ├── middlewares/      # Error handling, logging
│   │   ├── models/           # Mongoose schemas
│   │   ├── repositories/     # Data access layer
│   │   ├── routes/           # API routes
│   │   ├── services/         # Business logic
│   │   ├── types/            # TypeScript types
│   │   └── utils/            # Cache, logger
│   └── tests/                # Integration tests
│
└── frontend/
    ├── Dockerfile
    ├── nginx.conf
    └── src/
        ├── components/       # UI components
        ├── hooks/            # Custom hooks
        ├── pages/            # Page components
        ├── services/         # API client
        └── types/            # TypeScript types
```

## Features

- **Character Listing** - Browse 800+ characters with pagination
- **Search** - Filter by name with debounce (300ms)
- **Status Filter** - Filter by Alive, Dead, or Unknown
- **Favorites** - Add/remove characters from favorites
- **Persistence** - Favorites stored in MongoDB
- **Responsive** - Works on mobile and desktop
- **Loading States** - Skeleton loading animations
- **Error Handling** - Friendly error messages with retry

## Technical Highlights

### Backend
- **Clean Architecture** - Routes → Controllers → Services → Repositories
- **Idempotent Favorites** - Adding same character twice won't duplicate
- **In-Memory Cache** - 60s TTL for Rick & Morty API responses
- **Structured Logging** - Request ID tracking with Pino
- **Input Validation** - Zod schemas for DTOs
- **API Documentation** - Swagger UI at `/api/docs`

### Frontend
- **React Query** - Automatic caching, background refetch
- **Prefetching** - Next page prefetched on hover
- **Optimistic Updates** - Instant UI feedback
- **Debounced Search** - 300ms delay to reduce API calls
- **Toast Notifications** - Feedback for user actions

## Environment Variables

### Backend

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `3000` |
| `MONGO_URL` | MongoDB connection string | `mongodb://localhost:27017/rickandmorty` |
| `CORS_ORIGIN` | Allowed CORS origin | `http://localhost:5173` |
| `LOG_LEVEL` | Log level (debug, info, warn, error) | `info` |
| `NODE_ENV` | Environment | `development` |

### Frontend

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API URL | `http://localhost:3000/api` |

## Running Tests

```bash
# Backend tests
cd backend
pnpm test

# With coverage
pnpm test:coverage
```

## Scripts

### Backend

| Script | Description |
|--------|-------------|
| `pnpm dev` | Start development server |
| `pnpm build` | Build for production |
| `pnpm start` | Start production server |
| `pnpm test` | Run tests |

### Frontend

| Script | Description |
|--------|-------------|
| `pnpm dev` | Start development server |
| `pnpm build` | Build for production |
| `pnpm preview` | Preview production build |

## Future Improvements

- [ ] User authentication
- [ ] Export favorites (JSON/CSV)
- [ ] Character details modal
- [ ] Episode & location pages
- [ ] Infinite scroll option
- [ ] PWA support
- [ ] E2E tests with Playwright
- [ ] CI/CD with GitHub Actions

## License

MIT

---

Built with Rick and Morty API
