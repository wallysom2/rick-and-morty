# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy workspace config and lock file from root
COPY pnpm-workspace.yaml pnpm-lock.yaml ./

# Copy frontend package.json
COPY frontend/package.json ./frontend/

# Install dependencies for frontend only
RUN pnpm install --frozen-lockfile --filter=frontend

# Copy frontend source code
COPY frontend/ ./frontend/

# Build for production
WORKDIR /app/frontend
RUN pnpm run build

# Production stage - serve with nginx
FROM nginx:alpine AS production

# Copy custom nginx config
COPY frontend/nginx.conf /etc/nginx/conf.d/default.conf

# Copy built files from builder
COPY --from=builder /app/frontend/dist /usr/share/nginx/html

# Expose port
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:80 || exit 1

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
