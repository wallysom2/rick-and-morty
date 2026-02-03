import express, { Application } from 'express';
import cors from 'cors';

export function createApp(): Application {
  const app = express();

  // Middlewares
  app.use(cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    credentials: true,
  }));
  app.use(express.json());

  // Health check endpoint
  app.get('/api/health', (_req, res) => {
    res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    });
  });

  // Placeholder for routes (will be added in Fase 5)
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

  return app;
}
