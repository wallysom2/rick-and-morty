import express, { Application } from 'express';
import cors from 'cors';
import { env } from './config/env.js';

export function createApp(): Application {
  const app = express();

  // Middlewares
  app.use(cors({
    origin: env.CORS_ORIGIN,
    credentials: true,
  }));
  app.use(express.json());

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

  return app;
}
