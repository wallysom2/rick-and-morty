import { createApp } from './app.js';
import { env } from './config/env.js';
import { connectDatabase } from './config/database.js';
import { logger } from './utils/logger.js';

async function bootstrap(): Promise<void> {
  // Connect to MongoDB
  await connectDatabase();

  // Create and start Express app
  const app = createApp();

  app.listen(env.PORT, () => {
    logger.info(`🚀 Server running on http://localhost:${env.PORT}`);
    logger.info(`📚 API docs available at http://localhost:${env.PORT}/api/docs`);
    logger.info(`❤️  Health check at http://localhost:${env.PORT}/api/health`);
    logger.info(`🌍 Environment: ${env.NODE_ENV}`);
  });
}

bootstrap().catch((error) => {
  logger.error('Failed to start server:', error);
  process.exit(1);
});
