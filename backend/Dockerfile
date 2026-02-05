# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy workspace config and lock file from root
COPY pnpm-workspace.yaml pnpm-lock.yaml ./

# Copy backend package.json
COPY backend/package.json ./backend/

# Install ALL dependencies (including devDependencies for build)
# Use the correct package name from package.json
RUN pnpm install --frozen-lockfile --filter=rick-and-morty-backend

# Copy backend source code
COPY backend/ ./backend/

# Build TypeScript
WORKDIR /app/backend
RUN pnpm run build

# Production stage
FROM node:20-alpine AS production

WORKDIR /app

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy workspace config and lock file from root
COPY pnpm-workspace.yaml pnpm-lock.yaml ./

# Copy backend package.json
COPY backend/package.json ./backend/

# Install production dependencies only
RUN pnpm install --frozen-lockfile --prod --filter=rick-and-morty-backend

# Copy built files from builder
COPY --from=builder /app/backend/dist ./backend/dist

# Copy docs (YAML files for Swagger)
COPY --from=builder /app/backend/src/docs ./backend/src/docs

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

USER nodejs

WORKDIR /app/backend

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/api/health || exit 1

# Start server
CMD ["node", "dist/index.js"]
