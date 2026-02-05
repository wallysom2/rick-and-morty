import express, { Application } from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import { env } from './config/env.js';
import { swaggerSpec } from './config/swagger.js';
import { apiRoutes } from './routes/index.js';
import { errorHandler, notFoundHandler } from './middlewares/errorHandler.js';
import { requestLogger } from './middlewares/requestLogger.js';

export function createApp(): Application {
  const app = express();

  // Core middlewares
  const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:4173', // Vite preview
    env.CORS_ORIGIN,
  ];

  app.use(cors({
    origin: (origin, callback) => {
      // allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      
      if (allowedOrigins.includes(origin) || origin.startsWith('http://localhost:')) {
        return callback(null, true);
      }
      
      // Allow the specific deployed origin if it matches env
      if (origin === env.CORS_ORIGIN) {
        return callback(null, true);
      }

      return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }));

  app.options('*', cors()); // Enable pre-flight requests

  app.use(express.json());
  app.use(requestLogger);

  // Swagger documentation
  app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'Rick and Morty API Docs',
  }));

  // Swagger JSON endpoint
  app.get('/api/docs.json', (_req, res) => {
    res.json(swaggerSpec);
  });

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
