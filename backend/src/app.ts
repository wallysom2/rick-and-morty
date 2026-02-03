import express, { Application } from 'express';
import cors from 'cors';
import { env } from './config/env.js';
import { apiRoutes } from './routes/index.js';
import { errorHandler, notFoundHandler } from './middlewares/errorHandler.js';
import { requestLogger } from './middlewares/requestLogger.js';

export function createApp(): Application {
  const app = express();

  // Core middlewares
  app.use(cors({
    origin: env.CORS_ORIGIN,
    credentials: true,
  }));
  app.use(express.json());
  app.use(requestLogger);

  // Health check endpoint
  app.get('/api/health', (_req, res) => {
    res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: env.NODE_ENV,
    });
  });

  // API info endpoint
  app.get('/api', (_req, res) => {
    res.json({
      message: 'Rick and Morty API',
      version: '1.0.0',
      endpoints: {
        health: '/api/health',
        characters: '/api/characters',
        favorites: '/api/favorites',
        docs: '/api/docs',
      },
    });
  });

  // API routes
  app.use('/api', apiRoutes);

  // Error handling
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
